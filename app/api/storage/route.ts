import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import fs from 'fs'
import path from 'path'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/session'

/**
 * Verifies the admin_session cookie and returns whether the request is authenticated.
 */
async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const adminSessionToken = cookieStore.get('admin_session')?.value
  if (!adminSessionToken) return false
  const session = await verifyToken(adminSessionToken)
  return !!session
}

/**
 * Returns the absolute path to the uploads directory.
 * Uses DATABASE_PATH env variable (production) or falls back to public/uploads (dev).
 */
function getUploadDir() {
  return process.env.DATABASE_PATH
    ? path.resolve(process.env.DATABASE_PATH, 'uploads')
    : path.join(process.cwd(), 'public', 'uploads')
}

/**
 * Scans the entire database JSON string and finds every place a given filename is used.
 * Returns a human-readable label of where the file appears (e.g. "Authorities", "Gallery").
 *
 * @param filename - The bare filename (e.g. "my_photo_abc123.jpg")
 * @param rawData  - The full DatabaseSchema object
 * @returns Array of usage context labels (deduplicated)
 */
function getUsageContext(filename: string, rawData: Record<string, any>): string[] {
  const contexts = new Set<string>()
  const uploadPath = `/uploads/${filename}`

  // Helper: check if a string value contains our upload path
  const contains = (val: unknown): boolean =>
    typeof val === 'string' && val.includes(uploadPath)

  // Departments & Doctors
  if (Array.isArray(rawData.departments)) {
    for (const dept of rawData.departments) {
      const deptHit = contains(dept.image) || contains(dept.bannerImage)
      if (deptHit) contexts.add('Departments')
      if (Array.isArray(dept.doctors)) {
        for (const doc of dept.doctors) {
          if (contains(doc.image) || contains(doc.photo)) {
            contexts.add('Doctors / Staff')
          }
        }
      }
    }
  }

  // Authorities
  if (Array.isArray(rawData.authorities)) {
    for (const a of rawData.authorities) {
      if (contains(a.image)) contexts.add('Authorities')
    }
  }

  // Gallery
  if (Array.isArray(rawData.galleryImages)) {
    for (const g of rawData.galleryImages) {
      if (contains(g.src) || contains(g.url) || contains(g.image)) contexts.add('Gallery')
    }
  }

  // Hero Slides
  if (Array.isArray(rawData.heroSlides)) {
    for (const s of rawData.heroSlides) {
      if (contains(s.image) || contains(s.src) || contains(s.url)) contexts.add('Hero Slides')
    }
  }

  // News & Events
  if (Array.isArray(rawData.newsEvents)) {
    for (const n of rawData.newsEvents) {
      if (contains(n.image) || contains(n.thumbnail) || contains(n.attachment)) {
        contexts.add('News & Events')
      }
    }
  }

  // Tenders (PDF attachments)
  if (Array.isArray(rawData.tenders)) {
    for (const t of rawData.tenders) {
      if (contains(t.pdfUrl) || contains(t.attachment) || contains(t.url)) {
        contexts.add('Tenders')
      }
    }
  }

  // Downloads
  if (Array.isArray(rawData.downloads)) {
    for (const d of rawData.downloads) {
      if (contains(d.url) || contains(d.fileUrl)) contexts.add('Downloads')
    }
  }

  // Dynamic Pages (page builder content)
  if (Array.isArray(rawData.dynamicPages)) {
    for (const pg of rawData.dynamicPages) {
      const pgStr = JSON.stringify(pg)
      if (pgStr.includes(uploadPath)) contexts.add('Dynamic Pages')
    }
  }

  // Dean Info
  if (rawData.deanInfo) {
    const deanStr = JSON.stringify(rawData.deanInfo)
    if (deanStr.includes(uploadPath)) contexts.add('Dean Info')
  }

  // Courses
  if (Array.isArray(rawData.courses)) {
    for (const c of rawData.courses) {
      const cStr = JSON.stringify(c)
      if (cStr.includes(uploadPath)) contexts.add('Courses')
    }
  }

  // About / Milestones
  if (rawData.aboutSettings) {
    const aStr = JSON.stringify(rawData.aboutSettings)
    if (aStr.includes(uploadPath)) contexts.add('About / Milestones')
  }

  // Committees
  if (Array.isArray(rawData.committees)) {
    for (const cm of rawData.committees) {
      const cmStr = JSON.stringify(cm)
      if (cmStr.includes(uploadPath)) contexts.add('Committees')
    }
  }

  // Fallback: if the file is referenced but we couldn't pinpoint where
  if (contexts.size === 0) {
    // Re-check using brute-force on full DB string
    const fullStr = JSON.stringify(rawData)
    if (fullStr.includes(uploadPath)) {
      contexts.add('Site Content')
    }
  }

  return Array.from(contexts)
}

/**
 * GET /api/storage
 * Returns all files on disk with their status (in-use | orphaned | force-unlocked),
 * size, category, and usage context labels.
 */
export async function GET(request: Request) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const uploadDir = getUploadDir()
    if (!fs.existsSync(uploadDir)) {
      return NextResponse.json({ files: [] })
    }

    const filesOnDisk = fs.readdirSync(uploadDir).filter(f => {
      // Skip hidden files and directories
      return !f.startsWith('.') && fs.statSync(path.join(uploadDir, f)).isFile()
    })

    // Get entire DB data (using new public method)
    const rawData = db.getRawDataForStorage() as Record<string, any>
    const dbString = JSON.stringify(rawData)

    // Build in-use set from regex scan
    const urlRegex = /\/uploads\/([a-zA-Z0-9._-]+)/g
    const inUseSet = new Set<string>()
    let match
    while ((match = urlRegex.exec(dbString)) !== null) {
      inUseSet.add(match[1])
    }

    // Get force-unlocked overrides
    const overrides = db.getStorageOverrides()
    const forcedOrphansSet = new Set<string>(overrides.forcedOrphans || [])

    const files = filesOnDisk.map(filename => {
      const filePath = path.join(uploadDir, filename)
      const stats = fs.statSync(filePath)

      const ext = path.extname(filename).toLowerCase()
      let category = 'Other'
      if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.avif'].includes(ext)) {
        category = 'Image'
      } else if (ext === '.pdf') {
        category = 'PDF'
      } else if (['.doc', '.docx', '.txt', '.xls', '.xlsx', '.ppt', '.pptx'].includes(ext)) {
        category = 'Document'
      }

      const isInUse = inUseSet.has(filename)
      const isForcedOrphan = forcedOrphansSet.has(filename)

      // Status logic:
      // - force-unlocked: was in-use but admin manually unlocked (can now be deleted)
      // - in-use: referenced in DB, protected from deletion
      // - orphaned: not referenced anywhere
      let status: 'in-use' | 'orphaned' | 'force-unlocked'
      if (isInUse && isForcedOrphan) {
        status = 'force-unlocked'
      } else if (isInUse) {
        status = 'in-use'
      } else {
        status = 'orphaned'
      }

      const usedIn = (status === 'in-use' || status === 'force-unlocked')
        ? getUsageContext(filename, rawData)
        : []

      return {
        name: filename,
        url: `/uploads/${filename}`,
        sizeBytes: stats.size,
        createdAt: stats.mtime.toISOString(),
        category,
        status,
        usedIn
      }
    })

    // Sort: Orphaned first, then force-unlocked, then in-use — then by date desc within each group
    const statusOrder = { orphaned: 0, 'force-unlocked': 1, 'in-use': 2 }
    files.sort((a, b) => {
      const statusDiff = statusOrder[a.status] - statusOrder[b.status]
      if (statusDiff !== 0) return statusDiff
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    return NextResponse.json({ files })
  } catch (error) {
    console.error('Failed to fetch storage files:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

/**
 * PATCH /api/storage
 * Toggle the "force-unlocked" override for one or more files.
 * Body: { files: string[], action: 'unlock' | 'relock' }
 * - unlock: adds files to forcedOrphans list (allows deletion even if in-use)
 * - relock: removes files from forcedOrphans list (restores protection)
 */
export async function PATCH(request: Request) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { files, action } = await request.json()
    if (!Array.isArray(files) || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 })
    }
    if (action !== 'unlock' && action !== 'relock') {
      return NextResponse.json({ error: 'Invalid action. Use "unlock" or "relock".' }, { status: 400 })
    }

    const overrides = db.getStorageOverrides()
    const forcedOrphansSet = new Set<string>(overrides.forcedOrphans || [])

    for (const filename of files) {
      if (typeof filename !== 'string' || filename.includes('..') || filename.includes('/')) continue
      if (action === 'unlock') {
        forcedOrphansSet.add(filename)
      } else {
        forcedOrphansSet.delete(filename)
      }
    }

    await db.setStorageOverrides({ forcedOrphans: Array.from(forcedOrphansSet) })

    return NextResponse.json({ success: true, action, count: files.length })
  } catch (error) {
    console.error('Failed to update storage overrides:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

/**
 * DELETE /api/storage
 * Permanently deletes files from disk. Only works on orphaned or force-unlocked files.
 * Body: { files: string[] }
 */
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
    const overrides = db.getStorageOverrides()
    const forcedOrphansSet = new Set<string>(overrides.forcedOrphans || [])

    // Build in-use set to prevent deletion of protected files
    const rawData = db.getRawDataForStorage() as Record<string, any>
    const dbString = JSON.stringify(rawData)
    const urlRegex = /\/uploads\/([a-zA-Z0-9._-]+)/g
    const inUseSet = new Set<string>()
    let match
    while ((match = urlRegex.exec(dbString)) !== null) {
      inUseSet.add(match[1])
    }

    let deletedCount = 0
    const skipped: string[] = []

    for (const filename of files) {
      // Prevent directory traversal attacks
      if (typeof filename !== 'string' || filename.includes('..') || filename.includes('/')) continue

      // Block deletion of in-use files unless they have been force-unlocked
      const isProtected = inUseSet.has(filename) && !forcedOrphansSet.has(filename)
      if (isProtected) {
        skipped.push(filename)
        continue
      }

      const filePath = path.join(uploadDir, filename)
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
        deletedCount++
        // Auto-clean from overrides list if it was force-unlocked
        forcedOrphansSet.delete(filename)
      }
    }

    // Persist cleaned overrides
    if (deletedCount > 0) {
      await db.setStorageOverrides({ forcedOrphans: Array.from(forcedOrphansSet) })
    }

    return NextResponse.json({ success: true, deletedCount, skipped })
  } catch (error) {
    console.error('Failed to delete storage files:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
