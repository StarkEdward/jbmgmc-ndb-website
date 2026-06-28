import React from 'react'
import { db } from '@/lib/db'
import SettingsClient from './settings-client'

export const dynamic = 'force-dynamic'

export default function AdminSettingsPage() {
  const dean = db.getDeanInfo()
  const college = db.getCollegeInfo()
  const slides = db.getHeroSlides()
  const tickers = db.getTickerBulletins()
  const downloads = db.getDownloads()
  const accreditations = db.getAccreditations()
  const authorities = db.getAuthorities()
  const credentials = db.getAdminCredentials()

  return (
    <SettingsClient 
      initialDean={dean}
      initialCollege={college}
      initialSlides={slides}
      initialTickers={tickers}
      initialDownloads={downloads}
      initialAccreditations={accreditations}
      initialAuthorities={authorities}
      initialCredentials={credentials}
    />
  )
}
