"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Stethoscope, Heart, Brain, Eye, Bone, Baby, Pill, Activity, Syringe, Ear, Scissors, Smile } from "lucide-react"
import { departments } from "@/lib/data"
import { useAnimation } from "@/hooks/use-animation"

const departmentIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "radiology": Activity,
  "anesthesiology": Syringe,
  "dentistry": Smile,
  "emergency-medicine": Heart,
  "obstetrics-gynaecology": Baby,
  "ent": Ear,
  "ophthalmology": Eye,
  "orthopedics": Bone,
  "general-surgery": Scissors,
  "skin-vd": Stethoscope,
  "psychiatry": Brain,
  "pediatrics": Baby,
  "general-medicine": Pill,
}

export function DepartmentsSection() {
  const { ref: sectionRef, isVisible } = useAnimation<HTMLElement>({ threshold: 0.1 })

  return (
    <section ref={sectionRef} className="py-10 md:py-16 bg-slate-50/80 dark:bg-slate-900/20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      
      <div className="container mx-auto max-w-6xl px-6 md:px-12 lg:px-16">
        <div className={`text-center mb-10 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            <Stethoscope className="w-4 h-4" />
            Clinical Departments
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-5">
            Our Departments
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            We offer comprehensive healthcare services through our various specialized departments, each staffed with experienced medical professionals.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {departments.filter(d => d.category === 'clinical' || !d.category).slice(0, 4).map((dept, index) => {
            const Icon = departmentIcons[dept.id] || Stethoscope
            return (
              <Link
                key={dept.id}
                href={`/departments/${dept.id}`}
                className={`group relative overflow-hidden rounded-xl border border-border/50 bg-card p-5 shadow-md shadow-slate-200/40 dark:shadow-none transition-all duration-500 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 active:border-primary/50 active:shadow-2xl active:shadow-primary/10 active:-translate-y-1 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${Math.min(index * 50, 400)}ms` }}
              >
                {/* Dynamic hover background blob */}
                <div className="absolute -right-10 -top-10 z-0 h-32 w-32 rounded-full bg-primary/5 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:bg-primary/10 group-active:scale-150 group-active:bg-primary/10" />

                <div className="relative z-10 mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 transition-all duration-300 group-hover:-rotate-3 group-hover:scale-110 group-hover:bg-primary group-hover:shadow-md group-hover:shadow-primary/20 group-active:-rotate-3 group-active:scale-110 group-active:bg-primary group-active:shadow-md group-active:shadow-primary/20">
                  <Icon className="h-5 w-5 text-primary transition-colors duration-300 group-hover:text-primary-foreground group-active:text-primary-foreground" />
                </div>
                <h3 className="relative z-10 mb-1.5 text-sm font-bold text-foreground transition-colors duration-300 group-hover:text-primary group-active:text-primary">
                  {dept.name}
                </h3>
                <p className="relative z-10 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
                  {dept.description}
                </p>
                <div className="relative z-10 mt-3 flex items-center text-[11px] font-semibold text-primary opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-active:translate-x-0 group-active:opacity-100">
                  Learn more
                  <ArrowRight className="ml-1 h-3 w-3" />
                </div>
              </Link>
            )
          })}
        </div>

        <div className={`text-center mt-12 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Link href="/departments">
            <Button variant="outline" size="lg" className="group border-primary/30 hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:-translate-y-0.5">
              View All Departments
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
