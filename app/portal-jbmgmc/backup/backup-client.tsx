'use client'

import React from 'react'
import { Download, PackageOpen, ServerCrash, ShieldAlert, Info, Zap, HardDrive, RefreshCw } from 'lucide-react'
import { RestoreBackupButton } from '../components/restore-backup-button'

export default function BackupClient() {
  return (
    <div className="grid gap-8">
      
      {/* How it works info box */}
      <details className="group rounded-2xl border border-blue-200 bg-white p-6 shadow-sm dark:border-blue-900/30 dark:bg-slate-900 [&_summary::-webkit-details-marker]:hidden">
        <summary className="flex cursor-pointer items-center justify-between gap-3 outline-none">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
              <Info className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white group-open:text-blue-600 dark:group-open:text-blue-400 transition-colors">How does this work?</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Click to understand the backup & restore mechanism.</p>
            </div>
          </div>
          <span className="transition group-open:rotate-180">
            <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24" className="text-slate-400"><path d="M6 9l6 6 6-6"></path></svg>
          </span>
        </summary>
        
        <div className="mt-6 border-t border-slate-100 dark:border-slate-800 pt-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-3">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Download className="w-4 h-4 text-teal-500" /> 1. The Backup
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                The system packages all your JSON data files and your uploaded media (images, PDFs) into a single secure <code>.tar.gz</code> archive file. It intelligently prevents duplication so the file is compact and ready to download.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" /> 2. Atomic Swap Restore
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                When you restore, the system uses an <strong>Atomic Swap</strong>. It renames the current live data and replaces it with the backup data in less than a millisecond. This guarantees <strong>Zero Downtime</strong>.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-blue-500" /> 3. Instant Cache Reload
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Once the folder swap is complete, the backend instantly flushes its memory cache. Your website updates immediately without needing to restart the server manually.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-500" /> 4. Fail-Safe Rollback
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                If anything goes wrong during extraction or swapping (e.g. invalid archive or permission errors), the system triggers an <strong>Auto-Rollback</strong>, keeping your live data perfectly safe and untouched.
              </p>
            </div>
          </div>
        </div>
      </details>

      {/* Download Section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400">
            <Download className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Export / Download Backup</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Download a complete snapshot of your system.</p>
          </div>
        </div>

        <div className="rounded-xl bg-slate-50 p-5 text-sm text-slate-600 dark:bg-slate-800/50 dark:text-slate-300 mb-6 border border-slate-100 dark:border-slate-800">
          <p className="mb-3">
            Downloading a backup will create a <strong>.tar.gz</strong> archive containing:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-500 dark:text-slate-400 mb-4">
            <li>All JSON database files (News, Events, Faculty, etc.)</li>
            <li>All uploaded media (Images, PDFs, Documents)</li>
            <li>System settings and credentials</li>
          </ul>
          <p>
            You can use this archive to sync production data back to your local development environment or keep it safe for disaster recovery.
          </p>
        </div>

        <button 
          onClick={() => window.location.href = '/api/backup'}
          className="flex items-center justify-center gap-2 w-full rounded-xl bg-teal-500 px-4 py-4 text-sm font-bold text-white hover:bg-teal-600 transition-colors shadow-sm shadow-teal-500/20"
        >
          <PackageOpen className="h-5 w-5" /> Download Complete Backup Archive
        </button>
      </div>

      {/* Restore Section */}
      <div className="rounded-2xl border border-rose-200 bg-white p-6 shadow-sm dark:border-rose-900/30 dark:bg-slate-900 relative overflow-hidden">
        
        {/* Subtle warning background pattern */}
        <div className="absolute -right-10 -top-10 opacity-5 dark:opacity-10 pointer-events-none">
          <ServerCrash className="w-64 h-64 text-rose-500" />
        </div>

        <div className="mb-6 flex items-center gap-3 relative z-10">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-rose-600 dark:text-rose-400">Restore System</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Upload a backup archive to overwrite live data.</p>
          </div>
        </div>

        <div className="rounded-xl bg-rose-50 p-5 text-sm text-rose-800 dark:bg-rose-950/30 dark:text-rose-300 mb-6 border border-rose-100 dark:border-rose-900/50 relative z-10">
          <p className="font-bold mb-2 flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-200 text-rose-700 dark:bg-rose-900 dark:text-rose-400 text-xs">!</span>
            Warning: Destructive Action
          </p>
          <p>
            Uploading a backup archive will <strong>permanently overwrite</strong> all current live data, including settings, users, news, events, and media uploads. 
            This process is instant and cannot be undone. Please ensure you have downloaded a fresh backup of the current state before proceeding.
          </p>
        </div>

        <div className="relative z-10">
          <RestoreBackupButton />
        </div>
      </div>
    </div>
  )
}
