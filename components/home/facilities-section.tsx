"use client"

import { 
  Building2, 
  Bed, 
  Stethoscope, 
  FlaskConical, 
  BookOpen, 
  Wifi,
  Car,
  Utensils,
  Shield,
  MonitorPlay,
  Microscope,
  Syringe,
  Sparkles
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { useAnimation, useCountUp } from "@/hooks/use-animation"

const facilities = [
  {
    icon: Building2,
    title: "Modern Campus",
    description: "Sprawling 50+ acre campus with state-of-the-art infrastructure, well-designed academic blocks, and landscaped gardens.",
  },
  {
    icon: Bed,
    title: "500+ Bed Hospital",
    description: "Fully equipped attached teaching hospital providing tertiary care services with specialized departments.",
  },
  {
    icon: Stethoscope,
    title: "Operation Theaters",
    description: "10 modern OTs including modular OTs for general surgery, orthopedics, gynecology, ophthalmology, and ENT procedures.",
  },
  {
    icon: FlaskConical,
    title: "Central Laboratory",
    description: "Advanced diagnostic laboratory with modern equipment for biochemistry, pathology, microbiology, and hematology.",
  },
  {
    icon: Microscope,
    title: "Research Center",
    description: "Dedicated research wing with facilities for basic and clinical research, supporting faculty and student projects.",
  },
  {
    icon: BookOpen,
    title: "Central Library",
    description: "Well-stocked library with 25,000+ books, e-journals, digital resources, and 24/7 reading room access.",
  },
  {
    icon: MonitorPlay,
    title: "Lecture Theaters",
    description: "Air-conditioned lecture halls equipped with modern AV systems, projectors, and comfortable seating for 200+ students.",
  },
  {
    icon: Syringe,
    title: "ICU Facilities",
    description: "Multi-specialty ICUs including Medical ICU, Surgical ICU, Pediatric ICU, and Neonatal ICU with ventilator support.",
  },
  {
    icon: Wifi,
    title: "Digital Campus",
    description: "Complete Wi-Fi coverage, computer labs, e-learning facilities, and telemedicine infrastructure.",
  },
  {
    icon: Car,
    title: "Ambulance Services",
    description: "24/7 ambulance service with advanced life support systems for emergency patient transport.",
  },
  {
    icon: Utensils,
    title: "Canteen & Cafeteria",
    description: "Hygienic canteen facilities serving nutritious meals for students, staff, and patient attendants.",
  },
  {
    icon: Shield,
    title: "Security & Safety",
    description: "Round-the-clock security, CCTV surveillance, fire safety systems, and emergency response protocols.",
  },
]

const infrastructureHighlights = [
  { label: "Total Area", value: 50, suffix: "+ Acres" },
  { label: "Hospital Beds", value: 500, suffix: "+" },
  { label: "Operation Theaters", value: 10, suffix: "" },
  { label: "ICU Beds", value: 60, suffix: "+" },
  { label: "Lecture Halls", value: 12, suffix: "" },
  { label: "Library Books", value: 25, suffix: "K+" },
]

function HighlightCard({ item, index, isVisible }: { item: typeof infrastructureHighlights[0], index: number, isVisible: boolean }) {
  const count = useCountUp(item.value, 1500, isVisible)
  
  return (
    <div
      className={`rounded-xl border border-border bg-card p-5 text-center shadow-sm hover:shadow-lg hover:border-primary/30 hover:-translate-y-1 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="text-3xl md:text-4xl font-bold text-primary tabular-nums">{count}{item.suffix}</div>
      <div className="text-sm text-muted-foreground mt-1">{item.label}</div>
    </div>
  )
}

export function FacilitiesSection() {
  const { ref: sectionRef, isVisible } = useAnimation<HTMLElement>({ threshold: 0.1 })

  return (
    <section ref={sectionRef} className="bg-muted/30 py-20 md:py-28 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-pattern-dots opacity-20" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <div className={`mb-14 text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4" />
            Infrastructure
          </span>
          <h2 className="mb-5 text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            Campus & Hospital Facilities
          </h2>
          <p className="mx-auto max-w-3xl text-muted-foreground text-lg">
            Our institution is equipped with world-class infrastructure to provide excellent 
            medical education and comprehensive healthcare services to the community.
          </p>
        </div>

        {/* Infrastructure Highlights */}
        <div className="mb-14 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {infrastructureHighlights.map((item, index) => (
            <HighlightCard key={index} item={item} index={index} isVisible={isVisible} />
          ))}
        </div>

        {/* Facilities Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {facilities.map((facility, index) => {
            const Icon = facility.icon
            return (
              <Card 
                key={index} 
                className={`group transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-border hover:border-primary/30 overflow-hidden ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${Math.min(index * 50 + 200, 600)}ms` }}
              >
                <CardContent className="p-6 relative">
                  {/* Hover gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:scale-110 group-hover:rotate-3">
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="mb-2 font-bold text-foreground text-lg group-hover:text-primary transition-colors">{facility.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{facility.description}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* CTA */}
        <div className={`mt-14 text-center transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Link
            href="/gallery"
            className="group inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 font-semibold text-white transition-all duration-300 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5"
          >
            View Campus Gallery
            <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
