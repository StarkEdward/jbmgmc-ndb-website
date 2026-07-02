"use client"

import { useState, useEffect, Fragment, useRef } from "react"
import Link from "next/link"
import { Menu, X, ChevronDown, Phone, Mail, MapPin, Clock, Search, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLiveData } from "@/hooks/use-live-data"
import Script from "next/script"
import { motion, AnimatePresence } from "framer-motion"

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className={className ? className : "h-9 w-9"} />
    )
  }

  const isDark = theme === "dark" || resolvedTheme === "dark"

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={className ? `rounded-lg transition-all duration-200 cursor-pointer ${className}` : "h-9 w-9 text-foreground hover:bg-primary/10 hover:text-primary rounded-lg transition-all duration-200 cursor-pointer"}
      aria-label="Toggle Theme"
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-amber-400 rotate-0 scale-100 transition-all" />
      ) : (
        <Moon className="h-4 w-4 text-current rotate-0 scale-100 transition-all" />
      )}
    </Button>
  )
}

function NavDropdown({ link }: { link: any }) {
  const [isOpen, setIsOpen] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false)
    }, 300) // Increased timeout to 300ms to allow smooth mouse transition over the gap
  }

  return (
    <div 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen} modal={false}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-0.5 text-foreground font-medium text-[10px] hover:text-primary hover:bg-primary/8 transition-all duration-200 rounded-md px-1 py-1 xl:text-[11px] xl:px-1.5 whitespace-nowrap"
          >
            {link.label}
            <ChevronDown className={`h-3 w-3 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="start"
          sideOffset={8}
          className="min-w-[220px] max-w-[280px] p-1.5 max-h-[75vh] overflow-y-auto animate-in fade-in-0 zoom-in-95 rounded-xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Invisible bridge to prevent mouse leave when crossing the gap */}
          <div className="absolute -top-4 left-0 right-0 h-4 bg-transparent" />
          
          <div className="flex flex-col gap-0.5">
            {link.submenus.map((sub: any) => (
              <DropdownMenuItem key={sub.id} asChild className="cursor-pointer rounded-lg">
                <Link 
                  href={sub.href} 
                  className="flex items-center w-full px-2.5 py-1.5 text-[11px] xl:text-xs font-medium text-foreground/80 hover:text-primary hover:bg-primary/10 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {sub.label}
                </Link>
              </DropdownMenuItem>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export function Header() {
  const router = useRouter()
  const { collegeInfo, departments } = useLiveData()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (window.location.pathname === '/') {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    setMobileMenuOpen(false)
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setSearchOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const defaultNavLinks = [
    { id: '1', href: "/", label: "Home", submenus: [] },
    { 
      id: '2', href: "/about", label: "About Us", 
      submenus: [
        { id: '2-1', label: "About Us", href: "/about" },
        { id: '2-2', label: "Faculty", href: "/doctors" }
      ] 
    },
    { 
      id: '3', href: "/committees", label: "Committees", 
      submenus: [
        { id: '3-1', label: "Anti Ragging Committee", href: "/committees/anti-ragging" },
        { id: '3-2', label: "Gender Harassment Committee", href: "/committees/gender-harassment" },
        { id: '3-3', label: "Womens Grievance Redressal Committee", href: "/committees/womens-grievance" },
      ]
    },
    { 
      id: '4', href: "/departments", label: "Departments", 
      submenus: [
        { id: '4-1', label: "Pre-Clinical Departments", href: "/departments#pre-clinical" },
        { id: '4-2', label: "Para-Clinical Departments", href: "/departments#para-clinical" },
        { id: '4-3', label: "Clinical Departments", href: "/departments#clinical" },
      ]
    },
    { 
      id: '5', href: "/library", label: "Central Library", 
      submenus: [
        { id: '5-1', label: "Library Introduction", href: "/library#intro" },
        { id: '5-2', label: "Head of the Institute", href: "/library#head" },
        { id: '5-3', label: "Library Staff Members", href: "/library#staff" },
        { id: '5-4', label: "Library Committee Members", href: "/library#committee" },
        { id: '5-5', label: "Library Books", href: "/library#books" },
        { id: '5-6', label: "Journals", href: "/library#journals" },
        { id: '5-7', label: "Knimbus Digital Library", href: "https://gmcnandurbar.knimbus.com" },
        { id: '5-8', label: "Newspaper", href: "/library#newspaper" },
        { id: '5-9', label: "E-Library", href: "/library#e-library" },
        { id: '5-10', label: "Library Timing", href: "/library#timing" },
        { id: '5-11', label: "Central Library Rules", href: "/library#rules" },
        { id: '5-12', label: "Question Papers", href: "/library#question-papers" },
        { id: '5-13', label: "Contact Us", href: "/library#contact" },
        { id: '5-14', label: "Photo Gallery", href: "/gallery" },
      ]
    },
    { 
      id: '6', href: "#", label: "Administration", 
      submenus: [
        { id: '6-1', label: "NMC India Attendance", href: "https://gmcnur.nmcindia.ac.in/" },
        { id: '6-2', label: "Nextgen E-Hospital", href: "https://nextgen.ehospital.gov.in/login" },
        { id: '6-3', label: "MUHS Affiliation Letter", href: "/downloads/muhs-affiliation.pdf" },
        { id: '6-4', label: "RTS - Maharashtra Right to Public Services Act", href: "/administration/rts" },
        { id: '6-5', label: "RTI", href: "/administration/rti" },
      ]
    },
    { 
      id: '7', href: "/students-corner", label: "Students Corner", 
      submenus: [
        { id: '7-1', label: "MBBS Admission Brochure 2025-26", href: "/downloads/mbbs-brochure.pdf" },
        { id: '7-2', label: "Fee Structure & Stipend Info", href: "/downloads/fee-info.pdf" },
        { id: '7-3', label: "Notifications", href: "/students-corner/notifications" },
        { id: '7-4', label: "Final Exam Result", href: "/students-corner/results/final" },
        { id: '7-5', label: "Supplementary Exam Result", href: "/students-corner/results/supplementary" },
        { id: '7-6', label: "Indemnity Bond & Undertaking", href: "/downloads/indemnity-bond.pdf" },
        { id: '7-7', label: "Foundation Course 2023-24", href: "/students-corner/foundation-course" },
      ]
    },
    { 
      id: '8', href: "/nursing", label: "Nursing", 
      submenus: [
        { id: '8-1', label: "MUHS Mandate", href: "/nursing/muhs-mandate" },
      ]
    },
    { 
      id: '9', href: "/gallery", label: "Gallery", 
      submenus: [
        { id: '9-1', label: "Campus Photos", href: "/gallery" },
        { id: '9-2', label: "Event Albums", href: "/events" },
      ] 
    },
    { id: '10', href: "/contact", label: "Contact Us", submenus: [] },
  ]
  const { navItems, accreditations } = useLiveData()
  const baseLinks = navItems && navItems.length > 0 ? navItems : defaultNavLinks
  const navLinks = baseLinks.map((link: any) => {
    if (link.id === '6' || link.label.toLowerCase() === 'administration') {
      return {
        ...link,
        submenus: link.submenus?.map((sub: any) => {
          if (sub.id === '6-1' || sub.label.toLowerCase().includes('nmc')) {
            if (accreditations?.nmcAttendanceUrl) return { ...sub, href: accreditations.nmcAttendanceUrl }
          }
          if (sub.id === '6-2' || sub.label.toLowerCase().includes('nextgen') || sub.label.toLowerCase().includes('ehospital')) {
            if (accreditations?.nextgenEhospitalUrl) return { ...sub, href: accreditations.nextgenEhospitalUrl }
          }
          if (sub.id === '6-3' || sub.label.toLowerCase().includes('muhs')) {
            if (accreditations?.muhsAffiliationLetterUrl) return { ...sub, href: accreditations.muhsAffiliationLetterUrl }
          }
          return sub
        }) || []
      }
    }
    return link
  })



  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-500 overflow-hidden ${
      scrolled 
        ? "bg-white/40 dark:bg-slate-950/40 backdrop-blur-2xl shadow-lg border-b border-border/50" 
        : "bg-white/60 dark:bg-slate-950/60 backdrop-blur-xl border-b border-border/30"
    }`}>
      {/* Pearl Mesh Gradient Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-50/80 via-white/50 to-emerald-50/80 dark:from-sky-950/40 dark:via-slate-900/50 dark:to-emerald-950/40" />
        
        {/* Animated Aurora Blobs */}
        <div className="absolute -top-32 -left-10 w-96 h-96 bg-sky-300/60 dark:bg-sky-700/40 rounded-full filter blur-[80px] animate-blob" />
        <div className="absolute top-0 right-10 w-96 h-96 bg-emerald-300/50 dark:bg-emerald-700/40 rounded-full filter blur-[80px] animate-blob animation-delay-2000" />
        <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[30rem] h-64 bg-indigo-300/40 dark:bg-indigo-700/30 rounded-full filter blur-[100px] animate-blob animation-delay-4000" />
      </div>
      {/* Top Bar - Contact Info */}
      <div className="relative z-10 hidden md:block bg-gradient-to-r from-primary to-primary/90 text-primary-foreground border-b border-primary/50">
        <div className="mx-auto max-w-7xl px-2 xl:px-4 py-1.5 overflow-hidden">
          <div className="flex items-center justify-between gap-1 lg:gap-2 xl:gap-4 text-[10px] lg:text-[10px] xl:text-[11px]">
            <div className="flex items-center gap-1.5 lg:gap-3 xl:gap-4 whitespace-nowrap">
              


              <a href="tel:02564-210444" className="flex items-center gap-1 lg:gap-2 hover:text-accent transition-colors group font-medium">
                <Phone className="h-3.5 w-3.5 lg:h-4 lg:w-4 group-hover:scale-110 transition-transform shrink-0" />
                <span>02564-210444</span>
              </a>
              <a href={`mailto:${collegeInfo.email}`} className="flex items-center hover:text-accent transition-colors group font-medium" title={collegeInfo.email}>
                <Mail className="h-3.5 w-3.5 lg:h-4 lg:w-4 group-hover:scale-110 transition-transform shrink-0" />
              </a>
              <a href="tel:18002336557" className="inline-flex items-center gap-1 text-[9px] lg:text-[10px] font-semibold bg-amber-500/25 text-amber-200 border border-amber-500/40 px-1.5 lg:px-2 py-0.5 rounded-full hover:bg-amber-500/40 hover:text-white transition-all shrink-0 animate-pulse">
                <Phone className="h-3 w-3 animate-bounce shrink-0" />
                <span className="hidden xl:inline">Anti-Ragging Helpline: 1800-233-6557</span>
                <span className="xl:hidden">Anti-Ragging: 1800-233-6557</span>
              </a>
            </div>
            
            <div className="flex items-center gap-1.5 lg:gap-3 xl:gap-4 whitespace-nowrap shrink-0">
              <div className="flex items-center gap-1 font-medium">
                <MapPin className="h-3 w-3 lg:h-3.5 lg:w-3.5 shrink-0" />
                <span className="hidden lg:inline">Nandurbar, Maharashtra</span>
                <span className="lg:hidden">Nandurbar</span>
              </div>
              <div className="w-px h-3 lg:h-3.5 xl:h-4 bg-primary-foreground/30" />
              <div className="flex items-center gap-1 font-medium">
                <Clock className="h-3 w-3 lg:h-3.5 lg:w-3.5 shrink-0" />
                <span className="hidden xl:inline">Mon-Fri: 9:00 AM - 5:00 PM</span>
                <span className="xl:hidden">9 AM - 5 PM</span>
              </div>
              <div className="w-px h-3 lg:h-3.5 xl:h-4 bg-primary-foreground/30 ml-1" />
              <ThemeToggle className="text-white hover:bg-white/20 h-6 w-6 md:h-7 md:w-7" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Header - Top Row (Logo & Actions) */}
      <div className="relative z-10 mx-auto max-w-7xl px-2 xl:px-4 py-3 lg:py-5">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & Branding - Frosted Glass Pill */}
          <Link 
            href="/" 
            onClick={handleHomeClick}
            className="flex items-center gap-3 md:gap-4 shrink-0 group bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-white/50 dark:border-white/10 shadow-xl shadow-primary/5 rounded-full pr-5 sm:pr-8 py-1.5 pl-1.5 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/15 hover:scale-[1.02] hover:bg-white/90 dark:hover:bg-slate-900/90"
          >
            <div className="flex h-12 w-12 lg:h-[72px] lg:w-[72px] items-center justify-center rounded-full bg-white shadow-md p-1 border border-primary/10 shrink-0">
              <Image src="/images/logo.png" alt="JBMGMC Logo" width={64} height={64} className="object-contain w-full h-full" />
            </div>
            <div className="flex flex-col justify-center py-0.5 max-w-[180px] sm:max-w-none">
              <h1 className="text-[11px] sm:text-[13px] lg:text-[16px] font-black text-slate-800 dark:text-slate-100 leading-tight group-hover:text-primary transition-colors uppercase tracking-tight">
                Jannayak Birsa Munda Government
              </h1>
              <h2 className="text-[11px] sm:text-[13px] lg:text-[16px] font-black text-slate-800 dark:text-slate-100 leading-tight group-hover:text-primary transition-colors uppercase tracking-tight">
                Medical College Nandurbar
              </h2>
              <p className="text-[10px] sm:text-[12px] lg:text-[14.5px] font-extrabold leading-tight mt-0.5 text-primary">
                शासकीय वैद्यकीय महाविद्यालय, नंदुरबार
              </p>
            </div>
          </Link>

          {/* Right Side Actions - Floating Pill */}
          <div className="flex items-center gap-2 lg:gap-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/50 dark:border-white/10 shadow-lg shadow-primary/5 rounded-full px-2 lg:px-3 py-1.5 transition-all hover:bg-white/80 dark:hover:bg-slate-900/80">
            {/* Search Button */}
            <Button
              variant="ghost"
              size="icon"
              className="flex h-8 w-8 lg:h-10 lg:w-10 text-slate-700 dark:text-slate-200 hover:bg-primary/10 hover:text-primary rounded-full transition-all duration-200"
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-4 w-4 lg:h-5 lg:w-5" />
            </Button>

            {/* Admission Button - Desktop */}
            <Button 
              asChild
              className="hidden md:flex bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 rounded-full px-5 lg:px-7 h-8 lg:h-10 text-[11px] lg:text-[13px] transition-all duration-300 uppercase tracking-wide hover:-translate-y-0.5"
            >
              <Link href="/courses">Admissions</Link>
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-9 w-9 text-slate-700 dark:text-slate-200 hover:bg-primary/10 rounded-full transition-all duration-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              <span className="relative w-5 h-5">
                <Menu className={`h-5 w-5 absolute inset-0 transition-all duration-300 ${mobileMenuOpen ? "opacity-0 rotate-90 scale-0" : "opacity-100 rotate-0 scale-100"}`} />
                <X className={`h-5 w-5 absolute inset-0 transition-all duration-300 ${mobileMenuOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-0"}`} />
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop Navigation Menu */}
      <div className="relative z-10 hidden lg:block border-t border-border/50 bg-background/40 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4">
          <nav className="flex items-center justify-center gap-1 xl:gap-2 py-1.5">
            {navLinks.map((link: any) =>
              link.submenus && link.submenus.length > 0 ? (
                <NavDropdown key={link.id || link.href} link={link} />
              ) : (
                <Link key={link.id || link.href} href={link.href} onClick={link.href === "/" ? handleHomeClick : undefined}>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-foreground font-medium text-[10px] hover:text-primary hover:bg-primary/8 transition-all duration-200 rounded-md px-1 py-1 xl:text-[11px] xl:px-1.5 whitespace-nowrap"
                  >
                    {link.label}
                  </Button>
                </Link>
              )
            )}
          </nav>
        </div>
      </div>

      {/* Mobile Navigation Menu (Side Drawer) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, { offset, velocity }) => {
                if (offset.x > 100 || velocity.x > 500) {
                  setMobileMenuOpen(false)
                }
              }}
              className="fixed inset-y-0 right-0 z-50 w-4/5 max-w-sm bg-background dark:bg-slate-950 shadow-2xl border-l border-border/50 lg:hidden flex flex-col overflow-y-auto"
            >
              <div className="flex items-center justify-between p-4 border-b border-border/50">
                <span className="font-bold text-lg text-primary">Menu</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 text-slate-700 dark:text-slate-200 hover:bg-primary/10 rounded-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
                {navLinks.map((link: any, index: number) =>
                  link.submenus && link.submenus.length > 0 ? (
                    <div 
                      key={link.id || link.href} 
                      className="py-1 animate-fade-in-down"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <button
                        onClick={() => setExpandedMenu(expandedMenu === link.id ? null : link.id)}
                        className="w-full flex items-center justify-between px-4 py-3 min-h-[44px] text-foreground font-semibold hover:text-primary hover:bg-primary/8 rounded-lg transition-all"
                      >
                        {link.label}
                        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${expandedMenu === link.id ? "rotate-180" : ""}`} />
                      </button>
                      <div className={`ml-4 flex flex-col gap-1 border-l-2 border-primary/30 pl-4 overflow-hidden transition-all duration-300 ${expandedMenu === link.id ? "max-h-[1000px] opacity-100 py-1 mt-1" : "max-h-0 opacity-0"}`}>
                        {link.submenus.map((sub: any) => (
                          <Link
                            key={sub.id}
                            href={sub.href}
                            className="block py-2.5 min-h-[44px] text-sm text-muted-foreground hover:text-primary hover:translate-x-1 transition-all"
                            onClick={() => {
                              setMobileMenuOpen(false)
                              setExpandedMenu(null)
                            }}
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      key={link.id || link.href}
                      href={link.href}
                      className="flex items-center px-4 py-3 min-h-[44px] text-foreground font-semibold hover:text-primary hover:bg-primary/8 rounded-lg transition-all animate-fade-in-down"
                      onClick={(e) => {
                        if (link.href === "/") handleHomeClick(e)
                        else setMobileMenuOpen(false)
                      }}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {link.label}
                    </Link>
                  )
                )}
                <div className="border-t border-border pt-4 mt-4 space-y-4">
                  {/* Mobile Settings Row */}
                  <div className="grid grid-cols-1 gap-4 px-2">
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Theme</span>
                      <div className="flex items-center gap-2 bg-primary/5 border border-border rounded-lg px-3 py-1.5 min-h-[44px] cursor-pointer hover:border-primary/30 transition-colors" onClick={() => {
                        const themeToggleBtn = document.querySelector('button[aria-label="Toggle Theme"]') as HTMLButtonElement;
                        if (themeToggleBtn) themeToggleBtn.click();
                      }}>
                        <ThemeToggle className="h-6 w-6 pointer-events-none" />
                        <span className="text-sm font-medium">Toggle</span>
                      </div>
                    </div>
                  </div>

                  <Button 
                    asChild
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-lg transition-all duration-200 min-h-[44px]"
                  >
                    <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>Apply for Admission</Link>
                  </Button>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Search Modal */}
      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            {navLinks.map((link: any) => (
              <Fragment key={link.id || link.href}>
                {link.href !== "#" && (
                  <CommandItem
                    onSelect={() => {
                      setSearchOpen(false)
                      router.push(link.href)
                    }}
                  >
                    {link.label}
                  </CommandItem>
                )}
                {link.submenus?.map((sub: any) => (
                  <CommandItem
                    key={sub.id}
                    onSelect={() => {
                      setSearchOpen(false)
                      router.push(sub.href)
                    }}
                  >
                    {link.label} {'>'} {sub.label}
                  </CommandItem>
                ))}
              </Fragment>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>


    </header>
  )
}
