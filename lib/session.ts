/**
 * In-memory registry of active session UUIDs.
 *
 * - A UUID is added when signToken() creates a session.
 * - A UUID is removed when invalidateSession() is called on logout.
 * - verifyToken() rejects any token whose UUID is not in this set,
 *   meaning a captured/stolen cookie is dead the moment the real user logs out.
 *
 * Trade-off: the registry is cleared on server restart (users must re-login).
 * This is acceptable — it is strictly more secure than no revocation at all.
 * For the single-process PM2 setup in use here, this works perfectly.
 */
const activeSessions = new Set<string>()

const getSessionSecretKey = async (secret: string): Promise<CryptoKey> => {
  const enc = new TextEncoder()
  return crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  )
}

/** Returns the session secret or throws if not configured — prevents insecure fallback. */
function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) {
    throw new Error(
      '[session] ADMIN_SESSION_SECRET environment variable is not set. ' +
      'Set it to a random 64-character hex string in your .env file before starting the server.'
    )
  }
  return secret
}

export async function signToken(username: string): Promise<string> {
  const secret = getSecret()
  const sessionId = crypto.randomUUID()

  const payload = {
    username,
    expiresAt: Date.now() + 8 * 60 * 60 * 1000, // 8 hours (down from 24h)
    random: sessionId,
  }
  const payloadStr = JSON.stringify(payload)
  const encodedPayload = btoa(payloadStr)

  const key = await getSessionSecretKey(secret)
  const signatureBuffer = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(payloadStr)
  )
  const signatureArray = Array.from(new Uint8Array(signatureBuffer))
  const signatureHex = signatureArray.map(b => b.toString(16).padStart(2, '0')).join('')

  // Register this session so verifyToken() accepts it
  activeSessions.add(sessionId)

  return `${encodedPayload}.${signatureHex}`
}

export async function verifyToken(token: string): Promise<{ username: string } | null> {
  try {
    const parts = token.split('.')
    if (parts.length !== 2) return null
    const [encodedPayload, signatureHex] = parts

    const payloadStr = atob(encodedPayload)
    const payload = JSON.parse(payloadStr)

    // Check expiration
    if (payload.expiresAt < Date.now()) {
      return null
    }

    // Reject tokens that have been explicitly invalidated (i.e. after logout).
    // This is the core replay-attack defence: a stolen cookie becomes useless
    // the moment the legitimate user logs out.
    if (!activeSessions.has(payload.random)) {
      return null
    }

    const secret = getSecret()
    const key = await getSessionSecretKey(secret)

    const hexMatch = signatureHex.match(/.{1,2}/g)
    if (!hexMatch) return null

    const verified = await crypto.subtle.verify(
      'HMAC',
      key,
      new Uint8Array(hexMatch.map(byte => parseInt(byte, 16))),
      new TextEncoder().encode(payloadStr)
    )

    if (verified) {
      return { username: payload.username }
    }
  } catch (e) {
    // Malformed token — treat as invalid
  }
  return null
}

/**
 * Removes the session UUID from the active registry.
 * Call this in logoutAction() to immediately revoke the token server-side,
 * even if an attacker captured the cookie before logout.
 */
export function invalidateSession(token: string): void {
  try {
    const [encodedPayload] = token.split('.')
    if (!encodedPayload) return
    const payload = JSON.parse(atob(encodedPayload))
    if (payload?.random) {
      activeSessions.delete(payload.random)
    }
  } catch {
    // Malformed token — nothing to revoke
  }
}
