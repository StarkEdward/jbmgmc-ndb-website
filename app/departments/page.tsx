import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { db } from "@/lib/db"
import { ArrowRight } from "lucide-react"
import { FadeIn, SlideIn, StaggerContainer, StaggerItem } from "@/components/motion"
import { DepartmentsTabs } from "./departments-tabs"


export default function DepartmentsPage() {
  const departments = db.getDepartments()
  const campusStats = db.getCampusStats()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-8 md:py-12">
          <FadeIn delay={0.1} className="mx-auto max-w-7xl px-4">
            <div className="text-center">
              <p className="text-sm uppercase tracking-wider opacity-80 mb-2">Academic Divisions</p>
              <h1 className="text-3xl md:text-5xl font-bold mb-4">Our Departments</h1>
              <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
                Comprehensive training and clinical excellence across our pre-clinical, para-clinical, and clinical departments.
              </p>
            </div>
          </FadeIn>
        </section>

        {/* Departments Grid with Tabs */}
        <section className="py-8 md:py-12 bg-background">
          <div className="mx-auto max-w-7xl px-4">
            <DepartmentsTabs departments={departments} />
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-primary text-primary-foreground">
          <div className="mx-auto max-w-7xl px-4">
            <StaggerContainer className="grid gap-8 sm:grid-cols-2 md:grid-cols-4 text-center">
              <StaggerItem>
                <div className="text-4xl font-bold mb-1">{campusStats.clinicalDepartmentsCount}</div>
                <div className="opacity-80">Total Departments</div>
              </StaggerItem>
              <StaggerItem>
                <div className="text-4xl font-bold mb-1">{campusStats.specialistDoctorsCount}</div>
                <div className="opacity-80">Specialist Doctors</div>
              </StaggerItem>
              <StaggerItem>
                <div className="text-4xl font-bold mb-1">24/7</div>
                <div className="opacity-80">Emergency Services</div>
              </StaggerItem>
              <StaggerItem>
                <div className="text-4xl font-bold mb-1">{campusStats.bedsCount}</div>
                <div className="opacity-80">Beds Available</div>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </section>

        {/* Emergency Info */}
        <section className="py-16 bg-secondary">
          <div className="mx-auto max-w-7xl px-4">
            <div className="rounded-xl bg-card p-8 shadow-sm overflow-hidden">
              <div className="grid gap-8 md:grid-cols-2 items-center">
                <SlideIn direction="left">
                  <h2 className="text-3xl font-bold mb-4">24/7 Emergency Care</h2>
                  <div className="h-1 w-20 bg-primary rounded-full mb-6 mx-auto md:mx-0"></div>
                  <p className="text-muted-foreground text-lg mb-6">
                    {campusStats.emergencyServicesText || "Our Emergency Department operates round the clock, equipped with state-of-the-art life-saving equipment and staffed by specialized emergency physicians."}
                  </p>
                  <Link href="/departments/emergency-medicine">
                    <span className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all cursor-pointer">
                      Learn More About Emergency Services
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </Link>
                </SlideIn>
                <SlideIn direction="right" className="bg-destructive/10 rounded-xl p-6 text-center transition-transform hover:scale-105">
                  <div className="text-destructive text-sm font-semibold uppercase tracking-wider mb-2">Emergency Helpline</div>
                  <div className="text-4xl font-bold text-destructive mb-1">102</div>
                  <div className="text-muted-foreground">Available 24 Hours</div>
                </SlideIn>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
