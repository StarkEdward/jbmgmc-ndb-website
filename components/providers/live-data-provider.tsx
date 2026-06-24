"use client"

import React, { createContext } from 'react'
import * as staticData from '@/lib/data'

export const LiveDataContext = createContext<any>(null)

export function LiveDataProvider({ 
  children, 
  initialData 
}: { 
  children: React.ReactNode
  initialData: any 
}) {
  // We use the same structure as the old useLiveData hook to parse the database payload.
  // We do this once here, instantly on the server or first hydration.
  const live = initialData || {}

  const parsedData = {
    departments: live.departments || staticData.departments,
    newsEvents: live.newsEvents || [],
    eventBlogs: live.eventBlogs || [],
    tenders: live.tenders || staticData.tenders,
    courses: live.courses || staticData.courses,
    authorities: live.authorities || staticData.authorities,
    deanInfo: live.deanInfo || staticData.deanInfo,
    collegeInfo: live.collegeInfo || staticData.collegeInfo,
    hostelInfo: live.hostelInfo || staticData.hostelInfo,
    galleryImages: live.galleryImages || staticData.galleryImages,
    heroSlides: (live.heroSlides && live.heroSlides.length > 0) ? live.heroSlides : [
      { id: 1, image: "/images/college-building.webp", alt: "JBMGMC Nandurbar Main Building", title: "Jannayak Birsa Munda", subtitle: "Government Medical College", order: 1 },
      { id: 2, image: "/images/campus-view.webp", alt: "College Campus View", title: "Academic Excellence", subtitle: "Premium Facilities & Labs", order: 2 },
      { id: 3, image: "/images/hospital-building.webp", alt: "Hospital Building", title: "Tertiary Care Hospital", subtitle: "Serving Nashik Region 24/7", order: 3 }
    ],
    announcementsTicker: (live.announcementsTicker && live.announcementsTicker.length > 0) ? live.announcementsTicker : [
      { id: 1, text: "PG MD-MS ADMISSION BROCHURE 2025-26 Now Available", pinned: true, order: 1 },
      { id: 2, text: "BSc Nursing Admission Brochure 2025-26 Released", pinned: false, order: 2 },
      { id: 3, text: "MBBS Admission Brochure 2025-26 Published", pinned: false, order: 3 },
      { id: 4, text: "Walk-in Interview for Various Faculty Posts", pinned: false, order: 4 }
    ],
    downloads: (live.downloads && live.downloads.length > 0) ? live.downloads : [
      { id: 1, name: "MBBS Admission Brochure 2025-26", url: "/downloads/mbbs-brochure.pdf", type: "PDF", order: 1 },
      { id: 2, name: "PG MD-MS Admission Brochure 2025-26", url: "/downloads/pg-brochure.pdf", type: "PDF", order: 2 },
      { id: 3, name: "BSc Nursing Admission Brochure 2025-26", url: "/downloads/nursing-brochure.pdf", type: "PDF", order: 3 },
      { id: 4, name: "Fee Structure & Stipend Payment Info", url: "/downloads/fee-info.pdf", type: "PDF", order: 4 },
      { id: 5, name: "Academic Calendar 2025-26", url: "/downloads/calendar.pdf", type: "PDF", order: 5 }
    ],
    committees: live.committees || [],
    libraryInfo: live.libraryInfo || {
      booksCount: 12850,
      journalsCount: 114,
      newspapersCount: 8,
      knimbusUrl: 'https://gmcnandurbar.knimbus.com',
      timings: [
        { day: "Monday - Friday", hours: "9:00 AM - 8:00 PM" },
        { day: "Saturday", hours: "9:00 AM - 5:00 PM" },
        { day: "Sunday / Holidays", hours: "Closed" }
      ],
      rules: []
    },
    accreditations: live.accreditations || {
      nmcAttendanceUrl: 'https://gmcnur.nmcindia.ac.in/',
      nextgenEhospitalUrl: 'https://nextgen.ehospital.gov.in/login',
      muhsAffiliationLetterUrl: '/downloads/muhs-affiliation.pdf',
      visitorCount: 678582
    },
    navItems: live.navItems || [],
    quickLinks: live.quickLinks || [],
    institutionMetrics: live.institutionMetrics || null,
    testimonials: live.testimonials || [],
    footerPages: live.footerPages || []
  }

  return (
    <LiveDataContext.Provider value={parsedData}>
      {children}
    </LiveDataContext.Provider>
  )
}
