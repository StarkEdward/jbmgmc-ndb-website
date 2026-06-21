"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useLiveData } from "@/hooks/use-live-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, User, GraduationCap, Briefcase, Building2, ExternalLink, Activity } from "lucide-react"
import { FadeIn, SlideIn, StaggerContainer, StaggerItem, ScaleIn } from "@/components/motion"

const formatDoctorName = (name: string) => {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 4 && parts[0].toLowerCase().includes('dr')) {
    return `${parts[0]} ${parts[1]} ${parts[parts.length - 1]}`;
  }
  return name;
}

export default function DoctorsPage() {
  const { departments } = useLiveData()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedDesignation, setSelectedDesignation] = useState("all")

  // Flatten all doctors from all departments dynamically
  const allDoctors = useMemo(() => {
    return departments.flatMap((dept: any) => 
      (dept.doctors || [])
        .filter((doctor: any) => {
          const lower = doctor.designation.toLowerCase()
          return !lower.includes('junior resident') && !lower.includes('senior resident')
        })
        .map((doctor: any) => {
          let stdDesig = doctor.designation;
        const lowerDesig = stdDesig.toLowerCase();
        
        // Standardize variations of Professor and HOD, and group regular Professors with them
        if (
          lowerDesig.includes('professor and head') ||
          lowerDesig.includes('professior and head') || 
          lowerDesig.includes('professor & head') || 
          lowerDesig.includes('professor and hod') ||
          lowerDesig === 'professor'
        ) {
          stdDesig = 'Professor & HOD';
        }

        return {
          ...doctor,
          designation: stdDesig,
          department: dept.name,
          departmentId: dept.id
        };
      })
    )
  }, [departments])

  // Get unique designations for filtering
  const designations = useMemo(() => {
    return [...new Set(allDoctors.map((d: any) => d.designation))] as string[]
  }, [allDoctors])

  const filteredDoctors = useMemo(() => {
    return allDoctors.filter((doctor: any) => {
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
    filteredDoctors.forEach((doctor: any) => {
      if (!groups[doctor.designation]) {
        groups[doctor.designation] = []
      }
      groups[doctor.designation].push(doctor)
    })
    return groups
  }, [filteredDoctors])

  const designationOrder = ["Professor & HOD", "Professor", "Associate Professor & HOD", "Associate Professor", "Assistant Professor", "Senior Resident", "Junior Resident"]

  // Sort available designations safely to place known ones first, then alphabetical
  const sortedAvailableDesignations = Object.keys(groupedByDesignation).sort((a, b) => {
    const indexA = designationOrder.indexOf(a)
    const indexB = designationOrder.indexOf(b)
    if (indexA !== -1 && indexB !== -1) return indexA - indexB
    if (indexA !== -1) return -1
    if (indexB !== -1) return 1
    return a.localeCompare(b)
  })

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <Header />
      <main className="flex-1 pb-20">
        
        {/* Dynamic Hero Section */}
        <section className="relative pt-12 pb-24 md:pt-16 md:pb-28 overflow-hidden bg-white dark:bg-slate-900 border-b border-border">
          {/* Subtle animated background gradients */}
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[600px] h-[600px] bg-gradient-to-bl from-primary/20 via-accent/5 to-transparent rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[500px] h-[500px] bg-gradient-to-tr from-accent/20 via-primary/5 to-transparent rounded-full blur-[100px] pointer-events-none" />
          
          <FadeIn className="relative mx-auto max-w-7xl px-4 z-10">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6 backdrop-blur-sm">
                <Activity className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold text-primary uppercase tracking-widest">
                  Our Specialists
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-foreground tracking-tight">
                Meet Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Medical Team</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                A directory of highly qualified, dedicated, and experienced medical professionals serving at JBMGMC Nandurbar.
              </p>
            </div>
          </FadeIn>
        </section>

        {/* Floating Glassmorphic Filter Bar */}
        <section className="relative z-30 -mt-16 mb-12">
          <div className="mx-auto max-w-5xl px-4">
            <SlideIn direction="up">
              <div className="bg-background/80 dark:bg-slate-900/80 backdrop-blur-xl border border-border/60 shadow-xl shadow-black/5 dark:shadow-black/40 p-4 md:p-6 rounded-3xl">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  
                  {/* Search Input */}
                  <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search by name, qualification, or department..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 h-14 bg-muted/50 border-transparent hover:bg-muted focus:bg-background focus:border-primary/50 focus:ring-2 focus:ring-primary/20 rounded-2xl text-base transition-all"
                    />
                  </div>
                  
                  <div className="flex w-full md:w-auto gap-4">
                    {/* Department Select */}
                    <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                      <SelectTrigger className="h-14 w-full md:w-[220px] bg-muted/50 border-transparent hover:bg-muted focus:ring-2 focus:ring-primary/20 rounded-2xl font-medium">
                        <SelectValue placeholder="All Departments" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl max-h-[300px]">
                        <SelectItem value="all">All Departments</SelectItem>
                        {departments.map((dept: any) => (
                          <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Designation Select */}
                    <Select value={selectedDesignation} onValueChange={setSelectedDesignation}>
                      <SelectTrigger className="h-14 w-full md:w-[200px] bg-muted/50 border-transparent hover:bg-muted focus:ring-2 focus:ring-primary/20 rounded-2xl font-medium">
                        <SelectValue placeholder="All Designations" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl max-h-[300px]">
                        <SelectItem value="all">All Designations</SelectItem>
                        {designations.map(des => (
                          <SelectItem key={des} value={des}>{des}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </SlideIn>
          </div>
        </section>

        {/* Doctors Directory Grid */}
        <section className="relative z-10 px-4">
          <div className="mx-auto max-w-7xl">
            
            {/* Results count text */}
            <div className="flex items-center justify-between mb-8 px-2">
              <p className="text-sm font-medium text-muted-foreground bg-muted/50 px-4 py-2 rounded-full border border-border/50">
                Found <span className="font-bold text-foreground">{filteredDoctors.length}</span> doctors
                {searchQuery && <span> matching <span className="text-foreground">"{searchQuery}"</span></span>}
              </p>
            </div>

            {/* Empty State */}
            {filteredDoctors.length === 0 ? (
              <div className="text-center py-24 bg-card border border-border/50 border-dashed rounded-3xl mx-auto max-w-2xl shadow-sm">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                  <User className="h-10 w-10 text-muted-foreground/50" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">No doctors found</h3>
                <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
                  We couldn't find any medical professionals matching your current filters.
                </p>
                <Button
                  variant="default"
                  size="lg"
                  className="rounded-full px-8 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedDepartment("all")
                    setSelectedDesignation("all")
                  }}
                >
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div className="space-y-8">
                {sortedAvailableDesignations.map(designation => {
                  const doctors = groupedByDesignation[designation]
                  if (!doctors || doctors.length === 0) return null
                  
                  return (
                    <div key={designation} className="relative scroll-mt-24" id={`group-${designation.replace(/\s+/g, '-')}`}>
                      {/* Sticky Group Header */}
                      <div className="sticky top-[72px] z-20 py-3 mb-4 backdrop-blur-md bg-slate-50/90 dark:bg-slate-950/90 border-b border-border/50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-1.5 bg-gradient-to-b from-primary to-accent rounded-full" />
                          <h2 className="text-2xl font-bold text-foreground tracking-tight">{designation}</h2>
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground bg-muted px-3 py-1 rounded-full">
                          {doctors.length} Members
                        </span>
                      </div>

                      {/* Doctor Cards Grid */}
                      <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {doctors.map((doctor: any, index: number) => (
                          <StaggerItem
                            key={`${doctor.name}-${doctor.departmentId}-${index}`}
                            className="group relative flex flex-col bg-card rounded-3xl border border-border/50 shadow-sm hover:shadow-xl hover:-translate-y-2 hover:border-primary/30 transition-all duration-300 overflow-hidden"
                          >
                            {/* Card Decorative Header */}
                            <div className="h-20 bg-gradient-to-br from-muted/50 to-muted/10 w-full absolute top-0 left-0 z-0" />
                            
                            <div className="p-6 relative z-10 flex flex-col h-full">
                              {/* Avatar & Name */}
                              <div className="flex items-center gap-4 mb-5">
                                <div className="shrink-0 h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                                  <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary to-accent">
                                    {formatDoctorName(doctor.name).split(' ').slice(-1)[0][0]}
                                  </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-bold text-lg text-foreground truncate group-hover:text-primary transition-colors" title={doctor.name}>
                                    {formatDoctorName(doctor.name)}
                                  </h3>
                                  <p className="text-accent text-[10px] font-semibold truncate bg-accent/10 inline-flex px-2 py-0.5 rounded-md mt-1">
                                    {doctor.designation}
                                  </p>
                                </div>
                              </div>
                              
                              {/* Details */}
                              <div className="flex-1 space-y-3 mt-2">
                                <div className="flex items-start gap-3">
                                  <div className="mt-0.5 w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0">
                                    <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground mb-0.5">Department</p>
                                    <Link 
                                      href={`/departments/${doctor.departmentId}`}
                                      className="text-sm font-medium text-foreground hover:text-primary transition-colors line-clamp-1"
                                      title={doctor.department}
                                    >
                                      {doctor.department}
                                    </Link>
                                  </div>
                                </div>
                                
                                <div className="flex items-start gap-3">
                                  <div className="mt-0.5 w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0">
                                    <GraduationCap className="h-3.5 w-3.5 text-muted-foreground" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground mb-0.5">Qualification</p>
                                    <p className="text-sm font-medium text-foreground line-clamp-1" title={doctor.qualification}>
                                      {doctor.qualification}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-start gap-3">
                                  <div className="mt-0.5 w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0">
                                    <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground mb-0.5">Experience</p>
                                    <p className="text-sm font-medium text-foreground line-clamp-1" title={doctor.experience}>
                                      {doctor.experience}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Bottom Action */}
                              <div className="mt-6 pt-4 border-t border-border/50 flex justify-end">
                                <Link href={`/departments/${doctor.departmentId}`} className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-wider">
                                  View Department
                                  <ExternalLink className="w-3 h-3" />
                                </Link>
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

      </main>
      <Footer />
    </div>
  )
}
