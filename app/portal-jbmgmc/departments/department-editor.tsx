'use client'

import React, { useState } from 'react'
import { Department, Doctor, Publication, DesignationDuty, NonTeachingStaff } from '@/lib/db'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { 
  Building2, UserPlus, Trash2, Edit, X, Award, Briefcase, GraduationCap, 
  CheckSquare, BookOpen, Stethoscope, FileText, FlaskConical, Users, Save, ListChecks,
  User, Camera
} from 'lucide-react'
import { 
  updateDepartmentAction, 
  addDoctorAction, 
  removeDoctorAction, 
  updateDoctorAction 
} from './actions'
import ImageCropper from '@/components/image-cropper'

interface Props {
  department: Department
  onUpdate: (updated: Department) => void
}

export default function DepartmentEditor({ department, onUpdate }: Props) {
  const [isPending, setIsPending] = useState(false)

  const handleSaveOverview = async (name: string, description: string, fullDescription: string) => {
    setIsPending(true)
    const res = await updateDepartmentAction(department.id, { name, description, fullDescription })
    if (res.success) {
      toast.success('Overview updated successfully')
      onUpdate({ ...department, name, description, fullDescription })
    } else {
      toast.error(res.error || 'Failed to update overview')
    }
    setIsPending(false)
  }

  const handleSaveAcademic = async (goals: string, objectives: string, skills: string, academicActivities: string) => {
    setIsPending(true)
    const goalsArr = goals.split('\n').filter(s => s.trim())
    const objectivesArr = objectives.split('\n').filter(s => s.trim())
    const skillsArr = skills.split('\n').filter(s => s.trim())
    const academicActivitiesArr = academicActivities.split('\n').filter(s => s.trim())

    const res = await updateDepartmentAction(department.id, {
      goals: goalsArr,
      objectives: objectivesArr,
      skills: skillsArr,
      academicActivities: academicActivitiesArr
    })
    if (res.success) {
      toast.success('Academic content updated successfully')
      onUpdate({
        ...department,
        goals: goalsArr,
        objectives: objectivesArr,
        skills: skillsArr,
        academicActivities: academicActivitiesArr
      })
    } else {
      toast.error(res.error || 'Failed to update academic content')
    }
    setIsPending(false)
  }

  return (
    <div className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white/20 dark:bg-slate-950/20 px-6 py-6 space-y-6">
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl flex flex-wrap h-auto">
          <TabsTrigger value="overview" className="rounded-lg gap-2"><FileText className="h-4 w-4"/> Overview</TabsTrigger>
          <TabsTrigger value="academic" className="rounded-lg gap-2"><BookOpen className="h-4 w-4"/> Academic Content</TabsTrigger>
          <TabsTrigger value="faculty" className="rounded-lg gap-2"><Stethoscope className="h-4 w-4"/> Faculty</TabsTrigger>
          <TabsTrigger value="services" className="rounded-lg gap-2"><FlaskConical className="h-4 w-4"/> Services & Labs</TabsTrigger>
          <TabsTrigger value="staff" className="rounded-lg gap-2"><Users className="h-4 w-4"/> Support Staff</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <OverviewTab dept={department} onSave={handleSaveOverview} isPending={isPending} />
        </TabsContent>

        <TabsContent value="academic" className="space-y-6">
          <AcademicTab dept={department} onSave={handleSaveAcademic} isPending={isPending} />
        </TabsContent>

        <TabsContent value="faculty" className="space-y-6">
          <FacultyTab dept={department} onUpdate={onUpdate} />
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          <ServicesTab dept={department} onUpdate={onUpdate} />
        </TabsContent>

        <TabsContent value="staff" className="space-y-6">
          <StaffTab dept={department} onUpdate={onUpdate} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Subcomponents

function OverviewTab({ dept, onSave, isPending }: any) {
  const [name, setName] = useState(dept.name || '')
  const [desc, setDesc] = useState(dept.description || '')
  const [fullDesc, setFullDesc] = useState(dept.fullDescription || '')
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(name, desc, fullDesc)
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/20 dark:bg-slate-900/20 p-5 space-y-4">
      <div>
        <label className="mb-2 block text-xs font-bold text-slate-500 uppercase">Department Name</label>
        <input value={name} onChange={e => setName(e.target.value)} className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 text-sm" />
      </div>
      <div>
        <label className="mb-2 block text-xs font-bold text-slate-500 uppercase">Short Description</label>
        <input value={desc} onChange={e => setDesc(e.target.value)} className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 text-sm" />
      </div>
      <div>
        <label className="mb-2 block text-xs font-bold text-slate-500 uppercase">Full Overview</label>
        <textarea rows={6} value={fullDesc} onChange={e => setFullDesc(e.target.value)} className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 text-sm" />
      </div>
      <div className="flex justify-end pt-2">
        <button type="submit" disabled={isPending} className="flex items-center gap-1.5 rounded-xl bg-teal-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-teal-400 disabled:opacity-50 cursor-pointer">
          <Save className="h-3.5 w-3.5" /> Save Overview
        </button>
      </div>
    </form>
  )
}

function AcademicTab({ dept, onSave, isPending }: any) {
  const [goals, setGoals] = useState((dept.goals || []).join('\n'))
  const [objectives, setObjectives] = useState((dept.objectives || []).join('\n'))
  const [skills, setSkills] = useState((dept.skills || []).join('\n'))
  const [academic, setAcademic] = useState((dept.academicActivities || []).join('\n'))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(goals, objectives, skills, academic)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/20 dark:bg-slate-900/20 p-5 space-y-4">
          <label className="block text-xs font-bold text-slate-500 uppercase">Department Goals (One per line)</label>
          <textarea rows={5} value={goals} onChange={e => setGoals(e.target.value)} className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 text-sm" />
        </div>
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/20 dark:bg-slate-900/20 p-5 space-y-4">
          <label className="block text-xs font-bold text-slate-500 uppercase">Educational Objectives (One per line)</label>
          <textarea rows={5} value={objectives} onChange={e => setObjectives(e.target.value)} className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 text-sm" />
        </div>
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/20 dark:bg-slate-900/20 p-5 space-y-4">
          <label className="block text-xs font-bold text-slate-500 uppercase">Key Competencies & Skills (One per line)</label>
          <textarea rows={5} value={skills} onChange={e => setSkills(e.target.value)} className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 text-sm" />
        </div>
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/20 dark:bg-slate-900/20 p-5 space-y-4">
          <label className="block text-xs font-bold text-slate-500 uppercase">Academic Activities (One per line)</label>
          <textarea rows={5} value={academic} onChange={e => setAcademic(e.target.value)} className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 text-sm" />
        </div>
      </div>
      <div className="flex justify-end">
        <button type="submit" disabled={isPending} className="flex items-center gap-1.5 rounded-xl bg-teal-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-teal-400 disabled:opacity-50 cursor-pointer">
          <Save className="h-3.5 w-3.5" /> Save Academic Content
        </button>
      </div>
    </form>
  )
}

function FacultyTab({ dept, onUpdate }: any) {
  const [activeFormId, setActiveFormId] = useState<string | null>(null)
  const [docName, setDocName] = useState('')
  const [docDesignation, setDocDesignation] = useState('Professor & HOD')
  const [docQualification, setDocQualification] = useState('')
  const [docExperience, setDocExperience] = useState('')
  const [docRegNo, setDocRegNo] = useState('')
  const [docEmail, setDocEmail] = useState('')
  const [docFile, setDocFile] = useState<File | null>(null)
  const [docPhotoUrl, setDocPhotoUrl] = useState('')
  const [showCropper, setShowCropper] = useState(false)
  const [editingDocName, setEditingDocName] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  const handleAddDoctor = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!docName.trim() || !docQualification.trim() || !docExperience.trim()) {
      toast.error('Please fill out basic staff fields')
      return
    }
    setIsPending(true)
    const newDoc: Doctor = {
      name: docName,
      designation: docDesignation,
      qualification: docQualification,
      experience: docExperience,
      regNo: docRegNo,
      email: docEmail,
      photo: docPhotoUrl || undefined
    }

    if (editingDocName) {
      // Edit mode
      const res = await updateDoctorAction(dept.id, editingDocName, newDoc)
      if (res.success) {
        toast.success(`Successfully updated ${docName}`)
        onUpdate({ 
          ...dept, 
          doctors: dept.doctors.map((d: any) => d.name === editingDocName ? newDoc : d) 
        })
        handleCancelEdit()
      } else {
        toast.error(res.error || 'Error updating doctor')
      }
    } else {
      // Add mode
      const res = await addDoctorAction(dept.id, newDoc)
      if (res.success) {
        toast.success(`Successfully added ${docName}`)
        onUpdate({ ...dept, doctors: [...(dept.doctors || []), newDoc] })
        handleCancelEdit()
      } else toast.error(res.error || 'Error adding doctor')
    }
    setIsPending(false)
  }

  const handleCancelEdit = () => {
    setDocName('')
    setDocDesignation('Professor & HOD')
    setDocQualification('')
    setDocExperience('')
    setDocRegNo('')
    setDocEmail('')
    setDocPhotoUrl('')
    setEditingDocName(null)
    setActiveFormId(null)
  }

  const handleEditDoctor = (doc: Doctor) => {
    setDocName(doc.name)
    setDocDesignation(doc.designation)
    setDocQualification(doc.qualification)
    setDocExperience(doc.experience)
    setDocRegNo(doc.regNo || '')
    setDocEmail(doc.email || '')
    setDocPhotoUrl(doc.photo || '')
    setEditingDocName(doc.name)
    setActiveFormId('add') // Open form view
  }

  const handleRemoveDoctor = async (doctorName: string) => {
    if (!confirm(`Are you sure you want to remove faculty member "${doctorName}"? This will permanently delete them from the roster.`)) return
    const res = await removeDoctorAction(dept.id, doctorName)
    if (res.success) {
      toast.success(`Removed ${doctorName}`)
      onUpdate({ ...dept, doctors: dept.doctors.filter((d: any) => d.name !== doctorName) })
    } else {
      toast.error(res.error || `Failed to remove ${doctorName}`)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDocFile(e.target.files[0])
      setShowCropper(true)
    }
  }

  const handleCropDone = async (cropped: File) => {
    setShowCropper(false)
    const formData = new FormData()
    formData.append('file', cropped)
    try {
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
      const uploadData = await uploadRes.json()
      if (uploadData.success) {
        setDocPhotoUrl(uploadData.url)
        toast.success('Doctor photo adjusted and ready!')
      } else {
        toast.error(uploadData.error || 'Upload failed')
      }
    } catch (e) {
      toast.error('Error uploading photo')
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-600">Faculty Roster</h4>
        <button onClick={() => { handleCancelEdit(); setActiveFormId('add'); }} className="flex items-center gap-1.5 rounded-xl bg-teal-500 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-teal-400">
          <UserPlus className="h-3.5 w-3.5" /> Assign Staff
        </button>
      </div>

      {showCropper && (
        <ImageCropper
          file={docFile}
          onCrop={handleCropDone}
          onCancel={() => setShowCropper(false)}
        />
      )}

      {activeFormId === 'add' && (
        <form onSubmit={handleAddDoctor} className="mb-6 rounded-2xl border border-teal-500/20 bg-teal-500/5 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h5 className="text-xs font-bold uppercase text-teal-600">
              {editingDocName ? `Edit Faculty: ${editingDocName}` : 'Add Staff Member'}
            </h5>
            <button type="button" onClick={handleCancelEdit}><X className="h-4 w-4" /></button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-[10px] font-bold text-slate-600 uppercase">Doctor Name</label>
              <input value={docName} onChange={e => setDocName(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs" />
            </div>
            <div>
              <label className="mb-1.5 block text-[10px] font-bold text-slate-600 uppercase">Designation</label>
              <select value={docDesignation} onChange={e => setDocDesignation(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs">
                <option value="Professor & HOD">Professor & HOD</option>
                <option value="Professor">Professor</option>
                <option value="Associate Professor">Associate Professor</option>
                <option value="Assistant Professor">Assistant Professor</option>
                <option value="Senior Resident">Senior Resident</option>
                <option value="Junior Resident">Junior Resident</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-[10px] font-bold text-slate-600 uppercase">Qualifications</label>
              <input value={docQualification} onChange={e => setDocQualification(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs" />
            </div>
            <div>
              <label className="mb-1.5 block text-[10px] font-bold text-slate-600 uppercase">Experience</label>
              <input value={docExperience} onChange={e => setDocExperience(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs" />
            </div>
            <div>
              <label className="mb-1.5 block text-[10px] font-bold text-slate-600 uppercase">Reg. No</label>
              <input value={docRegNo} onChange={e => setDocRegNo(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs" />
            </div>
            <div>
              <label className="mb-1.5 block text-[10px] font-bold text-slate-600 uppercase">Email</label>
              <input value={docEmail} onChange={e => setDocEmail(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs" />
            </div>
            <div className="flex items-center gap-3 sm:col-span-2 md:col-span-3">
              <div className="flex-1">
                <label className="mb-1.5 block text-[10px] font-bold text-slate-600 uppercase">Doctor Photo (Max 2MB)</label>
                <div className="relative">
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="doctor-photo-input" />
                  <label htmlFor="doctor-photo-input" className="flex items-center justify-center gap-2 rounded-xl border border-slate-250 bg-white px-3 py-2 text-xs font-medium text-slate-650 hover:bg-slate-50 cursor-pointer">
                    <Camera className="h-3.5 w-3.5 text-slate-450" /> Select & Adjust Image
                  </label>
                </div>
              </div>

              {docPhotoUrl && (
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-teal-500/20">
                  <img src={docPhotoUrl} className="h-full w-full object-cover" />
                  <button type="button" onClick={() => setDocPhotoUrl('')} className="absolute inset-0 bg-black/40 flex items-center justify-center text-white"><X className="h-3.5 w-3.5" /></button>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end pt-2 gap-2">
            {editingDocName && (
              <button type="button" onClick={handleCancelEdit} className="rounded-xl border border-slate-250 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer">Cancel</button>
            )}
            <button type="submit" disabled={isPending} className="rounded-xl bg-teal-500 px-4 py-2 text-xs font-semibold hover:bg-teal-400 cursor-pointer">
              {editingDocName ? 'Save Changes' : 'Save Doctor'}
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {dept.doctors?.map((doc: any) => (
          <div key={doc.name} className="group relative rounded-xl border border-slate-200 bg-white p-4 flex flex-col h-full justify-between">
            <div>
              <div className="absolute top-3 right-3 hidden gap-1.5 group-hover:flex z-20">
                <button type="button" onClick={() => handleEditDoctor(doc)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-teal-500/20 bg-teal-500/5 text-teal-600 dark:text-teal-400 hover:bg-teal-500/10 cursor-pointer"><Edit className="h-4 w-4" /></button>
                <button type="button" onClick={() => handleRemoveDoctor(doc.name)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-rose-500/20 bg-rose-500/5 text-rose-550 dark:text-rose-455 hover:bg-rose-500/10 cursor-pointer"><Trash2 className="h-4 w-4" /></button>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200">
                  {doc.photo ? (
                    <img src={doc.photo} alt={doc.name} className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-5 w-5 text-slate-400" />
                  )}
                </div>
                <div className="overflow-hidden">
                  <h5 className="font-bold text-slate-800 pr-10 text-sm truncate">{doc.name}</h5>
                  <p className="text-[10px] text-teal-600 font-semibold">{doc.designation}</p>
                </div>
              </div>
              <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-3 text-[11px] text-slate-600">
                <p><b>Qual:</b> {doc.qualification}</p>
                <p><b>Exp:</b> {doc.experience}</p>
                {doc.regNo && <p><b>Reg No:</b> {doc.regNo}</p>}
                {doc.email && <p><b>Email:</b> {doc.email}</p>}
                <p><b>Publications:</b> {doc.publications?.length || 0}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ServicesTab({ dept, onUpdate }: any) {
  const [facilities, setFacilities] = useState((dept.facilities || []).join('\n'))
  const [isPending, setIsPending] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsPending(true)
    const arr = facilities.split('\n').filter((s: string) => s.trim())
    const res = await updateDepartmentAction(dept.id, { facilities: arr })
    if (res.success) {
      toast.success('Services & Labs updated successfully')
      onUpdate({ ...dept, facilities: arr })
    } else {
      toast.error(res.error || 'Failed to update services & labs')
    }
    setIsPending(false)
  }

  return (
    <form onSubmit={handleSave} className="grid gap-6">
      <div className="rounded-2xl border border-slate-200/80 bg-slate-50/20 p-5 space-y-4">
        <label className="block text-xs font-bold text-slate-500 uppercase">Facilities (One per line)</label>
        <textarea rows={5} value={facilities} onChange={e => setFacilities(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm" />
        <div className="flex justify-end pt-2">
          <button type="submit" disabled={isPending} className="flex items-center gap-1.5 rounded-xl bg-teal-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-teal-400 disabled:opacity-50 cursor-pointer">
            <Save className="h-3.5 w-3.5" /> Save Services & Labs
          </button>
        </div>
      </div>
    </form>
  )
}

function StaffTab({ dept, onUpdate }: any) {
  const [activeFormId, setActiveFormId] = useState<string | null>(null)
  const [staffName, setStaffName] = useState('')
  const [staffPost, setStaffPost] = useState('')
  const [staffFile, setStaffFile] = useState<File | null>(null)
  const [staffPhotoUrl, setStaffPhotoUrl] = useState('')
  const [showCropper, setShowCropper] = useState(false)
  const [editingStaffIndex, setEditingStaffIndex] = useState<number | null>(null)
  const [isPending, setIsPending] = useState(false)

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!staffName.trim() || !staffPost.trim()) {
      toast.error('Please enter name and post')
      return
    }
    setIsPending(true)
    const newStaff: NonTeachingStaff = {
      name: staffName,
      post: staffPost,
      photo: staffPhotoUrl || undefined
    }

    const currentStaff = dept.nonTeachingStaff || []
    let updatedStaff = []

    if (editingStaffIndex !== null) {
      // Edit mode
      updatedStaff = currentStaff.map((s: any, idx: number) => idx === editingStaffIndex ? newStaff : s)
    } else {
      // Add mode
      updatedStaff = [...currentStaff, newStaff]
    }

    const res = await updateDepartmentAction(dept.id, { nonTeachingStaff: updatedStaff })
    if (res.success) {
      toast.success(editingStaffIndex !== null ? `Updated support staff ${staffName}` : `Successfully added ${staffName}`)
      onUpdate({ ...dept, nonTeachingStaff: updatedStaff })
      handleCancelEdit()
    } else {
      toast.error(res.error || 'Error saving support staff')
    }
    setIsPending(false)
  }

  const handleCancelEdit = () => {
    setStaffName('')
    setStaffPost('')
    setStaffPhotoUrl('')
    setEditingStaffIndex(null)
    setActiveFormId(null)
  }

  const handleEditStaff = (idx: number, staff: NonTeachingStaff) => {
    setStaffName(staff.name)
    setStaffPost(staff.post)
    setStaffPhotoUrl(staff.photo || '')
    setEditingStaffIndex(idx)
    setActiveFormId('add') // Open form
  }

  const handleRemoveStaff = async (index: number) => {
    const currentStaff = dept.nonTeachingStaff || []
    const staffMember = currentStaff[index]
    if (!confirm(`Are you sure you want to remove support staff member "${staffMember.name}"? This will permanently delete them from the roster.`)) return

    const updatedStaff = currentStaff.filter((_: any, idx: number) => idx !== index)
    const res = await updateDepartmentAction(dept.id, { nonTeachingStaff: updatedStaff })
    if (res.success) {
      toast.success(`Removed ${staffMember.name}`)
      onUpdate({ ...dept, nonTeachingStaff: updatedStaff })
    } else {
      toast.error(res.error || 'Failed to remove staff member')
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setStaffFile(e.target.files[0])
      setShowCropper(true)
    }
  }

  const handleCropDone = async (cropped: File) => {
    setShowCropper(false)
    const formData = new FormData()
    formData.append('file', cropped)
    try {
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
      const uploadData = await uploadRes.json()
      if (uploadData.success) {
        setStaffPhotoUrl(uploadData.url)
        toast.success('Support staff photo adjusted and ready!')
      } else {
        toast.error(uploadData.error || 'Upload failed')
      }
    } catch (e) {
      toast.error('Error uploading photo')
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-600">Non-Teaching & Support Staff</h4>
        <button onClick={() => { handleCancelEdit(); setActiveFormId('add'); }} className="flex items-center gap-1.5 rounded-xl bg-teal-500 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-teal-400">
          <UserPlus className="h-3.5 w-3.5" /> Add Support Staff
        </button>
      </div>

      {showCropper && (
        <ImageCropper
          file={staffFile}
          onCrop={handleCropDone}
          onCancel={() => setShowCropper(false)}
        />
      )}

      {activeFormId === 'add' && (
        <form onSubmit={handleAddStaff} className="mb-6 rounded-2xl border border-teal-500/20 bg-teal-500/5 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h5 className="text-xs font-bold uppercase text-teal-600">
              {editingStaffIndex !== null ? `Edit Support Staff: ${staffName}` : 'New Support Staff Member'}
            </h5>
            <button type="button" onClick={handleCancelEdit}><X className="h-4 w-4" /></button>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 items-end">
            <div>
              <label className="mb-1.5 block text-[10px] font-bold text-slate-600 uppercase">Staff Name</label>
              <input value={staffName} onChange={e => setStaffName(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs" />
            </div>
            <div>
              <label className="mb-1.5 block text-[10px] font-bold text-slate-600 uppercase">Post / Designation</label>
              <input value={staffPost} onChange={e => setStaffPost(e.target.value)} placeholder="e.g. Lab Technician, Clerk" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs" />
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="mb-1.5 block text-[10px] font-bold text-slate-600 uppercase">Profile Photo (Max 2MB)</label>
                <div className="relative">
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="staff-photo-input" />
                  <label htmlFor="staff-photo-input" className="flex items-center justify-center gap-2 rounded-xl border border-slate-250 bg-white px-3 py-2 text-xs font-medium text-slate-650 hover:bg-slate-50 cursor-pointer">
                    <Camera className="h-3.5 w-3.5 text-slate-450" /> Select Image
                  </label>
                </div>
              </div>

              {staffPhotoUrl && (
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-teal-500/20">
                  <img src={staffPhotoUrl} className="h-full w-full object-cover" />
                  <button type="button" onClick={() => setStaffPhotoUrl('')} className="absolute inset-0 bg-black/40 flex items-center justify-center text-white"><X className="h-3 w-3" /></button>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end pt-2 gap-2">
            {editingStaffIndex !== null && (
              <button type="button" onClick={handleCancelEdit} className="rounded-xl border border-slate-250 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer">Cancel</button>
            )}
            <button type="submit" disabled={isPending} className="rounded-xl bg-teal-500 px-4 py-2 text-xs font-semibold hover:bg-teal-400 cursor-pointer">
              {editingStaffIndex !== null ? 'Save Changes' : 'Save Support Staff'}
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {(dept.nonTeachingStaff || []).map((staff: any, idx: number) => (
          <div key={idx} className="group relative rounded-xl border border-slate-200 bg-white p-4 flex items-center gap-3">
            <div className="absolute top-3 right-3 hidden gap-1.5 group-hover:flex z-20">
              <button type="button" onClick={() => handleEditStaff(idx, staff)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-teal-500/20 bg-teal-500/5 text-teal-600 dark:text-teal-400 hover:bg-teal-500/10 cursor-pointer"><Edit className="h-4 w-4" /></button>
              <button type="button" onClick={() => handleRemoveStaff(idx)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-rose-500/20 bg-rose-500/5 text-rose-550 dark:text-rose-455 hover:bg-rose-500/10 cursor-pointer"><Trash2 className="h-4 w-4" /></button>
            </div>
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200">
              {staff.photo ? (
                <img src={staff.photo} alt={staff.name} className="h-full w-full object-cover" />
              ) : (
                <User className="h-5 w-5 text-slate-400" />
              )}
            </div>
            <div className="overflow-hidden">
              <h5 className="font-bold text-slate-800 pr-10 text-sm truncate">{staff.name}</h5>
              <p className="text-[10px] text-amber-600 font-semibold">{staff.post}</p>
            </div>
          </div>
        ))}
        {(dept.nonTeachingStaff || []).length === 0 && (
          <div className="col-span-full py-8 text-center text-xs text-slate-400 font-medium">
            No support staff members assigned yet.
          </div>
        )}
      </div>
    </div>
  )
}
