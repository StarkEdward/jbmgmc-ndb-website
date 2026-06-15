import fs from 'fs'
import path from 'path'

// Define interfaces for TypeScript safety
export interface Doctor {
  name: string
  designation: string
  qualification: string
  experience: string
  email?: string
  regNo?: string
  photo?: string
}

export interface NonTeachingStaff {
  post: string
  name: string
}

export interface DesignationDuty {
  designation: string
  responsibilities: string[]
}

export interface Publication {
  title: string
  journal?: string
  indexed?: string
  database?: string
}

export interface DoctorPublications {
  doctorName: string;
  publications: (string | Publication)[];
}

export interface Department {
  id: string
  name: string
  description: string
  fullDescription: string
  facilities: string[]
  doctors: Doctor[]
  category?: string
  pdfLink?: string
  
  // Extended fields for detailed department pages (e.g., Physiology)
  curriculumLink?: string
  goals?: string[]
  objectives?: string[]
  skills?: string[]
  nonTeachingStaff?: NonTeachingStaff[]
  duties?: DesignationDuty[]
  researchPublications?: DoctorPublications[]
  equipments?: string[]
  equipmentDetails?: { name: string; required: string; available: string }[]
  libraryBooks?: { accNo: string; author: string; title: string; edition: string; publisher: string; qty: string }[]
  services?: { name: string; description: string }[]
  labInvestigations?: { year: string; ipdOpd: string; histopathology: string; cytology: string; total: string }[]
  courses?: { courseName: string; intake: string }[]
  academicActivities?: string[]
}

export interface EventItem {
  id: number
  title: string
  date: string
  description: string
  fullDescription?: string
}

export interface NewsItem {
  date: string
  title: string
  description: string
}

export interface Course {
  id: string
  name: string
  fullName: string
  duration: string
  seats: number | string
  eligibility: string
  description: string
}

export interface Authority {
  name: string
  designation: string
  category: 'minister' | 'authority'
  image: string
}

export interface DeanInfo {
  name: string
  qualification: string
  designation: string
  message: string
}

export interface CollegeInfo {
  name: string
  nameMarathi: string
  shortName: string
  established: string
  area: string
  address: string
  phone: string
  email: string
  about: string
}

export interface HostelSpec {
  name: string
  capacity: number
  facilities: string[]
  rules: string[]
}

export interface HostelInfo {
  boys: HostelSpec
  girls: HostelSpec
  pgHostel: HostelSpec
}

export interface GalleryImage {
  id: number
  title: string
  category: 'campus' | 'academics' | 'hospital'
  image: string
  alt: string
}

export interface HeroSlide {
  id: number
  image: string
  alt: string
  title: string
  subtitle: string
  order: number
}

export interface TickerBulletin {
  id: number
  text: string
  pinned: boolean
  order: number
}

export interface DownloadItem {
  id: number
  name: string
  url: string
  type: string
  order: number
}

export interface TenderItem {
  id: number
  date: string
  title: string
  url: string
}

export interface CommitteeMember {
  name: string
  designation: string
  role: string
}

export interface CommitteeItem {
  id: string
  name: string
  helpline: string
  chairperson: string
  members: CommitteeMember[]
}

export interface LibraryTiming {
  day: string
  hours: string
}

export interface LibraryInfo {
  booksCount: number
  journalsCount: number
  newspapersCount: number
  knimbusUrl: string
  timings: LibraryTiming[]
  rules: string[]
  introText?: string
  elibraryRules?: string[]
  questionPapersText?: string
}

export interface AccreditationInfo {
  nmcAttendanceUrl: string
  nextgenEhospitalUrl: string
  muhsAffiliationLetterUrl: string
  visitorCount: number
}

export interface NavigationItem {
  id: string
  label: string
  href: string
  order: number
  submenus: { id: string, label: string, href: string, order: number }[]
}

export interface QuickLink {
  id: string
  label: string
  href: string
  icon: string
  order: number
}

export interface StatCounter {
  id: string
  label: string
  countValue: string
  icon: string
  order: number
}

export interface Testimonial {
  id: string
  authorName: string
  role: string
  content: string
  image: string
}

export interface CustomBlock {
  id: string
  title: string
  content: string
  active: boolean
}

export interface DynamicPage {
  slug: string
  title: string
  content: string
}

export interface AboutSettings {
  milestones: { year: string; title: string; description: string }[]
  values: { iconName: string; title: string; description: string }[]
  vision: string
  mission: string[]
  stats: { value: string; label: string; subLabel: string }[]
}

export interface AcademicsSettings {
  overviewText: string
  admissionSteps: { step: number; title: string; description: string }[]
}

export interface CampusStats {
  clinicalDepartmentsCount: string
  specialistDoctorsCount: string
  emergencyServicesText: string
  bedsCount: string
  hostelBuildingsCount: string
  hostelCapacityCount: string
  mealsDailyCount: string
}

export interface DatabaseSchema {
  departments: Department[]
  events: EventItem[]
  news: NewsItem[]
  courses: Course[]
  authorities: Authority[]
  deanInfo: DeanInfo
  collegeInfo: CollegeInfo
  hostelInfo: HostelInfo
  galleryImages: GalleryImage[]
  heroSlides: HeroSlide[]
  announcementsTicker: TickerBulletin[]
  downloads: DownloadItem[]
  tenders?: TenderItem[]
  committees?: CommitteeItem[]
  libraryInfo?: LibraryInfo
  accreditations?: AccreditationInfo
  navItems?: NavigationItem[]
  quickLinks?: QuickLink[]
  statCounters?: StatCounter[]
  testimonials?: Testimonial[]
  customBlocks?: CustomBlock[]
  dynamicPages?: DynamicPage[]
  aboutSettings?: AboutSettings
  academicsSettings?: AcademicsSettings
  campusStats?: CampusStats
}

const DB_PATH = path.join(process.cwd(), 'data', 'db.json')

class JSONDatabase {
  private cachedData: DatabaseSchema | null = null
  private lastMtime: number = 0

  private getRawData(): DatabaseSchema {
    try {
      if (!fs.existsSync(DB_PATH)) {
        throw new Error('Database file does not exist.')
      }
      
      const stats = fs.statSync(DB_PATH)
      if (this.cachedData && this.lastMtime === stats.mtimeMs) {
        return this.cachedData
      }

      const raw = fs.readFileSync(DB_PATH, 'utf-8')
      this.cachedData = JSON.parse(raw) as DatabaseSchema
      this.lastMtime = stats.mtimeMs
      return this.cachedData
    } catch (e) {
      console.error('Error reading database:', e)
      return {
        departments: [],
        events: [],
        news: [],
        courses: [],
        authorities: [],
        deanInfo: { name: '', qualification: '', designation: '', message: '' },
        collegeInfo: { name: '', nameMarathi: '', shortName: '', established: '', area: '', address: '', phone: '', email: '', about: '' },
        hostelInfo: {
          boys: { name: 'Boys Hostel', capacity: 0, facilities: [], rules: [] },
          girls: { name: 'Girls Hostel', capacity: 0, facilities: [], rules: [] },
          pgHostel: { name: 'PG Resident Hostel', capacity: 0, facilities: [], rules: [] }
        },
        galleryImages: [],
        heroSlides: [],
        announcementsTicker: [],
        downloads: [],
        navItems: [],
        quickLinks: [],
        statCounters: [],
        testimonials: [],
        customBlocks: [],
        dynamicPages: [],
        aboutSettings: { milestones: [], values: [], vision: '', mission: [], stats: [] },
        academicsSettings: { overviewText: '', admissionSteps: [] },
        campusStats: {
          clinicalDepartmentsCount: '21',
          specialistDoctorsCount: '50+',
          emergencyServicesText: 'Our Emergency Department operates round the clock...',
          bedsCount: '500+',
          hostelBuildingsCount: '3',
          hostelCapacityCount: '550+',
          mealsDailyCount: '3'
        }
      }
    }
  }

  private saveRawData(data: DatabaseSchema): boolean {
    try {
      const dir = path.dirname(DB_PATH)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
      fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8')
      return true
    } catch (e) {
      console.error('Error saving database:', e)
      return false
    }
  }

  // --- READS ---
  public getAllPublicData() {
    const raw = this.getRawData()
    return {
      departments: raw.departments,
      events: raw.events,
      news: raw.news,
      courses: raw.courses,
      authorities: raw.authorities,
      deanInfo: raw.deanInfo,
      collegeInfo: raw.collegeInfo,
      hostelInfo: raw.hostelInfo,
      galleryImages: raw.galleryImages,
      heroSlides: (raw.heroSlides || []).sort((a, b) => a.order - b.order),
      announcementsTicker: (raw.announcementsTicker || []).sort((a, b) => {
        if (a.pinned && !b.pinned) return -1
        if (!a.pinned && b.pinned) return 1
        return a.order - b.order
      }),
      downloads: (raw.downloads || []).sort((a, b) => a.order - b.order),
      committees: raw.committees || [],
      tenders: raw.tenders || [],
      libraryInfo: raw.libraryInfo || {
        booksCount: 0, journalsCount: 0, newspapersCount: 0, knimbusUrl: '', timings: [], rules: []
      },
      accreditations: raw.accreditations || {
        nmcAttendanceUrl: '', nextgenEhospitalUrl: '', muhsAffiliationLetterUrl: '', visitorCount: 678582
      },
      navItems: (raw.navItems || []).sort((a, b) => a.order - b.order),
      quickLinks: (raw.quickLinks || []).sort((a, b) => a.order - b.order),
      statCounters: (raw.statCounters || []).sort((a, b) => a.order - b.order),
      testimonials: raw.testimonials || [],
      customBlocks: raw.customBlocks || []
    }
  }

  public getDepartments(): Department[] {
    return this.getRawData().departments
  }

  public getEvents(): EventItem[] {
    return this.getRawData().events
  }

  public getNews(): NewsItem[] {
    return this.getRawData().news
  }

  public getCourses(): Course[] {
    return this.getRawData().courses
  }

  public getAuthorities(): Authority[] {
    return this.getRawData().authorities
  }

  public getDeanInfo(): DeanInfo {
    return this.getRawData().deanInfo
  }

  public getCollegeInfo(): CollegeInfo {
    return this.getRawData().collegeInfo
  }

  public getHostelInfo(): HostelInfo {
    return this.getRawData().hostelInfo
  }

  public getGallery(): GalleryImage[] {
    return this.getRawData().galleryImages
  }

  public getHeroSlides(): HeroSlide[] {
    return (this.getRawData().heroSlides || []).sort((a, b) => a.order - b.order)
  }

  public getTickerBulletins(): TickerBulletin[] {
    return (this.getRawData().announcementsTicker || []).sort((a, b) => {
      // Pinned items always appear first, then sorted by order
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1
      return a.order - b.order
    })
  }

  public getDownloads(): DownloadItem[] {
    return (this.getRawData().downloads || []).sort((a, b) => a.order - b.order)
  }

  public getTenders(): TenderItem[] {
    return this.getRawData().tenders || []
  }

  public getCommittees(): CommitteeItem[] {
    return this.getRawData().committees || []
  }

  public getLibraryInfo(): LibraryInfo {
    const defaultLibrary: LibraryInfo = {
      booksCount: 0,
      journalsCount: 0,
      newspapersCount: 0,
      knimbusUrl: '',
      timings: [],
      rules: []
    }
    return this.getRawData().libraryInfo || defaultLibrary
  }

  public getAccreditations(): AccreditationInfo {
    const defaultAccreditation: AccreditationInfo = {
      nmcAttendanceUrl: '',
      nextgenEhospitalUrl: '',
      muhsAffiliationLetterUrl: '',
      visitorCount: 0
    }
    return this.getRawData().accreditations || defaultAccreditation
  }

  // --- WRITES (CRUD) ---

  // Departments & Doctors
  public updateDepartment(id: string, updatedFields: Partial<Omit<Department, 'id' | 'doctors'>>): boolean {
    const data = this.getRawData()
    const index = data.departments.findIndex((d) => d.id === id)
    if (index === -1) return false
    
    data.departments[index] = {
      ...data.departments[index],
      ...updatedFields
    }
    return this.saveRawData(data)
  }

  public addDoctor(departmentId: string, doctor: Doctor): boolean {
    const data = this.getRawData()
    const index = data.departments.findIndex((d) => d.id === departmentId)
    if (index === -1) return false
    data.departments[index].doctors.push(doctor)
    return this.saveRawData(data)
  }

  public removeDoctor(departmentId: string, doctorName: string): boolean {
    const data = this.getRawData()
    const index = data.departments.findIndex((d) => d.id === departmentId)
    if (index === -1) return false
    data.departments[index].doctors = data.departments[index].doctors.filter(
      (doc) => doc.name !== doctorName
    )
    return this.saveRawData(data)
  }

  public updateDoctor(departmentId: string, originalName: string, updatedDoctor: Doctor): boolean {
    const data = this.getRawData()
    const deptIndex = data.departments.findIndex((d) => d.id === departmentId)
    if (deptIndex === -1) return false
    
    const docIndex = data.departments[deptIndex].doctors.findIndex((doc) => doc.name === originalName)
    if (docIndex === -1) return false
    
    data.departments[deptIndex].doctors[docIndex] = updatedDoctor
    return this.saveRawData(data)
  }

  // Events CRUD
  public addEvent(event: Omit<EventItem, 'id'>): boolean {
    const data = this.getRawData()
    const newId = data.events.length > 0 ? Math.max(...data.events.map((e) => e.id)) + 1 : 1
    data.events.unshift({ id: newId, ...event })
    return this.saveRawData(data)
  }

  public deleteEvent(id: number): boolean {
    const data = this.getRawData()
    data.events = data.events.filter((e) => e.id !== id)
    return this.saveRawData(data)
  }

  // Tenders CRUD
  public addTender(tender: Omit<TenderItem, 'id'>): boolean {
    const data = this.getRawData()
    if (!data.tenders) data.tenders = []
    const newId = data.tenders.length > 0 ? Math.max(...data.tenders.map((t) => t.id)) + 1 : 1
    data.tenders.unshift({ id: newId, ...tender })
    return this.saveRawData(data)
  }

  public deleteTender(id: number): boolean {
    const data = this.getRawData()
    if (!data.tenders) return false
    data.tenders = data.tenders.filter((t) => t.id !== id)
    return this.saveRawData(data)
  }

  // News CRUD
  public addNews(newsItem: NewsItem): boolean {
    const data = this.getRawData()
    data.news.unshift(newsItem)
    return this.saveRawData(data)
  }

  public deleteNews(title: string): boolean {
    const data = this.getRawData()
    data.news = data.news.filter((n) => n.title !== title)
    return this.saveRawData(data)
  }

  // Gallery CRUD
  public addGalleryImage(imageItem: Omit<GalleryImage, 'id'>): boolean {
    const data = this.getRawData()
    const newId = data.galleryImages.length > 0 ? Math.max(...data.galleryImages.map((g) => g.id)) + 1 : 1
    data.galleryImages.unshift({ id: newId, ...imageItem })
    return this.saveRawData(data)
  }

  public deleteGalleryImage(id: number): boolean {
    const data = this.getRawData()
    data.galleryImages = data.galleryImages.filter((g) => g.id !== id)
    return this.saveRawData(data)
  }

  // Courses & Hostels Updates
  public updateCourse(id: string, updatedFields: Partial<Omit<Course, 'id'>>): boolean {
    const data = this.getRawData()
    const index = data.courses.findIndex((c) => c.id === id)
    if (index === -1) return false
    data.courses[index] = { ...data.courses[index], ...updatedFields }
    return this.saveRawData(data)
  }

  public updateHostelInfo(hostelType: 'boys' | 'girls' | 'pgHostel', updatedFields: Partial<HostelSpec>): boolean {
    const data = this.getRawData()
    data.hostelInfo[hostelType] = { ...data.hostelInfo[hostelType], ...updatedFields }
    return this.saveRawData(data)
  }

  // Authorities Updates
  public updateDeanInfo(updatedFields: Partial<DeanInfo>): boolean {
    const data = this.getRawData()
    data.deanInfo = { ...data.deanInfo, ...updatedFields }
    return this.saveRawData(data)
  }

  public updateCollegeInfo(updatedFields: Partial<CollegeInfo>): boolean {
    const data = this.getRawData()
    data.collegeInfo = { ...data.collegeInfo, ...updatedFields }
    return this.saveRawData(data)
  }

  // --- ADVANCED CONTROLS (PHASE 2) ---

  // Hero Slides
  public addHeroSlide(slide: Omit<HeroSlide, 'id' | 'order'>): boolean {
    const data = this.getRawData()
    const newId = data.heroSlides.length > 0 ? Math.max(...data.heroSlides.map((s) => s.id)) + 1 : 1
    const newOrder = data.heroSlides.length > 0 ? Math.max(...data.heroSlides.map((s) => s.order)) + 1 : 1
    data.heroSlides.push({ id: newId, order: newOrder, ...slide })
    return this.saveRawData(data)
  }

  public deleteHeroSlide(id: number): boolean {
    const data = this.getRawData()
    data.heroSlides = data.heroSlides.filter((s) => s.id !== id)
    return this.saveRawData(data)
  }

  public reorderHeroSlide(id: number, direction: 'up' | 'down'): boolean {
    const data = this.getRawData()
    const list = data.heroSlides.sort((a, b) => a.order - b.order)
    const index = list.findIndex((s) => s.id === id)
    if (index === -1) return false

    if (direction === 'up' && index > 0) {
      const temp = list[index].order
      list[index].order = list[index - 1].order
      list[index - 1].order = temp
    } else if (direction === 'down' && index < list.length - 1) {
      const temp = list[index].order
      list[index].order = list[index + 1].order
      list[index + 1].order = temp
    }

    data.heroSlides = list
    return this.saveRawData(data)
  }

  // Announcements Ticker
  public addTickerBulletin(text: string): boolean {
    const data = this.getRawData()
    const newId = data.announcementsTicker.length > 0 ? Math.max(...data.announcementsTicker.map((t) => t.id)) + 1 : 1
    const newOrder = data.announcementsTicker.length > 0 ? Math.max(...data.announcementsTicker.map((t) => t.order)) + 1 : 1
    data.announcementsTicker.push({ id: newId, text, pinned: false, order: newOrder })
    return this.saveRawData(data)
  }

  public deleteTickerBulletin(id: number): boolean {
    const data = this.getRawData()
    data.announcementsTicker = data.announcementsTicker.filter((t) => t.id !== id)
    return this.saveRawData(data)
  }

  public togglePinTickerBulletin(id: number): boolean {
    const data = this.getRawData()
    const index = data.announcementsTicker.findIndex((t) => t.id === id)
    if (index === -1) return false
    data.announcementsTicker[index].pinned = !data.announcementsTicker[index].pinned
    return this.saveRawData(data)
  }

  public reorderTickerBulletin(id: number, direction: 'up' | 'down'): boolean {
    const data = this.getRawData()
    const list = data.announcementsTicker.sort((a, b) => a.order - b.order)
    const index = list.findIndex((t) => t.id === id)
    if (index === -1) return false

    if (direction === 'up' && index > 0) {
      const temp = list[index].order
      list[index].order = list[index - 1].order
      list[index - 1].order = temp
    } else if (direction === 'down' && index < list.length - 1) {
      const temp = list[index].order
      list[index].order = list[index + 1].order
      list[index + 1].order = temp
    }

    data.announcementsTicker = list
    return this.saveRawData(data)
  }

  // PDF Download Brochures
  public addDownloadItem(name: string, url: string): boolean {
    const data = this.getRawData()
    const newId = data.downloads.length > 0 ? Math.max(...data.downloads.map((d) => d.id)) + 1 : 1
    const newOrder = data.downloads.length > 0 ? Math.max(...data.downloads.map((d) => d.order)) + 1 : 1
    data.downloads.push({ id: newId, name, url, type: 'PDF', order: newOrder })
    return this.saveRawData(data)
  }

  public deleteDownloadItem(id: number): boolean {
    const data = this.getRawData()
    data.downloads = data.downloads.filter((d) => d.id !== id)
    return this.saveRawData(data)
  }

  public reorderDownloadItem(id: number, direction: 'up' | 'down'): boolean {
    const data = this.getRawData()
    const list = data.downloads.sort((a, b) => a.order - b.order)
    const index = list.findIndex((d) => d.id === id)
    if (index === -1) return false

    if (direction === 'up' && index > 0) {
      const temp = list[index].order
      list[index].order = list[index - 1].order
      list[index - 1].order = temp
    } else if (direction === 'down' && index < list.length - 1) {
      const temp = list[index].order
      list[index].order = list[index + 1].order
      list[index + 1].order = temp
    }

    data.downloads = list
    return this.saveRawData(data)
  }

  // --- PHASE 3 COMMITTEES & LIBRARY WRITES ---

  // Committees Member Operations
  public addCommitteeMember(committeeId: string, member: CommitteeMember): boolean {
    const data = this.getRawData()
    if (!data.committees) data.committees = []
    const index = data.committees.findIndex((c) => c.id === committeeId)
    if (index === -1) return false
    data.committees[index].members.push(member)
    return this.saveRawData(data)
  }

  public removeCommitteeMember(committeeId: string, memberName: string): boolean {
    const data = this.getRawData()
    if (!data.committees) return false
    const index = data.committees.findIndex((c) => c.id === committeeId)
    if (index === -1) return false
    data.committees[index].members = data.committees[index].members.filter(
      (m) => m.name !== memberName
    )
    return this.saveRawData(data)
  }

  public updateCommitteeChairperson(committeeId: string, chairperson: string, helpline: string): boolean {
    const data = this.getRawData()
    if (!data.committees) return false
    const index = data.committees.findIndex((c) => c.id === committeeId)
    if (index === -1) return false
    data.committees[index].chairperson = chairperson
    data.committees[index].helpline = helpline
    return this.saveRawData(data)
  }

  // Library Updates
  public updateLibraryInfo(fields: Partial<LibraryInfo>): boolean {
    const data = this.getRawData()
    if (!data.libraryInfo) {
      data.libraryInfo = {
        booksCount: 0,
        journalsCount: 0,
        newspapersCount: 0,
        knimbusUrl: '',
        timings: [],
        rules: []
      }
    }
    data.libraryInfo = {
      ...data.libraryInfo,
      ...fields
    }
    return this.saveRawData(data)
  }

  // Accreditations Updates
  public updateAccreditationInfo(fields: Partial<AccreditationInfo>): boolean {
    const data = this.getRawData()
    if (!data.accreditations) {
      data.accreditations = {
        nmcAttendanceUrl: '',
        nextgenEhospitalUrl: '',
        muhsAffiliationLetterUrl: '',
        visitorCount: 678582
      }
    }
    data.accreditations = {
      ...data.accreditations,
      ...fields
    }
    return this.saveRawData(data)
  }

  // Increment Visitor Count (Asynchronous & Decoupled to avoid blocking page loads)
  public async incrementVisitorCount(): Promise<boolean> {
    try {
      const visitorFile = path.join(process.cwd(), 'data', 'visitor-count.json')
      let count = 678582
      
      if (fs.existsSync(visitorFile)) {
        const raw = await fs.promises.readFile(visitorFile, 'utf-8')
        count = JSON.parse(raw).count || count
      } else {
        // Fallback to db.json migration if it exists
        const data = this.getRawData()
        if (data.accreditations?.visitorCount) {
          count = data.accreditations.visitorCount
        }
      }
      
      count += 1
      await fs.promises.writeFile(visitorFile, JSON.stringify({ count }), 'utf-8')
      return true
    } catch (e) {
      console.error('Error incrementing visitor count asynchronously:', e)
      return false
    }
  }

  // --- PHASE 4 SITE BUILDER READS ---
  public getNavItems(): NavigationItem[] {
    return (this.getRawData().navItems || []).sort((a, b) => a.order - b.order)
  }

  public getQuickLinks(): QuickLink[] {
    return (this.getRawData().quickLinks || []).sort((a, b) => a.order - b.order)
  }

  public getStatCounters(): StatCounter[] {
    return (this.getRawData().statCounters || []).sort((a, b) => a.order - b.order)
  }

  public getTestimonials(): Testimonial[] {
    return this.getRawData().testimonials || []
  }

  public getCustomBlocks(): CustomBlock[] {
    return this.getRawData().customBlocks || []
  }

  // --- PHASE 4 SITE BUILDER WRITES ---
  public updateNavItems(items: NavigationItem[]): boolean {
    const data = this.getRawData()
    data.navItems = items
    return this.saveRawData(data)
  }

  public updateQuickLinks(items: QuickLink[]): boolean {
    const data = this.getRawData()
    data.quickLinks = items
    return this.saveRawData(data)
  }

  public updateStatCounters(items: StatCounter[]): boolean {
    const data = this.getRawData()
    data.statCounters = items
    return this.saveRawData(data)
  }

  public updateTestimonials(items: Testimonial[]): boolean {
    const data = this.getRawData()
    data.testimonials = items
    return this.saveRawData(data)
  }

  public updateCustomBlocks(items: CustomBlock[]): boolean {
    const data = this.getRawData()
    data.customBlocks = items
    return this.saveRawData(data)
  }

  // --- NEW: ADVANCED DYNAMIC SETTINGS ---
  public getAboutSettings(): AboutSettings {
    return this.getRawData().aboutSettings || { milestones: [], values: [], vision: '', mission: [], stats: [] }
  }

  public updateAboutSettings(settings: AboutSettings): boolean {
    const data = this.getRawData()
    data.aboutSettings = settings
    return this.saveRawData(data)
  }

  public getAcademicsSettings(): AcademicsSettings {
    return this.getRawData().academicsSettings || { overviewText: '', admissionSteps: [] }
  }

  public updateAcademicsSettings(settings: AcademicsSettings): boolean {
    const data = this.getRawData()
    data.academicsSettings = settings
    return this.saveRawData(data)
  }

  public getCampusStats(): CampusStats {
    return this.getRawData().campusStats || {
      clinicalDepartmentsCount: '21',
      specialistDoctorsCount: '50+',
      emergencyServicesText: 'Our Emergency Department operates round the clock...',
      bedsCount: '500+',
      hostelBuildingsCount: '3',
      hostelCapacityCount: '550+',
      mealsDailyCount: '3'
    }
  }

  public updateCampusStats(settings: CampusStats): boolean {
    const data = this.getRawData()
    data.campusStats = settings
    return this.saveRawData(data)
  }

  public getDynamicPages(): DynamicPage[] {
    return this.getRawData().dynamicPages || []
  }

  public getDynamicPage(slug: string): DynamicPage | undefined {
    return this.getDynamicPages().find(p => p.slug === slug)
  }

  public updateDynamicPage(page: DynamicPage): boolean {
    const data = this.getRawData()
    if (!data.dynamicPages) data.dynamicPages = []
    
    const idx = data.dynamicPages.findIndex(p => p.slug === page.slug)
    if (idx >= 0) {
      data.dynamicPages[idx] = page
    } else {
      data.dynamicPages.push(page)
    }
    return this.saveRawData(data)
  }

  public deleteDynamicPage(slug: string): boolean {
    const data = this.getRawData()
    if (!data.dynamicPages) return false
    data.dynamicPages = data.dynamicPages.filter(p => p.slug !== slug)
    return this.saveRawData(data)
  }
}

export const db = new JSONDatabase()
