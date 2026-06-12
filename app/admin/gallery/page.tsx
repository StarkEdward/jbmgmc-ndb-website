import React from 'react'
import { db } from '@/lib/db'
import GalleryClient from './gallery-client'

export const dynamic = 'force-dynamic'

export default function AdminGalleryPage() {
  const images = db.getGallery()

  return (
    <GalleryClient initialImages={images} />
  )
}
