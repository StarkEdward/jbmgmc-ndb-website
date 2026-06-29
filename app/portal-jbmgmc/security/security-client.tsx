'use client'

import React, { useState } from 'react'
import { Save, Lock, Loader2, ShieldCheck, Database, FileStack, Settings } from 'lucide-react'
import { toast } from 'sonner'
import { updateAdminCredentialsAction } from '../actions'

import BackupClient from '../backup/backup-client'
import StorageManagement from '../storage/storage-client'

export default function SecurityClient() {
  const [activeTab, setActiveTab] = useState<'security' | 'storage' | 'backup'>('security')
  const [isPending, setIsPending] = useState(false)

  // Credentials state
  const [adminUser, setAdminUser] = useState('admin')
  const [adminPassword, setAdminPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')


  const handleSaveSecurity = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!adminUser.trim()) {
      toast.error('Username cannot be empty')
      return
    }
    if (adminPassword && adminPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setIsPending(true)
    try {
      const res = await updateAdminCredentialsAction(
        adminUser,
        adminPassword || ''
      )

      if (res.success) {
        toast.success('Admin credentials updated successfully')
        setAdminPassword('')
        setConfirmPassword('')
      } else {
        toast.error(res.error || 'Failed to update credentials')
      }
    } catch (e: any) {
      toast.error(e?.message || 'An error occurred')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">System Settings</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Manage your administrator account security, system storage, and backups.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-8 flex space-x-1 rounded-2xl bg-slate-100 dark:bg-slate-800 p-1 w-full max-w-2xl">
        <button
          onClick={() => setActiveTab('security')}
          className={`flex-1 flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold transition-all ${
            activeTab === 'security'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
          Admin Security
        </button>
        <button
          onClick={() => setActiveTab('storage')}
          className={`flex-1 flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold transition-all ${
            activeTab === 'storage'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
          }`}
        >
          <FileStack className="h-4 w-4" />
          Storage & Data
        </button>
        <button
          onClick={() => setActiveTab('backup')}
          className={`flex-1 flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold transition-all ${
            activeTab === 'backup'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
          }`}
        >
          <Database className="h-4 w-4" />
          Backup & Restore
        </button>
      </div>

      <div className="w-full">
        {activeTab === 'security' && (
          <div className="max-w-2xl items-start animate-fade-in">
            {/* Admin Account Security */}
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                <ShieldCheck className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                <h2 className="text-base font-bold text-slate-800 dark:text-slate-200">Admin Account Security</h2>
              </div>

              <form onSubmit={handleSaveSecurity} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Administrator Username</label>
                  <input 
                    type="text" 
                    value={adminUser}
                    onChange={(e) => setAdminUser(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">New Password (leave blank to keep current)</label>
                  <div className="relative">
                    <input 
                      type="password" 
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 pl-10 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                      placeholder="••••••••••••"
                    />
                    <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Confirm New Password</label>
                  <div className="relative">
                    <input 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 pl-10 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                      placeholder="••••••••••••"
                    />
                    <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isPending}
                    className="flex items-center justify-center gap-2 rounded-xl bg-teal-500 px-6 py-2.5 text-sm font-bold text-white hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-70 transition-colors"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-white" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 text-white" />
                        Save Security Credentials
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'storage' && (
          <div className="animate-fade-in w-full">
            <StorageManagement />
          </div>
        )}

        {activeTab === 'backup' && (
          <div className="animate-fade-in w-full max-w-4xl">
            <BackupClient />
          </div>
        )}
      </div>
    </div>
  )
}
