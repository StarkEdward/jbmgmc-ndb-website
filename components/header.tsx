"use client"

import { useState, useEffect, Fragment } from "react"
import Link from "next/link"
import { Menu, X, ChevronDown, Phone, Mail, MapPin, Clock, Search, Sun, Moon, Languages } from "lucide-react"
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

export function Header() {
  const router = useRouter()
  const { collegeInfo, departments } = useLiveData()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

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
    { id: '9', href: "/events", label: "Events", submenus: [] },
    { id: '10', href: "/contact", label: "Contact Us", submenus: [] },
  ]
  const navItems = useLiveData().navItems
  const navLinks = navItems && navItems.length > 0 ? navItems : defaultNavLinks

  const setLanguage = (langCode: string) => {
    document.cookie = `googtrans=/en/${langCode}; path=/;`;
    document.cookie = `googtrans=/en/${langCode}; path=/; domain=${window.location.hostname};`;
    window.location.reload();
  }

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      scrolled 
        ? "bg-background/95 backdrop-blur-xl shadow-lg border-b border-border" 
        : "bg-background/98 backdrop-blur border-b border-border"
    }`}>
      {/* Top Bar - Contact Info */}
      <div className="hidden md:block bg-gradient-to-r from-primary to-primary/90 text-primary-foreground border-b border-primary/50">
        <div className="mx-auto max-w-7xl px-2 xl:px-4 py-1.5 overflow-hidden">
          <div className="flex items-center justify-between gap-1 lg:gap-2 xl:gap-4 text-[10px] lg:text-[10px] xl:text-[11px]">
            <div className="flex items-center gap-1.5 lg:gap-3 xl:gap-4 whitespace-nowrap">
              
              {/* Language Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 hover:text-accent transition-colors font-medium outline-none bg-primary-foreground/10 px-1.5 lg:px-2.5 py-1 rounded border border-primary-foreground/20">
                  <Languages className="h-3.5 w-3.5 lg:h-4 lg:w-4 shrink-0" />
                  <span>Translate</span>
                  <ChevronDown className="h-3 w-3 opacity-70 shrink-0" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-40 rounded-xl border-border shadow-lg">
                  <DropdownMenuItem onClick={() => setLanguage('en')} className="cursor-pointer font-medium">English</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLanguage('hi')} className="cursor-pointer font-medium">हिंदी (Hindi)</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLanguage('mr')} className="cursor-pointer font-medium">मराठी (Marathi)</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

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

      {/* Main Header */}
      <div className="mx-auto max-w-7xl px-2 xl:px-4 py-2 lg:py-3">
        <div className="flex items-center justify-between gap-1 lg:gap-2">
          {/* Logo & Branding */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="flex h-10 w-10 lg:h-12 lg:w-12 items-center justify-center rounded-xl bg-white shadow-lg shadow-primary/20 group-hover:shadow-xl group-hover:shadow-primary/30 transition-all duration-300 group-hover:scale-105 p-1 border border-border">
              <Image src="/images/logo.png" alt="JBMGMC Logo" width={40} height={40} className="object-contain w-full h-full" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xs lg:text-sm font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
                JBMGMC
              </h1>
              <p className="text-[9px] lg:text-[10px] text-muted-foreground font-medium">
                Nandurbar
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center justify-end gap-0">
            {navLinks.map((link: any) =>
              link.submenus && link.submenus.length > 0 ? (
                <DropdownMenu key={link.id || link.href}>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex items-center gap-0.5 text-foreground font-medium text-[10px] hover:text-primary hover:bg-primary/8 transition-all duration-200 rounded-md px-1 py-1 xl:text-[11px] xl:px-1.5 whitespace-nowrap"
                    >
                      {link.label}
                      <ChevronDown className="h-3 w-3 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-64 max-h-[75vh] overflow-y-auto animate-in fade-in-0 zoom-in-95 rounded-xl border border-border shadow-lg">
                    {link.submenus.map((sub: any) => (
                      <DropdownMenuItem key={sub.id} asChild className="cursor-pointer">
                        <Link 
                          href={sub.href} 
                          className="hover:text-primary hover:bg-primary/5 transition-colors font-medium"
                        >
                          {sub.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link key={link.id || link.href} href={link.href}>
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

          {/* Right Side Actions */}
          <div className="flex items-center gap-1 lg:gap-2">
            {/* Search Button - Desktop */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex h-7 w-7 text-foreground hover:bg-primary/10 hover:text-primary rounded-lg transition-all duration-200"
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-4 w-4" />
            </Button>

            {/* Admission Button */}
            <Button 
              asChild
              className="hidden md:flex bg-accent hover:bg-accent/90 text-accent-foreground font-semibold shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/30 rounded-lg px-2 lg:px-3 h-7 text-[10px] lg:text-[11px] transition-all duration-200"
            >
              <Link href="/contact">Admissions</Link>
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-10 w-10 hover:bg-primary/10 rounded-lg transition-all duration-200"
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

      {/* Mobile Navigation Menu */}
      <div className={`lg:hidden border-t border-border bg-background dark:bg-slate-950 overflow-hidden transition-all duration-300 ease-out ${
        mobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0 pointer-events-none"
      }`}>
        <nav className="mx-auto max-w-7xl px-4 py-4 space-y-2">
          {navLinks.map((link: any, index: number) =>
            link.submenus && link.submenus.length > 0 ? (
              <div 
                key={link.id || link.href} 
                className="py-1 animate-fade-in-down"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Link
                  href={link.href}
                  className="block px-4 py-2.5 text-foreground font-semibold hover:text-primary hover:bg-primary/8 rounded-lg transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
                <div className="ml-4 mt-2 flex flex-col gap-1 border-l-2 border-primary/30 pl-4">
                  {link.submenus.map((sub: any) => (
                    <Link
                      key={sub.id}
                      href={sub.href}
                      className="block py-1.5 text-sm text-muted-foreground hover:text-primary hover:translate-x-1 transition-all"
                      onClick={() => setMobileMenuOpen(false)}
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
                className="block px-4 py-2.5 text-foreground font-semibold hover:text-primary hover:bg-primary/8 rounded-lg transition-all animate-fade-in-down"
                onClick={() => setMobileMenuOpen(false)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {link.label}
              </Link>
            )
          )}
          <div className="border-t border-border pt-4 mt-4">
            <Button 
              asChild
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-lg transition-all duration-200"
            >
              <Link href="/contact">Apply for Admission</Link>
            </Button>
          </div>
        </nav>
      </div>

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

      {/* Hidden Google Translate Widget */}
      <div id="google_translate_element" className="hidden"></div>
      <Script id="google-translate-script" strategy="afterInteractive">
        {`
          function googleTranslateElementInit() {
            new google.translate.TranslateElement(
              {
                pageLanguage: 'en',
                includedLanguages: 'hi,mr,en',
                layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false,
              },
              'google_translate_element'
            );
          }
        `}
      </Script>
      <Script
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
    </header>
  )
}
