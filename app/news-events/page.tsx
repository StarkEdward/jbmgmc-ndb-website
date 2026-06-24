import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { db } from "@/lib/db"
import NewsEventsClient from "./news-events-client"
import { FileText } from "lucide-react"

export const metadata = {
  title: "News & Events - JBMGMC Nandurbar",
  description: "Official news, announcements, and events of JBMGMC Nandurbar."
}

export default function NewsEventsPage() {
  const items = db.getNewsEvents()
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-slate-50/50 dark:bg-slate-900/50">
        <section className="bg-primary text-primary-foreground pt-10 pb-6 md:pt-12 md:pb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="mx-auto max-w-7xl px-4 relative z-10 text-center">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sm font-medium mb-4 backdrop-blur-sm border border-white/20">
              <FileText className="w-4 h-4" />
              Latest Updates
            </span>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">News & Events</h1>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Stay updated with the latest official announcements, notices, and events from the college.
            </p>
          </div>
        </section>

        <NewsEventsClient items={items} />
      </main>
      <Footer />
    </div>
  )
}
