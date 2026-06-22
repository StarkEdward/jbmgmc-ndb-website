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
    
    // Create the tarball: change to dbDir and compress everything inside it
    // Using --no-xattrs to avoid warnings on some systems if needed, but standard tar is usually fine
    await execAsync(`tar -czf "${tmpPath}" -C "${dbDir}" .`)
    
    if (!fs.existsSync(tmpPath)) {
      throw new Error("Tarball creation failed")
    }

    const fileBuffer = fs.readFileSync(tmpPath)
    
    // Clean up temp file
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
