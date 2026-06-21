import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { logger } from '@/lib/logger'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
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
      timestamp: new Date().toISOString(),
      error: 'Health check failed. Check server logs for details.'
    }, { status: 500 })
  }
}
