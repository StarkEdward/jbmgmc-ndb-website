'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react'

export function ImageGallery({ images, title }: { images: string[], title: string }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  // Prevent scrolling when lightbox is open
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [lightboxIndex])

  if (!images || images.length === 0) return null

  if (images.length === 1) {
    return (
      <div className="w-full bg-slate-50/50 dark:bg-slate-900/20 border-b border-slate-200 dark:border-slate-800 p-4 sm:p-8 lg:p-12">
        <div className="mx-auto max-w-4xl flex items-center justify-center bg-white dark:bg-slate-950 rounded-2xl overflow-hidden shadow-sm border border-slate-200/60 dark:border-slate-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={images[0]} 
            alt={title} 
            className="w-full h-auto max-h-[85vh] object-contain cursor-pointer transition-transform hover:scale-[1.01]" 
            onClick={() => setLightboxIndex(0)}
          />
        </div>

        {/* Full Screen Lightbox Modal for Single Image */}
        {lightboxIndex === 0 && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md transition-opacity"
            onClick={() => setLightboxIndex(null)}
          >
            <button 
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all hover:scale-110"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="relative w-full max-w-6xl h-full flex items-center justify-center p-4 sm:p-12" onClick={(e) => e.stopPropagation()}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={images[0]} 
                alt={title} 
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl" 
              />
            </div>
          </div>
        )}
      </div>
    )
  }

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev! + 1) % images.length)
    }
  }

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev! - 1 + images.length) % images.length)
    }
  }

  return (
    <div className="w-full bg-slate-50/50 dark:bg-slate-900/20 border-b border-slate-200 dark:border-slate-800 p-4 sm:p-8 flex flex-col items-center">
      
      {/* Thumbnails View on Page */}
      <div className="flex flex-wrap justify-center gap-4 max-w-5xl">
        {images.map((url, idx) => (
          <button
            key={idx}
            onClick={() => setLightboxIndex(idx)}
            className="group relative overflow-hidden rounded-2xl h-40 w-40 sm:h-48 sm:w-48 lg:h-56 lg:w-56 border-2 border-transparent hover:border-primary shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-white dark:bg-slate-900"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition-colors duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300 bg-white/90 dark:bg-slate-900/90 p-2 rounded-full shadow-lg">
                <ZoomIn className="w-6 h-6 text-primary" />
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Full Screen Lightbox Modal */}
      {lightboxIndex !== null && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md transition-opacity"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Close Button */}
          <button 
            onClick={() => setLightboxIndex(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all hover:scale-110"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Main Image Container */}
          <div className="relative w-full max-w-6xl h-full flex items-center justify-center p-4 sm:p-12" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={images[lightboxIndex]} 
              alt={`${title} - Image ${lightboxIndex + 1}`} 
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl" 
            />

            {/* Previous Arrow (only show if > 1 image) */}
            {images.length > 1 && (
              <button 
                onClick={prevImage}
                className="absolute left-4 sm:left-12 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 shadow-lg text-white transition-all hover:scale-110"
              >
                <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8 ml-[-2px]" />
              </button>
            )}

            {/* Next Arrow (only show if > 1 image) */}
            {images.length > 1 && (
              <button 
                onClick={nextImage}
                className="absolute right-4 sm:right-12 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 shadow-lg text-white transition-all hover:scale-110"
              >
                <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 mr-[-2px]" />
              </button>
            )}

            {/* Image Counter */}
            {images.length > 1 && (
              <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white text-sm font-semibold tracking-wider">
                {lightboxIndex + 1} / {images.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
