'use server'

import { cookies } from 'next/headers'
import { timingSafeEqual } from 'crypto'
import { db } from '@/lib/db'
import { checkRateLimit, recordAttempt, clearRateLimit } from '@/lib/rate-limiter'
import { signToken, invalidateSession } from '@/lib/session'
import { getClientIp } from '@/lib/ip'

async function sha256(text: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(text)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Constant-time comparison string comparison using Node.js crypto.timingSafeEqual.
 *
 * Why this matters: JavaScript's === short-circuits on the first character
 * mismatch. An attacker can measure sub-millisecond response-time differences
 * over thousands of requests to progressively guess each character (timing attack).
 *
 * How it works:
 *  1. Both strings are hashed with SHA-256 to produce fixed-length 64-char outputs.
 *     This normalises lengths so timingSafeEqual always gets equal-length buffers,
 *     AND prevents length-based timing leaks.
 *  2. timingSafeEqual runs the comparison in constant time regardless of how many
 *     characters match, leaking no information to a remote attacker.
 */
async function safeCompare(a: string, b: string): Promise<boolean> {
  const [hashA, hashB] = await Promise.all([sha256(a), sha256(b)])
  const bufA = Buffer.from(hashA, 'utf8')
  const bufB = Buffer.from(hashB, 'utf8')
  // Buffers are always equal length (64 hex chars each), so timingSafeEqual is safe.
  return timingSafeEqual(bufA, bufB)
}

export async function loginAction(username: string, password: string) {
  // Extract client IP address safely
  const ip = await getClientIp()

  // Check rate limit before anything else
  const limitCheck = checkRateLimit(ip, 'login')
  if (!limitCheck.allowed) {
    const minutesLeft = Math.ceil(limitCheck.timeLeftSeconds / 60)
    return { success: false, error: `Too many failed attempts. Please try again after ${minutesLeft} minutes.` }
  }

  const creds = db.getAdminCredentials()
  const expectedUsername = process.env.ADMIN_USERNAME || creds.username || 'admin'

  // Determine the expected password credential.
  // ADMIN_PASSWORD env var takes priority over DB hash.
  // If neither is configured, block login and prompt admin to set credentials.
  const hasEnvPassword = !!process.env.ADMIN_PASSWORD
  const expectedPasswordHash = creds.passwordHash

  if (!hasEnvPassword && !expectedPasswordHash) {
    return {
      success: false,
      error: 'Admin credentials are not configured. Set ADMIN_PASSWORD in your .env file, or configure credentials in the Admin Settings panel first.'
    }
  }

  // All comparisons use safeCompare() — constant-time to prevent timing attacks.
  const isUsernameValid = await safeCompare(username, expectedUsername)

  const inputPasswordHash = await sha256(password)
  const isPasswordValid = hasEnvPassword
    ? await safeCompare(password, process.env.ADMIN_PASSWORD!)          // compare plaintext → plaintext
    : await safeCompare(inputPasswordHash, expectedPasswordHash!)        // compare hash → hash

  if (isUsernameValid && isPasswordValid) {
    // Clear rate limit record on successful login
    clearRateLimit(ip, 'login')

    const cookieStore = await cookies()
    const sessionToken = await signToken(username)
    cookieStore.set('admin_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',         // Prevent cookie from being sent on cross-site requests (CSRF defence)
      maxAge: 60 * 60 * 8,    // 8 hours — reduced from 24h to limit replay window
      path: '/'
    })
    return { success: true }
  }

  // Record failed attempt and compute cooldown if threshold reached
  const attempt = recordAttempt(ip, 'login', true)
  if (attempt.blocked) {
    const minutesLeft = Math.ceil(attempt.timeLeftSeconds / 60)
    return { success: false, error: `Too many failed attempts. Account locked out for ${minutesLeft} minutes.` }
  }

  return { success: false, error: 'Invalid username or password' }
}


export async function logoutAction() {
  const cookieStore = await cookies()

  // Revoke the session server-side BEFORE deleting the cookie.
  // This removes the UUID from the activeSessions registry in session.ts,
  // so any attacker who captured this cookie before logout can no longer
  // use it — verifyToken() will reject it immediately.
  const existingToken = cookieStore.get('admin_session')?.value
  if (existingToken) {
    invalidateSession(existingToken)
  }

  cookieStore.delete('admin_session')
  return { success: true }
}
