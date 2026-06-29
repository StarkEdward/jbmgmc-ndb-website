'use client'

import React, { useState, useEffect } from 'react'
import {
  Trash2, HardDrive, AlertTriangle, FileImage, FileText, File,
  RefreshCw, CheckCircle2, LockOpen, Lock, Info, X, ShieldAlert
} from 'lucide-react'
import { toast } from 'sonner'

interface StorageFile {
  name: string
  url: string
  sizeBytes: number
  createdAt: string
  category: string
  /** in-use: referenced in DB; orphaned: not used anywhere; force-unlocked: in DB but admin overrode */
  status: 'in-use' | 'orphaned' | 'force-unlocked'
  /** Human-readable labels for where this file is used (e.g. ["Departments", "Gallery"]) */
  usedIn: string[]
}

type ModalState =
  | { type: 'none' }
  | { type: 'delete'; files: string[] }
  | { type: 'unlock'; files: string[] }
  | { type: 'relock'; files: string[] }

export default function StorageManagement() {
  const [files, setFiles] = useState<StorageFile[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isActing, setIsActing] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set())

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'in-use' | 'orphaned' | 'force-unlocked'>('all')
  const [categoryFilter, setCategoryFilter] = useState('all')

  const [sortField, setSortField] = useState<'name' | 'category' | 'sizeBytes' | 'createdAt' | 'status'>('status')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 15

  const [modal, setModal] = useState<ModalState>({ type: 'none' })
  const [mounted, setMounted] = useState(false)

  /** Fetches file list from API */
  const fetchFiles = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/storage')
      if (res.status === 401) {
        toast.error('Session expired. Please log in again.')
        return
      }
      const data = await res.json()
      if (data.files) {
        setFiles(data.files)
        setSelectedFiles(new Set())
      } else {
        toast.error(data.error || 'Failed to fetch storage files')
      }
    } catch {
      toast.error('Network error fetching storage files')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setMounted(true)
    fetchFiles()
  }, [])



  // Reset to page 1 whenever filters change
  useEffect(() => { setCurrentPage(1) }, [searchQuery, statusFilter, categoryFilter, sortField, sortDirection])

  const handleSelect = (name: string) => {
    const file = files.find(f => f.name === name)
    // Only orphaned and force-unlocked files can be selected for deletion
    if (file?.status === 'in-use') return
    const newSet = new Set(selectedFiles)
    if (newSet.has(name)) newSet.delete(name)
    else newSet.add(name)
    setSelectedFiles(newSet)
  }

  const handleSelectAllOrphaned = () => {
    const deletable = files
      .filter(f => f.status === 'orphaned' || f.status === 'force-unlocked')
      .map(f => f.name)
    setSelectedFiles(new Set(deletable))
  }

  /** Executes the delete action after confirmation */
  const executeDelete = async (filesToDelete: string[]) => {
    setModal({ type: 'none' })
    if (filesToDelete.length === 0) return
    setIsActing(true)
    try {
      const res = await fetch('/api/storage', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ files: filesToDelete })
      })
      const data = await res.json()
      if (data.success) {
        toast.success(`Deleted ${data.deletedCount} file(s) successfully.`)
        if (data.skipped?.length > 0) {
          toast.warning(`${data.skipped.length} protected file(s) were skipped.`)
        }
        await fetchFiles()
      } else {
        toast.error(data.error || 'Failed to delete files')
      }
    } catch {
      toast.error('Network error during deletion')
    } finally {
      setIsActing(false)
    }
  }

  /** Calls PATCH to unlock or re-lock files */
  const executeOverride = async (filesToAct: string[], action: 'unlock' | 'relock') => {
    setModal({ type: 'none' })
    if (filesToAct.length === 0) return
    setIsActing(true)
    try {
      const res = await fetch('/api/storage', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ files: filesToAct, action })
      })
      const data = await res.json()
      if (data.success) {
        toast.success(
          action === 'unlock'
            ? `${data.count} file(s) force-unlocked. You can now delete them.`
            : `${data.count} file(s) re-locked and protected again.`
        )
        await fetchFiles()
      } else {
        toast.error(data.error || 'Failed to update file status')
      }
    } catch {
      toast.error('Network error updating file status')
    } finally {
      setIsActing(false)
    }
  }

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })

  const getFileIcon = (category: string) => {
    if (category === 'Image') return <FileImage className="w-4 h-4 text-sky-500" />
    if (category === 'PDF') return <FileText className="w-4 h-4 text-rose-500" />
    return <File className="w-4 h-4 text-slate-500" />
  }

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) setSortDirection(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDirection('asc') }
  }

  // ── Derived stats ──────────────────────────────────────────────────────────
  const totalSize = files.reduce((a, f) => a + f.sizeBytes, 0)
  const orphanedAll = files.filter(f => f.status === 'orphaned')
  const forceUnlockedAll = files.filter(f => f.status === 'force-unlocked')
  const orphanedSize = [...orphanedAll, ...forceUnlockedAll].reduce((a, f) => a + f.sizeBytes, 0)

  // ── Filter ─────────────────────────────────────────────────────────────────
  const filteredFiles = files.filter(f => {
    const matchSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchStatus = statusFilter === 'all' || f.status === statusFilter
    const matchCat = categoryFilter === 'all' || f.category === categoryFilter
    return matchSearch && matchStatus && matchCat
  })

  // ── Sort ───────────────────────────────────────────────────────────────────
  const statusOrder = { orphaned: 0, 'force-unlocked': 1, 'in-use': 2 }
  const sortedFiles = [...filteredFiles].sort((a, b) => {
    let cmp = 0
    if (sortField === 'name') cmp = a.name.localeCompare(b.name)
    else if (sortField === 'category') cmp = a.category.localeCompare(b.category)
    else if (sortField === 'status') cmp = statusOrder[a.status] - statusOrder[b.status]
    else if (sortField === 'sizeBytes') cmp = a.sizeBytes - b.sizeBytes
    else if (sortField === 'createdAt') cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    if (cmp === 0) cmp = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    return sortDirection === 'asc' ? cmp : -cmp
  })

  // ── Paginate ───────────────────────────────────────────────────────────────
  const totalPages = Math.ceil(sortedFiles.length / itemsPerPage)
  const paginatedFiles = sortedFiles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // ── Helpers for Status Badge ───────────────────────────────────────────────
  const StatusBadge = ({ file }: { file: StorageFile }) => {
    if (file.status === 'in-use') {
      return (
        <div className="flex flex-col items-end gap-1">
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold rounded-full whitespace-nowrap">
            <CheckCircle2 className="w-3 h-3" /> In Use
          </span>
          {file.usedIn.length > 0 && (
            <span className="text-[9px] text-slate-400 dark:text-slate-500 text-right leading-tight max-w-[120px]">
              {file.usedIn.join(', ')}
            </span>
          )}
        </div>
      )
    }
    if (file.status === 'force-unlocked') {
      return (
        <div className="flex flex-col items-end gap-1">
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-bold rounded-full whitespace-nowrap">
            <LockOpen className="w-3 h-3" /> Unlocked
          </span>
          {file.usedIn.length > 0 && (
            <span className="text-[9px] text-amber-500 dark:text-amber-600 text-right leading-tight max-w-[120px]">
              Still in: {file.usedIn.join(', ')}
            </span>
          )}
        </div>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 text-[10px] font-bold rounded-full whitespace-nowrap">
        <AlertTriangle className="w-3 h-3" /> Orphaned
      </span>
    )
  }

  if (!mounted) return null

  return (
    <>
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 p-6 shadow-2xl backdrop-blur-md space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <HardDrive className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-200">Storage & Junk File Management</h2>
          </div>
          <button
            onClick={fetchFiles}
            disabled={isLoading || isActing}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Rescan Storage
          </button>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
            <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Total Files</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">{files.length}</span>
              <span className="text-xs text-slate-500">({formatSize(totalSize)})</span>
            </div>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-500/10 rounded-xl p-4 border border-emerald-200 dark:border-emerald-500/20 shadow-sm">
            <p className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 mb-1">In Use</p>
            <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
              {files.filter(f => f.status === 'in-use').length}
            </span>
          </div>

          <div className="bg-amber-50 dark:bg-amber-500/10 rounded-xl p-4 border border-amber-200 dark:border-amber-500/20 shadow-sm">
            <p className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 mb-1">Force-Unlocked</p>
            <span className="text-2xl font-bold text-amber-700 dark:text-amber-300">
              {forceUnlockedAll.length}
            </span>
          </div>

          <div className={`rounded-xl p-4 border shadow-sm ${
            orphanedAll.length > 0
              ? 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20'
              : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
          }`}>
            <div className="flex justify-between items-start">
              <p className={`text-[10px] uppercase font-bold mb-1 ${orphanedAll.length > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500'}`}>
                Orphaned
              </p>
              {orphanedAll.length > 0 && <AlertTriangle className="w-4 h-4 text-rose-500" />}
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-bold ${orphanedAll.length > 0 ? 'text-rose-700 dark:text-rose-300' : 'text-slate-700 dark:text-slate-300'}`}>
                {orphanedAll.length}
              </span>
              <span className="text-xs text-slate-500">({formatSize(orphanedSize)})</span>
            </div>
          </div>
        </div>

        {/* Info banner about unlock feature */}
        <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-xs text-blue-700 dark:text-blue-300">
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p>
            <strong>In-Use files</strong> are protected from deletion — they are actively referenced in site content.
            Use <strong>Force Unlock</strong> to override this protection if you&apos;ve already removed the reference from the page.
            Re-lock to restore protection.
          </p>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="flex-1 px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Categories</option>
            <option value="Image">Images</option>
            <option value="PDF">PDFs</option>
            <option value="Document">Documents</option>
            <option value="Other">Others</option>
          </select>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Statuses</option>
            <option value="in-use">In Use</option>
            <option value="force-unlocked">Force-Unlocked</option>
            <option value="orphaned">Orphaned</option>
          </select>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <button
              onClick={handleSelectAllOrphaned}
              disabled={orphanedAll.length === 0 && forceUnlockedAll.length === 0}
              className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline disabled:opacity-50 disabled:no-underline"
            >
              Select All Deletable
            </button>
            <span className="text-xs text-slate-400">|</span>
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
              {selectedFiles.size} selected
            </span>
          </div>
          <button
            onClick={() => setModal({ type: 'delete', files: Array.from(selectedFiles) })}
            disabled={selectedFiles.size === 0 || isActing}
            className="flex items-center gap-2 px-4 py-2 bg-rose-500 hover:bg-rose-600 disabled:bg-slate-300 disabled:dark:bg-slate-700 text-white text-xs font-bold rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            {isActing ? 'Working...' : `Delete Selected (${selectedFiles.size})`}
          </button>
        </div>

        {/* Files Table */}
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead className="bg-slate-50 dark:bg-slate-900 sticky top-0 z-10 shadow-sm border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3 text-[10px] uppercase font-bold text-slate-500 w-10 text-center"></th>
                  <th className="px-4 py-3 text-[10px] uppercase font-bold text-slate-500 cursor-pointer hover:text-slate-700 dark:hover:text-slate-300 select-none" onClick={() => handleSort('name')}>
                    File Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-4 py-3 text-[10px] uppercase font-bold text-slate-500 cursor-pointer hover:text-slate-700 dark:hover:text-slate-300 select-none" onClick={() => handleSort('category')}>
                    Category {sortField === 'category' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-4 py-3 text-[10px] uppercase font-bold text-slate-500 cursor-pointer hover:text-slate-700 dark:hover:text-slate-300 select-none" onClick={() => handleSort('sizeBytes')}>
                    Size {sortField === 'sizeBytes' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-4 py-3 text-[10px] uppercase font-bold text-slate-500 cursor-pointer hover:text-slate-700 dark:hover:text-slate-300 select-none" onClick={() => handleSort('createdAt')}>
                    Uploaded At {sortField === 'createdAt' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-4 py-3 text-[10px] uppercase font-bold text-slate-500 cursor-pointer hover:text-slate-700 dark:hover:text-slate-300 select-none text-right" onClick={() => handleSort('status')}>
                    Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-4 py-3 text-[10px] uppercase font-bold text-slate-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center">
                        <RefreshCw className="w-6 h-6 animate-spin mb-2 text-teal-500" />
                        <span className="text-xs font-medium">Scanning storage...</span>
                      </div>
                    </td>
                  </tr>
                ) : paginatedFiles.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-slate-500 text-xs">
                      No files found matching criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedFiles.map(file => {
                    const isSelected = selectedFiles.has(file.name)
                    const canSelect = file.status !== 'in-use'
                    return (
                      <tr
                        key={file.name}
                        onClick={() => canSelect && handleSelect(file.name)}
                        className={`transition-colors ${
                          file.status === 'in-use'
                            ? 'cursor-default'
                            : `cursor-pointer ${isSelected ? 'bg-teal-50/50 dark:bg-teal-900/10' : 'hover:bg-slate-50 dark:hover:bg-slate-900/50'}`
                        }`}
                      >
                        {/* Checkbox / Lock icon */}
                        <td className="px-4 py-3 text-center">
                          {file.status === 'in-use' ? (
                            <div title="Protected — file is referenced in site content" className="flex justify-center">
                              <Lock className="w-4 h-4 text-slate-400" />
                            </div>
                          ) : (
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleSelect(file.name)}
                              onClick={e => e.stopPropagation()}
                              className="w-4 h-4 rounded text-teal-500 focus:ring-teal-500 bg-white border-slate-300 dark:border-slate-600 dark:bg-slate-800"
                            />
                          )}
                        </td>

                        {/* File name with thumbnail */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {file.category === 'Image' ? (
                              <img
                                src={file.url}
                                alt="Preview"
                                className="w-8 h-8 rounded object-cover border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex-shrink-0"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                                {getFileIcon(file.category)}
                              </div>
                            )}
                            <a
                              href={file.url}
                              target="_blank"
                              rel="noreferrer"
                              onClick={e => e.stopPropagation()}
                              className="text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-teal-600 hover:underline truncate max-w-[180px] sm:max-w-[260px]"
                              title={file.name}
                            >
                              {file.name}
                            </a>
                          </div>
                        </td>

                        <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-400">{file.category}</td>
                        <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">{formatSize(file.sizeBytes)}</td>
                        <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">{formatDate(file.createdAt)}</td>

                        {/* Status badge with context */}
                        <td className="px-4 py-3 text-right">
                          <StatusBadge file={file} />
                        </td>

                        {/* Action buttons */}
                        <td className="px-4 py-3 text-right" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-2">
                            {file.status === 'in-use' && (
                              <button
                                onClick={() => setModal({ type: 'unlock', files: [file.name] })}
                                title="Force-unlock this file so it can be deleted"
                                className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-semibold rounded-md bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/60 transition-colors"
                              >
                                <LockOpen className="w-3 h-3" /> Unlock
                              </button>
                            )}
                            {file.status === 'force-unlocked' && (
                              <>
                                <button
                                  onClick={() => setModal({ type: 'relock', files: [file.name] })}
                                  title="Re-lock this file to protect it from deletion"
                                  className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-semibold rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                >
                                  <Lock className="w-3 h-3" /> Re-lock
                                </button>
                                <button
                                  onClick={() => setModal({ type: 'delete', files: [file.name] })}
                                  title="Delete this file"
                                  className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-semibold rounded-md bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 hover:bg-rose-200 dark:hover:bg-rose-900/60 transition-colors"
                                >
                                  <Trash2 className="w-3 h-3" /> Delete
                                </button>
                              </>
                            )}
                            {file.status === 'orphaned' && (
                              <button
                                onClick={() => setModal({ type: 'delete', files: [file.name] })}
                                title="Delete this orphaned file"
                                className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-semibold rounded-md bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 hover:bg-rose-200 dark:hover:bg-rose-900/60 transition-colors"
                              >
                                <Trash2 className="w-3 h-3" /> Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <span className="text-xs text-slate-500">
                Showing {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, sortedFiles.length)} of {sortedFiles.length} files
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50"
                >Previous</button>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50"
                >Next</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Modals ─────────────────────────────────────────────────────── */}

      {/* Delete Confirmation Modal */}
      {modal.type === 'delete' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-rose-100 dark:bg-rose-900/30 rounded-full">
                <AlertTriangle className="w-6 h-6 text-rose-600 dark:text-rose-400" />
              </div>
              <h3 className="text-lg font-bold text-center text-slate-900 dark:text-slate-100 mb-2">Confirm Deletion</h3>
              <p className="text-sm text-center text-slate-500 dark:text-slate-400 mb-6">
                Permanently delete <strong className="text-slate-700 dark:text-slate-200">{modal.files.length}</strong> file(s)?
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setModal({ type: 'none' })}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
                >Cancel</button>
                <button
                  onClick={() => executeDelete(modal.files)}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600 rounded-xl shadow-md transition-colors"
                >Yes, Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Force-Unlock Warning Modal */}
      {modal.type === 'unlock' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-amber-300 dark:border-amber-700">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                <ShieldAlert className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-lg font-bold text-center text-slate-900 dark:text-slate-100 mb-2">Force-Unlock File?</h3>
              <p className="text-sm text-center text-slate-500 dark:text-slate-400 mb-2">
                This file is currently referenced somewhere in your site content.
              </p>
              <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-xs text-amber-700 dark:text-amber-300 mb-6">
                ⚠️ <strong>Warning:</strong> Deleting this file while it&apos;s still referenced will cause
                broken images or links on your public site pages. Make sure you&apos;ve already removed or
                replaced this file&apos;s reference before deleting.
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setModal({ type: 'none' })}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
                >Cancel</button>
                <button
                  onClick={() => executeOverride(modal.files, 'unlock')}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-amber-500 hover:bg-amber-600 rounded-xl shadow-md transition-colors"
                >I Understand, Unlock</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Re-lock Confirmation Modal */}
      {modal.type === 'relock' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-slate-100 dark:bg-slate-800 rounded-full">
                <Lock className="w-6 h-6 text-slate-600 dark:text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-center text-slate-900 dark:text-slate-100 mb-2">Re-lock File?</h3>
              <p className="text-sm text-center text-slate-500 dark:text-slate-400 mb-6">
                This will restore the deletion protection for this file. It will show as <strong>In Use</strong> again.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setModal({ type: 'none' })}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
                >Cancel</button>
                <button
                  onClick={() => executeOverride(modal.files, 'relock')}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-slate-600 hover:bg-slate-700 rounded-xl shadow-md transition-colors"
                >Yes, Re-lock</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
