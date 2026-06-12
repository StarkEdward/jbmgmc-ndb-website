"use client"

import { useLiveData } from "@/hooks/use-live-data"
import Image from "next/image"
import { Quote, Award } from "lucide-react"
import { useAnimation } from "@/hooks/use-animation"

export function DeanSection() {
  const { deanInfo } = useLiveData()
  const { ref: sectionRef, isVisible } = useAnimation<HTMLElement>({ threshold: 0.2 })

  return (
    <section ref={sectionRef} className="py-8 md:py-12 bg-gradient-to-b from-slate-50 to-background dark:from-slate-900/20 dark:to-background relative overflow-hidden">
      
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-6xl px-4 relative z-10">
        
        <div className={`grid lg:grid-cols-[2fr_3fr] rounded-[2.5rem] overflow-hidden bg-card border border-primary/10 shadow-2xl transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'} group`}>
          
          {/* Left Side: Creative Framed Portrait */}
          <div className="relative p-8 md:p-12 lg:p-16 flex items-center justify-center bg-gradient-to-br from-primary/5 to-transparent">
            {/* Creative Frame Container */}
            <div className="relative w-full max-w-[320px] aspect-[4/5] group/frame">
              {/* Orange Offset Border */}
              <div className="absolute inset-0 rounded-3xl border-2 border-orange-500/50 translate-x-4 translate-y-4 group-hover/frame:translate-x-6 group-hover/frame:translate-y-6 transition-transform duration-700" />
              
              {/* Blue Offset Solid */}
              <div className="absolute inset-0 rounded-3xl bg-primary/10 -translate-x-3 -translate-y-3 group-hover/frame:-translate-x-5 group-hover/frame:-translate-y-5 transition-transform duration-700" />
              
              {/* Actual Image */}
              <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border-[6px] border-card z-10">
                <Image
                  src="/images/dean-portrait.jpg"
                  alt={deanInfo.name}
                  fill
                  className="object-cover object-top group-hover/frame:scale-110 transition-transform duration-[2000ms]"
                />
              </div>

              {/* Small floating badge on the image */}
              <div className="absolute -bottom-4 -right-4 bg-card shadow-xl rounded-full p-3 z-20 border border-primary/10 hidden md:block">
                <Award className="w-6 h-6 text-orange-500" />
              </div>
            </div>
          </div>

          {/* Right Side: Message Content */}
          <div className="relative p-8 md:p-12 lg:p-16 flex flex-col justify-center overflow-hidden">
            
            {/* Massive Floating Quote Mark */}
            <div className="absolute -top-10 right-4 md:right-10 text-[15rem] text-primary/5 dark:text-primary/10 font-serif leading-none select-none pointer-events-none group-hover:text-primary/10 transition-colors duration-1000">
              &ldquo;
            </div>

            <div className="relative z-10">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-widest mb-6 shadow-sm border border-orange-500/20">
                <Award className="w-4 h-4" />
                From the Dean's Desk
              </span>
              
              <h2 className="text-3xl md:text-4xl lg:text-4xl font-extrabold text-foreground mb-6 tracking-tight">
                Message from the Dean
              </h2>

              <blockquote className="text-base md:text-lg text-muted-foreground leading-relaxed italic mb-10 border-l-4 border-primary/30 pl-5 md:pl-6 group-hover:border-primary transition-colors duration-700">
                {deanInfo.message}
              </blockquote>

              <div className="pt-6 border-t border-border flex items-center justify-between">
                <div>
                  <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-[0.2em] font-bold mb-2">
                    Sincerely,
                  </p>
                  {/* Glowing Signature Area */}
                  <h3 className="text-2xl md:text-3xl font-serif italic text-foreground mb-1 bg-clip-text text-transparent bg-gradient-to-r from-primary to-orange-500">
                    {deanInfo.name}
                  </h3>
                  <div className="flex flex-col">
                    <p className="text-sm font-bold text-foreground">{deanInfo.designation}</p>
                    <p className="text-xs text-muted-foreground">{deanInfo.qualification}</p>
                  </div>
                </div>
                
                {/* Decorative Stamp/Seal */}
                <div className="hidden sm:flex w-16 h-16 rounded-full border border-primary/20 items-center justify-center bg-primary/5 rotate-12 group-hover:rotate-0 transition-transform duration-700 shadow-inner">
                  <span className="text-primary/40 font-bold text-[10px] tracking-widest text-center leading-none">
                    EST<br/>2019
                  </span>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  )
}
