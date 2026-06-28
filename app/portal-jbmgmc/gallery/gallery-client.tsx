'use client'

import React, { useState, useRef } from 'react'
import { 
  Image as ImageIcon, 
  Upload, 
  Trash2, 
  Folder, 
  Tag, 
  FileImage,
  Loader2,
  X,
  Plus,
  Video,
  FileText,
  Calendar,
  Layers,
  Youtube,
  Play
} from 'lucide-react'
import { 
  addGalleryImageAction, 
  deleteGalleryImageAction,
  addEventAlbumAction,
  deleteEventAlbumAction,
  updateEventAlbumAction
} from './actions'
import { toast } from 'sonner'
import { GalleryImage, EventBlogItem } from '@/lib/db'

interface GalleryClientProps {
  initialImages: GalleryImage[]
  initialAlbums: EventBlogItem[]
}

export default function GalleryClient({ initialImages, initialAlbums }: GalleryClientProps) {
  const [activeMainTab, setActiveMainTab] = useState<'gallery' | 'albums'>('gallery')
  
  // ── Tab 1: Photo Gallery State ───────────────────────────────────────────────
  const [images, setImages] = useState<GalleryImage[]>(initialImages)
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [visiblePhotos, setVisiblePhotos] = useState(12)
  
  const [isPendingImg, setIsPendingImg] = useState(false)
  const [selectedFileImg, setSelectedFileImg] = useState<File | null>(null)
  const [filePreviewImg, setFilePreviewImg] = useState<string | null>(null)
  const [imgTitle, setImgTitle] = useState('')
  const [imgCategory, setImgCategory] = useState('campus')
  const [imgAlt, setImgAlt] = useState('')
  const fileInputRefImg = useRef<HTMLInputElement>(null)
  
  // New YouTube States
  const [uploadType, setUploadType] = useState<'image'|'youtube'>('image')
  const [imgYoutubeUrl, setImgYoutubeUrl] = useState('')
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)

  // ── Tab 2: Event Albums State ────────────────────────────────────────────────
  const [albums, setAlbums] = useState<EventBlogItem[]>(initialAlbums)
  const [currentPageAlbums, setCurrentPageAlbums] = useState(1)
  const ALBUMS_PER_PAGE = 8
  const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false)
  const [editingAlbumId, setEditingAlbumId] = useState<number | null>(null)
  const [isPendingAlbum, setIsPendingAlbum] = useState(false)
  
  const [albumTitle, setAlbumTitle] = useState('')
  const [albumDate, setAlbumDate] = useState(() => {
    const today = new Date()
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  })
  const [albumDesc, setAlbumDesc] = useState('')
  const [albumVideoUrl, setAlbumVideoUrl] = useState('')
  const [albumPhotos, setAlbumPhotos] = useState<File[]>([])
  const [existingPhotos, setExistingPhotos] = useState<string[]>([])
  
  const albumPhotoInputRef = useRef<HTMLInputElement>(null)

  // ── Delete Confirmation Modal State ────────────────────────────────────────────
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    type: 'image' | 'album';
    id: number;
    title: string;
    photosCount?: number;
    photos?: string[];
  } | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // ── Tab 1 Logic ──────────────────────────────────────────────────────────────
  const handleFileChangeImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 8 * 1024 * 1024) return toast.error('Image size must be under 8MB')
    setSelectedFileImg(file)
    setFilePreviewImg(URL.createObjectURL(file))
    if (!imgTitle) {
      const cleanName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name
      setImgTitle(cleanName.replace(/[-_]+/g, ' '))
    }
  }

  const handleCancelPreviewImg = () => {
    setSelectedFileImg(null)
    setFilePreviewImg(null)
    setImgTitle('')
    setImgAlt('')
    setImgYoutubeUrl('')
  }

  const extractYoutubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i)
    return match ? match[1] : null
  }

  const handleUploadImg = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!imgTitle.trim()) return toast.error('Please specify a title')
    if (!imgCategory.trim()) return toast.error('Please specify a category')

    setIsPendingImg(true)
    try {
      let finalImageUrl = ''
      let finalYoutubeUrl = ''
      
      if (uploadType === 'youtube') {
        if (!imgYoutubeUrl.trim()) throw new Error('Please enter a YouTube URL')
        const yId = extractYoutubeId(imgYoutubeUrl)
        if (!yId) throw new Error('Invalid YouTube URL')
        finalImageUrl = `https://img.youtube.com/vi/${yId}/hqdefault.jpg`
        finalYoutubeUrl = imgYoutubeUrl
      } else {
        if (!selectedFileImg) throw new Error('Please select an image file first')
        const formData = new FormData()
        formData.append('file', selectedFileImg)
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
        const uploadData = await uploadRes.json()
        if (!uploadRes.ok || !uploadData.success) throw new Error(uploadData.error || 'Failed to upload photo')
        finalImageUrl = uploadData.url
      }

      const recordItem = {
        title: imgTitle,
        category: imgCategory.trim(),
        image: finalImageUrl,
        alt: imgAlt.trim() || imgTitle,
        type: uploadType,
        youtubeUrl: finalYoutubeUrl || undefined
      }
      
      const dbRes = await addGalleryImageAction(recordItem)
      if (dbRes.success) {
        toast.success(`Successfully added "${imgTitle}"`)
        setImages([{ id: Date.now(), ...recordItem } as any, ...images])
        handleCancelPreviewImg()
      } else {
        toast.error('Failed to register image in database')
      }
    } catch (err: any) {
      toast.error(err.message || 'An error occurred during upload')
    } finally {
      setIsPendingImg(false)
    }
  }

  const handleDeleteImg = (id: number, title: string) => {
    setDeleteConfirm({ isOpen: true, type: 'image', id, title })
  }

  // ── Tab 2 Logic ──────────────────────────────────────────────────────────────
  const resetAlbumForm = () => {
    setEditingAlbumId(null)
    setAlbumTitle('')
    const today = new Date()
    setAlbumDate(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`)
    setAlbumDesc('')
    setAlbumVideoUrl('')
    setAlbumPhotos([])
    setExistingPhotos([])
  }

  const handleOpenEditAlbum = (album: EventBlogItem) => {
    setEditingAlbumId(album.id)
    setAlbumTitle(album.title)
    setAlbumDate(album.date)
    setAlbumDesc(album.content)
    setAlbumVideoUrl(album.youtubeVideoUrl || '')
    setAlbumPhotos([])
    setExistingPhotos(album.photos || [])
    setIsAlbumModalOpen(true)
  }

  const handleAlbumPhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      // Check sizes
      for (const f of filesArray) {
        if (f.size > 8 * 1024 * 1024) {
          toast.error(`File ${f.name} is too large. Max 8MB.`)
          return
        }
      }
      setAlbumPhotos(prev => [...prev, ...filesArray])
    }
  }

  const handleRemoveNewPhoto = (index: number) => {
    setAlbumPhotos(prev => prev.filter((_, i) => i !== index))
  }
  
  const handleRemoveExistingPhoto = (url: string) => {
    setExistingPhotos(prev => prev.filter(p => p !== url))
  }

  const handleSaveAlbum = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!albumTitle.trim() || !albumDate) return toast.error('Title and Date are required')
    if (existingPhotos.length === 0 && albumPhotos.length === 0) return toast.error('Please add at least one photo to the album')

    setIsPendingAlbum(true)
    try {
      // 1. Upload new photos
      const uploadedUrls: string[] = []
      for (const file of albumPhotos) {
        const formData = new FormData()
        formData.append('file', file)
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
        if (!uploadRes.ok) throw new Error(`Failed to upload ${file.name}`)
        const data = await uploadRes.json()
        uploadedUrls.push(data.url)
      }

      const finalPhotos = [...existingPhotos, ...uploadedUrls]
      
      const albumData = {
        title: albumTitle,
        date: albumDate,
        content: albumDesc,
        photos: finalPhotos,
        youtubeVideoUrl: albumVideoUrl.trim() || undefined
      }

      if (editingAlbumId) {
        // Update
        const dbRes = await updateEventAlbumAction(editingAlbumId, albumData)
        if (dbRes.success) {
          toast.success('Album updated')
          setAlbums(albums.map(a => a.id === editingAlbumId ? { id: editingAlbumId, ...albumData } : a))
          setIsAlbumModalOpen(false)
        } else throw new Error('DB Error')
      } else {
        // Create
        const dbRes = await addEventAlbumAction(albumData)
        if (dbRes.success) {
          toast.success('Album created successfully')
          setAlbums([{ id: Date.now(), ...albumData }, ...albums])
          setIsAlbumModalOpen(false)
        } else throw new Error('DB Error')
      }
    } catch (err: any) {
      toast.error(err.message || 'An error occurred saving the album')
    } finally {
      setIsPendingAlbum(false)
    }
  }

  const handleDeleteAlbum = (id: number, title: string, photos: string[]) => {
    setDeleteConfirm({ isOpen: true, type: 'album', id, title, photosCount: photos.length, photos })
  }

  const executeDelete = async () => {
    if (!deleteConfirm) return
    setIsDeleting(true)
    
    try {
      if (deleteConfirm.type === 'image') {
        const res = await deleteGalleryImageAction(deleteConfirm.id)
        if (res.success) {
          toast.success('Photograph removed successfully')
          setImages(images.filter(img => img.id !== deleteConfirm.id))
        } else throw new Error('Failed to remove photograph')
      } else if (deleteConfirm.type === 'album') {
        const res = await deleteEventAlbumAction(deleteConfirm.id, deleteConfirm.photos || [])
        if (res.success) {
          toast.success('Album deleted successfully')
        setAlbums(albums.filter(a => a.id !== deleteConfirm.id))
          // Adjust pagination if the last item on a page is deleted
          const newTotalPages = Math.ceil((albums.length - 1) / ALBUMS_PER_PAGE)
          if (currentPageAlbums > newTotalPages && newTotalPages > 0) {
            setCurrentPageAlbums(newTotalPages)
          }
        } else throw new Error('Failed to delete album')
      }
      setDeleteConfirm(null)
    } catch (e: any) {
      toast.error(e?.message || 'An error occurred during deletion')
    } finally {
      setIsDeleting(false)
    }
  }

  // ── Render Helpers ───────────────────────────────────────────────────────────
  const filteredImages = images.filter(img => activeCategory === 'all' || img.category === activeCategory)
  
  // Dynamically compute unique categories from images and add Medical defaults
  const existingCats = Array.from(new Set(images.map(img => img.category))).filter(Boolean)
  const medicalDefaults = [
    "Campus & Buildings", "Academics & Classrooms", "Clinical & Hospital", 
    "OPD & Wards", "Operation Theatre (OT)", "Blood Bank", 
    "Laboratories", "Hostel & Mess", "Central Library", 
    "Conferences & CME", "Sports & Athletics", "Cultural Events", "Convocation"
  ]
  const allDropdownOptions = Array.from(new Set([...existingCats, ...medicalDefaults]))
  
  const galleryCategories = [
    { value: 'all', label: 'Show All' },
    ...existingCats.map(cat => ({
      value: cat,
      // Capitalize first letter and replace hyphens/underscores for label
      label: cat.charAt(0).toUpperCase() + cat.slice(1).replace(/[-_]/g, ' ')
    }))
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">Gallery & Albums</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Manage general category photos and dedicated event photo albums.
        </p>
      </div>

      {/* Main Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveMainTab('gallery')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeMainTab === 'gallery' 
              ? 'border-teal-500 text-teal-600 dark:text-teal-400' 
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <ImageIcon className="inline-block w-4 h-4 mr-2" />
          Photo Gallery
        </button>
        <button
          onClick={() => setActiveMainTab('albums')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeMainTab === 'albums' 
              ? 'border-teal-500 text-teal-600 dark:text-teal-400' 
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Layers className="inline-block w-4 h-4 mr-2" />
          Event Albums
        </button>
      </div>

      {/* =========================================================================
          TAB 1: PHOTO GALLERY
          ========================================================================= */}
      {activeMainTab === 'gallery' && (
        <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Uploader Sidebar */}
          <div className="w-full lg:w-[350px] shrink-0">
            <div className="sticky top-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Upload className="w-5 h-5 text-teal-500" /> Add to Gallery
                </h2>
              </div>

              {/* Upload Type Toggle */}
              <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-6">
                <button
                  onClick={() => { setUploadType('image'); handleCancelPreviewImg(); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-lg transition-all ${uploadType === 'image' ? 'bg-white dark:bg-slate-700 text-teal-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                  <ImageIcon className="w-4 h-4" /> Photo
                </button>
                <button
                  onClick={() => { setUploadType('youtube'); handleCancelPreviewImg(); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-lg transition-all ${uploadType === 'youtube' ? 'bg-white dark:bg-slate-700 text-rose-500 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                  <Youtube className="w-4 h-4" /> YouTube
                </button>
              </div>

              <form onSubmit={handleUploadImg} className="space-y-5">
                {uploadType === 'image' && (
                  !filePreviewImg ? (
                    <div 
                      onClick={() => fileInputRefImg.current?.click()}
                      className="group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/50 py-12 px-4 text-center cursor-pointer hover:border-teal-500 hover:bg-teal-50/50 transition-all duration-300"
                    >
                      <input type="file" ref={fileInputRefImg} onChange={handleFileChangeImg} accept="image/*" className="hidden" />
                      <div className="h-12 w-12 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 group-hover:text-teal-500 transition-all duration-300">
                        <Upload className="h-6 w-6 text-slate-400 group-hover:text-teal-500" />
                      </div>
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Click or Drag to Upload</p>
                      <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider font-semibold">Max Size: 8MB</p>
                    </div>
                  ) : (
                    <div className="relative overflow-hidden rounded-2xl border-2 border-teal-500/30 shadow-lg group">
                      <button type="button" onClick={handleCancelPreviewImg} className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-rose-500 transition-colors z-10">
                        <X className="w-4 h-4" />
                      </button>
                      <img src={filePreviewImg} alt="Preview" className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                  )
                )}

                {uploadType === 'youtube' && (
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">YouTube Link</label>
                    <input 
                      type="url" 
                      value={imgYoutubeUrl} 
                      onChange={e => {
                        setImgYoutubeUrl(e.target.value)
                        // Auto-extract title or thumbnail preview could be done here, but we'll extract on save.
                      }} 
                      placeholder="https://youtube.com/watch?v=..." 
                      className="w-full mt-1.5 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-sm font-medium focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none transition-all" 
                    />
                    {imgYoutubeUrl && extractYoutubeId(imgYoutubeUrl) && (
                      <div className="mt-4 relative overflow-hidden rounded-xl border-2 border-slate-200 dark:border-slate-800 shadow-sm group">
                        <img src={`https://img.youtube.com/vi/${extractYoutubeId(imgYoutubeUrl)}/hqdefault.jpg`} alt="YT Preview" className="h-32 w-full object-cover opacity-80" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Play className="w-10 h-10 text-white drop-shadow-md" fill="currentColor" />
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Photo/Video Title</label>
                    <input type="text" value={imgTitle} onChange={e => setImgTitle(e.target.value)} placeholder="e.g. Main Entrance" className="w-full mt-1.5 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-sm font-medium focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Category</label>
                    {/* Custom Styled Combobox */}
                    <div className="relative">
                      <input 
                        type="text" 
                        value={imgCategory} 
                        onChange={e => {
                          setImgCategory(e.target.value)
                          setShowCategoryDropdown(true)
                        }} 
                        onFocus={() => setShowCategoryDropdown(true)}
                        onBlur={() => setTimeout(() => setShowCategoryDropdown(false), 200)}
                        placeholder="Select or type new category..."
                        className="w-full mt-1.5 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-sm font-medium focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all" 
                      />
                      {showCategoryDropdown && (
                        <div className="absolute z-[100] w-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl max-h-56 overflow-y-auto animate-in fade-in slide-in-from-top-2">
                          {allDropdownOptions
                            .filter(cat => cat.toLowerCase().includes(imgCategory.toLowerCase()))
                            .map((cat, idx) => (
                            <div 
                              key={idx} 
                              onClick={() => { setImgCategory(cat); setShowCategoryDropdown(false); }}
                              className="px-4 py-3 hover:bg-teal-50 dark:hover:bg-teal-500/10 hover:text-teal-600 dark:hover:text-teal-400 cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800 last:border-0 transition-colors"
                            >
                              {cat}
                            </div>
                          ))}
                          {imgCategory && !allDropdownOptions.some(c => c.toLowerCase() === imgCategory.toLowerCase()) && (
                             <div className="px-4 py-3 text-sm font-medium text-teal-600 dark:text-teal-400 bg-teal-50/50 dark:bg-teal-500/5">
                               Create new: "{imgCategory}"
                             </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <button type="submit" disabled={isPendingImg || (uploadType === 'image' ? selectedFileImg === null : imgYoutubeUrl.trim() === '')} className={`w-full py-3.5 rounded-xl text-white font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:shadow-none ${uploadType === 'youtube' ? 'bg-gradient-to-r from-rose-500 to-red-500 hover:shadow-lg hover:shadow-rose-500/25' : 'bg-gradient-to-r from-teal-500 to-emerald-500 hover:shadow-lg hover:shadow-teal-500/25'}`}>
                  {isPendingImg ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Upload className="w-4 h-4" /> {uploadType === 'youtube' ? 'Add Video' : 'Upload Now'}</>}
                </button>
              </form>
            </div>
          </div>

          {/* Grid Right */}
          <div className="flex-1 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xl min-h-[500px]">
            <div className="flex flex-wrap gap-2 mb-8">
              {galleryCategories.map(c => (
                <button
                  key={c.value}
                  onClick={() => setActiveCategory(c.value)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                    activeCategory === c.value 
                      ? 'bg-teal-500 border-teal-500 text-white shadow-md' 
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 hover:border-teal-500 hover:text-teal-600'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
            
            <div className="columns-2 sm:columns-3 xl:columns-4 gap-6 space-y-6 pb-8">
              {filteredImages.length > 0 ? filteredImages.slice(0, visiblePhotos).map((img, idx) => (
                <div key={img.id} className="break-inside-avoid group relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-sm border border-slate-200/60 dark:border-slate-700/60 hover:shadow-xl hover:-translate-y-1 hover:border-teal-500/30 transition-all duration-300">
                  <img src={img.image} alt={img.alt} className="w-full h-auto object-cover" loading="lazy" />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
                    {/* Play Icon for Videos */}
                    {(img as any).type === 'youtube' && (
                      <div className="absolute inset-0 flex items-center justify-center mb-8">
                        <Play className="w-12 h-12 text-white/90 drop-shadow-lg" fill="currentColor" />
                      </div>
                    )}
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 relative z-10">
                      <p className="text-white text-sm font-bold line-clamp-2 leading-tight mb-1">{img.title}</p>
                      <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-teal-500/30 text-teal-200 border border-teal-500/40 backdrop-blur-sm">
                        {img.category}
                      </span>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                    <button onClick={() => handleDeleteImg(img.id, img.title)} className="p-2 rounded-xl bg-white/10 hover:bg-rose-500 text-white backdrop-blur-md transition-colors shadow-sm border border-white/20">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )) : (
                <div className="col-span-full py-32 flex flex-col items-center justify-center text-center text-slate-400">
                  <ImageIcon className="w-16 h-16 mb-4 opacity-20" />
                  <p className="text-lg font-bold text-slate-500">No photos found</p>
                  <p className="text-sm mt-1">Upload a photo to this category to see it here.</p>
                </div>
              )}
            </div>
            
            {/* Photo Gallery Pagination */}
            {filteredImages.length > visiblePhotos && (
              <div className="flex justify-center mt-6 pb-6">
                <button
                  onClick={() => setVisiblePhotos(prev => prev + 12)}
                  className="px-6 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm transition-colors shadow-sm"
                >
                  Load More Photos
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: EVENT ALBUMS
          ========================================================================= */}
      {activeMainTab === 'albums' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
          <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div>
              <h2 className="font-bold text-slate-900 dark:text-slate-100">Event Photo Albums</h2>
              <p className="text-xs text-slate-500">Create collections of photos for specific events.</p>
            </div>
            <button
              onClick={() => { resetAlbumForm(); setIsAlbumModalOpen(true); }}
              className="flex items-center gap-2 bg-teal-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-teal-600 transition-colors"
            >
              <Plus className="w-4 h-4" /> Create Album
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {albums.slice((currentPageAlbums - 1) * ALBUMS_PER_PAGE, currentPageAlbums * ALBUMS_PER_PAGE).map(album => (
              <div key={album.id} className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all">
                <div className="relative h-48 bg-slate-100 dark:bg-slate-800">
                  {album.photos && album.photos.length > 0 ? (
                    <img src={album.photos[0]} className="w-full h-full object-cover" alt="Album Cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400"><ImageIcon className="w-8 h-8 opacity-50" /></div>
                  )}
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs px-2 py-1 rounded-lg font-medium flex items-center gap-1">
                    <ImageIcon className="w-3.5 h-3.5" /> {album.photos?.length || 0}
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1">{album.title}</h3>
                  <div className="flex items-center text-xs text-slate-500 mt-1 gap-2">
                    <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {album.date}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 line-clamp-2">{album.content || 'No description provided.'}</p>
                  
                  <div className="mt-auto pt-4 flex gap-2">
                    <button onClick={() => handleOpenEditAlbum(album)} className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-900/30 text-slate-700 dark:text-slate-300 hover:text-teal-600 transition-colors py-2 rounded-lg text-xs font-semibold">
                      Edit Album
                    </button>
                    <button onClick={() => handleDeleteAlbum(album.id, album.title, album.photos || [])} className="px-3 bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 text-slate-500 hover:text-rose-600 transition-colors rounded-lg flex items-center justify-center">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {albums.length === 0 && (
              <div className="col-span-full py-20 text-center text-slate-500 bg-white dark:bg-slate-900 rounded-2xl border border-dashed">
                No event albums yet. Create one to get started.
              </div>
            )}
          </div>
          
          {/* Event Albums Page Pagination */}
          {albums.length > ALBUMS_PER_PAGE && (
            <div className="flex items-center justify-center gap-2 mt-8 pb-8">
              <button
                onClick={() => setCurrentPageAlbums(prev => Math.max(1, prev - 1))}
                disabled={currentPageAlbums === 1}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:hover:bg-white transition-colors"
              >
                Previous
              </button>
              
              <div className="flex items-center gap-1 mx-2">
                {Array.from({ length: Math.ceil(albums.length / ALBUMS_PER_PAGE) }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPageAlbums(i + 1)}
                    className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${
                      currentPageAlbums === i + 1 
                        ? 'bg-teal-500 text-white shadow-md' 
                        : 'bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPageAlbums(prev => Math.min(Math.ceil(albums.length / ALBUMS_PER_PAGE), prev + 1))}
                disabled={currentPageAlbums === Math.ceil(albums.length / ALBUMS_PER_PAGE)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:hover:bg-white transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          ALBUM MODAL
          ========================================================================= */}
      {isAlbumModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {editingAlbumId ? 'Edit Event Album' : 'Create Event Album'}
              </h2>
              <button onClick={() => setIsAlbumModalOpen(false)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            <form onSubmit={handleSaveAlbum} className="flex-1 overflow-y-auto p-6">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Album Metadata */}
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm border-b pb-2">Album Details</h3>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Event Title <span className="text-rose-500">*</span></label>
                    <input type="text" value={albumTitle} onChange={e => setAlbumTitle(e.target.value)} required placeholder="e.g. Annual Convocation 2025" className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Event Date <span className="text-rose-500">*</span></label>
                    <input type="date" value={albumDate} onChange={e => setAlbumDate(e.target.value)} required className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Description / Highlights</label>
                    <textarea value={albumDesc} onChange={e => setAlbumDesc(e.target.value)} rows={3} placeholder="Brief summary of the event..." className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all resize-none" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">YouTube Video Link (Optional)</label>
                    <div className="relative">
                      <Video className="absolute top-3 left-3 w-4 h-4 text-slate-400" />
                      <input type="url" value={albumVideoUrl} onChange={e => setAlbumVideoUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." className="w-full mt-1 py-2.5 pl-9 pr-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all" />
                    </div>
                  </div>
                </div>

                {/* Album Photos */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm">Photos</h3>
                    <button type="button" onClick={() => albumPhotoInputRef.current?.click()} className="text-xs font-bold text-teal-600 bg-teal-50 hover:bg-teal-100 px-3 py-1 rounded-lg transition-colors">
                      + Add Photos
                    </button>
                    <input type="file" multiple accept="image/*" ref={albumPhotoInputRef} onChange={handleAlbumPhotosChange} className="hidden" />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 max-h-[300px] overflow-y-auto p-1">
                    {existingPhotos.map((url, i) => (
                      <div key={`ex-${i}`} className="relative aspect-square rounded-lg overflow-hidden group border border-slate-200">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button type="button" onClick={() => handleRemoveExistingPhoto(url)} className="p-1.5 bg-rose-500 text-white rounded-full hover:bg-rose-600"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))}
                    {albumPhotos.map((file, i) => (
                      <div key={`new-${i}`} className="relative aspect-square rounded-lg overflow-hidden group border-2 border-teal-500/50">
                        <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover opacity-80" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button type="button" onClick={() => handleRemoveNewPhoto(i)} className="p-1.5 bg-rose-500 text-white rounded-full hover:bg-rose-600"><Trash2 className="w-4 h-4" /></button>
                        </div>
                        <span className="absolute top-1 left-1 bg-teal-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">NEW</span>
                      </div>
                    ))}
                    {existingPhotos.length === 0 && albumPhotos.length === 0 && (
                      <div className="col-span-3 py-12 flex flex-col items-center justify-center border-2 border-dashed rounded-xl border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-400">
                        <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                        <p className="text-xs">No photos added yet.</p>
                        <p className="text-[10px] mt-1">Click "+ Add Photos" to select multiple images.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </form>
            
            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex justify-end gap-3">
              <button type="button" onClick={() => setIsAlbumModalOpen(false)} className="px-5 py-2.5 rounded-xl font-semibold text-sm text-slate-600 hover:bg-slate-200 transition-colors">
                Cancel
              </button>
              <button type="button" onClick={handleSaveAlbum} disabled={isPendingAlbum} className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm bg-teal-500 text-white hover:bg-teal-600 shadow-md shadow-teal-500/20 disabled:opacity-50 transition-all">
                {isPendingAlbum ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {editingAlbumId ? 'Save Changes' : 'Create Album'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          DELETE CONFIRMATION MODAL
          ========================================================================= */}
      {deleteConfirm && deleteConfirm.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-200">
            <div className="p-6 md:p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center mb-6">
                <Trash2 className="w-8 h-8 text-rose-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Delete {deleteConfirm.type === 'album' ? 'Album' : 'Photo'}?
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                Are you sure you want to delete <span className="font-semibold text-slate-700 dark:text-slate-300">"{deleteConfirm.title}"</span>?
              </p>
              {deleteConfirm.type === 'album' && (
                <p className="text-xs font-medium text-rose-500 bg-rose-50 dark:bg-rose-500/10 px-3 py-1.5 rounded-lg mt-3 border border-rose-100 dark:border-rose-500/20">
                  ⚠️ This will permanently delete all {deleteConfirm.photosCount} photos inside this album.
                </p>
              )}
            </div>
            
            <div className="p-6 pt-0 flex gap-3">
              <button 
                type="button" 
                onClick={() => setDeleteConfirm(null)} 
                disabled={isDeleting}
                className="flex-1 px-5 py-3 rounded-xl font-semibold text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={executeDelete} 
                disabled={isDeleting}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm bg-rose-500 text-white hover:bg-rose-600 shadow-md shadow-rose-500/20 disabled:opacity-50 transition-all"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
