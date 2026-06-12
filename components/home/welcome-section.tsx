"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Building2, Bed, UserCheck, Award } from "lucide-react"
import { collegeInfo } from "@/lib/data"
import { useAnimation } from "@/hooks/use-animation"

const features = [
  {
    icon: Building2,
    title: "40 Acres Campus",
    description: "Sprawling campus with modern facilities"
  },
  {
    icon: Bed,
    title: "Tertiary Care Hospital",
    description: "Biggest healthcare facility in Nashik Region"
  },
  {
    icon: UserCheck,
    title: "Skilled Staff",
    description: "Dedicated and qualified medical professionals"
  },
  {
    icon: Award,
    title: "Modern Equipment",
    description: "State-of-the-art medical equipment"
  }
]

export function WelcomeSection() {
  const { ref: sectionRef, isVisible } = useAnimation<HTMLElement>({ threshold: 0.1 })

  return (
    <section ref={sectionRef} className="py-20 md:py-28 bg-background relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-pattern-dots opacity-30" />
      
      <div className="mx-auto max-w-7xl px-4 relative">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          {/* Content */}
          <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Welcome to Our College
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance leading-tight">
              {collegeInfo.name}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6 text-lg">
              {collegeInfo.about}
            </p>
            {/* College Image */}
            <div className="relative h-64 w-full rounded-xl overflow-hidden mb-8 shadow-lg">
              <Image
                src="/images/students.jpg"
                alt="Medical students at JBMGMC Nandurbar"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
            </div>
            <Link href="/about">
              <Button size="lg" className="group shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5">
                Learn More About Us
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid gap-5 sm:grid-cols-2">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`rounded-xl border border-border bg-card p-6 transition-all duration-500 hover:border-primary/50 hover:shadow-xl hover:-translate-y-1 group ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100 + 200}ms` }}
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <feature.icon className="h-7 w-7 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                </div>
                <h3 className="font-bold text-foreground mb-2 text-lg group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
