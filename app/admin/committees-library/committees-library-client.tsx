"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CommitteeItem, CommitteeMember, LibraryInfo } from "@/lib/db"
import {
  updateLibraryInfoAction,
  updateCommitteeChairpersonAction,
  addCommitteeMemberAction,
  removeCommitteeMemberAction,
} from "./actions"
import {
  Shield,
  BookOpen,
  Plus,
  Trash2,
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
}

export default function CommitteesLibraryClient({
  initialCommittees,
  initialLibraryInfo,
}: CommitteesLibraryClientProps) {
  const router = useRouter()
  
  // State for safety committees
  const [committees, setCommittees] = useState<CommitteeItem[]>(initialCommittees)
  const [activeCommitteeId, setActiveCommitteeId] = useState<string>("anti-ragging")
  
  // State for active committee edit fields
  const activeCommittee = committees.find((c) => c.id === activeCommitteeId) || committees[0]
  const [chairperson, setChairperson] = useState(activeCommittee?.chairperson || "")
  const [helpline, setHelpline] = useState(activeCommittee?.helpline || "")
  
  // New member form state
  const [newMember, setNewMember] = useState({
    name: "",
    designation: "",
    role: "",
  })

  // State for Library Info
  const [libraryInfo, setLibraryInfo] = useState<LibraryInfo>(initialLibraryInfo)
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
        toast.error("Failed to update chairperson details")
      }
    } catch (err) {
      toast.error("Something went wrong")
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
      }
      const res = await addCommitteeMemberAction(activeCommitteeId, memberObj)
      if (res.success) {
        toast.success(`${newMember.name} added to ${activeCommittee.name}`)
        // Update local state
        setCommittees(
          committees.map((c) =>
            c.id === activeCommitteeId ? { ...c, members: [...c.members, memberObj] } : c
          )
        )
        setNewMember({ name: "", designation: "", role: "" })
        router.refresh()
      } else {
        toast.error("Failed to add committee member")
      }
    } catch (err) {
      toast.error("Something went wrong")
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
        toast.error("Failed to remove member")
      }
    } catch (err) {
      toast.error("Something went wrong")
    }
  }

  // Save Library general stats
  const handleSaveLibraryStats = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingLibrary(true)
    try {
      const res = await updateLibraryInfoAction({
        booksCount: Number(libraryInfo.booksCount),
        journalsCount: Number(libraryInfo.journalsCount),
        newspapersCount: Number(libraryInfo.newspapersCount),
        knimbusUrl: libraryInfo.knimbusUrl,
      })
      if (res.success) {
        toast.success("Library inventory details saved")
        router.refresh()
      } else {
        toast.error("Failed to save library stats")
      }
    } catch (err) {
      toast.error("Something went wrong")
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
      toast.error("Failed to add library rule")
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
      toast.error("Failed to remove library rule")
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
      toast.error("Failed to add library timing")
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
      toast.error("Failed to remove library timing")
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

                <div className="rounded-xl border bg-slate-50/30 dark:bg-slate-950/20 overflow-hidden">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-slate-900 text-slate-500 border-b border-slate-200 dark:border-slate-800">
                        <th className="px-4 py-3 font-semibold">Member Name</th>
                        <th className="px-4 py-3 font-semibold">Designation / Org</th>
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
                            <td className="px-4 py-3">
                              <span className="inline-block px-2 py-0.5 rounded-full text-[10px] bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                                {member.role}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
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
                          <td colSpan={4} className="px-4 py-6 text-center text-slate-600 dark:text-slate-400">
                            No members assigned to this committee.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Add Committee Representative */}
                <form onSubmit={handleAddMember} className="border border-dashed border-slate-200 dark:border-slate-800 p-4 rounded-xl space-y-4">
                  <h4 className="font-semibold text-xs text-slate-500 flex items-center gap-1">
                    <UserPlus className="w-3.5 h-3.5 text-teal-600" /> Add New Committee Representative
                  </h4>
                  <div className="grid gap-3 sm:grid-cols-3">
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
                  </div>
                  <Button type="submit" size="sm" className="w-full flex items-center justify-center gap-1 h-8 text-xs font-semibold" disabled={addingMember}>
                    <Plus className="w-3 h-3" /> {addingMember ? "Adding..." : "Add to Committee Roster"}
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
              <div className="grid gap-4 grid-cols-3">
                <div className="space-y-1.5">
                  <Label htmlFor="c-books">Books Vol.</Label>
                  <Input
                    id="c-books"
                    type="number"
                    value={libraryInfo.booksCount}
                    onChange={(e) => setLibraryInfo({ ...libraryInfo, booksCount: Number(e.target.value) })}
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
              <div className="grid gap-2 grid-cols-2">
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
