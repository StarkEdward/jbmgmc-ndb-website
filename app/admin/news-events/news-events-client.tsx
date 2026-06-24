'use client'

import React, { useState } from 'react'
import { 
  Megaphone, 
  Trash2, 
  Plus, 
  Search, 
  Clock, 
  Heading, 
  AlignLeft, 
  FileText,
  Loader2,
  Eye,
  EyeOff,
  Upload,
  X
} from 'lucide-react'
import { 
  addNewsEventAction, 
  deleteNewsEventAction, 
  addTenderAction,
  deleteTenderAction,
  toggleTenderVisibilityAction
} from './actions'
import { toast } from 'sonner'
import { NewsEventItem, TenderItem } from '@/lib/db'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface NewsEventsClientProps {
  initialNewsEvents: NewsEventItem[]
  initialTenders: TenderItem[]
}

export default function NewsEventsClient({ initialNewsEvents, initialTenders }: NewsEventsClientProps) {
  const [activeTab, setActiveTab] = useState<'news-events' | 'tenders'>('news-events')
  
  // Lists states
  const [newsEvents, setNewsEvents] = useState<NewsEventItem[]>(initialNewsEvents || [])
  const [tenders, setTenders] = useState<TenderItem[]>(initialTenders || [])
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('')

  // Loading state
  const [isPending, setIsPending] = useState(false)
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false)
  const [isTenderModalOpen, setIsTenderModalOpen] = useState(false)

  // Add NewsEvent Form State
  const [title, setTitle] = useState('')
  const [type, setType] = useState<'news'|'event'>('news')
  const [date, setDate] = useState(() => {
    const today = new Date()
    return `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`
  })
  const [desc, setDesc] = useState('')
  const [fullArticle, setFullArticle] = useState('')
  
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  // Announcement Fields
  const [showInBanner, setShowInBanner] = useState(false)
  const [isUrgent, setIsUrgent] = useState(false)
  const [showInPopup, setShowInPopup] = useState(false)
  const [popupType, setPopupType] = useState<'important'|'general'|'admission'|'exam'>('general')

  const handleAddNewsEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !desc.trim() || !date.trim()) {
      toast.error('Please fill out all required fields')
      return
    }

    setIsPending(true)
    setIsUploading(true)

    try {
      let uploadedUrl = undefined
      if (pdfFile) {
        const formData = new FormData()
        formData.append('file', pdfFile)

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!uploadRes.ok) {
          const errorData = await uploadRes.json()
          throw new Error(errorData.error || 'Failed to upload PDF')
        }

        const uploadData = await uploadRes.json()
        uploadedUrl = uploadData.url
      }

      const newItem: Omit<NewsEventItem, 'id'> = {
        title: title,
        date: date,
        description: desc,
        type: type,
        fullArticle: fullArticle || undefined,
        pdfUrl: uploadedUrl,
        isNew: true,
        showInBanner: showInBanner,
        isUrgent: isUrgent,
        showInPopup: showInPopup,
        popupType: popupType
      }

      const res = await addNewsEventAction(newItem)
      if (res.success) {
        toast.success('Item published successfully')
        setIsNewsModalOpen(false)
        window.location.reload()
      } else {
        toast.error('Failed to publish item')
      }
    } catch (e: any) {
      toast.error(e?.message || 'An error occurred')
    } finally {
      setIsPending(false)
      setIsUploading(false)
    }
  }

  const handleDeleteNewsEvent = async (id: number, title: string) => {
    if (!confirm(`Are you sure you want to delete: "${title}"?`)) return

    try {
      const res = await deleteNewsEventAction(id)
      if (res.success) {
        toast.success('Item deleted')
        setNewsEvents(prev => prev.filter(n => n.id !== id))
      } else {
        toast.error('Failed to delete item')
      }
    } catch (e: any) {
      toast.error(e?.message || 'An error occurred')
    }
  }

  // Add Tender Form State
  const [tenderTitle, setTenderTitle] = useState('')
  const [tenderDate, setTenderDate] = useState(() => {
    const today = new Date()
    return `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`
  })
  const [tenderFile, setTenderFile] = useState<File | null>(null)

  const handleAddTender = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tenderTitle.trim() || !tenderDate.trim() || !tenderFile) {
      toast.error('Please fill out all tender fields and select a PDF file')
      return
    }

    setIsPending(true)
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', tenderFile)

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!uploadRes.ok) {
        const errorData = await uploadRes.json()
        throw new Error(errorData.error || 'Failed to upload PDF')
      }

      const uploadData = await uploadRes.json()
      const uploadedUrl = uploadData.url

      const newTender: Omit<TenderItem, 'id'> = {
        title: tenderTitle,
        date: tenderDate,
        url: uploadedUrl,
        isHidden: false
      }

      const res = await addTenderAction(newTender)
      if (res.success) {
        toast.success('Tender published successfully')
        setIsTenderModalOpen(false)
        window.location.reload()
      } else {
        toast.error('Failed to publish tender')
      }
    } catch (e: any) {
      toast.error(e?.message || 'An error occurred')
    } finally {
      setIsPending(false)
      setIsUploading(false)
    }
  }

  const handleDeleteTender = async (id: number, title: string) => {
    if (!confirm(`Are you sure you want to delete tender: "${title}"?`)) return

    try {
      const res = await deleteTenderAction(id)
      if (res.success) {
        toast.success('Tender deleted')
        setTenders(prev => prev.filter(t => t.id !== id))
      } else {
        toast.error('Failed to delete tender')
      }
    } catch (e: any) {
      toast.error(e?.message || 'An error occurred')
    }
  }

  const handleToggleTenderVisibility = async (id: number) => {
    try {
      const res = await toggleTenderVisibilityAction(id)
      if (res.success) {
        toast.success('Visibility updated')
        setTenders(prev => prev.map(t => t.id === id ? { ...t, isHidden: !t.isHidden } : t))
      } else {
        toast.error('Failed to update visibility')
      }
    } catch (e: any) {
      toast.error(e?.message || 'An error occurred')
    }
  }

  const filteredNewsEvents = newsEvents.filter(n => n.title.toLowerCase().includes(searchQuery.toLowerCase()))
  const filteredTenders = tenders.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">News, Events & Tenders</h1>
        <p className="text-slate-500 mt-2">Manage official announcements, notices, and tenders.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex p-1 bg-slate-100 rounded-xl overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('news-events')}
            className={`flex-1 sm:flex-none px-6 py-2.5 text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'news-events' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            News & Events
          </button>
          <button
            onClick={() => setActiveTab('tenders')}
            className={`flex-1 sm:flex-none px-6 py-2.5 text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'tenders' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Tenders
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={`Search ${activeTab.replace('-', ' ')}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
          />
        </div>
      </div>

      {activeTab === 'news-events' && (
        <div className="w-full space-y-8">
          <div>
            <Dialog open={isNewsModalOpen} onOpenChange={setIsNewsModalOpen}>
              <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-primary text-xl">
                    <Megaphone className="w-5 h-5" />
                    Publish Update
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddNewsEvent} className="space-y-4 py-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-700">Type</label>
                      <select
                        value={type}
                        onChange={(e) => setType(e.target.value as 'news'|'event')}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
                        required
                      >
                        <option value="news">News / Notice</option>
                        <option value="event">Event Summary</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-700">Date</label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                          placeholder="DD/MM/YYYY"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Title / Headline</label>
                    <div className="relative">
                      <Heading className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
                        placeholder="e.g. Admission Details 2025"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Short Description</label>
                    <div className="relative">
                      <AlignLeft className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <textarea
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[60px] text-sm"
                        placeholder="Brief summary shown on homepage..."
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Full Article (Optional)</label>
                    <div className="relative">
                      <textarea
                        value={fullArticle}
                        onChange={(e) => setFullArticle(e.target.value)}
                        className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[80px] text-sm"
                        placeholder="Full details, schedules, etc..."
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-sm font-semibold text-slate-700">Attach PDF (Optional)</label>
                    <div className="relative">
                      <input
                        type="file"
                        id="news-pdf"
                        accept=".pdf"
                        onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                        className="hidden"
                      />
                      <label 
                        htmlFor="news-pdf"
                        className={`flex flex-col items-center justify-center w-full py-5 px-4 border-2 border-dashed rounded-xl cursor-pointer transition-all ${pdfFile ? 'border-primary/50 bg-primary/5' : 'border-slate-300 hover:border-primary/50 hover:bg-slate-50'}`}
                      >
                        <Upload className={`w-6 h-6 mb-2 ${pdfFile ? 'text-primary' : 'text-slate-400'}`} />
                        {pdfFile ? (
                          <span className="text-sm font-semibold text-primary break-all text-center">{pdfFile.name}</span>
                        ) : (
                          <>
                            <span className="text-sm font-medium text-slate-700">Click to browse or drag PDF here</span>
                            <span className="text-xs text-slate-500 mt-1">Maximum size: 10MB</span>
                          </>
                        )}
                      </label>
                      {pdfFile && (
                        <button 
                          type="button" 
                          onClick={(e) => { e.preventDefault(); setPdfFile(null); }} 
                          className="absolute top-2 right-2 p-1.5 bg-white border border-slate-200 rounded-full shadow-sm text-slate-500 hover:text-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 space-y-3">
                    <h4 className="text-sm font-bold text-slate-800">Promotional Settings</h4>
                    
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                        <input type="checkbox" checked={showInBanner} onChange={(e) => setShowInBanner(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/20" />
                        Show in Top Announcement Banner
                      </label>
                      
                      {showInBanner && (
                        <label className="flex items-center gap-2 text-sm font-medium text-slate-600 cursor-pointer ml-6">
                          <input type="checkbox" checked={isUrgent} onChange={(e) => setIsUrgent(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-red-500 focus:ring-red-500/20" />
                          Mark as Urgent (Displays in Red)
                        </label>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                        <input type="checkbox" checked={showInPopup} onChange={(e) => setShowInPopup(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/20" />
                        Show in Popup Modal (On Homepage Load)
                      </label>
                      
                      {showInPopup && (
                        <div className="ml-6 flex items-center gap-3">
                          <label className="text-xs font-semibold text-slate-500">Popup Tag:</label>
                          <select
                            value={popupType}
                            onChange={(e) => setPopupType(e.target.value as any)}
                            className="px-2 py-1 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 text-xs"
                          >
                            <option value="general">General</option>
                            <option value="important">Important</option>
                            <option value="admission">Admission</option>
                            <option value="exam">Examination</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isPending || isUploading}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-70 mt-2"
                  >
                    {(isPending || isUploading) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    {(isPending || isUploading) ? 'Publishing...' : 'Publish Update'}
                  </button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="w-full">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-lg text-slate-800">Published Updates</h3>
                  <span className="text-xs font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full">
                    {filteredNewsEvents.length} items
                  </span>
                </div>
                <button onClick={() => setIsNewsModalOpen(true)} className="bg-primary hover:bg-primary/90 text-white text-sm font-semibold py-2 px-4 rounded-lg inline-flex items-center gap-2 transition-colors">
                  <Plus className="w-4 h-4" /> Add New Update
                </button>
              </div>
              <div className="divide-y divide-slate-100">
                {filteredNewsEvents.length === 0 ? (
                  <div className="p-12 text-center text-slate-500">
                    <Megaphone className="w-12 h-12 mx-auto text-slate-200 mb-4" />
                    <p className="font-medium">No updates found.</p>
                  </div>
                ) : (
                  filteredNewsEvents.map((item) => (
                    <div key={item.id} className="p-6 hover:bg-slate-50 transition-colors flex items-start justify-between gap-6 group">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="shrink-0 p-3 bg-slate-100 rounded-xl text-slate-500">
                          <Megaphone className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-xs font-bold text-primary uppercase tracking-wider">{item.type}</span>
                            <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {item.date}
                            </span>
                          </div>
                          <h4 className="font-bold text-slate-900 mb-1">{item.title}</h4>
                          <p className="text-sm text-slate-600 line-clamp-2">{item.description}</p>
                          <div className="flex gap-3 mt-3 flex-wrap">
                            {item.fullArticle && <span className="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded">Has Article</span>}
                            {item.pdfUrl && <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded flex items-center gap-1"><FileText className="w-3 h-3"/> PDF Attached</span>}
                            {item.showInBanner && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">In Top Banner</span>}
                            {item.showInPopup && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">In Popup</span>}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteNewsEvent(item.id, item.title)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete Update"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tenders' && (
        <div className="w-full space-y-8">
          <div>
            <Dialog open={isTenderModalOpen} onOpenChange={setIsTenderModalOpen}>
              <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-primary text-xl">
                    <FileText className="w-5 h-5" />
                    Publish Tender
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddTender} className="space-y-4 py-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-sm font-semibold text-slate-700">Tender Title</label>
                      <div className="relative">
                        <Heading className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          value={tenderTitle}
                          onChange={(e) => setTenderTitle(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
                          placeholder="e.g. Quotation for Lab Equipment"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-700">Date</label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          value={tenderDate}
                          onChange={(e) => setTenderDate(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                          placeholder="DD/MM/YYYY"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-sm font-semibold text-slate-700">Upload PDF</label>
                      <div className="relative">
                        <input
                          type="file"
                          id="tender-pdf"
                          accept=".pdf"
                          onChange={(e) => setTenderFile(e.target.files?.[0] || null)}
                          className="hidden"
                          required={!tenderFile}
                        />
                        <label 
                          htmlFor="tender-pdf"
                          className={`flex flex-col items-center justify-center w-full py-5 px-4 border-2 border-dashed rounded-xl cursor-pointer transition-all ${tenderFile ? 'border-primary/50 bg-primary/5' : 'border-slate-300 hover:border-primary/50 hover:bg-slate-50'}`}
                        >
                          <Upload className={`w-6 h-6 mb-2 ${tenderFile ? 'text-primary' : 'text-slate-400'}`} />
                          {tenderFile ? (
                            <span className="text-sm font-semibold text-primary break-all text-center">{tenderFile.name}</span>
                          ) : (
                            <>
                              <span className="text-sm font-medium text-slate-700">Click to browse or drag PDF here</span>
                              <span className="text-xs text-slate-500 mt-1">Maximum size: 10MB</span>
                            </>
                          )}
                        </label>
                        {tenderFile && (
                          <button 
                            type="button" 
                            onClick={(e) => { e.preventDefault(); setTenderFile(null); }} 
                            className="absolute top-2 right-2 p-1.5 bg-white border border-slate-200 rounded-full shadow-sm text-slate-500 hover:text-red-600 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isPending || isUploading}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-70 mt-2"
                  >
                    {(isPending || isUploading) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    {(isPending || isUploading) ? 'Uploading PDF...' : 'Publish Tender'}
                  </button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="w-full">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-lg text-slate-800">Active Tenders</h3>
                  <span className="text-xs font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full">
                    {filteredTenders.length} items
                  </span>
                </div>
                <button onClick={() => setIsTenderModalOpen(true)} className="bg-primary hover:bg-primary/90 text-white text-sm font-semibold py-2 px-4 rounded-lg inline-flex items-center gap-2 transition-colors">
                  <Plus className="w-4 h-4" /> Add New Tender
                </button>
              </div>
              <div className="divide-y divide-slate-100">
                {filteredTenders.length === 0 ? (
                  <div className="p-12 text-center text-slate-500">
                    <FileText className="w-12 h-12 mx-auto text-slate-200 mb-4" />
                    <p className="font-medium">No tenders found.</p>
                  </div>
                ) : (
                  filteredTenders.map((item) => (
                    <div key={item.id} className={`p-6 transition-colors flex items-start justify-between gap-6 group ${item.isHidden ? 'bg-slate-50' : 'hover:bg-slate-50'}`}>
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`shrink-0 p-3 rounded-xl ${item.isHidden ? 'bg-slate-200 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {item.date}
                            </span>
                            {item.isHidden && (
                              <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-md flex items-center gap-1">
                                <EyeOff className="w-3 h-3" /> Hidden
                              </span>
                            )}
                          </div>
                          <h4 className={`font-bold mb-1 ${item.isHidden ? 'text-slate-500 line-through decoration-slate-300' : 'text-slate-900'}`}>{item.title}</h4>
                          <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline font-medium inline-flex items-center gap-1 mt-1">
                            <Eye className="w-4 h-4" /> View PDF
                          </a>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleToggleTenderVisibility(item.id)}
                          className={`p-2 rounded-lg transition-colors ${item.isHidden ? 'text-emerald-600 hover:bg-emerald-50' : 'text-amber-600 hover:bg-amber-50'}`}
                          title={item.isHidden ? "Show on website" : "Hide from website"}
                        >
                          {item.isHidden ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                        </button>
                        <button
                          onClick={() => handleDeleteTender(item.id, item.title)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Tender"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
