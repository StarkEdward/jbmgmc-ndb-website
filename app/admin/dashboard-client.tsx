'use client'

import React, { useEffect, useState, useCallback } from 'react'
import {
  Building2, Users, GraduationCap, Image as ImageIcon, TrendingUp, Clock, Plus,
  ArrowUpRight, Sun, Sunset, CloudSun, CloudMoon, AlertTriangle, CheckCircle2,
  Megaphone, Shield, HardDrive, Sparkles, ChevronRight, FileText, Activity,
  Zap, AlertCircle, Info, Star
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts'
import Link from 'next/link'

// ── Types ─────────────────────────────────────────────────────────────────────
interface DashboardClientProps {
  stats: {
    totalDepartments: number
    totalDoctors: number
    totalCourses: number
    totalGallery: number
    totalNewsEvents: number
    totalCommittees: number
  }
  chartData: {
    departmentDoctors: { name: string; count: number }[]
    courseSeats: { name: string; value: number }[]
  }
  recentNews: { date: string; title: string; type?: string }[]
  recentActivity: { title: string; type: string; date: string; isUrgent: boolean }[]
  attentionAlerts: { type: string; message: string; severity: 'error' | 'warning' | 'info' }[]
  healthScore: number
}

interface StorageStats {
  totalFiles: number
  totalBytes: number
  statusCounts: Record<string, number>
  statusBytes: Record<string, number>
}

const CHART_COLORS = ['#0d9488', '#0f766e', '#115e59', '#14b8a6', '#5eead4']
const STORAGE_COLORS: Record<string, string> = {
  'In Use': '#10b981',
  'Orphaned': '#f43f5e',
  'Unlocked': '#f59e0b',
}

/** Returns relative time string like "2 hours ago" */
function relativeTime(dateStr: string): string {
  try {
    const d = new Date(dateStr)
    const diff = (Date.now() - d.getTime()) / 1000
    if (diff < 60) return 'Just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    if (diff < 86400 * 7) return `${Math.floor(diff / 86400)}d ago`
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
  } catch { return dateStr }
}

// ── Content Velocity (dummy last-6-months trend from recentNews count) ────────
function buildVelocityData(recentNews: { date: string }[]) {
  const months: Record<string, number> = {}
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = d.toLocaleString('en-US', { month: 'short', year: '2-digit' })
    months[key] = 0
  }
  recentNews.forEach((n) => {
    try {
      const d = new Date(n.date)
      const key = d.toLocaleString('en-US', { month: 'short', year: '2-digit' })
      if (key in months) months[key]++
    } catch {}
  })
  return Object.entries(months).map(([month, count]) => ({ month, count }))
}

// ── Health Score colour helper ─────────────────────────────────────────────────
function scoreColor(score: number) {
  if (score >= 80) return { ring: 'stroke-emerald-500', text: 'text-emerald-600 dark:text-emerald-400', label: 'Excellent', bg: 'bg-emerald-50 dark:bg-emerald-500/10' }
  if (score >= 60) return { ring: 'stroke-teal-500', text: 'text-teal-600 dark:text-teal-400', label: 'Good', bg: 'bg-teal-50 dark:bg-teal-500/10' }
  if (score >= 40) return { ring: 'stroke-amber-500', text: 'text-amber-600 dark:text-amber-400', label: 'Fair', bg: 'bg-amber-50 dark:bg-amber-500/10' }
  return { ring: 'stroke-rose-500', text: 'text-rose-600 dark:text-rose-400', label: 'Needs Work', bg: 'bg-rose-50 dark:bg-rose-500/10' }
}

// ── SVG Donut for Health Score ─────────────────────────────────────────────────
function ScoreRing({ score }: { score: number }) {
  const r = 40, cx = 56, cy = 56, circumference = 2 * Math.PI * r
  const filled = (score / 100) * circumference
  const sc = scoreColor(score)
  return (
    <svg width={112} height={112} viewBox="0 0 112 112" className="shrink-0">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="currentColor" strokeWidth={10} className="text-slate-200 dark:text-slate-700" />
      <circle
        cx={cx} cy={cy} r={r} fill="none" strokeWidth={10} strokeLinecap="round"
        strokeDasharray={`${filled} ${circumference}`} strokeDashoffset={circumference / 4}
        className={`${sc.ring} transition-all duration-1000`}
      />
      <text x={cx} y={cy - 6} textAnchor="middle" className="fill-slate-800 dark:fill-slate-100 font-bold text-xl" fontSize={22} fontWeight={700}>{score}</text>
      <text x={cx} y={cy + 14} textAnchor="middle" fontSize={9} fontWeight={600} fill="currentColor" className="fill-slate-500 dark:fill-slate-400" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>/ 100</text>
    </svg>
  )
}

// ── Quick Action Item ──────────────────────────────────────────────────────────
function QuickAction({ href, icon: Icon, label, color }: { href: string; icon: React.ElementType; label: string; color: string }) {
  return (
    <Link href={href} className={`group flex flex-col items-center gap-2 rounded-2xl p-3 sm:p-4 border border-border bg-card hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5`}>
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color} transition-transform duration-200 group-hover:scale-110`}>
        <Icon className="h-5 w-5" />
      </div>
      <span className="text-center text-[11px] font-semibold text-muted-foreground leading-tight">{label}</span>
    </Link>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function DashboardClient({ stats, chartData, recentNews, recentActivity, attentionAlerts, healthScore }: DashboardClientProps) {
  const [mounted, setMounted] = useState(false)
  const [time, setTime] = useState(new Date())
  const [storageStats, setStorageStats] = useState<StorageStats | null>(null)

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Fetch storage data for the Storage Health chart
  const fetchStorage = useCallback(async () => {
    try {
      const res = await fetch('/api/storage')
      const data = await res.json()
      if (data.files) {
        const statusCounts: Record<string, number> = { 'In Use': 0, 'Orphaned': 0, 'Unlocked': 0 }
        const statusBytes: Record<string, number> = { 'In Use': 0, 'Orphaned': 0, 'Unlocked': 0 }
        let totalBytes = 0
        data.files.forEach((f: { status: string; sizeBytes: number }) => {
          totalBytes += (f.sizeBytes || 0)
          if (f.status === 'in-use') { statusCounts['In Use']++; statusBytes['In Use'] += (f.sizeBytes || 0) }
          else if (f.status === 'force-unlocked') { statusCounts['Unlocked']++; statusBytes['Unlocked'] += (f.sizeBytes || 0) }
          else { statusCounts['Orphaned']++; statusBytes['Orphaned'] += (f.sizeBytes || 0) }
        })
        setStorageStats({ totalFiles: data.files.length, totalBytes, statusCounts, statusBytes })
      }
    } catch {}
  }, [])

  useEffect(() => { if (mounted) fetchStorage() }, [mounted, fetchStorage])

  // Time & greeting
  const hours = time.getHours()
  let greeting = 'Good evening'; let MainIcon = CloudMoon; let iconClass = 'text-indigo-500 dark:text-indigo-400 animate-pulse'
  if (hours >= 5 && hours < 12) { greeting = 'Good morning'; MainIcon = CloudSun; iconClass = 'text-amber-500 dark:text-amber-400 animate-[spin_10s_linear_infinite]' }
  else if (hours >= 12 && hours < 17) { greeting = 'Good afternoon'; MainIcon = Sun; iconClass = 'text-orange-500 dark:text-orange-400 animate-[spin_10s_linear_infinite]' }
  else if (hours >= 17 && hours < 20) { greeting = 'Good evening'; MainIcon = Sunset; iconClass = 'text-rose-500 dark:text-rose-400 animate-pulse' }

  const formattedTime = time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true })
  const formattedDate = time.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  const statCards = [
    { name: 'Departments', value: stats.totalDepartments, icon: Building2, color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-500/10', border: 'border-teal-500/20', href: '/admin/departments' },
    { name: 'Active Doctors', value: stats.totalDoctors, icon: Users, color: 'text-sky-500 dark:text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/20', href: '/admin/departments' },
    { name: 'Courses', value: stats.totalCourses, icon: GraduationCap, color: 'text-indigo-500 dark:text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', href: '/admin/courses-hostel' },
    { name: 'Gallery Media', value: stats.totalGallery, icon: ImageIcon, color: 'text-emerald-500 dark:text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', href: '/admin/gallery' },
    { name: 'News & Events', value: stats.totalNewsEvents, icon: Megaphone, color: 'text-violet-500 dark:text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20', href: '/admin/news-events' },
    { name: 'Committees', value: stats.totalCommittees, icon: Shield, color: 'text-rose-500 dark:text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', href: '/admin/committees-library' },
  ]

  const velocityData = buildVelocityData(recentNews)

  const storagePieData = storageStats
    ? Object.entries(storageStats.statusCounts).filter(([_, count]) => count > 0).map(([status, count]) => ({ name: status, value: count }))
    : []

  const severityIcon = { error: AlertCircle, warning: AlertTriangle, info: Info }
  const severityClass = {
    error: 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-400',
    warning: 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400',
    info: 'bg-sky-50 dark:bg-sky-500/10 border-sky-200 dark:border-sky-500/20 text-sky-700 dark:text-sky-400',
  }

  const sc = scoreColor(healthScore)

  return (
    <div className="space-y-6">

      {/* ── HERO GREETING ─────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl border border-white/20 dark:border-white/10 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-2xl p-6 sm:p-8">
        <div className="absolute top-0 left-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          {/* Greeting */}
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/50 dark:bg-slate-800/50 shadow-sm backdrop-blur-md border border-white/40 dark:border-slate-700/50">
              {mounted && <MainIcon className={`w-7 h-7 ${iconClass}`} />}
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100 truncate">
                {mounted ? greeting : 'Welcome'}, Dr. Sanjay Rathod
              </h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 font-medium line-clamp-2">
                Operational overview — Jannayak Birsa Munda Government Medical College, Nandurbar.
              </p>
            </div>
          </div>

          {/* Clock */}
          <div className="flex items-center gap-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-lg px-5 py-4 rounded-2xl border border-white/40 dark:border-slate-700/50 shadow-sm shrink-0 self-start lg:self-auto">
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-xl font-mono font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                {mounted ? formattedTime : '--:--:-- --'}
              </div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                {mounted ? formattedDate : 'Loading…'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── QUICK ACTIONS ─────────────────────────────────────────────────── */}
      <div className="rounded-3xl border border-border bg-card p-5 shadow-xl backdrop-blur-md">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-1.5">
          <Zap className="w-3 h-3 text-teal-500" /> Quick Actions
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
          <QuickAction href="/admin/news-events" icon={Megaphone} label="Add News" color="bg-teal-500/10 text-teal-600 dark:text-teal-400" />
          <QuickAction href="/admin/gallery" icon={ImageIcon} label="Add Photo" color="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" />
          <QuickAction href="/admin/departments" icon={Users} label="Add Doctor" color="bg-sky-500/10 text-sky-600 dark:text-sky-400" />
          <QuickAction href="/admin/pages" icon={FileText} label="New Page" color="bg-violet-500/10 text-violet-600 dark:text-violet-400" />
          <QuickAction href="/admin/storage" icon={HardDrive} label="Storage" color="bg-rose-500/10 text-rose-600 dark:text-rose-400" />
          <QuickAction href="/admin/settings" icon={Sparkles} label="Settings" color="bg-amber-500/10 text-amber-600 dark:text-amber-400" />
        </div>
      </div>

      {/* ── STAT TILES (6) ────────────────────────────────────────────────── */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        {statCards.map((card) => (
          <Link
            key={card.name}
            href={card.href}
            className={`group rounded-2xl border ${card.border} bg-card p-4 shadow-md backdrop-blur-md transition-all duration-300 hover:scale-[1.03] hover:shadow-xl flex flex-col gap-3`}
          >
            <div className="flex items-center justify-between">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.bg} ${card.color}`}>
                <card.icon className="h-5 w-5" />
              </div>
              <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{card.name}</p>
              <h3 className="mt-1 text-2xl font-bold text-foreground">{card.value}</h3>
            </div>
          </Link>
        ))}
      </div>

      {/* ── CHARTS ROW 1 ──────────────────────────────────────────────────── */}
      {mounted && (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-12">
          {/* Faculty Distribution Bar Chart */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-2xl backdrop-blur-md col-span-1 md:col-span-8">
            <div className="mb-6 flex flex-wrap items-start justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-foreground">Faculty Distribution</h2>
                <p className="text-xs text-muted-foreground">Doctors across clinical departments</p>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-teal-500/10 px-2.5 py-1 text-xs font-medium text-teal-500 dark:text-teal-400 shrink-0">
                <TrendingUp className="h-3.5 w-3.5" /> Live Sync
              </div>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.departmentDoctors} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorDoctors" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d9488" stopOpacity={0.9} />
                      <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.2} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '12px', color: 'var(--foreground)' }} cursor={{ fill: 'rgba(13,148,136,0.05)' }} />
                  <Bar dataKey="count" fill="url(#colorDoctors)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Course Seats Donut */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-2xl backdrop-blur-md col-span-1 md:col-span-4">
            <h2 className="text-base font-bold text-foreground">Course Allocation</h2>
            <p className="mb-4 text-xs text-muted-foreground">Seat capacity distribution across courses</p>
            <div className="relative flex h-48 items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData.courseSeats} cx="50%" cy="50%" innerRadius={50} outerRadius={72} paddingAngle={4} dataKey="value">
                    {chartData.courseSeats.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '12px', color: 'var(--foreground)' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center pointer-events-none">
                <span className="text-2xl font-bold text-foreground">210+</span>
                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Seats</span>
              </div>
            </div>
            <div className="mt-3 space-y-1.5">
              {chartData.courseSeats.map((item, idx) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }} />
                    <span className="truncate max-w-[120px]">{item.name}</span>
                  </div>
                  <span className="font-semibold text-foreground/80 shrink-0">{item.value} Seats</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── CHARTS ROW 2 (Storage + Velocity) ────────────────────────────── */}
      {mounted && (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {/* Storage Health */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-2xl backdrop-blur-md">
            <div className="flex items-start justify-between gap-2 mb-4">
              <div>
                <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                  <HardDrive className="h-4 w-4 text-teal-500" /> Storage Health
                </h2>
                <p className="text-xs text-muted-foreground">File status distribution & memory usage</p>
              </div>
              <Link href="/admin/storage" className="text-xs text-teal-600 dark:text-teal-400 font-semibold hover:underline flex items-center gap-1 shrink-0">
                Manage <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
            {storageStats && storagePieData.length > 0 ? (
              <>
                <div className="relative flex h-44 items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={storagePieData} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={3} dataKey="value">
                        {storagePieData.map((entry) => (
                          <Cell key={entry.name} fill={STORAGE_COLORS[entry.name] || '#94a3b8'} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '12px', color: 'var(--foreground)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute flex flex-col items-center pointer-events-none">
                    <span className="text-xl font-bold text-foreground">{storageStats.totalFiles}</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Files</span>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-1.5">
                  {storagePieData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2 text-xs bg-slate-50 dark:bg-slate-800/50 p-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
                      <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: STORAGE_COLORS[item.name] || '#94a3b8' }} />
                      <span className="text-muted-foreground truncate font-medium">{item.name}</span>
                      <div className="ml-auto flex flex-col items-end leading-[1.1]">
                        <span className="font-bold text-foreground/90">{item.value}</span>
                        <span className="text-[9px] text-muted-foreground/70 font-semibold tracking-tight">
                          {((storageStats.statusBytes[item.name] || 0) / (1024 * 1024)).toFixed(1)} MB
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex h-44 items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <HardDrive className="h-8 w-8 mx-auto mb-2 opacity-40" />
                  <p className="text-xs">Loading storage data…</p>
                </div>
              </div>
            )}
          </div>

          {/* Content Velocity Area Chart */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-2xl backdrop-blur-md">
            <div className="mb-4">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Activity className="h-4 w-4 text-violet-500" /> Content Velocity
              </h2>
              <p className="text-xs text-muted-foreground">News & events added over last 6 months</p>
            </div>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={velocityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVelocity" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '12px', color: 'var(--foreground)' }} />
                  <Area type="monotone" dataKey="count" stroke="#7c3aed" strokeWidth={2} fill="url(#colorVelocity)" name="Posts" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* ── BOTTOM WIDGETS ROW ────────────────────────────────────────────── */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">

        {/* Needs Attention */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-2xl backdrop-blur-md flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" /> Needs Attention
            </h2>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${attentionAlerts.length > 0 ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400' : 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'}`}>
              {attentionAlerts.length === 0 ? '✓ All Clear' : `${attentionAlerts.length} Alert${attentionAlerts.length > 1 ? 's' : ''}`}
            </span>
          </div>
          {attentionAlerts.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-6">
              <CheckCircle2 className="h-10 w-10 text-emerald-500 mb-2" />
              <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Everything looks great!</p>
              <p className="text-xs text-muted-foreground mt-1">No issues detected in the system.</p>
            </div>
          ) : (
            <div className="space-y-2.5 flex-1 overflow-y-auto">
              {attentionAlerts.map((alert, i) => {
                const Icon = severityIcon[alert.severity]
                return (
                  <div key={i} className={`flex items-start gap-3 rounded-xl p-3 border text-xs ${severityClass[alert.severity]}`}>
                    <Icon className="h-4 w-4 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-bold">{alert.type}</p>
                      <p className="font-normal opacity-80 mt-0.5 leading-snug">{alert.message}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* What's New Activity Feed */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-2xl backdrop-blur-md flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Activity className="h-4 w-4 text-teal-500" /> What&apos;s New
            </h2>
            <Link href="/admin/news-events" className="text-xs text-teal-600 dark:text-teal-400 font-semibold hover:underline flex items-center gap-1 shrink-0">
              All <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto">
            {recentActivity.length === 0 ? (
              <p className="text-xs text-muted-foreground py-4 text-center">No recent activity.</p>
            ) : recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${item.type === 'event' ? 'bg-violet-500/10 text-violet-600 dark:text-violet-400' : 'bg-teal-500/10 text-teal-600 dark:text-teal-400'}`}>
                  {item.type === 'event' ? 'E' : 'N'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate leading-snug">{item.title}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {item.isUrgent && <span className="text-[9px] font-bold bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 px-1.5 py-0.5 rounded">URGENT</span>}
                    <p className="text-[10px] text-muted-foreground">{relativeTime(item.date)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Health Score */}
        <div className={`rounded-3xl border border-border bg-card p-6 shadow-2xl backdrop-blur-md flex flex-col`}>
          <h2 className="text-base font-bold text-foreground flex items-center gap-2 mb-4">
            <Star className="h-4 w-4 text-amber-500" /> Content Health
          </h2>
          <div className="flex items-center gap-5 mb-4">
            {mounted && <ScoreRing score={healthScore} />}
            <div>
              <p className={`text-lg font-bold ${sc.text}`}>{sc.label}</p>
              <p className="text-xs text-muted-foreground leading-snug mt-1">
                Based on doctors, gallery, news freshness, department completeness & dynamic pages.
              </p>
            </div>
          </div>
          <div className={`rounded-2xl ${sc.bg} p-3 mt-auto`}>
            {healthScore < 100 ? (
              <p className={`text-xs font-semibold ${sc.text} leading-snug`}>
                {healthScore < 40 && '⚠️ Several areas need attention. Review departments, gallery and news.'}
                {healthScore >= 40 && healthScore < 60 && '📋 Good start! Add more gallery photos and recent news to boost the score.'}
                {healthScore >= 60 && healthScore < 80 && '✅ Looking solid! Check if all departments have doctors assigned.'}
                {healthScore >= 80 && '🌟 Excellent work! Content is fresh and well-maintained.'}
              </p>
            ) : (
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">🏆 Perfect Score! All checks passed.</p>
            )}
          </div>
        </div>
      </div>

      {/* ── RECENT CIRCULARS ─────────────────────────────────────────────── */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-2xl backdrop-blur-md">
        <div className="flex flex-wrap items-start justify-between gap-2 mb-5">
          <div>
            <h2 className="text-base font-bold text-foreground">Recent Circulars & Notices</h2>
            <p className="text-xs text-muted-foreground">Latest published announcements and events</p>
          </div>
          <Link href="/admin/news-events" className="group inline-flex items-center gap-1 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-500 shrink-0">
            Manage All <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {recentNews.slice(0, 3).map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 rounded-2xl bg-slate-100/50 dark:bg-slate-950/30 p-4 border border-border/80">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                <Clock className="h-4 w-4" />
              </div>
              <div className="min-w-0 overflow-hidden">
                <p className="text-xs font-semibold text-teal-600 dark:text-teal-500">{item.date}</p>
                <p className="mt-0.5 text-sm font-semibold text-foreground truncate">{item.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
