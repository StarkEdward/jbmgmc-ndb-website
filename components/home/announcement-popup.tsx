"use client"

import { useState, useEffect } from "react"
import { X, Megaphone, Calendar, ExternalLink, Sparkles, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useLiveData } from "@/hooks/use-live-data"
import { formatDate } from "@/lib/utils"

interface Announcement {
  id: number
  title: string
  description: string
  date: string
  isNew: boolean
  link?: string
  type: "important" | "general" | "admission" | "exam"
}

// removed hardcoded announcements

const typeColors = {
  important: "bg-red-500/10 text-red-600 border-red-200",
  general: "bg-primary/10 text-primary border-primary/20",
  admission: "bg-accent/10 text-accent border-accent/20",
  exam: "bg-amber-500/10 text-amber-600 border-amber-200"
}

const typeLabels = {
  important: "Important",
  general: "General",
  admission: "Admission",
  exam: "Examination"
}

export function AnnouncementPopup() {
  const { newsEvents } = useLiveData()
  const [isOpen, setIsOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const announcements: Announcement[] = newsEvents
    ? newsEvents.filter((n: any) => {
        if (!n.showInPopup) return false;
        const todayStr = new Date().toISOString().split('T')[0];
        if (n.popupStartDate && n.popupStartDate > todayStr) return false;
        if (n.popupEndDate && n.popupEndDate < todayStr) return false;
        return true;
      }).map((n: any) => ({
        id: n.id,
        title: n.title,
        description: n.description,
        date: n.date,
        isNew: n.isNew || false,
        link: `/news-events/${n.id}`,
        type: n.popupType || "general"
      }))
    : []

  useEffect(() => {
    if (announcements.length === 0) return
    const seen = sessionStorage.getItem("announcementPopupSeen")
    if (!seen) {
      const timer = setTimeout(() => {
        setIsOpen(true)
        setIsAnimating(true)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [announcements.length])

  const handleClose = () => {
    setIsAnimating(false)
    setTimeout(() => {
      setIsOpen(false)
      sessionStorage.setItem("announcementPopupSeen", "true")
    }, 300)
  }

  if (!isOpen) return null

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isAnimating ? "bg-black/50 backdrop-blur-sm" : "bg-black/0"
      }`}
      onClick={handleClose}
    >
      <div 
        className={`relative max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-background shadow-2xl transition-all duration-500 ${
          isAnimating ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-8"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 border-b bg-gradient-to-br from-primary via-primary to-primary/90 px-6 py-5 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/20 rounded-full blur-2xl" />
          </div>
          
          <div className="flex items-center justify-between relative">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm shadow-lg">
                <Bell className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  Important Announcements
                  <Sparkles className="h-5 w-5 text-accent animate-pulse" />
                </h2>
                <p className="text-sm text-white/80">JBMGMC Nandurbar</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="text-white hover:bg-white/20 rounded-xl transition-all hover:scale-110"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close announcements</span>
            </Button>
          </div>
        </div>

        {/* Announcements List */}
        <div className="max-h-[55vh] overflow-y-auto p-6">
          <div className="space-y-4">
            {announcements.map((announcement, index) => (
              <div
                key={announcement.id}
                className={`rounded-xl border bg-card p-5 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 hover:border-primary/30 group cursor-pointer ${
                  isAnimating ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: `${index * 100 + 200}ms` }}
              >
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${typeColors[announcement.type]}`}>
                      {typeLabels[announcement.type]}
                    </span>
                    {announcement.isNew && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground animate-pulse">
                        <Sparkles className="h-3 w-3" />
                        NEW
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                    <Calendar className="h-3 w-3" />
                    {formatDate(announcement.date)}
                  </div>
                </div>
                <h3 className="mb-2 font-bold text-foreground text-lg group-hover:text-primary transition-colors">{announcement.title}</h3>
                <p className="mb-4 text-sm text-muted-foreground leading-relaxed">{announcement.description}</p>
                {announcement.link && (
                  <Link
                    href={announcement.link}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-accent transition-colors group/link"
                    onClick={handleClose}
                  >
                    Learn more 
                    <ExternalLink className="h-3.5 w-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 border-t bg-muted/50 backdrop-blur-sm px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/news-events"
              className="text-sm font-semibold text-primary hover:text-accent transition-colors flex items-center gap-1 group"
              onClick={handleClose}
            >
              View all announcements
              <ExternalLink className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Button 
              onClick={handleClose}
              className="shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all hover:-translate-y-0.5"
            >
              Got it, thanks!
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
