'use client'

import React, { useState } from 'react'
import { 
  Building2, 
  UserPlus, 
  Trash2, 
  Edit, 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  X, 
  Award, 
  Briefcase, 
  GraduationCap, 
  CheckSquare 
} from 'lucide-react'
import { 
  addDoctorAction, 
  removeDoctorAction, 
  updateDepartmentAction,
  updateDepartmentFacilitiesAction,
  updateDoctorAction
} from './actions'
import { toast } from 'sonner'
import { Department, Doctor } from '@/lib/db'

interface DepartmentsClientProps {
  initialDepartments: Department[]
}

export default function DepartmentsClient({ initialDepartments }: DepartmentsClientProps) {
  const [departments, setDepartments] = useState<Department[]>(initialDepartments)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  
  // Doctor form state
  const [activeFormId, setActiveFormId] = useState<string | null>(null)
  const [docName, setDocName] = useState('')
  const [docDesignation, setDocDesignation] = useState('Professor & HOD')
  const [docQualification, setDocQualification] = useState('')
  const [docExperience, setDocExperience] = useState('')
  const [isPending, setIsPending] = useState(false)

  // Edit details form state
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const [editFullDesc, setEditFullDesc] = useState('')

  // Edit doctor state
  const [editingDoctorName, setEditingDoctorName] = useState<string | null>(null)
  const [editingDoctorDeptId, setEditingDoctorDeptId] = useState<string | null>(null)
  const [editDocName, setEditDocName] = useState('')
  const [editDocDesignation, setEditDocDesignation] = useState('Professor & HOD')
  const [editDocQualification, setEditDocQualification] = useState('')
  const [editDocExperience, setEditDocExperience] = useState('')

  // Edit facilities state
  const [facilityEditingId, setFacilityEditingId] = useState<string | null>(null)
  const [facilitiesList, setFacilitiesList] = useState<string[]>([])
  const [newFacility, setNewFacility] = useState('')

  const handleToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
    // Close forms
    setActiveFormId(null)
    setEditingId(null)
    setFacilityEditingId(null)
    setEditingDoctorName(null)
    setEditingDoctorDeptId(null)
  }

  const handleAddDoctor = async (e: React.FormEvent, deptId: string) => {
    e.preventDefault()
    if (!docName.trim() || !docQualification.trim() || !docExperience.trim()) {
      toast.error('Please fill out all staff fields')
      return
    }

    setIsPending(true)
    const newDoc: Doctor = {
      name: docName,
      designation: docDesignation,
      qualification: docQualification,
      experience: docExperience
    }

    try {
      const res = await addDoctorAction(deptId, newDoc)
      if (res.success) {
        toast.success(`Successfully added ${docName}`)
        
        // Update local state
        setDepartments(prev => prev.map(d => {
          if (d.id === deptId) {
            return { ...d, doctors: [...d.doctors, newDoc] }
          }
          return d
        }))

        // Reset form
        setDocName('')
        setDocQualification('')
        setDocExperience('')
        setActiveFormId(null)
      } else {
        toast.error('Could not save doctor profile')
      }
    } catch (err) {
      toast.error('An error occurred')
    } finally {
      setIsPending(false)
    }
  }

  const handleRemoveDoctor = async (deptId: string, doctorName: string) => {
    if (!confirm(`Are you sure you want to remove ${doctorName} from the faculty?`)) return

    try {
      const res = await removeDoctorAction(deptId, doctorName)
      if (res.success) {
        toast.success(`Removed ${doctorName}`)
        setDepartments(prev => prev.map(d => {
          if (d.id === deptId) {
            return { ...d, doctors: d.doctors.filter(doc => doc.name !== doctorName) }
          }
          return d
        }))
      } else {
        toast.error('Could not remove doctor profile')
      }
    } catch (e) {
      toast.error('An error occurred')
    }
  }

  const handleSaveDetails = async (deptId: string) => {
    if (!editName.trim() || !editDesc.trim() || !editFullDesc.trim()) {
      toast.error('Department name and descriptions cannot be empty')
      return
    }

    try {
      const res = await updateDepartmentAction(deptId, { name: editName, description: editDesc, fullDescription: editFullDesc })
      if (res.success) {
        toast.success('Department details updated successfully')
        setDepartments(prev => prev.map(d => {
          if (d.id === deptId) {
            return { ...d, name: editName, description: editDesc, fullDescription: editFullDesc }
          }
          return d
        }))
        setEditingId(null)
      } else {
        toast.error('Failed to update details')
      }
    } catch (e) {
      toast.error('An error occurred')
    }
  }

  const handleStartEdit = (dept: Department) => {
    setEditingId(dept.id)
    setEditName(dept.name)
    setEditDesc(dept.description)
    setEditFullDesc(dept.fullDescription)
  }

  const handleStartEditDoctor = (deptId: string, doc: Doctor) => {
    setEditingDoctorDeptId(deptId)
    setEditingDoctorName(doc.name)
    setEditDocName(doc.name)
    setEditDocDesignation(doc.designation)
    setEditDocQualification(doc.qualification)
    setEditDocExperience(doc.experience)
    
    // Close other forms
    setActiveFormId(null)
  }

  const handleSaveDoctor = async (e: React.FormEvent, deptId: string) => {
    e.preventDefault()
    if (!editingDoctorName) return

    if (!editDocName.trim() || !editDocQualification.trim() || !editDocExperience.trim()) {
      toast.error('Please fill out all staff fields')
      return
    }

    setIsPending(true)
    const updatedDoc: Doctor = {
      name: editDocName,
      designation: editDocDesignation,
      qualification: editDocQualification,
      experience: editDocExperience
    }

    try {
      const res = await updateDoctorAction(deptId, editingDoctorName, updatedDoc)
      if (res.success) {
        toast.success(`Successfully updated ${editDocName}`)
        
        // Update local state
        setDepartments(prev => prev.map(d => {
          if (d.id === deptId) {
            return {
              ...d,
              doctors: d.doctors.map(doc => doc.name === editingDoctorName ? updatedDoc : doc)
            }
          }
          return d
        }))

        // Reset form
        setEditingDoctorName(null)
        setEditingDoctorDeptId(null)
        setEditDocName('')
        setEditDocQualification('')
        setEditDocExperience('')
      } else {
        toast.error('Could not save doctor profile')
      }
    } catch (err) {
      toast.error('An error occurred')
    } finally {
      setIsPending(false)
    }
  }

  const handleStartFacilitiesEdit = (dept: Department) => {
    setFacilityEditingId(dept.id)
    setFacilitiesList(dept.facilities || [])
  }

  const handleAddFacility = () => {
    if (!newFacility.trim()) return
    if (facilitiesList.includes(newFacility.trim())) {
      toast.error('Facility already exists')
      return
    }
    setFacilitiesList(prev => [...prev, newFacility.trim()])
    setNewFacility('')
  }

  const handleRemoveFacility = (fac: string) => {
    setFacilitiesList(prev => prev.filter(f => f !== fac))
  }

  const handleSaveFacilities = async (deptId: string) => {
    try {
      const res = await updateDepartmentFacilitiesAction(deptId, facilitiesList)
      if (res.success) {
        toast.success('Department facilities updated')
        setDepartments(prev => prev.map(d => {
          if (d.id === deptId) {
            return { ...d, facilities: facilitiesList }
          }
          return d
        }))
        setFacilityEditingId(null)
      } else {
        toast.error('Failed to save facilities')
      }
    } catch (e) {
      toast.error('An error occurred')
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">Departments & Faculty</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Manage clinical and academic departments, facility checklists, and assign medical staff.
        </p>
      </div>

      {/* Departments Accordion List */}
      <div className="space-y-4">
        {departments.map((dept) => {
          const isExpanded = expandedId === dept.id
          const isEditing = editingId === dept.id
          const isFacilityEditing = facilityEditingId === dept.id

          return (
            <div 
              key={dept.id}
              className={`overflow-hidden rounded-2xl border transition-all duration-300 backdrop-blur-md ${
                isExpanded 
                  ? 'border-teal-500/30 bg-slate-50/60 dark:bg-slate-900/60 shadow-[0_0_30px_rgba(13,148,136,0.05)]' 
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-900/20 hover:border-slate-300/60 dark:border-slate-700/60 hover:bg-slate-50/30 dark:bg-slate-900/30'
              }`}
            >
              {/* Accordion Trigger */}
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
                    {dept.doctors?.length || 0} Physicians
                  </span>
                  {isExpanded ? <ChevronUp className="h-5 w-5 text-slate-600 dark:text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-600 dark:text-slate-400" />}
                </div>
              </button>

              {/* Accordion Content */}
              {isExpanded && (
                <div className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white/20 dark:bg-slate-950/20 px-6 py-6 space-y-6">
                  {/* Descriptions Editor */}
                  <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/20 dark:bg-slate-900/20 p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-350">Department Descriptions</h4>
                      {!isEditing ? (
                        <button
                          onClick={() => handleStartEdit(dept)}
                          className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-1.5 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:bg-slate-50 dark:bg-slate-900"
                        >
                          <Edit className="h-3.5 w-3.5" />
                          Edit Overview
                        </button>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveDetails(dept.id)}
                            className="rounded-lg bg-teal-500 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-teal-400 cursor-pointer"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>

                    {isEditing ? (
                      <div className="space-y-4">
                        <div>
                          <label className="mb-2 block text-xs font-bold text-slate-500 dark:text-slate-450 uppercase">Department Name</label>
                          <input 
                            type="text" 
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 focus:border-teal-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-xs font-bold text-slate-500 dark:text-slate-450 uppercase">Short Hook Description</label>
                          <input 
                            type="text" 
                            value={editDesc}
                            onChange={(e) => setEditDesc(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 focus:border-teal-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-xs font-bold text-slate-500 dark:text-slate-450 uppercase">Full Diagnostic Overview</label>
                          <textarea 
                            rows={4}
                            value={editFullDesc}
                            onChange={(e) => setEditFullDesc(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 focus:border-teal-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3 text-sm text-slate-600 dark:text-slate-350 leading-relaxed">
                        <p><span className="font-semibold text-teal-600 dark:text-teal-400">Overview:</span> {dept.description}</p>
                        <p><span className="font-semibold text-teal-600 dark:text-teal-400">Detailed Profile:</span> {dept.fullDescription}</p>
                      </div>
                    )}
                  </div>

                  {/* Facilities list Editor */}
                  <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/20 dark:bg-slate-900/20 p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-350">Service Capabilities & Equipment</h4>
                      {!isFacilityEditing ? (
                        <button
                          onClick={() => handleStartFacilitiesEdit(dept)}
                          className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-1.5 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:bg-slate-50 dark:bg-slate-900"
                        >
                          <Edit className="h-3.5 w-3.5" />
                          Manage Facilities
                        </button>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveFacilities(dept.id)}
                            className="rounded-lg bg-teal-500 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-teal-400 cursor-pointer"
                          >
                            Save List
                          </button>
                          <button
                            onClick={() => setFacilityEditingId(null)}
                            className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>

                    {isFacilityEditing ? (
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder="e.g. 1.5 Tesla MRI, 24/7 Pharmacy"
                            value={newFacility}
                            onChange={(e) => setNewFacility(e.target.value)}
                            className="flex-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2 text-xs text-slate-800 dark:text-slate-200 focus:border-teal-500 focus:outline-none"
                            onKeyDown={(e) => e.key === 'Enter' && handleAddFacility()}
                          />
                          <button
                            type="button"
                            onClick={handleAddFacility}
                            className="flex items-center justify-center rounded-xl bg-teal-500 px-4 text-xs font-semibold text-slate-950 hover:bg-teal-400 cursor-pointer"
                          >
                            Add
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {facilitiesList.map((fac) => (
                            <span 
                              key={fac}
                              className="inline-flex items-center gap-1 rounded-lg bg-slate-100 dark:bg-slate-850 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-350 ring-1 ring-slate-200 dark:ring-slate-800"
                            >
                              {fac}
                              <button 
                                type="button" 
                                onClick={() => handleRemoveFacility(fac)}
                                className="text-slate-500 hover:text-rose-400"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {dept.facilities && dept.facilities.length > 0 ? (
                          dept.facilities.map((fac) => (
                            <span 
                              key={fac}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-teal-500/5 px-3 py-1.5 text-xs font-semibold text-teal-600 dark:text-teal-400 ring-1 ring-teal-500/20"
                            >
                              <CheckSquare className="h-3.5 w-3.5" />
                              {fac}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-500 italic">No facilities configured.</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Medical Doctors / Faculty list */}
                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-350">Faculty Roster</h4>
                      {activeFormId !== dept.id && (
                        <button
                          onClick={() => setActiveFormId(dept.id)}
                          className="flex items-center gap-1.5 rounded-xl bg-teal-500 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-teal-400 cursor-pointer"
                        >
                          <UserPlus className="h-3.5 w-3.5" />
                          Assign Staff
                        </button>
                      )}
                    </div>

                    {/* Add Doctor form */}
                    {activeFormId === dept.id && (
                      <form 
                        onSubmit={(e) => handleAddDoctor(e, dept.id)}
                        className="mb-6 rounded-2xl border border-teal-500/20 bg-teal-500/5 p-5 space-y-4"
                      >
                        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-850 pb-3">
                          <h5 className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">Add Staff Member</h5>
                          <button 
                            type="button" 
                            onClick={() => setActiveFormId(null)}
                            className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                          <div>
                            <label className="mb-1.5 block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Doctor Name</label>
                            <input 
                              type="text" 
                              placeholder="e.g. Dr. Jane Doe"
                              value={docName}
                              onChange={(e) => setDocName(e.target.value)}
                              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:border-teal-500 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="mb-1.5 block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Title / Designation</label>
                            <select 
                              value={docDesignation}
                              onChange={(e) => setDocDesignation(e.target.value)}
                              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:border-teal-500 focus:outline-none"
                            >
                              <option value="Professor & HOD">Professor & HOD</option>
                              <option value="Professor">Professor</option>
                              <option value="Associate Professor">Associate Professor</option>
                              <option value="Assistant Professor">Assistant Professor</option>
                              <option value="Senior Resident">Senior Resident</option>
                            </select>
                          </div>

                          <div>
                            <label className="mb-1.5 block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Qualifications</label>
                            <input 
                              type="text" 
                              placeholder="e.g. MD Pediatric, DNB"
                              value={docQualification}
                              onChange={(e) => setDocQualification(e.target.value)}
                              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:border-teal-500 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="mb-1.5 block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Experience Length</label>
                            <input 
                              type="text" 
                              placeholder="e.g. 12 years"
                              value={docExperience}
                              onChange={(e) => setDocExperience(e.target.value)}
                              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:border-teal-500 focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            type="submit"
                            disabled={isPending}
                            className="rounded-xl bg-teal-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-teal-400 disabled:opacity-50 cursor-pointer"
                          >
                            {isPending ? 'Saving...' : 'Save Member'}
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Doctors list cards */}
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {dept.doctors && dept.doctors.length > 0 ? (
                        dept.doctors.map((doc) => {
                          const isDocEditing = editingDoctorName === doc.name && editingDoctorDeptId === dept.id

                          if (isDocEditing) {
                            return (
                              <form 
                                onSubmit={(e) => handleSaveDoctor(e, dept.id)}
                                className="rounded-xl border border-teal-500 bg-slate-50/90 dark:bg-slate-900/90 p-4 space-y-3 shadow-lg"
                                key={doc.name}
                              >
                                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-1.5">
                                  <h6 className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">Edit Staff Profile</h6>
                                  <button 
                                    type="button" 
                                    onClick={() => {
                                      setEditingDoctorName(null)
                                      setEditingDoctorDeptId(null)
                                    }}
                                    className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                                <div className="space-y-2">
                                  <div>
                                    <label className="block text-[9px] font-bold text-slate-600 dark:text-slate-400 uppercase">Doctor Name</label>
                                    <input 
                                      type="text" 
                                      value={editDocName}
                                      onChange={(e) => setEditDocName(e.target.value)}
                                      className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-2 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:border-teal-500 focus:outline-none"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[9px] font-bold text-slate-600 dark:text-slate-400 uppercase">Designation</label>
                                    <select 
                                      value={editDocDesignation}
                                      onChange={(e) => setEditDocDesignation(e.target.value)}
                                      className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-2 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:border-teal-500 focus:outline-none"
                                    >
                                      <option value="Professor & HOD">Professor & HOD</option>
                                      <option value="Professor">Professor</option>
                                      <option value="Associate Professor">Associate Professor</option>
                                      <option value="Assistant Professor">Assistant Professor</option>
                                      <option value="Senior Resident">Senior Resident</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-[9px] font-bold text-slate-600 dark:text-slate-400 uppercase">Qualifications</label>
                                    <input 
                                      type="text" 
                                      value={editDocQualification}
                                      onChange={(e) => setEditDocQualification(e.target.value)}
                                      className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-2 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:border-teal-500 focus:outline-none"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[9px] font-bold text-slate-600 dark:text-slate-400 uppercase">Experience</label>
                                    <input 
                                      type="text" 
                                      value={editDocExperience}
                                      onChange={(e) => setEditDocExperience(e.target.value)}
                                      className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-2 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:border-teal-500 focus:outline-none"
                                    />
                                  </div>
                                </div>
                                <div className="flex justify-end gap-1.5 pt-1">
                                  <button
                                    type="submit"
                                    disabled={isPending}
                                    className="rounded-lg bg-teal-500 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-teal-400 disabled:opacity-50 cursor-pointer"
                                  >
                                    {isPending ? 'Saving...' : 'Save'}
                                  </button>
                                </div>
                              </form>
                            )
                          }

                          return (
                            <div 
                              key={doc.name}
                              className="group relative rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50/30 dark:bg-slate-900/30 p-4 transition-all duration-200 hover:border-slate-200 dark:border-slate-800 hover:bg-slate-50/60 dark:bg-slate-900/60"
                            >
                              <div className="absolute top-3 right-3 hidden gap-1 group-hover:flex">
                                <button
                                  onClick={() => handleStartEditDoctor(dept.id, doc)}
                                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-teal-500/20 bg-teal-500/5 text-teal-700 dark:text-teal-450 hover:bg-teal-500/25 cursor-pointer"
                                  title="Edit Staff Member"
                                  type="button"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleRemoveDoctor(dept.id, doc.name)}
                                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-rose-500/20 bg-rose-500/5 text-rose-400 hover:bg-rose-500/25 cursor-pointer"
                                  title="Remove Staff Member"
                                  type="button"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                              <h5 className="font-bold text-slate-800 dark:text-slate-200 pr-16 text-sm">{doc.name}</h5>
                              <p className="mt-1.5 text-xs text-teal-600 dark:text-teal-400 font-semibold">{doc.designation}</p>

                              <div className="mt-4 space-y-1.5 border-t border-slate-200/50 dark:border-slate-850/50 pt-3 text-[11px] text-slate-600 dark:text-slate-400">
                                <p className="flex items-center gap-1.5">
                                  <GraduationCap className="h-3.5 w-3.5 text-slate-500" />
                                  {doc.qualification}
                                </p>
                                <p className="flex items-center gap-1.5">
                                  <Briefcase className="h-3.5 w-3.5 text-slate-500" />
                                  {doc.experience} Experience
                                </p>
                              </div>
                            </div>
                          )
                        })
                      ) : (
                        <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/20 dark:bg-slate-950/20 py-8 text-center text-xs text-slate-500 sm:col-span-2 lg:col-span-3">
                          No doctors assigned to this department yet.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
