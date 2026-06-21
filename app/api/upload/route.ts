import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { checkRateLimit, recordAttempt } from '@/lib/rate-limiter'
import { verifyToken } from '@/lib/session'
import { getClientIp } from '@/lib/ip'

// Magic byte signatures for allowed file types
const MAGIC_BYTES: Record<string, number[][]> = {
  'image/jpeg': [[0xFF, 0xD8, 0xFF]],
  'image/png':  [[0x89, 0x50, 0x4E, 0x47]],
  'image/gif':  [[0x47, 0x49, 0x46, 0x38]],
  'image/webp': [[0x52, 0x49, 0x46, 0x46]],  // RIFF
  'application/pdf': [[0x25, 0x50, 0x44, 0x46]], // %PDF
  // Office formats are ZIP containers, starting with PK (0x50, 0x4B, 0x03, 0x04)
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [[0x50, 0x4B, 0x03, 0x04]],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [[0x50, 0x4B, 0x03, 0x04]],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': [[0x50, 0x4B, 0x03, 0x04]],
}

function checkMagicBytes(buffer: Buffer, mimeType: string): boolean {
  const signatures = MAGIC_BYTES[mimeType]
  if (!signatures) return true // allow other formats without magic byte checks (e.g. text/plain)
  return signatures.some(sig => 
    buffer.length >= sig.length && sig.every((byte, i) => buffer[i] === byte)
  )
}

async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const adminSessionToken = cookieStore.get('admin_session')?.value
  if (!adminSessionToken) return false
  const session = await verifyToken(adminSessionToken)
  return !!session
}

export async function POST(request: Request) {
  try {
    // Extract client IP address safely
    const ip = await getClientIp()

    // Rate limiting check
    const limitCheck = checkRateLimit(ip, 'upload')
    if (!limitCheck.allowed) {
      const minutesLeft = Math.ceil(limitCheck.timeLeftSeconds / 60)
      return NextResponse.json({ error: `Too many upload attempts. Locked out for ${minutesLeft} minutes.` }, { status: 429 })
    }

    // Record the upload attempt
    const attempt = recordAttempt(ip, 'upload', true)
    if (attempt.blocked) {
      const minutesLeft = Math.ceil(attempt.timeLeftSeconds / 60)
      return NextResponse.json({ error: `Upload limit exceeded. You have been locked out for ${minutesLeft} minutes.` }, { status: 429 })
    }

    // 1. Enforce authentication
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // NEW (VULN-10): Enforce strict Origin / Referer checks to prevent CSRF.
    // A malicious site could submit a form to this endpoint (using the admin's session).
    // The browser prevents cross-origin sites from setting/spoofing Origin or Referer.
    const origin = request.headers.get('origin')
    const referer = request.headers.get('referer')
    const host = request.headers.get('host') || 'localhost:3000'

    const getHost = (urlStr: string) => {
      try { return new URL(urlStr).host } catch { return null }
    }

    const originHost = origin ? getHost(origin) : null
    const refererHost = referer ? getHost(referer) : null

    if (!originHost && !refererHost) {
      return NextResponse.json({ error: 'CSRF blocked: Missing Origin and Referer headers' }, { status: 403 })
    }
    if (originHost && originHost !== host) {
      return NextResponse.json({ error: 'CSRF blocked: Invalid Origin mismatch' }, { status: 403 })
    }
    if (refererHost && refererHost !== host) {
      return NextResponse.json({ error: 'CSRF blocked: Invalid Referer mismatch' }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // 2. Enforce file size limit (e.g., 10 MB max)
    const MAX_SIZE = 10 * 1024 * 1024 // 10 MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File size exceeds the 10 MB limit' }, { status: 400 })
    }

    // 3. Validate file extension (extension whitelisting)
    const ext = path.extname(file.name).toLowerCase()
    const allowedExtensions = [
      '.jpg', '.jpeg', '.png', '.gif', '.webp',
      '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt'
    ]
    if (!allowedExtensions.includes(ext)) {
      return NextResponse.json({ error: 'Unsupported file extension' }, { status: 400 })
    }

    // 4. Validate MIME type
    const allowedMimeTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain'
    ]
    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Unsupported file type (MIME type mismatch)' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Verify magic bytes matching the declared MIME type to prevent type spoofing
    if (!checkMagicBytes(buffer, file.type)) {
      return NextResponse.json({ error: 'File content does not match its declared type' }, { status: 400 })
    }

    // NEW (VULN-18): Randomise upload filenames to prevent enumeration / guessing attacks.
    // Previously, an attacker could guess the timestamp and original filename.
    // Now it uses a UUID v4 (122 bits of entropy). The original filename is discarded
    // completely, as it might contain sensitive information.
    const randomHex = crypto.randomUUID().replace(/-/g, '')
    const filename = `${randomHex}${ext}`
    
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
    return NextResponse.json({ error: 'File upload failed' }, { status: 500 })
  }
}
export const dynamic = 'force-dynamic'
