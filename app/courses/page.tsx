import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { db } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { 
  GraduationCap, 
  Clock, 
  Users, 
  CheckCircle, 
  FileText, 
  Download,
  ArrowRight,
  BookOpen,
  Award
} from "lucide-react"
import { FadeIn, SlideIn, StaggerContainer, StaggerItem, ScaleIn } from "@/components/motion"




const admissionSteps = [
  { step: 1, title: "Qualify NEET", description: "Clear the National Eligibility cum Entrance Test (NEET) with required cutoff." },
  { step: 2, title: "Register for Counseling", description: "Register on the state/central counseling portal based on your quota." },
  { step: 3, title: "Document Verification", description: "Verify your original documents at the designated nodal center." },
  { step: 4, title: "Choice Filling", description: "Fill your preference for JBMGMC Nandurbar during the choice filling round." },
  { step: 5, title: "Seat Allotment", description: "Wait for the seat allotment results published by the competent authority." },
  { step: 6, title: "College Reporting", description: "Report to the college with allotted letter and pay fees to confirm admission." }
];

export default function CoursesPage() {
  const courses = db.getCourses()
  const downloads = db.getDownloads()
  const academicsSettings = db.getAcademicsSettings()
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-8 md:py-12">
          <FadeIn delay={0.1} className="mx-auto max-w-7xl px-4">
            <div className="text-center">
              <p className="text-sm uppercase tracking-wider opacity-80 mb-2">Academic Programs</p>
              <h1 className="text-3xl md:text-5xl font-bold mb-4">Courses Offered</h1>
              <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
                Comprehensive medical education programs designed to produce competent healthcare professionals.
              </p>
            </div>
          </FadeIn>
        </section>

        {/* Courses Grid */}
        <section className="py-16 bg-background">
          <div className="mx-auto max-w-7xl px-4">
            <StaggerContainer className="grid gap-8 md:grid-cols-2">
              {courses.map((course) => (
                <StaggerItem
                  key={course.id}
                  className="rounded-xl border border-border bg-card overflow-hidden transition-all hover:border-primary/50 hover:shadow-lg"
                >
                  <div className="bg-primary/5 p-6 border-b border-border">
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                        <GraduationCap className="h-7 w-7" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground">{course.name}</h3>
                        <p className="text-muted-foreground text-sm">{course.fullName}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-muted-foreground mb-6">{course.description}</p>
                    <div className="grid gap-4 sm:grid-cols-2 mb-6">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">Duration</p>
                          <p className="font-medium text-foreground">{course.duration}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">Seats</p>
                          <p className="font-medium text-foreground">{course.seats}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-secondary rounded-lg p-4">
                      <p className="text-sm font-medium text-foreground mb-1">Eligibility</p>
                      <p className="text-sm text-muted-foreground">{course.eligibility}</p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Admission Process */}
        <section className="py-16 bg-secondary">
          <div className="mx-auto max-w-7xl px-4">
            <FadeIn className="text-center mb-12">
              <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-2">
                How to Apply
              </p>
              <h2 className="text-3xl font-bold text-foreground">Admission Process</h2>
            </FadeIn>
            <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {admissionSteps.map((step) => (
                <StaggerItem key={step.step} className="flex items-start gap-4 rounded-xl bg-card p-5 shadow-sm transition-all hover:shadow-md hover:border-primary/20 border border-transparent">
                  <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                    {step.step}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Key Features */}
        <section className="py-16 bg-background overflow-hidden">
          <div className="mx-auto max-w-7xl px-4">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <SlideIn direction="left">
                <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-2">
                  Why Choose Us
                </p>
                <h2 className="text-3xl font-bold text-foreground mb-6">
                  Excellence in Medical Education
                </h2>
                <div className="space-y-4">
                  {[
                    "Experienced and dedicated faculty",
                    "State-of-the-art infrastructure and labs",
                    "Attached tertiary care teaching hospital",
                    "Comprehensive clinical exposure",
                    "Research opportunities",
                    "Student-friendly environment",
                    "Affordable government fees",
                    "Hostel facilities for students",
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                      <span className="text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </SlideIn>
              <StaggerContainer className="grid gap-4 sm:grid-cols-2">
                <ScaleIn className="rounded-xl bg-primary text-primary-foreground p-6 text-center">
                  <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-80" />
                  <div className="text-3xl font-bold mb-1">4</div>
                  <div className="text-sm opacity-80">Academic Programs</div>
                </ScaleIn>
                <ScaleIn className="rounded-xl bg-accent text-accent-foreground p-6 text-center">
                  <GraduationCap className="h-10 w-10 mx-auto mb-3 opacity-80" />
                  <div className="text-3xl font-bold mb-1">150+</div>
                  <div className="text-sm opacity-80">MBBS Seats</div>
                </ScaleIn>
                <ScaleIn className="rounded-xl bg-secondary p-6 text-center">
                  <Users className="h-10 w-10 mx-auto mb-3 text-primary" />
                  <div className="text-3xl font-bold text-foreground mb-1">100+</div>
                  <div className="text-sm text-muted-foreground">Faculty Members</div>
                </ScaleIn>
                <ScaleIn className="rounded-xl bg-secondary p-6 text-center">
                  <Award className="h-10 w-10 mx-auto mb-3 text-primary" />
                  <div className="text-3xl font-bold text-foreground mb-1">NMC</div>
                  <div className="text-sm text-muted-foreground">Recognized</div>
                </ScaleIn>
              </StaggerContainer>
            </div>
          </div>
        </section>

        {/* Downloads */}
        <section className="py-16 bg-secondary">
          <div className="mx-auto max-w-7xl px-4">
            <FadeIn className="text-center mb-10">
              <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-2">
                Resources
              </p>
              <h2 className="text-3xl font-bold text-foreground">Downloads</h2>
            </FadeIn>
            <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {downloads.map((download) => (
                <StaggerItem
                  key={download.id}
                  className="flex items-center gap-4 rounded-xl bg-card p-4 border border-border transition-all hover:border-primary/50 hover:shadow-sm"
                >
                  <div className="shrink-0 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground text-sm truncate">{download.name}</h3>
                    <p className="text-xs text-muted-foreground">{download.type}</p>
                  </div>
                  <a href={download.url} download className="shrink-0 hover:scale-110 transition-transform">
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </a>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-primary text-primary-foreground">
          <FadeIn className="mx-auto max-w-7xl px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Start Your Medical Journey?</h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
              Join JBMGMC Nandurbar and become part of a legacy of medical excellence. Contact us for more information about admissions.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/contact">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 transition-transform hover:scale-105">
                  Contact Admission Cell
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/hostel">
                <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground bg-transparent hover:bg-primary-foreground/10 transition-transform hover:scale-105">
                  View Hostel Facilities
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
