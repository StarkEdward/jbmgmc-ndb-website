'use server'

import { db, Doctor } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { runAction } from '@/lib/action-utils'

export async function addDoctorAction(departmentId: string, doctor: Doctor) {
  return runAction('addDoctor', async () => {
    const success = await db.addDoctor(departmentId, doctor)
    if (success) revalidatePath('/', 'layout')
    return { success }
  })
}

export async function removeDoctorAction(departmentId: string, doctorName: string) {
  return runAction('removeDoctor', async () => {
    const success = await db.removeDoctor(departmentId, doctorName)
    if (success) revalidatePath('/', 'layout')
    return { success }
  })
}

export async function updateDepartmentAction(
  departmentId: string, 
  fields: Partial<import('@/lib/db').Department>
) {
  return runAction('updateDepartment', async () => {
    const success = await db.updateDepartment(departmentId, fields)
    if (success) revalidatePath('/', 'layout')
    return { success }
  })
}

export async function updateDoctorAction(
  departmentId: string,
  originalName: string,
  updatedDoctor: Doctor
) {
  return runAction('updateDoctor', async () => {
    const success = await db.updateDoctor(departmentId, originalName, updatedDoctor)
    if (success) revalidatePath('/', 'layout')
    return { success }
  })
}

export async function updateDepartmentFacilitiesAction(
  departmentId: string,
  facilities: string[]
) {
  return runAction('updateDepartmentFacilities', async () => {
    const success = await db.updateDepartment(departmentId, { facilities })
    if (success) revalidatePath('/', 'layout')
    return { success }
  })
}
