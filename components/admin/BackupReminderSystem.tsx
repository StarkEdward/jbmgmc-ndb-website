'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ShieldAlert } from 'lucide-react'

export default function BackupReminderSystem() {
  const router = useRouter()
  const [daysElapsed, setDaysElapsed] = useState<number | null>(null)

  useEffect(() => {
    async function checkBackupStatus() {
      try {
        const res = await fetch('/api/settings/backup')
        if (!res.ok) return
        const data = await res.json()
        
        const lastBackupStr = data.lastBackupDate
        if (!lastBackupStr) {
          // If never backed up, treat as highly critical
          setDaysElapsed(60)
          triggerToast(60)
          return
        }

        const lastDate = new Date(lastBackupStr)
        const now = new Date()
        const diffTime = Math.abs(now.getTime() - lastDate.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        
        setDaysElapsed(diffDays)
        triggerToast(diffDays)
      } catch (err) {
        console.error('Failed to check backup status:', err)
      }
    }

    checkBackupStatus()
  }, [])

  const triggerToast = (days: number) => {
    // Only show toast once per session
    const hasSeenToast = sessionStorage.getItem('backup_toast_seen')
    if (!hasSeenToast && days > 30) {
      toast('Backup Overdue', {
        description: `It has been ${days} days since your last backup. Please secure your data.`,
        icon: <ShieldAlert className="text-red-500" />,
        action: {
          label: 'Download Now',
          onClick: () => router.push('/portal-jbmgmc/backup'),
        },
        duration: 10000,
        position: 'bottom-right'
      })
      sessionStorage.setItem('backup_toast_seen', 'true')
    }
  }

  return null
}
