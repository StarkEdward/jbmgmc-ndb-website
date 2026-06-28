'use client'

import React, { useState } from 'react'
import { AboutSettings, AcademicsSettings, InstitutionMetrics } from '@/lib/db'
import { updateAboutSettingsAction, updateInstitutionMetricsAction, updateAcademicsSettingsAction } from '../actions'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Save, Plus, Trash2, Building, BookOpen, GraduationCap, Network } from 'lucide-react'

interface Props {
  initialAbout: AboutSettings
  initialAcademics: AcademicsSettings
  initialMetrics: InstitutionMetrics
}

export default function InstitutionClient({
  initialAbout,
  initialAcademics,
  initialMetrics
}: Props) {
  const [isPending, setIsPending] = useState(false)
  
  // State for forms
  const [about, setAbout] = useState(initialAbout)
  const [academics, setAcademics] = useState(initialAcademics)
  const [metrics, setMetrics] = useState(initialMetrics)

  // Save Handlers
  const handleSaveAbout = async () => {
    setIsPending(true)
    const res = await updateAboutSettingsAction(about)
    if (res.success) toast.success('About settings saved')
    else toast.error(res.error || 'Failed to save')
    setIsPending(false)
  }

  const handleSaveAcademics = async () => {
    setIsPending(true)
    const res = await updateAcademicsSettingsAction(academics)
    if (res.success) toast.success('Admissions settings saved')
    else toast.error(res.error || 'Failed to save')
    setIsPending(false)
  }

  const handleSaveMetrics = async () => {
    setIsPending(true)
    const res = await updateInstitutionMetricsAction(metrics)
    if (res.success) toast.success('Institution metrics saved')
    else toast.error(res.error || 'Failed to save')
    setIsPending(false)
  }



  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">Institution Data Hub</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Centralized management for all college metrics, stats, and core data used across the website.
        </p>
      </div>

      <Tabs defaultValue="metrics" className="space-y-6">
        <TabsList className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl flex flex-wrap h-auto">
          <TabsTrigger value="metrics" className="rounded-lg gap-2"><Network className="h-4 w-4"/> Global Metrics</TabsTrigger>
          <TabsTrigger value="about" className="rounded-lg gap-2"><Building className="h-4 w-4"/> About Page</TabsTrigger>
          <TabsTrigger value="academics" className="rounded-lg gap-2"><GraduationCap className="h-4 w-4"/> Admissions</TabsTrigger>
        </TabsList>

        {/* GLOBAL METRICS TAB */}
        <TabsContent value="metrics" className="space-y-6">
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-6">Institution Global Metrics</h2>
            
            <div className="space-y-8">
              {/* Academic Stats */}
              <div>
                <h3 className="text-sm font-semibold text-teal-600 dark:text-teal-400 mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">Academic Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">MBBS Seats</label>
                    <input type="number" value={metrics.academicStats.ugSeats} onChange={e => setMetrics({...metrics, academicStats: {...metrics.academicStats, ugSeats: parseInt(e.target.value) || 0}})} className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent px-4 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">PG Seats</label>
                    <input type="number" value={metrics.academicStats.pgSeats} onChange={e => setMetrics({...metrics, academicStats: {...metrics.academicStats, pgSeats: parseInt(e.target.value) || 0}})} className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent px-4 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Nursing Seats</label>
                    <input type="number" value={metrics.academicStats.nursingSeats} onChange={e => setMetrics({...metrics, academicStats: {...metrics.academicStats, nursingSeats: parseInt(e.target.value) || 0}})} className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent px-4 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Paramedical Seats</label>
                    <input type="number" value={metrics.academicStats.paramedicalSeats} onChange={e => setMetrics({...metrics, academicStats: {...metrics.academicStats, paramedicalSeats: parseInt(e.target.value) || 0}})} className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent px-4 py-2" />
                  </div>
                  <div>
                    <label className="flex items-center justify-between text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
                      <span>Faculty Members</span>
                      <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full">Auto-calculated</span>
                    </label>
                    <input type="number" disabled value={metrics.academicStats.facultyMembers} className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 py-2 opacity-70 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="flex items-center justify-between text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
                      <span>Departments</span>
                      <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full">Auto-calculated</span>
                    </label>
                    <input type="number" disabled value={metrics.academicStats.departments} className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 py-2 opacity-70 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Current Enrolled Students</label>
                    <input type="number" value={metrics.academicStats.currentStudents} onChange={e => setMetrics({...metrics, academicStats: {...metrics.academicStats, currentStudents: parseInt(e.target.value) || 0}})} className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent px-4 py-2" />
                  </div>
                </div>
              </div>

              {/* Hospital Stats */}
              <div>
                <h3 className="text-sm font-semibold text-teal-600 dark:text-teal-400 mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">Hospital Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Total Beds</label>
                    <input type="number" value={metrics.hospitalStats.beds} onChange={e => setMetrics({...metrics, hospitalStats: {...metrics.hospitalStats, beds: parseInt(e.target.value) || 0}})} className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent px-4 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">ICU Beds</label>
                    <input type="number" value={metrics.hospitalStats.icuBeds} onChange={e => setMetrics({...metrics, hospitalStats: {...metrics.hospitalStats, icuBeds: parseInt(e.target.value) || 0}})} className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent px-4 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Operation Theaters</label>
                    <input type="number" value={metrics.hospitalStats.operationTheaters} onChange={e => setMetrics({...metrics, hospitalStats: {...metrics.hospitalStats, operationTheaters: parseInt(e.target.value) || 0}})} className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent px-4 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Specialist Divisions</label>
                    <input type="number" value={metrics.hospitalStats.specialties} onChange={e => setMetrics({...metrics, hospitalStats: {...metrics.hospitalStats, specialties: parseInt(e.target.value) || 0}})} className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent px-4 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Daily Outpatients</label>
                    <input type="number" value={metrics.hospitalStats.dailyOutpatients} onChange={e => setMetrics({...metrics, hospitalStats: {...metrics.hospitalStats, dailyOutpatients: parseInt(e.target.value) || 0}})} className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent px-4 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Daily Inpatients</label>
                    <input type="number" value={metrics.hospitalStats.dailyInpatients} onChange={e => setMetrics({...metrics, hospitalStats: {...metrics.hospitalStats, dailyInpatients: parseInt(e.target.value) || 0}})} className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent px-4 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Daily Emergencies</label>
                    <input type="number" value={metrics.hospitalStats.dailyEmergencies} onChange={e => setMetrics({...metrics, hospitalStats: {...metrics.hospitalStats, dailyEmergencies: parseInt(e.target.value) || 0}})} className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent px-4 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Surgeries / Month</label>
                    <input type="number" value={metrics.hospitalStats.surgeriesPerMonth} onChange={e => setMetrics({...metrics, hospitalStats: {...metrics.hospitalStats, surgeriesPerMonth: parseInt(e.target.value) || 0}})} className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent px-4 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Rural/Urban Health Centers</label>
                    <input type="number" value={metrics.hospitalStats.ruralHealthCenters} onChange={e => setMetrics({...metrics, hospitalStats: {...metrics.hospitalStats, ruralHealthCenters: parseInt(e.target.value) || 0}})} className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent px-4 py-2" />
                  </div>
                </div>
              </div>

              {/* Campus Stats */}
              <div>
                <h3 className="text-sm font-semibold text-teal-600 dark:text-teal-400 mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">Campus Infrastructure</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Campus Area (Acres)</label>
                    <input type="number" value={metrics.campusStats.campusAcres} onChange={e => setMetrics({...metrics, campusStats: {...metrics.campusStats, campusAcres: parseInt(e.target.value) || 0}})} className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent px-4 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Built-up Area (sqm)</label>
                    <input type="number" value={metrics.campusStats.builtUpArea} onChange={e => setMetrics({...metrics, campusStats: {...metrics.campusStats, builtUpArea: parseInt(e.target.value) || 0}})} className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent px-4 py-2" />
                  </div>
                  <div>
                    <label className="flex items-center justify-between text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
                      <span>Hostel Capacity</span>
                      <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full">Auto-calculated</span>
                    </label>
                    <input type="number" disabled value={metrics.campusStats.hostelCapacity} className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 py-2 opacity-70 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Library Books</label>
                    <input type="number" value={metrics.campusStats.libraryBooks} onChange={e => setMetrics({...metrics, campusStats: {...metrics.campusStats, libraryBooks: parseInt(e.target.value) || 0}})} className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent px-4 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Laboratories</label>
                    <input type="number" value={metrics.campusStats.laboratories} onChange={e => setMetrics({...metrics, campusStats: {...metrics.campusStats, laboratories: parseInt(e.target.value) || 0}})} className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent px-4 py-2" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button 
                onClick={handleSaveMetrics} 
                disabled={isPending}
                className="flex items-center gap-2 rounded-xl bg-teal-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-teal-600 transition-colors disabled:opacity-50"
              >
                <Save className="h-4 w-4" /> Save Global Metrics
              </button>
            </div>
          </div>
        </TabsContent>

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
      </Tabs>
    </div>
  )
}
