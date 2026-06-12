import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { db } from "@/lib/db"
import { Building2, Target, Eye, Award, Users, GraduationCap, Heart, Clock } from "lucide-react"
import Image from "next/image"
import { FadeIn, SlideIn, ScaleIn, StaggerContainer, StaggerItem } from "@/components/motion"



export const dynamic = "force-dynamic"

export default function AboutPage() {
  const collegeInfo = db.getCollegeInfo()
  const deanInfo = db.getDeanInfo()
  const authorities = db.getAuthorities()
  const ministers = authorities.filter(a => a.category === "minister")
  const aboutSettings = db.getAboutSettings()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-primary text-primary-foreground py-8 md:py-12 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <Image
              src="/images/college-building.jpg"
              alt="JBMGMC Campus"
              fill
              className="object-cover"
            />
          </div>
          <FadeIn delay={0.2} className="relative mx-auto max-w-7xl px-4">
            <div className="text-center">
              <p className="text-sm uppercase tracking-wider opacity-80 mb-2">About Us</p>
              <h1 className="text-3xl md:text-5xl font-bold mb-4 text-balance">
                {collegeInfo.name}
              </h1>
              <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto">
                {collegeInfo.nameMarathi}
              </p>
            </div>
          </FadeIn>
        </section>

        {/* Overview Section */}
        <section className="py-16 bg-background">
          <div className="mx-auto max-w-7xl px-4">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <SlideIn direction="left" className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="h-5 w-5 text-primary" />
                  <p className="text-primary font-semibold text-sm uppercase tracking-wider">
                    Our Institution
                  </p>
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-6">
                  A Premier Medical Institution in Maharashtra
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {collegeInfo.about}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Located in Nandurbar, our 40-acre campus is a vibrant hub for medical education, clinical training, and healthcare innovation - especially focused on serving rural and tribal populations. Our goal is to blend strong academic foundations with real-world clinical exposure.
                </p>
              </SlideIn>
              <SlideIn direction="right" className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg flex-1 w-full">
                <Image
                  src="/images/campus-view.jpg"
                  alt="JBMGMC Campus Building"
                  fill
                  className="object-cover"
                />
              </SlideIn>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-primary">
          <div className="mx-auto max-w-7xl px-4">
            <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StaggerItem className="rounded-lg bg-primary-foreground/10 backdrop-blur p-6 text-center text-primary-foreground transition-transform hover:scale-105">
                <div className="text-4xl font-bold mb-1">40</div>
                <div className="font-medium">Acres Campus</div>
                <p className="text-sm opacity-80 mt-1">Sprawling campus with modern amenities</p>
              </StaggerItem>
              <StaggerItem className="rounded-lg bg-primary-foreground/10 backdrop-blur p-6 text-center text-primary-foreground transition-transform hover:scale-105">
                <div className="text-4xl font-bold mb-1">500+</div>
                <div className="font-medium">Bed Hospital</div>
                <p className="text-sm opacity-80 mt-1">Tertiary care facility</p>
              </StaggerItem>
              <StaggerItem className="rounded-lg bg-primary-foreground/10 backdrop-blur p-6 text-center text-primary-foreground transition-transform hover:scale-105">
                <div className="text-4xl font-bold mb-1">150</div>
                <div className="font-medium">MBBS Seats</div>
                <p className="text-sm opacity-80 mt-1">Annual intake capacity</p>
              </StaggerItem>
              <StaggerItem className="rounded-lg bg-primary-foreground/10 backdrop-blur p-6 text-center text-primary-foreground transition-transform hover:scale-105">
                <div className="text-4xl font-bold mb-1">21</div>
                <div className="font-medium">Departments</div>
                <p className="text-sm opacity-80 mt-1">Pre, Para & Clinical</p>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4">
            <FadeIn className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Our Vision & Mission</h2>
              <div className="h-1 w-20 bg-primary mx-auto rounded-full"></div>
            </FadeIn>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <SlideIn direction="left" className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-3xl border border-border h-full">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <Eye className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {aboutSettings.vision || "To be a premier medical institution providing accessible, affordable, and equitable healthcare while producing world-class medical professionals committed to social responsibilities."}
                </p>
              </SlideIn>
              <SlideIn direction="right" className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-3xl border border-border h-full">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                <ul className="space-y-4 text-muted-foreground">
                  {(aboutSettings.mission.length > 0 ? aboutSettings.mission : [
                    "To provide comprehensive and quality medical education",
                    "To offer excellent patient care services to the community",
                    "To promote research and innovation in medical sciences"
                  ]).map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </SlideIn>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 bg-background">
          <div className="mx-auto max-w-7xl px-4">
            <div className="text-center mb-12">
              <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-2">
                What We Stand For
              </p>
              <h2 className="text-3xl font-bold text-foreground">Our Core Values</h2>
            </div>
            <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {(aboutSettings.values.length > 0 ? aboutSettings.values : [
                { title: "Excellence", description: "Striving for the highest standards", iconName: "Award" },
                { title: "Compassion", description: "Caring for our community", iconName: "Heart" },
                { title: "Integrity", description: "Honest and ethical practice", iconName: "Users" },
                { title: "Innovation", description: "Leading medical progress", iconName: "GraduationCap" }
              ]).map((value, index) => {
                const iconMap: Record<string, any> = { Award, Heart, Users, GraduationCap };
                const Icon = iconMap[value.iconName] || Award;
                return (
                  <StaggerItem key={index} className="text-center rounded-lg border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-md">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-16 bg-secondary">
          <div className="mx-auto max-w-7xl px-4">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-primary" />
                <p className="text-primary font-semibold text-sm uppercase tracking-wider">
                  Our Journey
                </p>
              </div>
              <h2 className="text-3xl font-bold text-foreground">Milestones</h2>
            </div>
            <div className="relative">
              <div className="absolute left-[15px] md:left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2" />
              <div className="space-y-8 overflow-hidden py-4">
                {(aboutSettings.milestones.length > 0 ? aboutSettings.milestones : [
                  { year: "2019", title: "College Established", description: "JBMGMC Nandurbar was established under Government of Maharashtra" },
                  { year: "2020", title: "First MBBS Batch", description: "Commenced the first batch of MBBS students" }
                ]).map((milestone, index) => (
                  <SlideIn key={index} direction={index % 2 === 0 ? "right" : "left"} delay={0.1} className={`relative flex items-start gap-6 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'} hidden md:block`}>
                      <div className={`rounded-lg bg-card p-4 shadow-sm inline-block max-w-md ${index % 2 === 0 ? 'md:ml-auto' : 'md:mr-auto'}`}>
                        <div className="text-primary font-bold">{milestone.year}</div>
                        <h3 className="font-semibold text-foreground">{milestone.title}</h3>
                        <p className="text-sm text-muted-foreground">{milestone.description}</p>
                      </div>
                    </div>
                    <div className="absolute left-4 md:left-1/2 -translate-x-1/2 flex h-4 w-4 items-center justify-center rounded-full bg-primary ring-4 ring-background" />
                    <div className="flex-1 ml-10 md:ml-0 md:hidden">
                      <div className="rounded-lg bg-card p-4 shadow-sm">
                        <div className="text-primary font-bold">{milestone.year}</div>
                        <h3 className="font-semibold text-foreground">{milestone.title}</h3>
                        <p className="text-sm text-muted-foreground">{milestone.description}</p>
                      </div>
                    </div>
                    <div className="flex-1 hidden md:block" />
                  </SlideIn>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Dean Section */}
        <section className="py-16 bg-background">
          <div className="mx-auto max-w-7xl px-4">
            <div className="text-center mb-10">
              <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-2">
                Leadership
              </p>
              <h2 className="text-3xl font-bold text-foreground">Our Dean</h2>
            </div>
            <ScaleIn className="mx-auto max-w-3xl">
              <div className="rounded-xl bg-card p-8 shadow-lg text-center">
                <div className="relative mx-auto mb-4 h-36 w-36 rounded-full overflow-hidden border-4 border-primary/20">
                  <Image
                    src="/images/dean-portrait.jpg"
                    alt={deanInfo.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-2xl font-bold text-foreground">{deanInfo.name}</h3>
                <p className="text-primary font-semibold">{deanInfo.designation}</p>
                <p className="text-sm text-muted-foreground mt-1 mb-4">{deanInfo.qualification}</p>
                <p className="text-muted-foreground leading-relaxed italic">
                  &ldquo;{deanInfo.message}&rdquo;
                </p>
              </div>
            </ScaleIn>
          </div>
        </section>

        {/* Ministers */}
        <section className="py-16 bg-secondary">
          <div className="mx-auto max-w-7xl px-4">
            <div className="text-center mb-10">
              <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-2">
                Government Leadership
              </p>
              <h2 className="text-3xl font-bold text-foreground">Hon&apos;ble Ministers</h2>
            </div>
            <StaggerContainer className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
              {ministers.map((person, index) => (
                <StaggerItem
                  key={index}
                  className="rounded-lg border border-border bg-card p-4 text-center transition-all hover:border-primary/50 hover:shadow-sm"
                >
                  <div className="relative mx-auto mb-3 h-20 w-20 rounded-full overflow-hidden bg-muted">
                    {person.image ? (
                      <Image
                        src={person.image}
                        alt={person.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-lg font-bold text-muted-foreground">
                        {person.name.split(' ').slice(-1)[0][0]}
                      </span>
                    )}
                  </div>
                  <h4 className="font-semibold text-foreground text-sm line-clamp-1">
                    {person.name}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {person.designation}
                  </p>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
