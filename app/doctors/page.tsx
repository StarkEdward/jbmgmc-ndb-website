"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useLiveData } from "@/hooks/use-live-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, User, GraduationCap, Briefcase, Building2 } from "lucide-react"
import { FadeIn, SlideIn, StaggerContainer, StaggerItem, ScaleIn } from "@/components/motion"

export default function DoctorsPage() {
  const { departments } = useLiveData()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedDesignation, setSelectedDesignation] = useState("all")

  // Flatten all doctors from all departments dynamically
  const allDoctors = useMemo(() => {
    return departments.flatMap(dept => 
      dept.doctors.map(doctor => ({
        ...doctor,
        department: dept.name,
        departmentId: dept.id
      }))
    )
  }, [departments])

  // Get unique designations for filtering
  const designations = useMemo(() => {
    return [...new Set(allDoctors.map(d => d.designation))]
  }, [allDoctors])

  const filteredDoctors = useMemo(() => {
    return allDoctors.filter(doctor => {
      const matchesSearch = 
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.qualification.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.department.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesDepartment = 
        selectedDepartment === "all" || doctor.departmentId === selectedDepartment
      
      const matchesDesignation = 
        selectedDesignation === "all" || doctor.designation === selectedDesignation

      return matchesSearch && matchesDepartment && matchesDesignation
    })
  }, [searchQuery, selectedDepartment, selectedDesignation, allDoctors])

  // Group by designation for better display
  const groupedByDesignation = useMemo(() => {
    const groups: Record<string, typeof filteredDoctors> = {}
    filteredDoctors.forEach(doctor => {
      if (!groups[doctor.designation]) {
        groups[doctor.designation] = []
      }
      groups[doctor.designation].push(doctor)
    })
    return groups
  }, [filteredDoctors])

  const designationOrder = ["Professor & HOD", "Professor", "Associate Professor & HOD", "Associate Professor", "Assistant Professor"]

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-8 md:py-12">
          <FadeIn delay={0.1} className="mx-auto max-w-7xl px-4">
            <div className="text-center">
              <p className="text-sm uppercase tracking-wider opacity-80 mb-2">Our Team</p>
              <h1 className="text-3xl md:text-5xl font-bold mb-4">Doctors Directory</h1>
              <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
                Meet our team of dedicated and experienced medical professionals serving at JBMGMC Nandurbar.
              </p>
            </div>
          </FadeIn>
        </section>

        {/* Search & Filters */}
        <section className="py-8 bg-secondary sticky top-0 z-30 border-b border-border">
          <SlideIn direction="down" className="mx-auto max-w-7xl px-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search doctors by name, qualification, or department..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Department Filter */}
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="px-4 py-2 rounded-md border border-input bg-background text-foreground"
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>

              {/* Designation Filter */}
              <select
                value={selectedDesignation}
                onChange={(e) => setSelectedDesignation(e.target.value)}
                className="px-4 py-2 rounded-md border border-input bg-background text-foreground"
              >
                <option value="all">All Designations</option>
                {designations.map(des => (
                  <option key={des} value={des}>{des}</option>
                ))}
              </select>
            </div>
          </SlideIn>
        </section>

        {/* Doctors List */}
        <section className="py-12 bg-background">
          <div className="mx-auto max-w-7xl px-4">
            {/* Results Count */}
            <div className="mb-8">
              <p className="text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{filteredDoctors.length}</span> doctors
                {searchQuery && (
                  <span> matching &quot;{searchQuery}&quot;</span>
                )}
              </p>
            </div>

            {filteredDoctors.length === 0 ? (
              <div className="text-center py-16">
                <User className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No doctors found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or filter criteria
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedDepartment("all")
                    setSelectedDesignation("all")
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="space-y-12">
                {designationOrder.map(designation => {
                  const doctors = groupedByDesignation[designation]
                  if (!doctors || doctors.length === 0) return null
                  
                  return (
                    <div key={designation}>
                      <div className="flex items-center gap-4 mb-6">
                        <h2 className="text-xl font-bold text-foreground">{designation}</h2>
                        <div className="flex-1 h-px bg-border" />
                        <span className="text-sm text-muted-foreground">{doctors.length} doctors</span>
                      </div>
                      <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {doctors.map((doctor, index) => (
                          <StaggerItem
                            key={`${doctor.name}-${doctor.departmentId}-${index}`}
                            className="rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-md hover:-translate-y-1"
                          >
                            <div className="flex items-start gap-4">
                              <div className="shrink-0 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-xl font-bold text-primary">
                                  {doctor.name.split(' ').slice(1, 3).map(n => n[0]).join('')}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-foreground truncate">{doctor.name}</h3>
                                <p className="text-primary text-sm font-medium">{doctor.designation}</p>
                              </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-border space-y-2">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Building2 className="h-4 w-4 shrink-0" />
                                <Link 
                                  href={`/departments/${doctor.departmentId}`}
                                  className="hover:text-primary transition-colors truncate"
                                >
                                  {doctor.department}
                                </Link>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <GraduationCap className="h-4 w-4 shrink-0" />
                                <span className="truncate">{doctor.qualification}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Briefcase className="h-4 w-4 shrink-0" />
                                <span>{doctor.experience} experience</span>
                              </div>
                            </div>
                          </StaggerItem>
                        ))}
                      </StaggerContainer>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 bg-primary text-primary-foreground">
          <div className="mx-auto max-w-7xl px-4">
            <StaggerContainer className="grid gap-8 sm:grid-cols-2 md:grid-cols-4 text-center">
              <ScaleIn>
                <div className="text-4xl font-bold mb-1">{allDoctors.length}</div>
                <div className="opacity-80">Total Doctors</div>
              </ScaleIn>
              <ScaleIn>
                <div className="text-4xl font-bold mb-1">{departments.length}</div>
                <div className="opacity-80">Departments</div>
              </ScaleIn>
              <ScaleIn>
                <div className="text-4xl font-bold mb-1">
                  {allDoctors.filter(d => d.designation.includes("Professor & HOD")).length}
                </div>
                <div className="opacity-80">Department Heads</div>
              </ScaleIn>
              <ScaleIn>
                <div className="text-4xl font-bold mb-1">
                  {Math.round(allDoctors.reduce((acc, d) => acc + parseInt(d.experience), 0) / allDoctors.length)}+
                </div>
                <div className="opacity-80">Avg. Years Experience</div>
              </ScaleIn>
            </StaggerContainer>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
