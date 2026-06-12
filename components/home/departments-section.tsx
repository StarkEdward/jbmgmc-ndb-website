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
    <section ref={sectionRef} className="py-20 md:py-28 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      
      <div className="mx-auto max-w-7xl px-4">
        <div className={`text-center mb-14 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
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
          {departments.filter(d => d.category === 'clinical' || !d.category).map((dept, index) => {
            const Icon = departmentIcons[dept.id] || Stethoscope
            return (
              <Link
                key={dept.id}
                href={`/departments/${dept.id}`}
                className={`group rounded-xl border border-border bg-card p-6 transition-all duration-500 hover:border-primary hover:shadow-xl hover:-translate-y-2 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${Math.min(index * 50, 400)}ms` }}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-all duration-300 group-hover:bg-primary group-hover:scale-110 group-hover:rotate-3">
                  <Icon className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                </div>
                <h3 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                  {dept.name}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {dept.description}
                </p>
                <div className="mt-4 flex items-center text-sm font-medium text-primary opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  Learn more
                  <ArrowRight className="ml-1 h-4 w-4" />
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
