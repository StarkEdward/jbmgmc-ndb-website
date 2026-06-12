import React from 'react'
import { db } from '@/lib/db'
import AdvancedClient from './advanced-client'

export const dynamic = 'force-dynamic'

export default function AdvancedSettingsPage() {
  const aboutSettings = db.getAboutSettings()
  const academicsSettings = db.getAcademicsSettings()
  const campusStats = db.getCampusStats()
  const libraryInfo = db.getLibraryInfo()

  return (
    <AdvancedClient 
      initialAbout={aboutSettings}
      initialAcademics={academicsSettings}
      initialStats={campusStats}
      initialLibrary={libraryInfo}
    />
  )
}
