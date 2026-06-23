import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FadeIn, SlideIn, StaggerContainer, StaggerItem } from "@/components/motion"
import { Download, FileDown, ArrowRight } from "lucide-react"
import { db } from "@/lib/db"
import Link from "next/link"

export const metadata = {
  title: "Downloads - JBMGMC Nandurbar",
  description: "Official documents, brochures, and forms for JBMGMC Nandurbar."
}

export default function DownloadsPage() {
  const downloads = db.getDownloads()
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-slate-50/50 dark:bg-slate-900/50">
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-12 md:py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <FadeIn delay={0.1} className="mx-auto max-w-7xl px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sm font-medium mb-4 backdrop-blur-sm border border-white/20">
                <FileDown className="w-4 h-4" />
                Resources & Documents
              </span>
              <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Downloads</h1>
              <p className="text-lg opacity-90">
                Admission brochures, fee structures, academic calendars, and other important documents.
              </p>
            </div>
          </FadeIn>
        </section>

        {/* Content Section */}
        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-4xl px-4">
            
            {downloads.length > 0 ? (
              <StaggerContainer className="space-y-4">
                {downloads.map((item) => (
                  <StaggerItem key={item.id}>
                    <div className="group relative bg-white dark:bg-slate-950 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2 font-medium">
                            <FileDown className="w-4 h-4 text-primary" />
                            {item.type || 'Document'}
                          </div>
                          <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                            {item.name}
                          </h3>
                        </div>

                        <div className="flex-shrink-0 flex items-center justify-start md:justify-end">
                          <Link 
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground rounded-full text-sm font-bold transition-all group/btn"
                          >
                            <Download className="w-4 h-4" />
                            <span>Download {item.type || 'File'}</span>
                            <ArrowRight className="w-4 h-4 opacity-0 -ml-4 group-hover/btn:opacity-100 group-hover/btn:ml-0 transition-all" />
                          </Link>
                        </div>
                        
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            ) : (
              <FadeIn>
                <div className="bg-white dark:bg-slate-950 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm">
                  <FileDown className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-2">No Downloads Available</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    There are currently no documents available for download. Please check back later.
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
