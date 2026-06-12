"use client"

import { authorities, departments } from "@/lib/data"
import Image from "next/image"
import { Crown, Building2, GraduationCap, ChevronDown, Stethoscope } from "lucide-react"
import { useAnimation } from "@/hooks/use-animation"
import { useRef, useState, useEffect } from "react"

export function AuthoritiesSection() {
  const { ref: sectionRef, isVisible } = useAnimation<HTMLElement>({ threshold: 0.05 })

  const ministers = authorities.filter(a => a.category === "minister")
  const adminAuthorities = authorities.filter(a => a.category === "authority")
  const topLeadership = ministers.slice(0, 2)
  const departmentMinisters = ministers.slice(2)

  // Extract HOD from each department
  const hods = departments.map(dept => {
    const hod = dept.doctors.find(d =>
      d.designation.toLowerCase().includes("hod") ||
      d.designation.toLowerCase().includes("head")
    ) || dept.doctors[0]
    return {
      dept: dept.name,
      name: hod.name,
      qualification: hod.qualification,
      experience: hod.experience,
    }
  })

  // Javascript Auto-Scroll, Drag & Wheel Logic
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    let animationFrameId: number
    let direction = 1
    const speed = 0.5 // Pixels per frame

    const scroll = () => {
      if (!isHovered && !isDragging) {
        container.scrollLeft += speed * direction

        if (container.scrollLeft >= container.scrollWidth - container.clientWidth - 1) {
          direction = -1
        } else if (container.scrollLeft <= 0) {
          direction = 1
        }
      }
      animationFrameId = requestAnimationFrame(scroll)
    }

    animationFrameId = requestAnimationFrame(scroll)
    return () => cancelAnimationFrame(animationFrameId)
  }, [isHovered, isDragging])

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault()
        container.scrollLeft += e.deltaY
      }
    }
    
    // passive: false is required to call preventDefault on wheel events
    container.addEventListener('wheel', handleWheel, { passive: false })
    return () => container.removeEventListener('wheel', handleWheel)
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    if (!scrollContainerRef.current) return
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft)
    setScrollLeft(scrollContainerRef.current.scrollLeft)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollContainerRef.current.offsetLeft
    const walk = (x - startX) * 2 // Scroll speed multiplier
    scrollContainerRef.current.scrollLeft = scrollLeft - walk
  }

  const handleMouseUpOrLeave = () => {
    setIsDragging(false)
  }

  return (
    <section
      ref={sectionRef}
      className="pt-8 md:pt-12 pb-16 md:pb-24 bg-gradient-to-b from-muted/30 via-background to-muted/20 relative overflow-hidden"
    >
      {/* Dot grid background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="tree-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="1" fill="currentColor" className="text-primary/20" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#tree-pattern)" />
        </svg>
      </div>
      <div className="absolute top-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 relative">

        {/* Section header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            <Building2 className="w-4 h-4" />
            Institutional Hierarchy
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            Institutional Administration
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Our institution is led by dedicated medical professionals and administrators committed to excellence.
          </p>
        </div>

        {/* ── LEVEL 3: Director & Dean ── */}
        <div className={`transition-all duration-700 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <LevelBadge icon={<GraduationCap className="w-5 h-5 text-primary" />} label="JBMGMC Nandurbar Administration" color="primary" large />

          {/* tree branch lines */}
          <div className="hidden md:block relative mx-auto w-full max-w-sm h-8 mb-2">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-primary/50" />
            <div className="absolute bottom-4 left-[25%] right-[25%] h-0.5 bg-primary/50" />
            <div className="absolute bottom-4 left-[25%] w-0.5 h-4 bg-primary/50" />
            <div className="absolute bottom-4 right-[25%] w-0.5 h-4 bg-primary/50" />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 -translate-y-px w-2 h-2 rounded-full bg-primary" />
          </div>

          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            {adminAuthorities.map((person, index) => (
              <PersonCard
                key={index}
                person={person}
                size="xl"
                badge={
                  <span className="text-[9px] font-bold tracking-wider uppercase">
                    {index === adminAuthorities.length - 1 ? "Dean" : "Director"}
                  </span>
                }
                badgeColor={index === adminAuthorities.length - 1 ? "bg-gradient-to-r from-primary to-accent" : "bg-primary"}
                ringColor="ring-primary/30"
                borderColor="border-primary/30"
                wide
              />
            ))}
          </div>
        </div>

        {/* Connector 3→4 */}
        <Connector label="Department Level" delay={600} isVisible={isVisible} />

        {/* ── LEVEL 4: HODs ── */}
        <div className={`transition-all duration-700 delay-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <LevelBadge icon={<Stethoscope className="w-4 h-4 text-accent" />} label="Heads of Departments (HOD)" color="accent" />

          {/* Horizontal scrollable HOD strip */}
          <div className="relative mt-6">
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

            {/* Horizontal connecting line */}
            <div className="absolute top-[38px] left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

            <div 
              className="overflow-x-auto scrollbar-hide pb-4 pt-2 group cursor-grab active:cursor-grabbing"
              ref={scrollContainerRef}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => { setIsHovered(false); handleMouseUpOrLeave(); }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUpOrLeave}
            >
              <div className="flex w-max">
                {/* 2 copies to ensure it is long enough to scroll nicely on 4k monitors */}
                {[...hods, ...hods].map((hod, index) => (
                  <div key={index} className="flex flex-col items-center mx-3 w-32 shrink-0 select-none">
                    {/* vertical stem */}
                    <div className="w-0.5 h-4 bg-accent/40 mb-0" />

                    {/* dot on the horizontal line */}
                    <div className="w-2.5 h-2.5 rounded-full bg-accent/60 border-2 border-background shadow-sm mb-3" />

                    {/* HOD card */}
                    <div className="bg-card border border-accent/20 rounded-xl p-3 shadow-md hover:shadow-lg hover:border-accent/50 hover:-translate-y-1 transition-all duration-300 w-full text-center cursor-default">
                      {/* Avatar placeholder */}
                      <div className="mx-auto mb-2 h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-accent/30">
                        <span className="text-sm font-bold text-primary">
                          {hod.name.split(" ").slice(-1)[0][0]}
                        </span>
                      </div>

                      {/* Dept badge */}
                      <div className="mb-1.5">
                        <span className="inline-block text-[9px] font-bold uppercase tracking-wider bg-accent/10 text-accent px-2 py-0.5 rounded-full">
                          {hod.dept.length > 12 ? hod.dept.slice(0, 12) + "…" : hod.dept}
                        </span>
                      </div>

                      <p className="text-xs font-semibold text-foreground hover:text-primary transition-colors line-clamp-2 leading-tight">
                        {hod.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {hod.qualification}
                      </p>
                      <p className="text-[9px] text-accent/70 font-medium mt-0.5">
                        {hod.experience}
                      </p>

                      {/* Bottom accent line */}
                      <div className="mt-2 mx-auto w-8 h-0.5 bg-gradient-to-r from-primary/0 via-accent/40 to-primary/0 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom emblem */}
        <div className={`flex justify-center mt-14 transition-all duration-700 delay-[900ms] ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}>
          <div className="flex flex-col items-center">
            <div className="w-0.5 h-8 bg-gradient-to-b from-accent/40 to-transparent" />
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border-2 border-primary/20 shadow-lg">
              <span className="text-lg font-bold text-primary">JBM</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground font-medium">Serving Since 2019</p>
          </div>
        </div>

      </div>
    </section>
  )
}

/* ─── Sub-components ─── */

function Connector({ label, delay, isVisible }: { label: string; delay: number; isVisible: boolean }) {
  return (
    <div
      className={`flex justify-center my-6 transition-all duration-700 ${isVisible ? "opacity-100" : "opacity-0"}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex flex-col items-center gap-1">
        <div className="w-0.5 h-6 bg-gradient-to-b from-primary/50 to-primary/30" />
        <div className="flex items-center gap-1 bg-primary/8 border border-primary/15 px-3 py-1 rounded-full">
          <ChevronDown className="w-3.5 h-3.5 text-primary animate-bounce" />
          <span className="text-[11px] font-semibold text-primary">{label}</span>
          <ChevronDown className="w-3.5 h-3.5 text-primary animate-bounce" />
        </div>
        <div className="w-0.5 h-6 bg-gradient-to-b from-primary/30 to-primary/50" />
      </div>
    </div>
  )
}

function LevelBadge({
  icon, label, color, large
}: { icon: React.ReactNode; label: string; color: "primary" | "accent"; large?: boolean }) {
  return (
    <div className="flex items-center justify-center gap-3 mb-5">
      <div className={`h-px w-16 bg-gradient-to-r from-transparent to-${color}/40`} />
      <div className={`flex items-center gap-2 bg-${color}/10 px-4 py-2 rounded-full border border-${color}/20 shadow-sm`}>
        {icon}
        <span className={`${large ? "text-sm font-bold" : "text-sm font-semibold"} text-${color}`}>{label}</span>
      </div>
      <div className={`h-px w-16 bg-gradient-to-l from-transparent to-${color}/40`} />
    </div>
  )
}

function PersonCard({
  person, size, badge, badgeColor, ringColor, borderColor, wide
}: {
  person: { name: string; designation: string; image?: string }
  size: "md" | "lg" | "xl"
  badge: React.ReactNode
  badgeColor: string
  ringColor: string
  borderColor: string
  wide?: boolean
}) {
  const imgSize = { md: "h-16 w-16 md:h-20 md:w-20", lg: "h-20 w-20 md:h-24 md:w-24", xl: "h-24 w-24 md:h-28 md:w-28" }[size]
  const cardWidth = wide ? "w-44 md:w-52" : size === "lg" ? "w-40 md:w-48" : "w-36 md:w-40"
  const padding = size === "xl" ? "p-5" : size === "lg" ? "p-4" : "p-3"

  return (
    <div className="relative group">
      <div className="absolute -inset-2 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className={`relative bg-card ${borderColor} border-2 rounded-2xl ${padding} shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ${cardWidth}`}>
        {/* Badge */}
        <div className={`absolute -top-3 left-1/2 -translate-x-1/2 ${badgeColor} text-white px-3 py-1 rounded-full text-[10px] shadow-lg flex items-center gap-1`}>
          {badge}
        </div>
        {/* Avatar */}
        <div className={`relative mx-auto mb-3 ${imgSize} rounded-full overflow-hidden ring-4 ${ringColor} shadow-lg group-hover:ring-primary/40 transition-all duration-300`}>
          {person.image ? (
            <Image src={person.image} alt={person.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-2xl font-bold bg-primary/10 text-primary">
              {person.name.split(" ").slice(-1)[0][0]}
            </span>
          )}
        </div>
        <h4 className="font-bold text-foreground text-sm text-center line-clamp-1 group-hover:text-primary transition-colors">
          {person.name}
        </h4>
        <p className="text-[11px] text-muted-foreground mt-1 text-center line-clamp-2 leading-relaxed">
          {person.designation}
        </p>
        <div className="mt-3 mx-auto w-10 h-0.5 bg-gradient-to-r from-primary/0 via-primary/40 to-primary/0 rounded-full" />
      </div>
    </div>
  )
}
