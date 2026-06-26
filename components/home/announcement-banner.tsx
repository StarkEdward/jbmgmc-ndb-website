"use client"

import { useState, useEffect } from "react"
import { X, Bell, ChevronRight, Sparkles } from "lucide-react"
import Link from "next/link"
import { useLiveData } from "@/hooks/use-live-data"

interface BannerAnnouncement {
  id: number
  text: string
  link: string
  isUrgent: boolean
}
export function AnnouncementBanner() {
  const { newsEvents } = useLiveData()
  const [isVisible, setIsVisible] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const bannerAnnouncements: BannerAnnouncement[] = newsEvents 
    ? newsEvents.filter(n => n.showInBanner).map(n => ({
        id: n.id,
        text: n.title,
        link: `/news-events/${n.id}`,
        isUrgent: n.isUrgent || false
      }))
    : []

  // Auto-rotate announcements
  useEffect(() => {
    if (bannerAnnouncements.length <= 1) return
    
    const timer = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % bannerAnnouncements.length)
        setIsAnimating(false)
      }, 300)
    }, 5000)
    
    return () => clearInterval(timer)
  }, [bannerAnnouncements])

  if (!isVisible || bannerAnnouncements.length === 0) return null

  // Ensure current index is valid after data fetch
  const currentAnnouncement = bannerAnnouncements[currentIndex] || bannerAnnouncements[0]
  if (!currentAnnouncement) return null

  return (
    <div className={`relative overflow-hidden ${currentAnnouncement.isUrgent ? 'bg-gradient-to-r from-red-600 via-red-500 to-red-600' : 'bg-gradient-to-r from-primary via-primary/95 to-primary'}`}>
      {/* Animated background shine */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
      </div>

      <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-1 relative">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/20 backdrop-blur-sm">
            <Bell className="h-3.5 w-3.5 text-white animate-pulse" />
          </div>
          
          {/* Desktop view */}
          <div className="min-w-0 flex-1 overflow-hidden">
            <div className="hidden md:block">
              <Link 
                href={currentAnnouncement.link}
                className={`flex items-center justify-center gap-2 text-[13px] font-medium text-white hover:text-white/90 transition-all duration-300 ${
                  isAnimating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
                }`}
              >
                {currentAnnouncement.isUrgent && (
                  <span className="shrink-0 rounded bg-white/20 backdrop-blur-sm px-1.5 py-0.5 text-[10px] font-bold flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    URGENT
                  </span>
                )}
                <span className="truncate">{currentAnnouncement.text}</span>
                <ChevronRight className="h-4 w-4 shrink-0 animate-bounce-x" />
              </Link>
            </div>
            
            {/* Mobile marquee */}
            <div className="md:hidden">
              <div className="animate-marquee whitespace-nowrap">
                <Link 
                  href={currentAnnouncement.link}
                  className="inline-flex items-center gap-2 text-sm font-medium text-white"
                >
                  {currentAnnouncement.isUrgent && (
                    <span className="rounded-md bg-white/20 px-2 py-0.5 text-xs font-bold">
                      URGENT
                    </span>
                  )}
                  {currentAnnouncement.text}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation dots for multiple announcements */}
        {bannerAnnouncements.length > 1 && (
          <div className="hidden items-center gap-2 md:flex">
            {bannerAnnouncements.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAnimating(true)
                  setTimeout(() => {
                    setCurrentIndex(index)
                    setIsAnimating(false)
                  }, 300)
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`View announcement ${index + 1}`}
              />
            ))}
          </div>
        )}

        <button
          onClick={() => setIsVisible(false)}
          className="shrink-0 rounded-md p-1 text-white/80 hover:bg-white/20 hover:text-white transition-all hover:scale-110"
          aria-label="Close announcement"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-marquee {
          animation: marquee 15s linear infinite;
        }
        @keyframes bounce-x {
          0%, 100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(3px);
          }
        }
        .animate-bounce-x {
          animation: bounce-x 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
