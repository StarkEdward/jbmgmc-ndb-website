'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function ImageGallery({ images, title }: { images: string[], title: string }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!images || images.length === 0) return null

  if (images.length === 1) {
    return (
      <div className="w-full bg-slate-50/50 dark:bg-slate-900/20 border-b border-slate-200 dark:border-slate-800 p-4 sm:p-8 lg:p-12">
        <div className="mx-auto max-w-4xl flex items-center justify-center bg-white dark:bg-slate-950 rounded-2xl overflow-hidden shadow-sm border border-slate-200/60 dark:border-slate-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={images[0]} 
            alt={title} 
            className="w-full h-auto max-h-[85vh] object-contain" 
          />
        </div>
      </div>
    )
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="w-full bg-slate-50/50 dark:bg-slate-900/20 border-b border-slate-200 dark:border-slate-800 p-4 sm:p-8 lg:p-12 flex flex-col items-center">
      
      {/* Main Carousel View */}
      <div className="relative w-full max-w-5xl group bg-white dark:bg-slate-950 rounded-2xl overflow-hidden shadow-sm border border-slate-200/60 dark:border-slate-800 flex items-center justify-center min-h-[400px]">
        
        {/* Main Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={images[currentIndex]} 
          alt={`${title} - Image ${currentIndex + 1}`} 
          className="w-full h-auto max-h-[75vh] object-contain transition-opacity duration-500" 
        />

        {/* Glassmorphism Navigation Arrows */}
        <button 
          onClick={prevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/40 hover:bg-white/60 dark:bg-slate-900/40 dark:hover:bg-slate-900/60 backdrop-blur-md border border-white/50 dark:border-slate-700/50 shadow-lg text-slate-800 dark:text-white transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
        >
          <ChevronLeft className="w-6 h-6 ml-[-2px]" />
        </button>

        <button 
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/40 hover:bg-white/60 dark:bg-slate-900/40 dark:hover:bg-slate-900/60 backdrop-blur-md border border-white/50 dark:border-slate-700/50 shadow-lg text-slate-800 dark:text-white transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
        >
          <ChevronRight className="w-6 h-6 mr-[-2px]" />
        </button>

        {/* Image Counter Badge (Glassmorphism) */}
        <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-xs font-bold shadow-sm">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="mt-6 flex flex-wrap justify-center gap-3 max-w-5xl px-4">
        {images.map((url, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`relative overflow-hidden rounded-xl h-20 w-32 border-2 transition-all duration-300 ${currentIndex === idx ? 'border-primary shadow-md scale-105 opacity-100' : 'border-transparent opacity-50 hover:opacity-100 hover:scale-105 bg-slate-200 dark:bg-slate-800'}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
            {currentIndex === idx && (
              <div className="absolute inset-0 bg-primary/10"></div>
            )}
          </button>
        ))}
      </div>

    </div>
  )
}
