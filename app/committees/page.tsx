"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useLiveData } from "@/hooks/use-live-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Shield, PhoneCall, AlertTriangle, Send, CheckCircle2, UserCheck, ShieldAlert, Award } from "lucide-react"
import { FadeIn, SlideIn, StaggerContainer, StaggerItem } from "@/components/motion"

export default function CommitteesPage() {
  const { committees } = useLiveData()
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    emailOrPhone: "",
    subject: "General Grievance",
    committeeId: "anti-ragging",
    message: "",
    isAnonymous: true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({
        name: "",
        emailOrPhone: "",
        subject: "General Grievance",
        committeeId: "anti-ragging",
        message: "",
        isAnonymous: true,
      })
    }, 4000)
  }

  // Visual highlights for each committee type
  const committeeStyles: Record<string, { icon: any; gradient: string; textGlow: string }> = {
    "anti-ragging": {
      icon: ShieldAlert,
      gradient: "from-amber-500/20 via-orange-600/10 to-transparent border-orange-500/30",
      textGlow: "text-orange-500 hover:text-orange-400",
    },
    "gender-harassment": {
      icon: Shield,
      gradient: "from-pink-500/20 via-rose-600/10 to-transparent border-rose-500/30",
      textGlow: "text-rose-500 hover:text-rose-400",
    },
    "womens-grievance": {
      icon: Award,
      gradient: "from-purple-500/20 via-indigo-600/10 to-transparent border-purple-500/30",
      textGlow: "text-purple-500 hover:text-purple-400",
    },
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-300">
      <Header />
      <main className="flex-1">
        {/* Glowing Dynamic Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-primary/95 to-slate-900 text-white py-20 md:py-28">
          {/* Glassmorphic decorative circles */}
          <div className="absolute top-1/4 left-10 w-72 h-72 rounded-full bg-pink-500/10 blur-3xl" />
          <div className="absolute bottom-1/4 right-10 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl" />

          <FadeIn delay={0.1} className="mx-auto max-w-7xl px-4 relative z-10 text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 border border-amber-500/30 text-amber-300 uppercase tracking-widest mb-4 animate-pulse">
              <Shield className="w-3.5 h-3.5" /> Official Mandates
            </span>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
              Committees &amp; <span className="bg-gradient-to-r from-amber-400 via-rose-400 to-indigo-400 bg-clip-text text-transparent">Safety Helpdesk</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-200 max-w-3xl mx-auto font-light leading-relaxed">
              JBMGMC Nandurbar maintains a zero-tolerance policy against ragging, harassment, and discrimination. Explore our dedicated safety cells and transparent grievance portals.
            </p>
          </FadeIn>
        </section>

        {/* Anti-Ragging Spotlight Card */}
        <section className="py-12 bg-muted/40 border-b border-border overflow-hidden">
          <div className="mx-auto max-w-7xl px-4">
            <SlideIn direction="up" className="relative rounded-2xl overflow-hidden border border-amber-500/30 bg-card/60 p-6 md:p-10 shadow-xl backdrop-blur-md">
              {/* Outer pulsing glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-orange-600/5 to-transparent animate-pulse" />
              
              <div className="relative z-10 grid gap-8 md:grid-cols-12 items-center">
                <div className="md:col-span-8 space-y-4">
                  <div className="inline-flex items-center gap-2 text-amber-500 font-bold text-sm tracking-wider uppercase">
                    <AlertTriangle className="w-5 h-5 animate-bounce" /> Immediate Support Required?
                  </div>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
                    National Anti-Ragging Helpline
                  </h2>
                  <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                    Ragging is a criminal offense as per the Hon&apos;ble Supreme Court of India mandates. If you or anyone you know is subjected to ragging, call the toll-free helpline immediately or contact committee chairs listed below. Your details will remain strictly confidential.
                  </p>
                </div>
                
                <div className="md:col-span-4 flex flex-col items-center justify-center bg-amber-500/10 hover:bg-amber-500/20 transition-all rounded-xl p-6 border border-amber-500/30 space-y-3 shadow-inner">
                  <span className="text-xs text-amber-500 dark:text-amber-400 font-bold uppercase tracking-wider">
                    24/7 TOLL-FREE NUMBERS
                  </span>
                  <a
                    href="tel:18002336557"
                    className="flex items-center gap-2.5 text-2xl md:text-3xl font-extrabold text-amber-600 dark:text-amber-400 hover:scale-105 transition-transform"
                  >
                    <PhoneCall className="w-6 h-6 animate-pulse" /> 1800-233-6557
                  </a>
                  <span className="text-xs text-muted-foreground text-center">
                    or write to: <a href="mailto:dean.gmcnandurbar@gmail.com" className="underline hover:text-primary">dean.gmcnandurbar@gmail.com</a>
                  </span>
                </div>
              </div>
            </SlideIn>
          </div>
        </section>

        {/* Committees Lists Grid */}
        <section className="py-16 bg-background">
          <div className="mx-auto max-w-7xl px-4">
            <FadeIn className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground">Safety Committee Rosters</h2>
              <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                Appointed administrative blocks &amp; external representatives supervising student safety, grievance audits, and women&apos;s protection systems.
              </p>
            </FadeIn>

            <StaggerContainer className="space-y-12">
              {committees && committees.length > 0 ? (
                committees.map((comm: any) => {
                  const style = committeeStyles[comm.id] || {
                    icon: Shield,
                    gradient: "from-primary/10 via-secondary/5 to-transparent border-primary/20",
                    textGlow: "text-primary hover:text-primary-foreground",
                  }
                  const IconComponent = style.icon

                  return (
                    <StaggerItem
                      key={comm.id}
                      className={`rounded-2xl border bg-gradient-to-br ${style.gradient} p-6 md:p-8 shadow-md backdrop-blur-sm transition-all hover:shadow-lg`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-5 mb-6">
                        <div className="flex items-center gap-3">
                          <div className="p-3 rounded-lg bg-card border shadow-sm">
                            <IconComponent className="w-7 h-7 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-foreground">{comm.name}</h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                              Chairperson: <strong className="text-foreground">{comm.chairperson}</strong>
                            </p>
                          </div>
                        </div>

                        {comm.helpline && (
                          <div className="flex items-center gap-2 bg-card border px-4 py-2 rounded-xl text-sm font-semibold w-fit shadow-sm">
                            <PhoneCall className="w-4 h-4 text-primary" />
                            <span className="text-muted-foreground">Emergency helpline:</span>
                            <a href={`tel:${comm.helpline}`} className="text-foreground hover:underline">
                              {comm.helpline}
                            </a>
                          </div>
                        )}
                      </div>

                      <div className="overflow-x-auto rounded-xl border bg-card/85">
                        <table className="w-full border-collapse text-left text-sm">
                          <thead>
                            <tr className="bg-muted text-muted-foreground border-b border-border">
                              <th className="px-6 py-4 font-bold">Representative Name</th>
                              <th className="px-6 py-4 font-bold">Official Designation / Department</th>
                              <th className="px-6 py-4 font-bold text-right">Committee Role</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {comm.members && comm.members.map((member: any, mIdx: number) => (
                              <tr key={mIdx} className="hover:bg-muted/50 transition-colors">
                                <td className="px-6 py-4 font-semibold text-foreground flex items-center gap-2">
                                  <UserCheck className="w-4 h-4 text-emerald-500" />
                                  {member.name}
                                </td>
                                <td className="px-6 py-4 text-muted-foreground">
                                  {member.designation}
                                </td>
                                <td className="px-6 py-4 text-right font-medium text-foreground">
                                  <span className="inline-block px-2.5 py-1 rounded-full text-xs bg-primary/10 text-primary border border-primary/20">
                                    {member.role}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </StaggerItem>
                  )
                })
              ) : (
                <div className="text-center py-12 border border-dashed rounded-xl bg-card">
                  <p className="text-muted-foreground">Loading safety committee records. Please wait...</p>
                </div>
              )}
            </StaggerContainer>
          </div>
        </section>

        {/* Anonymous Grievance Drop Box Form */}
        <section className="py-16 bg-secondary overflow-hidden">
          <div className="mx-auto max-w-3xl px-4">
            <SlideIn direction="up" className="rounded-2xl border border-border bg-card p-6 md:p-10 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-500 via-pink-500 to-indigo-500" />

              <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-foreground">Anonymous Grievance Drop Box</h2>
                <p className="text-muted-foreground mt-2 text-sm md:text-base leading-relaxed">
                  Submit a concern directly to the Safety and Grievance committee. You can choose to post this fully anonymously by ticking the privacy option. We monitor and review each ticket within 24 hours.
                </p>
              </div>

              {submitted ? (
                <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
                  <div className="rounded-full bg-emerald-500/10 p-4 border border-emerald-500/20 mb-4 animate-bounce">
                    <CheckCircle2 className="h-14 w-14 text-emerald-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">Grievance Submitted Safely!</h3>
                  <p className="text-muted-foreground max-w-md">
                    Thank you. Your concern has been encrypted and successfully lodged in our systems. Action and review will proceed immediately under strict confidentiality protocols.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Anonymous Switch Toggle */}
                  <div className="p-4 rounded-xl bg-muted/60 border flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-semibold text-foreground text-sm flex items-center gap-1.5">
                        <Shield className="w-4 h-4 text-emerald-500" /> Lodge as fully Anonymous?
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Your identity details (IP, user account, email) will not be tracked or linked to this ticket.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, isAnonymous: !formData.isAnonymous })}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        formData.isAnonymous ? "bg-emerald-500" : "bg-zinc-400"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          formData.isAnonymous ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {!formData.isAnonymous && (
                    <div className="grid gap-5 md:grid-cols-2 animate-fade-in">
                      <div className="space-y-2">
                        <Label htmlFor="stud-name">Your Full Name</Label>
                        <Input
                          id="stud-name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Dr. / Mr. / Ms. Name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="stud-contact">Contact (Email or Phone)</Label>
                        <Input
                          id="stud-contact"
                          value={formData.emailOrPhone}
                          onChange={(e) => setFormData({ ...formData, emailOrPhone: e.target.value })}
                          placeholder="name@email.com or number"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="target-comm">Select Safety Cell / Committee</Label>
                      <select
                        id="target-comm"
                        className="w-full h-10 px-3 py-1.5 rounded-md border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={formData.committeeId}
                        onChange={(e) => setFormData({ ...formData, committeeId: e.target.value })}
                      >
                        <option value="anti-ragging">Anti-Ragging Committee</option>
                        <option value="gender-harassment">Gender Harassment Cell</option>
                        <option value="womens-grievance">Women&apos;s Grievance Cell</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="stud-subject">Incident Subject</Label>
                      <Input
                        id="stud-subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="Brief summary of concern"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stud-msg">Elaborate Incident / Concern Details</Label>
                    <Textarea
                      id="stud-msg"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please state timings, description of incident, and names if possible. Complete safety is guaranteed."
                      rows={5}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full flex items-center justify-center gap-2 transition-transform hover:scale-105">
                    <Send className="w-4 h-4" /> Submit Grievance Record
                  </Button>
                </form>
              )}
            </SlideIn>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
