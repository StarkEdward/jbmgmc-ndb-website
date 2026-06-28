import fs from 'fs'
import path from 'path'
import { logger } from './logger'
import { sanitizeHtml } from './sanitize'

// Define interfaces for TypeScript safety
export function formatDate(dateString: string): string {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString // fallback for legacy strings if any
    return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(date)
  } catch (e) {
    return dateString
  }
}

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
  photo?: string
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

export interface NewsEventItem {
  id: number
  title: string
  date: string
  description: string
  type: 'news' | 'event'
  fullArticle?: string
  pdfUrl?: string
  imageUrl?: string
  imageUrls?: string[]
  isNew?: boolean
  showInBanner?: boolean
  isUrgent?: boolean
  showInPopup?: boolean
  popupStartDate?: string
  popupEndDate?: string
  popupType?: "important" | "general" | "admission" | "exam"
}

export interface EventBlogItem {
  id: number
  title: string
  date: string
  description?: string
  fullArticle?: string
  content: string
  photos: string[]
  youtubeVideoUrl?: string
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
  category: 'minister' | 'authority' | 'leadership'
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
  category: 'campus' | 'academics' | 'hospital' | 'events' | 'convocation' | 'sports' | 'cultural'
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
  title: string
  url: string
  date?: string
  publishDate?: string
  dueDate?: string
  isHidden?: boolean
  isNew?: boolean
}

export interface CommitteeMember {
  name: string
  designation: string
  role: string
  phone?: string
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
  category?: 'quick' | 'useful'
}

export interface InstitutionMetrics {
  academicStats: {
    ugSeats: number
    pgSeats: number
    nursingSeats: number
    paramedicalSeats: number
    departments: number
    facultyMembers: number
    currentStudents: number
  }
  hospitalStats: {
    dailyOutpatients: number
    dailyInpatients: number
    beds: number
    icuBeds: number
    operationTheaters: number
    specialties: number
    surgeriesPerMonth: number
    dailyEmergencies: number
    ruralHealthCenters: number
  }
  campusStats: {
    campusAcres: number
    builtUpArea: number
    hostelCapacity: number
    libraryBooks: number
    laboratories: number
  }
}

export interface Testimonial {
  id: string
  authorName: string
  role: string
  content: string
  image: string
}

export interface DynamicPage {
  slug: string
  title: string
  content: string
  status?: 'published' | 'draft'
  metaDescription?: string
  keywords?: string
  showInFooter?: boolean
}

export interface AboutSettings {
  milestones: { year: string; title: string; description: string }[]
  values: { iconName: string; title: string; description: string }[]
  vision: string
  mission: string[]
}

export interface AcademicsSettings {
  overviewText: string
  admissionSteps: { step: number; title: string; description: string }[]
}



export interface AdminCredentials {
  username?: string
  passwordHash?: string
}

export interface DatabaseSchema {
  departments: Department[]
  events?: any[]
  news?: any[]
  newsEvents: NewsEventItem[]
  eventBlogs: EventBlogItem[]
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
  testimonials?: Testimonial[]
  dynamicPages?: DynamicPage[]
  aboutSettings?: AboutSettings
  academicsSettings?: AcademicsSettings
  institutionMetrics?: InstitutionMetrics
  adminCredentials?: AdminCredentials
  storageOverrides?: { forcedOrphans: string[] }
}

const DB_DIR = process.env.DATABASE_PATH
  ? path.resolve(process.env.DATABASE_PATH)
  : path.join(process.cwd(), 'data')

const DB_FILES = {
  departments: path.join(DB_DIR, 'departments.json'),
  newsEvents: path.join(DB_DIR, 'news_events.json'),
  galleryHero: path.join(DB_DIR, 'gallery_hero.json'),
  pagesNav: path.join(DB_DIR, 'pages_nav.json'),
  settings: path.join(DB_DIR, 'settings.json')
}

class JSONDatabase {
  private cachedData: DatabaseSchema | null = null
  private lastMtime: Record<keyof typeof DB_FILES, number> = {
    departments: 0,
    newsEvents: 0,
    galleryHero: 0,
    pagesNav: 0,
    settings: 0
  }
  private writeQueue: Promise<any> = Promise.resolve()
  private reloadPromise: Record<keyof typeof DB_FILES, Promise<void> | null> = {
    departments: null,
    newsEvents: null,
    galleryHero: null,
    pagesNav: null,
    settings: null
  }
  private pendingReload: Record<keyof typeof DB_FILES, boolean> = {
    departments: false,
    newsEvents: false,
    galleryHero: false,
    pagesNav: false,
    settings: false
  }
  private lastCheckTime = 0
  private CHECK_INTERVAL = 1000 // 1 second

  constructor() {
    this.initCache()
  }

  private initCache() {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true })
      }

      // 1. Legacy db.json auto-migration
      const legacyPath = path.join(DB_DIR, 'db.json')
      const backupLegacyPath = legacyPath + '.bak'
      let migratedByMe = false

      if (fs.existsSync(legacyPath)) {
        try {
          fs.renameSync(legacyPath, backupLegacyPath)
          migratedByMe = true
        } catch (err) {
          // Another worker got to it first
        }
      }

      if (migratedByMe) {
        console.log('Legacy database file db.json found. Migrating to split database files...')
        try {
          const raw = fs.readFileSync(backupLegacyPath, 'utf-8')
          const legacyData = JSON.parse(raw) as DatabaseSchema
          
          this.writeGroupSync('departments', { departments: legacyData.departments || [] })
          this.writeGroupSync('newsEvents', {
            newsEvents: [
              ...(legacyData.events || []).map(e => ({ id: e.id, title: e.title, date: e.date, description: e.description, fullArticle: (e as any).fullDescription, type: 'event' as const })),
              ...(legacyData.news || []).map((n, idx) => ({ id: Date.now() + idx, title: n.title, date: n.date, description: n.description, type: 'news' as const }))
            ],
            eventBlogs: [],
            tenders: legacyData.tenders || [],
            courses: legacyData.courses || []
          })
          this.writeGroupSync('galleryHero', {
            galleryImages: legacyData.galleryImages || [],
            heroSlides: legacyData.heroSlides || []
          })
          this.writeGroupSync('pagesNav', {
            dynamicPages: legacyData.dynamicPages || [],
            navItems: legacyData.navItems || [],
            quickLinks: legacyData.quickLinks || [],
            downloads: legacyData.downloads || [],
            testimonials: legacyData.testimonials || [],
            announcementsTicker: legacyData.announcementsTicker || []
          })
          this.writeGroupSync('settings', {
            deanInfo: legacyData.deanInfo || { name: '', qualification: '', designation: '', message: '' },
            collegeInfo: legacyData.collegeInfo || { name: '', nameMarathi: '', shortName: '', established: '', area: '', address: '', phone: '', email: '', about: '' },
            hostelInfo: legacyData.hostelInfo || {
              boys: { name: 'Boys Hostel', capacity: 0, facilities: [], rules: [] },
              girls: { name: 'Girls Hostel', capacity: 0, facilities: [], rules: [] },
              pgHostel: { name: 'PG Resident Hostel', capacity: 0, facilities: [], rules: [] }
            },
            committees: legacyData.committees || [],
            libraryInfo: legacyData.libraryInfo || { journalsCount: 50, newspapersCount: 10, knimbusUrl: 'https://knimbus.com/login', timings: [], rules: [] },
            accreditations: legacyData.accreditations || { nmcAttendanceUrl: '', nextgenEhospitalUrl: '', muhsAffiliationLetterUrl: '', visitorCount: 678582 },
            aboutSettings: legacyData.aboutSettings || { milestones: [], values: [], vision: '', mission: [] },
            academicsSettings: legacyData.academicsSettings || { overviewText: '', admissionSteps: [] },
            institutionMetrics: legacyData.institutionMetrics || {
              academicStats: { ugSeats: 150, pgSeats: 50, nursingSeats: 60, paramedicalSeats: 40, departments: 0, facultyMembers: 0, currentStudents: 800 },
              hospitalStats: { dailyOutpatients: 1200, dailyInpatients: 400, beds: 500, icuBeds: 50, operationTheaters: 10, specialties: 15, surgeriesPerMonth: 300, dailyEmergencies: 150, ruralHealthCenters: 3 },
              campusStats: { campusAcres: 25, builtUpArea: 150000, hostelCapacity: 0, libraryBooks: 12000, laboratories: 15 }
            },
            adminCredentials: legacyData.adminCredentials || { username: 'admin', passwordHash: '' },
            authorities: legacyData.authorities || []
          })
          console.log('Database migration complete. Legacy file backed up to db.json.bak.')
        } catch (migErr) {
          console.error('Error during legacy database migration:', migErr)
        }
      }

      // Initialize cachedData
      this.cachedData = this.getDefaultSchema()
      
      // Load all groups into memory
      for (const group of Object.keys(DB_FILES) as Array<keyof typeof DB_FILES>) {
        const filePath = DB_FILES[group]
        const seedPath = path.join(process.cwd(), 'data-seed', path.basename(filePath))
        
        // 1. Try to initialize from data-seed if file doesn't exist
        if (!fs.existsSync(filePath)) {
          try {
            if (fs.existsSync(seedPath)) {
              fs.copyFileSync(seedPath, filePath)
            } else {
              const defaultGroupData = this.getDefaultGroupData(group)
              fs.writeFileSync(filePath, JSON.stringify(defaultGroupData, null, 2), 'utf-8')
            }
          } catch (e) {
            console.warn(`Could not initialize ${filePath} (permissions issue?), falling back to memory/seed:`, e)
          }
        }
        
        let data;
        // 2. Try to read from data volume
        if (fs.existsSync(filePath)) {
          try {
            const raw = fs.readFileSync(filePath, 'utf-8')
            data = JSON.parse(raw)
            this.lastMtime[group] = fs.statSync(filePath).mtimeMs
          } catch (e) {
            console.error(`Error reading ${filePath}, falling back to seed/defaults:`, e)
          }
        }
        
        // 3. Fallback if reading failed or file STILL doesn't exist (due to read-only mount)
        if (!data) {
          if (fs.existsSync(seedPath)) {
            const raw = fs.readFileSync(seedPath, 'utf-8')
            data = JSON.parse(raw)
          } else {
            data = this.getDefaultGroupData(group)
          }
          this.lastMtime[group] = 0 // Never triggers reload
        }
        
        this.mergeGroupIntoCache(group, data)
      }

      // Watch parent directory for changes (cross-process cache synchronization)
      fs.watch(DB_DIR, (eventType, changedFile) => {
        if (changedFile) {
          for (const group of Object.keys(DB_FILES) as Array<keyof typeof DB_FILES>) {
            if (path.basename(DB_FILES[group]) === changedFile) {
              this.reloadCacheAsync(group).catch(console.error)
              break
            }
          }
        } else {
          for (const group of Object.keys(DB_FILES) as Array<keyof typeof DB_FILES>) {
            this.reloadCacheAsync(group).catch(console.error)
          }
        }
      })
    } catch (e) {
      console.error('Error initializing database cache/watcher:', e)
    }
  }

  private async reloadCacheAsync(group: keyof typeof DB_FILES) {
    if (this.reloadPromise[group]) {
      this.pendingReload[group] = true
      return this.reloadPromise[group]
    }

    const filePath = DB_FILES[group]
    this.reloadPromise[group] = (async () => {
      do {
        this.pendingReload[group] = false
        try {
          await fs.promises.access(filePath, fs.constants.F_OK)
          
          let raw: string | null = null
          let mtimeMs = 0

          for (let attempt = 1; attempt <= 3; attempt++) {
            try {
              const stats = await fs.promises.stat(filePath)
              mtimeMs = stats.mtimeMs
              raw = await fs.promises.readFile(filePath, 'utf-8')
              break
            } catch (readErr) {
              if (attempt === 3) throw readErr
              await new Promise(resolve => setTimeout(resolve, 50 * attempt))
            }
          }

          if (raw !== null && mtimeMs !== this.lastMtime[group] && this.cachedData) {
            const data = JSON.parse(raw)
            this.mergeGroupIntoCache(group, data)
            this.lastMtime[group] = mtimeMs
          }
        } catch (e) {
          if ((e as any).code !== 'ENOENT') {
            console.error(`Error reloading cache group ${group} asynchronously:`, e)
          }
        }
      } while (this.pendingReload[group])
      this.reloadPromise[group] = null
    })()

    return this.reloadPromise[group]
  }

  private getDefaultSchema(): DatabaseSchema {
    return {
      departments: [],
      newsEvents: [],
      eventBlogs: [],
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
      testimonials: [],
      dynamicPages: [],
      aboutSettings: { milestones: [], values: [], vision: '', mission: [] },
      academicsSettings: { overviewText: '', admissionSteps: [] },
    }
  }

  private getDefaultGroupData(group: keyof typeof DB_FILES): any {
    switch (group) {
      case 'departments':
        return { departments: [] }
      case 'newsEvents':
        return { newsEvents: [], eventBlogs: [], tenders: [], courses: [] }
      case 'galleryHero':
        return { galleryImages: [], heroSlides: [] }
      case 'pagesNav':
        return { dynamicPages: [], navItems: [], quickLinks: [], downloads: [], testimonials: [], announcementsTicker: [] }
      case 'settings':
        return {
          deanInfo: { name: '', qualification: '', designation: '', message: '' },
          collegeInfo: { name: '', nameMarathi: '', shortName: '', established: '', area: '', address: '', phone: '', email: '', about: '' },
          hostelInfo: {
            boys: { name: 'Boys Hostel', capacity: 0, facilities: [], rules: [] },
            girls: { name: 'Girls Hostel', capacity: 0, facilities: [], rules: [] },
            pgHostel: { name: 'PG Resident Hostel', capacity: 0, facilities: [], rules: [] }
          },
          committees: [],
          libraryInfo: { journalsCount: 50, newspapersCount: 10, knimbusUrl: 'https://knimbus.com/login', timings: [], rules: [] },
          accreditations: { nmcAttendanceUrl: '', nextgenEhospitalUrl: '', muhsAffiliationLetterUrl: '', visitorCount: 678582 },
          aboutSettings: { milestones: [], values: [], vision: '', mission: [] },
          academicsSettings: { overviewText: '', admissionSteps: [] },
          institutionMetrics: {
            academicStats: { ugSeats: 150, pgSeats: 50, nursingSeats: 60, paramedicalSeats: 40, departments: 0, facultyMembers: 0, currentStudents: 800 },
            hospitalStats: { dailyOutpatients: 1200, dailyInpatients: 400, beds: 500, icuBeds: 50, operationTheaters: 10, specialties: 15, surgeriesPerMonth: 300, dailyEmergencies: 150, ruralHealthCenters: 3 },
            campusStats: { campusAcres: 25, builtUpArea: 150000, hostelCapacity: 0, libraryBooks: 12000, laboratories: 15 }
          },
          adminCredentials: { username: 'admin', passwordHash: '' },
          authorities: []
        }
    }
  }

  private mergeGroupIntoCache(group: keyof typeof DB_FILES, data: any) {
    if (!this.cachedData) this.cachedData = this.getDefaultSchema()
    
    switch (group) {
      case 'departments':
        this.cachedData.departments = data.departments || []
        break
      case 'newsEvents':
        this.cachedData.newsEvents = data.newsEvents || []
        this.cachedData.eventBlogs = data.eventBlogs || []
        this.cachedData.tenders = data.tenders || []
        this.cachedData.courses = data.courses || []
        break
      case 'galleryHero':
        this.cachedData.galleryImages = data.galleryImages || []
        this.cachedData.heroSlides = data.heroSlides || []
        break
      case 'pagesNav':
        this.cachedData.dynamicPages = data.dynamicPages || []
        this.cachedData.navItems = data.navItems || []
        this.cachedData.quickLinks = data.quickLinks || []
        this.cachedData.downloads = data.downloads || []
        this.cachedData.testimonials = data.testimonials || []
        this.cachedData.announcementsTicker = data.announcementsTicker || []
        break
      case 'settings':
        this.cachedData.deanInfo = data.deanInfo || this.cachedData.deanInfo
        this.cachedData.collegeInfo = data.collegeInfo || this.cachedData.collegeInfo
        this.cachedData.hostelInfo = data.hostelInfo || this.cachedData.hostelInfo
        this.cachedData.committees = data.committees || this.cachedData.committees
        this.cachedData.libraryInfo = data.libraryInfo || this.cachedData.libraryInfo
        this.cachedData.accreditations = data.accreditations || this.cachedData.accreditations
        this.cachedData.aboutSettings = data.aboutSettings || this.cachedData.aboutSettings
        this.cachedData.academicsSettings = data.academicsSettings || this.cachedData.academicsSettings
        this.cachedData.institutionMetrics = data.institutionMetrics || this.cachedData.institutionMetrics
        this.cachedData.adminCredentials = data.adminCredentials || this.cachedData.adminCredentials
        this.cachedData.authorities = data.authorities || this.cachedData.authorities
        break
    }
  }

  private writeGroupSync(group: keyof typeof DB_FILES, data: any) {
    const filePath = DB_FILES[group]
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
  }

  private async enqueue<T>(op: () => T | Promise<T>): Promise<T> {
    const nextOp = this.writeQueue.then(async () => {
      const release = await this.acquireLock()
      try {
        return await op()
      } finally {
        await release()
      }
    })
    this.writeQueue = nextOp.catch(() => {})
    return nextOp
  }

  private async acquireLock(): Promise<() => Promise<void>> {
    const LOCK_PATH = path.join(DB_DIR, 'db.lock')
    const LOCK_TIMEOUT = 10000 // 10 seconds maximum lock hold time
    const RETRY_INTERVAL = 50 // Retry every 50ms
    const ACQUIRE_TIMEOUT = 5000 // Timeout acquiring the lock after 5 seconds
    const startTime = Date.now()

    while (true) {
      try {
        const dir = path.dirname(LOCK_PATH)
        await fs.promises.mkdir(dir, { recursive: true })
        
        await fs.promises.writeFile(LOCK_PATH, JSON.stringify({
          pid: process.pid,
          timestamp: Date.now()
        }), { flag: 'wx', encoding: 'utf-8' })
        
        return async () => {
          try {
            await fs.promises.unlink(LOCK_PATH)
          } catch (err) {
            // Ignore
          }
        }
      } catch (err: any) {
        if (err.code === 'EEXIST') {
          try {
            const stats = await fs.promises.stat(LOCK_PATH)
            const age = Date.now() - stats.mtime.getTime()
            if (age > LOCK_TIMEOUT) {
              console.warn(`Stale lock file detected (${age}ms old). Removing...`)
              await fs.promises.unlink(LOCK_PATH).catch(() => {})
              continue
            }
          } catch (statErr) {
            // Ignore
          }
          
          if (Date.now() - startTime > ACQUIRE_TIMEOUT) {
            throw new Error('Timeout acquiring database lock')
          }
          await new Promise(resolve => setTimeout(resolve, RETRY_INTERVAL))
        } else {
          throw err
        }
      }
    }
  }

  private getRawData(): DatabaseSchema {
    if (this.cachedData) {
      const now = Date.now()
      if (now - this.lastCheckTime < this.CHECK_INTERVAL) {
        return this.cachedData
      }
      this.lastCheckTime = now

      // Check if files were modified externally (useful for network volumes like NFS/EFS)
      for (const group of Object.keys(DB_FILES) as Array<keyof typeof DB_FILES>) {
        const filePath = DB_FILES[group]
        try {
          if (fs.existsSync(filePath)) {
            const stats = fs.statSync(filePath)
            if (stats.mtimeMs !== this.lastMtime[group]) {
              const raw = fs.readFileSync(filePath, 'utf-8')
              const data = JSON.parse(raw)
              this.mergeGroupIntoCache(group, data)
              this.lastMtime[group] = stats.mtimeMs
            }
          }
        } catch (err) {
          // Fallback to cache if stats or reading fails
        }
      }
      return this.cachedData
    }
    try {
      this.cachedData = this.getDefaultSchema()
      for (const group of Object.keys(DB_FILES) as Array<keyof typeof DB_FILES>) {
        const filePath = DB_FILES[group]
        if (fs.existsSync(filePath)) {
          const raw = fs.readFileSync(filePath, 'utf-8')
          const data = JSON.parse(raw)
          this.mergeGroupIntoCache(group, data)
          this.lastMtime[group] = fs.statSync(filePath).mtimeMs
        }
      }
      return this.cachedData
    } catch (e) {
      console.error('Error reading database fallback:', e)
      return this.getDefaultSchema()
    }
  }

  private async createBackupBeforeWrite(group: keyof typeof DB_FILES): Promise<void> {
    const filePath = DB_FILES[group]
    try {
      if (!fs.existsSync(filePath)) return

      const backupsDir = path.join(DB_DIR, 'backups', group)
      await fs.promises.mkdir(backupsDir, { recursive: true })

      // Create timestamped backup file
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const backupPath = path.join(backupsDir, `${group}_${timestamp}.json`)

      await fs.promises.copyFile(filePath, backupPath)

      // Prune old backups, keep only top 10
      const files = await fs.promises.readdir(backupsDir)
      const dbBackups = files
        .filter((f) => f.startsWith(`${group}_`) && f.endsWith('.json'))
        .map((f) => path.join(backupsDir, f))

      dbBackups.sort() // Timestamp string sorting matches chronological order

      const MAX_BACKUPS = 10
      if (dbBackups.length > MAX_BACKUPS) {
        const toDelete = dbBackups.slice(0, dbBackups.length - MAX_BACKUPS)
        for (const fileToDelete of toDelete) {
          await fs.promises.unlink(fileToDelete).catch(() => {})
        }
      }
    } catch (e) {
      console.error(`Error creating database backup for group ${group}:`, e)
    }
  }

  private generateNextId(items: { id: number }[] | undefined | null): number {
    if (!items || items.length === 0) return 1
    const ids = items.map(i => Number(i.id)).filter(id => !isNaN(id))
    if (ids.length === 0) return 1
    return Math.max(...ids) + 1
  }

  private generateNextOrder(items: { order: number }[] | undefined | null): number {
    if (!items || items.length === 0) return 1
    const orders = items.map(i => Number(i.order)).filter(order => !isNaN(order))
    if (orders.length === 0) return 1
    return Math.max(...orders) + 1
  }

  private extractGroupData(group: keyof typeof DB_FILES, data: DatabaseSchema): any {
    switch (group) {
      case 'departments':
        return { departments: data.departments || [] }
      case 'newsEvents':
        return {
          newsEvents: data.newsEvents || [],
          eventBlogs: data.eventBlogs || [],
          tenders: data.tenders || [],
          courses: data.courses || []
        }
      case 'galleryHero':
        return {
          galleryImages: data.galleryImages || [],
          heroSlides: data.heroSlides || []
        }
      case 'pagesNav':
        return {
          dynamicPages: data.dynamicPages || [],
          navItems: data.navItems || [],
          quickLinks: data.quickLinks || [],
          downloads: data.downloads || [],
          testimonials: data.testimonials || [],
          announcementsTicker: data.announcementsTicker || []
        }
      case 'settings':
        return {
          deanInfo: data.deanInfo,
          collegeInfo: data.collegeInfo,
          hostelInfo: data.hostelInfo,
          committees: data.committees || [],
          libraryInfo: data.libraryInfo,
          accreditations: data.accreditations,
          aboutSettings: data.aboutSettings,
          academicsSettings: data.academicsSettings,
          institutionMetrics: data.institutionMetrics,
          adminCredentials: data.adminCredentials,
          authorities: data.authorities || [],
          storageOverrides: data.storageOverrides || { forcedOrphans: [] }
        }
    }
  }

  private async saveGroupData(group: keyof typeof DB_FILES, data: any): Promise<boolean> {
    const filePath = DB_FILES[group]
    try {
      await this.createBackupBeforeWrite(group)

      const content = JSON.stringify(data, null, 2)
      const tmpPath = filePath + '.tmp'

      await fs.promises.writeFile(tmpPath, content, 'utf-8')
      await fs.promises.rename(tmpPath, filePath)

      this.mergeGroupIntoCache(group, data)
      try {
        const stats = await fs.promises.stat(filePath)
        this.lastMtime[group] = stats.mtimeMs
      } catch (statErr) {
        this.lastMtime[group] = Date.now()
      }
      return true
    } catch (e: any) {
      const errorMsg = `Failed to save database group ${group}: ${e.message}`
      logger.error('DATABASE_WRITE_ERROR', errorMsg, {
        error: e.stack || e.toString(),
        group
      })
      throw new Error(errorMsg)
    }
  }

  private async saveRawData(data: DatabaseSchema, group?: keyof typeof DB_FILES): Promise<boolean> {
    if (group) {
      const groupData = this.extractGroupData(group, data)
      return this.saveGroupData(group, groupData)
    }
    
    // Fallback: save all groups
    for (const g of Object.keys(DB_FILES) as Array<keyof typeof DB_FILES>) {
      const groupData = this.extractGroupData(g, data)
      await this.saveGroupData(g, groupData)
    }
    return true
  }

  // --- READS ---
  public getAllPublicData() {
    const raw = this.getRawData()
    return {
      departments: (raw.departments || []).map(d => ({
        ...d,
        description: sanitizeHtml(d.description || ''),
        fullDescription: sanitizeHtml(d.fullDescription || ''),
      })),
      newsEvents: (raw.newsEvents || []).map(n => ({
        ...n,
        description: sanitizeHtml(n.description || ''),
        fullArticle: n.fullArticle ? sanitizeHtml(n.fullArticle) : undefined,
      })),
      eventBlogs: (raw.eventBlogs || []).map(e => ({
        ...e,
        description: sanitizeHtml(e.description || ''),
        fullArticle: e.fullArticle ? sanitizeHtml(e.fullArticle) : undefined,
      })),
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
      testimonials: raw.testimonials || [],
      institutionMetrics: raw.institutionMetrics || {
        academicStats: {
          ugSeats: 150,
          pgSeats: 20,
          nursingSeats: 50,
          paramedicalSeats: 0,
          departments: 21,
          facultyMembers: 100,
          currentStudents: 600
        },
        hospitalStats: {
          dailyOutpatients: 1200,
          dailyInpatients: 400,
          beds: 500,
          icuBeds: 50,
          operationTheaters: 8,
          specialties: 12,
          surgeriesPerMonth: 300,
          dailyEmergencies: 150,
          ruralHealthCenters: 3
        },
        campusStats: {
          campusAcres: 40,
          builtUpArea: 25000,
          hostelCapacity: 550,
          libraryBooks: 12850,
          laboratories: 15
        }
      } as InstitutionMetrics,
    }
  }

  public getOptimizedGlobalData() {
    const raw = this.getRawData()
    return {
      // Send stripped departments (only id, name, and first doctor (HOD))
      departments: (raw.departments || []).map(d => ({
        id: d.id,
        name: d.name,
        doctors: d.doctors && d.doctors.length > 0 ? [d.doctors[0]] : []
      })),
      
      // Limit arrays to what's needed globally (Header/Footer/Home)
      newsEvents: (raw.newsEvents || []).slice(0, 5),
      eventBlogs: (raw.eventBlogs || []).slice(0, 5),
      tenders: (raw.tenders || []).slice(0, 5),
      
      // Strip course descriptions
      courses: (raw.courses || []).map(c => ({ id: c.id, name: c.name, seats: c.seats })),
      
      authorities: raw.authorities,
      deanInfo: raw.deanInfo,
      collegeInfo: raw.collegeInfo,
      
      // Keep heroSlides, announcements, downloads
      heroSlides: (raw.heroSlides || []).sort((a, b) => a.order - b.order),
      announcementsTicker: (raw.announcementsTicker || []).sort((a, b) => {
        if (a.pinned && !b.pinned) return -1
        if (!a.pinned && b.pinned) return 1
        return a.order - b.order
      }),
      downloads: (raw.downloads || []).sort((a, b) => a.order - b.order),
      
      // Filter out links pointing to draft dynamic pages
      navItems: (() => {
        const draftPaths = new Set((raw.dynamicPages || []).filter(p => p.status === 'draft').map(p => `/${p.slug}`))
        return (raw.navItems || [])
          .map(nav => ({
            ...nav,
            submenus: (nav.submenus || []).filter(sub => !draftPaths.has(sub.href))
          }))
          .filter(nav => !draftPaths.has(nav.href))
          .sort((a, b) => a.order - b.order)
      })(),
      
      quickLinks: (() => {
        const draftPaths = new Set((raw.dynamicPages || []).filter(p => p.status === 'draft').map(p => `/${p.slug}`))
        return (raw.quickLinks || [])
          .filter(link => !draftPaths.has(link.href))
          .sort((a, b) => a.order - b.order)
      })(),
      
      footerPages: (raw.dynamicPages || []).filter(p => p.showInFooter && p.status === 'published').map(p => ({ slug: p.slug, title: p.title })),
      
      // Accreditations & Metrics
      accreditations: raw.accreditations || {
        nmcAttendanceUrl: '', nextgenEhospitalUrl: '', muhsAffiliationLetterUrl: '', visitorCount: 678582
      },
      institutionMetrics: raw.institutionMetrics || null,
      testimonials: raw.testimonials || [],
      
      // Explicitly EXCLUDE galleryImages and massive fields
      galleryImages: []
    }
  }

  public getDepartments(): Department[] {
    return this.getRawData().departments
  }

  public getNewsEvents(): NewsEventItem[] {
    return this.getRawData().newsEvents
  }

  public getNewsEventById(id: number): NewsEventItem | undefined {
    return this.getRawData().newsEvents.find(item => item.id === id)
  }

  public getEventBlogs(): EventBlogItem[] {
    return this.getRawData().eventBlogs
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
      journalsCount: 50,
      newspapersCount: 10,
      knimbusUrl: "https://knimbus.com/login",
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
  public updateDepartment(id: string, updatedFields: Partial<Omit<Department, 'id' | 'doctors'>>): Promise<boolean> {
    return this.enqueue(() => {
      const data = this.getRawData()
      const index = data.departments.findIndex((d) => d.id === id)
      if (index === -1) return false
      
      data.departments[index] = {
        ...data.departments[index],
        ...updatedFields
      }
      return this.saveRawData(data, 'departments')
    })
  }

  public addDoctor(departmentId: string, doctor: Doctor): Promise<boolean> {
    return this.enqueue(() => {
      const data = this.getRawData()
      const index = data.departments.findIndex((d) => d.id === departmentId)
      if (index === -1) return false
      data.departments[index].doctors.push(doctor)
      return this.saveRawData(data, 'departments')
    })
  }

  public removeDoctor(departmentId: string, doctorName: string): Promise<boolean> {
    return this.enqueue(() => {
      const data = this.getRawData()
      const index = data.departments.findIndex((d) => d.id === departmentId)
      if (index === -1) return false
      data.departments[index].doctors = data.departments[index].doctors.filter(
        (doc) => doc.name !== doctorName
      )
      return this.saveRawData(data, 'departments')
    })
  }

  public updateDoctor(departmentId: string, originalName: string, updatedDoctor: Doctor): Promise<boolean> {
    return this.enqueue(() => {
      const data = this.getRawData()
      const deptIndex = data.departments.findIndex((d) => d.id === departmentId)
      if (deptIndex === -1) return false
      
      const docIndex = data.departments[deptIndex].doctors.findIndex((doc) => doc.name === originalName)
      if (docIndex === -1) return false
      
      data.departments[deptIndex].doctors[docIndex] = updatedDoctor
      return this.saveRawData(data, 'departments')
    })
  }

  // NewsEvents CRUD
  public addNewsEvent(item: Omit<NewsEventItem, 'id'>): Promise<boolean> {
    return this.enqueue(() => {
      const data = this.getRawData()
      const newId = this.generateNextId(data.newsEvents)
      data.newsEvents.unshift({ id: newId, ...item })
      return this.saveRawData(data, 'newsEvents')
    })
  }

  public deleteNewsEvent(id: number): Promise<boolean> {
    return this.enqueue(() => {
      const data = this.getRawData()
      data.newsEvents = data.newsEvents.filter((e) => e.id !== id)
      return this.saveRawData(data, 'newsEvents')
    })
  }

  public updateNewsEvent(id: number, updatedItem: Omit<NewsEventItem, 'id'>): Promise<boolean> {
    return this.enqueue(() => {
      const data = this.getRawData()
      const index = data.newsEvents.findIndex((e) => e.id === id)
      if (index === -1) return false
      data.newsEvents[index] = { id, ...updatedItem }
      return this.saveRawData(data, 'newsEvents')
    })
  }

  // EventBlogs CRUD
  public addEventBlog(item: Omit<EventBlogItem, 'id'>): Promise<boolean> {
    return this.enqueue(() => {
      const data = this.getRawData()
      const newId = this.generateNextId(data.eventBlogs)
      data.eventBlogs.unshift({ id: newId, ...item })
      return this.saveRawData(data, 'newsEvents')
    })
  }

  public deleteEventBlog(id: number): Promise<boolean> {
    return this.enqueue(() => {
      const data = this.getRawData()
      data.eventBlogs = data.eventBlogs.filter((e) => e.id !== id)
      return this.saveRawData(data, 'newsEvents')
    })
  }

  /**
   * Updates an existing event blog/album by ID.
   * @param id - The event blog ID to update
   * @param item - Updated data (title, date, content, photos, youtubeVideoUrl)
   */
  public updateEventBlog(id: number, item: Omit<EventBlogItem, 'id'>): Promise<boolean> {
    return this.enqueue(() => {
      const data = this.getRawData()
      const idx = data.eventBlogs.findIndex((e) => e.id === id)
      if (idx === -1) return Promise.resolve(false)
      data.eventBlogs[idx] = { id, ...item }
      return this.saveRawData(data, 'newsEvents')
    })
  }

  // Tenders CRUD
  public addTender(tender: Omit<TenderItem, 'id'>): Promise<boolean> {
    return this.enqueue(() => {
      const data = this.getRawData()
      if (!data.tenders) data.tenders = []
      const newId = this.generateNextId(data.tenders)
      data.tenders.unshift({ id: newId, ...tender })
      return this.saveRawData(data, 'newsEvents')
    })
  }

  public deleteTender(id: number): Promise<boolean> {
    return this.enqueue(() => {
      const data = this.getRawData()
      if (!data.tenders) return false
      data.tenders = data.tenders.filter((t) => t.id !== id)
      return this.saveRawData(data, 'newsEvents')
    })
  }

  public updateTender(id: number, updatedTender: Omit<TenderItem, 'id'>): Promise<boolean> {
    return this.enqueue(() => {
      const data = this.getRawData()
      if (!data.tenders) return false
      const index = data.tenders.findIndex((t) => t.id === id)
      if (index === -1) return false
      data.tenders[index] = { id, ...updatedTender }
      return this.saveRawData(data, 'newsEvents')
    })
  }

  public toggleTenderVisibility(id: number): Promise<boolean> {
    return this.enqueue(() => {
      const data = this.getRawData()
      if (!data.tenders) return false
      const tender = data.tenders.find((t) => t.id === id)
      if (!tender) return false
      tender.isHidden = !tender.isHidden
      return this.saveRawData(data, 'newsEvents')
    })
  }

  // Gallery CRUD
  public addGalleryImage(imageItem: Omit<GalleryImage, 'id'>): Promise<boolean> {
    return this.enqueue(() => {
      const data = this.getRawData()
      const newId = this.generateNextId(data.galleryImages)
      data.galleryImages.unshift({ id: newId, ...imageItem })
      return this.saveRawData(data, 'galleryHero')
    })
  }

  public deleteGalleryImage(id: number): Promise<boolean> {
    return this.enqueue(() => {
      const data = this.getRawData()
      data.galleryImages = data.galleryImages.filter((g) => g.id !== id)
      return this.saveRawData(data, 'galleryHero')
    })
  }

  // Courses & Hostels Updates
  public updateCourse(id: string, updatedFields: Partial<Omit<Course, 'id'>>): Promise<boolean> {
    return this.enqueue(() => {
      const data = this.getRawData()
      const index = data.courses.findIndex((c) => c.id === id)
      if (index === -1) return false
      data.courses[index] = { ...data.courses[index], ...updatedFields }
      return this.saveRawData(data, 'newsEvents')
    })
  }

  public updateHostelInfo(hostelType: 'boys' | 'girls' | 'pgHostel', updatedFields: Partial<HostelSpec>): Promise<boolean> {
    return this.enqueue(() => {
      const data = this.getRawData()
      data.hostelInfo[hostelType] = { ...data.hostelInfo[hostelType], ...updatedFields }
      return this.saveRawData(data, 'settings')
    })
  }

  // Authorities Updates
  public updateDeanInfo(updatedFields: Partial<DeanInfo>): Promise<boolean> {
    return this.enqueue(() => {
      const data = this.getRawData()
      data.deanInfo = { ...data.deanInfo, ...updatedFields }
      return this.saveRawData(data, 'settings')
    })
  }

  public updateCollegeInfo(updatedFields: Partial<CollegeInfo>): Promise<boolean> {
    return this.enqueue(() => {
      const data = this.getRawData()
      data.collegeInfo = { ...data.collegeInfo, ...updatedFields }
      return this.saveRawData(data, 'settings')
    })
  }

  // Authorities CRUD
  public addAuthority(auth: Authority): Promise<boolean> {
    return this.enqueue(() => {
      const data = this.getRawData()
      if (!data.authorities) {
        data.authorities = []
      }
      data.authorities.push(auth)
      return this.saveRawData(data, 'settings')
    })
  }

  public updateAuthority(originalName: string, updatedAuth: Authority): Promise<boolean> {
    return this.enqueue(() => {
      const data = this.getRawData()
      if (!data.authorities) return false
      const index = data.authorities.findIndex((a) => a.name === originalName)
      if (index === -1) return false
      data.authorities[index] = updatedAuth
      return this.saveRawData(data, 'settings')
    })
  }

  public deleteAuthority(name: string): Promise<boolean> {
    return this.enqueue(() => {
      const data = this.getRawData()
      if (!data.authorities) return false
      data.authorities = data.authorities.filter((a) => a.name !== name)
      return this.saveRawData(data, 'settings')
    })
  }

  // --- ADVANCED CONTROLS (PHASE 2) ---

  // Hero Slides
  // Hero Slides
  public addHeroSlide(slide: Omit<HeroSlide, 'id' | 'order'>): Promise<boolean> {
    return this.enqueue(() => {
      const data = this.getRawData()
      const newId = this.generateNextId(data.heroSlides)
      const newOrder = this.generateNextOrder(data.heroSlides)
      data.heroSlides.push({ id: newId, order: newOrder, ...slide })
      return this.saveRawData(data, 'galleryHero')
    })
  }

  public deleteHeroSlide(id: number): Promise<boolean> {
    return this.enqueue(() => {
      const data = this.getRawData()
      data.heroSlides = data.heroSlides.filter((s) => s.id !== id)
      return this.saveRawData(data, 'galleryHero')
    })
  }

  public reorderHeroSlide(id: number, direction: 'up' | 'down'): Promise<boolean> {
    return this.enqueue(() => {
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
      return this.saveRawData(data, 'galleryHero')
    })
  }

  // Announcements Ticker
  public addTickerBulletin(text: string): Promise<boolean> {
    return this.enqueue(() => {
      const data = this.getRawData()
      const newId = this.generateNextId(data.announcementsTicker)
      const newOrder = this.generateNextOrder(data.announcementsTicker)
      data.announcementsTicker.push({ id: newId, text, pinned: false, order: newOrder })
      return this.saveRawData(data, 'pagesNav')
    })
  }

  public deleteTickerBulletin(id: number): Promise<boolean> {
    return this.enqueue(() => {
      const data = this.getRawData()
      data.announcementsTicker = data.announcementsTicker.filter((t) => t.id !== id)
      return this.saveRawData(data, 'pagesNav')
    })
  }

  public togglePinTickerBulletin(id: number): Promise<boolean> {
    return this.enqueue(() => {
      const data = this.getRawData()
      const index = data.announcementsTicker.findIndex((t) => t.id === id)
      if (index === -1) return false
      data.announcementsTicker[index].pinned = !data.announcementsTicker[index].pinned
      return this.saveRawData(data, 'pagesNav')
    })
  }

  public reorderTickerBulletin(id: number, direction: 'up' | 'down'): Promise<boolean> {
    return this.enqueue(() => {
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
      return this.saveRawData(data, 'pagesNav')
    })
  }

  // PDF Download Brochures
  public addDownloadItem(name: string, url: string): Promise<boolean> {
    return this.enqueue(() => {
      const data = this.getRawData()
      const newId = this.generateNextId(data.downloads)
      const newOrder = this.generateNextOrder(data.downloads)
      data.downloads.push({ id: newId, name, url, type: 'PDF', order: newOrder })
      return this.saveRawData(data, 'pagesNav')
    })
  }

  public deleteDownloadItem(id: number): Promise<boolean> {
    return this.enqueue(() => {
      const data = this.getRawData()
      data.downloads = data.downloads.filter((d) => d.id !== id)
      return this.saveRawData(data, 'pagesNav')
    })
  }

  public reorderDownloadItem(id: number, direction: 'up' | 'down'): Promise<boolean> {
    return this.enqueue(() => {
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
      return this.saveRawData(data, 'pagesNav')
    })
  }

  // --- PHASE 3 COMMITTEES & LIBRARY WRITES ---

  // Committees Member Operations
  public addCommitteeMember(committeeId: string, member: CommitteeMember): Promise<boolean> {
    return this.enqueue(() => {
      const data = this.getRawData()
      if (!data.committees) data.committees = []
      const index = data.committees.findIndex((c) => c.id === committeeId)
      if (index === -1) return false
      data.committees[index].members.push(member)
      return this.saveRawData(data, 'settings')
    })
  }

  public removeCommitteeMember(committeeId: string, memberName: string): Promise<boolean> {
    return this.enqueue(() => {
      const data = this.getRawData()
      if (!data.committees) return false
      const index = data.committees.findIndex((c) => c.id === committeeId)
      if (index === -1) return false
      data.committees[index].members = data.committees[index].members.filter(
        (m) => m.name !== memberName
      )
      return this.saveRawData(data, 'settings')
    })
  }

  public updateCommitteeMember(committeeId: string, oldMemberName: string, updatedMember: CommitteeMember): Promise<boolean> {
    return this.enqueue(() => {
      const data = this.getRawData()
      if (!data.committees) return false
      const committeeIndex = data.committees.findIndex((c) => c.id === committeeId)
      if (committeeIndex === -1) return false
      
      const memberIndex = data.committees[committeeIndex].members.findIndex(m => m.name === oldMemberName)
      if (memberIndex === -1) return false

      data.committees[committeeIndex].members[memberIndex] = updatedMember
      return this.saveRawData(data, 'settings')
    })
  }

  public updateCommitteeChairperson(committeeId: string, chairperson: string, helpline: string): Promise<boolean> {
    return this.enqueue(() => {
      const data = this.getRawData()
      if (!data.committees) return false
      const index = data.committees.findIndex((c) => c.id === committeeId)
      if (index === -1) return false
      data.committees[index].chairperson = chairperson
      data.committees[index].helpline = helpline
      return this.saveRawData(data, 'settings')
    })
  }

  // Library Updates
  public updateLibraryInfo(fields: Partial<LibraryInfo>): Promise<boolean> {
    return this.enqueue(() => {
      const data = this.getRawData()
      if (!data.libraryInfo) {
        data.libraryInfo = {
          journalsCount: 0,
          newspapersCount: 0,
          knimbusUrl: '',
          timings: [],
          rules: []
        }
      }
      data.libraryInfo = {
        ...data.libraryInfo,
        ...(fields as any)
      }
      return this.saveRawData(data, 'settings')
    })
  }

  // Accreditations Updates
  public updateAccreditationInfo(fields: Partial<AccreditationInfo>): Promise<boolean> {
    return this.enqueue(() => {
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
      return this.saveRawData(data, 'settings')
    })
  }

  // Increment Visitor Count (Asynchronous & Decoupled to avoid blocking page loads)
  public async incrementVisitorCount(): Promise<boolean> {
    return this.enqueue(async () => {
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
    })
  }

  // --- PHASE 4 SITE BUILDER READS ---
  public getNavItems(): NavigationItem[] {
    return (this.getRawData().navItems || []).sort((a, b) => a.order - b.order)
  }

  public getQuickLinks(): QuickLink[] {
    return (this.getRawData().quickLinks || []).sort((a, b) => a.order - b.order)
  }



  public getTestimonials(): Testimonial[] {
    return this.getRawData().testimonials || []
  }



  // --- PHASE 4 SITE BUILDER WRITES ---
  public updateNavItems(items: NavigationItem[]): Promise<boolean> {
    return this.enqueue(() => {
      const data = this.getRawData()
      data.navItems = items
      return this.saveRawData(data, 'pagesNav')
    })
  }

  public updateQuickLinks(items: QuickLink[]): Promise<boolean> {
    return this.enqueue(() => {
      const data = this.getRawData()
      data.quickLinks = items
      return this.saveRawData(data, 'pagesNav')
    })
  }

  public updateTestimonials(items: Testimonial[]): Promise<boolean> {
    return this.enqueue(() => {
      const data = this.getRawData()
      data.testimonials = items
      return this.saveRawData(data, 'pagesNav')
    })
  }

  // --- NEW: ADVANCED DYNAMIC SETTINGS ---
  public getAboutSettings(): AboutSettings {
    return this.getRawData().aboutSettings || { milestones: [], values: [], vision: '', mission: [] }
  }

  public updateAboutSettings(settings: AboutSettings): Promise<boolean> {
    return this.enqueue(() => {
      const data = this.getRawData()
      data.aboutSettings = settings
      return this.saveRawData(data, 'settings')
    })
  }

  public getAcademicsSettings(): AcademicsSettings {
    return this.getRawData().academicsSettings || { overviewText: '', admissionSteps: [] }
  }

  public updateAcademicsSettings(settings: AcademicsSettings): Promise<boolean> {
    return this.enqueue(() => {
      const data = this.getRawData()
      data.academicsSettings = settings
      return this.saveRawData(data, 'settings')
    })
  }

  public getInstitutionMetrics(): InstitutionMetrics {
    const rawMetrics = this.getRawData().institutionMetrics || {
      academicStats: {
        ugSeats: 150,
        pgSeats: 50,
        nursingSeats: 60,
        paramedicalSeats: 40,
        departments: 0,
        facultyMembers: 0,
        currentStudents: 800
      },
      hospitalStats: {
        dailyOutpatients: 1200,
        dailyInpatients: 400,
        beds: 500,
        icuBeds: 50,
        operationTheaters: 10,
        specialties: 15,
        surgeriesPerMonth: 300,
        dailyEmergencies: 150,
        ruralHealthCenters: 3
      },
      campusStats: {
        campusAcres: 25,
        builtUpArea: 150000,
        hostelCapacity: 0,
        libraryBooks: 12000,
        laboratories: 15
      }
    }

    const data = this.getRawData()

    // Auto-calculate Departments & Faculty
    const depts = data.departments || []
    rawMetrics.academicStats.departments = depts.length
    rawMetrics.academicStats.facultyMembers = depts.reduce((total, d) => total + (d.doctors ? d.doctors.length : 0), 0)

    // Auto-calculate Hostel Capacity
    const h = data.hostelInfo
    if (h) {
      rawMetrics.campusStats.hostelCapacity = (h.boys?.capacity || 0) + (h.girls?.capacity || 0) + (h.pgHostel?.capacity || 0)
    }

    return rawMetrics
  }

  public updateInstitutionMetrics(metrics: InstitutionMetrics): Promise<boolean> {
    return this.enqueue(() => {
      const data = this.getRawData()
      data.institutionMetrics = metrics
      return this.saveRawData(data, 'settings')
    })
  }

  public getDynamicPages(): DynamicPage[] {
    return this.getRawData().dynamicPages || []
  }

  public getDynamicPage(slug: string): DynamicPage | undefined {
    return this.getDynamicPages().find(p => p.slug === slug)
  }

  public updateDynamicPage(page: DynamicPage): Promise<boolean> {
    return this.enqueue(() => {
      const data = this.getRawData()
      if (!data.dynamicPages) data.dynamicPages = []
      
      const idx = data.dynamicPages.findIndex(p => p.slug === page.slug)
      if (idx >= 0) {
        data.dynamicPages[idx] = page
      } else {
        data.dynamicPages.push(page)
      }
      return this.saveRawData(data, 'pagesNav')
    })
  }

  public deleteDynamicPage(slug: string): Promise<boolean> {
    return this.enqueue(() => {
      const data = this.getRawData()
      if (!data.dynamicPages) return false
      data.dynamicPages = data.dynamicPages.filter(p => p.slug !== slug)
      return this.saveRawData(data, 'pagesNav')
    })
  }

  public getAdminCredentials(): AdminCredentials {
    const data = this.getRawData()
    // Return only what is stored in the database.
    // No hardcoded fallback hash — if no credentials are configured,
    // the login action will display a clear setup error rather than
    // accepting a publicly-known default password.
    return data.adminCredentials || { username: 'admin', passwordHash: '' }
  }

  public updateAdminCredentials(username: string, passwordHash: string): Promise<boolean> {
    return this.enqueue(() => {
      const data = this.getRawData()
      data.adminCredentials = { username, passwordHash }
      return this.saveRawData(data, 'settings')
    })
  }

  /**
   * Returns the entire raw database schema for use in storage scanning.
   * Exposes the private getRawData() method in a controlled way.
   */
  public getRawDataForStorage(): DatabaseSchema {
    return this.getRawData()
  }

  /**
   * Returns the current storage overrides (list of force-unlocked files).
   */
  public getStorageOverrides(): { forcedOrphans: string[] } {
    return this.getRawData().storageOverrides || { forcedOrphans: [] }
  }

  /**
   * Saves updated storage overrides back to settings.json.
   * @param overrides - The new overrides object with forcedOrphans array
   */
  public setStorageOverrides(overrides: { forcedOrphans: string[] }): Promise<boolean> {
    return this.enqueue(() => {
      const data = this.getRawData()
      data.storageOverrides = overrides
      return this.saveRawData(data, 'settings')
    })
  }
}

export const db = new JSONDatabase()
