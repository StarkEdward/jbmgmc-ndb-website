import DOMPurify from 'isomorphic-dompurify'

/**
 * HTML tags that are safe to render in content pages for a medical college website.
 * Script, iframe, form, input and all other executable/interactive tags are excluded.
 */
const ALLOWED_TAGS = [
  // Document structure
  'div', 'span', 'section', 'article', 'main', 'aside',
  'header', 'footer', 'nav', 'figure', 'figcaption',
  // Headings
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  // Paragraphs & inline text
  'p', 'br', 'hr',
  'b', 'i', 'strong', 'em', 'u', 's', 'mark', 'small', 'sub', 'sup',
  'abbr', 'cite', 'q', 'time',
  // Lists
  'ul', 'ol', 'li', 'dl', 'dt', 'dd',
  // Tables
  'table', 'thead', 'tbody', 'tfoot', 'caption',
  'colgroup', 'col', 'tr', 'th', 'td',
  // Links & media
  'a', 'img',
  // Code & quotes
  'blockquote', 'pre', 'code', 'kbd', 'samp',
]

/**
 * HTML attributes that are safe to render.
 * All event-handler attributes (onclick, onerror, onload, …) are excluded by
 * DOMPurify's engine regardless of this list; this list further restricts to
 * only the handful of data/styling attributes we actually need.
 */
const ALLOWED_ATTR = [
  // Universal
  'class', 'id', 'style', 'title', 'lang',
  // Links
  'href', 'target', 'rel',
  // Images
  'src', 'alt', 'width', 'height', 'loading', 'decoding',
  // Tables
  'colspan', 'rowspan', 'scope',
  // Semantic extras
  'datetime', 'cite',
]

/**
 * DOMPurify configuration applied to every sanitize() call.
 *
 * Key protections:
 *  - ALLOWED_TAGS / ALLOWED_ATTR: explicit allowlists — anything not listed is stripped.
 *  - ALLOWED_URI_REGEXP: blocks javascript: and data: URLs in href/src.
 *  - FORCE_BODY: prevents DOM-clobbering attacks via <html>/<head> injection.
 *  - ALLOW_UNKNOWN_PROTOCOLS: false — rejects non-standard URI schemes.
 */
const DOMPURIFY_CONFIG: Parameters<typeof DOMPurify.sanitize>[1] = {
  ALLOWED_TAGS,
  ALLOWED_ATTR,
  // Only allow safe URI schemes — this blocks javascript:, vbscript:, data: etc.
  ALLOWED_URI_REGEXP:
    /^(?:(?:https?|mailto|tel|sms|callto):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  FORCE_BODY: true,
  ALLOW_UNKNOWN_PROTOCOLS: false,
}

/**
 * Sanitizes raw HTML before it is passed to dangerouslySetInnerHTML.
 *
 * Works in both server components (isomorphic-dompurify uses JSDOM on the server)
 * and client components (uses the browser's native DOM API).
 *
 * Usage:
 *   <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }} />
 *
 * @param dirty - Untrusted HTML string from the database or user input.
 * @returns A sanitized HTML string safe for rendering.
 */
export function sanitizeHtml(dirty: string): string {
  if (!dirty || typeof dirty !== 'string') return ''
  return DOMPurify.sanitize(dirty, DOMPURIFY_CONFIG) as string
}
