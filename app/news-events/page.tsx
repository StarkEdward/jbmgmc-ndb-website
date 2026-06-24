import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FadeIn, SlideIn, StaggerContainer, StaggerItem } from "@/components/motion"
import { CalendarDays, FileText, ArrowRight, FileDown } from "lucide-react"
import { db } from "@/lib/db"
import Link from "next/link"

export const metadata = {
  title: "News & Events - JBMGMC Nandurbar",
  description: "Official news, announcements, and events of JBMGMC Nandurbar."
}

export default function NewsEventsPage() {
  const items = db.getNewsEvents()
  // Sort by date descending assuming the date is valid or by id if needed.
  // Actually, keeping them in the order they were in DB (which is latest first from our unshift).

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-slate-50/50 dark:bg-slate-900/50">
        <section className="bg-primary text-primary-foreground py-12 md:py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <FadeIn delay={0.1} className="mx-auto max-w-7xl px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sm font-medium mb-4 backdrop-blur-sm border border-white/20">
                <FileText className="w-4 h-4" />
                Latest Updates
              </span>
              <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">News & Events</h1>
              <p className="text-lg opacity-90">
                Stay updated with the latest official announcements, notices, and events from the college.
              </p>
            </div>
          </FadeIn>
        </section>

        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-5xl px-4">
            {items.length > 0 ? (
              <StaggerContainer className="space-y-6">
                {items.map((item) => (
                  <StaggerItem key={item.id}>
                    <div className="group relative bg-white dark:bg-slate-950 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col md:flex-row gap-6 md:items-start">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      
                      <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-xl bg-primary/10 text-primary">
                        <CalendarDays className="w-8 h-8" />
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary uppercase tracking-wide">
                            {item.type}
                          </span>
                          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                            {item.date}
                          </span>
                          {item.isNew && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-700 animate-pulse">
                              NEW
                            </span>
                          )}
                        </div>

                        <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors leading-snug">
                          {item.title}
                        </h3>
                        
                        <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                          {item.description}
                        </p>

                        <div className="flex flex-wrap gap-4 items-center">
                          {item.fullArticle && (
                            <Link 
                              href={`/news-events/${item.id}`}
                              className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-accent transition-colors"
                            >
                              Read Full Article <ArrowRight className="w-4 h-4" />
                            </Link>
                          )}

                          {item.pdfUrl && (
                            <Link 
                              href={item.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-semibold transition-colors"
                            >
                              <FileDown className="w-4 h-4" />
                              Download PDF
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            ) : (
              <FadeIn>
                <div className="bg-white dark:bg-slate-950 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm">
                  <FileText className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-2">No Updates Found</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    There are currently no news or announcements. Please check back later.
                  </p>
                </div>
              </FadeIn>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
