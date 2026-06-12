'use client'

import React, { useEffect, useState } from 'react'
import { 
  Building2, 
  Users, 
  GraduationCap, 
  Image as ImageIcon, 
  TrendingUp, 
  Clock, 
  Plus, 
  ArrowUpRight 
} from 'lucide-react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import Link from 'next/link'

interface DashboardClientProps {
  stats: {
    totalDepartments: number
    totalDoctors: number
    totalCourses: number
    totalGallery: number
  }
  chartData: {
    departmentDoctors: { name: string; count: number }[]
    courseSeats: { name: string; value: number }[]
  }
  recentNews: { date: string; title: string }[]
}

const COLORS = ['#0d9488', '#0f766e', '#115e59', '#14b8a6']

export default function DashboardClient({ stats, chartData, recentNews }: DashboardClientProps) {
  const [mounted, setMounted] = useState(false)

  // Prevent server-side hydration mismatches for Recharts SVG drawings
  useEffect(() => {
    setMounted(true)
  }, [])

  const statCards = [
    { name: 'Departments', value: stats.totalDepartments, icon: Building2, color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-500/10', border: 'border-teal-500/20' },
    { name: 'Active Doctors', value: stats.totalDoctors, icon: Users, color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/20' },
    { name: 'Academic Courses', value: stats.totalCourses, icon: GraduationCap, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
    { name: 'Gallery Media', value: stats.totalGallery, icon: ImageIcon, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Dashboard</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Welcome back, Dr. Sanjay Rathod. Here is the operational overview of JBMGMC Nandurbar.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <div 
            key={card.name}
            className={`rounded-2xl border ${card.border} bg-card p-6 shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-[1.02]`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{card.name}</p>
                <h3 className="mt-2 text-3xl font-bold text-foreground">{card.value}</h3>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.bg} ${card.color}`}>
                <card.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Charts Grid */}
      {mounted && (
        <div className="grid gap-6 md:grid-cols-12">
          {/* Doctors by Department Bar Chart */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-2xl backdrop-blur-md md:col-span-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-foreground">Faculty Distribution</h2>
                <p className="text-xs text-muted-foreground">Total active doctors across various clinical departments</p>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-teal-500/10 px-2.5 py-1 text-xs font-medium text-teal-500 dark:text-teal-400">
                <TrendingUp className="h-3.5 w-3.5" />
                Live Sync
              </div>
            </div>
            
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.departmentDoctors} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorDoctors" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d9488" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="var(--muted-foreground)" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="var(--muted-foreground)" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      borderColor: 'var(--border)',
                      borderRadius: '12px',
                      color: 'var(--foreground)',
                    }}
                    cursor={{ fill: 'rgba(13, 148, 136, 0.05)' }}
                  />
                  <Bar dataKey="count" fill="url(#colorDoctors)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Academic Intake Pie Chart */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-2xl backdrop-blur-md md:col-span-4">
            <h2 className="text-lg font-bold text-foreground">Course Allocation</h2>
            <p className="mb-6 text-xs text-muted-foreground">Seat capacity distribution across MBBS & Nursing</p>

            <div className="relative flex h-52 items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData.courseSeats}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {chartData.courseSeats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      borderColor: 'var(--border)',
                      borderRadius: '12px',
                      color: 'var(--foreground)',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-bold text-foreground">210+</span>
                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Seats</span>
              </div>
            </div>

            {/* Custom Legend */}
            <div className="mt-4 space-y-2">
              {chartData.courseSeats.map((item, idx) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span 
                      className="h-2.5 w-2.5 rounded-full" 
                      style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                    />
                    {item.name}
                  </div>
                  <span className="font-semibold text-foreground/80">{item.value} Seats</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Grid: Recent News & Alerts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Announcements */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-2xl backdrop-blur-md">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-foreground">Recent Circulars</h2>
              <p className="text-xs text-muted-foreground">Last updated announcements and notices</p>
            </div>
            <Link 
              href="/admin/news-events" 
              className="group inline-flex items-center gap-1 text-xs font-semibold text-teal-650 dark:text-teal-400 hover:text-teal-500"
            >
              Manage
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {recentNews.slice(0, 3).map((item, idx) => (
              <div 
                key={idx}
                className="flex items-start gap-4 rounded-2xl bg-slate-100/50 dark:bg-slate-950/30 p-4 border border-border/80"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                  <Clock className="h-4 w-4" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-semibold text-teal-650 dark:text-teal-500">{item.date}</p>
                  <p className="mt-1 truncate text-sm font-semibold text-foreground">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Operations panel */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-2xl backdrop-blur-md">
          <h2 className="text-lg font-bold text-foreground">Quick Administrative Operations</h2>
          <p className="mb-6 text-xs text-muted-foreground">Instant shortcuts to add new records to the website</p>

          <div className="grid gap-3 sm:grid-cols-2">
            <Link 
              href="/admin/departments"
              className="flex items-center gap-3 rounded-2xl bg-slate-100/30 dark:bg-slate-950/40 p-4 border border-border hover:bg-slate-100 dark:hover:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-300 dark:border-slate-700 transition-all duration-200"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
                <Plus className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-foreground/80">Add Faculty Member</span>
            </Link>

            <Link 
              href="/admin/news-events"
              className="flex items-center gap-3 rounded-2xl bg-slate-100/30 dark:bg-slate-950/40 p-4 border border-border hover:bg-slate-100 dark:hover:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-300 dark:border-slate-700 transition-all duration-200"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                <Plus className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-foreground/80">Publish Notice</span>
            </Link>

            <Link 
              href="/admin/gallery"
              className="flex items-center gap-3 rounded-2xl bg-slate-100/30 dark:bg-slate-950/40 p-4 border border-border hover:bg-slate-100 dark:hover:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-300 dark:border-slate-700 transition-all duration-200"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Plus className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-foreground/80">Upload Campus Photo</span>
            </Link>

            <Link 
              href="/admin/courses-hostel"
              className="flex items-center gap-3 rounded-2xl bg-slate-100/30 dark:bg-slate-950/40 p-4 border border-border hover:bg-slate-100 dark:hover:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-300 dark:border-slate-700 transition-all duration-200"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <Plus className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-foreground/80">Adjust Hostels</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
