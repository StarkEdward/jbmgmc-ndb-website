import bcrypt from 'bcryptjs'

/**
 * Server-side password hashing and verification using bcrypt.
 *
 * Why bcrypt instead of SHA-256:
 *  1. bcrypt is INTENTIONALLY slow (work factor 12 ≈ 250ms per hash on modern hardware).
 *     This makes brute-force and dictionary attacks ~10 billion× harder than SHA-256.
 *  2. bcrypt automatically generates and embeds a unique cryptographic salt per hash.
 *     The same plaintext password will produce a different hash every time — rainbow tables
 *     are completely defeated.
 *  3. bcrypt is memory-hard and not GPU-friendly, so commodity hardware attacks are ineffective.
 *
 * NEVER import this module in a 'use client' component — it runs on the server only.
 */

const BCRYPT_ROUNDS = 12 // ~250ms per hash — adjust upward over time as hardware improves

/**
 * Hashes a plaintext password using bcrypt with a random salt.
 * Returns a string in the form: $2a$12$<22-char salt><31-char hash>
 *
 * @param plaintext - The raw password string from the user.
 * @returns A bcrypt hash string safe to store in the database.
 */
export async function hashPassword(plaintext: string): Promise<string> {
  return bcrypt.hash(plaintext, BCRYPT_ROUNDS)
}

/**
 * Verifies a plaintext password against a stored bcrypt hash.
 * bcrypt.compare() is internally constant-time — it does not short-circuit
 * on mismatch, preventing timing side-channel leaks.
 *
 * @param plaintext - The raw password string from the user's login attempt.
 * @param hash      - The stored bcrypt hash from the database.
 * @returns true if the password matches, false otherwise.
 */
export async function verifyPassword(plaintext: string, hash: string): Promise<boolean> {
  // Guard against invalid/empty hash (e.g. not yet configured in DB)
  if (!hash || !hash.startsWith('$2')) return false
  return bcrypt.compare(plaintext, hash)
}
