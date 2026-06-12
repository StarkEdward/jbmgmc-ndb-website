import React from 'react'
import { db } from '@/lib/db'
import DepartmentsClient from './departments-client'

export const dynamic = 'force-dynamic'

export default function AdminDepartmentsPage() {
  const departments = db.getDepartments()

  return (
    <DepartmentsClient initialDepartments={departments} />
  )
}
