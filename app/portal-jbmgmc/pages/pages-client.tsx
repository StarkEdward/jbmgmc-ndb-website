'use client'

import React, { useState, useMemo } from 'react'
import { DynamicPage } from '@/lib/db'
import { updateDynamicPageAction, deleteDynamicPageAction } from '../actions'
import { toast } from 'sonner'
import { Plus, Edit2, Trash2, Save, X, FileText, Search, ExternalLink, Globe, Lock, LayoutTemplate, Maximize2, Minimize2 } from 'lucide-react'
import Link from 'next/link'
import { sanitizeHtml } from '@/lib/sanitize'

export default function PagesClient({ initialPages }: { initialPages: DynamicPage[] }) {
  const [pages, setPages] = useState<DynamicPage[]>(initialPages)
  const [editingPage, setEditingPage] = useState<DynamicPage | null>(null)
  const [isPending, setIsPending] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<string>('all')
  const [distractionFree, setDistractionFree] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingPage || !editingPage.slug || !editingPage.title) return

    setIsPending(true)
    try {
      const res = await updateDynamicPageAction(editingPage)
      if (res.success) {
        toast.success('Page saved successfully!')
        setPages(prev => {
          const idx = prev.findIndex(p => p.slug === editingPage.slug)
          if (idx >= 0) {
            const newArr = [...prev]
            newArr[idx] = editingPage
            return newArr
          }
          return [...prev, editingPage]
        })
        setEditingPage(null)
      } else {
        toast.error(res.error || 'Failed to save page')
      }
    } catch (e: any) {
      toast.error(e?.message || 'Error saving page')
    } finally {
      setIsPending(false)
    }
  }

  const handleDelete = async (slug: string) => {
    if (!confirm(`Are you sure you want to delete the page "${slug}"?`)) return
    try {
      const res = await deleteDynamicPageAction(slug)
      if (res.success) {
        toast.success('Page deleted')
        setPages(prev => prev.filter(p => p.slug !== slug))
      } else {
        toast.error(res.error || 'Failed to delete')
      }
    } catch (e: any) {
      toast.error(e?.message || 'Error deleting page')
    }
  }

  const handleToggleStatus = async (page: DynamicPage) => {
    const newStatus: 'published' | 'draft' = page.status === 'published' ? 'draft' : 'published'
    const updatedPage = { ...page, status: newStatus }
    
    setIsPending(true)
    try {
      const res = await updateDynamicPageAction(updatedPage)
      if (res.success) {
        toast.success(`Page marked as ${newStatus}`)
        setPages(prev => prev.map(p => p.slug === page.slug ? updatedPage : p))
      } else {
        toast.error(res.error || 'Failed to update status')
      }
    } catch (e: any) {
      toast.error(e?.message || 'Error updating status')
    } finally {
      setIsPending(false)
    }
  }

  const filteredPages = useMemo(() => {
    return pages.filter(p => 
      !p.slug.startsWith('committees/') && 
      !p.slug.startsWith('nursing/') && 
      (p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
       p.slug.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  }, [pages, searchQuery])

  const categories = useMemo(() => {
    const cats = new Set<string>()
    pages.forEach(p => {
      if (!p.slug.startsWith('committees/') && !p.slug.startsWith('nursing/')) {
        const parts = p.slug.split('/')
        cats.add(parts.length > 1 ? parts[0] : 'general')
      }
    })
    return Array.from(cats).sort()
  }, [pages])

  const displayedPages = useMemo(() => {
    if (activeTab === 'all') return filteredPages
    return filteredPages.filter(p => {
      const parts = p.slug.split('/')
      const cat = parts.length > 1 ? parts[0] : 'general'
      return cat === activeTab
    })
  }, [filteredPages, activeTab])

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <LayoutTemplate className="h-6 w-6 text-teal-500" />
            Dynamic Pages Manager
          </h1>
          <p className="text-sm text-slate-500 mt-1">Create, organize, and optimize custom site pages.</p>
        </div>
        <button
          onClick={() => setEditingPage({ slug: '', title: '', content: '', status: 'draft', showInFooter: false })}
          className="flex items-center justify-center gap-2 rounded-xl bg-teal-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-600 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Create New Page
        </button>
      </div>

      {editingPage ? (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Edit2 className="h-5 w-5 text-teal-500" />
              {editingPage.slug ? 'Edit Dynamic Page' : 'Create New Page'}
            </h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDistractionFree(!distractionFree)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors tooltip-trigger"
                title={distractionFree ? "Show Settings Panel" : "Distraction-Free Mode"}
              >
                {distractionFree ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
              </button>
              <button
                type="button"
                onClick={() => setEditingPage(null)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Settings (Hidden in Distraction-Free Mode) */}
              {!distractionFree && (
                <div className="lg:col-span-1 space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 uppercase tracking-wider">Page Configuration</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">URL Slug</label>
                        <input
                          type="text"
                          required
                        value={editingPage.slug}
                        onChange={e => setEditingPage({ ...editingPage, slug: e.target.value })}
                        disabled={!!pages.find(p => p.slug === editingPage.slug)}
                        placeholder="e.g., about/our-history"
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent px-4 py-2.5 text-sm disabled:opacity-50 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                      {pages.find(p => p.slug === editingPage.slug) && (
                        <p className="text-xs text-amber-500 mt-1.5">Slug cannot be changed after creation.</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Page Title</label>
                      <input
                        type="text"
                        required
                        value={editingPage.title}
                        onChange={e => setEditingPage({ ...editingPage, title: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Visibility Status</label>
                      <select 
                        value={editingPage.status || 'draft'} 
                        onChange={e => setEditingPage({...editingPage, status: e.target.value as 'published'|'draft'})}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                      >
                        <option value="draft">Draft (Hidden)</option>
                        <option value="published">Published (Live)</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                      <input
                        type="checkbox"
                        id="footerToggle"
                        checked={editingPage.showInFooter || false}
                        onChange={e => setEditingPage({ ...editingPage, showInFooter: e.target.checked })}
                        className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-600"
                      />
                      <label htmlFor="footerToggle" className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                        Show in Footer Quick Links
                      </label>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 uppercase tracking-wider">SEO Metadata</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Meta Description</label>
                      <textarea
                        value={editingPage.metaDescription || ''}
                        onChange={e => setEditingPage({ ...editingPage, metaDescription: e.target.value })}
                        rows={3}
                        placeholder="Brief summary for Google search results..."
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">SEO Keywords</label>
                      <input
                        type="text"
                        value={editingPage.keywords || ''}
                        onChange={e => setEditingPage({ ...editingPage, keywords: e.target.value })}
                        placeholder="comma, separated, keywords"
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Right Column: Editor & Preview */}
              <div className={distractionFree ? "lg:col-span-3 space-y-4" : "lg:col-span-2 space-y-4"}>
                <div className="flex flex-col gap-6 h-full min-h-[500px]">
                  {/* Editor Pane */}
                  <div className="flex flex-col h-[400px]">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">HTML / Markdown Editor</label>
                      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg flex-wrap">
                         <button type="button" onClick={() => {
                           const el = document.getElementById('content-textarea') as HTMLTextAreaElement;
                           if (el) { const start = el.selectionStart; const end = el.selectionEnd; const text = editingPage.content; setEditingPage({...editingPage, content: text.substring(0, start) + '<b>' + text.substring(start, end) + '</b>' + text.substring(end)}); }
                         }} className="px-2 py-1 text-xs font-bold hover:bg-white dark:hover:bg-slate-700 rounded transition-colors" title="Bold">B</button>
                         <button type="button" onClick={() => {
                           const el = document.getElementById('content-textarea') as HTMLTextAreaElement;
                           if (el) { const start = el.selectionStart; const end = el.selectionEnd; const text = editingPage.content; setEditingPage({...editingPage, content: text.substring(0, start) + '<i>' + text.substring(start, end) + '</i>' + text.substring(end)}); }
                         }} className="px-2 py-1 text-xs italic hover:bg-white dark:hover:bg-slate-700 rounded transition-colors" title="Italic">I</button>
                         <button type="button" onClick={() => {
                           const el = document.getElementById('content-textarea') as HTMLTextAreaElement;
                           if (el) { const start = el.selectionStart; const end = el.selectionEnd; const text = editingPage.content; setEditingPage({...editingPage, content: text.substring(0, start) + '<a href="URL">' + text.substring(start, end) + '</a>' + text.substring(end)}); }
                         }} className="px-2 py-1 text-xs underline hover:bg-white dark:hover:bg-slate-700 rounded transition-colors" title="Link">Link</button>
                         <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1"></div>
                         <button type="button" onClick={() => {
                           const el = document.getElementById('content-textarea') as HTMLTextAreaElement;
                           if (el) { const start = el.selectionStart; const end = el.selectionEnd; const text = editingPage.content; setEditingPage({...editingPage, content: text.substring(0, start) + '<h2>' + (text.substring(start, end) || 'Heading 2') + '</h2>' + text.substring(end)}); }
                         }} className="px-2 py-1 text-xs font-semibold hover:bg-white dark:hover:bg-slate-700 rounded transition-colors" title="Heading 2">H2</button>
                         <button type="button" onClick={() => {
                           const el = document.getElementById('content-textarea') as HTMLTextAreaElement;
                           if (el) { const start = el.selectionStart; const end = el.selectionEnd; const text = editingPage.content; setEditingPage({...editingPage, content: text.substring(0, start) + '<h3>' + (text.substring(start, end) || 'Heading 3') + '</h3>' + text.substring(end)}); }
                         }} className="px-2 py-1 text-xs font-semibold hover:bg-white dark:hover:bg-slate-700 rounded transition-colors" title="Heading 3">H3</button>
                         <button type="button" onClick={() => {
                           const el = document.getElementById('content-textarea') as HTMLTextAreaElement;
                           if (el) { const start = el.selectionStart; const end = el.selectionEnd; const text = editingPage.content; setEditingPage({...editingPage, content: text.substring(0, start) + '<blockquote>' + (text.substring(start, end) || 'Quote') + '</blockquote>' + text.substring(end)}); }
                         }} className="px-2 py-1 text-xs hover:bg-white dark:hover:bg-slate-700 rounded transition-colors" title="Blockquote">Quote</button>
                         <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1"></div>
                         <button type="button" onClick={() => {
                           const el = document.getElementById('content-textarea') as HTMLTextAreaElement;
                           if (el) { const start = el.selectionStart; const end = el.selectionEnd; const text = editingPage.content; setEditingPage({...editingPage, content: text.substring(0, start) + '<ul className="list-disc pl-5 space-y-1">\n  <li>' + (text.substring(start, end) || 'Item 1') + '</li>\n</ul>' + text.substring(end)}); }
                         }} className="px-2 py-1 text-xs hover:bg-white dark:hover:bg-slate-700 rounded transition-colors" title="Bulleted List">UL</button>
                         <button type="button" onClick={() => {
                           const el = document.getElementById('content-textarea') as HTMLTextAreaElement;
                           if (el) { const start = el.selectionStart; const end = el.selectionEnd; const text = editingPage.content; setEditingPage({...editingPage, content: text.substring(0, start) + '<ol className="list-decimal pl-5 space-y-1">\n  <li>' + (text.substring(start, end) || 'Item 1') + '</li>\n</ol>' + text.substring(end)}); }
                         }} className="px-2 py-1 text-xs hover:bg-white dark:hover:bg-slate-700 rounded transition-colors" title="Numbered List">OL</button>
                         <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1"></div>
                         <button type="button" onClick={() => {
                           const el = document.getElementById('content-textarea') as HTMLTextAreaElement;
                           if (el) { const start = el.selectionStart; const end = el.selectionEnd; const text = editingPage.content; setEditingPage({...editingPage, content: text.substring(0, start) + '<img src="IMAGE_URL" alt="Description" className="w-full rounded-xl my-4" />' + text.substring(end)}); }
                         }} className="px-2 py-1 text-xs hover:bg-white dark:hover:bg-slate-700 rounded transition-colors" title="Image">Img</button>
                         <button type="button" onClick={() => {
                           const el = document.getElementById('content-textarea') as HTMLTextAreaElement;
                           if (el) { const start = el.selectionStart; const end = el.selectionEnd; const text = editingPage.content; setEditingPage({...editingPage, content: text.substring(0, start) + '<div className="overflow-x-auto my-6">\n  <table className="w-full border-collapse text-sm text-left">\n    <thead><tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700"><th className="p-3 font-semibold">Header 1</th><th className="p-3 font-semibold">Header 2</th></tr></thead>\n    <tbody className="divide-y divide-slate-100 dark:divide-slate-800"><tr><td className="p-3 text-slate-600 dark:text-slate-400">Data 1</td><td className="p-3 text-slate-600 dark:text-slate-400">Data 2</td></tr></tbody>\n  </table>\n</div>' + text.substring(end)}); }
                         }} className="px-2 py-1 text-xs hover:bg-white dark:hover:bg-slate-700 rounded transition-colors" title="Table">Table</button>
                         <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1"></div>
                         <button type="button" onClick={() => {
                           const el = document.getElementById('content-textarea') as HTMLTextAreaElement;
                           if (el) { const start = el.selectionStart; const end = el.selectionEnd; const text = editingPage.content; setEditingPage({...editingPage, content: text.substring(0, start) + '<span className="text-teal-600 dark:text-teal-400">' + (text.substring(start, end) || 'Colored Text') + '</span>' + text.substring(end)}); }
                         }} className="px-2 py-1 text-xs text-teal-600 dark:text-teal-400 font-semibold hover:bg-white dark:hover:bg-slate-700 rounded transition-colors" title="Teal Text">Color</button>
                         <button type="button" onClick={() => {
                           const el = document.getElementById('content-textarea') as HTMLTextAreaElement;
                           if (el) { const start = el.selectionStart; const end = el.selectionEnd; const text = editingPage.content; setEditingPage({...editingPage, content: text.substring(0, start) + '<mark className="bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-200 px-1 rounded">' + (text.substring(start, end) || 'Highlighted Text') + '</mark>' + text.substring(end)}); }
                         }} className="px-2 py-1 text-xs bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-800/50 rounded transition-colors" title="Highlight">Mark</button>
                         <button type="button" onClick={() => {
                           const el = document.getElementById('content-textarea') as HTMLTextAreaElement;
                           if (el) { const start = el.selectionStart; const end = el.selectionEnd; const text = editingPage.content; setEditingPage({...editingPage, content: text.substring(0, start) + '<div className="p-4 rounded-xl bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 border border-blue-200 dark:border-blue-800/30 my-4">\n  <strong>Notice:</strong> ' + (text.substring(start, end) || 'Enter your alert message here.') + '\n</div>' + text.substring(end)}); }
                         }} className="px-2 py-1 text-xs hover:bg-white dark:hover:bg-slate-700 rounded transition-colors" title="Alert Box">Alert</button>
                         <button type="button" onClick={() => {
                           const el = document.getElementById('content-textarea') as HTMLTextAreaElement;
                           if (el) { const start = el.selectionStart; const end = el.selectionEnd; const text = editingPage.content; setEditingPage({...editingPage, content: text.substring(0, start) + '<a href="#" className="inline-block px-4 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors my-2">' + (text.substring(start, end) || 'Button Text') + '</a>' + text.substring(end)}); }
                         }} className="px-2 py-1 text-xs hover:bg-white dark:hover:bg-slate-700 rounded transition-colors" title="Button">Btn</button>
                         <button type="button" onClick={() => {
                           const el = document.getElementById('content-textarea') as HTMLTextAreaElement;
                           if (el) { const start = el.selectionStart; const end = el.selectionEnd; const text = editingPage.content; setEditingPage({...editingPage, content: text.substring(0, start) + '<hr className="my-8 border-slate-200 dark:border-slate-800" />' + text.substring(end)}); }
                         }} className="px-2 py-1 text-xs hover:bg-white dark:hover:bg-slate-700 rounded transition-colors" title="Divider">---</button>
                      </div>
                    </div>
                    <textarea
                      id="content-textarea"
                      required
                      value={editingPage.content}
                      onChange={e => setEditingPage({ ...editingPage, content: e.target.value })}
                      className="w-full flex-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-4 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono resize-none h-full"
                    />
                  </div>
                  {/* Preview Pane */}
                  <div className="flex flex-col h-auto min-h-[400px] border-t border-slate-100 dark:border-slate-800 pt-6 mt-4">
                    <label className="block text-sm font-medium mb-4 text-slate-700 dark:text-slate-300 flex justify-between items-center">
                      <span>Live Preview (Bottom)</span>
                      <span className="text-xs bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 px-2 py-0.5 rounded-full font-semibold">Real-time</span>
                    </label>
                    <div className="w-full flex-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-6 overflow-y-auto prose prose-slate dark:prose-invert max-w-none prose-sm shadow-inner">
                      {editingPage.content ? (
                         <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(editingPage.content) }} />
                      ) : (
                         <p className="text-slate-400 italic text-center mt-20">Preview will appear here...</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setEditingPage(null)}
                className="px-6 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex items-center gap-2 rounded-xl bg-teal-500 px-8 py-2.5 text-sm font-bold text-white hover:bg-teal-600 transition-colors disabled:opacity-50 shadow-sm"
              >
                <Save className="h-4 w-4" />
                {isPending ? 'Saving...' : 'Save Page'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex flex-1 w-full md:w-auto items-center overflow-x-auto no-scrollbar gap-1 p-1">
              <button 
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 text-sm font-medium rounded-xl whitespace-nowrap transition-colors ${activeTab === 'all' ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
              >
                All Pages
              </button>
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`px-4 py-2 text-sm font-medium rounded-xl whitespace-nowrap capitalize transition-colors ${activeTab === cat ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                >
                  {cat.replace(/-/g, ' ')}
                </button>
              ))}
            </div>
            
            <div className="relative w-full md:w-64 shrink-0 px-2 md:px-0 md:pr-2 pb-2 md:pb-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search pages..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 pl-10 pr-4 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pages.length === 0 ? (
              <div className="col-span-full rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 p-16 text-center bg-slate-50/50 dark:bg-slate-900/20">
                <LayoutTemplate className="mx-auto h-12 w-12 text-slate-400 opacity-50 mb-4" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">No pages found</h3>
                <p className="text-sm text-slate-500 mb-6 mt-2 max-w-sm mx-auto">You haven't created any dynamic pages yet. Start building custom content to expand your website.</p>
                <button
                  onClick={() => setEditingPage({ slug: '', title: '', content: '', status: 'draft', showInFooter: false })}
                  className="inline-flex items-center gap-2 rounded-xl bg-teal-500 px-6 py-2.5 text-sm font-bold text-white hover:bg-teal-600 transition-colors shadow-sm"
                >
                  <Plus className="h-4 w-4" />
                  Create First Page
                </button>
              </div>
            ) : displayedPages.length === 0 ? (
               <div className="col-span-full py-12 text-center text-slate-500">
                 No pages match your search in this category.
               </div>
            ) : (
              displayedPages.map(page => (
                <div key={page.slug} className="group flex flex-col rounded-2xl bg-white dark:bg-slate-900 shadow-sm hover:shadow-md border border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-200">
                  <div className="p-5 flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <div className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg ${page.status === 'published' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                        {page.status === 'published' ? <span className="flex items-center gap-1"><Globe className="w-3 h-3"/> Live</span> : <span className="flex items-center gap-1"><Lock className="w-3 h-3"/> Draft</span>}
                      </div>
                      {page.showInFooter && (
                        <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                          Footer Link
                        </div>
                      )}
                    </div>
                    
                    <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 mb-1 line-clamp-1" title={page.title}>{page.title}</h3>
                    <p className="text-xs text-slate-500 font-mono truncate" title={`/${page.slug}`}>/{page.slug}</p>
                  </div>
                  
                  <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleStatus(page)}
                        disabled={isPending}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${page.status === 'published' ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                        title={page.status === 'published' ? "Hide page (Draft)" : "Show page (Publish)"}
                      >
                        <span className="sr-only">Toggle visibility</span>
                        <span aria-hidden="true" className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${page.status === 'published' ? 'translate-x-2' : '-translate-x-2'}`} />
                      </button>
                      {page.status === 'published' && (
                        <a href={`/${page.slug}`} target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-500/10 rounded-xl transition-colors" title="View Live">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingPage(page)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-teal-600 hover:bg-teal-50 dark:text-slate-400 dark:hover:text-teal-400 dark:hover:bg-teal-500/10 rounded-xl transition-colors"
                      >
                        <Edit2 className="h-3.5 w-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(page.slug)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:text-rose-400 dark:hover:bg-rose-500/10 rounded-xl transition-colors"
                        title="Delete Page"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
