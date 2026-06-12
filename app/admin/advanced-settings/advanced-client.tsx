'use client'

import React, { useState } from 'react'
import { AboutSettings, AcademicsSettings, CampusStats, LibraryInfo } from '@/lib/db'
import { updateAboutSettingsAction, updateCampusStatsAction, updateAcademicsSettingsAction, updateLibraryInfoAction } from '../actions'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Save, Plus, Trash2, Building, BookOpen, GraduationCap, Activity } from 'lucide-react'

interface Props {
  initialAbout: AboutSettings
  initialAcademics: AcademicsSettings
  initialStats: CampusStats
  initialLibrary: LibraryInfo
}

export default function AdvancedClient({
  initialAbout,
  initialAcademics,
  initialStats,
  initialLibrary
}: Props) {
  const [isPending, setIsPending] = useState(false)
  
  // State for forms
  const [about, setAbout] = useState(initialAbout)
  const [academics, setAcademics] = useState(initialAcademics)
  const [stats, setStats] = useState(initialStats)
  const [library, setLibrary] = useState(initialLibrary)

  // Save Handlers
  const handleSaveAbout = async () => {
    setIsPending(true)
    const res = await updateAboutSettingsAction(about)
    if (res.success) toast.success('About settings saved')
    else toast.error('Failed to save')
    setIsPending(false)
  }

  const handleSaveAcademics = async () => {
    setIsPending(true)
    const res = await updateAcademicsSettingsAction(academics)
    if (res.success) toast.success('Admissions settings saved')
    else toast.error('Failed to save')
    setIsPending(false)
  }

  const handleSaveStats = async () => {
    setIsPending(true)
    const res = await updateCampusStatsAction(stats)
    if (res.success) toast.success('Campus stats saved')
    else toast.error('Failed to save')
    setIsPending(false)
  }

  const handleSaveLibrary = async () => {
    setIsPending(true)
    const res = await updateLibraryInfoAction(library)
    if (res.success) toast.success('Library settings saved')
    else toast.error('Failed to save')
    setIsPending(false)
  }

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">Advanced Content Manager</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Manage deep content across public pages like About Us, Admissions, and Global Stats.
        </p>
      </div>

      <Tabs defaultValue="about" className="space-y-6">
        <TabsList className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl flex flex-wrap h-auto">
          <TabsTrigger value="about" className="rounded-lg gap-2"><Building className="h-4 w-4"/> About Page</TabsTrigger>
          <TabsTrigger value="academics" className="rounded-lg gap-2"><GraduationCap className="h-4 w-4"/> Admissions</TabsTrigger>
          <TabsTrigger value="library" className="rounded-lg gap-2"><BookOpen className="h-4 w-4"/> Library</TabsTrigger>
          <TabsTrigger value="stats" className="rounded-lg gap-2"><Activity className="h-4 w-4"/> Campus Stats</TabsTrigger>
        </TabsList>

        {/* ABOUT TAB */}
        <TabsContent value="about" className="space-y-6">
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4">Vision & Mission</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Vision Statement</label>
                <textarea 
                  value={about.vision} 
                  onChange={e => setAbout({...about, vision: e.target.value})} 
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent px-4 py-3 text-sm focus:border-teal-500 focus:outline-none"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Mission Statements (One per line)</label>
                <textarea 
                  value={about.mission.join('\n')} 
                  onChange={e => setAbout({...about, mission: e.target.value.split('\n')})} 
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent px-4 py-3 text-sm focus:border-teal-500 focus:outline-none"
                  rows={5}
                />
              </div>
            </div>

            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Milestones (Timeline)</h2>
                <button 
                  onClick={() => setAbout({...about, milestones: [...about.milestones, { year: '2025', title: 'New Event', description: '' }]})}
                  className="text-xs bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-1 font-semibold hover:bg-slate-200"
                >
                  <Plus className="h-3 w-3" /> Add Milestone
                </button>
              </div>
              <div className="space-y-4">
                {about.milestones.map((m, idx) => (
                  <div key={idx} className="flex gap-3 items-start border border-slate-100 dark:border-slate-800 p-4 rounded-xl">
                    <input 
                      value={m.year} 
                      onChange={e => { const newM = [...about.milestones]; newM[idx].year = e.target.value; setAbout({...about, milestones: newM}) }} 
                      className="w-24 rounded-lg border border-slate-200 bg-transparent px-3 py-2 text-sm" 
                      placeholder="Year" 
                    />
                    <div className="flex-1 space-y-2">
                      <input 
                        value={m.title} 
                        onChange={e => { const newM = [...about.milestones]; newM[idx].title = e.target.value; setAbout({...about, milestones: newM}) }} 
                        className="w-full rounded-lg border border-slate-200 bg-transparent px-3 py-2 text-sm font-bold" 
                        placeholder="Title" 
                      />
                      <textarea 
                        value={m.description} 
                        onChange={e => { const newM = [...about.milestones]; newM[idx].description = e.target.value; setAbout({...about, milestones: newM}) }} 
                        className="w-full rounded-lg border border-slate-200 bg-transparent px-3 py-2 text-sm" 
                        placeholder="Description" 
                        rows={2}
                      />
                    </div>
                    <button 
                      onClick={() => setAbout({...about, milestones: about.milestones.filter((_, i) => i !== idx)})}
                      className="text-rose-500 p-2 hover:bg-rose-50 rounded-lg mt-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button 
                onClick={handleSaveAbout} 
                disabled={isPending}
                className="flex items-center gap-2 rounded-xl bg-teal-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-teal-600 transition-colors disabled:opacity-50"
              >
                <Save className="h-4 w-4" /> Save About Settings
              </button>
            </div>
          </div>
        </TabsContent>

        {/* ACADEMICS TAB */}
        <TabsContent value="academics" className="space-y-6">
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4">Admissions Process</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Overview Text</label>
                <textarea 
                  value={academics.overviewText} 
                  onChange={e => setAcademics({...academics, overviewText: e.target.value})} 
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent px-4 py-3 text-sm focus:border-teal-500 focus:outline-none"
                  rows={3}
                />
              </div>
            </div>

            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Admission Steps</h2>
                <button 
                  onClick={() => setAcademics({...academics, admissionSteps: [...academics.admissionSteps, { step: academics.admissionSteps.length + 1, title: 'New Step', description: '' }]})}
                  className="text-xs bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-1 font-semibold hover:bg-slate-200"
                >
                  <Plus className="h-3 w-3" /> Add Step
                </button>
              </div>
              <div className="space-y-4">
                {academics.admissionSteps.map((m, idx) => (
                  <div key={idx} className="flex gap-3 items-start border border-slate-100 dark:border-slate-800 p-4 rounded-xl">
                    <div className="bg-teal-500 text-white font-bold h-8 w-8 rounded-full flex items-center justify-center shrink-0">
                      {m.step}
                    </div>
                    <div className="flex-1 space-y-2">
                      <input 
                        value={m.title} 
                        onChange={e => { const newM = [...academics.admissionSteps]; newM[idx].title = e.target.value; setAcademics({...academics, admissionSteps: newM}) }} 
                        className="w-full rounded-lg border border-slate-200 bg-transparent px-3 py-2 text-sm font-bold" 
                        placeholder="Step Title" 
                      />
                      <textarea 
                        value={m.description} 
                        onChange={e => { const newM = [...academics.admissionSteps]; newM[idx].description = e.target.value; setAcademics({...academics, admissionSteps: newM}) }} 
                        className="w-full rounded-lg border border-slate-200 bg-transparent px-3 py-2 text-sm" 
                        placeholder="Step Details" 
                        rows={2}
                      />
                    </div>
                    <button 
                      onClick={() => setAcademics({...academics, admissionSteps: academics.admissionSteps.filter((_, i) => i !== idx)})}
                      className="text-rose-500 p-2 hover:bg-rose-50 rounded-lg mt-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button 
                onClick={handleSaveAcademics} 
                disabled={isPending}
                className="flex items-center gap-2 rounded-xl bg-teal-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-teal-600 transition-colors disabled:opacity-50"
              >
                <Save className="h-4 w-4" /> Save Academics
              </button>
            </div>
          </div>
        </TabsContent>

        {/* CAMPUS STATS TAB */}
        <TabsContent value="stats" className="space-y-6">
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4">Global Campus Stats & Emergency Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Total Departments Count</label>
                <input value={stats.clinicalDepartmentsCount} onChange={e => setStats({...stats, clinicalDepartmentsCount: e.target.value})} className="w-full rounded-xl border border-slate-200 bg-transparent px-4 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Specialist Doctors Count</label>
                <input value={stats.specialistDoctorsCount} onChange={e => setStats({...stats, specialistDoctorsCount: e.target.value})} className="w-full rounded-xl border border-slate-200 bg-transparent px-4 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Total Hospital Beds</label>
                <input value={stats.bedsCount} onChange={e => setStats({...stats, bedsCount: e.target.value})} className="w-full rounded-xl border border-slate-200 bg-transparent px-4 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Hostel Buildings Count</label>
                <input value={stats.hostelBuildingsCount} onChange={e => setStats({...stats, hostelBuildingsCount: e.target.value})} className="w-full rounded-xl border border-slate-200 bg-transparent px-4 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Hostel Capacity</label>
                <input value={stats.hostelCapacityCount} onChange={e => setStats({...stats, hostelCapacityCount: e.target.value})} className="w-full rounded-xl border border-slate-200 bg-transparent px-4 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Meals Served Daily (Hostel)</label>
                <input value={stats.mealsDailyCount} onChange={e => setStats({...stats, mealsDailyCount: e.target.value})} className="w-full rounded-xl border border-slate-200 bg-transparent px-4 py-2" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Emergency Services Text (Departments Page)</label>
                <textarea value={stats.emergencyServicesText} onChange={e => setStats({...stats, emergencyServicesText: e.target.value})} className="w-full rounded-xl border border-slate-200 bg-transparent px-4 py-2" rows={3} />
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button 
                onClick={handleSaveStats} 
                disabled={isPending}
                className="flex items-center gap-2 rounded-xl bg-teal-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-teal-600 transition-colors disabled:opacity-50"
              >
                <Save className="h-4 w-4" /> Save Global Stats
              </button>
            </div>
          </div>
        </TabsContent>

        {/* LIBRARY TAB */}
        <TabsContent value="library" className="space-y-6">
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4">Library Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Total Books</label>
                <input type="number" value={library.booksCount} onChange={e => setLibrary({...library, booksCount: parseInt(e.target.value) || 0})} className="w-full rounded-xl border border-slate-200 bg-transparent px-4 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Total Journals</label>
                <input type="number" value={library.journalsCount} onChange={e => setLibrary({...library, journalsCount: parseInt(e.target.value) || 0})} className="w-full rounded-xl border border-slate-200 bg-transparent px-4 py-2" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Introductory Text</label>
                <textarea value={library.introText || ''} onChange={e => setLibrary({...library, introText: e.target.value})} className="w-full rounded-xl border border-slate-200 bg-transparent px-4 py-2" rows={3} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">KNimbus URL (e-Library)</label>
                <input value={library.knimbusUrl || ''} onChange={e => setLibrary({...library, knimbusUrl: e.target.value})} className="w-full rounded-xl border border-slate-200 bg-transparent px-4 py-2" />
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button 
                onClick={handleSaveLibrary} 
                disabled={isPending}
                className="flex items-center gap-2 rounded-xl bg-teal-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-teal-600 transition-colors disabled:opacity-50"
              >
                <Save className="h-4 w-4" /> Save Library Info
              </button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
