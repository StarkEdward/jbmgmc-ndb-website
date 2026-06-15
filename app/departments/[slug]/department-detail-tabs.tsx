"use client"

import { useState, useEffect, useRef } from "react"
import { 
  CheckCircle, User, GraduationCap, Briefcase, Mail, FileText, 
  FileDown, Award, Target, BookOpen, ShieldAlert, ClipboardList, 
  Bookmark, ChevronRight, Database, Search, Activity, Microscope, 
  Sparkles, Building2, Users, ArrowRight, BookMarked, Library, Stethoscope, Star
} from "lucide-react"
import { Doctor, Department, NonTeachingStaff, DesignationDuty, DoctorPublications, Publication } from "@/lib/db"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface DepartmentDetailTabsProps {
  department: Department
}

export function DepartmentDetailTabs({ department }: DepartmentDetailTabsProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [pubSearch, setPubSearch] = useState("")

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BookOpen, color: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-500/20' }
  ]
  if (department.doctors && department.doctors.length > 0) {
    tabs.push({ id: 'faculty', label: 'Faculty & Staff', icon: Users, color: 'from-teal-500 to-emerald-600', shadow: 'shadow-teal-500/20' })
  }
  if (department.duties && department.duties.length > 0) {
    tabs.push({ id: 'duties', label: 'Responsibilities', icon: ClipboardList, color: 'from-purple-500 to-pink-600', shadow: 'shadow-purple-500/20' })
  }
  if (department.facilities && department.facilities.length > 0) {
    tabs.push({ id: 'facilities', label: 'Facilities', icon: Building2, color: 'from-amber-500 to-orange-600', shadow: 'shadow-amber-500/20' })
  }
  if (department.researchPublications && department.researchPublications.length > 0) {
    tabs.push({ id: 'research', label: 'Research', icon: Award, color: 'from-rose-500 to-red-600', shadow: 'shadow-rose-500/20' })
  }
  if (department.equipmentDetails && department.equipmentDetails.length > 0) {
    tabs.push({ id: 'equipments', label: 'Equipments', icon: Stethoscope, color: 'from-sky-500 to-blue-600', shadow: 'shadow-sky-500/20' })
  }
  if (department.libraryBooks && department.libraryBooks.length > 0) {
    tabs.push({ id: 'library', label: 'Library', icon: Library, color: 'from-amber-500 to-orange-600', shadow: 'shadow-amber-500/20' })
  }

  const hod = department.doctors?.find(d => d.designation?.toLowerCase().includes('hod') || d.designation?.toLowerCase().includes('head'))

  const isPublicationObject = (pub: any): pub is Publication => {
    return pub && typeof pub === 'object' && 'title' in pub
  }

  const getFilteredPublications = (drPub: DoctorPublications) => {
    if (!pubSearch) return drPub.publications
    return drPub.publications.filter(pub => {
      const title = isPublicationObject(pub) ? pub.title : String(pub)
      return String(title).toLowerCase().includes((pubSearch || '').toLowerCase())
    })
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveTab(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col md:flex-row gap-4 md:p-6 lg:gap-4 md:p-6 w-full relative items-start">
      
      {/* Tab Switcher Bar - Premium Glassmorphic Column */}
      <div className="md:w-56 shrink-0 sticky top-16 md:top-24 h-fit flex flex-row md:flex-col gap-2 z-30 overflow-x-auto scrollbar-hide pb-2 md:pb-0 bg-slate-50/90 dark:bg-slate-950/90 md:bg-transparent md:dark:bg-transparent backdrop-blur-md md:backdrop-blur-none border-b md:border-none border-slate-200/50 dark:border-slate-800/50 -mx-4 px-4 md:mx-0 md:px-0 pt-2 md:pt-0">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => {
                const el = document.getElementById(tab.id);
                if (el) {
                  const y = el.getBoundingClientRect().top + window.scrollY - 140;
                  window.scrollTo({ top: y, behavior: 'smooth' });
                }
              }}
              className={`relative flex items-center gap-3 md:gap-4 px-3 py-2 md:px-4 md:py-3 rounded-xl transition-all duration-500 w-fit md:w-full text-left overflow-hidden group whitespace-nowrap shrink-0 ${
                isActive 
                  ? 'bg-white dark:bg-slate-900 shadow-lg md:shadow-xl scale-[1.02] border-transparent' 
                  : 'bg-slate-50/50 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md border border-slate-200/50 dark:border-slate-700/50'
              }`}
            >
              {/* Active Background Glow */}
              {isActive && (
                <div className={`absolute inset-0 bg-gradient-to-r ${tab.color} opacity-[0.03] dark:opacity-10`} />
              )}
              
              <div className={`relative z-10 flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl transition-all duration-500 ${
                isActive 
                  ? `bg-gradient-to-br ${tab.color} text-white shadow-lg ${tab.shadow}` 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:scale-110 group-hover:text-slate-800 dark:group-hover:text-slate-200'
              }`}>
                <Icon className={`w-4 h-4 md:w-6 md:h-6 ${isActive ? 'animate-pulse' : ''}`} />
              </div>
              
              <span className={`relative z-10 font-bold transition-colors ${
                isActive ? 'text-slate-900 dark:text-white text-sm md:text-base' : 'text-slate-600 dark:text-slate-400 text-xs md:text-sm'
              }`}>
                {tab.label}
              </span>

              {isActive && (
                <div className="absolute right-2 md:right-4 w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-slate-800 dark:bg-white animate-ping" />
              )}
            </button>
          )
        })}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col gap-12 pb-24">
        
        {/* ==================== 1. OVERVIEW TAB ==================== */}
        <section id="overview" className="scroll-mt-32">
          <div className="space-y-6 animate-in slide-in-from-bottom-8 fade-in duration-700">
            
            {/* Top Grid: HOD & Quick Stats */}
            <div className="grid lg:grid-cols-12 gap-4 md:p-6">
              
              {/* HOD Profile Card - Premium Design */}
              {hod ? (
                <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-5 shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-colors duration-700" />
                  <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-4 md:p-6">
                    <div className="shrink-0 relative">
                      <div className="absolute inset-0 bg-indigo-500 rounded-full blur-xl opacity-20" />
                      <div className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-800 shadow-2xl relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                        {hod.photo ? (
                          <img src={hod.photo} alt={hod.name} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-10 h-10 text-slate-400 m-auto mt-9" />
                        )}
                      </div>
                      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-0.5 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-full shadow-lg border border-slate-100 dark:border-slate-700">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    
                    <div className="text-center sm:text-left flex-1 mt-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest mb-3">
                        <Award className="w-3.5 h-3.5" />
                        Head of Department
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-slate-800 dark:text-white mb-2">{hod.name}</h3>
                      <p className="text-slate-600 dark:text-slate-300 font-medium">{hod.qualification}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 flex items-center justify-center sm:justify-start gap-2">
                        <Briefcase className="w-4 h-4" />
                        {hod.experience}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-5 shadow-xl flex items-center justify-center">
                  <p className="text-slate-500">HOD Information not available</p>
                </div>
              )}

              {/* Quick Stats Grid */}
              <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden group">
                  <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
                    <Users className="w-24 h-24" />
                  </div>
                  <h4 className="text-indigo-100 font-medium mb-1">Total Faculty</h4>
                  <p className="text-2xl md:text-3xl font-bold">{department.doctors?.length || 0}</p>
                </div>
                <div className="bg-gradient-to-br from-rose-500 to-orange-500 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden group">
                  <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
                    <Activity className="w-24 h-24" />
                  </div>
                  <h4 className="text-rose-100 font-medium mb-1">Labs / Facilities</h4>
                  <p className="text-2xl md:text-3xl font-bold">{department.facilities?.length || 0}</p>
                </div>
                <div className="col-span-2 bg-slate-900 dark:bg-slate-800 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden group hover:shadow-2xl transition-all">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-400 to-indigo-500" />
                  <div className="flex items-center justify-between z-10 relative">
                    <div>
                      <h4 className="text-slate-400 font-medium mb-1">Curriculum & Syllabus</h4>
                      <p className="text-sm text-slate-300">As per NMC guidelines</p>
                    </div>
                    {department.curriculumLink ? (
                      <a href={department.curriculumLink} target="_blank" rel="noopener noreferrer" className="p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-white backdrop-blur-sm">
                        <FileDown className="w-6 h-6" />
                      </a>
                    ) : (
                      <div className="p-4 bg-white/5 rounded-xl text-slate-500">
                        <FileText className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Department Intro */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 md:p-8 border border-slate-200/60 dark:border-slate-800/60 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-[0.02] dark:opacity-5">
                <BookOpen className="w-48 h-48" />
              </div>
              <h2 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 relative z-10 flex items-center gap-3">
                <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
                About the Department
              </h2>
              <div className="relative z-10 font-medium text-slate-600 dark:text-slate-300">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h3: ({node, ...props}) => (
                      <h3 className="text-2xl font-black mt-10 mb-6 text-slate-800 dark:text-slate-100 flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                        <BookOpen className="w-6 h-6 text-indigo-500" />
                        {props.children}
                      </h3>
                    ),
                    h4: ({node, ...props}) => (
                      <div className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-900 mt-8 mb-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-3">
                        <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                          <GraduationCap className="w-5 h-5 text-indigo-500" />
                        </div>
                        <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200 m-0">
                          {props.children}
                        </h4>
                      </div>
                    ),
                    p: ({node, ...props}) => (
                      <p className="mb-5 leading-relaxed text-slate-600 dark:text-slate-300 text-[15px]">
                        {props.children}
                      </p>
                    ),
                    ul: ({node, ...props}) => (
                      <ul className="grid sm:grid-cols-2 gap-3 my-6">
                        {props.children}
                      </ul>
                    ),
                    li: ({node, ...props}) => (
                      <li className="flex items-start gap-3 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
                        <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                        <span className="text-[15px] font-medium leading-snug pt-0.5 text-slate-700 dark:text-slate-200">
                          {props.children}
                        </span>
                      </li>
                    ),
                    a: ({node, ...props}) => (
                      <a {...props} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors underline-none">
                        <FileDown className="w-4 h-4" />
                        {props.children}
                      </a>
                    )
                  }}
                >
                  {department.fullDescription}
                </ReactMarkdown>
              </div>
            </div>

            {/* Goals & Objectives Grid */}
            <div className="grid lg:grid-cols-2 gap-4 md:p-6 items-start">
              {/* Goals */}
              {department.goals && department.goals.length > 0 && (
                <div className="bg-gradient-to-b from-sky-50 to-white dark:from-slate-800/50 dark:to-slate-900 rounded-3xl p-5 border border-sky-100 dark:border-slate-800 shadow-lg">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-sky-500 text-white rounded-2xl shadow-lg shadow-sky-500/30">
                      <Target className="w-6 h-6" />
                    </div>
                    <h2 className="text-lg md:text-xl font-bold text-slate-800 dark:text-white">Department Goals</h2>
                  </div>
                  <div className="space-y-6">
                    {department.goals.map((goal, idx) => (
                      <div key={idx} className="flex gap-4 group">
                        <div className="shrink-0 w-10 h-10 rounded-full bg-white dark:bg-slate-800 border-2 border-sky-200 dark:border-sky-900 flex items-center justify-center text-sky-600 dark:text-sky-400 font-black shadow-sm group-hover:scale-110 group-hover:bg-sky-500 group-hover:text-white group-hover:border-sky-500 transition-all">
                          {idx + 1}
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed pt-1.5">{goal}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Objectives */}
              {department.objectives && department.objectives.length > 0 && (
                <div className="bg-gradient-to-b from-indigo-50 to-white dark:from-slate-800/50 dark:to-slate-900 rounded-3xl p-5 border border-indigo-100 dark:border-slate-800 shadow-lg">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-indigo-500 text-white rounded-2xl shadow-lg shadow-indigo-500/30">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <h2 className="text-lg md:text-xl font-bold text-slate-800 dark:text-white">Educational Objectives</h2>
                  </div>
                  <div className="space-y-4">
                    {department.objectives.map((obj, idx) => (
                      <div key={idx} className="flex items-start gap-4 p-3 rounded-xl hover:bg-white dark:hover:bg-slate-800 hover:shadow-md transition-all border border-transparent hover:border-indigo-100 dark:hover:border-slate-700">
                        <div className="shrink-0 mt-1">
                          <CheckCircle className="w-6 h-6 text-indigo-500" />
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 font-medium">{obj}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Academic Activities Block */}
            {department.academicActivities && department.academicActivities.length > 0 && (
              <div className="bg-gradient-to-b from-blue-50 to-white dark:from-slate-800/50 dark:to-slate-900 rounded-3xl p-5 border border-blue-100 dark:border-slate-800 shadow-lg mt-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-blue-500 text-white rounded-2xl shadow-lg shadow-blue-500/30">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h2 className="text-lg md:text-xl font-bold text-slate-800 dark:text-white">Academic Activities</h2>
                </div>
                <div className="space-y-4">
                  {department.academicActivities.map((activity, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-3 rounded-xl hover:bg-white dark:hover:bg-slate-800 hover:shadow-md transition-all border border-transparent hover:border-blue-100 dark:hover:border-slate-700">
                      <div className="shrink-0 mt-1">
                        <CheckCircle className="w-6 h-6 text-blue-500" />
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 font-medium">{activity}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Skills */}
            {department.skills && department.skills.length > 0 && (
              <div>
                <h2 className="text-lg md:text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-3 px-2">
                  <Award className="w-6 h-6 text-amber-500" />
                  Key Competencies & Skills
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {department.skills.map((skill, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Star className="w-6 h-6" />
                      </div>
                      <p className="text-slate-700 dark:text-slate-200 font-semibold leading-snug">{skill}</p>
                      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        Competency Required
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ==================== 2. FACULTY & STAFF TAB ==================== */}
        {department.doctors && department.doctors.length > 0 && (
        <section id="faculty" className="scroll-mt-32">
          <div className="space-y-6 animate-in slide-in-from-bottom-8 fade-in duration-700">
            
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100">Teaching Faculty</h2>
                  <p className="text-slate-500 dark:text-slate-400 mt-1">Directory of professors and medical officers</p>
                </div>
                <div className="p-3 bg-emerald-500/10 rounded-2xl hidden sm:block">
                  <Users className="h-8 w-8 text-emerald-500" />
                </div>
              </div>

              {/* Faculty Tiles Layout */}
              <div className="mb-6 space-y-6">
                {(() => {
                  const highlightedDoc = department.doctors.find(d => d.designation?.toLowerCase().includes('hod') || d.designation?.toLowerCase().includes('head')) || department.doctors.find(d => d.designation?.toLowerCase().includes('professor'));
                  const otherDocs = department.doctors.filter(d => d !== highlightedDoc);

                  return (
                    <>
                      {/* Prominent HOD Tile */}
                      {highlightedDoc && (
                        <div className="group relative bg-gradient-to-br from-indigo-50/50 to-white dark:from-slate-800/80 dark:to-slate-900 rounded-3xl border border-indigo-200 dark:border-indigo-500/30 p-5 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col md:flex-row items-center gap-4 md:p-6 md:gap-12 w-full">
                          {/* Decorative Background */}
                          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 blur-3xl rounded-full group-hover:bg-indigo-500/20 transition-colors duration-700 pointer-events-none" />
                          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 blur-2xl rounded-full group-hover:bg-purple-500/20 transition-colors duration-700 pointer-events-none" />
                          
                          {/* Round Photo */}
                          <div className="relative shrink-0 z-10">
                            <div className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-white dark:border-slate-800 shadow-2xl overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 flex items-center justify-center transform group-hover:scale-105 transition-transform duration-500">
                              {highlightedDoc.photo ? (
                                <img src={highlightedDoc.photo} alt={highlightedDoc.name} className="w-full h-full object-cover" />
                              ) : (
                                <User className="w-12 h-12 text-indigo-300 dark:text-indigo-500/50" />
                              )}
                            </div>
                            <div className="absolute -bottom-2 right-4 bg-indigo-500 text-white p-2.5 rounded-full shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
                              <Award className="w-6 h-6" />
                            </div>
                          </div>
                          
                          {/* HOD Details */}
                          <div className="relative z-10 flex-1 text-center md:text-left">
                            <div className="inline-flex px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase shadow-sm bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 mb-4 border border-indigo-200 dark:border-indigo-500/30">
                              {highlightedDoc.designation}
                            </div>
                            <h3 className="text-2xl md:text-3xl md:text-2xl md:text-3xl font-bold mb-2 text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                              {highlightedDoc.name}
                            </h3>
                            <p className="text-base font-medium text-slate-500 dark:text-slate-400 mb-6">{highlightedDoc.qualification}</p>
                            
                            <div className="flex flex-wrap justify-center md:justify-start gap-4 border-t border-slate-200 dark:border-slate-700 pt-6">
                              {highlightedDoc.experience && (
                                <div className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 group-hover:border-indigo-200 transition-colors">
                                  <Briefcase className="w-5 h-5 text-indigo-500" />
                                  {highlightedDoc.experience}
                                </div>
                              )}
                              {highlightedDoc.regNo && (
                                <div className="flex items-center gap-2 text-sm font-mono text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 group-hover:border-indigo-200 transition-colors">
                                  <ClipboardList className="w-5 h-5 text-purple-500" />
                                  Reg: {highlightedDoc.regNo}
                                </div>
                              )}
                              {highlightedDoc.email && (
                                <a href={`mailto:${highlightedDoc.email}`} className="flex items-center gap-2 text-sm font-medium text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10 px-4 py-2 rounded-xl hover:bg-sky-100 dark:hover:bg-sky-500/20 transition-colors">
                                  <Mail className="w-5 h-5" />
                                  {highlightedDoc.email}
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Standard Tiles for Other Doctors */}
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:p-6 lg:gap-4 md:p-6 pt-4">
                        {otherDocs.map((doc, idx) => (
                          <div key={idx} className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-5 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full overflow-hidden">
                            {/* Card Background Glow */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-3xl rounded-full group-hover:bg-emerald-500/10 transition-colors duration-500 pointer-events-none" />

                            <div className="flex items-start gap-5 mb-5 relative z-10">
                              {/* Standard Round Photo */}
                              <div className="relative shrink-0">
                                <div className="w-12 h-12 rounded-full border-2 border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                                  {doc.photo ? (
                                    <img src={doc.photo} alt={doc.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <User className="w-8 h-8 text-slate-400" />
                                  )}
                                </div>
                              </div>
                              
                              <div className="pt-2">
                                <div className="inline-block px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30 mb-2">
                                  {doc.designation}
                                </div>
                                <h3 className="text-lg md:text-xl font-bold leading-snug text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                  {doc.name}
                                </h3>
                              </div>
                            </div>

                            <div className="relative z-10 flex flex-col flex-1">
                              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-5 pl-1">{doc.qualification}</p>
                              
                              <div className="mt-auto space-y-2.5 border-t border-slate-100 dark:border-slate-800 pt-5">
                                {doc.experience && (
                                  <div className="flex items-center gap-3 group/item">
                                    <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0 group-hover/item:bg-emerald-50 dark:group-hover/item:bg-emerald-500/10 transition-colors">
                                      <Briefcase className="w-4 h-4 text-slate-400 group-hover/item:text-emerald-500 transition-colors" />
                                    </div>
                                    <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{doc.experience}</span>
                                  </div>
                                )}
                                
                                {doc.regNo && (
                                  <div className="flex items-center gap-3 group/item">
                                    <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0 group-hover/item:bg-teal-50 dark:group-hover/item:bg-teal-500/10 transition-colors">
                                      <ClipboardList className="w-4 h-4 text-slate-400 group-hover/item:text-teal-500 transition-colors" />
                                    </div>
                                    <span className="text-sm font-mono text-slate-500 dark:text-slate-400">Reg: {doc.regNo}</span>
                                  </div>
                                )}

                                {doc.email && (
                                  <div className="flex items-center gap-3 group/item">
                                    <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0 group-hover/item:bg-sky-50 dark:group-hover/item:bg-sky-500/10 transition-colors">
                                      <Mail className="w-4 h-4 text-slate-400 group-hover/item:text-sky-500 transition-colors" />
                                    </div>
                                    <a href={`mailto:${doc.email}`} className="text-sm font-medium text-sky-600 hover:text-sky-700 dark:text-sky-400 truncate">
                                      {doc.email}
                                    </a>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )
                })()}
              </div>
            </div>

            {/* Non-Teaching Staff Grid */}
            {department.nonTeachingStaff && department.nonTeachingStaff.length > 0 && (
              <div className="pt-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-amber-500/10 rounded-2xl">
                    <Briefcase className="h-8 w-8 text-amber-500" />
                  </div>
                  <div>
                    <h2 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100">Non-Teaching Staff</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Support and administrative team members</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:p-6">
                  {department.nonTeachingStaff.map((staff, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex items-center gap-5 hover:shadow-lg hover:border-amber-500/30 transition-all">
                      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 border-2 border-transparent">
                        <User className="w-6 h-6 text-slate-400" />
                      </div>
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-1">{staff.post}</div>
                        <div className="font-bold text-slate-800 dark:text-slate-100 text-lg leading-tight">{staff.name}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
        )}

        {/* ==================== 3. DUTIES TAB ==================== */}
        {department.duties && department.duties.length > 0 && (
        <section id="duties" className="scroll-mt-32">
          <div className="space-y-6 animate-in slide-in-from-bottom-8 fade-in duration-700">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-purple-500/10 rounded-2xl">
                <ClipboardList className="h-8 w-8 text-purple-500" />
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100">Duties & Responsibilities</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Detailed responsibilities by designation</p>
              </div>
            </div>

            <div className="grid gap-4 md:p-6">
              {department.duties.map((duty, idx) => {
                const isHOD = duty.designation.toLowerCase().includes('hod') || duty.designation.toLowerCase().includes('head');
                return (
                  <div key={idx} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-xl overflow-hidden relative">
                    {/* Top gradient border */}
                    <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${isHOD ? 'from-purple-500 to-pink-500' : 'from-indigo-500 to-blue-500'}`} />
                    
                    <div className="p-5 md:p-8">
                      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                        <div className={`p-3 rounded-xl ${isHOD ? 'bg-purple-100 text-purple-600 dark:bg-purple-500/20' : 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20'}`}>
                          <ShieldAlert className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg md:text-xl font-bold text-slate-800 dark:text-white">{duty.designation}</h3>
                      </div>
                      
                      <div className="grid gap-4">
                        {duty.responsibilities.map((resp, rIdx) => (
                          <div key={rIdx} className="flex gap-4 group items-start bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl hover:bg-white dark:hover:bg-slate-800 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 cursor-default">
                            <div className="mt-0.5 shrink-0">
                              <div className={`p-1 rounded-full ${isHOD ? 'bg-purple-100 text-purple-600 dark:bg-purple-500/20 group-hover:bg-purple-500' : 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 group-hover:bg-indigo-500'} group-hover:scale-110 group-hover:text-white transition-all duration-300`}>
                                <ChevronRight className="w-4 h-4" />
                              </div>
                            </div>
                            <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed pt-0.5">{resp}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
        )}

        {/* ==================== 4. FACILITIES TAB ==================== */}
        {department.facilities && department.facilities.length > 0 && (
        <section id="facilities" className="scroll-mt-32">
          <div className="space-y-6 animate-in slide-in-from-bottom-8 fade-in duration-700">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-amber-500/10 rounded-2xl">
                <Building2 className="h-8 w-8 text-amber-500" />
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100">Labs & Facilities</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Infrastructure and laboratory services available</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 md:p-6">
              {department.facilities.map((facility, idx) => {
                const isLab = facility.toLowerCase().includes('lab');
                const isResearch = facility.toLowerCase().includes('research');
                const isMuseum = facility.toLowerCase().includes('museum');
                return (
                  <div key={idx} className="group bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all relative overflow-hidden flex flex-col justify-between min-h-[160px]">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-5">
                        {isResearch ? <Microscope className="w-6 h-6" /> : 
                         isMuseum ? <Database className="w-6 h-6" /> : 
                         <Building2 className="w-6 h-6" />}
                      </div>
                      <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg leading-snug">{facility}</h3>
                    </div>
                    
                    {isLab && (
                      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                          <CheckCircle className="w-3.5 h-3.5" /> Fully Equipped
                        </span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Regulatory Block */}
            <div className="mt-12 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-5 flex items-start sm:items-center gap-4 md:p-6">
              <div className="p-4 bg-amber-500 text-white rounded-full shrink-0 shadow-lg shadow-amber-500/20">
                <Bookmark className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-bold text-amber-900 dark:text-amber-100 mb-2">NMC Compliance</h3>
                <p className="text-amber-700 dark:text-amber-400/80 font-medium">All laboratories, demonstration rooms, and museums are built and equipped stringently as per the norms defined by the National Medical Commission (NMC).</p>
              </div>
            </div>
          </div>
        </section>
        )}

        {/* ==================== 5. RESEARCH TAB ==================== */}
        {department.researchPublications && department.researchPublications.length > 0 && (
        <section id="research" className="scroll-mt-32">
          <div className="space-y-6 animate-in slide-in-from-bottom-8 fade-in duration-700">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 md:p-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-rose-500/10 rounded-2xl">
                  <Award className="h-8 w-8 text-rose-500" />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100">Research & Publications</h2>
                  <p className="text-slate-500 dark:text-slate-400 mt-1">Scientific papers by faculty</p>
                </div>
              </div>
              
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search publications..." 
                  value={pubSearch}
                  onChange={(e) => setPubSearch(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full py-3 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/50 shadow-sm transition-all"
                />
              </div>
            </div>

            <div className="space-y-6">
              {department.researchPublications.map((drPub, idx) => {
                const filteredPubs = getFilteredPublications(drPub)
                if (filteredPubs.length === 0) return null

                // Detect if it's the complex Copernicus table format (like Dr. Ramteke)
                const isComplexFormat = filteredPubs.length > 0 && isPublicationObject(filteredPubs[0]) && 'journal' in filteredPubs[0]

                return (
                  <div key={idx} className="relative pl-6 sm:pl-10 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-1 before:bg-rose-100 dark:before:bg-rose-900/30 before:rounded-full">
                    {/* Author Sticky Header */}
                    <div className="sticky top-24 z-20 mb-6 -ml-10 sm:-ml-14 flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-rose-500 border-4 border-slate-50 dark:border-slate-950 flex items-center justify-center shrink-0 shadow-lg">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 py-3 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm inline-flex items-center gap-3">
                        <h3 className="text-lg md:text-xl font-black text-slate-800 dark:text-white">{drPub.doctorName}</h3>
                        <span className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold">
                          {filteredPubs.length} Papers
                        </span>
                      </div>
                    </div>

                    {isComplexFormat ? (
                      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-xl overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                <th className="py-4 px-6 font-bold text-slate-700 dark:text-slate-300 text-xs uppercase tracking-wider">Title of Research Article</th>
                                <th className="py-4 px-6 font-bold text-slate-700 dark:text-slate-300 text-xs uppercase tracking-wider">Journal Name</th>
                                <th className="py-4 px-6 font-bold text-slate-700 dark:text-slate-300 text-xs uppercase tracking-wider">Indexing</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                              {filteredPubs.map((pub, pIdx) => {
                                if (!isPublicationObject(pub)) return null;
                                return (
                                  <tr key={pIdx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="py-5 px-6">
                                      <div className="flex gap-3 items-start">
                                        <BookOpen className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                                        <span className="font-bold text-slate-800 dark:text-slate-200 leading-snug">{pub.title}</span>
                                      </div>
                                    </td>
                                    <td className="py-5 px-6 font-medium text-slate-600 dark:text-slate-400 italic">
                                      {pub.journal}
                                    </td>
                                    <td className="py-5 px-6">
                                      <div className="flex flex-col gap-1">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider w-fit">
                                          {pub.indexed}
                                        </span>
                                        <span className="text-xs text-slate-500 font-medium ml-1">{pub.database}</span>
                                      </div>
                                    </td>
                                  </tr>
                                )
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      <div className="grid gap-4">
                        {filteredPubs.map((pub, pIdx) => (
                          <div key={pIdx} className="bg-white dark:bg-slate-900 rounded-[1.5rem] border border-slate-200/60 dark:border-slate-800/60 p-5 shadow-sm hover:shadow-md transition-all flex items-start gap-4 group">
                            <div className="shrink-0 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-black text-slate-400 group-hover:bg-rose-100 group-hover:text-rose-600 transition-colors mt-0.5">
                              {pIdx + 1}
                            </div>
                            <p className="font-medium text-slate-700 dark:text-slate-300 leading-relaxed pt-1">
                              {String(pub)}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </section>
        )}

        {/* ==================== 6. EQUIPMENTS TAB ==================== */}
        {department.equipmentDetails && department.equipmentDetails.length > 0 && (
        <section id="equipments" className="scroll-mt-32">
          <div className="space-y-6 animate-in slide-in-from-bottom-8 fade-in duration-700">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-sky-500/10 rounded-2xl">
                <Stethoscope className="h-8 w-8 text-sky-500" />
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100">Equipment Inventory</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Detailed list of available medical and laboratory equipments</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:p-6">
              {department.equipmentDetails.map((eq, i) => (
                <div key={i} className="group p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-lg hover:shadow-2xl hover:border-sky-500/30 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[200px]">
                  <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-10 group-hover:scale-110 transition-all duration-500">
                    <Stethoscope className="w-24 h-24 text-sky-500 transform rotate-12" />
                  </div>
                  
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-start justify-between gap-4 mb-6">
                      <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl group-hover:bg-sky-50 dark:group-hover:bg-sky-500/10 transition-colors">
                        <Stethoscope className="w-6 h-6 text-slate-400 group-hover:text-sky-500 transition-colors" />
                      </div>
                      
                      <span className={`px-3 py-1.5 text-xs font-bold rounded-full shadow-sm border backdrop-blur-sm ${
                        String(eq.available || '').toLowerCase() === 'not available' || eq.available === '0' 
                          ? 'bg-rose-50/80 border-rose-200 text-rose-700 dark:bg-rose-500/20 dark:border-rose-500/30 dark:text-rose-400' 
                          : 'bg-emerald-50/80 border-emerald-200 text-emerald-700 dark:bg-emerald-500/20 dark:border-emerald-500/30 dark:text-emerald-400'
                      }`}>
                        {eq.available || 'Available'}
                      </span>
                    </div>
                    
                    <h3 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100 mb-2 leading-snug group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                      {eq.name}
                    </h3>
                    
                    <div className="flex items-center gap-2 mt-auto pt-5 border-t border-slate-100 dark:border-slate-800/60">
                      <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Required:</span>
                      <span className="text-sm font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">{eq.required}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        )}

        {/* ==================== 7. LIBRARY TAB ==================== */}
        {department.libraryBooks && department.libraryBooks.length > 0 && (
        <section id="library" className="scroll-mt-32">
          <div className="space-y-6 animate-in slide-in-from-bottom-8 fade-in duration-700">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-amber-500/10 rounded-2xl">
                <Library className="h-8 w-8 text-amber-500" />
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100">Department Library</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Reference books and academic resources available</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-amber-100/50 to-orange-50/50 dark:from-amber-900/20 dark:to-orange-900/10 border-b-2 border-amber-200/50 dark:border-amber-800/50">
                      <th className="py-5 px-6 font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-xs w-24">Acc No</th>
                      <th className="py-5 px-6 font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-xs">Author</th>
                      <th className="py-5 px-6 font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-xs">Title</th>
                      <th className="py-5 px-6 font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-xs w-24">Edition</th>
                      <th className="py-5 px-6 font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-xs">Publisher</th>
                      <th className="py-5 px-6 font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-xs w-24">Qty</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {department.libraryBooks.map((book, i) => (
                      <tr key={i} className="group hover:bg-amber-50/50 dark:hover:bg-amber-900/10 transition-colors">
                        <td className="py-4 px-6 font-mono text-sm text-slate-500 dark:text-slate-400">{book.accNo}</td>
                        <td className="py-4 px-6 font-semibold text-slate-700 dark:text-slate-300">{book.author}</td>
                        <td className="py-4 px-6 font-bold text-slate-800 dark:text-slate-200 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">{book.title}</td>
                        <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-400">{book.edition}</td>
                        <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-400">{book.publisher}</td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-1 rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 font-bold text-sm">
                            {book.qty}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
        )}

      </div>
    </div>
  )
}
