'use client'

import React, { useState, useEffect } from 'react'
import { 
  Building2, Search, X, Users, Stethoscope, ArrowRight, ArrowLeft, HelpCircle 
} from 'lucide-react'
import { Department } from '@/lib/db'
import DepartmentEditor from './department-editor'

interface DepartmentsClientProps {
  initialDepartments: Department[]
}

export default function DepartmentsClient({ initialDepartments }: DepartmentsClientProps) {
  const [departments, setDepartments] = useState<Department[]>(initialDepartments)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<'all' | 'pre-clinical' | 'para-clinical' | 'clinical'>('all')
  const [activeDeptId, setActiveDeptId] = useState<string | null>(null)

  // Escape key handler to return to list view
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveDeptId(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleUpdateDepartment = (updatedDept: Department) => {
    setDepartments(prev => prev.map(d => d.id === updatedDept.id ? updatedDept : d))
  }

  // Calculate stats
  const totalDepts = departments.length
  const totalFaculty = departments.reduce((acc, dept) => acc + (dept.doctors?.length || 0), 0)
  const totalSupport = departments.reduce((acc, dept) => acc + (dept.nonTeachingStaff?.length || 0), 0)

  // Filtered departments list
  const filteredDepts = departments.filter((dept) => {
    const matchesCategory = activeCategory === 'all' || dept.category === activeCategory
    const matchesSearch = 
      dept.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (dept.description || '').toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Find active department object
  const activeDept = departments.find(d => d.id === activeDeptId)

  // Color mapping helper for category badges
  const getCategoryStyles = (category?: string) => {
    switch (category) {
      case 'pre-clinical':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-450 border border-blue-500/20'
      case 'para-clinical':
        return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
      case 'clinical':
        return 'bg-teal-500/10 text-teal-650 dark:text-teal-400 border border-teal-500/20'
      default:
        return 'bg-slate-500/10 text-slate-600 border border-slate-500/20'
    }
  }

  // Render Full-Page Editor Workspace if a department is selected
  if (activeDeptId && activeDept) {
    return (
      <div className="space-y-6 animate-fade-in-up pb-20">

        {/* Navigation Sticky Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-slate-100/50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 backdrop-blur-md">
          <div className="space-y-1">
            <button 
              onClick={() => setActiveDeptId(null)}
              className="inline-flex items-center gap-2 text-xs font-bold text-teal-600 dark:text-teal-400 hover:text-teal-500 transition-colors uppercase tracking-wider mb-2 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Departments
            </button>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white leading-tight">
                {activeDept.name}
              </h1>
              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase shrink-0 ${getCategoryStyles(activeDept.category)}`}>
                {activeDept.category ? activeDept.category.replace('-', ' ') : 'N/A'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <Stethoscope className="h-4 w-4 text-indigo-500" /> {activeDept.doctors?.length || 0} Faculty
            </span>
            <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <Users className="h-4 w-4 text-amber-500" /> {activeDept.nonTeachingStaff?.length || 0} Support
            </span>
          </div>
        </div>

        {/* Full-width Editor Workspace Canvas */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden">
          <DepartmentEditor 
            department={activeDept} 
            onUpdate={handleUpdateDepartment} 
          />
        </div>
      </div>
    )
  }

  // Render Roster Directory Grid (Default View)
  return (
    <div className="space-y-8 pb-20">
      
      {/* Title & Description */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">Departments & Faculty</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Manage clinical and academic departments, teaching faculty rosters, support staff, and facilities.
        </p>
      </div>

      {/* Bento Overview Stats Row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Departments</p>
            <h3 className="text-3xl font-extrabold text-slate-850 dark:text-slate-100 mt-1">{totalDepts}</h3>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/10 text-teal-500">
            <Building2 className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Teaching Faculty</p>
            <h3 className="text-3xl font-extrabold text-slate-850 dark:text-slate-100 mt-1">{totalFaculty}</h3>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
            <Stethoscope className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Support & Non-Teaching</p>
            <h3 className="text-3xl font-extrabold text-slate-850 dark:text-slate-100 mt-1">{totalSupport}</h3>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
            <Users className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Roster Controls Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
        
        {/* Category Pills Selector */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {(['all', 'pre-clinical', 'para-clinical', 'clinical'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-teal-500 border-teal-500 text-slate-950 shadow-sm'
                  : 'bg-transparent border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
              }`}
            >
              <span className="capitalize">{cat.replace('-', ' ')}</span>
            </button>
          ))}
        </div>

        {/* Search Input Box */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search departments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 pl-10 pr-4 py-2 text-xs text-slate-800 dark:text-slate-255 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Responsive Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredDepts.map((dept) => (
          <div 
            key={dept.id}
            onClick={() => setActiveDeptId(dept.id)}
            className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md hover:border-slate-350 dark:hover:border-slate-700 hover:scale-[1.01] transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div>
              {/* Header: Name and Category badge */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors leading-tight">
                  {dept.name}
                </h3>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase shrink-0 ${getCategoryStyles(dept.category)}`}>
                  {dept.category ? dept.category.replace('-', ' ') : 'N/A'}
                </span>
              </div>

              {/* Description Snippet */}
              <p className="text-xs text-slate-550 dark:text-slate-400 line-clamp-2 mb-6">
                {dept.description || 'No description provided.'}
              </p>
            </div>

            {/* Footer Counts and Action Button */}
            <div className="flex items-center justify-between border-t border-slate-105 dark:border-slate-800/80 pt-4 mt-auto">
              <div className="flex items-center gap-3 text-[11px] font-bold text-slate-500">
                <span className="flex items-center gap-1">
                  <Stethoscope className="h-3.5 w-3.5 text-indigo-500/80" /> {dept.doctors?.length || 0} Faculty
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5 text-amber-500/80" /> {dept.nonTeachingStaff?.length || 0} Support
                </span>
              </div>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-450 group-hover:bg-teal-500 group-hover:text-slate-950 transition-colors">
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        ))}

        {filteredDepts.length === 0 && (
          <div className="col-span-full py-16 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <HelpCircle className="h-10 w-10 text-slate-350 dark:text-slate-600 mx-auto" />
            <h4 className="mt-4 text-sm font-bold text-slate-700 dark:text-slate-300">No departments match your query</h4>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Try adjusting your category filter or search keywords.</p>
          </div>
        )}
      </div>

    </div>
  )
}
