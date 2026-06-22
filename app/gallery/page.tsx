import { db } from "@/lib/db"
import { GalleryClient } from "./gallery-client"

export default function GalleryPage() {
  const allData = db.getAllPublicData()
  return <GalleryClient galleryImages={allData.galleryImages || []} />
}
