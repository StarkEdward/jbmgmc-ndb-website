"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useLiveData } from "@/hooks/use-live-data"
import { Button } from "@/components/ui/button"
import { BookOpen, BookCheck, ClipboardList, Clock, ExternalLink, Library, Newspaper, Users } from "lucide-react"
import { FadeIn, SlideIn, StaggerContainer, StaggerItem } from "@/components/motion"

export default function LibraryPage() {
  const { libraryInfo } = useLiveData()

  // Standard fallback counts if loading or empty
  const booksCount = libraryInfo?.booksCount || 12850
  const journalsCount = libraryInfo?.journalsCount || 114
  const newspapersCount = libraryInfo?.newspapersCount || 8
  const knimbusUrl = libraryInfo?.knimbusUrl || "https://gmcnandurbar.knimbus.com"
  const timings = libraryInfo?.timings || [
    { day: "Monday - Friday", hours: "9:00 AM - 8:00 PM" },
    { day: "Saturday", hours: "9:00 AM - 5:00 PM" },
    { day: "Sunday / Holidays", hours: "Closed" }
  ]
  const rules = libraryInfo?.rules || [
    "Every student must carry a valid library identity card at all times.",
    "Strict silence and discipline must be maintained inside the reading room.",
    "Books will be issued for a maximum duration of 14 days.",
    "A fine of ₹5 per day will be levied on overdue books.",
    "Reference books and journals are not to be taken outside the library.",
    "Mobile phones are strictly prohibited (must be kept on silent mode)."
  ]

  const stats = [
    {
      icon: BookOpen,
      title: "Total Volumes & Books",
      count: booksCount.toLocaleString(),
      description: "Covering Pre-clinical, Para-clinical & Clinical disciplines.",
      gradient: "from-cyan-500/20 via-blue-500/10 to-transparent border-cyan-500/30",
      iconColor: "text-cyan-500"
    },
    {
      icon: BookCheck,
      title: "Scientific Journals",
      count: journalsCount.toLocaleString() + "+",
      description: "Subscribed national & international medical research periodicals.",
      gradient: "from-emerald-500/20 via-teal-500/10 to-transparent border-emerald-500/30",
      iconColor: "text-emerald-500"
    },
    {
      icon: Newspaper,
      title: "Daily Newspapers",
      count: newspapersCount.toString(),
      description: "National dailies, health journals, and medical newsletters.",
      gradient: "from-purple-500/20 via-indigo-500/10 to-transparent border-purple-500/30",
      iconColor: "text-purple-500"
    }
  ]

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-300">
      <Header />
      <main className="flex-1">
        {/* Dynamic Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-primary/95 to-slate-900 text-white py-20 md:py-28">
          {/* Visual enhancements */}
          <div className="absolute top-1/4 left-1/3 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl" />

          <FadeIn delay={0.1} className="mx-auto max-w-7xl px-4 relative z-10 text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 uppercase tracking-widest mb-4">
              <Library className="w-3.5 h-3.5" /> Central Library
            </span>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
              Academic <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">Knowledge Hub</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-200 max-w-3xl mx-auto font-light leading-relaxed">
              Equipped with a rich compilation of medical textbooks, scientific research archives, and premium online resource engines. Empowering the future doctors of India.
            </p>
          </FadeIn>
        </section>

        {/* Digital Knimbus Banner Gateway */}
        <section className="py-10 bg-muted/40 border-b border-border overflow-hidden">
          <div className="mx-auto max-w-7xl px-4">
            <SlideIn direction="up" className="relative rounded-2xl overflow-hidden border border-cyan-500/30 bg-card p-6 md:p-8 shadow-lg backdrop-blur-md">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-transparent" />
              
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center md:text-left">
                  <div className="inline-flex items-center gap-1.5 text-cyan-500 font-bold text-xs uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" /> Remote Access Enabled
                  </div>
                  <h2 className="text-xl md:text-2xl font-extrabold text-foreground tracking-tight">
                    Knimbus Digital Library Portal
                  </h2>
                  <p className="text-muted-foreground text-sm max-w-2xl leading-relaxed">
                    Access over 10,000+ medical journals, guidelines, and international textbooks from anywhere outside the campus. Log in using your JBMGMC Knimbus student credentials.
                  </p>
                </div>
                
                <Button
                  asChild
                  className="w-full md:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-md shadow-cyan-500/10 hover:shadow-cyan-500/20 transition-all font-semibold flex items-center justify-center gap-2 group shrink-0"
                >
                  <a href={knimbusUrl} target="_blank" rel="noopener noreferrer">
                    Access Digital Library <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                </Button>
              </div>
            </SlideIn>
          </div>
        </section>

        {/* Library Resource Counters Grid */}
        <section className="py-16 bg-background">
          <div className="mx-auto max-w-7xl px-4">
            <FadeIn className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground">Library Resources at a Glance</h2>
              <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                Comprehensive archives cataloged to aid MBBS, BSc Nursing, and postgraduate medical education.
              </p>
            </FadeIn>

            <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {stats.map((stat, index) => {
                const IconComp = stat.icon
                return (
                  <StaggerItem
                    key={index}
                    className={`rounded-2xl border bg-gradient-to-br ${stat.gradient} p-6 md:p-8 flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-300`}
                  >
                    <div className="space-y-4">
                      <div className="p-3 rounded-xl bg-card border shadow-sm w-fit">
                        <IconComp className={`w-8 h-8 ${stat.iconColor}`} />
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                          {stat.title}
                        </span>
                        <div className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
                          {stat.count}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-4 border-t border-border pt-4">
                      {stat.description}
                    </p>
                  </StaggerItem>
                )
              })}
            </StaggerContainer>
          </div>
        </section>

        {/* Operating Timelines & Library Guidelines Grid */}
        <section className="py-16 bg-secondary/30 border-t border-border overflow-hidden">
          <div className="mx-auto max-w-7xl px-4">
            <div className="grid gap-8 lg:grid-cols-12">
              {/* Operating Hours Column */}
              <SlideIn direction="left" className="lg:col-span-5 space-y-6">
                <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm">
                  <div className="flex items-center gap-3 border-b border-border pb-4 mb-6">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">Library Timings</h3>
                  </div>

                  <div className="space-y-4">
                    {timings.map((time: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 border border-border/60 hover:border-primary/20 transition-all"
                      >
                        <span className="font-semibold text-sm text-foreground">{time.day}</span>
                        <span className="text-sm text-muted-foreground bg-card border px-3 py-1 rounded-lg">
                          {time.hours}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* General Amenities Info */}
                  <div className="mt-8 p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20 space-y-2">
                    <h4 className="font-bold text-xs text-cyan-600 dark:text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Users className="w-4 h-4" /> Reading Room Amenities
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Equipped with high-speed campus Wi-Fi access keys, charging nodes, digital research workstations, and air-conditioned soundproof rooms.
                    </p>
                  </div>
                </div>
              </SlideIn>

              {/* Regulations Checklist Column */}
              <SlideIn direction="right" className="lg:col-span-7 space-y-6">
                <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm h-full">
                  <div className="flex items-center gap-3 border-b border-border pb-4 mb-6">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <ClipboardList className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">Code of Conduct &amp; Rules</h3>
                  </div>

                  <ul className="space-y-4">
                    {rules.map((rule: string, idx: number) => (
                      <li key={idx} className="flex gap-3.5 items-start text-muted-foreground text-sm md:text-base leading-relaxed">
                        <span className="inline-flex items-center justify-center shrink-0 w-6 h-6 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary">
                          {idx + 1}
                        </span>
                        <span className="pt-0.5">{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </SlideIn>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
