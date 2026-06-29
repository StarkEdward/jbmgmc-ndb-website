import React from 'react'
import BackupClient from './backup-client'

export const metadata = {
  title: 'Backup & Restore | JBMGMC Admin',
  description: 'Manage database backups and perform system restores.',
}

export default function BackupPage() {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Backup & Restore</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Export your database and media files, or restore the system from a previous backup archive.
          </p>
        </div>
        <BackupClient />
      </div>
    </main>
  )
}
