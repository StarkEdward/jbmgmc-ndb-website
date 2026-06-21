'use server'

import { cookies } from 'next/headers'
import { timingSafeEqual } from 'crypto'
import { db } from '@/lib/db'
import { checkRateLimit, recordAttempt, clearRateLimit } from '@/lib/rate-limiter'
import { signToken, invalidateSession } from '@/lib/session'
import { getClientIp } from '@/lib/ip'
import { verifyPassword } from '@/lib/password'

/**
 * Constant-time string comparison using Node.js crypto.timingSafeEqual.
 *
 * Why this matters: JavaScript's === short-circuits on the first character
 * mismatch. An attacker can measure sub-millisecond response-time differences
 * over thousands of requests to progressively guess each character (timing attack).
 *
 * Used here ONLY for the username check and the ADMIN_PASSWORD env-var plaintext path.
 * Password-vs-bcrypt-hash verification is handled by verifyPassword() in lib/password.ts,
 * which delegates to bcrypt.compare() — also inherently constant-time.
 */
async function safeCompare(a: string, b: string): Promise<boolean> {
  // Hash both strings to get fixed-length, equal-size buffers for timingSafeEqual.
  const enc = new TextEncoder()
  const [bufA, bufB] = await Promise.all([
    crypto.subtle.digest('SHA-256', enc.encode(a)),
    crypto.subtle.digest('SHA-256', enc.encode(b)),
  ])
  return timingSafeEqual(Buffer.from(bufA), Buffer.from(bufB))
}

export async function loginAction(username: string, password: string) {
  // Defense-in-depth: Block excessively long credentials.
  // Keep the 128-char limit BEFORE any hashing — bcrypt has a 72-byte effective limit;
  // feeding it multi-KB inputs can cause CPU-based DoS (Long Password DoS — VULN-05).
  if (username.length > 128 || password.length > 128) {
    return { success: false, error: 'Input credentials exceed maximum allowed length.' }
  }

  // Extract client IP address safely
  const ip = await getClientIp()

  // Check rate limit before anything else
  const limitCheck = checkRateLimit(ip, 'login')
  if (!limitCheck.allowed) {
    const minutesLeft = Math.ceil(limitCheck.timeLeftSeconds / 60)
    return { success: false, error: `Too many failed attempts. Please try again after ${minutesLeft} minutes.` }
  }

  const creds = db.getAdminCredentials()

  // VULN-19 fix: No hardcoded 'admin' fallback — require explicit configuration.
  const expectedUsername = process.env.ADMIN_USERNAME || creds.username
  if (!expectedUsername) {
    return {
      success: false,
      error: 'Admin username is not configured. Set ADMIN_USERNAME in your .env file.'
    }
  }

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

  // Username comparison: constant-time via safeCompare (prevents timing attacks).
  const isUsernameValid = await safeCompare(username, expectedUsername)

  // Password comparison:
  //   • Env-var path  → plaintext vs plaintext (constant-time via safeCompare)
  //   • DB path       → plaintext vs bcrypt hash (bcrypt.compare is inherently constant-time)
  //                     VULN-02 fix: bcrypt replaces the old unsalted SHA-256 comparison.
  let isPasswordValid = false
  if (hasEnvPassword) {
    isPasswordValid = await safeCompare(password, process.env.ADMIN_PASSWORD!)
  } else if (expectedPasswordHash) {
    isPasswordValid = await verifyPassword(password, expectedPasswordHash)
  }

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
