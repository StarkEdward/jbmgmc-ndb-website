"use client"

import { GraduationCap, Users, Building, Stethoscope, Heart, Activity, Award, BookOpen } from "lucide-react"
import { useAnimation, useCountUp } from "@/hooks/use-animation"
import { useLiveData } from "@/hooks/use-live-data"

const iconMap: Record<string, any> = {
  GraduationCap,
  Users,
  Building,
  Stethoscope,
  Heart,
  Activity,
  Award,
  BookOpen
}

const defaultStats = [
  {
    icon: 'GraduationCap',
    countValue: "150+",
    label: "MBBS Seats",
    description: "Annual intake capacity"
  },
  {
    icon: 'Users',
    countValue: "100+",
    label: "Faculty Members",
    description: "Experienced professors"
  },
  {
    icon: 'Building',
    countValue: "21",
    label: "Departments",
    description: "Pre, Para & Clinical"
  },
  {
    icon: 'Stethoscope',
    countValue: "500+",
    label: "Bed Hospital",
    description: "Tertiary care facility"
  }
]

function StatCard({ stat, index, isVisible }: { stat: any, index: number, isVisible: boolean }) {
  const numberMatch = String(stat.countValue).match(/(\d+)(.*)/);
  const targetValue = numberMatch ? parseInt(numberMatch[1], 10) : 0;
  const suffix = numberMatch ? numberMatch[2] : '';
  
  const count = useCountUp(targetValue, 2000, isVisible)
  const Icon = iconMap[stat.icon] || GraduationCap

  return (
    <div 
      className={`text-center group transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 group-hover:scale-110 group-hover:bg-accent/20 transition-all duration-300">
        <Icon className="h-8 w-8 group-hover:scale-110 transition-transform duration-300" />
      </div>
      <div className="text-4xl md:text-5xl font-bold mb-2 tabular-nums">
        {count}{stat.suffix}
      </div>
      <div className="font-semibold text-lg mb-1">{stat.label}</div>
      <div className="text-sm opacity-75">{stat.description}</div>
    </div>
  )
}

export function StatsSection() {
  const { ref, isVisible } = useAnimation<HTMLElement>({ threshold: 0.2 })
  const { statCounters } = useLiveData()
  
  const displayStats = statCounters && statCounters.length > 0 ? statCounters : defaultStats

  return (
    <section ref={ref} className="py-16 md:py-20 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 relative">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {displayStats.map((stat: any, index: number) => (
            <StatCard key={stat.id || index} stat={stat} index={index} isVisible={isVisible} />
          ))}
        </div>
      </div>
    </section>
  )
}
