'use server'

import { db, Doctor } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function addDoctorAction(departmentId: string, doctor: Doctor) {
  const success = db.addDoctor(departmentId, doctor)
  if (success) {
    revalidatePath('/', 'layout')
  }
  return { success }
}

export async function removeDoctorAction(departmentId: string, doctorName: string) {
  const success = db.removeDoctor(departmentId, doctorName)
  if (success) {
    revalidatePath('/', 'layout')
  }
  return { success }
}

export async function updateDepartmentAction(
  departmentId: string, 
  fields: Partial<import('@/lib/db').Department>
) {
  const success = db.updateDepartment(departmentId, fields)
  if (success) {
    revalidatePath('/', 'layout')
  }
  return { success }
}

export async function updateDoctorAction(
  departmentId: string,
  originalName: string,
  updatedDoctor: Doctor
) {
  const success = db.updateDoctor(departmentId, originalName, updatedDoctor)
  if (success) {
    revalidatePath('/', 'layout')
  }
  return { success }
}

export async function updateDepartmentFacilitiesAction(
  departmentId: string,
  facilities: string[]
) {
  const success = db.updateDepartment(departmentId, { facilities })
  if (success) {
    revalidatePath('/', 'layout')
  }
  return { success }
}
