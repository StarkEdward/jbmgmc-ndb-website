import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { checkRateLimit, recordAttempt } from '@/lib/rate-limiter'
import { getClientIp } from '@/lib/ip'

export async function GET() {
  try {
    // Extract client IP address safely
    const ip = await getClientIp()

    // Rate limiting check
    const limitCheck = checkRateLimit(ip, 'publicData')
    if (!limitCheck.allowed) {
      const minutesLeft = Math.ceil(limitCheck.timeLeftSeconds / 60)
      return NextResponse.json({ error: `Too many requests. Locked out for ${minutesLeft} minutes.` }, { status: 429 })
    }

    // Record the publicData request attempt
    const attempt = recordAttempt(ip, 'publicData', false)
    if (attempt.blocked) {
      const minutesLeft = Math.ceil(attempt.timeLeftSeconds / 60)
      return NextResponse.json({ error: `Request limit exceeded. You have been locked out for ${minutesLeft} minutes.` }, { status: 429 })
    }

    // Fire and forget visitor count asynchronously (DO NOT AWAIT)
    db.incrementVisitorCount().catch(console.error)

    // Fetch all public data in one pass (no redundant disk reads)
    const allData = db.getAllPublicData()

    return NextResponse.json(allData)
  } catch (error: any) {
    console.error('Error fetching public data:', error)
    return NextResponse.json({ error: 'Failed to fetch public data' }, { status: 500 })
  }
}
export const dynamic = 'force-dynamic'
