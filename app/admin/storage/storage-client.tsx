'use client'

import React, { useState, useEffect } from 'react'
import { Trash2, HardDrive, AlertTriangle, FileImage, FileText, File, RefreshCw, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

interface StorageFile {
  name: string
  url: string
  sizeBytes: number
  createdAt: string
  category: string
  status: 'in-use' | 'orphaned'
}

export default function StorageManagement() {
  const [files, setFiles] = useState<StorageFile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set())

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'in-use' | 'orphaned'>('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  
  const [sortField, setSortField] = useState<'name' | 'category' | 'sizeBytes' | 'createdAt' | 'status'>('createdAt')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 25

  const fetchFiles = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/storage')
      const data = await res.json()
      if (data.files) {
        setFiles(data.files)
      } else {
        toast.error(data.error || 'Failed to fetch storage files')
      }
    } catch (err) {
      toast.error('Network error fetching storage files')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchFiles()
  }, [])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, statusFilter, categoryFilter, sortField, sortDirection])

  const handleSelect = (name: string) => {
    const newSet = new Set(selectedFiles)
    if (newSet.has(name)) {
      newSet.delete(name)
    } else {
      newSet.add(name)
    }
    setSelectedFiles(newSet)
  }

  const handleSelectAllOrphaned = () => {
    const orphanedFiles = files.filter(f => f.status === 'orphaned').map(f => f.name)
    setSelectedFiles(new Set(orphanedFiles))
  }

  const handleDelete = async (filesToDelete: string[]) => {
    if (!confirm(`Are you sure you want to permanently delete ${filesToDelete.length} file(s)? This action cannot be undone.`)) {
      return
    }

    setIsDeleting(true)
    try {
      const res = await fetch('/api/storage', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ files: filesToDelete })
      })
      const data = await res.json()
      if (data.success) {
        toast.success(`Successfully deleted ${data.deletedCount} file(s)`)
        setSelectedFiles(new Set())
        await fetchFiles()
      } else {
        toast.error(data.error || 'Failed to delete files')
      }
    } catch (err) {
      toast.error('Network error during deletion')
    } finally {
      setIsDeleting(false)
    }
  }

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  }

  const getFileIcon = (category: string) => {
    if (category === 'Image') return <FileImage className="w-4 h-4 text-sky-500" />
    if (category === 'PDF') return <FileText className="w-4 h-4 text-rose-500" />
    return <File className="w-4 h-4 text-slate-500" />
  }

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const totalSize = files.reduce((acc, f) => acc + f.sizeBytes, 0)
  const orphanedAll = files.filter(f => f.status === 'orphaned')
  const orphanedSize = orphanedAll.reduce((acc, f) => acc + f.sizeBytes, 0)

  // Derived state: Filter
  const filteredFiles = files.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || f.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || f.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  // Derived state: Sort
  const sortedFiles = [...filteredFiles].sort((a, b) => {
    let comparison = 0
    if (sortField === 'name') comparison = a.name.localeCompare(b.name)
    else if (sortField === 'category') comparison = a.category.localeCompare(b.category)
    else if (sortField === 'status') comparison = a.status.localeCompare(b.status)
    else if (sortField === 'sizeBytes') comparison = a.sizeBytes - b.sizeBytes
    else if (sortField === 'createdAt') comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    
    return sortDirection === 'asc' ? comparison : -comparison
  })

  // Derived state: Pagination
  const totalPages = Math.ceil(sortedFiles.length / itemsPerPage)
  const paginatedFiles = sortedFiles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 p-6 shadow-2xl backdrop-blur-md space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <HardDrive className="h-5 w-5 text-teal-600 dark:text-teal-400" />
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-200">Storage & Junk File Management</h2>
        </div>
        <button 
          onClick={fetchFiles}
          disabled={isLoading || isDeleting}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          Rescan Storage
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-center">
          <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Total Files</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">{files.length}</span>
            <span className="text-xs text-slate-500">({formatSize(totalSize)})</span>
          </div>
        </div>
        
        <div className="bg-emerald-50 dark:bg-emerald-500/10 rounded-xl p-4 border border-emerald-200 dark:border-emerald-500/20 shadow-sm flex flex-col justify-center">
          <p className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 mb-1">In Use</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{files.length - orphanedAll.length}</span>
          </div>
        </div>

        <div className={`rounded-xl p-4 border shadow-sm flex flex-col justify-center ${
          orphanedAll.length > 0 
            ? 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20' 
            : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
        }`}>
          <div className="flex justify-between items-start">
            <p className={`text-[10px] uppercase font-bold mb-1 ${orphanedAll.length > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500'}`}>
              Orphaned / Junk
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

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input 
          type="text" 
          placeholder="Search files..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <select 
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
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
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="all">All Statuses</option>
          <option value="in-use">In Use</option>
          <option value="orphaned">Orphaned</option>
        </select>
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <button
            onClick={handleSelectAllOrphaned}
            disabled={orphanedAll.length === 0}
            className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline disabled:opacity-50 disabled:no-underline"
          >
            Select All Orphaned
          </button>
          <span className="text-xs text-slate-400">|</span>
          <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
            {selectedFiles.size} selected
          </span>
        </div>
        <button
          onClick={() => handleDelete(Array.from(selectedFiles))}
          disabled={selectedFiles.size === 0 || isDeleting}
          className="flex items-center gap-2 px-4 py-2 bg-rose-500 hover:bg-rose-600 disabled:bg-slate-300 disabled:dark:bg-slate-700 text-white text-xs font-bold rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          {isDeleting ? 'Deleting...' : `Delete Selected (${selectedFiles.size})`}
        </button>
      </div>

      {/* Files Table */}
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
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
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <RefreshCw className="w-6 h-6 animate-spin mb-2 text-teal-500" />
                      <span className="text-xs font-medium">Scanning storage...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedFiles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500 text-xs">
                    No files found matching criteria.
                  </td>
                </tr>
              ) : (
                paginatedFiles.map((file) => {
                  const isSelected = selectedFiles.has(file.name)
                  return (
                    <tr 
                      key={file.name} 
                      onClick={() => handleSelect(file.name)}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-900/50 cursor-pointer transition-colors ${isSelected ? 'bg-teal-50/50 dark:bg-teal-900/10' : ''}`}
                    >
                      <td className="px-4 py-3 text-center">
                        <input 
                          type="checkbox" 
                          checked={isSelected}
                          onChange={() => {}} // Handled by tr onClick
                          className="w-4 h-4 rounded text-teal-500 focus:ring-teal-500 bg-white border-slate-300 dark:border-slate-600 dark:bg-slate-800"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {file.category === 'Image' ? (
                            <img src={file.url} alt="Preview" className="w-8 h-8 rounded object-cover border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800" />
                          ) : (
                            <div className="w-8 h-8 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                              {getFileIcon(file.category)}
                            </div>
                          )}
                          <a 
                            href={file.url} 
                            target="_blank" 
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()} 
                            className="text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-teal-600 hover:underline truncate max-w-[200px] sm:max-w-[300px]"
                            title={file.name}
                          >
                            {file.name}
                          </a>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-400">
                        {file.category}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        {formatSize(file.sizeBytes)}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        {formatDate(file.createdAt)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {file.status === 'in-use' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold rounded-full">
                            <CheckCircle2 className="w-3 h-3" /> In Use
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 text-[10px] font-bold rounded-full">
                            <AlertTriangle className="w-3 h-3" /> Orphaned
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
            <span className="text-xs text-slate-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sortedFiles.length)} of {sortedFiles.length} files
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50"
              >
                Previous
              </button>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
