import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params
  const filename = resolvedParams.path.join('/')
  
  const uploadDir = process.env.DATABASE_PATH 
      ? path.join(process.env.DATABASE_PATH, 'uploads')
      : path.join(process.cwd(), 'public', 'uploads')
      
  const filePath = path.join(uploadDir, filename)
  
  // Security check to prevent directory traversal
  const relativePath = path.relative(uploadDir, filePath)
  if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
      return new NextResponse('Invalid path', { status: 400 })
  }
  
  let targetFilePath = filePath
  
  if (!fs.existsSync(targetFilePath)) {
      // Fallback to data-seed/uploads if EFS is not yet populated or mounted correctly
      const seedPath = path.join(process.cwd(), 'data-seed', 'uploads', filename)
      if (fs.existsSync(seedPath)) {
          targetFilePath = seedPath
      } else {
          return new NextResponse('Not found', { status: 404 })
      }
  }
  
  const fileBuffer = fs.readFileSync(targetFilePath)
  const ext = path.extname(targetFilePath).toLowerCase()
  
  // Basic mime types
  const mimeTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp',
      '.gif': 'image/gif',
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.xls': 'application/vnd.ms-excel',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '.txt': 'text/plain'
  }
  const contentType = mimeTypes[ext] || 'application/octet-stream'
  
  return new NextResponse(fileBuffer, {
      headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable'
      }
  })
}
