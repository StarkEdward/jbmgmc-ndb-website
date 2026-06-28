import React from 'react'
import { db } from '@/lib/db'
import NewsEventsClient from './news-events-client'

export const dynamic = 'force-dynamic'

export default function AdminNewsEventsPage() {
  const newsEvents = db.getNewsEvents()
  const tenders = db.getTenders()

  return (
    <NewsEventsClient initialNewsEvents={newsEvents} initialTenders={tenders} />
  )
}
