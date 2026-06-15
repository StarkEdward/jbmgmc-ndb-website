import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
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
