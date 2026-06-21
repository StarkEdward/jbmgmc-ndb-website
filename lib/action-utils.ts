import { logger } from './logger'
import { cookies } from 'next/headers'
import { verifyToken } from './session'

export async function runAction<T extends { success: boolean }>(
  category: string,
  op: () => Promise<T>
): Promise<T & { error?: string }> {
  try {
    // Enforce administrative session auth check for all wrapped server actions (NEW 15)
    const cookieStore = await cookies()
    const token = cookieStore.get('admin_session')?.value
    if (!token) {
      return { success: false, error: 'Unauthorized: Missing session token' } as any
    }
    const session = await verifyToken(token)
    if (!session) {
      return { success: false, error: 'Unauthorized: Invalid or expired session' } as any
    }

    const res = await op()
    if (res && !res.success) {
      if (!('error' in res)) {
        return { ...(res as any), error: 'Operation failed on server' }
      }
    }
    return res as any
  } catch (err: any) {
    const errorMsg = err.message || 'An unexpected error occurred'
    logger.error('SERVER_ACTION_ERROR', `${category} action failed: ${errorMsg}`, {
      error: err.stack || err.toString()
    })
    return { success: false, error: errorMsg } as any
  }
}
