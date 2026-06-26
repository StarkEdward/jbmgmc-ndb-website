'use client'

import React, { useState, useRef, useEffect } from 'react'
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Loader2, Crop as CropIcon } from 'lucide-react'

interface ImageCropperModalProps {
  isOpen: boolean
  onClose: () => void
  imageFile: File | null
  onCropComplete: (croppedFile: File) => void
}

function getCroppedImg(
  image: HTMLImageElement,
  crop: PixelCrop,
  fileName: string
): Promise<File> {
  const canvas = document.createElement('canvas')
  const scaleX = image.naturalWidth / image.width
  const scaleY = image.naturalHeight / image.height
  canvas.width = crop.width
  canvas.height = crop.height
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('No 2d context')
  }

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  )

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Canvas is empty'))
        return
      }
      const file = new File([blob], fileName, { type: 'image/jpeg' })
      resolve(file)
    }, 'image/jpeg', 0.95)
  })
}

export function ImageCropperModal({ isOpen, onClose, imageFile, onCropComplete }: ImageCropperModalProps) {
  const [imgSrc, setImgSrc] = useState('')
  const imgRef = useRef<HTMLImageElement>(null)
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (imageFile) {
      setCrop(undefined) // Reset crop state when new image comes in
      const reader = new FileReader()
      reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''))
      reader.readAsDataURL(imageFile)
    } else {
      setImgSrc('')
    }
  }, [imageFile])

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget
    const initialCrop = centerCrop(
      makeAspectCrop({ unit: '%', width: 90 }, 16 / 9, width, height),
      width,
      height
    )
    setCrop(initialCrop)
  }

  const handleSave = async () => {
    if (!completedCrop || !imgRef.current || !imageFile) return

    try {
      setIsProcessing(true)
      const croppedFile = await getCroppedImg(imgRef.current, completedCrop, imageFile.name)
      onCropComplete(croppedFile)
      onClose()
    } catch (e) {
      console.error('Failed to crop image', e)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <CropIcon className="w-5 h-5 text-primary" />
            Crop Image
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-4">
          {imgSrc && (
            <div className="w-full max-h-[50vh] overflow-auto bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 flex justify-center items-center">
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={imgRef}
                  alt="Crop me"
                  src={imgSrc}
                  className="max-w-full h-auto object-contain"
                  onLoad={onImageLoad}
                />
              </ReactCrop>
            </div>
          )}
          <p className="text-sm text-slate-500 text-center w-full">
            Drag the edges to crop the image. You can resize it freely in the editor later.
          </p>
        </div>

        <div className="flex justify-end gap-3 mt-4 border-t pt-4 border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!completedCrop || isProcessing}
            className="px-4 py-2 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CropIcon className="w-4 h-4" />}
            Crop & Upload
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
