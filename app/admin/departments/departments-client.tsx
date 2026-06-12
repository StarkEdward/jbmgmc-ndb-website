'use client'

import React, { useState } from 'react'
import { Building2, ChevronDown, ChevronUp } from 'lucide-react'
import { Department } from '@/lib/db'
import DepartmentEditor from './department-editor'

interface DepartmentsClientProps {
  initialDepartments: Department[]
}

export default function DepartmentsClient({ initialDepartments }: DepartmentsClientProps) {
  const [departments, setDepartments] = useState<Department[]>(initialDepartments)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const handleToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const handleUpdateDepartment = (updatedDept: Department) => {
    setDepartments(prev => prev.map(d => d.id === updatedDept.id ? updatedDept : d))
  }

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">Departments & Faculty</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Manage clinical and academic departments, faculty rosters, academic content, and services.
        </p>
      </div>

      <div className="space-y-4">
        {departments.map((dept) => {
          const isExpanded = expandedId === dept.id
          
          return (
            <div 
              key={dept.id}
              className={`overflow-hidden rounded-2xl border transition-all duration-300 backdrop-blur-md ${
                isExpanded 
                  ? 'border-teal-500/30 bg-slate-50/60 dark:bg-slate-900/60 shadow-[0_0_30px_rgba(13,148,136,0.05)]' 
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-900/20 hover:border-slate-300/60 dark:border-slate-700/60 hover:bg-slate-50/30 dark:bg-slate-900/30'
              }`}
            >
              <button
                onClick={() => handleToggle(dept.id)}
                className="flex w-full items-center justify-between px-6 py-5 text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 ring-1 ring-teal-500/20">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 sm:text-lg">{dept.name}</h3>
                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 line-clamp-1 max-w-xl">{dept.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="hidden rounded-full bg-slate-100 dark:bg-slate-850 px-3 py-1 text-xs font-semibold text-teal-600 dark:text-teal-400 ring-1 ring-slate-200 dark:ring-slate-800 sm:inline-block">
                    {dept.doctors?.length || 0} Faculty
                  </span>
                  {isExpanded ? <ChevronUp className="h-5 w-5 text-slate-600 dark:text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-600 dark:text-slate-400" />}
                </div>
              </button>

              {isExpanded && (
                <DepartmentEditor department={dept} onUpdate={handleUpdateDepartment} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
