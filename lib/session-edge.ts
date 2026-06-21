export const getSessionSecretKey = async (secret: string): Promise<CryptoKey> => {
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
export function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) {
    throw new Error(
      '[session] ADMIN_SESSION_SECRET environment variable is not set. ' +
      'Set it to a random 64-character hex string in your .env file before starting the server.'
    )
  }
  return secret
}

export async function verifyTokenSignature(token: string): Promise<{ username: string, random: string } | null> {
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
      return { username: payload.username, random: payload.random }
    }
  } catch (e) {
    // Malformed token
  }
  return null
}
