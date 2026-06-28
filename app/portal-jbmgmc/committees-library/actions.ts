'use server'

import { db, CommitteeMember, LibraryInfo } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { runAction } from '@/lib/action-utils'

// Update Library Info and Resources
export async function updateLibraryInfoAction(fields: Partial<LibraryInfo>) {
  return runAction('updateLibraryInfo', async () => {
    const success = await db.updateLibraryInfo(fields)
    if (success) {
      revalidatePath('/portal-jbmgmc/committees-library')
      revalidatePath('/library')
    }
    return { success }
  })
}

// Update Safety Committee Chairperson & Helpline
export async function updateCommitteeChairpersonAction(committeeId: string, chairperson: string, helpline: string) {
  return runAction('updateCommitteeChairperson', async () => {
    const success = await db.updateCommitteeChairperson(committeeId, chairperson, helpline)
    if (success) {
      revalidatePath('/portal-jbmgmc/committees-library')
      revalidatePath('/committees')
    }
    return { success }
  })
}

// Add a Member to Safety Committee
export async function addCommitteeMemberAction(committeeId: string, member: CommitteeMember) {
  return runAction('addCommitteeMember', async () => {
    const success = await db.addCommitteeMember(committeeId, member)
    if (success) {
      revalidatePath('/portal-jbmgmc/committees-library')
      revalidatePath('/committees')
    }
    return { success }
  })
}

// Remove a Member from Safety Committee
export async function removeCommitteeMemberAction(committeeId: string, memberName: string) {
  return runAction('removeCommitteeMember', async () => {
    const success = await db.removeCommitteeMember(committeeId, memberName)
    if (success) {
      revalidatePath('/portal-jbmgmc/committees-library')
      revalidatePath('/committees')
    }
    return { success }
  })
}

// Update a Member in Safety Committee
export async function updateCommitteeMemberAction(committeeId: string, oldMemberName: string, updatedMember: CommitteeMember) {
  return runAction('updateCommitteeMember', async () => {
    const success = await db.updateCommitteeMember(committeeId, oldMemberName, updatedMember)
    if (success) {
      revalidatePath('/portal-jbmgmc/committees-library')
      revalidatePath('/committees')
    }
    return { success }
  })
}
