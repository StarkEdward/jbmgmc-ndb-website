import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FadeIn } from "@/components/motion"
import { Image as ImageIcon } from "lucide-react"

export const metadata = {
  title: "Event Blogs - JBMGMC Nandurbar",
  description: "Photos, videos, and articles about events at JBMGMC Nandurbar."
}

export default function EventBlogsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-slate-50/50 dark:bg-slate-900/50">
        <section className="bg-primary text-primary-foreground py-12 md:py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-10"></div>
          <FadeIn delay={0.1} className="mx-auto max-w-7xl px-4 relative z-10 text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Event Blogs & Gallery</h1>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Explore our past events, ceremonies, and celebrations through articles, photos, and videos.
            </p>
          </FadeIn>
        </section>

        <section className="py-24">
          <div className="mx-auto max-w-3xl px-4">
            <FadeIn>
              <div className="bg-white dark:bg-slate-950 rounded-3xl p-16 text-center border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
                  <ImageIcon className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-3">Coming Soon</h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto text-lg leading-relaxed">
                  We are currently organizing our photos and videos. The Event Blogs section will be available soon!
                </p>
              </div>
            </FadeIn>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
