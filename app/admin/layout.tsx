'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { logoutAction } from './login/actions'
import { toast } from 'sonner'
import { ThemeToggle } from '@/components/header'
import { 
  LayoutDashboard, 
  Building2, 
  Megaphone, 
  Image as ImageIcon, 
  GraduationCap, 
  LogOut, 
  Menu, 
  X, 
  ChevronRight,
  Settings,
  Shield,
  Palette,
  FileText
} from 'lucide-react'
import Image from 'next/image'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Skip the admin shell layout completely if we are on the login page
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Dynamic Pages', href: '/admin/pages', icon: FileText },
    { name: 'Departments & Staff', href: '/admin/departments', icon: Building2 },
    { name: 'News & Events', href: '/admin/news-events', icon: Megaphone },
    { name: 'Campus Gallery', href: '/admin/gallery', icon: ImageIcon },
    { name: 'Courses & Hostels', href: '/admin/courses-hostel', icon: GraduationCap },
    { name: 'Committees & Library', href: '/admin/committees-library', icon: Shield },
    { name: 'Site Builder', href: '/admin/site-builder', icon: Palette },
    { name: 'Global Settings', href: '/admin/settings', icon: Settings },
    { name: 'Advanced Content', href: '/admin/advanced-settings', icon: Settings },
  ]

  const handleLogout = async () => {
    try {
      await logoutAction()
      toast.success('Logged out successfully')
      router.push('/admin/login')
      router.refresh()
    } catch (e) {
      toast.error('Logout failed')
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 antialiased">
      {/* Background Glows */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(13,148,136,0.04),transparent_50%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(13,148,136,0.08),transparent_50%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom_left,rgba(30,58,138,0.05),transparent_50%)] dark:bg-[radial-gradient(circle_at_bottom_left,rgba(30,58,138,0.1),transparent_50%)]" />

      {/* MOBILE HEADER BAR */}
      <header className="fixed top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-6 backdrop-blur-md lg:hidden">
        <div className="flex items-center gap-2">
          <Image src="/images/logo.png" alt="Logo" width={24} height={24} className="object-contain" />
          <span className="text-sm font-bold tracking-tight text-slate-950 dark:text-slate-100">JBMGMC Admin</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-800 dark:text-slate-200 cursor-pointer"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* SIDEBAR SIDE BAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/70 backdrop-blur-xl transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="flex h-20 items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800/80">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white p-1 ring-1 ring-slate-200 shadow-sm">
              <Image src="/images/logo.png" alt="Logo" width={32} height={32} className="object-contain w-full h-full" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-wider text-slate-800 dark:text-slate-200 uppercase">JBMGMC</h1>
              <p className="text-[10px] font-semibold text-teal-600 dark:text-teal-500 uppercase tracking-widest">Nandurbar</p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setSidebarOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-800 dark:text-slate-200 lg:hidden cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 space-y-1.5 px-4 py-6">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-teal-500/15 dark:from-teal-500/20 to-teal-500/5 text-teal-600 dark:text-teal-400 ring-1 ring-teal-500/10 dark:ring-teal-500/20'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-800 dark:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`h-5 w-5 transition-transform duration-200 group-hover:scale-105 ${isActive ? 'text-teal-500 dark:text-teal-400' : 'text-slate-600 dark:text-slate-400 dark:text-slate-500 group-hover:text-slate-600 group-hover:dark:text-slate-400'}`} />
                  {item.name}
                </div>
                {isActive && <ChevronRight className="h-4 w-4 text-teal-550 dark:text-teal-400" />}
              </Link>
            )
          })}
        </nav>

        {/* Admin Identity Card & Log Out */}
        <div className="border-t border-slate-200 dark:border-slate-800/80 p-4">
          <div className="mb-4 flex items-center gap-3 rounded-xl bg-slate-100/50 dark:bg-slate-950/40 p-3 ring-1 ring-slate-200 dark:ring-slate-800">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500/10 text-teal-500 dark:text-teal-400">
              <span className="font-semibold text-sm">SR</span>
            </div>
            <div className="overflow-hidden">
              <p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200">Dr. Sanjay Rathod</p>
              <p className="text-[10px] text-teal-600 dark:text-teal-500">Institution Dean</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/5 py-3 text-sm font-semibold text-rose-500 dark:text-rose-400 hover:bg-rose-500/10 transition-colors active:scale-[0.98] cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex flex-1 flex-col overflow-hidden min-h-screen">
        <main className="flex-1 overflow-y-auto px-6 py-8 pt-24 lg:pt-8">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
