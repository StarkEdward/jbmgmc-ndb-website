import React from 'react'
import { db } from '@/lib/db'
import SiteBuilderClient from './site-builder-client'

export const dynamic = 'force-dynamic'

export default function SiteBuilderPage() {
  const navItems = db.getNavItems()
  const quickLinks = db.getQuickLinks()
  const testimonials = db.getTestimonials()
  return (
    <SiteBuilderClient 
      initialNavItems={navItems}
      initialQuickLinks={quickLinks}
      initialTestimonials={testimonials}
    />
  )
}
