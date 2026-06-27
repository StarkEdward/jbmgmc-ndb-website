'use client'

import { useState, useEffect } from "react"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { X, ChevronLeft, ChevronRight, Building2, GraduationCap, Stethoscope, Image as ImageIcon, Camera, Trophy, Map, LayoutGrid } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const categories = [
  { id: "all", label: "All Photos", icon: LayoutGrid },
  { id: "campus", label: "Campus & Buildings", icon: Building2 },
  { id: "academics", label: "Academics & Labs", icon: GraduationCap },
  { id: "hospital", label: "Clinical & Hospital", icon: Stethoscope },
  { id: "sports", label: "Sports", icon: Trophy },
  { id: "cultural", label: "Cultural", icon: Camera },
  { id: "convocation", label: "Convocation", icon: Map },
  { id: "events", label: "Events (Legacy)", icon: ImageIcon },
]

export function GalleryClient({ galleryImages }: { galleryImages: any[] }) {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [lightboxImage, setLightboxImage] = useState<number | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [visibleCount, setVisibleCount] = useState(13) // 1 featured + 12 regular

  useEffect(() => {
    setVisibleCount(13)
  }, [selectedCategory])

  useEffect(() => {
    setIsClient(true)
  }, [])

  const filteredItems = selectedCategory === "all"
    ? galleryImages
    : galleryImages.filter(item => item.category === selectedCategory)

  const currentIndex = lightboxImage !== null
    ? filteredItems.findIndex(item => item.id === lightboxImage)
    : -1

  const handlePrev = () => {
    if (currentIndex > 0) setLightboxImage(filteredItems[currentIndex - 1].id)
  }

  const handleNext = () => {
    if (currentIndex < filteredItems.length - 1) setLightboxImage(filteredItems[currentIndex + 1].id)
  }

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxImage === null) return
      if (e.key === 'ArrowLeft') handlePrev()
      if (e.key === 'ArrowRight') handleNext()
      if (e.key === 'Escape') setLightboxImage(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxImage, currentIndex])

  const currentImage = filteredItems.find(item => item.id === lightboxImage)

  // Floating background images for hero
  const floatingImages = galleryImages.slice(0, 5)

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950 font-sans">
      <Header />
      <main className="flex-1">
        {/* PREMIUM HERO SECTION */}
        <section className="relative h-[60vh] min-h-[400px] overflow-hidden bg-slate-900 flex items-center justify-center">
          {/* Animated Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-teal-900 via-slate-900 to-emerald-900 opacity-80" />
          
          {/* Floating Image Elements (Subtle Parallax) */}
          {isClient && floatingImages.map((img, i) => (
            <motion.div
              key={`float-${i}`}
              initial={{ y: 0 }}
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, i % 2 === 0 ? 5 : -5, 0] 
              }}
              transition={{ 
                duration: 6 + i * 2, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="absolute hidden md:block rounded-2xl overflow-hidden shadow-2xl opacity-20 blur-[1px]"
              style={{
                width: 150 + i * 40,
                height: 200 + i * 30,
                top: `${10 + i * 15}%`,
                left: `${10 + (i * 20)}%`,
                zIndex: 0
              }}
            >
              <img src={img.image} className="w-full h-full object-cover" alt="" />
            </motion.div>
          ))}

          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block py-1 px-3 rounded-full bg-teal-500/20 text-teal-300 text-sm font-bold tracking-widest uppercase mb-6 backdrop-blur-md border border-teal-500/30">
                Visual Journey
              </span>
              <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
                Campus <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-300">Gallery</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
                Discover the vibrant life, state-of-the-art infrastructure, and memorable moments at JBMGMC.
              </p>
            </motion.div>
          </div>
          
          {/* Bottom Gradient Fade */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 dark:from-slate-950 to-transparent" />
        </section>

        {/* CATEGORY FILTER TABS */}
        <section className="sticky top-[72px] z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 py-4 shadow-sm">
          <div className="mx-auto max-w-7xl px-4 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-3 w-max mx-auto px-2">
              {categories.map((category) => {
                const count = category.id === 'all' 
                  ? galleryImages.length 
                  : galleryImages.filter(img => img.category === category.id).length

                if (count === 0 && category.id !== 'all') return null

                const isActive = selectedCategory === category.id
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                      isActive 
                        ? 'text-white shadow-md shadow-teal-500/20' 
                        : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                    }`}
                  >
                    {isActive && (
                      <motion.div 
                        layoutId="activeCategory" 
                        className="absolute inset-0 bg-teal-500 rounded-full -z-10"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <category.icon className="w-4 h-4" />
                    <span>{category.label}</span>
                    <span className={`ml-1 text-[10px] px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                    }`}>
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        {/* MASONRY + BENTO GRID */}
        <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 min-h-[500px]">
          {filteredItems.length > 0 ? (
            <>
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-[250px]"
            >
              <AnimatePresence mode="popLayout">
                {filteredItems.slice(0, visibleCount).map((item, index) => {
                  // Make the first item a large bento box (span 2 cols, 2 rows)
                  const isFeatured = index === 0
                  
                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4, type: "spring" }}
                      key={item.id}
                      onClick={() => setLightboxImage(item.id)}
                      className={`group relative overflow-hidden rounded-3xl bg-slate-200 dark:bg-slate-800 cursor-pointer shadow-sm hover:shadow-2xl transition-shadow ${
                        isFeatured ? 'sm:col-span-2 sm:row-span-2' : ''
                      }`}
                    >
                      <Image 
                        src={item.image}
                        alt={item.alt}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                        sizes={isFeatured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 25vw"}
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Hover Content */}
                      <div className="absolute inset-x-0 bottom-0 p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <span className="inline-block px-2 py-1 bg-teal-500/20 backdrop-blur-md border border-teal-500/30 text-teal-300 text-[10px] font-bold uppercase tracking-wider rounded-lg mb-2">
                          {item.category}
                        </span>
                        <h3 className={`font-bold text-white ${isFeatured ? 'text-2xl' : 'text-lg line-clamp-2'}`}>
                          {item.title}
                        </h3>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </motion.div>
            
            {visibleCount < filteredItems.length && (
              <div className="mt-16 flex justify-center">
                <button
                  onClick={() => setVisibleCount(prev => prev + 12)}
                  className="group relative px-8 py-3.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative flex items-center gap-2">
                    Load More Photos
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </div>
            )}
            </>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-32 text-center"
            >
              <div className="w-24 h-24 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mb-6">
                <ImageIcon className="w-10 h-10 text-slate-300 dark:text-slate-700" />
              </div>
              <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-2">No Photos Found</h3>
              <p className="text-slate-500 max-w-md">Check back later for updates in this category.</p>
            </motion.div>
          )}
        </section>
      </main>

      {/* FULLSCREEN LIGHTBOX */}
      <AnimatePresence>
        {lightboxImage !== null && currentImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 backdrop-blur-xl"
          >
            {/* Top Bar */}
            <div className="absolute top-0 inset-x-0 p-6 flex justify-between items-start z-10">
              <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
                <h3 className="text-white font-bold text-lg">{currentImage.title}</h3>
                <p className="text-slate-400 text-xs uppercase tracking-widest">{currentImage.category}</p>
              </div>
              <button
                onClick={() => setLightboxImage(null)}
                className="p-3 bg-black/50 hover:bg-white/10 backdrop-blur-md rounded-full text-white transition-colors border border-white/10"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="absolute left-6 top-1/2 -translate-y-1/2 p-4 bg-black/50 hover:bg-white/10 backdrop-blur-md rounded-full text-white transition-colors border border-white/10 disabled:opacity-20 disabled:cursor-not-allowed z-10 hidden md:block"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex === filteredItems.length - 1}
              className="absolute right-6 top-1/2 -translate-y-1/2 p-4 bg-black/50 hover:bg-white/10 backdrop-blur-md rounded-full text-white transition-colors border border-white/10 disabled:opacity-20 disabled:cursor-not-allowed z-10 hidden md:block"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            {/* Main Image */}
            <motion.div 
              key={currentImage.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-5xl max-h-[80vh] aspect-video px-4"
            >
              <img 
                src={currentImage.image}
                alt={currentImage.alt}
                className="w-full h-full object-contain drop-shadow-2xl rounded-2xl"
              />
            </motion.div>

            {/* Counter */}
            <div className="absolute bottom-6 inset-x-0 text-center z-10">
              <span className="bg-black/50 backdrop-blur-md text-white text-sm font-bold px-4 py-2 rounded-full border border-white/10">
                {currentIndex + 1} / {filteredItems.length}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}
