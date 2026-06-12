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
  X 
} from 'lucide-react'
import { addGalleryImageAction, deleteGalleryImageAction } from './actions'
import { toast } from 'sonner'
import { GalleryImage } from '@/lib/db'

interface GalleryClientProps {
  initialImages: GalleryImage[]
}

export default function GalleryClient({ initialImages }: GalleryClientProps) {
  const [images, setImages] = useState<GalleryImage[]>(initialImages)
  const [activeCategory, setActiveCategory] = useState<string>('all')
  
  // Upload & Form State
  const [isPending, setIsPending] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [imgTitle, setImgTitle] = useState('')
  const [imgCategory, setImgCategory] = useState<'campus' | 'academics' | 'hospital'>('campus')
  const [imgAlt, setImgAlt] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Limit to images under 8MB
    if (file.size > 8 * 1024 * 1024) {
      toast.error('Image size must be under 8MB')
      return
    }

    setSelectedFile(file)
    setFilePreview(URL.createObjectURL(file))
    
    // Auto-fill title with sanitized file name if empty
    if (!imgTitle) {
      const cleanName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name
      setImgTitle(cleanName.replace(/[-_]+/g, ' '))
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Only image uploads are permitted')
      return
    }

    if (file.size > 8 * 1024 * 1024) {
      toast.error('Image size must be under 8MB')
      return
    }

    setSelectedFile(file)
    setFilePreview(URL.createObjectURL(file))
    
    if (!imgTitle) {
      const cleanName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name
      setImgTitle(cleanName.replace(/[-_]+/g, ' '))
    }
  }

  const handleCancelPreview = () => {
    setSelectedFile(null)
    setFilePreview(null)
    setImgTitle('')
    setImgAlt('')
  }

  const handleUploadImage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) {
      toast.error('Please drag-and-drop or select an image file first')
      return
    }
    if (!imgTitle.trim()) {
      toast.error('Please specify a title for the photograph')
      return
    }

    setIsPending(true)
    const formData = new FormData()
    formData.append('file', selectedFile)

    try {
      // 1. Upload to dynamic backend API
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      const uploadData = await uploadRes.json()

      if (!uploadRes.ok || !uploadData.success) {
        throw new Error(uploadData.error || 'Failed to upload photo to server')
      }

      // 2. Invoke Server Action to write record to DB
      const recordItem = {
        title: imgTitle,
        category: imgCategory,
        image: uploadData.url,
        alt: imgAlt.trim() || imgTitle
      }
      
      const dbRes = await addGalleryImageAction(recordItem)
      if (dbRes.success) {
        toast.success(`Successfully uploaded "${imgTitle}"`)
        
        // Optimistic State Add
        const newImg: GalleryImage = {
          id: Date.now(), // temporary id
          ...recordItem
        }
        setImages(prev => [newImg, ...prev])

        // Reset Form
        handleCancelPreview()
      } else {
        toast.error('Failed to register image in database')
      }
    } catch (err: any) {
      toast.error(err.message || 'An error occurred during file upload')
    } finally {
      setIsPending(false)
    }
  }

  const handleDeleteImage = async (id: number, title: string) => {
    if (!confirm(`Are you sure you want to delete photograph: "${title}"?`)) return

    try {
      const res = await deleteGalleryImageAction(id)
      if (res.success) {
        toast.success('Photograph removed from gallery')
        setImages(prev => prev.filter(img => img.id !== id))
      } else {
        toast.error('Failed to remove photograph')
      }
    } catch (e) {
      toast.error('An error occurred')
    }
  }

  const filteredImages = images.filter(img => 
    activeCategory === 'all' || img.category === activeCategory
  )

  const categories = [
    { value: 'all', label: 'Show All' },
    { value: 'campus', label: 'Campus & Buildings' },
    { value: 'academics', label: 'Academics & Labs' },
    { value: 'hospital', label: 'Clinical & Hospital' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">Campus Gallery</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Upload and organize high-definition pictures displaying campus infrastructure, educational libraries, and operations.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* LEFT COLUMN: Premium File Uploader */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 p-6 shadow-2xl backdrop-blur-md lg:col-span-5 h-fit">
          <div className="mb-6 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <Upload className="h-4.5 w-4.5" />
            </div>
            <h2 className="text-base font-bold text-slate-250 font-sans">Upload Media</h2>
          </div>

          <form onSubmit={handleUploadImage} className="space-y-4">
            {/* Drag & Drop Zone */}
            {!filePreview ? (
              <div 
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-950/40 py-10 px-4 text-center cursor-pointer transition-all hover:border-teal-500/40 hover:bg-white/60 dark:bg-slate-950/60"
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 group-hover:scale-105 group-hover:text-teal-600 dark:text-teal-400 transition-all shadow-md">
                  <Upload className="h-6 w-6" />
                </div>
                <p className="mt-4 text-xs font-bold text-slate-600 dark:text-slate-350 tracking-wide uppercase">Drag & Drop Image</p>
                <p className="mt-1 text-[10px] text-slate-500">Supports JPEG, PNG, WEBP (Max 8MB)</p>
              </div>
            ) : (
              <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <button
                  type="button"
                  onClick={handleCancelPreview}
                  className="absolute top-2 right-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 dark:bg-slate-950/80 text-slate-500 dark:text-slate-450 hover:text-slate-900 dark:text-slate-100 hover:bg-white dark:bg-slate-950 ring-1 ring-slate-200 dark:ring-slate-800"
                >
                  <X className="h-4 w-4" />
                </button>
                <img 
                  src={filePreview} 
                  alt="Upload Preview" 
                  className="h-44 w-full object-cover opacity-80"
                />
                <div className="flex items-center gap-2 border-t border-slate-900 px-3 py-2 text-[10px] text-slate-500">
                  <FileImage className="h-4.5 w-4.5 text-teal-500" />
                  <span className="truncate">{selectedFile?.name}</span>
                </div>
              </div>
            )}

            {/* Title */}
            <div>
              <label className="mb-1.5 block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Photograph Title</label>
              <div className="relative">
                <ImageIcon className="absolute top-3 left-3 h-4 w-4 text-slate-550" />
                <input
                  type="text"
                  placeholder="e.g. Modern Pathology Laboratory"
                  value={imgTitle}
                  onChange={(e) => setImgTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-950 py-2.5 pl-9 pr-4 text-xs text-slate-800 dark:text-slate-200 focus:border-teal-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Category Dropdown */}
            <div>
              <label className="mb-1.5 block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Gallery Category</label>
              <div className="relative">
                <Folder className="absolute top-3 left-3 h-4 w-4 text-slate-550" />
                <select
                  value={imgCategory}
                  onChange={(e) => setImgCategory(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-950 py-2.5 pl-9 pr-4 text-xs text-slate-800 dark:text-slate-200 focus:border-teal-500 focus:outline-none"
                >
                  <option value="campus">Campus & Buildings</option>
                  <option value="academics">Academics & Labs</option>
                  <option value="hospital">Clinical & Hospital</option>
                </select>
              </div>
            </div>

            {/* Alt Description */}
            <div>
              <label className="mb-1.5 block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Alternate Tag Description (SEO)</label>
              <div className="relative">
                <Tag className="absolute top-3 left-3 h-4 w-4 text-slate-550" />
                <input
                  type="text"
                  placeholder="Provide brief SEO descriptive text..."
                  value={imgAlt}
                  onChange={(e) => setImgAlt(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-950 py-2.5 pl-9 pr-4 text-xs text-slate-800 dark:text-slate-200 focus:border-teal-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending || !selectedFile}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-teal-500 py-3 text-xs font-bold text-slate-950 hover:bg-teal-400 disabled:opacity-50 cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-slate-950" />
                  Uploading Assets...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Upload Photo
                </>
              )}
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: Filterable Image Grid */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 p-6 shadow-2xl backdrop-blur-md lg:col-span-7 h-fit">
          {/* Category Filter Pills */}
          <div className="mb-6 flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c.value}
                onClick={() => setActiveCategory(c.value)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold tracking-wide transition-all ${
                  activeCategory === c.value
                    ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/10'
                    : 'bg-white/60 dark:bg-slate-950/60 text-slate-600 dark:text-slate-400 ring-1 ring-slate-850 hover:text-slate-800 dark:text-slate-200'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Photo Grid */}
          <div className="grid gap-4 sm:grid-cols-2 max-h-[500px] overflow-y-auto pr-1">
            {filteredImages.length > 0 ? (
              filteredImages.map((img) => (
                <div 
                  key={img.id}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-850 bg-white/40 dark:bg-slate-950/40"
                >
                  <img 
                    src={img.image} 
                    alt={img.alt} 
                    className="h-40 w-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-102 transition-all duration-300"
                  />
                  {/* Category Pill Tag */}
                  <span className="absolute top-3 left-3 rounded-lg bg-white/85 dark:bg-slate-950/85 px-2 py-1 text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest ring-1 ring-slate-200 dark:ring-slate-800">
                    {img.category}
                  </span>
                  
                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteImage(img.id, img.title)}
                    className="absolute top-3 right-3 hidden h-8 w-8 items-center justify-center rounded-lg border border-rose-500/20 bg-rose-500/80 text-slate-950 hover:bg-rose-500 group-hover:flex"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  <div className="border-t border-slate-900 bg-white/80 dark:bg-slate-950/80 p-3">
                    <h4 className="truncate text-xs font-bold text-slate-800 dark:text-slate-200">{img.title}</h4>
                    <p className="mt-1 truncate text-[10px] text-slate-500">{img.alt}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 py-24 text-center text-xs text-slate-500 sm:col-span-2">
                No photographs found in this category.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
