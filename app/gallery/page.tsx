"use client"

import { useState } from "react"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { useLiveData } from "@/hooks/use-live-data"
import { X, ChevronLeft, ChevronRight, Building2, Calendar, GraduationCap, Stethoscope, Image as ImageIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { FadeIn, StaggerContainer, StaggerItem, SlideIn } from "@/components/motion"

const categories = [
  { id: "all", label: "All", icon: ImageIcon },
  { id: "campus", label: "Campus", icon: Building2 },
  { id: "academics", label: "Academics", icon: GraduationCap },
  { id: "hospital", label: "Hospital", icon: Stethoscope },
  { id: "events", label: "Events", icon: Calendar },
]

export default function GalleryPage() {
  const { galleryImages } = useLiveData()
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [lightboxImage, setLightboxImage] = useState<number | null>(null)

  const filteredItems = selectedCategory === "all"
    ? galleryImages
    : galleryImages.filter(item => item.category === selectedCategory)

  const currentIndex = lightboxImage !== null
    ? filteredItems.findIndex(item => item.id === lightboxImage)
    : -1

  const handlePrev = () => {
    if (currentIndex > 0) {
      setLightboxImage(filteredItems[currentIndex - 1].id)
    }
  }

  const handleNext = () => {
    if (currentIndex < filteredItems.length - 1) {
      setLightboxImage(filteredItems[currentIndex + 1].id)
    }
  }

  const currentImage = filteredItems.find(item => item.id === lightboxImage)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-primary text-primary-foreground py-8 md:py-12 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <Image
              src="/images/college-building.jpg"
              alt="Gallery background"
              fill
              className="object-cover"
            />
          </div>
          <FadeIn delay={0.2} className="relative mx-auto max-w-7xl px-4">
            <div className="text-center">
              <p className="text-sm uppercase tracking-wider opacity-80 mb-2">Explore</p>
              <h1 className="text-3xl md:text-5xl font-bold mb-4">Photo Gallery</h1>
              <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
                Explore our campus, facilities, events, and moments captured at JBMGMC Nandurbar.
              </p>
            </div>
          </FadeIn>
        </section>

        {/* Category Filter */}
        <section className="py-8 bg-secondary sticky top-0 z-30">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex flex-wrap items-center justify-center gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className="gap-2"
                >
                  <category.icon className="h-4 w-4" />
                  {category.label}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-12 bg-background min-h-[500px]">
          <div className="mx-auto max-w-7xl px-4">
            <motion.div layout className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              <AnimatePresence>
                {filteredItems.map((item) => (
                  <motion.button
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    key={item.id}
                    onClick={() => setLightboxImage(item.id)}
                    className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-muted cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    {/* Actual Image */}
                    <Image
                      src={item.image}
                      alt={item.alt}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <div className="text-primary-foreground text-left">
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="text-sm opacity-80 capitalize">{item.category}</p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </AnimatePresence>
            </motion.div>

            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <ImageIcon className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">No images found in this category.</p>
              </div>
            )}
          </div>
        </section>

        {/* Video Gallery Section */}
        <section className="py-16 bg-secondary">
          <div className="mx-auto max-w-7xl px-4">
            <FadeIn className="text-center mb-10">
              <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-2">
                Watch
              </p>
              <h2 className="text-3xl font-bold text-foreground">Video Gallery</h2>
            </FadeIn>
            <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { title: "Campus Tour", description: "Virtual tour of JBMGMC campus" },
                { title: "Hospital Facilities", description: "Overview of our hospital services" },
                { title: "Student Life", description: "A day in the life of MBBS students" },
              ].map((video, index) => (
                <StaggerItem key={index} className="rounded-lg overflow-hidden bg-card shadow-sm transition-transform hover:-translate-y-1">
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <div className="text-center">
                      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2 transition-transform hover:scale-110 cursor-pointer">
                        <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-primary border-b-8 border-b-transparent ml-1" />
                      </div>
                      <span className="text-sm text-muted-foreground">Video Coming Soon</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground">{video.title}</h3>
                    <p className="text-sm text-muted-foreground">{video.description}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      </main>

      {/* Lightbox */}
      {lightboxImage !== null && currentImage && (
        <div className="fixed inset-0 z-50 bg-foreground/95 flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 text-background hover:text-accent transition-colors"
            aria-label="Close lightbox"
          >
            <X className="h-8 w-8" />
          </button>
          
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="absolute left-4 text-background hover:text-accent transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-10 w-10" />
          </button>
          
          <button
            onClick={handleNext}
            disabled={currentIndex === filteredItems.length - 1}
            className="absolute right-4 text-background hover:text-accent transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Next image"
          >
            <ChevronRight className="h-10 w-10" />
          </button>

          <div className="max-w-4xl w-full">
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-4">
              <Image
                src={currentImage.image}
                alt={currentImage.alt}
                fill
                className="object-contain"
              />
            </div>
            <div className="text-center text-background">
              <h3 className="text-xl font-semibold">{currentImage.title}</h3>
              <p className="text-sm opacity-80 capitalize">{currentImage.category}</p>
              <p className="text-sm opacity-60 mt-2">
                {currentIndex + 1} / {filteredItems.length}
              </p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
