'use client'

import React, { useState } from 'react'
import { NavigationItem, QuickLink, Testimonial } from '@/lib/db'
import { 
  updateNavItemsAction, 
  updateQuickLinksAction, 
  updateTestimonialsAction
} from '../actions'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Save, Plus, Trash2, Info, X, Navigation, Link as LinkIcon, 
  BarChart3, MessageSquare, Code2, Layout, 
  ChevronRight, Eye, EyeOff, CheckCircle2, ArrowRight
} from 'lucide-react'

// ────────────────────────────────────────────
//  Info Guide Modal
// ────────────────────────────────────────────
function InfoModal({ title, icon: Icon, steps, notes, onClose }: {
  title: string
  icon: React.ElementType
  steps: { heading: string; detail: string }[]
  notes?: string[]
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      {/* Panel */}
      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 dark:bg-teal-950">
              <Icon className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400">How to use</p>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">{title}</h3>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Steps */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-500 text-white text-[11px] font-bold mt-0.5">
                {i + 1}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{step.heading}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{step.detail}</p>
              </div>
            </div>
          ))}

          {notes && notes.length > 0 && (
            <div className="mt-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 p-4 space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">💡 Good to Know</p>
              {notes.map((note, i) => (
                <p key={i} className="text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                  <ArrowRight className="h-3 w-3 mt-0.5 shrink-0" />
                  {note}
                </p>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <button onClick={onClose} className="w-full rounded-xl bg-teal-500 hover:bg-teal-400 text-white text-sm font-semibold py-2.5 transition-colors">
            Got it!
          </button>
        </div>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────
//  Section Header with Info Button
// ────────────────────────────────────────────
function TabHeader({ title, subtitle, onInfo, onAdd, addLabel }: {
  title: string; subtitle: string
  onInfo: () => void
  onAdd?: () => void; addLabel?: string
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-200">{title}</h2>
            <button
              onClick={onInfo}
              title="How to use this section"
              className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 hover:bg-teal-100 dark:hover:bg-teal-900 transition-colors"
            >
              <Info className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>
        </div>
      </div>
      {onAdd && (
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950 border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors shrink-0"
        >
          <Plus className="h-3.5 w-3.5" />
          {addLabel || 'Add'}
        </button>
      )}
    </div>
  )
}

// ────────────────────────────────────────────
//  Save Bar (Sticky Floating)
// ────────────────────────────────────────────
function SaveBar({ onSave, isSaving, label, disabled }: { onSave: () => void; isSaving: boolean; label: string; disabled?: boolean }) {
  return (
    <div className="fixed bottom-8 right-8 lg:bottom-12 lg:right-12 z-[100] animate-in slide-in-from-bottom-8 fade-in duration-500">
      <button
        onClick={onSave}
        disabled={isSaving || disabled}
        className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-teal-600 to-teal-400 hover:from-teal-500 hover:to-teal-300 px-6 py-2.5 text-sm font-bold text-white shadow-[0_8px_30px_-10px_rgba(13,148,136,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_-10px_rgba(13,148,136,0.7)] active:scale-95 disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed border border-teal-400/30"
      >
        {isSaving ? (
          <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        ) : (
          <Save className="h-4 w-4 transition-transform group-hover:scale-110" />
        )}
        {isSaving ? 'Saving...' : label}
      </button>
    </div>
  )
}

// ────────────────────────────────────────────
//  Empty State
// ────────────────────────────────────────────
function EmptyState({ message, onAdd, addLabel }: { message: string; onAdd: () => void; addLabel: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 py-14 text-center">
      <p className="text-sm text-slate-400 dark:text-slate-500 mb-4">{message}</p>
      <button onClick={onAdd} className="flex items-center gap-2 rounded-xl bg-teal-500 hover:bg-teal-400 px-4 py-2 text-xs font-bold text-white transition-colors">
        <Plus className="h-3.5 w-3.5" /> {addLabel}
      </button>
    </div>
  )
}

// ────────────────────────────────────────────
//  Guide data per tab
// ────────────────────────────────────────────
const NAV_GUIDE = {
  title: 'Navigation Menu',
  steps: [
    { heading: 'Click "Add Top Menu Link"', detail: 'This adds a new main menu item that appears in the top navigation bar of the website.' },
    { heading: 'Fill in the Label', detail: 'The "Label" is the text that visitors will see in the menu bar, e.g. "About Us", "Departments".' },
    { heading: 'Fill in the URL/Link', detail: 'Enter the page link. Use "/" for Home, "/about" for About page, or a full URL like "https://example.com" for external sites.' },
    { heading: 'Add Submenu Items (Optional)', detail: 'Click "Add Dropdown Item" inside a menu card to add sub-links that appear as a dropdown when a visitor hovers over the main link.' },
    { heading: 'Click "Save Navigation"', detail: 'Press Save to apply all your changes to the live website immediately.' },
  ],
  notes: [
    'If you leave the navigation empty, the website will automatically use its built-in default menu.',
    'Changes take effect immediately after saving — no need to restart anything.',
    'For external websites, use the full link starting with "https://".',
  ]
}

const QUICKLINKS_GUIDE = {
  title: 'Quick Links',
  steps: [
    { heading: 'Click "Add Link"', detail: 'This adds a new shortcut link that appears in the Quick Links or Useful Links section on the homepage and footer.' },
    { heading: 'Select Category', detail: 'Choose whether this is a "Quick Link" (internal pages) or a "Useful Link" (external sites like MUHS).' },
    { heading: 'Fill in the Label', detail: 'The label is the short, clickable text that visitors will see, e.g. "Admission Info", "Download Brochure".' },
    { heading: 'Fill in the Link/URL', detail: 'The page or file the link should open. Use a local path like "/courses" or a full URL.' },
    { heading: 'Optionally set an Icon Name', detail: 'You can specify an icon name from Lucide Icons (e.g. "FileText", "Phone", "Globe"). If unsure, leave it as "Link".' },
    { heading: 'Click "Save Quick Links"', detail: 'Press Save to publish your changes. The footer and homepage will update instantly.' },
  ],
  notes: [
    'Quick Links appear both in the website footer and in a dedicated section on the Homepage.',
    'Keep labels short and descriptive — ideally under 4 words.',
  ]
}


const TESTIMONIALS_GUIDE = {
  title: 'Testimonials',
  steps: [
    { heading: 'Click "Add Testimonial"', detail: 'This creates a new testimonial card that will appear in the Testimonials section of the homepage.' },
    { heading: 'Enter the Person\'s Name', detail: 'The full name of the patient, student, or authority giving the testimonial.' },
    { heading: 'Enter their Role/Title', detail: 'Their relation to the college, e.g. "MBBS Student", "Patient", "Faculty Member".' },
    { heading: 'Write the Quote', detail: 'The actual testimonial text. Keep it genuine and between 1–4 sentences for best display.' },
    { heading: 'Click "Save Testimonials"', detail: 'Press Save to publish. New testimonials appear on the homepage immediately.' },
  ],
  notes: [
    'Testimonials only appear on the homepage if at least one is added.',
    'Short, specific testimonials look more trustworthy than long generic ones.',
  ]
}



// ────────────────────────────────────────────
//  Main Component
// ────────────────────────────────────────────
interface Props {
  initialNavItems: NavigationItem[]
  initialQuickLinks: QuickLink[]
  initialTestimonials: Testimonial[]
}

export default function SiteBuilderClient({
  initialNavItems,
  initialQuickLinks,
  initialTestimonials
}: Props) {
  const [isSaving, setIsSaving] = useState(false)
  const [navItems, setNavItems] = useState<NavigationItem[]>(initialNavItems)
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>(initialQuickLinks)
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials)
  const [openGuide, setOpenGuide] = useState<null | 'nav' | 'quicklinks' | 'testimonials'>(null)
  
  // Modal State
  const [isAddingLink, setIsAddingLink] = useState(false)
  const [newLinkData, setNewLinkData] = useState<{category: 'quick'|'useful', label: string, href: string, icon: string}>({ category: 'quick', label: '', href: '', icon: 'Link' })
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'nav'|'sub'|'quick'|'testimonial', id: string, navIndex?: number } | null>(null)

  // ── Compute Unsaved Changes ──
  const navHasChanges = JSON.stringify(navItems) !== JSON.stringify(initialNavItems)
  const quickLinksHasChanges = JSON.stringify(quickLinks) !== JSON.stringify(initialQuickLinks)
  const testimonialsHasChanges = JSON.stringify(testimonials) !== JSON.stringify(initialTestimonials)

  // ── Nav Handlers ──
  const handleAddNavItem = () => {
    const newItem: NavigationItem = { id: Date.now().toString(), label: 'New Link', href: '/', order: navItems.length, submenus: [] }
    setNavItems([...navItems, newItem])
  }
  const handleUpdateNavItem = (index: number, field: keyof NavigationItem, value: any) => {
    const updated = [...navItems]; updated[index] = { ...updated[index], [field]: value }; setNavItems(updated)
  }
  const handleDeleteNavItem = (id: string) => setNavItems(navItems.filter(item => item.id !== id))
  const handleAddSubmenu = (navIndex: number) => {
    const updated = [...navItems]
    updated[navIndex].submenus.push({ id: Date.now().toString(), label: 'Sub Link', href: '/', order: updated[navIndex].submenus.length })
    setNavItems(updated)
  }
  const handleUpdateSubmenu = (navIndex: number, subIndex: number, field: string, value: string) => {
    const updated = [...navItems]; updated[navIndex].submenus[subIndex] = { ...updated[navIndex].submenus[subIndex], [field]: value }; setNavItems(updated)
  }
  const handleDeleteSubmenu = (navIndex: number, subId: string) => {
    const updated = [...navItems]; updated[navIndex].submenus = updated[navIndex].submenus.filter(s => s.id !== subId); setNavItems(updated)
  }
  const handleSaveNavItems = async () => {
    setIsSaving(true)
    const res = await updateNavItemsAction(navItems)
    if (res.success) toast.success('Navigation menu saved successfully!') 
    else toast.error(res.error || 'Failed to save navigation')
    setIsSaving(false)
  }

  // ── Quick Links Handlers ──
  const handleAddQuickLink = () => {
    setNewLinkData({ category: 'quick', label: '', href: '', icon: 'Link' })
    setIsAddingLink(true)
  }
  const confirmAddLink = () => {
    if (!newLinkData.label || !newLinkData.href) return toast.error('Label and URL are required')
    setQuickLinks([...quickLinks, { id: Date.now().toString(), label: newLinkData.label, href: newLinkData.href, icon: newLinkData.icon || 'Link', order: quickLinks.length, category: newLinkData.category }])
    setIsAddingLink(false)
  }
  const handleSaveQuickLinks = async () => {
    setIsSaving(true)
    const res = await updateQuickLinksAction(quickLinks)
    if (res.success) toast.success('Quick Links saved successfully!')
    else toast.error(res.error || 'Failed to save quick links')
    setIsSaving(false)
  }


  // ── Testimonials Handlers ──
  const handleAddTestimonial = () => setTestimonials([...testimonials, { id: Date.now().toString(), authorName: 'New Person', role: 'Role', content: 'Enter testimonial text here...', image: '' }])
  const handleSaveTestimonials = async () => {
    setIsSaving(true)
    const res = await updateTestimonialsAction(testimonials)
    if (res.success) toast.success('Testimonials saved successfully!')
    else toast.error(res.error || 'Failed to save testimonials')
    setIsSaving(false)
  }



  return (
    <div className="space-y-8 pb-20">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <Layout className="h-6 w-6 text-teal-600 dark:text-teal-400" />
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-200">Website Layouts</h1>
        </div>
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
          Control all dynamic layout sections of your website — navigation, quick links, homepage stats, and testimonials.
        </p>
      </div>

      {/* Info Guide Modals */}
      {openGuide === 'nav' && <InfoModal icon={Navigation} title={NAV_GUIDE.title} steps={NAV_GUIDE.steps} notes={NAV_GUIDE.notes} onClose={() => setOpenGuide(null)} />}
      {openGuide === 'quicklinks' && <InfoModal icon={LinkIcon} title={QUICKLINKS_GUIDE.title} steps={QUICKLINKS_GUIDE.steps} notes={QUICKLINKS_GUIDE.notes} onClose={() => setOpenGuide(null)} />}
      {openGuide === 'testimonials' && <InfoModal icon={MessageSquare} title={TESTIMONIALS_GUIDE.title} steps={TESTIMONIALS_GUIDE.steps} notes={TESTIMONIALS_GUIDE.notes} onClose={() => setOpenGuide(null)} />}

      <Tabs defaultValue="navigation" className="space-y-6">
        <TabsList className="flex h-auto flex-wrap gap-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1.5 rounded-xl">
          <TabsTrigger value="navigation" className="flex items-center gap-1.5 rounded-lg text-xs font-semibold px-3 py-2">
            <Navigation className="h-3.5 w-3.5" /> Navigation
          </TabsTrigger>
          <TabsTrigger value="quicklinks" className="flex items-center gap-1.5 rounded-lg text-xs font-semibold px-3 py-2">
            <LinkIcon className="h-3.5 w-3.5" /> Quick Links
          </TabsTrigger>

          <TabsTrigger value="testimonials" className="flex items-center gap-1.5 rounded-lg text-xs font-semibold px-3 py-2">
            <MessageSquare className="h-3.5 w-3.5" /> Testimonials
          </TabsTrigger>

        </TabsList>

        {/* ─── TAB 1: NAVIGATION ─── */}
        <TabsContent value="navigation" className="space-y-6">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 p-5 space-y-6">
            <TabHeader
              title="Main Navigation Menu"
              subtitle="These are the links shown in the top header bar of the website. Add dropdowns by expanding each item."
              onInfo={() => setOpenGuide('nav')}
              onAdd={handleAddNavItem}
              addLabel="Add Top Menu Link"
            />

            {navItems.length === 0 ? (
              <EmptyState message="No navigation items yet. Add your first menu link to get started." onAdd={handleAddNavItem} addLabel="Add Top Menu Link" />
            ) : (
              <div className="space-y-4">
                {navItems.map((item, index) => (
                  <div key={item.id} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
                    {/* Top row */}
                    <div className="flex items-center gap-3 p-4 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 text-[11px] font-bold">
                        {index + 1}
                      </div>
                      <div className="flex flex-1 gap-3 flex-wrap sm:flex-nowrap">
                        <div className="flex-1 min-w-[120px]">
                          <label className="mb-1 block text-[10px] font-bold uppercase text-slate-500">Menu Label</label>
                          <input
                            value={item.label}
                            onChange={(e) => handleUpdateNavItem(index, 'label', e.target.value)}
                            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            placeholder="e.g. About Us"
                          />
                        </div>
                        <div className="flex-1 min-w-[120px]">
                          <label className="mb-1 block text-[10px] font-bold uppercase text-slate-500">Page URL / Link</label>
                          <input
                            value={item.href}
                            onChange={(e) => handleUpdateNavItem(index, 'href', e.target.value)}
                            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            placeholder="e.g. /about or https://..."
                          />
                        </div>
                      </div>
                      <button onClick={() => setDeleteConfirm({ type: 'nav', id: item.id })} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Submenus */}
                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Dropdown Submenu Items</span>
                        <button onClick={() => handleAddSubmenu(index)} className="flex items-center gap-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950 px-2.5 py-1.5 text-[10px] font-semibold text-slate-600 dark:text-slate-400 transition-colors">
                          <Plus className="h-3 w-3" /> Add Dropdown Item
                        </button>
                      </div>
                      {item.submenus.length === 0 ? (
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">No dropdown items — this link goes directly to the page URL above.</p>
                      ) : (
                        item.submenus.map((sub, sIndex) => (
                          <div key={sub.id} className="flex items-center gap-2 pl-2 border-l-2 border-teal-200 dark:border-teal-800">
                            <ChevronRight className="h-3 w-3 text-slate-400 shrink-0" />
                            <input
                              value={sub.label}
                              onChange={(e) => handleUpdateSubmenu(index, sIndex, 'label', e.target.value)}
                              placeholder="Dropdown Label"
                              className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                            <input
                              value={sub.href}
                              onChange={(e) => handleUpdateSubmenu(index, sIndex, 'href', e.target.value)}
                              placeholder="URL / Link"
                              className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                            <button onClick={() => setDeleteConfirm({ type: 'sub', id: sub.id, navIndex: index })} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <SaveBar onSave={handleSaveNavItems} isSaving={isSaving} label="Save" disabled={!navHasChanges} />
          </div>
        </TabsContent>

        {/* ─── TAB 2: QUICK LINKS ─── */}
        <TabsContent value="quicklinks" className="space-y-6">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 p-5 space-y-6">
            <TabHeader
              title="Quick Links"
              subtitle="These shortcut links appear in the website footer. Group them as Quick Links or Useful Links."
              onInfo={() => setOpenGuide('quicklinks')}
              onAdd={handleAddQuickLink}
              addLabel="Add Link"
            />

            {quickLinks.length === 0 ? (
              <EmptyState message="No links added yet. These appear in the website footer." onAdd={handleAddQuickLink} addLabel="Add Link" />
            ) : (
              <div className="space-y-8">
                {/* QUICK LINKS GROUP */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-2">Quick Links (Internal)</h3>
                  {quickLinks.map((link, index) => {
                    if (link.category === 'useful') return null
                    return (
                      <div key={link.id} className={`flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border p-3 shadow-sm transition-colors border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900`}>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                          <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold bg-sky-50 dark:bg-sky-950 text-sky-500`}>
                            {index + 1}
                          </div>
                          <select
                            value={link.category || 'quick'}
                            onChange={(e) => { const u = [...quickLinks]; u[index].category = e.target.value as 'quick'|'useful'; setQuickLinks(u) }}
                            className={`w-full sm:w-32 rounded-lg border px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800`}
                          >
                            <option value="quick">Quick Link</option>
                            <option value="useful">Useful Link</option>
                          </select>
                        </div>
                      
                      <div className="flex flex-1 gap-3 flex-wrap sm:flex-nowrap">
                        <div className="flex-1 min-w-[100px]">
                          <label className="mb-1 block text-[10px] font-bold uppercase text-slate-500">Label</label>
                          <input
                            value={link.label}
                            onChange={(e) => { const u = [...quickLinks]; u[index].label = e.target.value; setQuickLinks(u) }}
                            placeholder="e.g. Admission Info"
                            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                          />
                        </div>
                        <div className="flex-1 min-w-[100px]">
                          <label className="mb-1 block text-[10px] font-bold uppercase text-slate-500">Link / URL</label>
                          <input
                            value={link.href}
                            onChange={(e) => { const u = [...quickLinks]; u[index].href = e.target.value; setQuickLinks(u) }}
                            placeholder="/courses or https://..."
                            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                          />
                        </div>
                        <div className="w-28 shrink-0">
                          <label className="mb-1 block text-[10px] font-bold uppercase text-slate-500">Icon Name</label>
                          <input
                            value={link.icon || ''}
                            onChange={(e) => { const u = [...quickLinks]; u[index].icon = e.target.value; setQuickLinks(u) }}
                            placeholder="e.g. FileText"
                            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                          />
                        </div>
                      </div>
                      <button onClick={() => setDeleteConfirm({ type: 'quick', id: link.id })} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    )
                  })}
                </div>

                {/* USEFUL LINKS GROUP */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-indigo-800 dark:text-indigo-300 border-b border-indigo-200 dark:border-indigo-800/60 pb-2">Useful Links (External)</h3>
                  {quickLinks.map((link, index) => {
                    if (link.category !== 'useful') return null
                    return (
                      <div key={link.id} className={`flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border p-3 shadow-sm transition-colors border-indigo-200 dark:border-indigo-800/60 bg-indigo-50/40 dark:bg-indigo-900/10`}>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                          <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400`}>
                            {index + 1}
                          </div>
                          <select
                            value={link.category || 'quick'}
                            onChange={(e) => { const u = [...quickLinks]; u[index].category = e.target.value as 'quick'|'useful'; setQuickLinks(u) }}
                            className={`w-full sm:w-32 rounded-lg border px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors border-indigo-200 dark:border-indigo-700/50 bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300`}
                          >
                            <option value="quick">Quick Link</option>
                            <option value="useful">Useful Link</option>
                          </select>
                        </div>
                      
                      <div className="flex flex-1 gap-3 flex-wrap sm:flex-nowrap">
                        <div className="flex-1 min-w-[100px]">
                          <label className="mb-1 block text-[10px] font-bold uppercase text-slate-500">Label</label>
                          <input
                            value={link.label}
                            onChange={(e) => { const u = [...quickLinks]; u[index].label = e.target.value; setQuickLinks(u) }}
                            placeholder="e.g. Admission Info"
                            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                          />
                        </div>
                        <div className="flex-1 min-w-[100px]">
                          <label className="mb-1 block text-[10px] font-bold uppercase text-slate-500">Link / URL</label>
                          <input
                            value={link.href}
                            onChange={(e) => { const u = [...quickLinks]; u[index].href = e.target.value; setQuickLinks(u) }}
                            placeholder="/courses or https://..."
                            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                          />
                        </div>
                        <div className="w-28 shrink-0">
                          <label className="mb-1 block text-[10px] font-bold uppercase text-slate-500">Icon Name</label>
                          <input
                            value={link.icon || ''}
                            onChange={(e) => { const u = [...quickLinks]; u[index].icon = e.target.value; setQuickLinks(u) }}
                            placeholder="e.g. FileText"
                            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                          />
                        </div>
                      </div>
                      <button onClick={() => setDeleteConfirm({ type: 'quick', id: link.id })} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    )
                  })}
                </div>
              </div>
            )}
            <SaveBar onSave={handleSaveQuickLinks} isSaving={isSaving} label="Save" disabled={!quickLinksHasChanges} />
          </div>
        </TabsContent>


        {/* ─── TAB 4: TESTIMONIALS ─── */}
        <TabsContent value="testimonials" className="space-y-6">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 p-5 space-y-6">
            <TabHeader
              title="Testimonials"
              subtitle="Patient, student, and faculty testimonials shown in a dedicated section on the homepage."
              onInfo={() => setOpenGuide('testimonials')}
              onAdd={handleAddTestimonial}
              addLabel="Add Testimonial"
            />

            {testimonials.length === 0 ? (
              <EmptyState message="No testimonials added yet. Add quotes from patients, students, or faculty." onAdd={handleAddTestimonial} addLabel="Add Testimonial" />
            ) : (
              <div className="space-y-4">
                {testimonials.map((t, index) => (
                  <div key={t.id} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-500 text-[11px] font-bold">
                          {index + 1}
                        </div>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{t.authorName || 'New Testimonial'}</span>
                      </div>
                      <button onClick={() => setDeleteConfirm({ type: 'testimonial', id: t.id })} className="flex h-7 w-7 items-center justify-center rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-[10px] font-bold uppercase text-slate-500">Person's Name</label>
                        <input
                          value={t.authorName}
                          onChange={(e) => { const u = [...testimonials]; u[index].authorName = e.target.value; setTestimonials(u) }}
                          placeholder="e.g. Rahul Patil"
                          className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[10px] font-bold uppercase text-slate-500">Role / Title</label>
                        <input
                          value={t.role}
                          onChange={(e) => { const u = [...testimonials]; u[index].role = e.target.value; setTestimonials(u) }}
                          placeholder="e.g. MBBS Student, Patient"
                          className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-[10px] font-bold uppercase text-slate-500">Testimonial Quote</label>
                      <textarea
                        value={t.content}
                        rows={3}
                        onChange={(e) => { const u = [...testimonials]; u[index].content = e.target.value; setTestimonials(u) }}
                        placeholder="Write what this person said about the college or hospital..."
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
            <SaveBar onSave={handleSaveTestimonials} isSaving={isSaving} label="Save" disabled={!testimonialsHasChanges} />
          </div>
        </TabsContent>


      </Tabs>
      
      {/* ──────────────────────────────────────────── */}
      {/*  ADD LINK MODAL */}
      {/* ──────────────────────────────────────────── */}
      {isAddingLink && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100 text-teal-600 dark:bg-teal-900/50 dark:text-teal-400">
                <LinkIcon className="h-4 w-4" />
              </span>
              Add New Link
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase text-slate-500">Category</label>
                <select 
                  value={newLinkData.category}
                  onChange={e => setNewLinkData({...newLinkData, category: e.target.value as any})}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="quick">Quick Link (Internal Pages)</option>
                  <option value="useful">Useful Link (External Websites)</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase text-slate-500">Label Text</label>
                <input 
                  value={newLinkData.label}
                  onChange={e => setNewLinkData({...newLinkData, label: e.target.value})}
                  placeholder="e.g. Admission Info, MUHS Nashik..."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase text-slate-500">Link / URL</label>
                <input 
                  value={newLinkData.href}
                  onChange={e => setNewLinkData({...newLinkData, href: e.target.value})}
                  placeholder="e.g. /courses or https://..."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase text-slate-500">Icon Name (Optional)</label>
                <input 
                  value={newLinkData.icon}
                  onChange={e => setNewLinkData({...newLinkData, icon: e.target.value})}
                  placeholder="e.g. FileText, Link, Globe"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
            
            <div className="mt-8 flex justify-end gap-3">
              <button 
                onClick={() => setIsAddingLink(false)} 
                className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmAddLink} 
                className="flex items-center gap-2 rounded-xl bg-teal-500 px-5 py-2 text-sm font-semibold text-white hover:bg-teal-400 transition-colors shadow-sm shadow-teal-500/20"
              >
                <Plus className="h-4 w-4" /> Add Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────── */}
      {/*  DELETE CONFIRM MODAL */}
      {/* ──────────────────────────────────────────── */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-xl border border-red-200 dark:border-red-900/50">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400">
                <Trash2 className="h-4 w-4" />
              </span>
              Confirm Deletion
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Are you sure you want to delete this item? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setDeleteConfirm(null)} 
                className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  if (deleteConfirm.type === 'nav') handleDeleteNavItem(deleteConfirm.id)
                  if (deleteConfirm.type === 'sub' && deleteConfirm.navIndex !== undefined) handleDeleteSubmenu(deleteConfirm.navIndex, deleteConfirm.id)
                  if (deleteConfirm.type === 'quick') setQuickLinks(quickLinks.filter(l => l.id !== deleteConfirm.id))
                  if (deleteConfirm.type === 'testimonial') setTestimonials(testimonials.filter(t => t.id !== deleteConfirm.id))
                  setDeleteConfirm(null)
                }} 
                className="flex items-center gap-2 rounded-xl bg-red-500 px-5 py-2 text-sm font-semibold text-white hover:bg-red-600 transition-colors shadow-sm shadow-red-500/20"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
