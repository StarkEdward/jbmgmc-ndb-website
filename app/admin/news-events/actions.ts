'use server'

import { db, NewsItem, EventItem, TenderItem } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { runAction } from '@/lib/action-utils'

export async function addNewsAction(newsItem: NewsItem) {
  return runAction('addNews', async () => {
    const success = await db.addNews(newsItem)
    if (success) {
      revalidatePath('/admin/news-events')
      revalidatePath('/')
    }
    return { success }
  })
}

export async function deleteNewsAction(title: string) {
  return runAction('deleteNews', async () => {
    const success = await db.deleteNews(title)
    if (success) {
      revalidatePath('/admin/news-events')
      revalidatePath('/')
    }
    return { success }
  })
}

export async function addEventAction(event: Omit<EventItem, 'id'>) {
  return runAction('addEvent', async () => {
    const success = await db.addEvent(event)
    if (success) {
      revalidatePath('/admin/news-events')
      revalidatePath('/events')
      revalidatePath('/')
    }
    return { success }
  })
}

export async function deleteEventAction(id: number) {
  return runAction('deleteEvent', async () => {
    const success = await db.deleteEvent(id)
    if (success) {
      revalidatePath('/admin/news-events')
      revalidatePath('/events')
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
