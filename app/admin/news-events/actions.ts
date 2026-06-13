'use server'

import { db, NewsItem, EventItem, TenderItem } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function addNewsAction(newsItem: NewsItem) {
  const success = db.addNews(newsItem)
  if (success) {
    revalidatePath('/admin/news-events')
    revalidatePath('/')
  }
  return { success }
}

export async function deleteNewsAction(title: string) {
  const success = db.deleteNews(title)
  if (success) {
    revalidatePath('/admin/news-events')
    revalidatePath('/')
  }
  return { success }
}

export async function addEventAction(event: Omit<EventItem, 'id'>) {
  const success = db.addEvent(event)
  if (success) {
    revalidatePath('/admin/news-events')
    revalidatePath('/events')
    revalidatePath('/')
  }
  return { success }
}

export async function deleteEventAction(id: number) {
  const success = db.deleteEvent(id)
  if (success) {
    revalidatePath('/admin/news-events')
    revalidatePath('/events')
    revalidatePath('/')
  }
  return { success }
}

export async function addTenderAction(tender: Omit<TenderItem, 'id'>) {
  const success = db.addTender(tender)
  if (success) {
    revalidatePath('/admin/news-events')
    revalidatePath('/tender')
    revalidatePath('/')
  }
  return { success }
}

export async function deleteTenderAction(id: number) {
  const success = db.deleteTender(id)
  if (success) {
    revalidatePath('/admin/news-events')
    revalidatePath('/tender')
    revalidatePath('/')
  }
  return { success }
}
