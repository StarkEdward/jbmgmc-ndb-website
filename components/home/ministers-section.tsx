"use client"

import { authorities } from "@/lib/data"
import Image from "next/image"
import { useAnimation } from "@/hooks/use-animation"

export function MinistersSection() {
  const { ref: sectionRef, isVisible } = useAnimation<HTMLElement>({ threshold: 0.1 })
  const ministers = authorities.filter(a => a.category === "minister")

  if (ministers.length === 0) return null

  return (
    <section ref={sectionRef} className="pt-10 md:pt-16 pb-4 md:pb-6 bg-gradient-to-b from-background to-slate-50 dark:to-slate-900/20 relative overflow-hidden">
      <div className="mx-auto max-w-[90rem] px-4 relative z-10">
        
        {/* Upgraded Premium Title */}
        <div className={`text-center mb-0 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="inline-flex items-center justify-center gap-3 px-5 py-1.5 rounded-full bg-gradient-to-r from-orange-500/10 via-primary/10 to-orange-500/10 border border-orange-500/20 mb-5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-xs md:text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-primary uppercase tracking-[0.2em]">
              State Leadership
            </span>
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mb-4 tracking-tight">
            Hon'ble Ministers
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base font-medium">
            Guided by the visionary leadership of the Government of Maharashtra
          </p>
        </div>

        {/* 6-Column Grid for Desktop, Horizontal Scroll for Mobile */}
        {/* Adjusted pt-20 for clipping prevention but reduced bottom/top whitespace */}
        <div className="flex overflow-x-auto lg:grid lg:grid-cols-6 gap-x-6 gap-y-16 pb-8 pt-24 px-4 snap-x snap-mandatory scrollbar-hide items-stretch justify-start lg:justify-center">
          {ministers.map((minister, idx) => (
            <div 
              key={idx} 
              className={`relative flex flex-col justify-end w-[200px] lg:w-auto shrink-0 snap-center group transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"}`}
              style={{ transitionDelay: `${idx * 150}ms` }}
            >
              
              {/* Spinning Glow Border (Hidden until hover) */}
              <div className="absolute inset-0 -z-20 bg-gradient-to-r from-orange-500 via-primary to-orange-500 rounded-3xl opacity-0 blur-xl group-hover:opacity-40 transition-opacity duration-700" />
              
              {/* Card Body */}
              <div className="relative bg-card dark:bg-card/40 backdrop-blur-sm border border-primary/10 rounded-3xl px-4 pb-6 pt-16 h-full flex flex-col justify-between shadow-lg group-hover:shadow-2xl group-hover:-translate-y-4 group-hover:border-primary/40 transition-all duration-500 z-10">
                
                {/* 3D Overlapping Avatar */}
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-20">
                  {/* Outer decorative ring */}
                  <div className="absolute inset-[-4px] rounded-full bg-gradient-to-tr from-orange-500 to-primary opacity-0 group-hover:opacity-100 group-hover:animate-[spin_3s_linear_infinite] transition-opacity duration-500" />
                  
                  {/* Image Container */}
                  <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-background shadow-xl group-hover:scale-105 transition-transform duration-500 bg-background">
                    {minister.image ? (
                      <Image src={minister.image} alt={minister.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-orange-500/20 to-primary/20 flex items-center justify-center text-4xl font-bold text-primary">
                        {minister.name.split(" ").slice(-1)[0][0]}
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-center mt-2 flex flex-col grow">
                  <h3 className="text-[14px] md:text-[15px] font-bold text-foreground mb-2 group-hover:text-primary transition-colors leading-tight">
                    {minister.name}
                  </h3>
                  <div className="w-8 h-0.5 bg-gradient-to-r from-orange-500 to-primary mx-auto mb-3 rounded-full opacity-0 group-hover:opacity-100 group-hover:w-16 transition-all duration-500" />
                  <p className="text-[11px] md:text-[12px] text-muted-foreground font-medium leading-relaxed my-auto">
                    {minister.designation}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
