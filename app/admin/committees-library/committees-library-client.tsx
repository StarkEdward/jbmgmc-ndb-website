"use client"

import React, { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CommitteeItem, CommitteeMember, LibraryInfo, InstitutionMetrics } from "@/lib/db"
import { updateInstitutionMetricsAction } from "../actions"
import {
  updateLibraryInfoAction,
  updateCommitteeChairpersonAction,
  addCommitteeMemberAction,
  removeCommitteeMemberAction,
  updateCommitteeMemberAction,
} from "./actions"
import {
  Shield,
  BookOpen,
  Plus,
  Trash2,
  Edit2,
  Save,
  Phone,
  UserPlus,
  Clock,
  ClipboardList,
  ChevronRight,
  ShieldAlert,
  Award,
} from "lucide-react"

interface CommitteesLibraryClientProps {
  initialCommittees: CommitteeItem[]
  initialLibraryInfo: LibraryInfo
  initialMetrics: InstitutionMetrics
}

export default function CommitteesLibraryClient({
  initialCommittees,
  initialLibraryInfo,
  initialMetrics
}: CommitteesLibraryClientProps) {
  const router = useRouter()
  
  // State for safety committees
  const [committees, setCommittees] = useState<CommitteeItem[]>(initialCommittees)
  const [activeCommitteeId, setActiveCommitteeId] = useState<string>("anti-ragging")
  
  // State for active committee edit fields
  const activeCommittee = committees.find((c) => c.id === activeCommitteeId) || committees[0]
  const [chairperson, setChairperson] = useState(activeCommittee?.chairperson || "")
  const [helpline, setHelpline] = useState(activeCommittee?.helpline || "")
  
  const [newMember, setNewMember] = useState({
    name: "",
    designation: "",
    role: "",
    phone: "",
  })
  const [editingMemberName, setEditingMemberName] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  // State for Library Info
  const [libraryInfo, setLibraryInfo] = useState<LibraryInfo>(initialLibraryInfo)
  const [metrics, setMetrics] = useState<InstitutionMetrics>(initialMetrics)
  const [newRule, setNewRule] = useState("")
  const [newTiming, setNewTiming] = useState({ day: "", hours: "" })

  const [savingLibrary, setSavingLibrary] = useState(false)
  const [savingChairperson, setSavingChairperson] = useState(false)
  const [addingMember, setAddingMember] = useState(false)

  // Switch active committee handler
  const handleCommitteeSwitch = (id: string) => {
    setActiveCommitteeId(id)
    const target = committees.find((c) => c.id === id)
    if (target) {
      setChairperson(target.chairperson || "")
      setHelpline(target.helpline || "")
    }
  }

  // Update active committee chairperson and helpline
  const handleUpdateChairperson = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!chairperson.trim()) {
      toast.error("Chairperson name cannot be empty")
      return
    }
    setSavingChairperson(true)
    try {
      const res = await updateCommitteeChairpersonAction(activeCommitteeId, chairperson, helpline)
      if (res.success) {
        toast.success("Committee chairperson details updated successfully")
        // Update local state
        setCommittees(
          committees.map((c) =>
            c.id === activeCommitteeId ? { ...c, chairperson, helpline } : c
          )
        )
        router.refresh()
      } else {
        toast.error(res.error || "Failed to update chairperson details")
      }
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong")
    } finally {
      setSavingChairperson(false)
    }
  }

  // Add committee member
  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMember.name.trim() || !newMember.designation.trim() || !newMember.role.trim()) {
      toast.error("Please fill in all member fields")
      return
    }
    setAddingMember(true)
    try {
      const memberObj: CommitteeMember = {
        name: newMember.name,
        designation: newMember.designation,
        role: newMember.role,
        ...(newMember.phone.trim() ? { phone: newMember.phone.trim() } : {}),
      }
      
      if (editingMemberName) {
        const res = await updateCommitteeMemberAction(activeCommitteeId, editingMemberName, memberObj)
        if (res.success) {
          toast.success(`${newMember.name} updated successfully`)
          setCommittees(
            committees.map((c) =>
              c.id === activeCommitteeId
                ? {
                    ...c,
                    members: c.members.map((m) =>
                      m.name === editingMemberName ? memberObj : m
                    ),
                  }
                : c
            )
          )
          setNewMember({ name: "", designation: "", role: "", phone: "" })
          setEditingMemberName(null)
          router.refresh()
        } else {
          toast.error(res.error || "Failed to update committee member")
        }
      } else {
        const res = await addCommitteeMemberAction(activeCommitteeId, memberObj)
        if (res.success) {
          toast.success(`${newMember.name} added to ${activeCommittee.name}`)
          // Update local state
          setCommittees(
            committees.map((c) =>
              c.id === activeCommitteeId ? { ...c, members: [...c.members, memberObj] } : c
            )
          )
          setNewMember({ name: "", designation: "", role: "", phone: "" })
          router.refresh()
        } else {
          toast.error(res.error || "Failed to add committee member")
        }
      }
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong")
    } finally {
      setAddingMember(false)
    }
  }

  // Remove committee member
  const handleRemoveMember = async (memberName: string) => {
    if (!confirm(`Are you sure you want to remove ${memberName} from this committee?`)) {
      return
    }
    try {
      const res = await removeCommitteeMemberAction(activeCommitteeId, memberName)
      if (res.success) {
        toast.success(`${memberName} removed successfully`)
        // Update local state
        setCommittees(
          committees.map((c) =>
            c.id === activeCommitteeId
              ? { ...c, members: c.members.filter((m) => m.name !== memberName) }
              : c
          )
        )
        router.refresh()
      } else {
        toast.error(res.error || "Failed to remove member")
      }
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong")
    }
  }

  // Save Library general stats
  const handleSaveLibraryStats = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingLibrary(true)
    try {
      const p1 = updateLibraryInfoAction({
        journalsCount: Number(libraryInfo.journalsCount),
        newspapersCount: Number(libraryInfo.newspapersCount),
        knimbusUrl: libraryInfo.knimbusUrl,
        introText: libraryInfo.introText
      })
      
      const p2 = updateInstitutionMetricsAction(metrics)
      
      const [res1, res2] = await Promise.all([p1, p2])
      
      if (res1.success && res2.success) {
        toast.success("Library inventory details saved")
        router.refresh()
      } else {
        const errorMsg = [
          !res1.success && (res1.error || "Failed to save library stats"),
          !res2.success && (res2.error || "Failed to save institution metrics")
        ].filter(Boolean).join(". ")
        toast.error(errorMsg || "Failed to save library stats")
      }
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong")
    } finally {
      setSavingLibrary(false)
    }
  }

  // Add library rule
  const handleAddRule = async () => {
    if (!newRule.trim()) return
    const updatedRules = [...(libraryInfo.rules || []), newRule.trim()]
    const res = await updateLibraryInfoAction({ rules: updatedRules })
    if (res.success) {
      setLibraryInfo({ ...libraryInfo, rules: updatedRules })
      setNewRule("")
      toast.success("Library rule appended")
      router.refresh()
    } else {
      toast.error(res.error || "Failed to add library rule")
    }
  }

  // Remove library rule
  const handleRemoveRule = async (idx: number) => {
    const updatedRules = (libraryInfo.rules || []).filter((_, i) => i !== idx)
    const res = await updateLibraryInfoAction({ rules: updatedRules })
    if (res.success) {
      setLibraryInfo({ ...libraryInfo, rules: updatedRules })
      toast.success("Library rule removed")
      router.refresh()
    } else {
      toast.error(res.error || "Failed to remove library rule")
    }
  }

  // Add library timing
  const handleAddTiming = async () => {
    if (!newTiming.day.trim() || !newTiming.hours.trim()) {
      toast.error("Please fill in both day and operating hours")
      return
    }
    const updatedTimings = [...(libraryInfo.timings || []), { ...newTiming }]
    const res = await updateLibraryInfoAction({ timings: updatedTimings })
    if (res.success) {
      setLibraryInfo({ ...libraryInfo, timings: updatedTimings })
      setNewTiming({ day: "", hours: "" })
      toast.success("Library timing added")
      router.refresh()
    } else {
      toast.error(res.error || "Failed to add library timing")
    }
  }

  // Remove library timing
  const handleRemoveTiming = async (idx: number) => {
    const updatedTimings = (libraryInfo.timings || []).filter((_, i) => i !== idx)
    const res = await updateLibraryInfoAction({ timings: updatedTimings })
    if (res.success) {
      setLibraryInfo({ ...libraryInfo, timings: updatedTimings })
      toast.success("Library timing removed")
      router.refresh()
    } else {
      toast.error(res.error || "Failed to remove library timing")
    }
  }

  return (
    <div className="space-y-10">
      {/* Top Header Panel */}
      <div className="flex flex-col gap-2 border-b pb-6 dark:border-slate-800">
        <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
          Committees &amp; Library Control Desk
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Supervise the official college mandates, safety committee rosters, and library inventory assets dynamically.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Safety Committees Console (Column Span: 7) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 shadow-sm backdrop-blur">
            <div className="flex items-center gap-3 border-b pb-4 mb-6 dark:border-slate-800">
              <div className="p-2 bg-teal-500/10 text-teal-600 rounded-lg">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Safety Committees &amp; Roster Controls</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">Manage members and helplines for anti-ragging and women safety cells.</p>
              </div>
            </div>

            {/* Committee Tabs */}
            <div className="flex gap-2 flex-wrap mb-6 bg-slate-100 dark:bg-slate-950 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
              {committees.map((comm) => {
                const isActive = comm.id === activeCommitteeId
                return (
                  <button
                    key={comm.id}
                    onClick={() => handleCommitteeSwitch(comm.id)}
                    className={`flex-1 min-w-[120px] text-xs font-semibold py-2 px-3 rounded-lg transition-all cursor-pointer ${
                      isActive
                        ? "bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow shadow-slate-200/50 dark:shadow-none ring-1 ring-slate-200 dark:ring-slate-850"
                        : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-800 dark:text-slate-200"
                    }`}
                  >
                    {comm.name.replace(" Committee", "")}
                  </button>
                )
              })}
            </div>

            {/* Committee Chair & Helpline Form */}
            {activeCommittee && (
              <form onSubmit={handleUpdateChairperson} className="space-y-4 bg-slate-50/50 dark:bg-slate-950/20 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/40 mb-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="chair">Chairperson Profile</Label>
                    <Input
                      id="chair"
                      value={chairperson}
                      onChange={(e) => setChairperson(e.target.value)}
                      placeholder="e.g. Dr. Name (Dean)"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="help">Emergency Helpline</Label>
                    <Input
                      id="help"
                      value={helpline}
                      onChange={(e) => setHelpline(e.target.value)}
                      placeholder="e.g. 1800-XXX-XXXX"
                    />
                  </div>
                </div>
                <Button type="submit" size="sm" className="w-full flex items-center justify-center gap-1.5" disabled={savingChairperson}>
                  <Save className="w-3.5 h-3.5" /> {savingChairperson ? "Saving..." : "Save Chairperson & Helpline"}
                </Button>
              </form>
            )}

            {/* Active Members Table */}
            {activeCommittee && (
              <div className="space-y-4">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1">
                  Active Roster Roster ({activeCommittee.members?.length || 0})
                </h4>

                <div className="rounded-xl border bg-slate-50/30 dark:bg-slate-950/20 overflow-hidden overflow-x-auto">
                  <table className="w-full min-w-[540px] border-collapse text-left text-xs">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-slate-900 text-slate-500 border-b border-slate-200 dark:border-slate-800">
                        <th className="px-4 py-3 font-semibold">Member Name</th>
                        <th className="px-4 py-3 font-semibold">Designation / Org</th>
                        {activeCommitteeId === 'gender-harassment' && (
                          <th className="px-4 py-3 font-semibold">Phone (Optional)</th>
                        )}
                        <th className="px-4 py-3 font-semibold">Role</th>
                        <th className="px-4 py-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {activeCommittee.members && activeCommittee.members.length > 0 ? (
                        activeCommittee.members.map((member, idx) => (
                          <tr key={idx} className="hover:bg-slate-100/30 dark:hover:bg-slate-50/10 dark:bg-slate-900/10">
                            <td className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">{member.name}</td>
                            <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{member.designation}</td>
                            {activeCommitteeId === 'gender-harassment' && (
                              <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{member.phone || "-"}</td>
                            )}
                            <td className="px-4 py-3">
                              <span className="inline-block px-2 py-0.5 rounded-full text-[10px] bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                                {member.role}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right flex justify-end gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingMemberName(member.name)
                                  setNewMember({
                                    name: member.name,
                                    designation: member.designation,
                                    role: member.role,
                                    phone: member.phone || ""
                                  })
                                  setTimeout(() => {
                                    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                                  }, 50)
                                }}
                                className="p-1 rounded text-teal-600 hover:bg-teal-500/10 transition-colors cursor-pointer"
                                title="Edit member"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveMember(member.name)}
                                className="p-1 rounded text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                                title="Remove member"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={activeCommitteeId === 'gender-harassment' ? 5 : 4} className="px-4 py-6 text-center text-slate-600 dark:text-slate-400">
                            No members assigned to this committee.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Add/Edit Committee Representative */}
                <form ref={formRef} onSubmit={handleAddMember} className="border border-dashed border-slate-200 dark:border-slate-800 p-4 rounded-xl space-y-4 transition-all">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-xs text-slate-500 flex items-center gap-1">
                      {editingMemberName ? <Edit2 className="w-3.5 h-3.5 text-teal-600" /> : <UserPlus className="w-3.5 h-3.5 text-teal-600" />} 
                      {editingMemberName ? "Edit Committee Representative" : "Add New Committee Representative"}
                    </h4>
                    {editingMemberName && (
                      <button 
                        type="button" 
                        onClick={() => { setEditingMemberName(null); setNewMember({name: "", designation: "", role: "", phone: ""}); }} 
                        className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>
                  <div className={`grid gap-3 ${activeCommitteeId === 'gender-harassment' ? 'sm:grid-cols-4' : 'sm:grid-cols-3'}`}>
                    <div className="space-y-1">
                      <Label htmlFor="m-name" className="text-[11px]">Representative Name</Label>
                      <Input
                        id="m-name"
                        value={newMember.name}
                        onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                        placeholder="e.g. Dr. Jane Smith"
                        className="h-8 text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="m-desg" className="text-[11px]">Designation / Dept</Label>
                      <Input
                        id="m-desg"
                        value={newMember.designation}
                        onChange={(e) => setNewMember({ ...newMember, designation: e.target.value })}
                        placeholder="e.g. Assoc. Prof (ENT)"
                        className="h-8 text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="m-role" className="text-[11px]">Committee Role</Label>
                      <Input
                        id="m-role"
                        value={newMember.role}
                        onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                        placeholder="e.g. Co-ordinator / Member"
                        className="h-8 text-xs"
                      />
                    </div>
                    {activeCommitteeId === 'gender-harassment' && (
                      <div className="space-y-1">
                        <Label htmlFor="m-phone" className="text-[11px]">Phone (Optional)</Label>
                        <Input
                          id="m-phone"
                          value={newMember.phone}
                          onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                          placeholder="e.g. 9876543210"
                          className="h-8 text-xs"
                        />
                      </div>
                    )}
                  </div>
                  <Button type="submit" size="sm" className="w-full flex items-center justify-center gap-1 h-8 text-xs font-semibold" disabled={addingMember}>
                    {editingMemberName ? <Save className="w-3 h-3" /> : <Plus className="w-3 h-3" />} 
                    {addingMember ? "Saving..." : (editingMemberName ? "Update Committee Roster" : "Add to Committee Roster")}
                  </Button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Central Library Adjuster (Column Span: 5) */}
        <div className="lg:col-span-5 space-y-6">
          {/* General Stats & Knimbus */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 shadow-sm backdrop-blur">
            <div className="flex items-center gap-3 border-b pb-4 mb-6 dark:border-slate-800">
              <div className="p-2 bg-teal-500/10 text-teal-600 rounded-lg">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Central Library Resource Inventory</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">Instantly adjust textbook and portal metrics.</p>
              </div>
            </div>

            <form onSubmit={handleSaveLibraryStats} className="space-y-4">
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <Label htmlFor="c-books">Books Vol.</Label>
                  <Input
                    id="c-books"
                    type="number"
                    value={metrics.campusStats.libraryBooks}
                    onChange={(e) => setMetrics({ ...metrics, campusStats: { ...metrics.campusStats, libraryBooks: Number(e.target.value) } })}
                    className="h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="c-journ">Journals</Label>
                  <Input
                    id="c-journ"
                    type="number"
                    value={libraryInfo.journalsCount}
                    onChange={(e) => setLibraryInfo({ ...libraryInfo, journalsCount: Number(e.target.value) })}
                    className="h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="c-news">Newspapers</Label>
                  <Input
                    id="c-news"
                    type="number"
                    value={libraryInfo.newspapersCount}
                    onChange={(e) => setLibraryInfo({ ...libraryInfo, newspapersCount: Number(e.target.value) })}
                    className="h-9"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="c-intro">Introductory Text</Label>
                <textarea
                  id="c-intro"
                  value={libraryInfo.introText || ''}
                  onChange={(e) => setLibraryInfo({ ...libraryInfo, introText: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent px-4 py-2 text-sm focus:border-teal-500 focus:outline-none"
                  rows={3}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="c-knimbus">Knimbus Portal Login Gateway URL</Label>
                <Input
                  id="c-knimbus"
                  value={libraryInfo.knimbusUrl}
                  onChange={(e) => setLibraryInfo({ ...libraryInfo, knimbusUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <Button type="submit" size="sm" className="w-full flex items-center justify-center gap-1.5" disabled={savingLibrary}>
                <Save className="w-4 h-4" /> {savingLibrary ? "Saving..." : "Save Resource Metrics"}
              </Button>
            </form>
          </div>

          {/* Timetable Panel */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 shadow-sm backdrop-blur">
            <div className="flex items-center gap-3 border-b pb-4 mb-5 dark:border-slate-800">
              <div className="p-2 bg-teal-500/10 text-teal-600 rounded-lg">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base">Library Timetable Schedule</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">Configure operating days and hours.</p>
              </div>
            </div>

            <div className="space-y-3 mb-5">
              {libraryInfo.timings && libraryInfo.timings.map((time, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs"
                >
                  <div className="font-semibold text-slate-700 dark:text-slate-300">
                    {time.day}: <span className="font-normal text-slate-500 dark:text-slate-400">{time.hours}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveTiming(idx)}
                    className="p-1 rounded text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="border border-dashed p-3 rounded-xl space-y-3">
              <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
                <Input
                  placeholder="Day range"
                  value={newTiming.day}
                  onChange={(e) => setNewTiming({ ...newTiming, day: e.target.value })}
                  className="h-8 text-xs"
                />
                <Input
                  placeholder="Hours"
                  value={newTiming.hours}
                  onChange={(e) => setNewTiming({ ...newTiming, hours: e.target.value })}
                  className="h-8 text-xs"
                />
              </div>
              <Button type="button" onClick={handleAddTiming} size="sm" variant="outline" className="w-full text-xs h-8">
                <Plus className="w-3.5 h-3.5" /> Add Timing Entry
              </Button>
            </div>
          </div>

          {/* Rules and Code of Conduct Checklist */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 shadow-sm backdrop-blur">
            <div className="flex items-center gap-3 border-b pb-4 mb-5 dark:border-slate-800">
              <div className="p-2 bg-teal-500/10 text-teal-600 rounded-lg">
                <ClipboardList className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base">Regulations &amp; Rules</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">Add or edit student compliance regulations.</p>
              </div>
            </div>

            <div className="space-y-2.5 mb-5 max-h-56 overflow-y-auto pr-1">
              {libraryInfo.rules && libraryInfo.rules.map((rule, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs"
                >
                  <span className="text-slate-600 dark:text-slate-400 flex-1 leading-relaxed">{idx + 1}. {rule}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveRule(idx)}
                    className="p-1 rounded text-rose-500 hover:bg-rose-500/10 shrink-0 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Type new library policy..."
                value={newRule}
                onChange={(e) => setNewRule(e.target.value)}
                className="h-8 text-xs flex-1"
                onKeyDown={(e) => e.key === "Enter" && handleAddRule()}
              />
              <Button type="button" onClick={handleAddRule} size="sm" className="h-8 text-xs font-semibold px-3">
                <Plus className="w-3.5 h-3.5" /> Add
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
