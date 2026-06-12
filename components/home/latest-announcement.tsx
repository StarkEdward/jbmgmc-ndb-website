"use client"

import { useState, useEffect, useMemo } from "react"
import { Sparkles, ChevronRight } from "lucide-react"
import { useLiveData } from "@/hooks/use-live-data"

const defaultAnnouncements = [
  "PG MD-MS ADMISSION BROCHURE 2025-26 Now Available",
  "BSc Nursing Admission Brochure 2025-26 Released",
  "MBBS Admission Brochure 2025-26 Published",
  "Walk-in Interview for Various Posts",
]

export function LatestAnnouncement() {
  const { announcementsTicker } = useLiveData()

  const activeAnnouncements = useMemo(() => {
    return announcementsTicker.length > 0 
      ? announcementsTicker.map(t => t.text) 
      : defaultAnnouncements
  }, [announcementsTicker])

  const [currentAnnouncement, setCurrentAnnouncement] = useState(0)

  useEffect(() => {
    if (activeAnnouncements.length === 0) return
    const announcementTimer = setInterval(() => {
      setCurrentAnnouncement((prev) => (prev + 1) % activeAnnouncements.length)
    }, 4500)
    return () => clearInterval(announcementTimer)
  }, [activeAnnouncements])

  return (
    <div className="bg-accent text-accent-foreground py-2.5 relative overflow-hidden">
      <div className="absolute inset-0 animate-shimmer" />
      <div className="mx-auto max-w-7xl px-4 relative">
        <div className="flex items-center justify-center gap-2 text-sm font-medium">
          <Sparkles className="h-4 w-4 animate-pulse" />
          <span className="font-semibold">Latest:</span>
          <span className="truncate transition-all duration-500 max-w-[280px] sm:max-w-xl md:max-w-2xl lg:max-w-none">
            {activeAnnouncements[currentAnnouncement] || "Loading alerts..."}
          </span>
          <ChevronRight className="h-4 w-4 shrink-0 animate-bounce-x" />
        </div>
      </div>
    </div>
  )
}
