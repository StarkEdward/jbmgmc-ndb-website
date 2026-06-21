'use server'

import { db, Course, HostelSpec } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { runAction } from '@/lib/action-utils'

export async function updateCourseAction(id: string, fields: Partial<Omit<Course, 'id'>>) {
  return runAction('updateCourse', async () => {
    const success = await db.updateCourse(id, fields)
    if (success) {
      revalidatePath('/admin/courses-hostel')
      revalidatePath('/courses')
      revalidatePath('/')
    }
    return { success }
  })
}

export async function updateHostelAction(
  hostelType: 'boys' | 'girls' | 'pgHostel',
  fields: Partial<HostelSpec>
) {
  return runAction('updateHostel', async () => {
    const success = await db.updateHostelInfo(hostelType, fields)
    if (success) {
      revalidatePath('/admin/courses-hostel')
      revalidatePath('/hostel')
      revalidatePath('/')
    }
    return { success }
  })
}
