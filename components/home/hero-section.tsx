"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useLiveData } from "@/hooks/use-live-data"
import { ChevronRight, ChevronLeft, GraduationCap, Stethoscope, Users, Sparkles } from "lucide-react"


const heroImages = [
  {
    url: "/images/college-building.jpg",
    alt: "JBMGMC Nandurbar Main Building"
  },
  {
    url: "/images/campus-view.jpg",
    alt: "College Campus View"
  },
  {
    url: "/images/hospital-building.jpg",
    alt: "Hospital Building"
  },
]

export function HeroSection() {
  const { heroSlides } = useLiveData()

  const activeSlides = useMemo(() => {
    return heroSlides.length > 0 
      ? heroSlides.map(s => ({ url: s.image, alt: s.alt, title: s.title, subtitle: s.subtitle }))
      : heroImages.map(s => ({ ...s, title: "Jannayak Birsa Munda", subtitle: "Government Medical College" }))
  }, [heroSlides])


  const [currentSlide, setCurrentSlide] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])



  useEffect(() => {
    if (activeSlides.length === 0) return
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length)
    }, 6000)
    return () => clearInterval(slideTimer)
  }, [activeSlides])

  const nextSlide = () => {
    if (activeSlides.length === 0) return
    setCurrentSlide((prev) => (prev + 1) % activeSlides.length)
  }
  const prevSlide = () => {
    if (activeSlides.length === 0) return
    setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length)
  }

  const currentSlideData = activeSlides[currentSlide]

  return (
    <section className="relative overflow-hidden">

      {/* Hero with Image Slider */}
      <div className="relative h-[550px] md:h-[650px] lg:h-[750px]">
        {/* Image Slider */}
        {activeSlides.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ${
              index === currentSlide ? "opacity-100 scale-100 animate-fade-in" : "opacity-0 scale-105"
            }`}
          >
            <Image
              src={image.url}
              alt={image.alt}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/50 via-transparent to-transparent" />
          </div>
        ))}

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-40 left-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float animation-delay-500" />
        </div>

        {/* Slider Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-background/10 backdrop-blur-sm hover:bg-background/30 text-white transition-all duration-300 hover:scale-110 border border-white/20"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-background/10 backdrop-blur-sm hover:bg-background/30 text-white transition-all duration-300 hover:scale-110 border border-white/20"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {activeSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-500 ${
                index === currentSlide ? "w-10 bg-accent" : "w-2 bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 h-full flex items-center">
          <div className="mx-auto max-w-7xl px-4 w-full">
            <div className="text-primary-foreground max-w-2xl">
              {/* Government Badge */}
              <div className={`mb-6 transition-all duration-700 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  Government of Maharashtra
                </span>
              </div>

              {/* College Name */}
              <div className={`mb-6 transition-all duration-700 delay-100 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-balance">
                  <span className="block text-slate-100">{currentSlideData?.title || "Jannayak Birsa Munda"}</span>
                  <span className="block mt-2 text-accent">{currentSlideData?.subtitle || "Government Medical College"}</span>
                </h1>
                <p className="mt-4 text-xl md:text-2xl font-light opacity-90">Nandurbar, Maharashtra</p>
                <p className="mt-2 text-base md:text-lg opacity-75 font-serif">
                  जननायक बिरसा मुंडा शासकीय वैद्यकीय महाविद्यालय, नंदुरबार
                </p>
              </div>

              {/* Tagline */}
              <p className={`text-base md:text-lg opacity-90 leading-relaxed mb-8 text-pretty transition-all duration-700 delay-200 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                One of the premiere Medical Colleges in Maharashtra and the biggest tertiary care hospital for the whole Nashik Region.
              </p>

              {/* CTA Buttons */}
              <div className={`flex flex-wrap items-center gap-4 transition-all duration-700 delay-300 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                <Link href="/courses">
                  <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/30 transition-all duration-300 hover:-translate-y-0.5 group cursor-pointer">
                    <GraduationCap className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                    Admissions
                  </Button>
                </Link>
                <Link href="/departments">
                  <Button size="lg" variant="outline" className="border-white/30 text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 group cursor-pointer">
                    <Stethoscope className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                    Departments
                  </Button>
                </Link>
                <Link href="/doctors">
                  <Button size="lg" variant="outline" className="border-white/30 text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 group cursor-pointer">
                    <Users className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                    Our Doctors
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" className="fill-background"/>
          </svg>
        </div>
      </div>
    </section>
  )
}
