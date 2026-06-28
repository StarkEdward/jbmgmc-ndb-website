import React from 'react'
import { db } from '@/lib/db'
import PagesClient from './pages-client'

export const dynamic = 'force-dynamic'

export default function AdminPages() {
  const pages = db.getDynamicPages()

  return <PagesClient initialPages={pages} />
}
