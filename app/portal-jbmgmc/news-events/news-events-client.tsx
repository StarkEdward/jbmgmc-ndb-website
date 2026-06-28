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
  X,
  Pencil
} from 'lucide-react'
import { 
  addNewsEventAction, 
  deleteNewsEventAction, 
  updateNewsEventAction,
  addTenderAction,
  deleteTenderAction,
  updateTenderAction,
  toggleTenderVisibilityAction
} from './actions'
import { toast } from 'sonner'
import type { NewsEventItem, TenderItem } from '@/lib/db'
import { formatDate } from '@/lib/utils'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { RichTextEditor } from '@/components/rich-text-editor'

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

  // Pagination state
  const [newsPage, setNewsPage] = useState(1)
  const [tendersPage, setTendersPage] = useState(1)
  const itemsPerPage = 10

  // Loading state
  const [isPending, setIsPending] = useState(false)
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false)
  const [isTenderModalOpen, setIsTenderModalOpen] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  // Add NewsEvent Form State
  const [editingNewsEventId, setEditingNewsEventId] = useState<number | null>(null)
  const [title, setTitle] = useState('')
  const [titleHi, setTitleHi] = useState('')
  const [titleMr, setTitleMr] = useState('')
  const [type, setType] = useState<'news'|'event'>('news')
  const [date, setDate] = useState(() => {
    const today = new Date()
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  })
  const [desc, setDesc] = useState('')
  const [descHi, setDescHi] = useState('')
  const [descMr, setDescMr] = useState('')
  const [fullArticle, setFullArticle] = useState('')
  const [fullArticleHi, setFullArticleHi] = useState('')
  const [fullArticleMr, setFullArticleMr] = useState('')
  
  // Language Tab State for Form
  const [langTab, setLangTab] = useState<'en'|'hi'|'mr'>('en')
  
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [existingPdfUrl, setExistingPdfUrl] = useState<string | null>(null)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)

  // Announcement Fields
  const [showInBanner, setShowInBanner] = useState(false)
  const [isUrgent, setIsUrgent] = useState(false)
  const [showInPopup, setShowInPopup] = useState(false)
  const [popupStartDate, setPopupStartDate] = useState('')
  const [popupEndDate, setPopupEndDate] = useState('')
  const [popupType, setPopupType] = useState<'important'|'general'|'admission'|'exam'>('general')

  const resetNewsForm = () => {
    setEditingNewsEventId(null)
    setLangTab('en')
    setTitle('')
    setTitleHi('')
    setTitleMr('')
    setType('news')
    const today = new Date()
    setDate(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`)
    setDesc('')
    setDescHi('')
    setDescMr('')
    setFullArticle('')
    setFullArticleHi('')
    setFullArticleMr('')
    setPdfFile(null)
    setExistingPdfUrl(null)
    setImageFiles([])
    setExistingImageUrls([])
    setShowInBanner(false)
    setIsUrgent(false)
    setShowInPopup(false)
    setPopupStartDate('')
    setPopupEndDate('')
    setPopupType('general')
  }

  const handleEditNewsEvent = (item: NewsEventItem) => {
    setEditingNewsEventId(item.id)
    setLangTab('en')
    setTitle(item.title)
    setTitleHi(item.title_hi || '')
    setTitleMr(item.title_mr || '')
    setType(item.type)
    setDate(item.date || '')
    setDesc(item.description)
    setDescHi(item.description_hi || '')
    setDescMr(item.description_mr || '')
    setFullArticle(item.fullArticle || '')
    setFullArticleHi(item.fullArticle_hi || '')
    setFullArticleMr(item.fullArticle_mr || '')
    setPdfFile(null) // Can't easily edit existing file, so we leave it empty.
    setExistingPdfUrl(item.pdfUrl || null)
    setImageFiles([])
    setExistingImageUrls(item.imageUrls || (item.imageUrl ? [item.imageUrl] : []))
    setShowInBanner(item.showInBanner || false)
    setIsUrgent(item.isUrgent || false)
    setShowInPopup(item.showInPopup || false)
    setPopupStartDate(item.popupStartDate || '')
    setPopupEndDate(item.popupEndDate || '')
    setPopupType(item.popupType || 'general')
    setIsNewsModalOpen(true)
  }

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

      let uploadedImageUrls: string[] = []
      if (imageFiles.length > 0) {
        for (const file of imageFiles) {
          const formData = new FormData()
          formData.append('file', file)
          const uploadRes = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          })
          if (!uploadRes.ok) {
            const errorData = await uploadRes.json()
            throw new Error(errorData.error || 'Failed to upload Image')
          }
          const uploadData = await uploadRes.json()
          uploadedImageUrls.push(uploadData.url)
        }
      }

      const finalImageUrls = [...existingImageUrls, ...uploadedImageUrls]

      const newItem: Omit<NewsEventItem, 'id'> = {
        title: title,
        title_hi: titleHi || undefined,
        title_mr: titleMr || undefined,
        date: date,
        description: desc,
        description_hi: descHi || undefined,
        description_mr: descMr || undefined,
        type: type,
        fullArticle: fullArticle || undefined,
        fullArticle_hi: fullArticleHi || undefined,
        fullArticle_mr: fullArticleMr || undefined,
        pdfUrl: pdfFile ? uploadedUrl : existingPdfUrl || undefined,
        imageUrls: finalImageUrls,
        imageUrl: finalImageUrls.length > 0 ? finalImageUrls[0] : undefined,
        isNew: true,
        showInBanner: showInBanner,
        isUrgent: isUrgent,
        showInPopup: showInPopup,
        popupStartDate: popupStartDate || undefined,
        popupEndDate: popupEndDate || undefined,
        popupType: popupType
      }

      if (editingNewsEventId) {
        const res = await updateNewsEventAction(editingNewsEventId, newItem)
        if (res.success) {
          toast.success('Item updated successfully')
          setIsNewsModalOpen(false)
          resetNewsForm()
          window.location.reload()
        } else {
          toast.error('Failed to update item')
        }
      } else {
        const res = await addNewsEventAction(newItem)
        if (res.success) {
          toast.success('Item published successfully')
          setIsNewsModalOpen(false)
          resetNewsForm()
          window.location.reload()
        } else {
          toast.error('Failed to publish item')
        }
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
  const [editingTenderId, setEditingTenderId] = useState<number | null>(null)
  const [tenderTitle, setTenderTitle] = useState('')
  const [tenderTitleHi, setTenderTitleHi] = useState('')
  const [tenderTitleMr, setTenderTitleMr] = useState('')
  const [tenderLangTab, setTenderLangTab] = useState<'en'|'hi'|'mr'>('en')
  const [tenderDate, setTenderDate] = useState(() => {
    const today = new Date()
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  })
  const [tenderDueDate, setTenderDueDate] = useState('')
  const [tenderFile, setTenderFile] = useState<File | null>(null)

  const resetTenderForm = () => {
    setEditingTenderId(null)
    setTenderLangTab('en')
    setTenderTitle('')
    setTenderTitleHi('')
    setTenderTitleMr('')
    const today = new Date()
    setTenderDate(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`)
    setTenderDueDate('')
    setTenderFile(null)
  }

  const handleEditTender = (item: TenderItem) => {
    setEditingTenderId(item.id)
    setTenderLangTab('en')
    setTenderTitle(item.title)
    setTenderTitleHi(item.title_hi || '')
    setTenderTitleMr(item.title_mr || '')
    setTenderDate(item.publishDate || '')
    setTenderDueDate(item.dueDate || '')
    setTenderFile(null)
    setIsTenderModalOpen(true)
  }

  const handleAddTender = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tenderTitle.trim() || !tenderDate.trim() || (!tenderFile && !editingTenderId)) {
      toast.error('Please fill out all tender fields')
      return
    }

    setIsPending(true)
    setIsUploading(true)
    try {
      let uploadedUrl = undefined
      if (tenderFile) {
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
        uploadedUrl = uploadData.url
      }

      const newTender: Partial<TenderItem> = {
        title: tenderTitle,
        title_hi: tenderTitleHi || undefined,
        title_mr: tenderTitleMr || undefined,
        publishDate: tenderDate,
        dueDate: tenderDueDate || undefined,
        url: uploadedUrl || '',
        isHidden: false
      }

      if (editingTenderId) {
        if (!uploadedUrl) {
          const existing = tenders.find(t => t.id === editingTenderId)
          newTender.url = existing?.url || ''
          newTender.isHidden = existing?.isHidden || false
        }
        const res = await updateTenderAction(editingTenderId, newTender)
        if (res.success) {
          toast.success('Tender updated successfully')
          setIsTenderModalOpen(false)
          resetTenderForm()
          window.location.reload()
        } else {
          toast.error('Failed to update tender')
        }
      } else {
        const res = await addTenderAction(newTender)
        if (res.success) {
          toast.success('Tender published successfully')
          setIsTenderModalOpen(false)
          resetTenderForm()
          window.location.reload()
        } else {
          toast.error('Failed to publish tender')
        }
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

  const totalNewsPages = Math.ceil(filteredNewsEvents.length / itemsPerPage)
  const paginatedNews = filteredNewsEvents.slice((newsPage - 1) * itemsPerPage, newsPage * itemsPerPage)

  const totalTendersPages = Math.ceil(filteredTenders.length / itemsPerPage)
  const paginatedTenders = filteredTenders.slice((tendersPage - 1) * itemsPerPage, tendersPage * itemsPerPage)

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
                    {editingNewsEventId ? 'Edit Update' : 'Publish Update'}
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
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex border-b border-slate-200 mb-4 col-span-1 md:col-span-2">
                    <button type="button" onClick={() => setLangTab('en')} className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${langTab === 'en' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>English (Default)</button>
                    <button type="button" onClick={() => setLangTab('hi')} className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors font-mukta ${langTab === 'hi' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>हिंदी (Hindi)</button>
                    <button type="button" onClick={() => setLangTab('mr')} className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors font-mukta ${langTab === 'mr' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>मराठी (Marathi)</button>
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-sm font-semibold text-slate-700">
                      Title / Headline {langTab === 'hi' ? '(Hindi)' : langTab === 'mr' ? '(Marathi)' : ''}
                    </label>
                    <div className="relative">
                      <Heading className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={langTab === 'en' ? title : langTab === 'hi' ? titleHi : titleMr}
                        onChange={(e) => langTab === 'en' ? setTitle(e.target.value) : langTab === 'hi' ? setTitleHi(e.target.value) : setTitleMr(e.target.value)}
                        className={`w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium ${langTab !== 'en' ? 'font-mukta' : ''}`}
                        placeholder={langTab === 'en' ? "e.g. Admission Details 2025" : ""}
                        required={langTab === 'en'}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-sm font-semibold text-slate-700">
                      Short Description {langTab === 'hi' ? '(Hindi)' : langTab === 'mr' ? '(Marathi)' : ''}
                    </label>
                    <div className="relative">
                      <AlignLeft className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <textarea
                        value={langTab === 'en' ? desc : langTab === 'hi' ? descHi : descMr}
                        onChange={(e) => langTab === 'en' ? setDesc(e.target.value) : langTab === 'hi' ? setDescHi(e.target.value) : setDescMr(e.target.value)}
                        className={`w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[60px] text-sm ${langTab !== 'en' ? 'font-mukta' : ''}`}
                        placeholder={langTab === 'en' ? "Brief summary shown on homepage..." : ""}
                        required={langTab === 'en'}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-sm font-semibold text-slate-700">
                      Full Article Details {langTab === 'hi' ? '(Hindi)' : langTab === 'mr' ? '(Marathi)' : ''}
                    </label>
                    <div className={langTab !== 'en' ? 'font-mukta' : ''}>
                      <RichTextEditor
                        value={langTab === 'en' ? fullArticle : langTab === 'hi' ? fullArticleHi : fullArticleMr}
                        onChange={(val) => langTab === 'en' ? setFullArticle(val) : langTab === 'hi' ? setFullArticleHi(val) : setFullArticleMr(val)}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 md:col-span-2 bg-slate-50/80 p-4 rounded-xl border border-slate-200/60">
                    <label className="text-sm font-semibold text-slate-700 flex items-center justify-between">
                      <span>Attach Official Document (PDF)</span>
                      {existingPdfUrl && !pdfFile && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">Has Existing PDF</span>}
                    </label>
                    
                    {/* Existing PDF Display */}
                    {existingPdfUrl && (
                      <div className={`mt-2 p-3 border rounded-lg flex justify-between items-center transition-all ${pdfFile ? 'bg-slate-100 border-slate-200 opacity-60' : 'bg-white border-blue-200 shadow-sm'}`}>
                        <div className="flex flex-col overflow-hidden mr-2">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Current Attachment</span>
                          <a href={existingPdfUrl} target="_blank" rel="noopener noreferrer" className={`text-sm font-medium flex items-center gap-2 truncate ${pdfFile ? 'text-slate-500 line-through' : 'text-blue-600 hover:text-blue-700 hover:underline'}`}>
                            <FileText className="w-4 h-4 shrink-0" /> <span className="truncate">{existingPdfUrl.split('/').pop() || 'Existing PDF'}</span>
                          </a>
                        </div>
                        {!pdfFile && (
                          <button type="button" onClick={() => setExistingPdfUrl(null)} className="shrink-0 text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-colors text-xs font-semibold flex items-center gap-1 border border-transparent hover:border-red-100">
                            <Trash2 className="w-3.5 h-3.5" /> Remove
                          </button>
                        )}
                        {pdfFile && (
                          <span className="shrink-0 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-100">Will be replaced</span>
                        )}
                      </div>
                    )}

                    {/* New PDF Upload Box */}
                    <div className="relative mt-2">
                      <input
                        type="file"
                        id="news-pdf"
                        accept=".pdf"
                        onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                        className="hidden"
                      />
                      <label 
                        htmlFor="news-pdf"
                        className={`flex flex-col items-center justify-center w-full py-4 px-4 border-2 border-dashed rounded-xl cursor-pointer transition-all ${pdfFile ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300 hover:border-primary/50 hover:bg-white bg-white/50'}`}
                      >
                        <Upload className={`w-5 h-5 mb-2 ${pdfFile ? 'text-emerald-500' : 'text-slate-400'}`} />
                        {pdfFile ? (
                          <div className="flex flex-col items-center">
                            <span className="text-sm font-bold text-emerald-600 text-center">✅ New PDF Ready to Upload</span>
                            <span className="text-xs font-medium text-emerald-700 mt-1 break-all text-center">{pdfFile.name}</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center text-center">
                            <span className="text-sm font-medium text-slate-700">
                              {existingPdfUrl ? 'Click to select a DIFFERENT PDF to replace the current one' : 'Click to browse or drag a PDF here'}
                            </span>
                            <span className="text-xs text-slate-500 mt-1">Maximum size: 10MB</span>
                          </div>
                        )}
                      </label>
                      {pdfFile && (
                        <button 
                          type="button" 
                          onClick={(e) => { e.preventDefault(); setPdfFile(null); }} 
                          className="absolute top-2 right-2 p-1.5 bg-white border border-slate-200 rounded-full shadow-sm text-slate-500 hover:text-red-600 transition-colors"
                          title="Cancel new PDF selection"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5 md:col-span-2 bg-slate-50/80 p-4 rounded-xl border border-slate-200/60">
                    <label className="text-sm font-semibold text-slate-700 flex items-center justify-between">
                      <span>Attach Images (Optional)</span>
                      {existingImageUrls.length > 0 && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">{existingImageUrls.length} Existing Image{existingImageUrls.length > 1 ? 's' : ''}</span>}
                    </label>
                    
                    {/* Image Preview Area */}
                    {(existingImageUrls.length > 0 || imageFiles.length > 0) && (
                      <div className="mt-2 p-3 border border-slate-200 rounded-lg bg-white shadow-sm flex flex-col gap-2">
                        {existingImageUrls.length > 0 && (
                          <div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">Current Images</span>
                            <div className="flex flex-wrap gap-3">
                              {existingImageUrls.map((url, idx) => (
                                <div key={`exist-${idx}`} className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200 shadow-sm group">
                                  <img src={url} alt="existing" className="w-full h-full object-cover" />
                                  <button type="button" onClick={() => setExistingImageUrls(prev => prev.filter((_, i) => i !== idx))} className="absolute top-1 right-1 p-1 bg-white text-red-600 rounded-md shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50">
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {imageFiles.length > 0 && (
                          <div className={existingImageUrls.length > 0 ? "pt-2 border-t border-slate-100 mt-1" : ""}>
                            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-2 block">New Images Ready to Upload</span>
                            <div className="flex flex-wrap gap-3">
                              {imageFiles.map((file, idx) => (
                                <div key={`new-${idx}`} className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-emerald-500 bg-emerald-50 flex flex-col items-center justify-center p-2 group">
                                  <span className="text-[10px] font-semibold text-emerald-700 text-center break-all line-clamp-3">{file.name}</span>
                                  <button type="button" onClick={() => setImageFiles(prev => prev.filter((_, i) => i !== idx))} className="absolute top-1 right-1 p-1 bg-white text-red-600 rounded-md shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50">
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* New Image Upload Box */}
                    <div className="relative mt-2">
                      <input
                        type="file"
                        id="news-image"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          if (e.target.files) {
                            setImageFiles(prev => [...prev, ...Array.from(e.target.files!)])
                          }
                          e.target.value = ''
                        }}
                        className="hidden"
                      />
                      <label 
                        htmlFor="news-image"
                        className={`flex flex-col items-center justify-center w-full py-4 px-4 border-2 border-dashed rounded-xl cursor-pointer transition-all border-slate-300 hover:border-primary/50 hover:bg-white bg-white/50`}
                      >
                        <Upload className={`w-5 h-5 mb-2 text-slate-400`} />
                        <span className="text-sm font-medium text-slate-700 text-center">
                          Click to browse or drag Images here
                        </span>
                        <span className="text-xs text-slate-500 mt-1">You can select multiple images</span>
                      </label>
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
                        <div className="ml-6 space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <label className="text-xs font-semibold text-slate-500 w-24">Popup Tag:</label>
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
                          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <label className="text-xs font-semibold text-slate-500 w-24">Start Date:</label>
                            <input
                              type="date"
                              value={popupStartDate}
                              onChange={(e) => setPopupStartDate(e.target.value)}
                              className="px-2 py-1 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 text-xs"
                            />
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <label className="text-xs font-semibold text-slate-500 w-24">End Date:</label>
                            <input
                              type="date"
                              value={popupEndDate}
                              onChange={(e) => setPopupEndDate(e.target.value)}
                              className="px-2 py-1 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 text-xs"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 mt-4 md:col-span-2">
                    <button
                      type="button"
                      onClick={() => setIsPreviewOpen(true)}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </button>
                    <button
                      type="submit"
                      disabled={isPending || isUploading}
                      className="flex-[2] bg-primary hover:bg-primary/90 text-white font-bold py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-70"
                    >
                      {(isPending || isUploading) ? <Loader2 className="w-4 h-4 animate-spin" /> : (editingNewsEventId ? <Pencil className="w-4 h-4" /> : <Plus className="w-4 h-4" />)}
                      {(isPending || isUploading) ? (editingNewsEventId ? 'Updating...' : 'Publishing...') : (editingNewsEventId ? 'Update Item' : 'Publish Update')}
                    </button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            {/* Preview Modal */}
            <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
              <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                    <Eye className="w-5 h-5 text-primary" />
                    Preview Public Article View
                  </DialogTitle>
                </DialogHeader>
                <div className="mt-6 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6 sm:p-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white leading-tight mb-4">
                      {title || 'Untitled Article'}
                    </h1>
                    {desc && (
                      <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium border-l-4 border-primary pl-4 py-1.5 bg-primary/5 rounded-r-lg">
                        {desc}
                      </p>
                    )}
                  </div>
                  <div className="p-6 sm:p-8 bg-white dark:bg-slate-950">
                    <div 
                      className="prose prose-slate dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: fullArticle || '<p class="text-slate-500 italic">No content provided yet.</p>' }}
                    />
                  </div>
                </div>
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
                <button onClick={() => { resetNewsForm(); setIsNewsModalOpen(true); }} className="bg-primary hover:bg-primary/90 text-white text-sm font-semibold py-2 px-4 rounded-lg inline-flex items-center gap-2 transition-colors">
                  <Plus className="w-4 h-4" /> Add New Update
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4">Title & Description</th>
                      <th className="px-6 py-4 whitespace-nowrap">Type</th>
                      <th className="px-6 py-4 whitespace-nowrap">Date</th>
                      <th className="px-6 py-4">Highlights</th>
                      <th className="px-6 py-4 text-right whitespace-nowrap sticky right-0 bg-slate-50 z-10 shadow-[-10px_0_15px_-10px_rgba(0,0,0,0.05)]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedNews.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-12 text-center text-slate-500">
                          <Megaphone className="w-12 h-12 mx-auto text-slate-200 mb-4" />
                          <p className="font-medium">No updates found.</p>
                        </td>
                      </tr>
                    ) : (
                      paginatedNews.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                          <td className="px-6 py-4 max-w-md">
                            <h4 className="font-bold text-slate-900 mb-1 truncate" title={item.title}>{item.title}</h4>
                            <p className="text-xs text-slate-500 line-clamp-1" title={item.description}>{item.description}</p>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-xs font-bold text-primary uppercase tracking-wider bg-primary/10 px-2 py-1 rounded-md">{item.type}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {formatDate(item.date)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2 flex-wrap max-w-[200px]">
                              {item.fullArticle && <span className="text-[10px] font-bold bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">Article</span>}
                              {item.pdfUrl && <span className="text-[10px] font-bold bg-red-100 text-red-700 px-1.5 py-0.5 rounded">PDF</span>}
                              {item.showInBanner && <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">Banner</span>}
                              {item.showInPopup && <span className="text-[10px] font-bold bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">Popup</span>}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right sticky right-0 bg-white group-hover:bg-slate-50/80 z-10 shadow-[-10px_0_15px_-10px_rgba(0,0,0,0.05)] transition-colors">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleEditNewsEvent(item)}
                                className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                title="Edit Update"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteNewsEvent(item.id, item.title)}
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete Update"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination Controls */}
              {totalNewsPages > 1 && (
                <div className="flex items-center justify-center gap-2 p-4 border-t border-slate-100 bg-slate-50/50">
                  <button 
                    onClick={() => setNewsPage(p => Math.max(1, p - 1))}
                    disabled={newsPage === 1}
                    className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-semibold"
                  >
                    Previous
                  </button>
                  <span className="text-sm font-medium text-slate-600 px-4">
                    Page {newsPage} of {totalNewsPages}
                  </span>
                  <button 
                    onClick={() => setNewsPage(p => Math.min(totalNewsPages, p + 1))}
                    disabled={newsPage === totalNewsPages}
                    className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-semibold"
                  >
                    Next
                  </button>
                </div>
              )}
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
                    {editingTenderId ? 'Edit Tender' : 'Publish Tender'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddTender} className="space-y-4 py-2">
                  <div className="flex border-b border-slate-200 mb-4 col-span-1 md:col-span-2">
                    <button type="button" onClick={() => setTenderLangTab('en')} className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${tenderLangTab === 'en' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>English (Default)</button>
                    <button type="button" onClick={() => setTenderLangTab('hi')} className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors font-mukta ${tenderLangTab === 'hi' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>हिंदी (Hindi)</button>
                    <button type="button" onClick={() => setTenderLangTab('mr')} className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors font-mukta ${tenderLangTab === 'mr' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>मराठी (Marathi)</button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-sm font-semibold text-slate-700">
                        Tender Title {tenderLangTab === 'hi' ? '(Hindi)' : tenderLangTab === 'mr' ? '(Marathi)' : ''}
                      </label>
                      <div className="relative">
                        <Heading className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          value={tenderLangTab === 'en' ? tenderTitle : tenderLangTab === 'hi' ? tenderTitleHi : tenderTitleMr}
                          onChange={(e) => tenderLangTab === 'en' ? setTenderTitle(e.target.value) : tenderLangTab === 'hi' ? setTenderTitleHi(e.target.value) : setTenderTitleMr(e.target.value)}
                          className={`w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium ${tenderLangTab !== 'en' ? 'font-mukta' : ''}`}
                          placeholder={tenderLangTab === 'en' ? "e.g. Quotation for Lab Equipment" : ""}
                          required={tenderLangTab === 'en'}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-700">Publish Date</label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="date"
                          value={tenderDate}
                          onChange={(e) => setTenderDate(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-sm font-semibold text-slate-700">Due Date (Optional)</label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="date"
                          value={tenderDueDate}
                          onChange={(e) => setTenderDueDate(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
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
                          required={!tenderFile && !editingTenderId}
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
                              <span className="text-sm font-medium text-slate-700">
                                {editingTenderId ? 'Click to upload a new PDF (optional)' : 'Click to browse or drag PDF here'}
                              </span>
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
                    {(isPending || isUploading) ? <Loader2 className="w-4 h-4 animate-spin" /> : (editingTenderId ? <Pencil className="w-4 h-4" /> : <Plus className="w-4 h-4" />)}
                    {(isPending || isUploading) ? (editingTenderId ? 'Updating...' : 'Publishing...') : (editingTenderId ? 'Update Tender' : 'Publish Tender')}
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
                <button onClick={() => { resetTenderForm(); setIsTenderModalOpen(true); }} className="bg-primary hover:bg-primary/90 text-white text-sm font-semibold py-2 px-4 rounded-lg inline-flex items-center gap-2 transition-colors">
                  <Plus className="w-4 h-4" /> Add New Tender
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4">Tender Title</th>
                      <th className="px-6 py-4 whitespace-nowrap">Publish Date</th>
                      <th className="px-6 py-4 whitespace-nowrap">Due Date</th>
                      <th className="px-6 py-4 whitespace-nowrap">Status</th>
                      <th className="px-6 py-4 text-right whitespace-nowrap sticky right-0 bg-slate-50 z-10 shadow-[-10px_0_15px_-10px_rgba(0,0,0,0.05)]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedTenders.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-12 text-center text-slate-500">
                          <FileText className="w-12 h-12 mx-auto text-slate-200 mb-4" />
                          <p className="font-medium">No tenders found.</p>
                        </td>
                      </tr>
                    ) : (
                      paginatedTenders.map((item) => (
                        <tr key={item.id} className={`transition-colors group ${item.isHidden ? 'bg-slate-50' : 'hover:bg-slate-50/80'}`}>
                          <td className="px-6 py-4 max-w-md">
                            <div className="flex items-center gap-3">
                              <FileText className={`w-4 h-4 shrink-0 ${item.isHidden ? 'text-slate-400' : 'text-primary'}`} />
                              <div>
                                <h4 className={`font-bold mb-1 truncate ${item.isHidden ? 'text-slate-500 line-through decoration-slate-300' : 'text-slate-900'}`} title={item.title}>{item.title}</h4>
                                <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-[11px] text-primary hover:underline font-bold inline-flex items-center gap-1">
                                  <Eye className="w-3 h-3" /> View PDF
                                </a>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {formatDate(item.publishDate || item.date)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.dueDate ? (
                              <span className="text-xs font-medium text-red-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {formatDate(item.dueDate)}
                              </span>
                            ) : <span className="text-xs text-slate-400">-</span>}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.isHidden ? (
                              <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded-md inline-flex items-center gap-1">
                                <EyeOff className="w-3 h-3" /> Hidden
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md inline-flex items-center gap-1">
                                <Eye className="w-3 h-3" /> Visible
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right sticky right-0 bg-white group-hover:bg-slate-50/80 z-10 shadow-[-10px_0_15px_-10px_rgba(0,0,0,0.05)] transition-colors">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleToggleTenderVisibility(item.id)}
                                className={`p-2 rounded-lg transition-colors ${item.isHidden ? 'text-emerald-600 hover:bg-emerald-50' : 'text-amber-600 hover:bg-amber-50'}`}
                                title={item.isHidden ? "Show on website" : "Hide from website"}
                              >
                                {item.isHidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                              </button>
                              <button
                                onClick={() => handleEditTender(item)}
                                className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                title="Edit Tender"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteTender(item.id, item.title)}
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete Tender"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination Controls */}
              {totalTendersPages > 1 && (
                <div className="flex items-center justify-center gap-2 p-4 border-t border-slate-100 bg-slate-50/50">
                  <button 
                    onClick={() => setTendersPage(p => Math.max(1, p - 1))}
                    disabled={tendersPage === 1}
                    className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-semibold"
                  >
                    Previous
                  </button>
                  <span className="text-sm font-medium text-slate-600 px-4">
                    Page {tendersPage} of {totalTendersPages}
                  </span>
                  <button 
                    onClick={() => setTendersPage(p => Math.min(totalTendersPages, p + 1))}
                    disabled={tendersPage === totalTendersPages}
                    className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-semibold"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
