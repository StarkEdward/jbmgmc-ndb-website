import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FadeIn } from "@/components/motion"
import { CalendarDays, ArrowLeft, FileDown } from "lucide-react"
import { db } from "@/lib/db"
import Link from "next/link"
import { notFound } from "next/navigation"

export const metadata = {
  title: "News & Events Article - JBMGMC Nandurbar",
}

export default async function NewsEventArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const items = db.getNewsEvents()
  const resolvedParams = await params
  const article = items.find((item) => item.id.toString() === resolvedParams.id)

  if (!article) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-slate-50/50 dark:bg-slate-900/50">
        <section className="bg-primary text-primary-foreground py-12 md:py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-10"></div>
          <FadeIn delay={0.1} className="mx-auto max-w-4xl px-4 relative z-10">
            <Link href="/news-events" className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-white mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to News & Events
            </Link>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/20 uppercase tracking-wide">
                {article.type}
              </span>
              <span className="flex items-center gap-2 text-sm font-medium opacity-90">
                <CalendarDays className="w-4 h-4" /> {article.date}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight leading-tight">{article.title}</h1>
          </FadeIn>
        </section>

        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-4xl px-4">
            <FadeIn>
              <div className="bg-white dark:bg-slate-950 rounded-3xl p-8 md:p-12 border border-slate-200 dark:border-slate-800 shadow-sm">
                {article.pdfUrl && (
                  <div className="mb-8 p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-200">Attached Document</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Please download the PDF for full details.</p>
                    </div>
                    <Link 
                      href={article.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg"
                    >
                      <FileDown className="w-5 h-5" />
                      Download PDF
                    </Link>
                  </div>
                )}

                <div className="prose prose-slate dark:prose-invert max-w-none prose-p:leading-relaxed prose-headings:font-bold prose-a:text-primary hover:prose-a:text-accent">
                  {/* If fullArticle exists, render it. Otherwise, render description. */}
                  {article.fullArticle ? (
                    <div dangerouslySetInnerHTML={{ __html: article.fullArticle.replace(/\n/g, '<br/>') }} />
                  ) : (
                    <p className="text-lg text-slate-700 dark:text-slate-300">{article.description}</p>
                  )}
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
