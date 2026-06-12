'use client'

import React, { useState } from 'react'
import { Department, Doctor, Publication, DesignationDuty, NonTeachingStaff } from '@/lib/db'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { 
  Building2, UserPlus, Trash2, Edit, X, Award, Briefcase, GraduationCap, 
  CheckSquare, BookOpen, Stethoscope, FileText, FlaskConical, Users, Save, ListChecks
} from 'lucide-react'
import { 
  updateDepartmentAction, 
  addDoctorAction, 
  removeDoctorAction, 
  updateDoctorAction 
} from './actions'

interface Props {
  department: Department
  onUpdate: (updated: Department) => void
}

export default function DepartmentEditor({ department, onUpdate }: Props) {
  const [isPending, setIsPending] = useState(false)

  // -- Handlers for basic array strings --
  const handleSaveStrings = async (field: keyof Department, value: string) => {
    setIsPending(true)
    const arr = value.split('\n').filter(s => s.trim())
    const res = await updateDepartmentAction(department.id, { [field]: arr })
    if (res.success) {
      toast.success(`${field} updated`)
      onUpdate({ ...department, [field]: arr })
    } else {
      toast.error('Failed to update')
    }
    setIsPending(false)
  }

  const handleSaveText = async (field: keyof Department, value: string) => {
    setIsPending(true)
    const res = await updateDepartmentAction(department.id, { [field]: value })
    if (res.success) {
      toast.success(`${field} updated`)
      onUpdate({ ...department, [field]: value })
    } else {
      toast.error('Failed to update')
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
          <OverviewTab dept={department} onSaveText={handleSaveText} isPending={isPending} />
        </TabsContent>

        <TabsContent value="academic" className="space-y-6">
          <AcademicTab dept={department} onSaveStrings={handleSaveStrings} isPending={isPending} />
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

function OverviewTab({ dept, onSaveText, isPending }: any) {
  const [name, setName] = useState(dept.name || '')
  const [desc, setDesc] = useState(dept.description || '')
  const [fullDesc, setFullDesc] = useState(dept.fullDescription || '')
  
  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/20 dark:bg-slate-900/20 p-5 space-y-4">
      <div>
        <label className="mb-2 block text-xs font-bold text-slate-500 uppercase">Department Name</label>
        <input value={name} onChange={e => setName(e.target.value)} onBlur={() => onSaveText('name', name)} className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 text-sm" />
      </div>
      <div>
        <label className="mb-2 block text-xs font-bold text-slate-500 uppercase">Short Description</label>
        <input value={desc} onChange={e => setDesc(e.target.value)} onBlur={() => onSaveText('description', desc)} className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 text-sm" />
      </div>
      <div>
        <label className="mb-2 block text-xs font-bold text-slate-500 uppercase">Full Overview</label>
        <textarea rows={6} value={fullDesc} onChange={e => setFullDesc(e.target.value)} onBlur={() => onSaveText('fullDescription', fullDesc)} className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 text-sm" />
      </div>
    </div>
  )
}

function AcademicTab({ dept, onSaveStrings, isPending }: any) {
  const [goals, setGoals] = useState((dept.goals || []).join('\n'))
  const [objectives, setObjectives] = useState((dept.objectives || []).join('\n'))
  const [skills, setSkills] = useState((dept.skills || []).join('\n'))
  const [academic, setAcademic] = useState((dept.academicActivities || []).join('\n'))

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/20 dark:bg-slate-900/20 p-5 space-y-4">
        <label className="block text-xs font-bold text-slate-500 uppercase">Department Goals (One per line)</label>
        <textarea rows={5} value={goals} onChange={e => setGoals(e.target.value)} onBlur={() => onSaveStrings('goals', goals)} className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 text-sm" />
      </div>
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/20 dark:bg-slate-900/20 p-5 space-y-4">
        <label className="block text-xs font-bold text-slate-500 uppercase">Educational Objectives (One per line)</label>
        <textarea rows={5} value={objectives} onChange={e => setObjectives(e.target.value)} onBlur={() => onSaveStrings('objectives', objectives)} className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 text-sm" />
      </div>
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/20 dark:bg-slate-900/20 p-5 space-y-4">
        <label className="block text-xs font-bold text-slate-500 uppercase">Key Competencies & Skills (One per line)</label>
        <textarea rows={5} value={skills} onChange={e => setSkills(e.target.value)} onBlur={() => onSaveStrings('skills', skills)} className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 text-sm" />
      </div>
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/20 dark:bg-slate-900/20 p-5 space-y-4">
        <label className="block text-xs font-bold text-slate-500 uppercase">Academic Activities (One per line)</label>
        <textarea rows={5} value={academic} onChange={e => setAcademic(e.target.value)} onBlur={() => onSaveStrings('academicActivities', academic)} className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 text-sm" />
      </div>
    </div>
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
      email: docEmail
    }

    const res = await addDoctorAction(dept.id, newDoc)
    if (res.success) {
      toast.success(`Successfully added ${docName}`)
      onUpdate({ ...dept, doctors: [...(dept.doctors || []), newDoc] })
      setDocName(''); setDocQualification(''); setDocExperience(''); setDocRegNo(''); setDocEmail('');
      setActiveFormId(null)
    } else toast.error('Error adding doctor')
    setIsPending(false)
  }

  const handleRemoveDoctor = async (doctorName: string) => {
    if (!confirm(`Remove ${doctorName}?`)) return
    const res = await removeDoctorAction(dept.id, doctorName)
    if (res.success) {
      toast.success(`Removed ${doctorName}`)
      onUpdate({ ...dept, doctors: dept.doctors.filter((d: any) => d.name !== doctorName) })
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-600">Faculty Roster</h4>
        <button onClick={() => setActiveFormId('add')} className="flex items-center gap-1.5 rounded-xl bg-teal-500 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-teal-400">
          <UserPlus className="h-3.5 w-3.5" /> Assign Staff
        </button>
      </div>

      {activeFormId === 'add' && (
        <form onSubmit={handleAddDoctor} className="mb-6 rounded-2xl border border-teal-500/20 bg-teal-500/5 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h5 className="text-xs font-bold uppercase text-teal-600">Add Staff Member</h5>
            <button type="button" onClick={() => setActiveFormId(null)}><X className="h-4 w-4" /></button>
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
          </div>
          <div className="flex justify-end pt-2">
            <button type="submit" disabled={isPending} className="rounded-xl bg-teal-500 px-4 py-2 text-xs font-semibold hover:bg-teal-400">Save</button>
          </div>
        </form>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {dept.doctors?.map((doc: any) => (
          <div key={doc.name} className="group relative rounded-xl border border-slate-200 bg-white p-4">
             <div className="absolute top-3 right-3 hidden gap-1 group-hover:flex">
                <button onClick={() => handleRemoveDoctor(doc.name)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-rose-500/20 bg-rose-500/5 text-rose-400"><Trash2 className="h-4 w-4" /></button>
              </div>
              <h5 className="font-bold text-slate-800 pr-10 text-sm">{doc.name}</h5>
              <p className="mt-1 text-xs text-teal-600 font-semibold">{doc.designation}</p>
              <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-3 text-[11px] text-slate-600">
                <p><b>Qual:</b> {doc.qualification}</p>
                <p><b>Exp:</b> {doc.experience}</p>
                {doc.regNo && <p><b>Reg No:</b> {doc.regNo}</p>}
                {doc.email && <p><b>Email:</b> {doc.email}</p>}
                <p><b>Publications:</b> {doc.publications?.length || 0}</p>
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

  const handleSaveStrings = async (field: string, value: string) => {
    setIsPending(true)
    const arr = value.split('\n').filter(s => s.trim())
    const res = await updateDepartmentAction(dept.id, { [field]: arr })
    if (res.success) onUpdate({ ...dept, [field]: arr })
    setIsPending(false)
  }

  return (
    <div className="grid gap-6">
      <div className="rounded-2xl border border-slate-200/80 bg-slate-50/20 p-5 space-y-4">
        <label className="block text-xs font-bold text-slate-500 uppercase">Facilities (One per line)</label>
        <textarea rows={5} value={facilities} onChange={e => setFacilities(e.target.value)} onBlur={() => handleSaveStrings('facilities', facilities)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm" />
      </div>
    </div>
  )
}

function StaffTab({ dept, onUpdate }: any) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-slate-50/20 p-5 space-y-4 text-sm text-slate-600">
      <p>Non-teaching staff and duties management UI goes here.</p>
      <p><i>Note: Array object editors (Services, Labs, Staff) require complex nested mapping which can be built out iteratively.</i></p>
    </div>
  )
}
