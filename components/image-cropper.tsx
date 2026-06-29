'use client'

import React, { useState, useEffect, useRef } from 'react'
import { ZoomIn, RotateCw, X, Check, FileWarning, Move } from 'lucide-react'
import { toast } from 'sonner'

interface ImageCropperProps {
  file: File | null
  onCrop: (croppedFile: File) => void
  onCancel: () => void
  aspectRatio?: number // default 1 (square)
  circleOverlay?: boolean // default true (rounds the viewport mask)
}

export default function ImageCropper({
  file,
  onCrop,
  onCancel,
  aspectRatio = 1,
  circleOverlay = true
}: ImageCropperProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1.0)
  const [rotation, setRotation] = useState(0)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [isProcessing, setIsProcessing] = useState(false)
  
  const imgRef = useRef<HTMLImageElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!file) return

    // Enforce 2MB size limit on select
    const maxSize = 2 * 1024 * 1024 // 2MB
    if (file.size > maxSize) {
      toast.error(`File is too large (${(file.size / 1024 / 1024).toFixed(2)} MB). Please select a file under 2 MB.`)
      onCancel()
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setImageSrc(reader.result as string)
      setZoom(1.0)
      setOffset({ x: 0, y: 0 })
      setRotation(0)
    }
    reader.readAsDataURL(file)
  }, [file, onCancel])

  if (!imageSrc) return null

  // Mouse / Touch drag handlers
  const handleStartDrag = (clientX: number, clientY: number) => {
    setIsDragging(true)
    setDragStart({ x: clientX - offset.x, y: clientY - offset.y })
  }

  const handleMoveDrag = (clientX: number, clientY: number) => {
    if (!isDragging) return
    setOffset({
      x: clientX - dragStart.x,
      y: clientY - dragStart.y
    })
  }

  const handleEndDrag = () => {
    setIsDragging(false)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    handleStartDrag(e.clientX, e.clientY)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    e.preventDefault()
    handleMoveDrag(e.clientX, e.clientY)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      handleStartDrag(e.touches[0].clientX, e.touches[0].clientY)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      handleMoveDrag(e.touches[0].clientX, e.touches[0].clientY)
    }
  }

  const handleCrop = () => {
    if (!imgRef.current || isProcessing) return
    setIsProcessing(true)

    const img = new Image()
    img.src = imageSrc
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        const outputSize = 300 // Output size 300x300 pixels
        canvas.width = outputSize
        canvas.height = outputSize
        const ctx = canvas.getContext('2d')

        if (!ctx) {
          throw new Error('Could not create 2D canvas context')
        }

        // Fill background with white
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, outputSize, outputSize)

        // Translate context to center of canvas for rotation and scaling
        ctx.translate(outputSize / 2, outputSize / 2)
        ctx.rotate((rotation * Math.PI) / 180)

        // Calculate aspect ratios
        const imgAspect = img.width / img.height
        const viewportSize = 240 // Matching CSS viewport size
        const factor = outputSize / viewportSize // Scale factor from viewport to output canvas (300 / 240 = 1.25)

        let baseWidth = viewportSize
        let baseHeight = viewportSize

        // Fit cover calculation
        if (imgAspect > 1) {
          baseHeight = viewportSize
          baseWidth = viewportSize * imgAspect
        } else {
          baseWidth = viewportSize
          baseHeight = viewportSize / imgAspect
        }

        const drawWidth = baseWidth * zoom * factor
        const drawHeight = baseHeight * zoom * factor

        // Apply drag offsets scaled by the factor
        ctx.translate(offset.x * factor, offset.y * factor)

        // Draw image centered at current origin
        ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight)

        // Convert canvas to Blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const croppedFile = new File([blob], file?.name || 'cropped_image.jpg', {
                type: 'image/jpeg',
                lastModified: Date.now()
              })
              onCrop(croppedFile)
            } else {
              toast.error('Cropping failed. Please try again.')
            }
            setIsProcessing(false)
          },
          'image/jpeg',
          0.9
        )
      } catch (err) {
        console.error(err)
        toast.error('Error processing image cropping')
        setIsProcessing(false)
      }
    }
    img.onerror = () => {
      toast.error('Error loading image source')
      setIsProcessing(false)
    }
  }

  // Calculate dynamic style for image preview inside viewport
  const getPreviewStyle = () => {
    // Use naturalWidth/naturalHeight for accurate intrinsic aspect ratio
    const imgAspect = imgRef.current && imgRef.current.naturalWidth 
      ? imgRef.current.naturalWidth / imgRef.current.naturalHeight 
      : 1
    
    // Fit cover sizing base styles
    const sizing = imgAspect > 1 
      ? { height: '100%', width: 'auto', minWidth: '100%', maxWidth: 'none' }
      : { width: '100%', height: 'auto', minHeight: '100%', maxHeight: 'none' }

    return {
      ...sizing,
      left: '50%',
      top: '50%',
      transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px)) scale(${zoom}) rotate(${rotation}deg)`,
      transformOrigin: 'center center',
      cursor: isDragging ? 'grabbing' : 'grab',
      transition: isDragging ? 'none' : 'transform 0.1s ease-out'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 pb-4 px-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl animate-scale-in border border-slate-200 dark:border-slate-800 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-5 py-3.5">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Adjust Photograph</h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Drag to reposition, use sliders to zoom/rotate</p>
          </div>
          <button 
            type="button" 
            onClick={onCancel}
            className="flex h-8 w-8 items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Viewport Frame */}
        <div className="relative flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 pt-6 pb-6">
          <div 
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleEndDrag}
            onMouseLeave={handleEndDrag}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleEndDrag}
            className={`relative h-[220px] w-[220px] overflow-hidden bg-slate-200 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 select-none ${
              circleOverlay ? 'rounded-full' : 'rounded-2xl'
            }`}
          >
            <div className="absolute inset-0 z-10 pointer-events-none border border-black/10 rounded-full" />
            <img
              ref={imgRef}
              src={imageSrc}
              alt="Crop Source"
              style={getPreviewStyle()}
              className="absolute pointer-events-none select-none"
              onLoad={() => setZoom(1.0)}
            />
          </div>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 rounded-full bg-slate-900/80 dark:bg-slate-800 px-3.5 py-1.5 text-[10px] font-bold tracking-wide text-white shadow-lg pointer-events-none transition-opacity">
            <Move className="h-3.5 w-3.5" /> Drag to reposition
          </div>
        </div>

        {/* Adjust Controllers */}
        <div className="space-y-4 border-t border-slate-100 dark:border-slate-800 p-5">
          {/* Zoom Slider */}
          <div className="flex items-center gap-4">
            <ZoomIn className="h-4 w-4 text-slate-400 shrink-0" />
            <div className="flex-1">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                <span>Zoom</span>
                <span>{zoom.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="3.0"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 dark:bg-slate-800 accent-teal-500"
              />
            </div>
          </div>

          {/* Rotation Slider */}
          <div className="flex items-center gap-4">
            <RotateCw className="h-4 w-4 text-slate-400 shrink-0" />
            <div className="flex-1">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                <span>Rotate</span>
                <span>{rotation}°</span>
              </div>
              <input
                type="range"
                min="-180"
                max="180"
                step="5"
                value={rotation}
                onChange={(e) => setRotation(parseInt(e.target.value))}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 dark:bg-slate-800 accent-teal-500"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-xl border border-slate-200 dark:border-slate-800 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 active:scale-[0.98] transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCrop}
              disabled={isProcessing}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-teal-500 py-2.5 text-xs font-bold text-slate-950 hover:bg-teal-400 disabled:opacity-50 active:scale-[0.98] transition-all cursor-pointer"
            >
              <Check className="h-4 w-4" />
              {isProcessing ? 'Optimizing...' : 'Crop & Use'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
