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
  FileText,
  Layout,
  FileStack
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
  const [builderOpen, setBuilderOpen] = useState(pathname.includes('/admin/site-builder') || pathname.includes('/admin/pages') || pathname.includes('/admin/institution-data') || pathname.includes('/admin/settings'))
  const [showExitPrompt, setShowExitPrompt] = useState(false)

  // Skip the admin shell layout completely if we are on the login page
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Departments & Staff', href: '/admin/departments', icon: Building2 },
    { name: 'News & Events', href: '/admin/news-events', icon: Megaphone },
    { name: 'Campus Gallery', href: '/admin/gallery', icon: ImageIcon },
    { name: 'Courses & Hostels', href: '/admin/courses-hostel', icon: GraduationCap },
    { name: 'Committees & Library', href: '/admin/committees-library', icon: Shield },
    { 
      name: 'Website Builder', 
      type: 'collapsible',
      icon: Palette,
      items: [
        { name: 'Website Layouts', href: '/admin/site-builder', icon: Layout },
        { name: 'Dynamic Pages', href: '/admin/pages', icon: FileText },
        { name: 'Institution Data Hub', href: '/admin/institution-data', icon: FileStack },
        { name: 'Global Settings', href: '/admin/settings', icon: Settings },
      ]
    },
    { name: 'Settings', type: 'header' },
    { name: 'Admin Settings', href: '/admin/security', icon: Shield },
  ]

  const handleLogout = async () => {
    try {
      await logoutAction()
      toast.success('Logged out successfully')
      router.push('/admin/login')
      router.refresh()
    } catch (e: any) {
      toast.error(e?.message || 'Logout failed')
    }
  }

  const handleExitToPublic = async () => {
    try {
      await logoutAction()
      toast.success('Admin session closed securely')
      setShowExitPrompt(false)
      router.push('/')
      router.refresh()
    } catch (e: any) {
      toast.error(e?.message || 'Failed to close session')
      router.push('/')
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
          <Link 
            href="/" 
            className="flex items-center gap-3"
            onClick={(e) => {
              e.preventDefault();
              setShowExitPrompt(true);
            }}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white p-1 ring-1 ring-slate-200 shadow-sm">
              <Image src="/images/logo.png" alt="Logo" width={32} height={32} className="object-contain w-full h-full" />
            </div>
            <div className="flex-1">
              <h1 className="text-[11px] leading-snug font-bold tracking-wide text-slate-800 dark:text-slate-200 uppercase">Jannayak Birsa Munda <br /> Government Medical College</h1>
              <p className="text-[9px] font-semibold text-teal-600 dark:text-teal-500 uppercase tracking-widest mt-0.5">Nandurbar</p>
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
        <nav className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto hide-scrollbar">
          {navigation.map((item, idx) => {
            if (item.type === 'header') {
              return (
                <h3 key={`header-${idx}`} className="px-4 pt-4 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {item.name}
                </h3>
              )
            }

            if (item.type === 'collapsible') {
              const isActiveGroup = item.items?.some(sub => pathname === sub.href)
              return (
                <div key={item.name} className="space-y-1">
                  <button
                    onClick={() => setBuilderOpen(!builderOpen)}
                    className={`w-full group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                      isActiveGroup
                        ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon && <item.icon className={`h-4 w-4 transition-transform duration-200 group-hover:scale-105 ${isActiveGroup ? 'text-teal-500' : 'text-slate-400'}`} />}
                      {item.name}
                    </div>
                    <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${builderOpen ? 'rotate-90' : ''} ${isActiveGroup ? 'text-teal-500' : 'text-slate-400'}`} />
                  </button>
                  
                  {builderOpen && (
                    <div className="space-y-1 pl-4 mt-1">
                      {item.items?.map(sub => {
                        const isActive = pathname === sub.href
                        return (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            className={`group flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                              isActive
                                ? 'text-teal-600 dark:text-teal-400 bg-teal-50/50 dark:bg-teal-900/10'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                            }`}
                          >
                            <span className="flex items-center gap-3">
                              {sub.icon ? (
                                <sub.icon className={`h-4 w-4 transition-transform duration-200 group-hover:scale-105 ${isActive ? 'text-teal-500 dark:text-teal-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-500 dark:group-hover:text-slate-400'}`} />
                              ) : (
                                <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-600 group-hover:bg-slate-400'}`} />
                              )}
                              {sub.name}
                            </span>
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            }

            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href!}
                className={`group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-teal-500/15 dark:from-teal-500/20 to-teal-500/5 text-teal-600 dark:text-teal-400 ring-1 ring-teal-500/10 dark:ring-teal-500/20'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-800 dark:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon && <item.icon className={`h-4 w-4 transition-transform duration-200 group-hover:scale-105 ${isActive ? 'text-teal-500 dark:text-teal-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 group-hover:dark:text-slate-400'}`} />}
                  {item.name}
                </div>
                {isActive && <ChevronRight className="h-3.5 w-3.5 text-teal-550 dark:text-teal-400" />}
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

      {/* Exit Prompt Modal */}
      {showExitPrompt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md transition-all duration-300">
          <div className="mx-4 w-full max-w-md overflow-hidden rounded-3xl bg-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-2xl dark:bg-slate-900/80 border border-white/50 dark:border-slate-700/50 animate-in fade-in zoom-in-95 duration-300">
            <div className="p-8">
              <div className="mb-6 flex items-start gap-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 shadow-inner">
                  <LogOut className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Leave Admin Panel?</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">You are about to exit the secure administrative area. Your session will be closed to protect sensitive data.</p>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={() => setShowExitPrompt(false)}
                  className="rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  Stay Here
                </button>
                <button
                  onClick={handleExitToPublic}
                  className="rounded-xl bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-teal-700 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 transition-all active:scale-95"
                >
                  Yes, Leave
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
