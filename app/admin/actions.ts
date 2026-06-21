'use server'

import { db, DeanInfo, CollegeInfo, HeroSlide, NavigationItem, QuickLink, Testimonial, AboutSettings, AcademicsSettings, InstitutionMetrics, DynamicPage, LibraryInfo, TenderItem, AccreditationInfo, Authority } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { runAction } from '@/lib/action-utils'

// Global Settings Updates
export async function updateDeanAction(fields: Partial<DeanInfo>) {
  return runAction('updateDean', async () => {
    const success = await db.updateDeanInfo(fields)
    if (success) revalidatePath('/', 'layout')
    return { success }
  })
}

export async function updateCollegeInfoAction(fields: Partial<CollegeInfo>) {
  return runAction('updateCollegeInfo', async () => {
    const success = await db.updateCollegeInfo(fields)
    if (success) revalidatePath('/', 'layout')
    return { success }
  })
}

// Hero Slides Actions
export async function addHeroSlideAction(slide: Omit<HeroSlide, 'id' | 'order'>) {
  return runAction('addHeroSlide', async () => {
    const success = await db.addHeroSlide(slide)
    if (success) revalidatePath('/', 'layout')
    return { success }
  })
}

export async function deleteHeroSlideAction(id: number) {
  return runAction('deleteHeroSlide', async () => {
    const success = await db.deleteHeroSlide(id)
    if (success) revalidatePath('/', 'layout')
    return { success }
  })
}

export async function reorderHeroSlideAction(id: number, direction: 'up' | 'down') {
  return runAction('reorderHeroSlide', async () => {
    const success = await db.reorderHeroSlide(id, direction)
    if (success) revalidatePath('/', 'layout')
    return { success }
  })
}

// Scrolling Ticker Bulletins Actions
export async function addTickerAction(text: string) {
  return runAction('addTicker', async () => {
    const success = await db.addTickerBulletin(text)
    if (success) revalidatePath('/', 'layout')
    return { success }
  })
}

export async function deleteTickerAction(id: number) {
  return runAction('deleteTicker', async () => {
    const success = await db.deleteTickerBulletin(id)
    if (success) revalidatePath('/', 'layout')
    return { success }
  })
}

export async function togglePinTickerAction(id: number) {
  return runAction('togglePinTicker', async () => {
    const success = await db.togglePinTickerBulletin(id)
    if (success) revalidatePath('/', 'layout')
    return { success }
  })
}

export async function reorderTickerAction(id: number, direction: 'up' | 'down') {
  return runAction('reorderTicker', async () => {
    const success = await db.reorderTickerBulletin(id, direction)
    if (success) revalidatePath('/', 'layout')
    return { success }
  })
}

// PDF Downloads Vault Actions
export async function addDownloadAction(name: string, url: string) {
  return runAction('addDownload', async () => {
    const success = await db.addDownloadItem(name, url)
    if (success) revalidatePath('/', 'layout')
    return { success }
  })
}

export async function deleteDownloadAction(id: number) {
  return runAction('deleteDownload', async () => {
    const success = await db.deleteDownloadItem(id)
    if (success) revalidatePath('/', 'layout')
    return { success }
  })
}

export async function reorderDownloadAction(id: number, direction: 'up' | 'down') {
  return runAction('reorderDownload', async () => {
    const success = await db.reorderDownloadItem(id, direction)
    if (success) revalidatePath('/', 'layout')
    return { success }
  })
}

// Site Builder Actions
export async function updateNavItemsAction(items: NavigationItem[]) {
  return runAction('updateNavItems', async () => {
    const success = await db.updateNavItems(items)
    if (success) revalidatePath('/', 'layout')
    return { success }
  })
}

export async function updateQuickLinksAction(items: QuickLink[]) {
  return runAction('updateQuickLinks', async () => {
    const success = await db.updateQuickLinks(items)
    if (success) revalidatePath('/', 'layout')
    return { success }
  })
}

export async function updateTestimonialsAction(items: Testimonial[]) {
  return runAction('updateTestimonials', async () => {
    const success = await db.updateTestimonials(items)
    if (success) revalidatePath('/', 'layout')
    return { success }
  })
}

// Advanced Settings Actions
export async function updateAboutSettingsAction(settings: AboutSettings) {
  return runAction('updateAboutSettings', async () => {
    const success = await db.updateAboutSettings(settings)
    if (success) revalidatePath('/', 'layout')
    return { success }
  })
}

export async function updateInstitutionMetricsAction(settings: InstitutionMetrics) {
  return runAction('updateInstitutionMetrics', async () => {
    const success = await db.updateInstitutionMetrics(settings)
    if (success) revalidatePath('/', 'layout')
    return { success }
  })
}

export async function updateAcademicsSettingsAction(settings: AcademicsSettings) {
  return runAction('updateAcademicsSettings', async () => {
    const success = await db.updateAcademicsSettings(settings)
    if (success) revalidatePath('/', 'layout')
    return { success }
  })
}

// Dynamic Pages Actions
export async function updateDynamicPageAction(page: DynamicPage) {
  return runAction('updateDynamicPage', async () => {
    const success = await db.updateDynamicPage(page)
    if (success) revalidatePath('/', 'layout')
    return { success }
  })
}

export async function deleteDynamicPageAction(slug: string) {
  return runAction('deleteDynamicPage', async () => {
    const success = await db.deleteDynamicPage(slug)
    if (success) revalidatePath('/', 'layout')
    return { success }
  })
}

export async function updateLibraryInfoAction(fields: Partial<LibraryInfo>) {
  return runAction('updateLibraryInfo', async () => {
    const success = await db.updateLibraryInfo(fields)
    if (success) revalidatePath('/', 'layout')
    return { success }
  })
}

// Tenders Actions
export async function addTenderAction(tender: Omit<TenderItem, 'id'>) {
  return runAction('addTender', async () => {
    const success = await db.addTender(tender)
    if (success) revalidatePath('/', 'layout')
    return { success }
  })
}

export async function deleteTenderAction(id: number) {
  return runAction('deleteTender', async () => {
    const success = await db.deleteTender(id)
    if (success) revalidatePath('/', 'layout')
    return { success }
  })
}

// Accreditations Actions
export async function updateAccreditationInfoAction(fields: Partial<AccreditationInfo>) {
  return runAction('updateAccreditationInfo', async () => {
    const success = await db.updateAccreditationInfo(fields)
    if (success) revalidatePath('/', 'layout')
    return { success }
  })
}

// Authorities Actions
export async function addAuthorityAction(auth: Authority) {
  return runAction('addAuthority', async () => {
    const success = await db.addAuthority(auth)
    if (success) revalidatePath('/', 'layout')
    return { success }
  })
}

export async function updateAuthorityAction(originalName: string, updatedAuth: Authority) {
  return runAction('updateAuthority', async () => {
    const success = await db.updateAuthority(originalName, updatedAuth)
    if (success) revalidatePath('/', 'layout')
    return { success }
  })
}

export async function deleteAuthorityAction(name: string) {
  return runAction('deleteAuthority', async () => {
    const success = await db.deleteAuthority(name)
    if (success) revalidatePath('/', 'layout')
    return { success }
  })
}

export async function updateAdminCredentialsAction(username: string, passwordHash: string) {
  return runAction('updateAdminCredentials', async () => {
    const success = await db.updateAdminCredentials(username, passwordHash)
    if (success) revalidatePath('/', 'layout')
    return { success }
  })
}
