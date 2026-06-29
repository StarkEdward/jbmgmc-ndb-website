import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/session'

async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const adminSessionToken = cookieStore.get('admin_session')?.value
  if (!adminSessionToken) return false
  const session = await verifyToken(adminSessionToken)
  return !!session
}

export async function GET() {
  if (!(await isAuthenticated())) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const backupSettings = db.getBackupSettings()
    return NextResponse.json(backupSettings)
  } catch (error) {
    console.error('Error fetching backup settings:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
export const dynamic = 'force-dynamic'
