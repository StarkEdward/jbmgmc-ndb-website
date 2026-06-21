'use server'

import { db, GalleryImage } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { runAction } from '@/lib/action-utils'

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
