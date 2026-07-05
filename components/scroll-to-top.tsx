'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

function TwoColorDna({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Rungs (Base Pairs) - Neutral Color */}
      <g className="stroke-slate-400 dark:stroke-slate-500">
        <path d="m10 16 1.5 1.5" />
        <path d="m14 8-1.5-1.5" />
        <path d="m16.5 10.5 1 1" />
        <path d="m17 6-2.891-2.891" />
        <path d="m20 9 .891.891" />
        <path d="M3.109 14.109 4 15" />
        <path d="m6.5 12.5 1 1" />
        <path d="m7 18 2.891 2.891" />
      </g>
      
      {/* Back Strand (Blue) */}
      <g className="stroke-blue-500">
        <path d="M15 2c-1.798 1.998-2.518 3.995-2.807 5.993" />
        <path d="M9 22c1.798-1.998 2.518-3.995 2.807-5.993" />
      </g>
      
      {/* Front Strand (Red) */}
      <g className="stroke-red-500">
        <path d="M2 15c6.667-6 13.333 0 20-6" />
      </g>
    </svg>
  )
}

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const docHeight = document.documentElement.scrollHeight
      const winHeight = window.innerHeight
      
      const maxScroll = docHeight - winHeight
      const progress = maxScroll > 0 ? Math.min((scrollY / maxScroll) * 100, 100) : 0
      
      setScrollProgress(progress)
      
      if (scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  // SVG circle calculations for a 48x48 viewBox
  const circleRadius = 22
  const circleCircumference = 2 * Math.PI * circleRadius
  const strokeDashoffset = circleCircumference - (scrollProgress / 100) * circleCircumference

  return (
    <>
      <style>{`
        @keyframes heartbeat-pulse {
          0% { box-shadow: 0 0 0 0 rgba(30, 58, 95, 0.4); }
          50% { box-shadow: 0 0 0 10px rgba(30, 58, 95, 0); }
          100% { box-shadow: 0 0 0 0 rgba(30, 58, 95, 0); }
        }
        @keyframes heartbeat-pulse-dark {
          0% { box-shadow: 0 0 0 0 rgba(96, 165, 250, 0.4); }
          50% { box-shadow: 0 0 0 10px rgba(96, 165, 250, 0); }
          100% { box-shadow: 0 0 0 0 rgba(96, 165, 250, 0); }
        }
        .animate-heartbeat {
          animation: heartbeat-pulse 2.5s infinite cubic-bezier(0.4, 0, 0.6, 1);
        }
        .dark .animate-heartbeat {
          animation-name: heartbeat-pulse-dark;
        }
        @keyframes gentle-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .group:hover .dna-icon {
          animation: gentle-float 2s ease-in-out infinite;
        }
      `}</style>
      
      <button
        onClick={scrollToTop}
        className={cn(
          "fixed bottom-5 right-5 md:bottom-8 md:right-8 z-[99] flex items-center justify-center rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-all duration-300 ease-out hover:bg-white dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-slate-950 group border border-slate-200 dark:border-slate-800",
          isVisible ? "opacity-100 translate-y-0 shadow-lg animate-heartbeat" : "opacity-0 translate-y-12 pointer-events-none",
          "w-12 h-12 md:w-14 md:h-14"
        )}
        aria-label="Scroll to top"
      >
        {/* Progress SVG Ring */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <svg
            className="-rotate-90 w-full h-full"
            viewBox="0 0 48 48"
          >
            {/* Background Ring */}
            <circle
              cx="24"
              cy="24"
              r={circleRadius}
              className="stroke-slate-200/50 dark:stroke-slate-700/50"
              strokeWidth="2.5"
              fill="none"
            />
            {/* Progress Ring */}
            <circle
              cx="24"
              cy="24"
              r={circleRadius}
              className="stroke-primary dark:stroke-blue-400 transition-all duration-150 ease-out"
              strokeWidth="2.5"
              fill="none"
              strokeDasharray={circleCircumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* DNA Icon */}
        <div className="relative z-10 flex items-center justify-center dna-icon transition-transform duration-300">
          <TwoColorDna />
        </div>
      </button>
    </>
  )
}
