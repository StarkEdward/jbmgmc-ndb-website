'use server'

import { db, NewsEventItem, TenderItem } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { runAction } from '@/lib/action-utils'
import fs from 'fs'
import path from 'path'
import * as cheerio from 'cheerio'

function extractImageUrlsFromHtml(html?: string): string[] {
  if (!html) return []
  const $ = cheerio.load(html)
  const urls: string[] = []
  $('img').each((_, el) => {
    const src = $(el).attr('src')
    if (src && src.startsWith('/uploads/')) {
      urls.push(src)
    }
  })
  return urls
}

function deleteLocalFile(url: string | undefined | null) {
  if (!url) return;
  if (!url.startsWith('/uploads/')) return;
  try {
    const filePath = path.join(process.cwd(), 'public', url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (e) {
    console.error('Failed to delete file:', url, e);
  }
}

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
    const item = db.getNewsEventById(id)
    const success = await db.deleteNewsEvent(id)
    if (success) {
      if (item) {
        deleteLocalFile(item.pdfUrl)
        deleteLocalFile(item.imageUrl)
        if (item.imageUrls) {
          item.imageUrls.forEach(url => deleteLocalFile(url))
        }
        if (item.fullArticle) {
          const inlineImages = extractImageUrlsFromHtml(item.fullArticle)
          inlineImages.forEach(url => deleteLocalFile(url))
        }
      }
      revalidatePath('/admin/news-events')
      revalidatePath('/news-events')
      revalidatePath('/')
    }
    return { success }
  })
}

export async function updateNewsEventAction(id: number, item: Omit<NewsEventItem, 'id'>) {
  return runAction('updateNewsEvent', async () => {
    const existingItem = db.getNewsEventById(id)
    const success = await db.updateNewsEvent(id, item)
    if (success && existingItem) {
      if (existingItem.pdfUrl && existingItem.pdfUrl !== item.pdfUrl) {
        deleteLocalFile(existingItem.pdfUrl)
      }
      const oldImages = existingItem.imageUrls || (existingItem.imageUrl ? [existingItem.imageUrl] : [])
      const newImages = item.imageUrls || (item.imageUrl ? [item.imageUrl] : [])
      oldImages.forEach(url => {
        if (!newImages.includes(url)) {
          deleteLocalFile(url)
        }
      })
      
      const oldInlineImages = extractImageUrlsFromHtml(existingItem.fullArticle)
      const newInlineImages = extractImageUrlsFromHtml(item.fullArticle)
      oldInlineImages.forEach(url => {
        if (!newInlineImages.includes(url)) {
          deleteLocalFile(url)
        }
      })

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
