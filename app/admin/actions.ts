'use server'

import { db, DeanInfo, CollegeInfo, HeroSlide, NavigationItem, QuickLink, StatCounter, Testimonial, CustomBlock, AboutSettings, AcademicsSettings, CampusStats, DynamicPage, LibraryInfo, TenderItem } from '@/lib/db'
import { revalidatePath } from 'next/cache'

// Global Settings Updates
export async function updateDeanAction(fields: Partial<DeanInfo>) {
  const success = db.updateDeanInfo(fields)
  if (success) {
    revalidatePath('/', 'layout')
  }
  return { success }
}

export async function updateCollegeInfoAction(fields: Partial<CollegeInfo>) {
  const success = db.updateCollegeInfo(fields)
  if (success) {
    revalidatePath('/', 'layout')
  }
  return { success }
}

// Hero Slides Actions
export async function addHeroSlideAction(slide: Omit<HeroSlide, 'id' | 'order'>) {
  const success = db.addHeroSlide(slide)
  if (success) {
    revalidatePath('/', 'layout')
  }
  return { success }
}

export async function deleteHeroSlideAction(id: number) {
  const success = db.deleteHeroSlide(id)
  if (success) {
    revalidatePath('/', 'layout')
  }
  return { success }
}

export async function reorderHeroSlideAction(id: number, direction: 'up' | 'down') {
  const success = db.reorderHeroSlide(id, direction)
  if (success) {
    revalidatePath('/', 'layout')
  }
  return { success }
}

// Scrolling Ticker Bulletins Actions
export async function addTickerAction(text: string) {
  const success = db.addTickerBulletin(text)
  if (success) {
    revalidatePath('/', 'layout')
  }
  return { success }
}

export async function deleteTickerAction(id: number) {
  const success = db.deleteTickerBulletin(id)
  if (success) {
    revalidatePath('/', 'layout')
  }
  return { success }
}

export async function togglePinTickerAction(id: number) {
  const success = db.togglePinTickerBulletin(id)
  if (success) {
    revalidatePath('/', 'layout')
  }
  return { success }
}

export async function reorderTickerAction(id: number, direction: 'up' | 'down') {
  const success = db.reorderTickerBulletin(id, direction)
  if (success) {
    revalidatePath('/', 'layout')
  }
  return { success }
}

// PDF Downloads Vault Actions
export async function addDownloadAction(name: string, url: string) {
  const success = db.addDownloadItem(name, url)
  if (success) {
    revalidatePath('/', 'layout')
  }
  return { success }
}

export async function deleteDownloadAction(id: number) {
  const success = db.deleteDownloadItem(id)
  if (success) {
    revalidatePath('/', 'layout')
  }
  return { success }
}

export async function reorderDownloadAction(id: number, direction: 'up' | 'down') {
  const success = db.reorderDownloadItem(id, direction)
  if (success) {
    revalidatePath('/', 'layout')
  }
  return { success }
}

// Site Builder Actions
export async function updateNavItemsAction(items: NavigationItem[]) {
  const success = db.updateNavItems(items)
  if (success) {
    revalidatePath('/', 'layout')
  }
  return { success }
}

export async function updateQuickLinksAction(items: QuickLink[]) {
  const success = db.updateQuickLinks(items)
  if (success) {
    revalidatePath('/', 'layout')
  }
  return { success }
}

export async function updateStatCountersAction(items: StatCounter[]) {
  const success = db.updateStatCounters(items)
  if (success) {
    revalidatePath('/', 'layout')
  }
  return { success }
}

export async function updateTestimonialsAction(items: Testimonial[]) {
  const success = db.updateTestimonials(items)
  if (success) {
    revalidatePath('/', 'layout')
  }
  return { success }
}

export async function updateCustomBlocksAction(items: CustomBlock[]) {
  const success = db.updateCustomBlocks(items)
  if (success) {
    revalidatePath('/', 'layout')
  }
  return { success }
}

// Advanced Settings Actions
export async function updateAboutSettingsAction(settings: AboutSettings) {
  const success = db.updateAboutSettings(settings)
  if (success) {
    revalidatePath('/', 'layout')
  }
  return { success }
}

export async function updateCampusStatsAction(settings: CampusStats) {
  const success = db.updateCampusStats(settings)
  if (success) {
    revalidatePath('/', 'layout')
  }
  return { success }
}

export async function updateAcademicsSettingsAction(settings: AcademicsSettings) {
  const success = db.updateAcademicsSettings(settings)
  if (success) {
    revalidatePath('/', 'layout')
  }
  return { success }
}

// Dynamic Pages Actions
export async function updateDynamicPageAction(page: DynamicPage) {
  const success = db.updateDynamicPage(page)
  if (success) {
    revalidatePath('/', 'layout')
  }
  return { success }
}

export async function deleteDynamicPageAction(slug: string) {
  const success = db.deleteDynamicPage(slug)
  if (success) {
    revalidatePath('/', 'layout')
  }
  return { success }
}

export async function updateLibraryInfoAction(fields: Partial<LibraryInfo>) {
  const success = db.updateLibraryInfo(fields)
  if (success) {
    revalidatePath('/', 'layout')
  }
  return { success }
}

// Tenders Actions
export async function addTenderAction(tender: Omit<TenderItem, 'id'>) {
  const success = db.addTender(tender)
  if (success) {
    revalidatePath('/', 'layout')
  }
  return { success }
}

export async function deleteTenderAction(id: number) {
  const success = db.deleteTender(id)
  if (success) {
    revalidatePath('/', 'layout')
  }
  return { success }
}
