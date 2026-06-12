'use server'

import { cookies } from 'next/headers'

export async function loginAction(password: string) {
  const expectedPassword = process.env.ADMIN_PASSWORD || 'admin123'
  
  if (password === expectedPassword) {
    const cookieStore = await cookies()
    cookieStore.set('admin_session', 'jbmgmc_admin_logged_in_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/'
    })
    return { success: true }
  }
  
  return { success: false, error: 'Invalid administrator password' }
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_session')
  return { success: true }
}
