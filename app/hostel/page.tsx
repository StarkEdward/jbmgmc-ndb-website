import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { db } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { 
  Home, 
  Users, 
  Wifi, 
  UtensilsCrossed, 
  ShieldCheck, 
  BookOpen,
  CheckCircle,
  Phone,
  ArrowRight,
  Building2,
  Bed
} from "lucide-react"
import { FadeIn, StaggerContainer, StaggerItem, SlideIn, ScaleIn } from "@/components/motion"


const facilityIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "24/7 Wi-Fi": Wifi,
  "Mess Facility": UtensilsCrossed,
  "24/7 Security": ShieldCheck,
  "Reading Room": BookOpen,
  "Female Wardens": Users,
}

export default function HostelPage() {
  const hostelInfo = db.getHostelInfo()
  const campusStats = db.getCampusStats()
  const hostels = [
    { key: "boys", data: hostelInfo.boys, color: "primary" },
    { key: "girls", data: hostelInfo.girls, color: "accent" },
    { key: "pg", data: hostelInfo.pgHostel, color: "primary" },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-8 md:py-12">
          <FadeIn delay={0.1} className="mx-auto max-w-7xl px-4">
            <div className="text-center">
              <p className="text-sm uppercase tracking-wider opacity-80 mb-2">Accommodation</p>
              <h1 className="text-3xl md:text-5xl font-bold mb-4">PG & Hostel Facilities</h1>
              <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
                Comfortable, safe, and well-equipped accommodation for students and postgraduate residents.
              </p>
            </div>
          </FadeIn>
        </section>

        {/* Overview Stats */}
        <section className="py-12 bg-secondary">
          <div className="mx-auto max-w-7xl px-4">
            <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <ScaleIn className="rounded-xl bg-card p-6 text-center shadow-sm">
                <Building2 className="h-10 w-10 mx-auto mb-3 text-primary" />
                <div className="text-3xl font-bold text-foreground mb-1">{campusStats.hostelBuildingsCount}</div>
                <div className="text-sm text-muted-foreground">Hostel Buildings</div>
              </ScaleIn>
              <ScaleIn className="rounded-xl bg-card p-6 text-center shadow-sm">
                <Bed className="h-10 w-10 mx-auto mb-3 text-primary" />
                <div className="text-3xl font-bold text-foreground mb-1">{campusStats.hostelCapacityCount}</div>
                <div className="text-sm text-muted-foreground">Total Capacity</div>
              </ScaleIn>
              <ScaleIn className="rounded-xl bg-card p-6 text-center shadow-sm">
                <ShieldCheck className="h-10 w-10 mx-auto mb-3 text-primary" />
                <div className="text-3xl font-bold text-foreground mb-1">24/7</div>
                <div className="text-sm text-muted-foreground">Security</div>
              </ScaleIn>
              <ScaleIn className="rounded-xl bg-card p-6 text-center shadow-sm">
                <UtensilsCrossed className="h-10 w-10 mx-auto mb-3 text-primary" />
                <div className="text-3xl font-bold text-foreground mb-1">{campusStats.mealsDailyCount}</div>
                <div className="text-sm text-muted-foreground">Meals Daily</div>
              </ScaleIn>
            </StaggerContainer>
          </div>
        </section>

        {/* Hostels */}
        <section className="py-16 bg-background">
          <div className="mx-auto max-w-7xl px-4">
            <FadeIn className="text-center mb-12">
              <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-2">
                Our Hostels
              </p>
              <h2 className="text-3xl font-bold text-foreground">Accommodation Options</h2>
            </FadeIn>

            <StaggerContainer className="space-y-8">
              {/* Boys Hostel */}
              <StaggerItem className="rounded-xl border border-border bg-card overflow-hidden transition-all hover:shadow-lg">
                <div className="bg-primary/5 p-6 border-b border-border">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                        <Home className="h-7 w-7" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground">{hostelInfo.boys.name}</h3>
                        <p className="text-muted-foreground">For male MBBS students</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{hostelInfo.boys.capacity}</div>
                      <div className="text-sm text-muted-foreground">Beds Capacity</div>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="font-semibold text-foreground mb-4">Facilities</h4>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                    {hostelInfo.boys.facilities.map((facility, index) => {
                      const Icon = facilityIcons[facility] || CheckCircle
                      return (
                        <div key={index} className="flex items-center gap-2 p-3 rounded-lg bg-secondary">
                          <Icon className="h-4 w-4 text-primary shrink-0" />
                          <span className="text-sm text-foreground">{facility}</span>
                        </div>
                      )
                    })}
                  </div>
                  <h4 className="font-semibold text-foreground mb-3">Rules & Regulations</h4>
                  <ul className="space-y-2">
                    {hostelInfo.boys.rules.map((rule, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        {rule}
                      </li>
                    ))}
                  </ul>
                </div>
              </StaggerItem>

              {/* Girls Hostel */}
              <StaggerItem className="rounded-xl border border-border bg-card overflow-hidden transition-all hover:shadow-lg">
                <div className="bg-accent/10 p-6 border-b border-border">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                        <Home className="h-7 w-7" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground">{hostelInfo.girls.name}</h3>
                        <p className="text-muted-foreground">For female MBBS students</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-accent">{hostelInfo.girls.capacity}</div>
                      <div className="text-sm text-muted-foreground">Beds Capacity</div>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="font-semibold text-foreground mb-4">Facilities</h4>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                    {hostelInfo.girls.facilities.map((facility, index) => {
                      const Icon = facilityIcons[facility] || CheckCircle
                      return (
                        <div key={index} className="flex items-center gap-2 p-3 rounded-lg bg-secondary">
                          <Icon className="h-4 w-4 text-accent shrink-0" />
                          <span className="text-sm text-foreground">{facility}</span>
                        </div>
                      )
                    })}
                  </div>
                  <h4 className="font-semibold text-foreground mb-3">Rules & Regulations</h4>
                  <ul className="space-y-2">
                    {hostelInfo.girls.rules.map((rule, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                        {rule}
                      </li>
                    ))}
                  </ul>
                </div>
              </StaggerItem>

              {/* PG Hostel */}
              <StaggerItem className="rounded-xl border border-border bg-card overflow-hidden transition-all hover:shadow-lg">
                <div className="bg-primary/5 p-6 border-b border-border">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                        <Users className="h-7 w-7" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground">{hostelInfo.pgHostel.name}</h3>
                        <p className="text-muted-foreground">For MD/MS/DNB Residents</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{hostelInfo.pgHostel.capacity}</div>
                      <div className="text-sm text-muted-foreground">Rooms Capacity</div>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="font-semibold text-foreground mb-4">Facilities</h4>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                    {hostelInfo.pgHostel.facilities.map((facility, index) => {
                      const Icon = facilityIcons[facility] || CheckCircle
                      return (
                        <div key={index} className="flex items-center gap-2 p-3 rounded-lg bg-secondary">
                          <Icon className="h-4 w-4 text-primary shrink-0" />
                          <span className="text-sm text-foreground">{facility}</span>
                        </div>
                      )
                    })}
                  </div>
                  <h4 className="font-semibold text-foreground mb-3">Guidelines</h4>
                  <ul className="space-y-2">
                    {hostelInfo.pgHostel.rules.map((rule, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        {rule}
                      </li>
                    ))}
                  </ul>
                </div>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </section>

        {/* Important Information */}
        <section className="py-16 bg-secondary overflow-hidden">
          <div className="mx-auto max-w-7xl px-4">
            <div className="grid gap-8 md:grid-cols-2">
              <SlideIn direction="left" className="rounded-xl bg-card p-8 shadow-sm">
                <h3 className="text-xl font-bold text-foreground mb-4">Mess Facilities</h3>
                <p className="text-muted-foreground mb-4">
                  Our hostel mess provides hygienic and nutritious vegetarian and non-vegetarian meals. The mess operates on a monthly basis with flexible timing to accommodate students&apos; schedules.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-foreground">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Breakfast: 7:00 AM - 9:00 AM
                  </li>
                  <li className="flex items-center gap-2 text-sm text-foreground">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Lunch: 12:30 PM - 2:30 PM
                  </li>
                  <li className="flex items-center gap-2 text-sm text-foreground">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Dinner: 7:30 PM - 9:30 PM
                  </li>
                </ul>
              </SlideIn>
              <SlideIn direction="right" className="rounded-xl bg-card p-8 shadow-sm">
                <h3 className="text-xl font-bold text-foreground mb-4">How to Apply</h3>
                <p className="text-muted-foreground mb-4">
                  Hostel accommodation is provided to students upon admission to JBMGMC Nandurbar. Application for hostel is part of the admission process.
                </p>
                <ol className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-foreground">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">1</span>
                    Apply for hostel during admission
                  </li>
                  <li className="flex items-start gap-2 text-sm text-foreground">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">2</span>
                    Submit required documents
                  </li>
                  <li className="flex items-start gap-2 text-sm text-foreground">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">3</span>
                    Pay hostel fees
                  </li>
                  <li className="flex items-start gap-2 text-sm text-foreground">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">4</span>
                    Collect room allotment
                  </li>
                </ol>
              </SlideIn>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-primary text-primary-foreground">
          <FadeIn className="mx-auto max-w-7xl px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Need More Information?</h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
              Contact our hostel office for any queries regarding accommodation, fees, or facilities.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/contact">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 transition-transform hover:scale-105">
                  <Phone className="mr-2 h-4 w-4" />
                  Contact Us
                </Button>
              </Link>
              <Link href="/courses">
                <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground bg-transparent hover:bg-primary-foreground/10 transition-transform hover:scale-105">
                  View Courses
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </FadeIn>
        </section>
      </main>
      <Footer />
    </div>
  )
}
