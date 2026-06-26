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

  const totalSize = files.reduce((acc, f) => acc + f.sizeBytes, 0)
  const orphanedFiles = files.filter(f => f.status === 'orphaned')
  const orphanedSize = orphanedFiles.reduce((acc, f) => acc + f.sizeBytes, 0)

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
            <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{files.length - orphanedFiles.length}</span>
          </div>
        </div>

        <div className={`rounded-xl p-4 border shadow-sm flex flex-col justify-center ${
          orphanedFiles.length > 0 
            ? 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20' 
            : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
        }`}>
          <div className="flex justify-between items-start">
            <p className={`text-[10px] uppercase font-bold mb-1 ${orphanedFiles.length > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500'}`}>
              Orphaned / Junk
            </p>
            {orphanedFiles.length > 0 && <AlertTriangle className="w-4 h-4 text-rose-500" />}
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold ${orphanedFiles.length > 0 ? 'text-rose-700 dark:text-rose-300' : 'text-slate-700 dark:text-slate-300'}`}>
              {orphanedFiles.length}
            </span>
            <span className="text-xs text-slate-500">({formatSize(orphanedSize)})</span>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <button
            onClick={handleSelectAllOrphaned}
            disabled={orphanedFiles.length === 0}
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
        <div className="overflow-x-auto max-h-[500px]">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-900 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="px-4 py-3 text-[10px] uppercase font-bold text-slate-500 w-10 text-center">
                  {/* Select All Checkbox could go here, but omitted for simplicity */}
                </th>
                <th className="px-4 py-3 text-[10px] uppercase font-bold text-slate-500">File Name</th>
                <th className="px-4 py-3 text-[10px] uppercase font-bold text-slate-500">Category</th>
                <th className="px-4 py-3 text-[10px] uppercase font-bold text-slate-500">Size</th>
                <th className="px-4 py-3 text-[10px] uppercase font-bold text-slate-500">Uploaded At</th>
                <th className="px-4 py-3 text-[10px] uppercase font-bold text-slate-500 text-right">Status</th>
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
              ) : files.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500 text-xs">
                    No files found in storage.
                  </td>
                </tr>
              ) : (
                files.map((file) => {
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
      </div>
    </div>
  )
}
