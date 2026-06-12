'use server'

import { db, GalleryImage } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function addGalleryImageAction(imageItem: Omit<GalleryImage, 'id'>) {
  const success = db.addGalleryImage(imageItem)
  if (success) {
    revalidatePath('/admin/gallery')
    revalidatePath('/gallery')
    revalidatePath('/')
  }
  return { success }
}

export async function deleteGalleryImageAction(id: number) {
  const success = db.deleteGalleryImage(id)
  if (success) {
    revalidatePath('/admin/gallery')
    revalidatePath('/gallery')
    revalidatePath('/')
  }
  return { success }
}
