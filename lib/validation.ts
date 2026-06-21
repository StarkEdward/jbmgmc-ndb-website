/**
 * URL validation utilities for server-side actions.
 *
 * VULN-11 fix: All URL fields stored in the database must be validated through
 * this module before persistence. This prevents:
 *   - javascript: URI injection → XSS when a user clicks a stored link
 *   - data: URI injection → HTML/script injection in links
 *   - vbscript: and other exotic URI schemes used in older browser XSS
 *   - Protocol-relative URLs (//) that can redirect to attacker-controlled domains
 *
 * Allowed schemes: https://, http://, /, #, tel:, mailto:
 * These cover all legitimate use cases for this project.
 */

/** Maximum length for any stored URL (beyond this a URL is almost certainly malicious or junk). */
const MAX_URL_LENGTH = 2048

/**
 * Matches URLs that start with a known-safe scheme or are relative paths.
 * Anchored with ^ so it cannot be bypassed with leading whitespace after trimming.
 *
 * Allowed:
 *   https://example.com    — external HTTPS link
 *   http://example.com     — external HTTP link (e.g. legacy embeds)
 *   /path/to/page          — root-relative path
 *   #section-anchor        — in-page anchor
 *   tel:+911234567890      — phone link
 *   mailto:dean@example.in — email link
 *
 * Blocked (examples):
 *   javascript:alert(1)    — XSS
 *   data:text/html,...     — data-URI injection
 *   vbscript:...           — VBScript XSS (IE)
 *   //evil.com/...         — protocol-relative redirect
 */
const SAFE_URL_RE = /^(https?:\/\/|\/[^/]|\/\s*$|#|tel:|mailto:)/i

/**
 * Returns true if the given URL string is safe to store and render as an href.
 */
export function isValidUrl(url: unknown): url is string {
  if (typeof url !== 'string') return false
  const trimmed = url.trim()
  if (trimmed.length === 0 || trimmed.length > MAX_URL_LENGTH) return false
  return SAFE_URL_RE.test(trimmed)
}

/**
 * Returns the trimmed URL if valid, or null if it fails validation.
 * Use this for optional URL fields where a missing/empty URL is acceptable.
 */
export function sanitizeUrl(url: unknown): string | null {
  if (typeof url !== 'string' || url.trim().length === 0) return null
  return isValidUrl(url) ? url.trim() : null
}

/**
 * Validates every href in a nav item tree (item + all submenus).
 * Returns the first invalid URL found, or null if all are valid.
 */
export function findInvalidNavUrl(items: Array<{ href?: string; submenus?: Array<{ href?: string }> }>): string | null {
  for (const item of items) {
    if (item.href !== undefined && item.href !== '' && !isValidUrl(item.href)) {
      return item.href
    }
    if (item.submenus) {
      for (const sub of item.submenus) {
        if (sub.href !== undefined && sub.href !== '' && !isValidUrl(sub.href)) {
          return sub.href
        }
      }
    }
  }
  return null
}
