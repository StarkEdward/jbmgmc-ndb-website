import { notFound } from "next/navigation"
import Link from "next/link"
import { db } from "@/lib/db"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FadeIn, SlideIn } from "@/components/motion"
import { ChevronRight, FileText, ArrowRight } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function GenericPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const resolvedParams = await params;
  const path = resolvedParams.slug.join("/")
  const rootFolder = resolvedParams.slug[0]
  
  // Search for the dynamic page in the DB
  const page = db.getDynamicPage(path)
  
  if (!page) {
    notFound()
  }

  // Find related pages to build a horizontal navigation bar
  const allDynamicPages = db.getDynamicPages()
  const relatedPages = allDynamicPages.filter(p => p.slug.startsWith(rootFolder + '/') && p.slug !== path)

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <Header />
      <main className="flex-1">
        
        {/* Breadcrumbs */}
        <div className="bg-white dark:bg-slate-900 border-b border-border py-3 px-4">
          <div className="mx-auto max-w-7xl flex items-center gap-2 text-sm text-muted-foreground overflow-x-auto whitespace-nowrap no-scrollbar">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="h-4 w-4 shrink-0" />
            <span className="capitalize">{rootFolder.replace(/-/g, ' ')}</span>
            <ChevronRight className="h-4 w-4 shrink-0" />
            <span className="text-foreground font-medium">{page.title}</span>
          </div>
        </div>



        {/* Hero Section */}
        {path !== 'library/head-of-the-institute' && (
          <section className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-border relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.1]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, var(--primary) 1px, transparent 0)", backgroundSize: "40px 40px" }} />
            <div className="mx-auto max-w-7xl px-4 py-8 md:py-10 relative z-10 text-center md:text-left">
              <FadeIn>
                <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4 md:mb-6">
                  <FileText className="mr-2 h-4 w-4" />
                  {rootFolder.replace(/-/g, ' ').toUpperCase()}
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight max-w-4xl">
                  {page.title}
                </h1>
              </FadeIn>
            </div>
          </section>
        )}

        {/* Main Content Area */}
        <section className="py-8 md:py-12">
          <div className="mx-auto max-w-6xl px-4">
            <SlideIn>
              <article className="prose prose-slate dark:prose-invert prose-headings:font-bold prose-h1:text-4xl prose-h2:text-2xl prose-a:text-primary hover:prose-a:text-primary/80 max-w-none bg-white dark:bg-slate-900 p-6 sm:p-10 md:p-12 rounded-[2rem] shadow-sm border border-border">
                <div dangerouslySetInnerHTML={{ __html: page.content }} />
              </article>
            </SlideIn>
          </div>
        </section>

        {/* Bottom Related Pages Navigation */}
        {relatedPages.length > 0 && (
          <section className="py-12 md:py-16 bg-slate-100 dark:bg-slate-900/50 border-t border-border">
            <div className="mx-auto max-w-6xl px-4">
              <FadeIn>
                <div className="mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">Explore More</h2>
                  <p className="text-muted-foreground mt-2">Continue reading other pages in the <span className="capitalize">{rootFolder.replace(/-/g, ' ')}</span> section.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {relatedPages.map((related) => (
                    <Link 
                      key={related.slug}
                      href={`/${related.slug}`}
                      className="group flex items-center justify-between p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
                    >
                      <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-200 group-hover:text-primary transition-colors">
                        {related.title}
                      </h3>
                      <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center group-hover:bg-primary/10 transition-colors shrink-0 ml-4">
                        <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    </Link>
                  ))}
                </div>
              </FadeIn>
            </div>
          </section>
        )}

      </main>
      <Footer />
    </div>
  )
}
