'use server'

import { db, NewsEventItem, TenderItem } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { runAction } from '@/lib/action-utils'

export async function addNewsEventAction(item: Omit<NewsEventItem, 'id'>) {
  return runAction('addNewsEvent', async () => {
    const success = await db.addNewsEvent(item)
    if (success) {
      revalidatePath('/admin/news-events')
      revalidatePath('/news-events')
      revalidatePath('/')
    }
    return { success }
  })
}

export async function deleteNewsEventAction(id: number) {
  return runAction('deleteNewsEvent', async () => {
    const success = await db.deleteNewsEvent(id)
    if (success) {
      revalidatePath('/admin/news-events')
      revalidatePath('/news-events')
      revalidatePath('/')
    }
    return { success }
  })
}

export async function updateNewsEventAction(id: number, item: Omit<NewsEventItem, 'id'>) {
  return runAction('updateNewsEvent', async () => {
    const success = await db.updateNewsEvent(id, item)
    if (success) {
      revalidatePath('/admin/news-events')
      revalidatePath('/news-events')
      revalidatePath('/')
    }
    return { success }
  })
}

export async function addTenderAction(tender: Omit<TenderItem, 'id'>) {
  return runAction('addTender', async () => {
    const success = await db.addTender(tender)
    if (success) {
      revalidatePath('/admin/news-events')
      revalidatePath('/tender')
      revalidatePath('/')
    }
    return { success }
  })
}

export async function deleteTenderAction(id: number) {
  return runAction('deleteTender', async () => {
    const success = await db.deleteTender(id)
    if (success) {
      revalidatePath('/admin/news-events')
      revalidatePath('/tender')
      revalidatePath('/')
    }
    return { success }
  })
}

export async function updateTenderAction(id: number, tender: Omit<TenderItem, 'id'>) {
  return runAction('updateTender', async () => {
    const success = await db.updateTender(id, tender)
    if (success) {
      revalidatePath('/admin/news-events')
      revalidatePath('/tender')
      revalidatePath('/')
    }
    return { success }
  })
}

export async function toggleTenderVisibilityAction(id: number) {
  return runAction('toggleTenderVisibility', async () => {
    const success = await db.toggleTenderVisibility(id)
    if (success) {
      revalidatePath('/admin/news-events')
      revalidatePath('/tender')
      revalidatePath('/')
    }
    return { success }
  })
}
