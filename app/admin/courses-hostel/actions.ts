'use server'

import { db, Course, HostelSpec } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function updateCourseAction(id: string, fields: Partial<Omit<Course, 'id'>>) {
  const success = db.updateCourse(id, fields)
  if (success) {
    revalidatePath('/admin/courses-hostel')
    revalidatePath('/courses')
    revalidatePath('/')
  }
  return { success }
}

export async function updateHostelAction(
  hostelType: 'boys' | 'girls' | 'pgHostel',
  fields: Partial<HostelSpec>
) {
  const success = db.updateHostelInfo(hostelType, fields)
  if (success) {
    revalidatePath('/admin/courses-hostel')
    revalidatePath('/hostel')
    revalidatePath('/')
  }
  return { success }
}
