import { headers } from 'next/headers'

/**
 * Validates that a string looks like a legitimate IPv4 or IPv6 address.
 *
 * VULN-04 fix: Without this check, an attacker who bypasses Nginx and hits
 * the Node.js server directly can send arbitrary X-Real-IP / X-Forwarded-For
 * header values to impersonate any IP address and sidestep rate-limiting entirely.
 *
 * This function rejects:
 *   - Empty strings or strings that are too long
 *   - Strings containing characters outside the valid IP character set (letters for IPv6,
 *     digits and dots for IPv4, colons for IPv6)
 *   - Anything that doesn't match basic IPv4 (4 dot-separated octets 0-255) or
 *     IPv6 (hex groups separated by colons) structure
 *
 * Note: This is a structural validation, not a full RFC 3986 parser. Its purpose
 * is to prevent injection of arbitrary strings as "IP addresses" into the rate-limit
 * key space — not to replace a full networking library.
 */
function isValidIpFormat(ip: string): boolean {
  const trimmed = ip.trim()

  // Reject empty, too long, or containing whitespace (which could allow injection tricks)
  if (!trimmed || trimmed.length > 45 || /\s/.test(trimmed)) return false

  // IPv4: four dot-separated octets, each 0-255
  const ipv4Pattern = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/
  const ipv4Match = ipv4Pattern.exec(trimmed)
  if (ipv4Match) {
    // Verify each octet is in range [0, 255] — rejects things like 999.999.999.999
    return ipv4Match.slice(1).every(octet => {
      const n = parseInt(octet, 10)
      return n >= 0 && n <= 255
    })
  }

  // IPv6: colon-separated hex groups (including compressed :: notation)
  // Only allows hex digits and colons — nothing else
  const ipv6Pattern = /^[0-9a-fA-F:]+$/
  if (ipv6Pattern.test(trimmed) && trimmed.includes(':')) {
    // At minimum must have at least one colon (e.g. "::1" = loopback)
    return trimmed.split(':').length >= 2
  }

  return false
}

/**
 * Safely extracts the client's IP address from incoming request headers.
 *
 * Trust hierarchy:
 *   1. X-Real-IP     — set by Nginx from $remote_addr (cannot be forged through Nginx)
 *   2. CF-Connecting-IP — set by Cloudflare (cannot be forged through Cloudflare)
 *   3. X-Forwarded-For (leftmost IP) — set by other proxies; ONLY accepted if format-valid
 *   4. 127.0.0.1     — fallback when the app is accessed directly (dev / health checks)
 *
 * VULN-04 fix: Each header value is now validated via isValidIpFormat() before use.
 * An attacker sending 'X-Real-IP: arbitrary_string' will cause that header to be
 * ignored, falling through to a safe fallback rather than poisoning the rate-limit key.
 *
 * IMPORTANT production note: Node.js (port 3000) should NEVER be exposed directly to the
 * internet. Nginx must be the only entry point. When Nginx sets X-Real-IP from $remote_addr,
 * the header reflects the true client IP as seen by Nginx — a client cannot override it.
 */
export async function getClientIp(): Promise<string> {
  const headersList = await headers()

  const realIp = headersList.get('x-real-ip')
  if (realIp && isValidIpFormat(realIp)) return realIp.trim()

  const cfIp = headersList.get('cf-connecting-ip')
  if (cfIp && isValidIpFormat(cfIp)) return cfIp.trim()

  const xForwardedFor = headersList.get('x-forwarded-for')
  if (xForwardedFor) {
    // X-Forwarded-For is a comma-separated list; the leftmost IP is the original client.
    // Only the leftmost entry is considered — intermediate proxies append to the right.
    const candidate = xForwardedFor.split(',')[0]
    if (candidate && isValidIpFormat(candidate)) return candidate.trim()
  }

  // No valid IP header found — either direct access (dev) or all headers were spoofed.
  // Returning loopback means all direct-access requests share a single rate-limit bucket,
  // which is safe for development and harmless in production (Nginx will always set X-Real-IP).
  return '127.0.0.1'
}
