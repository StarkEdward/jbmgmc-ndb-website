'use client'

import React, { useState, useEffect } from 'react'
import { Download, PackageOpen, ServerCrash, ShieldAlert, Info, Zap, HardDrive, RefreshCw, Loader2, Sparkles } from 'lucide-react'
import { RestoreBackupButton } from '../components/restore-backup-button'
import { toast } from 'sonner'

const LOADING_TEXTS = [
  "Gathering JSON files...",
  "Packaging media uploads...",
  "Compressing archive...",
  "Almost there..."
]

export default function BackupClient() {
  const [isDownloading, setIsDownloading] = useState(false)
  const [loadingTextIdx, setLoadingTextIdx] = useState(0)

  useEffect(() => {
    if (!isDownloading) return
    const interval = setInterval(() => {
      setLoadingTextIdx(prev => (prev + 1) % LOADING_TEXTS.length)
    }, 1500)
    return () => clearInterval(interval)
  }, [isDownloading])

  const handleDownload = async () => {
    setIsDownloading(true)
    setLoadingTextIdx(0)
    try {
      const res = await fetch('/api/backup')
      if (!res.ok) throw new Error('Download failed')
      
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      
      const contentDisposition = res.headers.get('content-disposition')
      let filename = 'jbmgmc-backup.tar.gz'
      if (contentDisposition && contentDisposition.includes('filename=')) {
        filename = contentDisposition.split('filename=')[1].replace(/"/g, '')
      }
      
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success("Backup downloaded successfully!")
    } catch (err) {
      toast.error("Failed to download backup archive")
    } finally {
      setIsDownloading(false)
    }
  }

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
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Backup Flow */}
            <div>
              <h3 className="mb-4 font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Download className="w-5 h-5 text-teal-500" /> The Backup Flow
              </h3>
              <ol className="relative border-s border-slate-200 dark:border-slate-700 ml-3 space-y-4">                  
                <li className="ms-6">            
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-teal-100 rounded-full -start-3 ring-4 ring-white dark:ring-slate-900 dark:bg-teal-900/50">
                    <span className="text-xs font-bold text-teal-600 dark:text-teal-400">1</span>
                  </span>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">Gather JSON Data</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">System collects text data (users, events, settings) into a staging area.</p>
                </li>
                <li className="ms-6">            
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-teal-100 rounded-full -start-3 ring-4 ring-white dark:ring-slate-900 dark:bg-teal-900/50">
                    <span className="text-xs font-bold text-teal-600 dark:text-teal-400">2</span>
                  </span>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">Gather Uploads</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">System safely copies your live media folder (Images, PDFs) to the staging area.</p>
                </li>
                <li className="ms-6">            
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-teal-100 rounded-full -start-3 ring-4 ring-white dark:ring-slate-900 dark:bg-teal-900/50">
                    <span className="text-xs font-bold text-teal-600 dark:text-teal-400">3</span>
                  </span>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">Compress & Download</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Everything is bundled into a single secure <code>.tar.gz</code> archive and sent to your browser.</p>
                </li>
              </ol>
            </div>

            {/* Restore Flow */}
            <div>
              <h3 className="mb-4 font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-amber-500" /> The Restore Flow
              </h3>
              <ol className="relative border-s border-slate-200 dark:border-slate-700 ml-3 space-y-4">                  
                <li className="ms-6">            
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-amber-100 rounded-full -start-3 ring-4 ring-white dark:ring-slate-900 dark:bg-amber-900/50">
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">1</span>
                  </span>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">Validation Check</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">The uploaded archive is extracted to a hidden folder and verified for integrity.</p>
                </li>
                <li className="ms-6">            
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-amber-100 rounded-full -start-3 ring-4 ring-white dark:ring-slate-900 dark:bg-amber-900/50">
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">2</span>
                  </span>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">Atomic Swap</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Live data is instantly swapped with backup data in less than a millisecond (Zero Downtime).</p>
                </li>
                <li className="ms-6">            
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-amber-100 rounded-full -start-3 ring-4 ring-white dark:ring-slate-900 dark:bg-amber-900/50">
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">3</span>
                  </span>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">Cache Reload</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">The system memory cache is flushed, making the restored data immediately live.</p>
                </li>
                <li className="ms-6">            
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-rose-100 rounded-full -start-3 ring-4 ring-white dark:ring-slate-900 dark:bg-rose-900/50">
                    <ShieldAlert className="w-3 h-3 text-rose-600 dark:text-rose-400" />
                  </span>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">Fail-Safe Rollback</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">If the swap fails midway, the system automatically reverts to the original live data instantly.</p>
                </li>
              </ol>
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
          onClick={handleDownload}
          disabled={isDownloading}
          className={`flex items-center justify-center gap-2 w-full rounded-xl px-4 py-4 text-sm font-bold text-white transition-all duration-500 shadow-sm ${
            isDownloading 
              ? 'cursor-wait relative overflow-hidden scale-[0.99]' 
              : 'bg-teal-500 hover:bg-teal-600 hover:-translate-y-0.5 hover:shadow-lg shadow-teal-500/20'
          }`}
          style={isDownloading ? {
            background: 'linear-gradient(90deg, #0d9488, #14b8a6, #0ea5e9, #0d9488)',
            backgroundSize: '300% 100%',
            animation: 'gradient-sweep 3s ease infinite'
          } : {}}
        >
          {isDownloading ? (
            <>
              {/* Dynamic width progress overlay */}
              <div className="absolute left-0 top-0 bottom-0 bg-white/20 z-0 animate-[fill-progress_4s_ease-out_forwards]" />
              
              <Sparkles className="h-5 w-5 animate-pulse relative z-10 text-yellow-200" /> 
              <span className="relative z-10 w-48 text-left animate-pulse">
                {LOADING_TEXTS[loadingTextIdx]}
              </span>
              
              <style dangerouslySetInnerHTML={{__html: `
                @keyframes gradient-sweep {
                  0% { background-position: 0% 50%; }
                  50% { background-position: 100% 50%; }
                  100% { background-position: 0% 50%; }
                }
                @keyframes fill-progress {
                  0% { width: 0%; opacity: 1; }
                  90% { width: 95%; opacity: 1; }
                  100% { width: 100%; opacity: 0; }
                }
              `}} />
            </>
          ) : (
            <>
              <PackageOpen className="h-5 w-5" /> Download Complete Backup Archive
            </>
          )}
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
