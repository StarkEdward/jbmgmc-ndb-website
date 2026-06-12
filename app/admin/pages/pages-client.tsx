'use client'

import React, { useState } from 'react'
import { DynamicPage } from '@/lib/db'
import { updateDynamicPageAction, deleteDynamicPageAction } from '../actions'
import { toast } from 'sonner'
import { Plus, Edit2, Trash2, Save, X, FileText } from 'lucide-react'

export default function PagesClient({ initialPages }: { initialPages: DynamicPage[] }) {
  const [pages, setPages] = useState<DynamicPage[]>(initialPages)
  const [editingPage, setEditingPage] = useState<DynamicPage | null>(null)
  const [isPending, setIsPending] = useState(false)

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
        toast.error('Failed to save page')
      }
    } catch (e) {
      toast.error('Error saving page')
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
        toast.error('Failed to delete')
      }
    } catch (e) {
      toast.error('Error deleting page')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileText className="h-6 w-6 text-teal-500" />
            Dynamic Pages Manager
          </h1>
          <p className="text-sm text-slate-500 mt-1">Create and manage custom pages (e.g., /administration/rts)</p>
        </div>
        <button
          onClick={() => setEditingPage({ slug: '', title: '', content: '' })}
          className="flex items-center gap-2 rounded-xl bg-teal-500 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-600 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Create New Page
        </button>
      </div>

      {editingPage ? (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold">
              {pages.find(p => p.slug === editingPage.slug) ? 'Edit Page' : 'New Page'}
            </h2>
            <button onClick={() => setEditingPage(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">URL Slug (e.g., administration/rts)</label>
                <input
                  type="text"
                  required
                  value={editingPage.slug}
                  onChange={e => setEditingPage({ ...editingPage, slug: e.target.value })}
                  disabled={!!pages.find(p => p.slug === editingPage.slug)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent px-4 py-2 text-sm disabled:opacity-50 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
                {pages.find(p => p.slug === editingPage.slug) && (
                  <p className="text-xs text-amber-500 mt-1">Slug cannot be changed once created.</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Page Title</label>
                <input
                  type="text"
                  required
                  value={editingPage.title}
                  onChange={e => setEditingPage({ ...editingPage, title: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent px-4 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Page Content (Markdown / HTML Supported)</label>
              <textarea
                required
                value={editingPage.content}
                onChange={e => setEditingPage({ ...editingPage, content: e.target.value })}
                rows={15}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent px-4 py-3 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setEditingPage(null)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex items-center gap-2 rounded-xl bg-teal-500 px-6 py-2 text-sm font-semibold text-white hover:bg-teal-600 transition-colors disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {isPending ? 'Saving...' : 'Save Page'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid gap-4">
          {pages.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-slate-400 opacity-50 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">No pages yet</h3>
              <p className="text-sm text-slate-500 mb-6">Create a custom page to fill in the missing sections of the website.</p>
              <button
                onClick={() => setEditingPage({ slug: '', title: '', content: '' })}
                className="inline-flex items-center gap-2 rounded-xl bg-teal-500 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-600 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Create First Page
              </button>
            </div>
          ) : (
            pages.map(page => (
              <div key={page.slug} className="flex items-center justify-between rounded-xl bg-white dark:bg-slate-900 p-4 shadow-sm border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">{page.title}</h3>
                    <p className="text-xs text-slate-500 font-mono">/{page.slug}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingPage(page)}
                    className="p-2 text-slate-400 hover:text-teal-500 hover:bg-teal-50 dark:hover:bg-teal-500/10 rounded-lg transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(page.slug)}
                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
