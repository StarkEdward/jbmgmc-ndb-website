'use server'

import { db, GalleryImage, EventBlogItem } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { runAction } from '@/lib/action-utils'
import fs from 'fs'
import path from 'path'

/** Safely deletes a local /uploads/ file */
function deleteLocalFile(url: string | undefined | null) {
  if (!url || !url.startsWith('/uploads/')) return
  try {
    const filePath = path.join(process.cwd(), 'public', url)
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
  } catch (e) {
    console.error('Failed to delete file:', url, e)
  }
}

// ── Photo Gallery CRUD ─────────────────────────────────────────────────────────

/**
 * Adds a new photo to the campus/category gallery.
 * @param imageItem - The gallery image data without ID
 */
export async function addGalleryImageAction(imageItem: Omit<GalleryImage, 'id'>) {
  return runAction('addGalleryImage', async () => {
    const success = await db.addGalleryImage(imageItem)
    if (success) {
      revalidatePath('/admin/gallery')
      revalidatePath('/gallery')
      revalidatePath('/')
    }
    return { success }
  })
}

/**
 * Deletes a photo from the campus/category gallery.
 * @param id - The image ID to delete
 */
export async function deleteGalleryImageAction(id: number) {
  return runAction('deleteGalleryImage', async () => {
    const success = await db.deleteGalleryImage(id)
    if (success) {
      revalidatePath('/admin/gallery')
      revalidatePath('/gallery')
      revalidatePath('/')
    }
    return { success }
  })
}

// ── Event Albums CRUD ──────────────────────────────────────────────────────────

/**
 * Creates a new event photo album using the EventBlogItem structure.
 * @param album - Album data: title, date, content (description), photos[], optional youtube URL
 */
export async function addEventAlbumAction(album: Omit<EventBlogItem, 'id'>) {
  return runAction('addEventAlbum', async () => {
    const success = await db.addEventBlog(album)
    if (success) {
      revalidatePath('/admin/gallery')
      revalidatePath('/events')
      revalidatePath('/')
    }
    return { success }
  })
}

/**
 * Deletes an event photo album and all its associated uploaded photo files.
 * @param id - The album ID to delete
 * @param photoUrls - Array of photo URLs to clean up from disk
 */
export async function deleteEventAlbumAction(id: number, photoUrls: string[]) {
  return runAction('deleteEventAlbum', async () => {
    const success = await db.deleteEventBlog(id)
    if (success) {
      // Clean up all photo files from disk
      photoUrls.forEach(url => deleteLocalFile(url))
      revalidatePath('/admin/gallery')
      revalidatePath('/events')
      revalidatePath('/')
    }
    return { success }
  })
}

/**
 * Updates an existing event album's metadata (title, date, description, youtube).
 * Does NOT handle photo changes — photos are added/removed separately.
 * @param id - The album ID to update
 * @param album - Updated album data
 */
export async function updateEventAlbumAction(id: number, album: Omit<EventBlogItem, 'id'>) {
  return runAction('updateEventAlbum', async () => {
    const success = await db.updateEventBlog(id, album)
    if (success) {
      revalidatePath('/admin/gallery')
      revalidatePath('/events')
    }
    return { success }
  })
}
