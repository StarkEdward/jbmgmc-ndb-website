import fs from 'fs'
import path from 'path'
import { getSecret, getSessionSecretKey, verifyTokenSignature } from './session-edge'

const SESSIONS_FILE = path.join(process.cwd(), 'data', 'sessions.json')

let activeSessions = new Set<string>()
let cacheLoaded = false

function loadSessions() {
  if (cacheLoaded) return
  try {
    if (fs.existsSync(SESSIONS_FILE)) {
      const raw = fs.readFileSync(SESSIONS_FILE, 'utf-8')
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        activeSessions = new Set(parsed)
      }
    }
  } catch (e) {
    console.error('Error reading sessions file:', e)
  }
  cacheLoaded = true
}

let saveTimeout: NodeJS.Timeout | null = null

function saveSessions() {
  if (saveTimeout) return
  saveTimeout = setTimeout(() => {
    saveTimeout = null
    try {
      const dir = path.dirname(SESSIONS_FILE)
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
      fs.writeFile(SESSIONS_FILE, JSON.stringify(Array.from(activeSessions)), 'utf-8', () => {})
    } catch (e) {}
  }, 1000)
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
  loadSessions()
  activeSessions.add(sessionId)
  saveSessions()

  return `${encodedPayload}.${signatureHex}`
}

export async function verifyToken(token: string): Promise<{ username: string } | null> {
  const valid = await verifyTokenSignature(token)
  if (!valid) return null

  // Reject tokens that have been explicitly invalidated (i.e. after logout).
  // This is the core replay-attack defence: a stolen cookie becomes useless
  // the moment the legitimate user logs out.
  loadSessions()
  if (!activeSessions.has(valid.random)) {
    return null
  }

  return { username: valid.username }
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
      loadSessions()
      activeSessions.delete(payload.random)
      saveSessions()
    }
  } catch {
    // Malformed token — nothing to revoke
  }
}
