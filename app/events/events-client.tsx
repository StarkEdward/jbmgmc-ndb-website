'use client'

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { motion, AnimatePresence } from "framer-motion"
import { EventBlogItem } from "@/lib/db"
import { Calendar, Image as ImageIcon, Video, X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react"
import dynamic from 'next/dynamic'

const Beams = dynamic(() => import('@/components/ui/Beams'), { ssr: false })

export function EventsClient({ initialAlbums }: { initialAlbums: EventBlogItem[] }) {
  const [selectedAlbum, setSelectedAlbum] = useState<EventBlogItem | null>(null)
  const [lightboxImage, setLightboxImage] = useState<number | null>(null)
  const [visibleCount, setVisibleCount] = useState(6)

  // Pre-load masonry layout for smoother transitions
  const [isClient, setIsClient] = useState(false)
  useEffect(() => setIsClient(true), [])

  const handlePrev = () => {
    if (lightboxImage !== null && lightboxImage > 0) {
      setLightboxImage(lightboxImage - 1)
    }
  }

  const handleNext = () => {
    if (selectedAlbum?.photos && lightboxImage !== null && lightboxImage < selectedAlbum.photos.length - 1) {
      setLightboxImage(lightboxImage + 1)
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxImage !== null) {
        if (e.key === 'ArrowLeft') handlePrev()
        if (e.key === 'ArrowRight') handleNext()
        if (e.key === 'Escape') setLightboxImage(null)
      } else if (selectedAlbum !== null && e.key === 'Escape') {
        setSelectedAlbum(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxImage, selectedAlbum])

  // Helper to extract YouTube ID
  const getYoutubeId = (url?: string) => {
    if (!url) return null
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950 font-sans">
      <Header />
      <main className="flex-1 relative">
        
        {/* PREMIUM HERO SECTION */}
        <section className="relative min-h-[40vh] overflow-hidden bg-slate-900 flex items-center justify-center pt-24 pb-16">
          <div className="absolute inset-0 bg-black opacity-80" />
          <div className="absolute inset-0 z-0">
            <Beams
              beamWidth={2}
              beamHeight={30}
              beamNumber={120}
              lightColor="#06B6D4"
              speed={3.3}
              noiseIntensity={2.1}
              scale={0.2}
              rotation={143}
            />
          </div>
          
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <span className="inline-block py-1 px-3 rounded-full bg-teal-500/10 text-teal-400 text-sm font-bold tracking-widest uppercase mb-6 border border-teal-500/20 backdrop-blur-sm">
                Our Memories
              </span>
              <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
                Event <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-300">Albums</span>
              </h1>
              <p className="text-base md:text-lg text-slate-400 font-medium max-w-2xl mx-auto">
                Relive the most cherished moments, celebrations, and ceremonies at JBMGMC.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ALBUMS GRID */}
        <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 min-h-[500px]">
          {initialAlbums.length > 0 ? (
            <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {initialAlbums.slice(0, visibleCount).map((album, index) => (
                <motion.div
                  key={album.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="group relative cursor-pointer"
                  onClick={() => setSelectedAlbum(album)}
                >
                  {/* Photo Stack Effect Base Layers */}
                  <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 rounded-3xl translate-y-3 scale-95 shadow-lg transition-transform duration-300 group-hover:translate-y-4 group-hover:scale-[0.98] group-hover:-rotate-2" />
                  <div className="absolute inset-0 bg-slate-300 dark:bg-slate-700 rounded-3xl translate-y-1.5 scale-[0.97] shadow-lg transition-transform duration-300 group-hover:translate-y-2 group-hover:scale-100 group-hover:rotate-1" />
                  
                  {/* Main Card */}
                  <div className="relative bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-xl border border-slate-100 dark:border-slate-800 transition-all duration-300 group-hover:shadow-teal-500/10">
                    <div className="relative aspect-[4/3] bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      {album.photos && album.photos.length > 0 ? (
                        <img 
                          src={album.photos[0]} 
                          alt={album.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <ImageIcon className="w-12 h-12" />
                        </div>
                      )}
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                      
                      {/* Photo Count Badge */}
                      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-xs font-bold border border-white/10 flex items-center gap-1.5 shadow-sm transform transition-transform group-hover:scale-105">
                        <ImageIcon className="w-3.5 h-3.5" />
                        {album.photos?.length || 0} Photos
                      </div>
                      
                      {album.youtubeVideoUrl && (
                        <div className="absolute top-4 left-4 bg-rose-500/90 backdrop-blur-md px-2 py-1.5 rounded-full text-white text-xs font-bold border border-rose-400 flex items-center gap-1 shadow-sm">
                          <Video className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6 relative">
                      <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 text-xs font-bold uppercase tracking-wider mb-2">
                        <Calendar className="w-3.5 h-3.5" />
                        {album.date}
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                        {album.title}
                      </h3>
                      
                      <div className="mt-4 flex items-center text-sm font-semibold text-slate-500 group-hover:text-teal-500 transition-colors">
                        View Album <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {visibleCount < initialAlbums.length && (
              <div className="mt-16 flex justify-center">
                <button
                  onClick={() => setVisibleCount(prev => prev + 6)}
                  className="group relative px-8 py-3.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative flex items-center gap-2">
                    Load More Albums
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </div>
            )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="w-24 h-24 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mb-6">
                <ImageIcon className="w-10 h-10 text-slate-300 dark:text-slate-700" />
              </div>
              <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-2">No Event Albums Yet</h3>
              <p className="text-slate-500 max-w-md">Stay tuned! We are organizing our event memories and will upload them soon.</p>
            </div>
          )}
        </section>
      </main>

      {/* =========================================================================
          ALBUM DETAIL MODAL OVERLAY
          ========================================================================= */}
      <AnimatePresence>
        {selectedAlbum && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-50 dark:bg-slate-950 overflow-y-auto"
          >
            {/* Premium Parallax Header (Reduced Height) */}
            <div className="relative h-64 md:h-[320px] w-full overflow-hidden flex flex-col justify-end">
              {/* Background Image with Parallax & Blur */}
              <div className="absolute inset-0">
                <img 
                  src={selectedAlbum.photos && selectedAlbum.photos.length > 0 ? selectedAlbum.photos[0] : '/images/campus-view.webp'} 
                  alt="Background" 
                  className="w-full h-full object-cover scale-105 filter blur-sm"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-slate-900/10" />
              </div>

              {/* Close Button */}
              <button 
                onClick={() => { setSelectedAlbum(null); setLightboxImage(null); }}
                className="fixed top-6 right-6 p-3 bg-slate-900/50 hover:bg-slate-900/80 backdrop-blur-md rounded-full transition-colors border border-white/20 z-50 group shadow-xl"
              >
                <X className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-300" />
              </button>

              {/* Title & Metadata (Glassmorphic) */}
              <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="max-w-4xl"
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 backdrop-blur-md border border-teal-500/30 text-teal-300 text-xs font-bold tracking-wide uppercase mb-3 shadow-lg">
                    <Calendar className="w-3.5 h-3.5" /> {selectedAlbum.date}
                  </div>
                  <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight drop-shadow-lg">
                    {selectedAlbum.title}
                  </h2>
                </motion.div>
              </div>
            </div>

            {/* Content Area */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
              
              {/* Description & Video (Bento-style layout) */}
              {(selectedAlbum.content || selectedAlbum.youtubeVideoUrl) && (
                <div className="mb-12 grid lg:grid-cols-12 gap-6">
                  {selectedAlbum.content && (
                    <div className={selectedAlbum.youtubeVideoUrl ? 'lg:col-span-5' : 'lg:col-span-12'}>
                      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 shadow-md border border-slate-200 dark:border-slate-800 relative overflow-hidden h-full">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-teal-400 to-emerald-500" />
                        <div className="absolute -right-8 -top-8 text-slate-100 dark:text-slate-800/50">
                          <ImageIcon className="w-32 h-32 transform rotate-12" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-3 relative z-10">About this Event</h3>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm md:text-base relative z-10">
                          {selectedAlbum.content}
                        </p>
                      </div>
                    </div>
                  )}
                  {selectedAlbum.youtubeVideoUrl && getYoutubeId(selectedAlbum.youtubeVideoUrl) && (
                    <div className={selectedAlbum.content ? 'lg:col-span-7' : 'lg:col-span-12'}>
                      <div className="aspect-video rounded-2xl overflow-hidden shadow-md bg-black border-2 border-slate-200 dark:border-slate-800 group relative">
                        <div className="absolute inset-0 bg-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        <iframe
                          src={`https://www.youtube.com/embed/${getYoutubeId(selectedAlbum.youtubeVideoUrl)}?autoplay=0&rel=0`}
                          title="Event Video"
                          className="w-full h-full relative z-10"
                          allowFullScreen
                        ></iframe>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Photos Masonry Grid */}
              <div className="mb-8 flex items-center gap-3">
                <div className="h-8 w-2 bg-teal-500 rounded-full" />
                <h3 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white">Event Gallery</h3>
              </div>
              
              <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                {selectedAlbum.photos?.map((photo, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: (idx % 8) * 0.1 }}
                    className="break-inside-avoid relative group cursor-pointer"
                    onClick={() => setLightboxImage(idx)}
                  >
                    <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-200/50 dark:border-slate-700/50 hover:shadow-2xl hover:shadow-teal-500/20 transition-all duration-500">
                      <img 
                        src={photo} 
                        alt={`Photo ${idx + 1}`} 
                        className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-110" 
                        loading="lazy" 
                      />
                      
                      {/* Premium Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center transform scale-50 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 border border-white/30">
                          <Maximize2 className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          PHOTO LIGHTBOX (Inside Album)
          ========================================================================= */}
      <AnimatePresence>
        {selectedAlbum && lightboxImage !== null && selectedAlbum.photos && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center"
          >
            {/* Top Bar */}
            <div className="absolute top-6 right-6 z-10 flex items-center gap-4">
              <span className="bg-white/10 px-3 py-1.5 rounded-full text-white text-xs font-bold border border-white/20">
                {lightboxImage + 1} / {selectedAlbum.photos.length}
              </span>
              <button onClick={() => setLightboxImage(null)} className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors border border-white/20">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav Left */}
            <button
              onClick={handlePrev}
              disabled={lightboxImage === 0}
              className="absolute left-6 top-1/2 -translate-y-1/2 p-4 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors border border-white/10 disabled:opacity-20 hidden md:block"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            
            {/* Nav Right */}
            <button
              onClick={handleNext}
              disabled={lightboxImage === selectedAlbum.photos.length - 1}
              className="absolute right-6 top-1/2 -translate-y-1/2 p-4 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors border border-white/10 disabled:opacity-20 hidden md:block"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            {/* Image */}
            <motion.div
              key={lightboxImage}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-6xl max-h-[85vh] p-4 flex items-center justify-center"
            >
              <img 
                src={selectedAlbum.photos[lightboxImage]} 
                alt="Event" 
                className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}
