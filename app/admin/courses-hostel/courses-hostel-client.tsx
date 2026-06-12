'use client'

import React, { useState } from 'react'
import { 
  GraduationCap, 
  Hotel, 
  Edit2, 
  Users, 
  Clock, 
  Award, 
  Save, 
  Trash2, 
  Plus, 
  X, 
  CheckSquare, 
  ListOrdered 
} from 'lucide-react'
import { updateCourseAction, updateHostelAction } from './actions'
import { toast } from 'sonner'
import { Course, HostelInfo, HostelSpec } from '@/lib/db'

interface CoursesHostelClientProps {
  initialCourses: Course[]
  initialHostels: HostelInfo
}

export default function CoursesHostelClient({ initialCourses, initialHostels }: CoursesHostelClientProps) {
  const [activeTab, setActiveTab] = useState<'courses' | 'hostels'>('courses')
  
  // States
  const [courses, setCourses] = useState<Course[]>(initialCourses)
  const [hostels, setHostels] = useState<HostelInfo>(initialHostels)

  // Edit Course state
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null)
  const [courseFullName, setCourseFullName] = useState('')
  const [courseDuration, setCourseDuration] = useState('')
  const [courseSeats, setCourseSeats] = useState<string | number>('')
  const [courseEligibility, setCourseEligibility] = useState('')
  const [courseDesc, setCourseDesc] = useState('')

  // Edit Hostel State
  const [editingHostelKey, setEditingHostelKey] = useState<'boys' | 'girls' | 'pgHostel' | null>(null)
  const [hostelCapacity, setHostelCapacity] = useState<number>(0)
  const [hostelFacilities, setHostelFacilities] = useState<string[]>([])
  const [hostelRules, setHostelRules] = useState<string[]>([])
  
  const [newFacility, setNewFacility] = useState('')
  const [newRule, setNewRule] = useState('')

  const handleStartEditCourse = (c: Course) => {
    setEditingCourseId(c.id)
    setCourseFullName(c.fullName)
    setCourseDuration(c.duration)
    setCourseSeats(c.seats)
    setCourseEligibility(c.eligibility)
    setCourseDesc(c.description)
  }

  const handleSaveCourse = async (id: string) => {
    if (!courseFullName.trim() || !courseEligibility.trim() || !courseDesc.trim()) {
      toast.error('Please complete all academic program fields')
      return
    }

    const numericSeats = isNaN(Number(courseSeats)) ? courseSeats : Number(courseSeats)
    const fields = {
      fullName: courseFullName,
      duration: courseDuration,
      seats: numericSeats,
      eligibility: courseEligibility,
      description: courseDesc
    }

    try {
      const res = await updateCourseAction(id, fields)
      if (res.success) {
        toast.success('Academic program saved successfully')
        setCourses(prev => prev.map(c => {
          if (c.id === id) {
            return { ...c, ...fields }
          }
          return c
        }))
        setEditingCourseId(null)
      } else {
        toast.error('Failed to update course details')
      }
    } catch (e) {
      toast.error('An error occurred')
    }
  }

  const handleStartEditHostel = (key: 'boys' | 'girls' | 'pgHostel', spec: HostelSpec) => {
    setEditingHostelKey(key)
    setHostelCapacity(spec.capacity)
    setHostelFacilities(spec.facilities || [])
    setHostelRules(spec.rules || [])
  }

  const handleAddFacility = () => {
    if (!newFacility.trim()) return
    if (hostelFacilities.includes(newFacility.trim())) {
      toast.error('Facility already configured')
      return
    }
    setHostelFacilities(prev => [...prev, newFacility.trim()])
    setNewFacility('')
  }

  const handleRemoveFacility = (fac: string) => {
    setHostelFacilities(prev => prev.filter(f => f !== fac))
  }

  const handleAddRule = () => {
    if (!newRule.trim()) return
    if (hostelRules.includes(newRule.trim())) {
      toast.error('Rule already exists')
      return
    }
    setHostelRules(prev => [...prev, newRule.trim()])
    setNewRule('')
  }

  const handleRemoveRule = (rule: string) => {
    setHostelRules(prev => prev.filter(r => r !== rule))
  }

  const handleSaveHostel = async (key: 'boys' | 'girls' | 'pgHostel') => {
    const fields = {
      capacity: hostelCapacity,
      facilities: hostelFacilities,
      rules: hostelRules
    }

    try {
      const res = await updateHostelAction(key, fields)
      if (res.success) {
        toast.success('Hostel specifications saved successfully')
        setHostels(prev => ({
          ...prev,
          [key]: {
            ...prev[key],
            ...fields
          }
        }))
        setEditingHostelKey(null)
      } else {
        toast.error('Failed to save hostel specifications')
      }
    } catch (e) {
      toast.error('An error occurred')
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">Academics & Hostels</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Configure active degree requirements, seat allocations, boarding specifications, and hostel rules of conduct.
        </p>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2 rounded-2xl bg-slate-50/60 dark:bg-slate-900/60 p-1 ring-1 ring-slate-850">
          <button
            onClick={() => setActiveTab('courses')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'courses'
                ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/10'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200'
            }`}
          >
            <GraduationCap className="h-4 w-4" />
            Academic Courses ({courses.length})
          </button>
          <button
            onClick={() => setActiveTab('hostels')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'hostels'
                ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/10'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200'
            }`}
          >
            <Hotel className="h-4 w-4" />
            Boarding Hostels (3)
          </button>
        </div>
      </div>

      {/* Dynamic Content */}
      <div className="space-y-6">
        {activeTab === 'courses' ? (
          <div className="space-y-4">
            {courses.map((course) => {
              const isEditing = editingCourseId === course.id

              return (
                <div 
                  key={course.id}
                  className={`rounded-2xl border transition-all p-6 bg-slate-50/40 dark:bg-slate-900/40 backdrop-blur-md ${
                    isEditing ? 'border-teal-500/35 ring-1 ring-teal-500/10 shadow-[0_0_30px_rgba(13,148,136,0.02)]' : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between border-b border-slate-200/60 dark:border-slate-850/60 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                        <GraduationCap className="h-5.5 w-5.5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">{course.name}</h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400">{course.fullName}</p>
                      </div>
                    </div>

                    {!isEditing ? (
                      <button
                        onClick={() => handleStartEditCourse(course)}
                        className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-1.5 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:bg-slate-50 dark:bg-slate-900"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                        Edit Course
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveCourse(course.id)}
                          className="flex items-center gap-1 rounded-lg bg-teal-500 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-teal-400 cursor-pointer"
                        >
                          <Save className="h-3.5 w-3.5" />
                          Save
                        </button>
                        <button
                          onClick={() => setEditingCourseId(null)}
                          className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-1.5 text-xs font-semibold text-slate-500 dark:text-slate-450 hover:text-slate-800 dark:text-slate-200"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="mt-6 space-y-4">
                      <div className="grid gap-4 sm:grid-cols-3">
                        <div>
                          <label className="mb-1.5 block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Degree Full Name</label>
                          <input 
                            type="text" 
                            value={courseFullName}
                            onChange={(e) => setCourseFullName(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:border-teal-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Intake Limit (Seats)</label>
                          <input 
                            type="text" 
                            value={courseSeats}
                            onChange={(e) => setCourseSeats(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:border-teal-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Program Duration</label>
                          <input 
                            type="text" 
                            value={courseDuration}
                            onChange={(e) => setCourseDuration(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:border-teal-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Eligibility Criteria</label>
                        <input 
                          type="text" 
                          value={courseEligibility}
                          onChange={(e) => setCourseEligibility(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:border-teal-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Detailed Syllabus/Curriculum Overview</label>
                        <textarea 
                          rows={4}
                          value={courseDesc}
                          onChange={(e) => setCourseDesc(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:border-teal-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="mt-5 space-y-4">
                      <div className="grid gap-3 sm:grid-cols-3">
                        <div className="rounded-xl bg-white/30 dark:bg-slate-950/30 p-3 ring-1 ring-slate-850 flex items-center gap-3">
                          <Users className="h-5 w-5 text-teal-600 dark:text-teal-400 shrink-0" />
                          <div>
                            <p className="text-[10px] font-semibold text-slate-500 uppercase">Intake Limit</p>
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{course.seats} Seats</p>
                          </div>
                        </div>

                        <div className="rounded-xl bg-white/30 dark:bg-slate-950/30 p-3 ring-1 ring-slate-850 flex items-center gap-3">
                          <Clock className="h-5 w-5 text-sky-400 shrink-0" />
                          <div>
                            <p className="text-[10px] font-semibold text-slate-500 uppercase">Course Duration</p>
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{course.duration}</p>
                          </div>
                        </div>

                        <div className="rounded-xl bg-white/30 dark:bg-slate-950/30 p-3 ring-1 ring-slate-850 flex items-center gap-3">
                          <Award className="h-5 w-5 text-indigo-400 shrink-0" />
                          <div>
                            <p className="text-[10px] font-semibold text-slate-500 uppercase">Minimum Eligibility</p>
                            <p className="truncate text-xs font-bold text-slate-800 dark:text-slate-200">{course.eligibility}</p>
                          </div>
                        </div>
                      </div>

                      <div className="text-xs text-slate-355 leading-relaxed bg-white/15 dark:bg-slate-950/15 p-4 rounded-xl ring-1 ring-slate-900">
                        <p className="mb-2 font-bold text-teal-500 uppercase tracking-widest text-[10px]">Academic Profile</p>
                        {course.description}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {/* Hostels Boarding Cards */}
            {(['boys', 'girls', 'pgHostel'] as const).map((key) => {
              const spec = hostels[key]
              const isEditing = editingHostelKey === key

              return (
                <div 
                  key={key}
                  className={`rounded-2xl border bg-slate-50/40 dark:bg-slate-900/40 p-5 backdrop-blur-md flex flex-col justify-between ${
                    isEditing ? 'border-teal-500/35 ring-1 ring-teal-500/10' : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div>
                    <div className="mb-4 flex items-center justify-between border-b border-slate-200/60 dark:border-slate-850/60 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400 ring-1 ring-sky-500/20">
                          <Hotel className="h-5 w-5" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">{spec.name}</h3>
                      </div>
                      {!isEditing ? (
                        <button
                          onClick={() => handleStartEditHostel(key, spec)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:text-teal-400"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                      ) : (
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => handleSaveHostel(key)}
                            className="rounded bg-teal-500 px-2.5 py-1 text-[10px] font-bold text-slate-950 hover:bg-teal-400 cursor-pointer"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingHostelKey(null)}
                            className="rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-2 py-1 text-[10px] font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200"
                          >
                            X
                          </button>
                        </div>
                      )}
                    </div>

                    {isEditing ? (
                      <div className="space-y-4">
                        <div>
                          <label className="mb-1 block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Boarding Capacity (Beds)</label>
                          <input 
                            type="number" 
                            value={hostelCapacity}
                            onChange={(e) => setHostelCapacity(Number(e.target.value))}
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-950 px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:border-teal-500 focus:outline-none"
                          />
                        </div>

                        {/* Facilities checklist */}
                        <div>
                          <label className="mb-1.5 block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Facilities</label>
                          <div className="flex gap-1.5 mb-2">
                            <input 
                              type="text" 
                              placeholder="Add facility tag..."
                              value={newFacility}
                              onChange={(e) => setNewFacility(e.target.value)}
                              className="flex-1 rounded-lg border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-950 px-2 py-1 text-[11px] text-slate-205 focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={handleAddFacility}
                              className="rounded-lg bg-teal-500 px-3 text-[11px] font-bold text-slate-950 hover:bg-teal-400 cursor-pointer"
                            >
                              +
                            </button>
                          </div>

                          <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto pr-1">
                            {hostelFacilities.map((f) => (
                              <span 
                                key={f}
                                className="inline-flex items-center gap-1 rounded bg-white dark:bg-slate-950 px-2 py-0.5 text-[10px] text-slate-600 dark:text-slate-350"
                              >
                                {f}
                                <button type="button" onClick={() => handleRemoveFacility(f)}>
                                  <X className="h-2.5 w-2.5 text-slate-500 hover:text-rose-400" />
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Rules List */}
                        <div>
                          <label className="mb-1.5 block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Hostel Code of Conduct</label>
                          <div className="flex gap-1.5 mb-2">
                            <input 
                              type="text" 
                              placeholder="Add rule tag..."
                              value={newRule}
                              onChange={(e) => setNewRule(e.target.value)}
                              className="flex-1 rounded-lg border border-slate-855 bg-white dark:bg-slate-950 px-2 py-1 text-[11px] text-slate-205 focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={handleAddRule}
                              className="rounded-lg bg-teal-500 px-3 text-[11px] font-bold text-slate-950 hover:bg-teal-400 cursor-pointer"
                            >
                              +
                            </button>
                          </div>

                          <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto pr-1">
                            {hostelRules.map((r) => (
                              <span 
                                key={r}
                                className="inline-flex items-center gap-1 rounded bg-white dark:bg-slate-950 px-2 py-0.5 text-[10px] text-slate-600 dark:text-slate-350"
                              >
                                {r.substring(0, 15)}...
                                <button type="button" onClick={() => handleRemoveRule(r)}>
                                  <X className="h-2.5 w-2.5 text-slate-500 hover:text-rose-400" />
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="rounded-xl bg-white/40 dark:bg-slate-950/40 p-3 ring-1 ring-slate-850 text-center">
                          <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-widest">Active Bed Capacity</p>
                          <p className="mt-1 text-xl font-black text-teal-600 dark:text-teal-400">{spec.capacity} Students</p>
                        </div>

                        {/* Facilities */}
                        <div className="space-y-2">
                          <p className="flex items-center gap-1 text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                            <CheckSquare className="h-3.5 w-3.5 text-teal-550" />
                            BOARDING SPECIFICATIONS
                          </p>
                          <ul className="grid gap-1.5 text-[11px] text-slate-600 dark:text-slate-350 sm:grid-cols-1">
                            {spec.facilities.map((fac, idx) => (
                              <li key={idx} className="flex items-center gap-1.5 truncate">
                                <span className="h-1 w-1 rounded-full bg-teal-400 shrink-0" />
                                {fac}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Rules */}
                        <div className="space-y-2 border-t border-slate-200/60 dark:border-slate-850/60 pt-3">
                          <p className="flex items-center gap-1 text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                            <ListOrdered className="h-3.5 w-3.5 text-sky-550" />
                            HOSTEL CODE OF CONDUCT
                          </p>
                          <ul className="space-y-1.5 text-[11px] text-slate-500 dark:text-slate-450">
                            {spec.rules.map((rule, idx) => (
                              <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                                <span className="mt-1 h-1 w-1 rounded-full bg-sky-400 shrink-0" />
                                {rule}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
