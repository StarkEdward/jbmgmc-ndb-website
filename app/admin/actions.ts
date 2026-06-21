'use server'

import { db, DeanInfo, CollegeInfo, HeroSlide, NavigationItem, QuickLink, Testimonial, AboutSettings, AcademicsSettings, InstitutionMetrics, DynamicPage, LibraryInfo, TenderItem, AccreditationInfo, Authority } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { runAction } from '@/lib/action-utils'
import { hashPassword } from '@/lib/password'
import { isValidUrl, findInvalidNavUrl } from '@/lib/validation'

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
    // VULN-11 fix: Reject javascript:, data:, vbscript: and other unsafe URI schemes.
    if (!isValidUrl(url)) {
      return { success: false, error: 'Invalid URL. Only https://, http://, and relative paths are allowed.' }
    }
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
    // VULN-11 fix: Validate all href values across the navigation tree.
    // An admin (or compromised admin) could otherwise set href="javascript:..." which
    // would execute in every visitor's browser when they click the nav link.
    const badUrl = findInvalidNavUrl(items)
    if (badUrl !== null) {
      return { success: false, error: `Invalid URL detected in navigation: "${badUrl}". Only https://, http://, and relative paths are allowed.` }
    }
    const success = await db.updateNavItems(items)
    if (success) revalidatePath('/', 'layout')
    return { success }
  })
}

export async function updateQuickLinksAction(items: QuickLink[]) {
  return runAction('updateQuickLinks', async () => {
    // VULN-11 fix: Validate all href values in quick links.
    const badLink = items.find(item => item.href !== undefined && item.href !== '' && !isValidUrl(item.href))
    if (badLink) {
      return { success: false, error: `Invalid URL detected in quick links: "${badLink.href}". Only https://, http://, and relative paths are allowed.` }
    }
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
    // VULN-11 fix: Validate the tender document URL.
    if (tender.url && !isValidUrl(tender.url)) {
      return { success: false, error: 'Invalid tender URL. Only https://, http://, and relative paths are allowed.' }
    }
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

/**
 * Updates the admin username and optionally the password.
 *
 * VULN-03 fix: This action now accepts the PLAINTEXT password directly from the form.
 * The browser no longer performs any hashing — hashing happens here, server-side,
 * using bcrypt (see lib/password.ts). This closes the Pass-the-Hash attack vector.
 *
 * VULN-02 fix: bcrypt with work-factor 12 is used instead of the old unsalted SHA-256.
 *
 * @param plaintextPassword - New plaintext password, OR empty string to keep existing hash.
 */
export async function updateAdminCredentialsAction(username: string, plaintextPassword: string) {
  return runAction('updateAdminCredentials', async () => {
    // Enforce username limits
    if (!username || username.trim().length === 0 || username.length > 128) {
      return { success: false, error: 'Invalid username.' }
    }

    let passwordHash: string

    if (plaintextPassword === '') {
      // Empty string sentinel: keep the existing bcrypt hash from the database.
      const existing = db.getAdminCredentials()
      if (!existing.passwordHash) {
        return { success: false, error: 'No existing password is set. Please enter a new password.' }
      }
      passwordHash = existing.passwordHash
    } else {
      // New password provided — validate and hash server-side with bcrypt.
      if (plaintextPassword.length < 6 || plaintextPassword.length > 128) {
        return { success: false, error: 'Password must be between 6 and 128 characters.' }
      }
      passwordHash = await hashPassword(plaintextPassword)
    }

    const success = await db.updateAdminCredentials(username, passwordHash)
    if (success) revalidatePath('/', 'layout')
    return { success }
  })
}
