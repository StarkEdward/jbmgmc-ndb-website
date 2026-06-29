import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import fs from 'fs'
import path from 'path'
import os from 'os'
import { exec } from 'child_process'
import { promisify } from 'util'
import { verifyToken } from '@/lib/session'
import { db } from '@/lib/db'
import { pipeline } from 'stream/promises'
import { Readable } from 'stream'

const execAsync = promisify(exec)

async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const adminSessionToken = cookieStore.get('admin_session')?.value
  if (!adminSessionToken) return false
  const session = await verifyToken(adminSessionToken)
  return !!session
}

export const maxDuration = 120 // 2 minutes max for restore process

export async function POST(req: Request) {
  if (!(await isAuthenticated())) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  // Define unique paths for this restore operation
  const timestamp = Date.now()
  const liveDbDir = process.env.DATABASE_PATH || path.join(process.cwd(), 'data')
  const liveUploadsDir = path.join(process.cwd(), 'public', 'uploads')
  const isDev = !process.env.DATABASE_PATH
  
  const tmpUploadPath = path.join(os.tmpdir(), `jbmgmc-upload-${timestamp}.tar.gz`)
  // CRITICAL FIX: extractDir MUST be on the exact same partition/drive as liveDbDir 
  // otherwise fs.renameSync will fail with EXDEV (cross-device link) error.
  const extractDir = path.join(path.dirname(liveDbDir), `.jbmgmc-extract-${timestamp}`)
  const failsafeBackupPath = path.join(os.tmpdir(), `jbmgmc-failsafe-${timestamp}.tar.gz`)

  try {
    // 1. Parse FormData
    const formData = await req.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return new NextResponse('No file provided', { status: 400 })
    }

    if (!file.name.endsWith('.tar.gz')) {
      return new NextResponse('Invalid file format. Only .tar.gz is supported.', { status: 400 })
    }
    
    // Check limit (250MB)
    const MAX_SIZE = 250 * 1024 * 1024
    if (file.size > MAX_SIZE) {
      return new NextResponse('File size exceeds the 250MB limit.', { status: 400 })
    }

    // 2. Stream file to disk (Memory Safe)
    console.log(`Streaming uploaded backup to: ${tmpUploadPath}`)
    const fileStream = file.stream() as any // Web stream
    const nodeStream = Readable.fromWeb(fileStream)
    await pipeline(nodeStream, fs.createWriteStream(tmpUploadPath))

    // 3. Extract Backup to temp dir
    console.log(`Extracting backup to: ${extractDir}`)
    fs.mkdirSync(extractDir, { recursive: true })
    try {
      await execAsync(`tar -xzf "${tmpUploadPath}" -C "${extractDir}"`)
    } catch (err) {
      throw new Error('Failed to extract tarball. The file might be corrupted.')
    }

    // 4. Validate Backup Structure
    const extractedDataDir = path.join(extractDir, 'data')
    const extractedUploadsDir = path.join(extractDir, 'uploads')
    
    // Fix legacy archives that might have duplicated uploads inside data/
    const nestedUploads = path.join(extractedDataDir, 'uploads')
    if (fs.existsSync(nestedUploads)) {
      fs.rmSync(nestedUploads, { recursive: true, force: true })
    }
    
    if (!fs.existsSync(extractedDataDir) || !fs.existsSync(path.join(extractedDataDir, 'settings.json'))) {
      throw new Error('Invalid backup structure: Missing data/settings.json')
    }

    // 5. Pre-Restore Fail-safe Backup of LIVE Data
    console.log(`Creating fail-safe backup at: ${failsafeBackupPath}`)
    const stagingFailsafeDir = path.join(os.tmpdir(), `jbmgmc-staging-failsafe-${timestamp}`)
    fs.mkdirSync(stagingFailsafeDir, { recursive: true })
    try {
      if (fs.existsSync(liveDbDir)) {
        fs.cpSync(liveDbDir, path.join(stagingFailsafeDir, 'data'), { recursive: true })
      }
      
      const targetUploadsToBackup = isDev ? liveUploadsDir : path.join(liveDbDir, 'uploads')
      if (fs.existsSync(targetUploadsToBackup)) {
        fs.cpSync(targetUploadsToBackup, path.join(stagingFailsafeDir, 'uploads'), { recursive: true })
      }
      
      await execAsync(`tar -czf "${failsafeBackupPath}" -C "${stagingFailsafeDir}" .`)
    } finally {
      if (fs.existsSync(stagingFailsafeDir)) fs.rmSync(stagingFailsafeDir, { recursive: true, force: true })
    }

    // 6. TRUE ATOMIC SWAP (Zero Downtime Directory Swap)
    console.log(`Restoring database files atomically...`)
    
    // Create temporary names for the old live folders
    const oldLiveDbDir = `${liveDbDir}_old_${timestamp}`
    const oldLiveUploadsDir = `${liveUploadsDir}_old_${timestamp}`
    const targetUploadsDir = isDev ? liveUploadsDir : path.join(liveDbDir, 'uploads')
    
    try {
      // Step A: Move current live out of the way (1 millisecond)
      if (fs.existsSync(liveDbDir)) {
        fs.renameSync(liveDbDir, oldLiveDbDir)
      }
      if (fs.existsSync(targetUploadsDir) && isDev) {
        fs.renameSync(targetUploadsDir, oldLiveUploadsDir)
      }

      // Step B: Move extracted new data into live path (1 millisecond)
      fs.renameSync(extractedDataDir, liveDbDir)
      
      if (fs.existsSync(extractedUploadsDir)) {
        if (!fs.existsSync(targetUploadsDir)) {
          // ensure parent exists if not isDev
          const parent = path.dirname(targetUploadsDir)
          if (!fs.existsSync(parent)) fs.mkdirSync(parent, { recursive: true })
        }
        fs.renameSync(extractedUploadsDir, targetUploadsDir)
      }

    } catch (swapError) {
      console.error('Fatal error during atomic swap! Triggering Auto-Rollback...', swapError)
      
      // AUTO-ROLLBACK: If anything fails during the rename, put the old folders back immediately
      if (fs.existsSync(oldLiveDbDir)) {
        if (fs.existsSync(liveDbDir)) fs.rmSync(liveDbDir, { recursive: true, force: true })
        fs.renameSync(oldLiveDbDir, liveDbDir)
      }
      if (fs.existsSync(oldLiveUploadsDir) && isDev) {
        if (fs.existsSync(targetUploadsDir)) fs.rmSync(targetUploadsDir, { recursive: true, force: true })
        fs.renameSync(oldLiveUploadsDir, targetUploadsDir)
      }
      throw new Error('Restore failed during folder swap. System safely auto-rolled back to previous state.')
    }

    // 7. Memory Cache Reload
    console.log(`Reloading Next.js DB cache...`)
    db.reload()

    return new NextResponse(JSON.stringify({ success: true, message: 'Restore completed successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (err: any) {
    console.error('Restore failed:', err)
    
    // 8. Auto-Rollback from Fail-safe tarball (Extreme emergency case)
    if (fs.existsSync(failsafeBackupPath) && fs.existsSync(liveDbDir) === false) {
       console.log('Live DB is missing! Extracting failsafe backup to restore state...')
       try {
         await execAsync(`tar -xzf "${failsafeBackupPath}" -C "${path.dirname(liveDbDir)}"`)
       } catch (e) {
         console.error('Even failsafe extraction failed!', e)
       }
    }

    return new NextResponse(JSON.stringify({ error: err.message || 'Restore failed due to a server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  } finally {
    // 9. Cleanup temporary extraction and upload files
    try {
      if (fs.existsSync(tmpUploadPath)) fs.unlinkSync(tmpUploadPath)
      if (fs.existsSync(extractDir)) fs.rmSync(extractDir, { recursive: true, force: true })
      if (fs.existsSync(failsafeBackupPath)) fs.unlinkSync(failsafeBackupPath)
      
      // Cleanup the renamed old live folders if swap was successful
      const oldLiveDbDir = `${liveDbDir}_old_${timestamp}`
      const oldLiveUploadsDir = `${liveUploadsDir}_old_${timestamp}`
      if (fs.existsSync(oldLiveDbDir)) fs.rmSync(oldLiveDbDir, { recursive: true, force: true })
      if (fs.existsSync(oldLiveUploadsDir)) fs.rmSync(oldLiveUploadsDir, { recursive: true, force: true })
    } catch (cleanupErr) {
      console.error('Failed to cleanup temp files:', cleanupErr)
    }
  }
}
