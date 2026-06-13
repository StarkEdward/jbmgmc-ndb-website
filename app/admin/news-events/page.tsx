import React from 'react'
import { db } from '@/lib/db'
import NewsEventsClient from './news-events-client'

export const dynamic = 'force-dynamic'

export default function AdminNewsEventsPage() {
  const news = db.getNews()
  const events = db.getEvents()
  const tenders = db.getTenders()

  return (
    <NewsEventsClient initialNews={news} initialEvents={events} initialTenders={tenders} />
  )
}
