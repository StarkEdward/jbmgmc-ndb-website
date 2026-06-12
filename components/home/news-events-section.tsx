"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Megaphone, FileText, Download, ArrowRight, ExternalLink } from "lucide-react"
import { useLiveData } from "@/hooks/use-live-data"
import { useAnimation } from "@/hooks/use-animation"

export function NewsEventsSection() {
  const { news, events, tenders, downloads } = useLiveData()
  const { ref: sectionRef, isVisible } = useAnimation<HTMLElement>({ threshold: 0.1 })

  // We combine news and events for the first column
  const newsAndEvents = [...news.map(n => ({ ...n, type: 'news' })), ...events.map(e => ({ ...e, type: 'event' }))]
    .sort((a, b) => new Date(b.date.split(' ')[0] || b.date).getTime() - new Date(a.date.split(' ')[0] || a.date).getTime())

  // To make continuous scrolling, we duplicate the arrays
  const duplicatedNewsAndEvents = [...newsAndEvents, ...newsAndEvents]
  const duplicatedTenders = tenders && tenders.length > 0 ? [...tenders, ...tenders] : []
  const duplicatedDownloads = downloads && downloads.length > 0 ? [...downloads, ...downloads] : []

  return (
    <section ref={sectionRef} className="py-20 md:py-28 bg-slate-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-pattern-grid opacity-10" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
      
      <div className="mx-auto max-w-7xl px-4 relative z-10">
        
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Official <span className="text-accent">Notice Board</span></h2>
          <p className="text-slate-300 max-w-2xl mx-auto">Latest updates, tenders, and important documents from JBMGMC Nandurbar.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          
          {/* Column 1: News & Events */}
          <div className={`bg-card rounded-2xl border border-border shadow-xl overflow-hidden flex flex-col transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <div className="p-5 border-b border-border bg-muted/30 flex items-center justify-between">
              <h3 className="font-bold text-lg text-primary flex items-center gap-2">
                <Megaphone className="h-5 w-5" /> News & Events
              </h3>
              <Link href="/events" className="text-sm font-semibold text-accent hover:underline">View All</Link>
            </div>
            <div className="relative h-[400px] overflow-hidden group">
              <div className="absolute top-0 w-full h-8 bg-gradient-to-b from-card to-transparent z-10 pointer-events-none" />
              <div className="absolute bottom-0 w-full h-8 bg-gradient-to-t from-card to-transparent z-10 pointer-events-none" />
              
              <div className="flex flex-col animate-marquee-vertical w-full">
                {duplicatedNewsAndEvents.map((item, idx) => (
                  <Link href="/events" key={idx} className="block p-5 border-b border-border/50 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 p-2 bg-primary/10 rounded-lg text-primary">
                        <Megaphone className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-accent mb-1">{item.date}</div>
                        <h4 className="font-semibold text-foreground text-sm line-clamp-2">{item.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: Tenders / Quotations */}
          <div className={`bg-card rounded-2xl border border-border shadow-xl overflow-hidden flex flex-col transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <div className="p-5 border-b border-border bg-muted/30 flex items-center justify-between">
              <h3 className="font-bold text-lg text-primary flex items-center gap-2">
                <FileText className="h-5 w-5" /> Tenders / Quotations
              </h3>
              <Link href="#" className="text-sm font-semibold text-accent hover:underline">View All</Link>
            </div>
            <div className="relative h-[400px] overflow-hidden group">
              <div className="absolute top-0 w-full h-8 bg-gradient-to-b from-card to-transparent z-10 pointer-events-none" />
              <div className="absolute bottom-0 w-full h-8 bg-gradient-to-t from-card to-transparent z-10 pointer-events-none" />
              
              <div className="flex flex-col animate-marquee-vertical w-full">
                {duplicatedTenders.map((item, idx) => (
                  <Link href={item.url || "#"} key={idx} className="block p-5 border-b border-border/50 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 p-2 bg-primary/10 rounded-lg text-primary">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-accent mb-1">{item.date}</div>
                        <h4 className="font-semibold text-foreground text-sm line-clamp-3">{item.title}</h4>
                      </div>
                    </div>
                  </Link>
                ))}
                {duplicatedTenders.length === 0 && (
                  <div className="p-8 text-center text-muted-foreground text-sm">No active tenders found.</div>
                )}
              </div>
            </div>
          </div>

          {/* Column 3: Downloads */}
          <div className={`bg-card rounded-2xl border border-border shadow-xl overflow-hidden flex flex-col transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <div className="p-5 border-b border-border bg-muted/30 flex items-center justify-between">
              <h3 className="font-bold text-lg text-primary flex items-center gap-2">
                <Download className="h-5 w-5" /> Downloads
              </h3>
              <Link href="#" className="text-sm font-semibold text-accent hover:underline">View All</Link>
            </div>
            <div className="relative h-[400px] overflow-hidden group">
              <div className="absolute top-0 w-full h-8 bg-gradient-to-b from-card to-transparent z-10 pointer-events-none" />
              <div className="absolute bottom-0 w-full h-8 bg-gradient-to-t from-card to-transparent z-10 pointer-events-none" />
              
              <div className="flex flex-col animate-marquee-vertical w-full">
                {duplicatedDownloads.map((item, idx) => (
                  <a href={item.url} target="_blank" rel="noreferrer" key={idx} className="block p-5 border-b border-border/50 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 p-2 bg-primary/10 rounded-lg text-primary">
                        <Download className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-accent mb-1">{item.type || 'Document'}</div>
                        <h4 className="font-semibold text-foreground text-sm line-clamp-2 group-hover:text-primary transition-colors">{item.name}</h4>
                      </div>
                    </div>
                  </a>
                ))}
                {duplicatedDownloads.length === 0 && (
                  <div className="p-8 text-center text-muted-foreground text-sm">No downloads available.</div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
