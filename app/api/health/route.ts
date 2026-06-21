import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { logger } from '@/lib/logger'
import { getClientIp } from '@/lib/ip'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const ip = await getClientIp()
    // Only allow database queries and health checks from trusted/internal IPs
    if (ip !== '127.0.0.1' && ip !== '::1' && !ip.startsWith('10.') && !ip.startsWith('192.168.')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Verify database readability
    db.getDepartments()

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString()
    }, { status: 200 })
  } catch (err: any) {
    logger.error('HEALTH_CHECK_FAILED', `Application health check failed: ${err.message}`, {
      error: err.stack || err.toString()
    })

    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
