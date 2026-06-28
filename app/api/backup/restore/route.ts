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
  const tmpUploadPath = path.join(os.tmpdir(), `jbmgmc-upload-${timestamp}.tar.gz`)
  const extractDir = path.join(os.tmpdir(), `jbmgmc-extract-${timestamp}`)
  const failsafeBackupPath = path.join(os.tmpdir(), `jbmgmc-failsafe-${timestamp}.tar.gz`)
  const liveDbDir = process.env.DATABASE_PATH || path.join(process.cwd(), 'data')
  const liveUploadsDir = path.join(process.cwd(), 'public', 'uploads')
  const isDev = !process.env.DATABASE_PATH

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

    // 6. ATOMIC SWAP (Overwrite Live Data)
    console.log(`Restoring database files...`)
    fs.cpSync(extractedDataDir, liveDbDir, { recursive: true })
    
    if (fs.existsSync(extractedUploadsDir)) {
      const targetUploadsDir = isDev ? liveUploadsDir : path.join(liveDbDir, 'uploads')
      if (!fs.existsSync(targetUploadsDir)) fs.mkdirSync(targetUploadsDir, { recursive: true })
      fs.cpSync(extractedUploadsDir, targetUploadsDir, { recursive: true })
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
    return new NextResponse(JSON.stringify({ error: err.message || 'Restore failed due to a server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  } finally {
    // 8. Cleanup temporary extraction and upload files
    try {
      if (fs.existsSync(tmpUploadPath)) fs.unlinkSync(tmpUploadPath)
      if (fs.existsSync(extractDir)) fs.rmSync(extractDir, { recursive: true, force: true })
      if (fs.existsSync(failsafeBackupPath)) fs.unlinkSync(failsafeBackupPath) // Optional: Keep for manual recovery
    } catch (cleanupErr) {
      console.error('Failed to cleanup temp files:', cleanupErr)
    }
  }
}
