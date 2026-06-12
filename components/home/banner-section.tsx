"use client"

import Image from "next/image"
import { FadeIn } from "@/components/motion"

export function BannerSection() {
  return (
    <section className="w-full relative bg-slate-50 dark:bg-slate-950">
      {/* Cinematic dark top fade instead of white */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/40 to-transparent z-20 pointer-events-none" />
      
      <FadeIn>
        <div className="group relative w-full h-[300px] sm:h-[400px] md:h-[450px] lg:h-[500px] overflow-hidden">
          {/* Subtle vignette */}
          <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.5)] z-10 pointer-events-none mix-blend-overlay" />
          
          <Image
            src="/images/slider-design-s.jpg"
            alt="JBMGMC Nandurbar Special Banner"
            fill
            className="object-cover object-center transform scale-100 group-hover:scale-105 transition-transform duration-[5000ms] ease-out"
            priority
          />
        </div>
      </FadeIn>

      {/* Cinematic dark bottom fade instead of white */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/40 to-transparent z-20 pointer-events-none" />
    </section>
  )
}
