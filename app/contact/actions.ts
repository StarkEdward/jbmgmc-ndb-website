'use server'

import { logger } from '@/lib/logger'
import { getClientIp } from '@/lib/ip'
import { checkRateLimit, recordAttempt } from '@/lib/rate-limiter'

export async function submitContactForm(data: { name: string, email: string, phone: string, subject: string, message: string }) {
  try {
    const ip = await getClientIp()
    const limitCheck = checkRateLimit(ip, 'publicData')
    if (!limitCheck.allowed) {
      return { success: false, error: 'Too many requests. Please try again later.' }
    }

    if (!data.name || !data.email || !data.subject || !data.message) {
      return { success: false, error: 'Required fields are missing.' }
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return { success: false, error: 'Invalid email address.' }
    }
    
    // Prevent extremely long messages (DoS/ReDos vectors on subsequent checks)
    if (data.message.length > 5000) {
      return { success: false, error: 'Message is too long.' }
    }

    // In a real application, send an email (e.g. via Nodemailer or Resend)
    // or save the contact submission to the database here.
    logger.info('CONTACT_FORM_SUBMISSION', `Message from ${data.name} (${data.email}) regarding ${data.subject}`)

    // Record attempt for rate limiting
    recordAttempt(ip, 'publicData', false)

    return { success: true }
  } catch (err: any) {
    logger.error('CONTACT_FORM_ERROR', err.message || 'Unknown error occurred during contact submission')
    return { success: false, error: 'Failed to submit form. Please try again later.' }
  }
}
