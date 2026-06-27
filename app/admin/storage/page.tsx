import React from 'react'
import StorageClient from './storage-client'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyToken } from '@/lib/session'

export const dynamic = 'force-dynamic'

export default async function StoragePage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_session')?.value

  if (!token) {
    redirect('/admin/login')
  }

  const session = await verifyToken(token)
  if (!session) {
    redirect('/admin/login')
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">Storage & Files</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Manage system storage, view uploaded files, and clean up orphaned data to free up server space.
        </p>
      </div>

      <StorageClient />
    </div>
  )
}
