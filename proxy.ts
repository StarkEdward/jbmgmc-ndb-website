import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyTokenSignature } from '@/lib/session-edge'

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname.toLowerCase()

  // ── Admin Route Guard ────────────────────────────────────────────────────────
  // Guard all paths starting with /admin, EXCEPT /admin/login
  const isAdminRoute = pathname.startsWith('/admin')
  const isLoginPage = pathname === '/admin/login' || pathname.startsWith('/admin/login/')

  if (isAdminRoute && !isLoginPage) {
    const adminSessionToken = request.cookies.get('admin_session')?.value

    let isAuthorized = false
    if (adminSessionToken) {
      const session = await verifyTokenSignature(adminSessionToken)
      if (session) {
        isAuthorized = true
      }
    }

    if (!isAuthorized) {
      const loginUrl = new URL('/admin/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  // ── VULN-09: Nonce-based Content Security Policy ─────────────────────────────
  // A new cryptographically random nonce is generated for every single request.
  // This nonce is placed in the CSP header, which tells the browser to ONLY execute
  // <script> tags that carry the matching nonce attribute — blocking any injected
  // inline scripts (XSS) that won't have a valid nonce.
  //
  // Why nonces defeat XSS:
  //   • 'unsafe-inline' allows ANY inline script to run (including attacker injections).
  //   • A nonce means only scripts with the EXACT nonce value run — and since the nonce
  //     is a new UUID base64-encoded on every request, an attacker can never predict it.
  //
  // Implementation notes:
  //   • The nonce is forwarded to the Next.js layout via the 'x-nonce' request header
  //     so that server components can read it via headers() and apply it to <script> tags.
  //   • style-src keeps 'unsafe-inline' because Tailwind CSS, JSX inline styles, and
  //     many UI library patterns rely on inline style attributes — removing this would
  //     require migrating every component. CSS injection is significantly lower-risk than
  //     script injection for this site's threat model.
  //   • connect-src allows wss: for Next.js HMR websocket in development.

  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  const isDev = process.env.NODE_ENV !== 'production'

  const cspDirectives = [
    "default-src 'self'",
    // VULN-09 fix: 'unsafe-inline' replaced by 'nonce-{nonce}'.
    // 'strict-dynamic' allows scripts loaded BY nonce-bearing scripts to also run
    // (required for Next.js to load its own client bundles dynamically).
    isDev
      ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"   // Dev: HMR + eval needed
      : `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    "style-src 'self' 'unsafe-inline'",                       // Tailwind / inline styles
    "img-src 'self' blob: data: https:",
    "font-src 'self' data:",
    isDev
      ? "connect-src 'self' ws: wss: https:"                 // Dev: HMR websocket
      : "connect-src 'self' https:",
    "frame-src 'self' https://maps.google.com https://www.google.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",                                     // Prevents form hijacking
    "upgrade-insecure-requests",                              // Upgrades HTTP sub-resources to HTTPS
  ]

  // ── VULN-08: Restrict Clipboard API ─────────────────────────────────────────
  // Clipboard Hijacking: without this restriction, any XSS payload can silently call
  // navigator.clipboard.readText() to steal whatever the user has copied (passwords,
  // 2FA codes, bank details). The restriction below:
  //   clipboard-read=()         → no page may read the clipboard (blocks silent exfil)
  //   clipboard-write=(self)    → only same-origin pages may write to the clipboard
  //                               (legitimate copy buttons on this site still work)
  const permissionsPolicy = [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'interest-cohort=()',
    'clipboard-read=()',           // VULN-08 fix: block clipboard read access
    'clipboard-write=(self)',      // Allow same-origin copy buttons (admin copy actions)
    'payment=()',
    'usb=()',
    'magnetometer=()',
    'gyroscope=()',
    'accelerometer=()',
  ].join(', ')

  // Build the response — forward the nonce as a request header so the layout can read it
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  })

  // Apply security headers to the response
  response.headers.set('Content-Security-Policy', cspDirectives.join('; '))
  response.headers.set('Permissions-Policy', permissionsPolicy)

  return response
}

// Run middleware on all routes (not just /admin) so CSP covers public pages too
export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     *   - _next/static   (static files served directly, no CSP needed)
     *   - _next/image    (image optimisation endpoint)
     *   - favicon.ico    (browser default favicon fetch)
     *   - icon.png       (PWA icon)
     */
    '/((?!_next/static|_next/image|favicon.ico|icon.png).*)',
  ],
}
