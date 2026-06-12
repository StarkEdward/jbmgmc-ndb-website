"use client"

import { meetAuthorities } from "@/lib/data"
import Image from "next/image"
import { useAnimation } from "@/hooks/use-animation"
import { Users } from "lucide-react"

export function MeetAuthoritiesSection() {
  const { ref: sectionRef, isVisible } = useAnimation<HTMLElement>({ threshold: 0.1 })

  if (!meetAuthorities || meetAuthorities.length === 0) return null

  return (
    <section ref={sectionRef} className="py-16 md:py-24 relative overflow-hidden bg-white dark:bg-slate-950">
      
      {/* Abstract Background Patterns */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-10 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23f97316\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-gradient-to-b from-orange-500/10 to-transparent blur-[80px] pointer-events-none" />

      <div className="mx-auto max-w-[85rem] px-4 relative z-10">
        
        {/* Section Title */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/50 mb-4">
            <Users className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest">
              Leadership
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-foreground mb-4 tracking-tight drop-shadow-sm">
            Meet The Authorities
          </h2>
          <div className="w-20 h-1.5 bg-gradient-to-r from-orange-400 to-orange-600 mx-auto rounded-full shadow-md" />
        </div>

        {/* Dynamic Centered Grid */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-12 md:gap-y-16">
          {meetAuthorities.map((person, idx) => (
            <div 
              key={idx} 
              className={`w-full sm:w-[calc(50%-1.5rem)] lg:w-[calc(25%-1.5rem)] max-w-[300px] flex flex-col transition-all duration-700 hover:z-20 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"}`}
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
              <div className="group relative bg-card rounded-2xl p-6 pt-16 flex flex-col items-center text-center shadow-lg hover:shadow-2xl border border-border hover:border-orange-500/30 transition-all duration-500 h-full hover:-translate-y-2">
                
                {/* Floating Avatar */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                  <div className="relative w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-orange-400 to-yellow-500 shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                    <div className="relative w-full h-full rounded-full overflow-hidden border-[3px] border-card bg-card">
                      {person.image ? (
                        <Image src={person.image} alt={person.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                      ) : (
                        <div className="w-full h-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                          {person.name.charAt(0)}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Subtle shadow underneath the floating avatar */}
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-2 bg-black/10 dark:bg-black/40 blur-md rounded-full group-hover:w-12 transition-all duration-500" />
                </div>

                <div className="mt-2 flex flex-col grow justify-start items-center">
                  <h3 className="text-[15px] font-bold text-foreground mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                    {person.name}
                  </h3>
                  <p className="text-[11px] md:text-xs text-muted-foreground font-semibold uppercase tracking-wider leading-relaxed px-2">
                    {person.designation}
                  </p>
                </div>

                {/* Decorative Hover Line */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-orange-400 to-yellow-500 group-hover:w-1/2 transition-all duration-500 rounded-t-full" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
