'use client'

import React, { useState, useRef } from 'react'
import { 
  Sliders, 
  Megaphone, 
  FileText, 
  User, 
  Building, 
  Upload, 
  ArrowUp, 
  ArrowDown, 
  Trash2, 
  Pin, 
  Plus, 
  X, 
  Save, 
  Loader2, 
  FileUp, 
  Globe,
  CheckSquare,
  Award,
  ShieldCheck,
  Users,
  Camera,
  Edit2,
  Lock,
  Download,
  HardDrive
} from 'lucide-react'
import { 
  updateDeanAction, 
  updateCollegeInfoAction,
  addHeroSlideAction,
  deleteHeroSlideAction,
  reorderHeroSlideAction,
  addTickerAction,
  deleteTickerAction,
  togglePinTickerAction,
  reorderTickerAction,
  addDownloadAction,
  deleteDownloadAction,
  reorderDownloadAction,
  updateAccreditationInfoAction,
  addAuthorityAction,
  updateAuthorityAction,
  deleteAuthorityAction,
  updateAdminCredentialsAction
} from '../actions'
import { toast } from 'sonner'
import { RestoreBackupButton } from '../components/restore-backup-button'
import { DeanInfo, CollegeInfo, HeroSlide, TickerBulletin, DownloadItem, AccreditationInfo, Authority } from '@/lib/db'
import ImageCropper from '@/components/image-cropper'

interface SettingsClientProps {
  initialDean: DeanInfo
  initialCollege: CollegeInfo
  initialSlides: HeroSlide[]
  initialTickers: TickerBulletin[]
  initialDownloads: DownloadItem[]
  initialAccreditations: AccreditationInfo
  initialAuthorities: Authority[]
  initialCredentials: { username?: string; passwordHash?: string }
}

export default function SettingsClient({
  initialDean,
  initialCollege,
  initialSlides,
  initialTickers,
  initialDownloads,
  initialAccreditations,
  initialAuthorities,
  initialCredentials
}: SettingsClientProps) {
  const [activeTab, setActiveTab] = useState<'hero' | 'docs' | 'dean' | 'profile' | 'accreditations' | 'authorities' | 'security'>('hero')
  
  // Lists state
  const [slides, setSlides] = useState<HeroSlide[]>(initialSlides)
  const [tickers, setTickers] = useState<TickerBulletin[]>(initialTickers)
  const [downloads, setDownloads] = useState<DownloadItem[]>(initialDownloads)

  // Loading indicator
  const [isPending, setIsPending] = useState(false)

  // Credentials State

  // Dean Form State
  const [deanName, setDeanName] = useState(initialDean.name)
  const [deanQual, setDeanQual] = useState(initialDean.qualification)
  const [deanMessage, setDeanMessage] = useState(initialDean.message)

  // College Form State
  const [colName, setColName] = useState(initialCollege.name)
  const [colNameMarathi, setColNameMarathi] = useState(initialCollege.nameMarathi || '')
  const [colShort, setColShort] = useState(initialCollege.shortName)
  const [colArea, setColArea] = useState(initialCollege.area)
  const [colAddress, setColAddress] = useState(initialCollege.address)
  const [colPhone, setColPhone] = useState(initialCollege.phone)
  const [colEmail, setColEmail] = useState(initialCollege.email)
  const [colAbout, setColAbout] = useState(initialCollege.about)

  // Accreditations Form State
  const [nmcAttendance, setNmcAttendance] = useState(initialAccreditations?.nmcAttendanceUrl || '')
  const [nextgenEhospital, setNextgenEhospital] = useState(initialAccreditations?.nextgenEhospitalUrl || '')
  const [muhsAffiliation, setMuhsAffiliation] = useState(initialAccreditations?.muhsAffiliationLetterUrl || '')
  const [visitorCount, setVisitorCount] = useState(initialAccreditations?.visitorCount || 0)

  // Authorities Form/List State
  const [authorities, setAuthorities] = useState<Authority[]>(initialAuthorities)
  const [authName, setAuthName] = useState('')
  const [authDesignation, setAuthDesignation] = useState('')
  const [authCategory, setAuthCategory] = useState<'minister' | 'authority' | 'leadership'>('minister')
  const [authPhotoUrl, setAuthPhotoUrl] = useState('')
  const [authFile, setAuthFile] = useState<File | null>(null)
  const [showAuthCropper, setShowAuthCropper] = useState(false)
  const [editingAuthName, setEditingAuthName] = useState<string | null>(null)
  const [addingAuth, setAddingAuth] = useState(false)

  // Add Slide State
  const [slideFile, setSlideFile] = useState<File | null>(null)
  const [slidePreview, setSlidePreview] = useState<string | null>(null)
  const [slideTitle, setSlideTitle] = useState('')
  const [slideSubtitle, setSlideSubtitle] = useState('')
  const slideFileInputRef = useRef<HTMLInputElement>(null)

  // Add Ticker State
  const [newTickerText, setNewTickerText] = useState('')

  // Add Download State
  const [docFile, setDocFile] = useState<File | null>(null)
  const [docName, setDocName] = useState('')
  const docFileInputRef = useRef<HTMLInputElement>(null)

  // --- SAVE GLOBAL SETTINGS ---
  const handleSaveDean = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsPending(true)
    try {
      const res = await updateDeanAction({ name: deanName, qualification: deanQual, message: deanMessage })
      if (res.success) {
        toast.success("Dean profile message saved successfully")
      } else {
        toast.error(res.error || "Failed to save Dean profile")
      }
    } catch (err: any) {
      toast.error(err?.message || "An error occurred")
    } finally {
      setIsPending(false)
    }
  }

  const handleSaveCollege = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsPending(true)
    const fields = {
      name: colName,
      nameMarathi: colNameMarathi,
      shortName: colShort,
      area: colArea,
      address: colAddress,
      phone: colPhone,
      email: colEmail,
      about: colAbout
    }
    try {
      const res = await updateCollegeInfoAction(fields)
      if (res.success) {
        toast.success("College contact profile saved successfully")
      } else {
        toast.error(res.error || "Failed to save college variables")
      }
    } catch (err: any) {
      toast.error(err?.message || "An error occurred")
    } finally {
      setIsPending(false)
    }
  }

  // --- SAVE ACCREDITATIONS & AUTHORITIES HANDLERS ---
  const handleSaveAccreditations = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsPending(true)
    try {
      const res = await updateAccreditationInfoAction({
        nmcAttendanceUrl: nmcAttendance,
        nextgenEhospitalUrl: nextgenEhospital,
        muhsAffiliationLetterUrl: muhsAffiliation,
        visitorCount: Number(visitorCount)
      })
      if (res.success) {
        toast.success("Accreditation settings saved successfully")
      } else {
        toast.error(res.error || "Failed to save accreditations")
      }
    } catch (err: any) {
      toast.error(err?.message || "An error occurred")
    } finally {
      setIsPending(false)
    }
  }

  const handleAddAuthority = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!authName.trim() || !authDesignation.trim()) {
      toast.error("Name and designation are required")
      return
    }
    setIsPending(true)
    const newAuth: Authority = {
      name: authName.trim(),
      designation: authDesignation.trim(),
      category: authCategory,
      image: authPhotoUrl || '/images/authority-1.jpg'
    }

    try {
      if (editingAuthName) {
        const res = await updateAuthorityAction(editingAuthName, newAuth)
        if (res.success) {
          toast.success(`Successfully updated ${authName}`)
          setAuthorities(prev => prev.map(a => a.name === editingAuthName ? newAuth : a))
          handleCancelEditAuth()
        } else {
          toast.error(res.error || "Failed to update authority")
        }
      } else {
        const res = await addAuthorityAction(newAuth)
        if (res.success) {
          toast.success(`Successfully added ${authName}`)
          setAuthorities(prev => [...prev, newAuth])
          handleCancelEditAuth()
        } else {
          toast.error(res.error || "Failed to add authority")
        }
      }
    } catch (e: any) {
      toast.error(e?.message || "An error occurred")
    } finally {
      setIsPending(false)
    }
  }

  const handleCancelEditAuth = () => {
    setAuthName('')
    setAuthDesignation('')
    setAuthCategory('minister')
    setAuthPhotoUrl('')
    setEditingAuthName(null)
    setAddingAuth(false)
  }

  const handleStartEditAuth = (auth: Authority) => {
    setAuthName(auth.name)
    setAuthDesignation(auth.designation)
    setAuthCategory(auth.category)
    setAuthPhotoUrl(auth.image)
    setEditingAuthName(auth.name)
    setAddingAuth(true)
  }

  const handleDeleteAuthority = async (name: string) => {
    if (!confirm(`Are you sure you want to remove authority: "${name}"? This will permanently delete them from the homepage hierarchy.`)) return
    try {
      const res = await deleteAuthorityAction(name)
      if (res.success) {
        toast.success("Authority removed")
        setAuthorities(prev => prev.filter(a => a.name !== name))
      } else {
        toast.error(res.error || "Failed to remove authority")
      }
    } catch (e: any) {
      toast.error(e?.message || "An error occurred")
    }
  }

  const handleAuthFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAuthFile(e.target.files[0])
      setShowAuthCropper(true)
    }
  }

  const handleAuthCropDone = async (cropped: File) => {
    setShowAuthCropper(false)
    const formData = new FormData()
    formData.append('file', cropped)
    try {
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
      const uploadData = await uploadRes.json()
      if (uploadData.success) {
        setAuthPhotoUrl(uploadData.url)
        toast.success('Authority photo adjusted and ready!')
      } else {
        toast.error(uploadData.error || 'Upload failed')
      }
    } catch (e) {
      toast.error('Error uploading photo')
    }
  }

  // --- HERO SLIDES CONTROLS ---
  const handleSlideFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSlideFile(file)
    setSlidePreview(URL.createObjectURL(file))
  }

  const handleAddSlide = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!slideFile || !slideTitle.trim()) {
      toast.error("Please select a slide photograph and write a title")
      return
    }

    setIsPending(true)
    const formData = new FormData()
    formData.append('file', slideFile)

    try {
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      const uploadData = await uploadRes.json()

      if (!uploadRes.ok || !uploadData.success) {
        throw new Error(uploadData.error || "File upload failed")
      }

      const res = await addHeroSlideAction({
        image: uploadData.url,
        alt: slideTitle,
        title: slideTitle,
        subtitle: slideSubtitle
      })

      if (res.success) {
        toast.success("Hero slide uploaded successfully")
        // Reload list
        window.location.reload()
      } else {
        toast.error(res.error || "Could not register slide in database")
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred")
    } finally {
      setIsPending(false)
    }
  }

  const handleDeleteSlide = async (id: number, title: string) => {
    if (!confirm(`Are you sure you want to remove slide: "${title}"?`)) return
    try {
      const res = await deleteHeroSlideAction(id)
      if (res.success) {
        toast.success("Slide removed")
        setSlides(prev => prev.filter(s => s.id !== id))
      } else {
        toast.error(res.error || "Failed to delete slide")
      }
    } catch (e: any) {
      toast.error(e?.message || "An error occurred")
    }
  }

  const handleReorderSlide = async (id: number, direction: 'up' | 'down') => {
    try {
      const res = await reorderHeroSlideAction(id, direction)
      if (res.success) {
        toast.success("Slide sequence adjusted")
        // Dynamic reorder in state
        const sorted = [...slides].sort((a, b) => a.order - b.order)
        const idx = sorted.findIndex(s => s.id === id)
        if (direction === 'up' && idx > 0) {
          const temp = sorted[idx].order
          sorted[idx].order = sorted[idx - 1].order
          sorted[idx - 1].order = temp
        } else if (direction === 'down' && idx < sorted.length - 1) {
          const temp = sorted[idx].order
          sorted[idx].order = sorted[idx + 1].order
          sorted[idx + 1].order = temp
        }
        setSlides(sorted.sort((a, b) => a.order - b.order))
      } else {
        toast.error(res.error || "Failed to re-sequence slide")
      }
    } catch (e: any) {
      toast.error(e?.message || "An error occurred")
    }
  }

  // --- ANNOUNCEMENT TICKERS CONTROLS ---
  const handleAddTicker = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTickerText.trim()) return
    setIsPending(true)
    try {
      const res = await addTickerAction(newTickerText.trim())
      if (res.success) {
        toast.success("Notice published to scrolling bulletins ticker")
        setNewTickerText('')
        window.location.reload()
      } else {
        toast.error(res.error || "Failed to save notice")
      }
    } catch (e: any) {
      toast.error(e?.message || "An error occurred")
    } finally {
      setIsPending(false)
    }
  }

  const handleDeleteTicker = async (id: number) => {
    if (!confirm("Are you sure you want to delete this news ticker notice?")) return
    try {
      const res = await deleteTickerAction(id)
      if (res.success) {
        toast.success("Notice deleted")
        setTickers(prev => prev.filter(t => t.id !== id))
      } else {
        toast.error(res.error || "Failed to delete notice")
      }
    } catch (e: any) {
      toast.error(e?.message || "An error occurred")
    }
  }

  const handleTogglePinTicker = async (id: number) => {
    try {
      const res = await togglePinTickerAction(id)
      if (res.success) {
        toast.success("Priority status toggled")
        setTickers(prev => prev.map(t => {
          if (t.id === id) return { ...t, pinned: !t.pinned }
          return t
        }))
      } else {
        toast.error(res.error || "Failed to toggle pin state")
      }
    } catch (e: any) {
      toast.error(e?.message || "An error occurred")
    }
  }

  const handleReorderTicker = async (id: number, direction: 'up' | 'down') => {
    try {
      const res = await reorderTickerAction(id, direction)
      if (res.success) {
        toast.success("Notice sequence adjusted")
        window.location.reload()
      } else {
        toast.error(res.error || "Failed to re-sequence notice")
      }
    } catch (e: any) {
      toast.error(e?.message || "An error occurred")
    }
  }

  // --- DOCUMENT DOWNLOADS CONTROLS ---
  const handleDocFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setDocFile(file)
    if (!docName) {
      const clean = file.name.substring(0, file.name.lastIndexOf('.')) || file.name
      setDocName(clean.replace(/[-_]+/g, ' '))
    }
  }

  const handleAddDownload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!docFile || !docName.trim()) {
      toast.error("Please select a document file and enter a name")
      return
    }

    setIsPending(true)
    const formData = new FormData()
    formData.append('file', docFile)

    try {
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      const uploadData = await uploadRes.json()

      if (!uploadRes.ok || !uploadData.success) {
        throw new Error(uploadData.error || "File upload failed")
      }

      const res = await addDownloadAction(docName.trim(), uploadData.url)
      if (res.success) {
        toast.success(`Successfully uploaded and registered: "${docName}"`)
        setDocFile(null)
        setDocName('')
        window.location.reload()
      } else {
        toast.error(res.error || "Failed to save record to downloads database")
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred")
    } finally {
      setIsPending(false)
    }
  }

  const handleDeleteDownload = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete brochure document: "${name}"?`)) return
    try {
      const res = await deleteDownloadAction(id)
      if (res.success) {
        toast.success("Document removed from downloads list")
        setDownloads(prev => prev.filter(d => d.id !== id))
      } else {
        toast.error(res.error || "Failed to delete document")
      }
    } catch (e: any) {
      toast.error(e?.message || "An error occurred")
    }
  }

  const handleReorderDownload = async (id: number, direction: 'up' | 'down') => {
    try {
      const res = await reorderDownloadAction(id, direction)
      if (res.success) {
        toast.success("Document sequence adjusted")
        window.location.reload()
      } else {
        toast.error(res.error || "Failed to re-sequence document")
      }
    } catch (e: any) {
      toast.error(e?.message || "An error occurred")
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">Global Settings & Sequencing</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Advanced controls to manage scrolling bullet notice sequence, rearrange hero slides, register PDF files in vault, and edit administrative profiles.
        </p>
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-slate-50/60 dark:bg-slate-900/60 p-1 ring-1 ring-slate-850">
          <button
            onClick={() => setActiveTab('hero')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'hero' ? 'bg-teal-500 text-slate-950 shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200'
            }`}
          >
            <Sliders className="h-4 w-4" />
            Hero Slides & Bullet Ticker
          </button>
          
          <button
            onClick={() => setActiveTab('docs')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'docs' ? 'bg-teal-500 text-slate-950 shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200'
            }`}
          >
            <FileUp className="h-4 w-4" />
            PDF brochure Document Vault
          </button>

          <button
            onClick={() => setActiveTab('dean')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'dean' ? 'bg-teal-500 text-slate-950 shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200'
            }`}
          >
            <User className="h-4 w-4" />
            Dean message Editor
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'profile' ? 'bg-teal-500 text-slate-950 shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200'
            }`}
          >
            <Globe className="h-4 w-4" />
            College contact Profile
          </button>

          <button
            onClick={() => setActiveTab('accreditations')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'accreditations' ? 'bg-teal-500 text-slate-950 shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            Accreditation URLs
          </button>

          <button
            onClick={() => setActiveTab('authorities')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'authorities' ? 'bg-teal-500 text-slate-950 shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200'
            }`}
          >
            <Users className="h-4 w-4" />
            Authorities & Leaders
          </button>
        </div>
      </div>

      {/* Dynamic Content Views */}
      <div className="space-y-6">
        
        {/* VIEW 1: HERO SLIDES & SCROLLING bulletins TICKER */}
        {activeTab === 'hero' && (
          <div className="grid gap-6 md:grid-cols-12">
            {/* HERO SLIDES MANAGER */}
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 p-6 shadow-2xl backdrop-blur-md md:col-span-6 space-y-6">
              <div className="flex items-center gap-2">
                <Sliders className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                <h2 className="text-base font-bold text-slate-800 dark:text-slate-200">Homepage Slides Sequence</h2>
              </div>

              {/* Upload New Slide Form */}
              <form onSubmit={handleAddSlide} className="rounded-xl border border-slate-200 dark:border-slate-850 bg-white/20 dark:bg-slate-950/20 p-4 space-y-3.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 border-b border-slate-200 dark:border-slate-850 pb-1.5">Add Slideshow Slide</p>
                <div 
                  onClick={() => slideFileInputRef.current?.click()}
                  className="rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-850 py-6 text-center cursor-pointer hover:border-teal-500/30 transition-colors"
                >
                  <input 
                    type="file" 
                    ref={slideFileInputRef} 
                    onChange={handleSlideFileChange} 
                    accept="image/*" 
                    className="hidden" 
                  />
                  {!slidePreview ? (
                    <div className="flex flex-col items-center">
                      <Upload className="h-5 w-5 text-slate-500 mb-1" />
                      <span className="text-[10px] text-slate-500 dark:text-slate-450 uppercase font-semibold">Select Slide Photograph</span>
                    </div>
                  ) : (
                    <img src={slidePreview} alt="Preview" className="h-20 mx-auto object-cover rounded" />
                  )}
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  <input 
                    type="text" 
                    placeholder="Slide Title (Main Heading)" 
                    value={slideTitle}
                    onChange={(e) => setSlideTitle(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-950 px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                  />
                  <input 
                    type="text" 
                    placeholder="Slide Subtitle (Secondary)" 
                    value={slideSubtitle}
                    onChange={(e) => setSlideSubtitle(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-950 px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isPending || !slideFile}
                  className="w-full rounded-lg bg-teal-500 py-2.5 text-xs font-bold text-slate-950 hover:bg-teal-400 disabled:opacity-50 cursor-pointer"
                >
                  {isPending ? "Uploading Slide..." : "Save slideshow slide"}
                </button>
              </form>

              {/* Slide List with Sorters */}
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {slides.map((slide, idx) => (
                  <div key={slide.id} className="group flex items-center justify-between rounded-xl bg-white/40 dark:bg-slate-950/40 p-3 ring-1 ring-slate-850">
                    <div className="flex items-center gap-3">
                      <img src={slide.image} alt={slide.alt} className="h-10 w-14 object-cover rounded-lg shrink-0" />
                      <div className="min-w-0">
                        <p className="truncate text-xs font-bold text-slate-800 dark:text-slate-200">{slide.title}</p>
                        <p className="truncate text-[10px] text-slate-500">Sequence Order: #{slide.order}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button 
                        onClick={() => handleReorderSlide(slide.id, 'up')}
                        disabled={idx === 0}
                        className="p-1 text-slate-500 hover:text-teal-600 dark:text-teal-400 disabled:opacity-20"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleReorderSlide(slide.id, 'down')}
                        disabled={idx === slides.length - 1}
                        className="p-1 text-slate-500 hover:text-teal-600 dark:text-teal-400 disabled:opacity-20"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteSlide(slide.id, slide.title)}
                        className="p-1 text-slate-500 hover:text-rose-450 ml-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SCROLLING BULLETINS TICKER */}
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 p-6 shadow-2xl backdrop-blur-md md:col-span-6 space-y-6">
              <div className="flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                <h2 className="text-base font-bold text-slate-800 dark:text-slate-200">Scrolling Bullet Ticker</h2>
              </div>

              {/* Add notice form */}
              <form onSubmit={handleAddTicker} className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Type new bulletin alert ticker..." 
                  value={newTickerText}
                  onChange={(e) => setNewTickerText(e.target.value)}
                  className="flex-1 rounded-xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-950 px-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isPending || !newTickerText.trim()}
                  className="rounded-xl bg-teal-500 px-4 text-xs font-bold text-slate-950 hover:bg-teal-400 cursor-pointer"
                >
                  Publish
                </button>
              </form>

              {/* Notice listings */}
              <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
                {tickers.map((item, idx) => (
                  <div 
                    key={item.id} 
                    className={`group flex items-center justify-between rounded-xl p-3.5 ring-1 transition-colors ${
                      item.pinned 
                        ? 'bg-amber-500/5 ring-amber-500/25' 
                        : 'bg-white/40 dark:bg-slate-950/40 ring-slate-850'
                    }`}
                  >
                    <div className="min-w-0 pr-4">
                      <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-sans">{item.text}</p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button 
                        onClick={() => handleTogglePinTicker(item.id)}
                        className={`p-1.5 rounded hover:bg-slate-800 ${item.pinned ? 'text-amber-400' : 'text-slate-500 hover:text-amber-400'}`}
                        title={item.pinned ? 'Unpin' : 'Pin to Top'}
                      >
                        <Pin className="h-3.5 w-3.5" />
                      </button>
                      <button 
                        onClick={() => handleReorderTicker(item.id, 'up')}
                        disabled={idx === 0}
                        className="p-1.5 text-slate-500 hover:text-teal-600 dark:text-teal-400 disabled:opacity-20"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>
                      <button 
                        onClick={() => handleReorderTicker(item.id, 'down')}
                        disabled={idx === tickers.length - 1}
                        className="p-1.5 text-slate-500 hover:text-teal-600 dark:text-teal-400 disabled:opacity-20"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteTicker(item.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-455 ml-0.5"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: PDF DOWNLOAD BROCHURES VAULT */}
        {activeTab === 'docs' && (
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 p-6 shadow-2xl backdrop-blur-md max-w-4xl space-y-6">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-200">Admission PDF brochure Document Vault</h2>
            </div>

            {/* Document upload form */}
            <form onSubmit={handleAddDownload} className="rounded-xl border border-slate-200 dark:border-slate-850 bg-white/20 dark:bg-slate-950/20 p-5 space-y-4 max-w-xl">
              <div 
                onClick={() => docFileInputRef.current?.click()}
                className="rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-850 py-8 text-center cursor-pointer hover:border-teal-500/30 transition-colors"
              >
                <input 
                  type="file" 
                  ref={docFileInputRef} 
                  onChange={handleDocFileChange} 
                  accept=".pdf" 
                  className="hidden" 
                />
                {!docFile ? (
                  <div className="flex flex-col items-center">
                    <FileText className="h-6 w-6 text-slate-500 mb-1.5" />
                    <span className="text-xs text-slate-600 dark:text-slate-350 font-bold uppercase tracking-wide">Select Admission Brochure PDF</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <CheckSquare className="h-6 w-6 text-teal-600 dark:text-teal-400 mb-1.5 animate-pulse" />
                    <span className="text-xs text-slate-800 dark:text-slate-200 font-semibold">{docFile.name}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Document Display Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. MBBS Fee Structure PDF 2025-26" 
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-950 px-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isPending || !docFile}
                className="rounded-xl bg-teal-500 py-3 px-6 text-xs font-bold text-slate-950 hover:bg-teal-400 disabled:opacity-50 cursor-pointer"
              >
                {isPending ? "Uploading document to vault..." : "Save PDF brochure"}
              </button>
            </form>

            {/* Document listings with sequence changers */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Active Brochure Downloads</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {downloads.map((doc, idx) => (
                  <div key={doc.id} className="group flex items-center justify-between rounded-xl bg-white/30 dark:bg-slate-950/30 p-4 ring-1 ring-slate-850">
                    <div className="flex items-center gap-3 min-w-0 pr-4">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-bold text-slate-800 dark:text-slate-200">{doc.name}</p>
                        <p className="text-[10px] text-slate-500 truncate">{doc.url}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5 shrink-0">
                      <button 
                        onClick={() => handleReorderDownload(doc.id, 'up')}
                        disabled={idx === 0}
                        className="p-1 text-slate-500 hover:text-teal-600 dark:text-teal-400 disabled:opacity-20"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleReorderDownload(doc.id, 'down')}
                        disabled={idx === downloads.length - 1}
                        className="p-1 text-slate-500 hover:text-teal-600 dark:text-teal-400 disabled:opacity-20"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteDownload(doc.id, doc.name)}
                        className="p-1 text-slate-500 hover:text-rose-455 ml-0.5"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: DEAN MESSAGE EDITOR */}
        {activeTab === 'dean' && (
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 p-6 shadow-2xl backdrop-blur-md max-w-3xl">
            <div className="flex items-center gap-2 mb-6">
              <User className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-200">Dean Message & Biography</h2>
            </div>

            <form onSubmit={handleSaveDean} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Dean Full Name</label>
                  <input 
                    type="text" 
                    value={deanName}
                    onChange={(e) => setDeanName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-950 px-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Academic Credentials / Qualifications</label>
                  <input 
                    type="text" 
                    value={deanQual}
                    onChange={(e) => setDeanQual(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-950 px-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Official Message to the Society</label>
                <textarea 
                  rows={6}
                  value={deanMessage}
                  onChange={(e) => setDeanMessage(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-950 px-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="flex items-center gap-1.5 rounded-xl bg-teal-500 py-3 px-6 text-xs font-bold text-slate-950 hover:bg-teal-400 disabled:opacity-50 cursor-pointer"
              >
                <Save className="h-4 w-4" />
                Save Message details
              </button>
            </form>
          </div>
        )}

        {/* VIEW 4: COLLEGE PROFILE VARIABLES */}
        {activeTab === 'profile' && (
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 p-6 shadow-2xl backdrop-blur-md max-w-4xl">
            <div className="flex items-center gap-2 mb-6">
              <Building className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-200">Institutional Profile Configurations</h2>
            </div>

            <form onSubmit={handleSaveCollege} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">College Name (English)</label>
                  <input 
                    type="text" 
                    value={colName}
                    onChange={(e) => setColName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-950 px-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">College Name (Marathi)</label>
                  <input 
                    type="text" 
                    value={colNameMarathi}
                    onChange={(e) => setColNameMarathi(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-950 px-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Acronym Shortname</label>
                  <input 
                    type="text" 
                    value={colShort}
                    onChange={(e) => setColShort(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-950 px-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Campus Area Size</label>
                  <input 
                    type="text" 
                    value={colArea}
                    onChange={(e) => setColArea(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-950 px-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Established Year</label>
                  <input 
                    type="text" 
                    value={initialCollege.established}
                    disabled
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-900 px-4 py-2.5 text-xs text-slate-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Primary Helpline Phone Number</label>
                  <input 
                    type="text" 
                    value={colPhone}
                    onChange={(e) => setColPhone(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-950 px-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Official Administration Email</label>
                  <input 
                    type="email" 
                    value={colEmail}
                    onChange={(e) => setColEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-950 px-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">College Address Location Details</label>
                <input 
                  type="text" 
                  value={colAddress}
                  onChange={(e) => setColAddress(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-950 px-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Core Institutional Abstract Overview</label>
                <textarea 
                  rows={4}
                  value={colAbout}
                  onChange={(e) => setColAbout(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-950 px-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="flex items-center gap-1.5 rounded-xl bg-teal-500 py-3 px-6 text-xs font-bold text-slate-950 hover:bg-teal-400 disabled:opacity-50 cursor-pointer"
              >
                <Save className="h-4 w-4" />
                Save college profile
              </button>
            </form>
          </div>
        )}

        {/* VIEW 5: ACCREDITATIONS SETTINGS */}
        {activeTab === 'accreditations' && (
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 p-6 shadow-2xl backdrop-blur-md max-w-3xl">
            <div className="flex items-center gap-2 mb-6">
              <ShieldCheck className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-200">Accreditations & Regulatory URL Settings</h2>
            </div>

            <form onSubmit={handleSaveAccreditations} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">NMC Biometric Attendance Link</label>
                <input 
                  type="text" 
                  value={nmcAttendance}
                  onChange={(e) => setNmcAttendance(e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-950 px-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">NextGen eHospital Login Portal Gateway URL</label>
                <input 
                  type="text" 
                  value={nextgenEhospital}
                  onChange={(e) => setNextgenEhospital(e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-950 px-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">MUHS Affiliation Letter File Link / Path</label>
                <input 
                  type="text" 
                  value={muhsAffiliation}
                  onChange={(e) => setMuhsAffiliation(e.target.value)}
                  placeholder="/downloads/muhs-affiliation.pdf"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-950 px-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Visitor Counter Base Count</label>
                <input 
                  type="number" 
                  value={visitorCount}
                  onChange={(e) => setVisitorCount(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-950 px-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="flex items-center gap-1.5 rounded-xl bg-teal-500 py-3 px-6 text-xs font-bold text-slate-950 hover:bg-teal-400 disabled:opacity-50 cursor-pointer"
              >
                <Save className="h-4 w-4" />
                Save Accreditations
              </button>
            </form>
          </div>
        )}

        {/* VIEW 6: AUTHORITIES SETTINGS */}
        {activeTab === 'authorities' && (
          <div className="space-y-6">
            {showAuthCropper && (
              <ImageCropper
                file={authFile}
                onCrop={handleAuthCropDone}
                onCancel={() => setShowAuthCropper(false)}
              />
            )}

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-800 dark:text-slate-200">Institutional Hierarchy & Leadership Roster</h2>
                <p className="text-xs text-slate-500 mt-1">Manage Governor, Chief Minister, Ministers, Directors, and Leadership hierarchy displayed on the homepage.</p>
              </div>
              <button 
                onClick={() => { handleCancelEditAuth(); setAddingAuth(true); }} 
                className="flex items-center gap-1.5 rounded-xl bg-teal-500 px-3.5 py-2 text-xs font-bold text-slate-950 hover:bg-teal-400"
              >
                <Plus className="h-3.5 w-3.5" /> Add Leader
              </button>
            </div>

            {addingAuth && (
              <form onSubmit={handleAddAuthority} className="rounded-3xl border border-teal-500/20 bg-teal-500/5 p-5 space-y-4 max-w-3xl">
                <div className="flex items-center justify-between border-b border-slate-250 pb-3">
                  <h3 className="text-xs font-bold uppercase text-teal-600">
                    {editingAuthName ? `Edit Authority Member: ${editingAuthName}` : 'Add New Authority / Leadership Official'}
                  </h3>
                  <button type="button" onClick={handleCancelEditAuth} className="text-slate-500 hover:text-slate-850"><X className="h-4 w-4" /></button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Leader Name</label>
                    <input 
                      type="text" 
                      value={authName} 
                      onChange={e => setAuthName(e.target.value)} 
                      placeholder="e.g. Shri. Acharya Devvrat"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none" 
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Designation / Role Title</label>
                    <input 
                      type="text" 
                      value={authDesignation} 
                      onChange={e => setAuthDesignation(e.target.value)} 
                      placeholder="e.g. Hon'ble Governor, Maharashtra State"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none" 
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 items-end">
                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Category Hierarchy</label>
                    <select 
                      value={authCategory} 
                      onChange={e => setAuthCategory(e.target.value as any)} 
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs focus:outline-none"
                    >
                      <option value="minister">Minister (Homepage level 1/2)</option>
                      <option value="authority">Administration Authority (Homepage level 3)</option>
                      <option value="leadership">Secretary / Leadership (Homepage level 4)</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <label className="mb-1.5 block text-[10px] font-bold text-slate-650 dark:text-slate-400 uppercase">Profile Photo (Max 2MB)</label>
                      <div className="relative">
                        <input type="file" accept="image/*" onChange={handleAuthFileChange} className="hidden" id="auth-photo-input" />
                        <label htmlFor="auth-photo-input" className="flex items-center justify-center gap-2 rounded-xl border border-slate-250 bg-white px-3 py-2.5 text-xs font-semibold text-slate-650 hover:bg-slate-50 cursor-pointer">
                          <Camera className="h-3.5 w-3.5 text-slate-450" /> Select & Adjust Image
                        </label>
                      </div>
                    </div>

                    {authPhotoUrl && (
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-teal-500/20 shadow">
                        <img src={authPhotoUrl} className="h-full w-full object-cover" />
                        <button type="button" onClick={() => setAuthPhotoUrl('')} className="absolute inset-0 bg-black/40 flex items-center justify-center text-white"><X className="h-3.5 w-3.5" /></button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end pt-2 gap-2">
                  <button type="button" onClick={handleCancelEditAuth} className="rounded-xl border border-slate-250 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer">Cancel</button>
                  <button type="submit" disabled={isPending} className="rounded-xl bg-teal-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-teal-400 cursor-pointer">
                    {editingAuthName ? 'Save Changes' : 'Save Leader'}
                  </button>
                </div>
              </form>
            )}

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {authorities.map((item, index) => (
                <div key={index} className="group relative rounded-2xl border border-slate-200 bg-white p-4 flex items-center gap-3">
                  <div className="absolute top-3 right-3 hidden gap-1.5 group-hover:flex z-20">
                    <button type="button" onClick={() => handleStartEditAuth(item)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-teal-500/20 bg-teal-500/5 text-teal-600 hover:bg-teal-500/10 cursor-pointer"><Edit2 className="h-4 w-4" /></button>
                    <button type="button" onClick={() => handleDeleteAuthority(item.name)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-rose-500/20 bg-rose-500/5 text-rose-600 hover:bg-rose-500/10 cursor-pointer"><Trash2 className="h-4 w-4" /></button>
                  </div>
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    ) : (
                      <User className="h-5 w-5 text-slate-400" />
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <h5 className="font-bold text-slate-800 pr-10 text-xs truncate">{item.name}</h5>
                    <p className="text-[10px] text-teal-600 font-semibold uppercase tracking-wider">{item.category}</p>
                    <p className="text-[10px] text-slate-500 truncate leading-snug">{item.designation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* VIEW 7: SECURITY & BACKUPS */}
        {activeTab === 'security' && (
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 p-6 shadow-2xl backdrop-blur-md space-y-8">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-600 shadow-inner">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Security & Backups</h3>
                  <p className="text-sm font-medium text-slate-500">Manage admin credentials and download database backups.</p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <FileUp className="h-5 w-5 text-teal-600" />
                  <h4 className="font-bold text-slate-800">Export Database Backup</h4>
                </div>
                <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                  Download a complete <code>.tar.gz</code> archive of your entire database, including all JSON data files and uploaded faculty images. You can use this to sync production data back to your local development environment.
                </p>
                <button 
                  onClick={() => window.location.href = '/api/backup'}
                  className="flex items-center justify-center gap-2 w-full rounded-xl bg-teal-500 px-4 py-3 text-sm font-bold text-slate-950 hover:bg-teal-400 transition-colors shadow-lg shadow-teal-500/20"
                >
                  <Download className="h-4 w-4" /> Download Backup Archive
                </button>
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <RestoreBackupButton />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
