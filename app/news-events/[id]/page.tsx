import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { db } from "@/lib/db"
import { formatDate } from "@/lib/utils"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, CalendarDays, Download, Tag } from "lucide-react"

export function generateStaticParams() {
  const newsEvents = db.getNewsEvents()
  return newsEvents.map((item) => ({
    id: String(item.id),
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const item = db.getNewsEventById(Number(resolvedParams.id))
  
  if (!item) {
    return { title: 'Not Found - JBMGMC' }
  }

  return {
    title: `${item.title} - JBMGMC Nandurbar`,
    description: item.description
  }
}

export default async function NewsArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const item = db.getNewsEventById(Number(resolvedParams.id))

  if (!item) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-900">
      <Header />
      
      <main className="flex-1 py-8 md:py-12">
        <article className="mx-auto max-w-4xl px-4">
          
          {/* Back Button */}
          <Link 
            href="/news-events" 
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-primary transition-colors mb-6 md:mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> Back to News & Events
          </Link>

          {/* Article Header */}
          <header className="mb-6 md:mb-8">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                item.type === 'news' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
              }`}>
                <Tag className="w-3 h-3" />
                {item.type === 'news' ? 'News & Notice' : 'Event'}
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 dark:text-slate-400">
                <CalendarDays className="w-4 h-4" />
                {formatDate(item.date)}
              </span>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white leading-tight mb-4">
              {item.title}
            </h1>
            
            {item.description && (
              <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium border-l-4 border-primary pl-4 py-1.5 bg-primary/5 rounded-r-lg">
                {item.description}
              </p>
            )}
          </header>

          {/* Article Body */}
          <div className="bg-white dark:bg-slate-950 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            
            {item.imageUrl && (
              <div className="w-full bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 p-4 sm:p-8 flex justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="max-h-[450px] w-auto max-w-full rounded-xl shadow-md object-contain bg-white dark:bg-slate-950" 
                />
              </div>
            )}

            <div className="p-6 md:p-8 lg:p-10">
              <div className="prose prose-slate dark:prose-invert max-w-none">
              {item.fullArticle ? (
                // Preserve whitespace formatting from textarea
                <div className="whitespace-pre-wrap leading-relaxed text-slate-700 dark:text-slate-300">
                  {item.fullArticle}
                </div>
              ) : (
                <p className="text-slate-500 italic text-center text-lg">No additional details are available for this update.</p>
              )}
            </div>

            {/* Attachments Section */}
            {item.pdfUrl && (
              <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col items-center pb-8">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Official Documents</h3>
                <a 
                  href={item.pdfUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-primary dark:bg-white dark:hover:bg-primary text-white dark:text-slate-900 dark:hover:text-white rounded-xl font-bold transition-all shadow-sm hover:shadow-md group text-sm"
                >
                  <Download className="w-5 h-5 group-hover:animate-bounce" />
                  Download Attached PDF
                </a>
              </div>
            )}
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}
