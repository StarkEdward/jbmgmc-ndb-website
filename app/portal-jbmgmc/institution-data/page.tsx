import React from 'react'
import { db } from '@/lib/db'
import InstitutionClient from './institution-client'

export const dynamic = 'force-dynamic'

export default function InstitutionDataPage() {
  const aboutSettings = db.getAboutSettings()
  const academicsSettings = db.getAcademicsSettings()
  const institutionMetrics = db.getInstitutionMetrics()
  const libraryInfo = db.getLibraryInfo()

  return (
    <InstitutionClient 
      initialAbout={aboutSettings}
      initialAcademics={academicsSettings}
      initialMetrics={institutionMetrics}
    />
  )
}
