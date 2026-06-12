import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Sanitize and create a unique filename
    const cleanFileName = file.name
      .replace(/[^a-zA-Z0-9.-]/g, '_') // replace special characters
      .replace(/_{2,}/g, '_')          // deduplicate underscores
    const filename = `${Date.now()}_${cleanFileName}`
    
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    const filePath = path.join(uploadDir, filename)
    fs.writeFileSync(filePath, new Uint8Array(buffer))

    return NextResponse.json({
      success: true,
      url: `/uploads/${filename}`
    })
  } catch (error: any) {
    console.error('File upload error:', error)
    return NextResponse.json({ error: error.message || 'File upload failed' }, { status: 500 })
  }
}
export const dynamic = 'force-dynamic'
