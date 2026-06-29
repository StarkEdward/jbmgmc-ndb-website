import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import fs from 'fs'
import path from 'path'
import os from 'os'
import { exec } from 'child_process'
import { promisify } from 'util'
import { verifyToken } from '@/lib/session'

const execAsync = promisify(exec)

async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const adminSessionToken = cookieStore.get('admin_session')?.value
  if (!adminSessionToken) return false
  const session = await verifyToken(adminSessionToken)
  return !!session
}

export async function GET() {
  if (!(await isAuthenticated())) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const dbDir = process.env.DATABASE_PATH || path.join(process.cwd(), 'data')
    if (!fs.existsSync(dbDir)) {
      return new NextResponse('Database directory not found', { status: 404 })
    }

    const tmpFilename = `jbmgmc-backup-${Date.now()}.tar.gz`
    const tmpPath = path.join(os.tmpdir(), tmpFilename)
    
    // Create a staging directory to hold both database and images
    const stagingDir = path.join(os.tmpdir(), `jbmgmc-staging-${Date.now()}`)
    fs.mkdirSync(stagingDir, { recursive: true })

    try {
      // 1. Copy database JSON files
      const backupDataDir = path.join(stagingDir, 'data')
      fs.mkdirSync(backupDataDir, { recursive: true })
      const files = fs.readdirSync(dbDir)
      for (const file of files) {
        if (file.endsWith('.json')) {
          fs.copyFileSync(path.join(dbDir, file), path.join(backupDataDir, file))
        }
      }

      // 2. Copy uploaded images (if they exist)
      const uploadsDir = process.env.DATABASE_PATH 
        ? path.join(process.env.DATABASE_PATH, 'uploads')
        : path.join(process.cwd(), 'public', 'uploads')
        
      if (fs.existsSync(uploadsDir)) {
        const backupUploadsDir = path.join(stagingDir, 'uploads')
        fs.cpSync(uploadsDir, backupUploadsDir, { recursive: true })
      }

      // Create the tarball from the staging directory
      await execAsync(`tar -czf "${tmpPath}" -C "${stagingDir}" .`)
    } finally {
      // Clean up the staging directory immediately
      if (fs.existsSync(stagingDir)) {
        fs.rmSync(stagingDir, { recursive: true, force: true })
      }
    }
    
    if (!fs.existsSync(tmpPath)) {
      throw new Error("Tarball creation failed")
    }

    const fileBuffer = fs.readFileSync(tmpPath)
    
    // Clean up tarball file
    fs.unlinkSync(tmpPath)

    const dateStr = new Date().toISOString().split('T')[0]
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/gzip',
        'Content-Disposition': `attachment; filename="jbmgmc-backup-${dateStr}.tar.gz"`
      }
    })
  } catch (err: any) {
    console.error('Backup generation failed:', err)
    return new NextResponse('Backup generation failed', { status: 500 })
  }
}
export const dynamic = 'force-dynamic'
