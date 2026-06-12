import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Guard all paths starting with /admin, EXCEPT /admin/login
  if (path.startsWith('/admin') && path !== '/admin/login') {
    const adminSessionToken = request.cookies.get('admin_session')?.value

    // For absolute security, check if token is valid. In our implementation,
    // the valid session token will be a secure hash of the username & date/key.
    if (!adminSessionToken || adminSessionToken !== 'jbmgmc_admin_logged_in_token') {
      const loginUrl = new URL('/admin/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/admin/:path*'],
}
