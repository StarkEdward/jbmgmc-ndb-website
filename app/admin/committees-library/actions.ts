'use server'

import { db, CommitteeMember, LibraryInfo } from '@/lib/db'
import { revalidatePath } from 'next/cache'

// Update Library Info and Resources
export async function updateLibraryInfoAction(fields: Partial<LibraryInfo>) {
  const success = db.updateLibraryInfo(fields)
  if (success) {
    revalidatePath('/admin/committees-library')
    revalidatePath('/library')
  }
  return { success }
}

// Update Safety Committee Chairperson & Helpline
export async function updateCommitteeChairpersonAction(committeeId: string, chairperson: string, helpline: string) {
  const success = db.updateCommitteeChairperson(committeeId, chairperson, helpline)
  if (success) {
    revalidatePath('/admin/committees-library')
    revalidatePath('/committees')
  }
  return { success }
}

// Add a Member to Safety Committee
export async function addCommitteeMemberAction(committeeId: string, member: CommitteeMember) {
  const success = db.addCommitteeMember(committeeId, member)
  if (success) {
    revalidatePath('/admin/committees-library')
    revalidatePath('/committees')
  }
  return { success }
}

// Remove a Member from Safety Committee
export async function removeCommitteeMemberAction(committeeId: string, memberName: string) {
  const success = db.removeCommitteeMember(committeeId, memberName)
  if (success) {
    revalidatePath('/admin/committees-library')
    revalidatePath('/committees')
  }
  return { success }
}

// Update a Member in Safety Committee
export async function updateCommitteeMemberAction(committeeId: string, oldMemberName: string, updatedMember: CommitteeMember) {
  const success = db.updateCommitteeMember(committeeId, oldMemberName, updatedMember)
  if (success) {
    revalidatePath('/admin/committees-library')
    revalidatePath('/committees')
  }
  return { success }
}
