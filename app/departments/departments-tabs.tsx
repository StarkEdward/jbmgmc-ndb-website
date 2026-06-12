"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  ArrowRight, 
  Stethoscope, 
  Heart, 
  Brain, 
  Eye, 
  Bone, 
  Baby, 
  Pill, 
  Activity, 
  Syringe, 
  Ear, 
  Scissors, 
  Smile, 
  Users, 
  FlaskConical, 
  Scale, 
  Dna, 
  Microscope 
} from "lucide-react"
import { StaggerContainer, StaggerItem } from "@/components/motion"

// Define interfaces
interface Doctor {
  name: string
  designation: string
  qualification: string
  experience: string
}

interface Department {
  id: string
  name: string
  description: string
  fullDescription: string
  facilities: string[]
  doctors: Doctor[]
  category?: string
  pdfLink?: string
}

interface DepartmentsTabsProps {
  departments: Department[]
}

const departmentIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  // Pre-clinical
  "physiology": Activity,
  "biochemistry": FlaskConical,
  "anatomy": Bone,
  // Para-clinical
  "forensic-medicine": Scale,
  "community-medicine": Users,
  "pharmacology": Pill,
  "microbiology": Dna,
  "pathology": Microscope,
  // Clinical
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

type TabCategory = 'pre-clinical' | 'para-clinical' | 'clinical'

export function DepartmentsTabs({ departments }: DepartmentsTabsProps) {
  const [activeTab, setActiveTab] = useState<TabCategory>('clinical')

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash
      if (hash === '#pre-clinical') {
        setActiveTab('pre-clinical')
      } else if (hash === '#para-clinical') {
        setActiveTab('para-clinical')
      } else if (hash === '#clinical' || hash === '') {
        setActiveTab('clinical')
      }
    }

    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const anchor = target.closest('a')
      if (anchor) {
        const href = anchor.getAttribute('href')
        if (href) {
          if (href === '/departments') {
            setActiveTab('clinical')
          } else if (href.includes('/departments#')) {
            const hash = href.split('#')[1]
            if (hash === 'pre-clinical' || hash === 'para-clinical' || hash === 'clinical') {
              setActiveTab(hash as TabCategory)
            }
          }
        }
      }
    }

    // Run once on mount to handle direct links (e.g. from other pages)
    handleHashChange()

    window.addEventListener('hashchange', handleHashChange)
    window.addEventListener('popstate', handleHashChange)
    window.addEventListener('click', handleGlobalClick)

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
      window.removeEventListener('popstate', handleHashChange)
      window.removeEventListener('click', handleGlobalClick)
    }
  }, [])

  const handleTabClick = (tabId: TabCategory) => {
    setActiveTab(tabId)
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#${tabId}`)
    }
  }

  const preClinicalDepts = departments.filter(d => d.category === 'pre-clinical')
  const paraClinicalDepts = departments.filter(d => d.category === 'para-clinical')
  const clinicalDepts = departments.filter(d => d.category === 'clinical' || !d.category)

  const getFilteredDepts = () => {
    switch (activeTab) {
      case 'pre-clinical':
        return preClinicalDepts
      case 'para-clinical':
        return paraClinicalDepts
      case 'clinical':
      default:
        return clinicalDepts
    }
  }

  const activeDepts = getFilteredDepts()

  const tabs = [
    { id: 'pre-clinical', label: 'Pre-Clinical', icon: FlaskConical, count: preClinicalDepts.length },
    { id: 'para-clinical', label: 'Para-Clinical', icon: Microscope, count: paraClinicalDepts.length },
    { id: 'clinical', label: 'Clinical', icon: Stethoscope, count: clinicalDepts.length },
  ] as const

  return (
    <div className="space-y-6">
      {/* Premium Glassmorphic Tabs Switcher */}
      <div className="flex justify-center items-center">
        <div className="inline-flex p-1 rounded-2xl bg-secondary/30 backdrop-blur-md border border-border/60 shadow-sm w-full max-w-xl overflow-x-auto">
          {tabs.map((tab) => {
            const TabIcon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 whitespace-nowrap flex-1 ${
                  isActive 
                    ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-md shadow-primary/15 scale-[1.01]" 
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary-foreground/5"
                }`}
              >
                <TabIcon className={`h-4.5 w-4.5 ${isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"}`} />
                <span>{tab.label}</span>
                <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                  isActive ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  {tab.count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Styled Active Status Badge */}
      <div className="text-center">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/15">
          Showing {activeDepts.length} {activeTab === 'clinical' ? 'Clinical' : activeTab === 'pre-clinical' ? 'Pre-Clinical' : 'Para-Clinical'} departments
        </span>
      </div>

      {/* Grid List with tighter spacing */}
      <StaggerContainer key={activeTab} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 pt-2">
        {activeDepts.map((dept) => {
          const Icon = departmentIcons[dept.id] || Stethoscope
          return (
            <StaggerItem key={dept.id} className="h-full">
              <Link
                href={`/departments/${dept.id}`}
                className="group flex h-full flex-col rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:border-primary/60 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-6 w-6 text-primary group-hover:text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-foreground mb-1.5 group-hover:text-primary transition-colors">
                      {dept.name}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                      {dept.description}
                    </p>
                    <div className="flex items-center justify-between text-xs mt-auto">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Users className="h-3.5 w-3.5" />
                        <span>{dept.doctors.length} {dept.doctors.length === 1 ? 'Doctor' : 'Doctors'}</span>
                      </div>
                      <span className="flex items-center gap-1 text-primary font-semibold group-hover:gap-2 transition-all">
                        View Details
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </StaggerItem>
          )
        })}
      </StaggerContainer>
    </div>
  )
}
