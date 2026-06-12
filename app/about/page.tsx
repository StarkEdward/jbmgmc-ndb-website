import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { db } from "@/lib/db"
import { Building2, Target, Eye, GraduationCap, Stethoscope, Microscopic, HeartHandshake, TrendingUp, BookOpen, Clock } from "lucide-react"
import Image from "next/image"
import { FadeIn, SlideIn, ScaleIn, StaggerContainer, StaggerItem } from "@/components/motion"

export const dynamic = "force-dynamic"

export default function AboutPage() {
  const collegeInfo = db.getCollegeInfo()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-primary text-primary-foreground py-16 md:py-24 overflow-hidden">
          {/* Blurred background */}
          <div className="absolute inset-0 opacity-40 blur-xl scale-110">
            <Image src="/images/about_bg.jpg" fill className="object-cover" alt="bg" />
          </div>
          <div className="absolute inset-0 bg-primary/80 dark:bg-slate-900/90 mix-blend-multiply"></div>
          
          <div className="relative mx-auto max-w-7xl px-4 z-10 flex flex-col items-center">
            <FadeIn delay={0.1} className="text-center mb-10 md:mb-16">
              <p className="text-sm uppercase tracking-widest text-amber-400 font-bold mb-3 drop-shadow-md">About Us</p>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-white text-balance drop-shadow-lg leading-tight">
                Jannayak Birsa Munda Government Medical College & Hospital
              </h1>
              <p className="text-lg md:text-xl text-slate-200 max-w-3xl mx-auto drop-shadow-md font-medium">
                “Serving with Skill. Healing with Heart. Leading with Vision.”
              </p>
            </FadeIn>
            
            <ScaleIn delay={0.3} className="w-full max-w-6xl">
              <div className="bg-white p-2 md:p-3 shadow-2xl rounded-xl md:rounded-2xl w-full">
                <div className="relative w-full aspect-[16/9] md:aspect-[21/9] lg:aspect-[3/1] group overflow-hidden rounded-lg">
                  <div className="absolute inset-0 overflow-hidden" style={{ clipPath: 'polygon(0 0, calc(50% - 4px) 0, calc(20% - 4px) 100%, 0 100%)' }}>
                    <Image src="/images/about_bg.jpg" fill alt="Campus Left" className="object-cover group-hover:scale-105 transition-transform duration-1000" />
                  </div>
                  <div className="absolute inset-0 overflow-hidden" style={{ clipPath: 'polygon(50% 0, 80% 100%, 20% 100%)' }}>
                    <Image src="/images/about_bg.jpg" fill alt="Campus Center" className="object-cover group-hover:scale-105 transition-transform duration-1000" />
                  </div>
                  <div className="absolute inset-0 overflow-hidden" style={{ clipPath: 'polygon(calc(50% + 4px) 0, 100% 0, 100% 100%, calc(80% + 4px) 100%)' }}>
                    <Image src="/images/about_bg.jpg" fill alt="Campus Right" className="object-cover group-hover:scale-105 transition-transform duration-1000" />
                  </div>
                </div>
              </div>
            </ScaleIn>
          </div>
        </section>

        {/* Introduction Section */}
        <section className="py-16 bg-background">
          <div className="mx-auto max-w-7xl px-4">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <SlideIn direction="left" className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="h-5 w-5 text-teal-600" />
                  <p className="text-teal-600 font-bold text-sm uppercase tracking-wider">
                    Our Institution
                  </p>
                </div>
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6 leading-tight">
                  A Beacon of Hope and Progress in Northwestern Maharashtra
                </h2>
                <div className="space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                  <p>
                    Established in 2019 and affiliated with the Maharashtra University of Health Sciences (MUHS), Nashik, our college aims to nurture the next generation of compassionate, skilled, and community-oriented doctors.
                  </p>
                  <p>
                    Located in Nandurbar, our 40-acre campus is a vibrant hub for medical education, clinical training, and healthcare innovation — especially focused on serving rural and tribal populations.
                  </p>
                </div>
              </SlideIn>
              <SlideIn direction="right" className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl flex-1 w-full border-4 border-white dark:border-slate-800">
                <Image
                  src="/images/clg_image.jpg"
                  alt="JBMGMC Campus Building"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
              </SlideIn>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="py-20 bg-slate-50 dark:bg-slate-900/40 relative">
          <div className="mx-auto max-w-7xl px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Why Choose Us?</h2>
              <div className="h-1 w-20 bg-teal-500 mx-auto rounded-full mt-4"></div>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {/* Academics */}
              <ScaleIn className="group bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-slate-800 hover:border-teal-500/30 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] transition-all duration-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-blue-500/10 transition-colors duration-500"></div>
                <div className="relative w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500 shadow-sm">
                  <GraduationCap className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Academics with a Purpose</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  We offer the flagship Bachelor of Medicine and Bachelor of Surgery (MBBS) program with an annual intake of 100 students, admitted through NEET-UG under National Medical Commission (NMC) guidelines.
                </p>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  In a major step forward, DNB postgraduate courses have also been introduced, marking a significant milestone in our academic journey. Our curriculum blends strong academic foundations with real-world clinical exposure, preparing medical professionals who are ready to serve in any setting.
                </p>
              </ScaleIn>

              {/* Clinical Training */}
              <ScaleIn delay={0.1} className="group bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-slate-800 hover:border-teal-500/30 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] transition-all duration-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-rose-500/10 transition-colors duration-500"></div>
                <div className="relative w-14 h-14 bg-rose-50 dark:bg-rose-900/20 rounded-xl flex items-center justify-center mb-6 text-rose-600 dark:text-rose-400 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 shadow-sm">
                  <Stethoscope className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Hospital & Clinical Training</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Our tertiary care hospital is the lifeline for numerous patients every month. It offers rich clinical exposure across all major departments like Medicine, Surgery, Pediatrics, Orthopedics, Obstetrics & Gynecology, and more.
                </p>
                <p className="text-slate-600 dark:text-slate-400">
                  Students gain invaluable real-world training in diagnosing, treating, and managing a wide range of health conditions — especially those prevalent in underserved communities.
                </p>
              </ScaleIn>

              {/* Facilities */}
              <ScaleIn delay={0.2} className="group bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-slate-800 hover:border-teal-500/30 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] transition-all duration-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-amber-500/10 transition-colors duration-500"></div>
                <div className="relative w-14 h-14 bg-amber-50 dark:bg-amber-900/20 rounded-xl flex items-center justify-center mb-6 text-amber-600 dark:text-amber-400 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500 shadow-sm">
                  <BookOpen className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Facilities that Empower Learning</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">We believe in learning beyond the classroom. Our college is equipped with:</p>
                <ul className="space-y-3 text-slate-600 dark:text-slate-400 font-medium">
                  <li className="flex items-center gap-3"><div className="h-2 w-2 rounded-full bg-amber-500"></div> A modern library with digital resources and e-access</li>
                  <li className="flex items-center gap-3"><div className="h-2 w-2 rounded-full bg-amber-500"></div> Well-equipped labs, skill centers, and demonstration rooms</li>
                  <li className="flex items-center gap-3"><div className="h-2 w-2 rounded-full bg-amber-500"></div> Smart classrooms with audio-visual teaching aids</li>
                </ul>
              </ScaleIn>

              {/* A College on the Rise */}
              <ScaleIn delay={0.3} className="group bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-slate-800 hover:border-teal-500/30 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] transition-all duration-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-teal-500/10 transition-colors duration-500"></div>
                <div className="relative w-14 h-14 bg-teal-50 dark:bg-teal-900/20 rounded-xl flex items-center justify-center mb-6 text-teal-600 dark:text-teal-400 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 shadow-sm">
                  <TrendingUp className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">A College on the Rise</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  As a young but ambitious institution, we are rapidly expanding our infrastructure and faculty. We are actively recruiting talented educators and clinicians to build a stronger academic foundation.
                </p>
                <p className="text-slate-600 dark:text-slate-400">
                  We are also working toward developing postgraduate programs, specialty services, and community-based research in the near future.
                </p>
              </ScaleIn>
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="py-20 bg-primary text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
             <Image src="/images/slider-design-s.jpg" fill className="object-cover" alt="Background pattern" />
          </div>
          <div className="mx-auto max-w-7xl px-4 relative z-10">
            <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-stretch">
              
              <SlideIn direction="left" className="group bg-primary-foreground/10 backdrop-blur-md p-10 rounded-3xl border border-primary-foreground/20 hover:-translate-y-2 hover:bg-primary-foreground/20 hover:border-primary-foreground/40 transition-all duration-500 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500">
                  <Eye className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-3xl font-bold mb-6">Our Vision</h3>
                <p className="text-lg opacity-90 leading-relaxed">
                  We envision providing locally effective and globally relevant competency-based medical education. Our goal is to cultivate highly skilled, qualified doctors who will contribute meaningfully to India’s biomedical workforce and elevate healthcare standards across the Nandurbar region, the nation, and beyond.
                </p>
              </SlideIn>
              
              <SlideIn direction="right" className="group bg-primary-foreground/10 backdrop-blur-md p-10 rounded-3xl border border-primary-foreground/20 hover:-translate-y-2 hover:bg-primary-foreground/20 hover:border-primary-foreground/40 transition-all duration-500 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-bl from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-3xl font-bold mb-6">Our Mission</h3>
                <ul className="space-y-6 text-lg opacity-90">
                  <li className="flex items-start gap-4">
                    <div className="mt-2 h-2.5 w-2.5 rounded-full bg-amber-400 shrink-0" />
                    <span>Uphold and practice medicine with the highest ethical standards, in alignment with global protocols, rooted in humility, integrity, and respect.</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="mt-2 h-2.5 w-2.5 rounded-full bg-amber-400 shrink-0" />
                    <span>Instill strong moral, ethical, and professional values in students, fostering a compassionate attitude toward patients and the community.</span>
                  </li>
                </ul>
              </SlideIn>

            </div>
          </div>
        </section>

        {/* Join Us Section */}
        <section className="py-24 bg-background text-center">
          <FadeIn className="mx-auto max-w-3xl px-4">
            <div className="w-20 h-20 bg-teal-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <HeartHandshake className="h-10 w-10 text-teal-600" />
            </div>
            <h2 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-6">Join Us in Shaping the Future of Healthcare</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed mb-10">
              At Jannayak Birsa Munda Government Medical College, Nandurbar, we are not just creating doctors — we are nurturing healers, leaders, and change makers. Whether you’re a medical aspirant, a faculty member, or a partner in public health, we welcome you to be a part of our journey.
            </p>
          </FadeIn>
        </section>

      </main>
      <Footer />
    </div>
  )
}
