import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/session'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname.toLowerCase()

  // Guard all paths starting with /admin, EXCEPT /admin/login (NEW 22)
  const isAdminRoute = pathname.startsWith('/admin')
  const isLoginPage = pathname === '/admin/login' || pathname.startsWith('/admin/login/')

  if (isAdminRoute && !isLoginPage) {
    const adminSessionToken = request.cookies.get('admin_session')?.value
    
    let isAuthorized = false
    if (adminSessionToken) {
      const session = await verifyToken(adminSessionToken)
      if (session) {
        isAuthorized = true
      }
    }

    if (!isAuthorized) {
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
