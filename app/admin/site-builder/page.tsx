import React from 'react'
import { db } from '@/lib/db'
import SiteBuilderClient from './site-builder-client'

export const dynamic = 'force-dynamic'

export default function SiteBuilderPage() {
  const navItems = db.getNavItems()
  const quickLinks = db.getQuickLinks()
  const statCounters = db.getStatCounters()
  const testimonials = db.getTestimonials()
  const customBlocks = db.getCustomBlocks()

  return (
    <SiteBuilderClient 
      initialNavItems={navItems}
      initialQuickLinks={quickLinks}
      initialStatCounters={statCounters}
      initialTestimonials={testimonials}
      initialCustomBlocks={customBlocks}
    />
  )
}
