import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Increment visitor count on every fetch of main public data
    db.incrementVisitorCount()

    return NextResponse.json({
      departments: db.getDepartments(),
      events: db.getEvents(),
      news: db.getNews(),
      courses: db.getCourses(),
      authorities: db.getAuthorities(),
      deanInfo: db.getDeanInfo(),
      collegeInfo: db.getCollegeInfo(),
      hostelInfo: db.getHostelInfo(),
      galleryImages: db.getGallery(),
      heroSlides: db.getHeroSlides(),
      announcementsTicker: db.getTickerBulletins(),
      downloads: db.getDownloads(),
      committees: db.getCommittees(),
      tenders: db.getTenders(),
      libraryInfo: db.getLibraryInfo(),
      accreditations: db.getAccreditations(),
      navItems: db.getNavItems(),
      quickLinks: db.getQuickLinks(),
      statCounters: db.getStatCounters(),
      testimonials: db.getTestimonials(),
      customBlocks: db.getCustomBlocks()
    })
  } catch (error: any) {
    console.error('Error fetching public data:', error)
    return NextResponse.json({ error: 'Failed to fetch public data' }, { status: 508 })
  }
}
export const dynamic = 'force-dynamic'
