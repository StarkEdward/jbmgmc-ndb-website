import { useState, useEffect } from 'react'
import * as staticData from '@/lib/data'

export function useLiveData() {
  const [data, setData] = useState({
    departments: staticData.departments,
    events: staticData.events,
    news: staticData.news,
    tenders: staticData.tenders,
    courses: staticData.courses,
    authorities: staticData.authorities,
    deanInfo: staticData.deanInfo,
    collegeInfo: staticData.collegeInfo,
    hostelInfo: staticData.hostelInfo,
    galleryImages: staticData.galleryImages,
    heroSlides: [
      { id: 1, image: "/images/college-building.jpg", alt: "JBMGMC Nandurbar Main Building", title: "Jannayak Birsa Munda", subtitle: "Government Medical College", order: 1 },
      { id: 2, image: "/images/campus-view.jpg", alt: "College Campus View", title: "Academic Excellence", subtitle: "Premium Facilities & Labs", order: 2 },
      { id: 3, image: "/images/hospital-building.jpg", alt: "Hospital Building", title: "Tertiary Care Hospital", subtitle: "Serving Nashik Region 24/7", order: 3 }
    ],
    announcementsTicker: [
      { id: 1, text: "PG MD-MS ADMISSION BROCHURE 2025-26 Now Available", pinned: true, order: 1 },
      { id: 2, text: "BSc Nursing Admission Brochure 2025-26 Released", pinned: false, order: 2 },
      { id: 3, text: "MBBS Admission Brochure 2025-26 Published", pinned: false, order: 3 },
      { id: 4, text: "Walk-in Interview for Various Faculty Posts", pinned: false, order: 4 }
    ],
    downloads: [
      { id: 1, name: "MBBS Admission Brochure 2025-26", url: "/downloads/mbbs-brochure.pdf", type: "PDF", order: 1 },
      { id: 2, name: "PG MD-MS Admission Brochure 2025-26", url: "/downloads/pg-brochure.pdf", type: "PDF", order: 2 },
      { id: 3, name: "BSc Nursing Admission Brochure 2025-26", url: "/downloads/nursing-brochure.pdf", type: "PDF", order: 3 },
      { id: 4, name: "Fee Structure & Stipend Payment Info", url: "/downloads/fee-info.pdf", type: "PDF", order: 4 },
      { id: 5, name: "Academic Calendar 2025-26", url: "/downloads/calendar.pdf", type: "PDF", order: 5 }
    ],
    committees: [] as any[],
    libraryInfo: {
      booksCount: 12850,
      journalsCount: 114,
      newspapersCount: 8,
      knimbusUrl: 'https://gmcnandurbar.knimbus.com',
      timings: [
        { day: "Monday - Friday", hours: "9:00 AM - 8:00 PM" },
        { day: "Saturday", hours: "9:00 AM - 5:00 PM" },
        { day: "Sunday / Holidays", hours: "Closed" }
      ],
      rules: [] as string[]
    } as any,
    accreditations: {
      nmcAttendanceUrl: 'https://gmcnur.nmcindia.ac.in/',
      nextgenEhospitalUrl: 'https://nextgen.ehospital.gov.in/login',
      muhsAffiliationLetterUrl: '/downloads/muhs-affiliation.pdf',
      visitorCount: 678582
    } as any,
    navItems: [] as any[],
    quickLinks: [] as any[],
    statCounters: [] as any[],
    testimonials: [] as any[],
    customBlocks: [] as any[]
  })

  useEffect(() => {
    async function fetchLive() {
      try {
        const res = await fetch('/api/public-data')
        if (res.ok) {
          const live = await res.json()
          if (live && !live.error) {
            setData({
              departments: live.departments || staticData.departments,
              events: live.events || staticData.events,
              news: live.news || staticData.news,
              tenders: live.tenders || staticData.tenders,
              courses: live.courses || staticData.courses,
              authorities: live.authorities || staticData.authorities,
              deanInfo: live.deanInfo || staticData.deanInfo,
              collegeInfo: live.collegeInfo || staticData.collegeInfo,
              hostelInfo: live.hostelInfo || staticData.hostelInfo,
              galleryImages: live.galleryImages || staticData.galleryImages,
              heroSlides: live.heroSlides || [],
              announcementsTicker: live.announcementsTicker || [],
              downloads: live.downloads || [],
              committees: live.committees || [],
              libraryInfo: live.libraryInfo || {},
              accreditations: live.accreditations || {},
              navItems: live.navItems || [],
              quickLinks: live.quickLinks || [],
              statCounters: live.statCounters || [],
              testimonials: live.testimonials || [],
              customBlocks: live.customBlocks || []
            })
          }
        }
      } catch (e) {
        console.error('Error loading live website data:', e)
      }
    }

    fetchLive()
  }, [])

  return data
}
export default useLiveData
