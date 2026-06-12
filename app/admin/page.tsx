import React from 'react'
import { db } from '@/lib/db'
import DashboardClient from './dashboard-client'

export const dynamic = 'force-dynamic'

export default function AdminDashboardPage() {
  // Query all active stats from our Dynamic Database Layer
  const departments = db.getDepartments()
  const courses = db.getCourses()
  const gallery = db.getGallery()
  const news = db.getNews()

  // Calculate totals
  const totalDepartments = departments.length
  const totalDoctors = departments.reduce((acc, dept) => acc + (dept.doctors?.length || 0), 0)
  const totalCourses = courses.length
  const totalGallery = gallery.length

  // Construct chart visual statistics
  const departmentDoctors = departments.map((d) => ({
    name: d.name.length > 12 ? `${d.name.substring(0, 10)}...` : d.name,
    count: d.doctors?.length || 0
  }))

  const courseSeats = courses
    .filter((c) => typeof c.seats === 'number')
    .map((c) => ({
      name: c.name,
      value: c.seats as number
    }))

  const stats = {
    totalDepartments,
    totalDoctors,
    totalCourses,
    totalGallery
  }

  const chartData = {
    departmentDoctors,
    courseSeats
  }

  return (
    <DashboardClient 
      stats={stats} 
      chartData={chartData} 
      recentNews={news} 
    />
  )
}
