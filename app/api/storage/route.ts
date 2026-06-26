import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import fs from 'fs'
import path from 'path'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/session'

async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const adminSessionToken = cookieStore.get('admin_session')?.value
  if (!adminSessionToken) return false
  const session = await verifyToken(adminSessionToken)
  return !!session
}

function getUploadDir() {
  return process.env.DATABASE_PATH 
    ? path.join(process.env.DATABASE_PATH, 'uploads')
    : path.join(process.cwd(), 'public', 'uploads')
}

export async function GET(request: Request) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const uploadDir = getUploadDir()
    if (!fs.existsSync(uploadDir)) {
      return NextResponse.json({ files: [] })
    }

    const filesOnDisk = fs.readdirSync(uploadDir)
    
    // Convert entire DB to string to find any mention of upload URLs
    const rawData = db.getRawData()
    const dbString = JSON.stringify(rawData)
    
    // Regex to find all occurrences of /uploads/filename.ext
    const urlRegex = /\/uploads\/([a-zA-Z0-9._-]+)/g
    const inUseSet = new Set<string>()
    let match
    while ((match = urlRegex.exec(dbString)) !== null) {
      inUseSet.add(match[1]) // match[1] is the filename
    }

    const files = filesOnDisk.map(filename => {
      const filePath = path.join(uploadDir, filename)
      const stats = fs.statSync(filePath)
      
      const ext = path.extname(filename).toLowerCase()
      let category = 'Other'
      if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext)) {
        category = 'Image'
      } else if (ext === '.pdf') {
        category = 'PDF'
      } else if (['.doc', '.docx', '.txt', '.xls', '.xlsx', '.ppt', '.pptx'].includes(ext)) {
        category = 'Document'
      }

      return {
        name: filename,
        url: `/uploads/${filename}`,
        sizeBytes: stats.size,
        createdAt: stats.mtime.toISOString(), // Use mtime for when it was written
        category,
        status: inUseSet.has(filename) ? 'in-use' : 'orphaned'
      }
    })

    // Sort: Orphaned first, then by date (newest first)
    files.sort((a, b) => {
      if (a.status !== b.status) {
        return a.status === 'orphaned' ? -1 : 1
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    return NextResponse.json({ files })
  } catch (error) {
    console.error('Failed to fetch storage files:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { files } = await request.json()
    if (!Array.isArray(files) || files.length === 0) {
      return NextResponse.json({ error: 'No files provided for deletion' }, { status: 400 })
    }

    const uploadDir = getUploadDir()
    let deletedCount = 0

    for (const filename of files) {
      // Prevent directory traversal attacks
      if (typeof filename !== 'string' || filename.includes('..') || filename.includes('/')) {
        continue
      }
      
      const filePath = path.join(uploadDir, filename)
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
        deletedCount++
      }
    }

    return NextResponse.json({ success: true, deletedCount })
  } catch (error) {
    console.error('Failed to delete storage files:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
