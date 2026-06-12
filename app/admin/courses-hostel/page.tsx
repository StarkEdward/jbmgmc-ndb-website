import React from 'react'
import { db } from '@/lib/db'
import CoursesHostelClient from './courses-hostel-client'

export const dynamic = 'force-dynamic'

export default function AdminCoursesHostelPage() {
  const courses = db.getCourses()
  const hostels = db.getHostelInfo()

  return (
    <CoursesHostelClient initialCourses={courses} initialHostels={hostels} />
  )
}
