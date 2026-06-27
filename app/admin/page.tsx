import React from 'react'
import { db } from '@/lib/db'
import DashboardClient from './dashboard-client'

export const dynamic = 'force-dynamic'

export default function AdminDashboardPage() {
  const departments = db.getDepartments()
  const courses = db.getCourses()
  const gallery = db.getGallery()
  const newsEvents = db.getNewsEvents()
  const committees = db.getCommittees()
  const tenders = db.getTenders()
  const dynamicPages = db.getDynamicPages()

  // ── Core Stats ──────────────────────────────────────────────────────────────
  const totalDepartments = departments.length
  const totalDoctors = departments.reduce((acc, dept) => acc + (dept.doctors?.length || 0), 0)
  const totalCourses = courses.length
  const totalGallery = gallery.length
  const totalNewsEvents = newsEvents.length
  const totalCommittees = committees.length

  // ── Department Chart ─────────────────────────────────────────────────────────
  const departmentDoctors = departments.map((d) => ({
    name: d.name.length > 12 ? `${d.name.substring(0, 10)}…` : d.name,
    count: d.doctors?.length || 0
  }))

  // ── Course Seats Pie ─────────────────────────────────────────────────────────
  const courseSeats = courses
    .filter((c) => typeof c.seats === 'number')
    .map((c) => ({ name: c.name, value: c.seats as number }))

  // ── "Needs Attention" Alerts ─────────────────────────────────────────────────
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const expiredTenders = tenders.filter((t) => {
    if (!t.dueDate || t.isHidden) return false
    return new Date(t.dueDate) < today
  })

  const urgentBanners = newsEvents.filter((n) => n.isUrgent && n.showInBanner)

  const deptsWithNoDoctors = departments.filter((d) => !d.doctors || d.doctors.length === 0)

  const attentionAlerts: { type: string; message: string; severity: 'error' | 'warning' | 'info' }[] = []
  if (expiredTenders.length > 0)
    attentionAlerts.push({ type: 'Expired Tender', message: `${expiredTenders.length} tender(s) are past their due date but still visible.`, severity: 'error' })
  if (urgentBanners.length > 0)
    attentionAlerts.push({ type: 'Urgent Banner', message: `${urgentBanners.length} urgent banner(s) are currently live on the website.`, severity: 'warning' })
  if (deptsWithNoDoctors.length > 0)
    attentionAlerts.push({ type: 'Empty Department', message: `${deptsWithNoDoctors.length} department(s) have no assigned doctors.`, severity: 'warning' })

  // ── Activity Feed (What's New) ───────────────────────────────────────────────
  const recentActivity = newsEvents
    .slice()
    .sort((a, b) => b.id - a.id)
    .slice(0, 6)
    .map((n) => ({
      title: n.title,
      type: n.type as string,
      date: n.date,
      isUrgent: n.isUrgent || false,
    }))

  // ── Content Health Score ─────────────────────────────────────────────────────
  // Score out of 5 checks → multiply by 20 to get 0–100
  let healthScore = 0
  if (totalDoctors >= 10) healthScore += 20                            // Has doctors
  if (totalGallery >= 5) healthScore += 20                              // Has gallery
  if (newsEvents.some((n) => {
    const d = new Date(n.date); return (today.getTime() - d.getTime()) < 30 * 86400 * 1000
  })) healthScore += 20                                                  // Recent news
  if (deptsWithNoDoctors.length === 0) healthScore += 20                // No empty depts
  if (dynamicPages.length >= 2) healthScore += 20                       // Has custom pages

  const stats = { totalDepartments, totalDoctors, totalCourses, totalGallery, totalNewsEvents, totalCommittees }
  const chartData = { departmentDoctors, courseSeats }

  return (
    <DashboardClient
      stats={stats}
      chartData={chartData}
      recentNews={newsEvents}
      recentActivity={recentActivity}
      attentionAlerts={attentionAlerts}
      healthScore={healthScore}
    />
  )
}
