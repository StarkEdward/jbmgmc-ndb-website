import React from 'react'
import { db } from '@/lib/db'
import CommitteesLibraryClient from './committees-library-client'

export const dynamic = 'force-dynamic'

export default function AdminCommitteesLibraryPage() {
  const committees = db.getCommittees()
  const libraryInfo = db.getLibraryInfo()

  return (
    <CommitteesLibraryClient initialCommittees={committees} initialLibraryInfo={libraryInfo} />
  )
}
