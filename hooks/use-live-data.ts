import { useContext } from 'react'
import { LiveDataContext } from '@/components/providers/live-data-provider'
import * as staticData from '@/lib/data'

export function useLiveData() {
  const context = useContext(LiveDataContext)
  
  // If used outside provider (shouldn't happen, but safe fallback)
  if (!context) {
    return {
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
      heroSlides: [],
      announcementsTicker: [],
      downloads: [],
      committees: [],
      libraryInfo: {},
      accreditations: {},
      navItems: [],
      quickLinks: [],
      institutionMetrics: null,
      testimonials: [],
      footerPages: []
    }
  }

  return context
}

export default useLiveData
