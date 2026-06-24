"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Megaphone, FileText, Download, ArrowRight, ExternalLink } from "lucide-react"
import { useLiveData } from "@/hooks/use-live-data"
import { useAnimation } from "@/hooks/use-animation"
import { formatDate } from "@/lib/utils"

export function NewsEventsSection() {
  const { newsEvents, tenders, downloads } = useLiveData()
  const { ref: sectionRef, isVisible } = useAnimation<HTMLElement>({ threshold: 0.1 })

  // We use the new unified newsEvents array
  const newsAndEvents = [...(newsEvents || [])]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // To make continuous scrolling, we duplicate the arrays
  const duplicatedNewsAndEvents = [...newsAndEvents, ...newsAndEvents]
  const duplicatedTenders = tenders && tenders.length > 0 ? [...tenders, ...tenders] : []
  const duplicatedDownloads = downloads && downloads.length > 0 ? [...downloads, ...downloads] : []

  return (
    <section ref={sectionRef} className="py-10 md:py-16 bg-slate-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-pattern-grid opacity-10" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
      
      <div className="mx-auto max-w-7xl px-4 relative z-10">
        
        <div className={`text-center mb-10 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-3">Official <span className="text-accent">Notice Board</span></h2>
          <p className="text-slate-300 max-w-2xl mx-auto text-sm md:text-base">Latest updates, tenders, and important documents from JBMGMC Nandurbar.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          
          {/* Column 1: News & Events */}
          <div className={`bg-card rounded-2xl border border-border shadow-xl overflow-hidden flex flex-col transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
              <h3 className="font-bold text-base text-primary flex items-center gap-2">
                <Megaphone className="h-4 w-4" /> News & Events
              </h3>
              <Link href="/news-events" className="text-xs font-semibold text-accent hover:underline">View All</Link>
            </div>
            <div className="relative h-[300px] overflow-hidden group">
              <div className="absolute top-0 w-full h-8 bg-gradient-to-b from-card to-transparent z-10 pointer-events-none" />
              <div className="absolute bottom-0 w-full h-8 bg-gradient-to-t from-card to-transparent z-10 pointer-events-none" />
              
              <div className="flex flex-col animate-marquee-vertical w-full" style={{ animationDuration: `${Math.max(duplicatedNewsAndEvents.length * 1.25, 5)}s` }}>
                {duplicatedNewsAndEvents.map((item, idx) => (
                  <Link href={`/news-events/${item.id}`} key={idx} className="block p-4 border-b border-border/50 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 p-1.5 bg-primary/10 rounded-lg text-primary">
                        <Megaphone className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-[11px] font-semibold text-accent mb-0.5">{formatDate(item.date)}</div>
                        <h4 className="font-semibold text-foreground text-[13px] leading-tight line-clamp-2">{item.title}</h4>
                        <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: Tenders / Quotations */}
          <div className={`bg-card rounded-2xl border border-border shadow-xl overflow-hidden flex flex-col transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
              <h3 className="font-bold text-base text-primary flex items-center gap-2">
                <FileText className="h-4 w-4" /> Tenders / Quotations
              </h3>
              <Link href="/tender" className="text-xs font-semibold text-accent hover:underline">View All</Link>
            </div>
            <div className="relative h-[300px] overflow-hidden group">
              <div className="absolute top-0 w-full h-8 bg-gradient-to-b from-card to-transparent z-10 pointer-events-none" />
              <div className="absolute bottom-0 w-full h-8 bg-gradient-to-t from-card to-transparent z-10 pointer-events-none" />
              
              <div className="flex flex-col animate-marquee-vertical w-full" style={{ animationDuration: `${Math.max(duplicatedTenders.length * 0.75, 5)}s` }}>
                {duplicatedTenders.map((item, idx) => (
                  <Link href={item.url || "#"} key={idx} className="block p-4 border-b border-border/50 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 p-1.5 bg-primary/10 rounded-lg text-primary">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-[11px] font-semibold text-accent mb-0.5">{formatDate(item.date)}</div>
                        <h4 className="font-semibold text-foreground text-[13px] leading-tight line-clamp-3">{item.title}</h4>
                      </div>
                    </div>
                  </Link>
                ))}
                {duplicatedTenders.length === 0 && (
                  <div className="p-6 text-center text-muted-foreground text-xs">No active tenders found.</div>
                )}
              </div>
            </div>
          </div>

          {/* Column 3: Downloads */}
          <div className={`bg-card rounded-2xl border border-border shadow-xl overflow-hidden flex flex-col transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
              <h3 className="font-bold text-base text-primary flex items-center gap-2">
                <Download className="h-4 w-4" /> Downloads
              </h3>
              <Link href="/downloads" className="text-xs font-semibold text-accent hover:underline">View All</Link>
            </div>
            <div className="relative h-[300px] overflow-hidden group">
              <div className="absolute top-0 w-full h-8 bg-gradient-to-b from-card to-transparent z-10 pointer-events-none" />
              <div className="absolute bottom-0 w-full h-8 bg-gradient-to-t from-card to-transparent z-10 pointer-events-none" />
              
              <div className="flex flex-col animate-marquee-vertical w-full" style={{ animationDuration: `${Math.max(duplicatedDownloads.length * 0.75, 5)}s` }}>
                {duplicatedDownloads.map((item, idx) => (
                  <a href={item.url} target="_blank" rel="noreferrer" key={idx} className="block p-4 border-b border-border/50 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 p-1.5 bg-primary/10 rounded-lg text-primary">
                        <Download className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-[11px] font-semibold text-accent mb-0.5">{item.type || 'Document'}</div>
                        <h4 className="font-semibold text-foreground text-[13px] leading-tight line-clamp-2 group-hover:text-primary transition-colors">{item.name}</h4>
                      </div>
                    </div>
                  </a>
                ))}
                {duplicatedDownloads.length === 0 && (
                  <div className="p-6 text-center text-muted-foreground text-xs">No downloads available.</div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
