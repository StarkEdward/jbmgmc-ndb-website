'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { loginAction } from './actions'
import { toast } from 'sonner'
import { Lock, Stethoscope, ArrowLeft, Loader2, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password.trim()) {
      toast.error('Please enter the administrator password')
      return
    }

    setIsPending(true)
    try {
      const res = await loginAction(password)
      if (res.success) {
        toast.success('Access granted! Opening Admin Dashboard...')
        router.push('/admin')
        router.refresh()
      } else {
        toast.error(res.error || 'Authentication failed')
      }
    } catch (err) {
      toast.error('An error occurred during login. Please try again.')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white dark:bg-slate-950 px-4 font-sans text-slate-900 dark:text-slate-100">
      {/* Dynamic abstract radial gradients for premium depth */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,rgba(13,148,136,0.15),transparent_40%)]" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_bottom_left,rgba(30,58,138,0.2),transparent_40%)]" />

      {/* Floating Stethoscope Background Grid Decorator */}
      <div className="absolute top-1/2 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-500/5 blur-[80px]" />

      <div className="z-10 w-full max-w-md">
        {/* Back Link */}
        <Link 
          href="/" 
          className="group mb-8 inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 transition-colors hover:text-teal-600 dark:text-teal-400"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Public Portal
        </Link>

        {/* Institution Brand */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white p-1 ring-1 ring-slate-200 shadow-[0_0_20px_rgba(0,0,0,0.05)]">
            <Image src="/images/logo.png" alt="Logo" width={48} height={48} className="object-contain w-full h-full" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-2xl">
            JBMGMC Nandurbar
          </h1>
          <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
            Government Medical College Admin Workspace
          </p>
        </div>

        {/* Login Card */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/60 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          <div className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-teal-500/50 to-transparent" />
          
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800/80 text-teal-600 dark:text-teal-400 ring-1 ring-slate-700/50">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200">
                Staff Authentication
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Enter your administrative key to continue
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label 
                htmlFor="password" 
                className="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
              >
                Security Access Key
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  disabled={isPending}
                  className="w-full rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 py-3.5 pl-4 pr-12 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-600 focus:border-teal-500/80 focus:outline-none focus:ring-1 focus:ring-teal-500/80 disabled:opacity-50 transition-colors"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <ShieldCheck className="h-5 w-5 text-slate-600" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-teal-500 py-3.5 text-sm font-semibold text-slate-950 shadow-[0_0_20px_rgba(20,184,166,0.2)] hover:bg-teal-400 active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100 cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-slate-950" />
                  Verifying Keys...
                </>
              ) : (
                'Access Dashboard'
              )}
            </button>
          </form>
        </div>

        {/* Security Notice */}
        <p className="mt-8 text-center text-xs text-slate-500">
          This system is restricted to authorized administrative personnel. 
          Unauthorized access attempts are monitored and recorded.
        </p>
      </div>
    </div>
  )
}
