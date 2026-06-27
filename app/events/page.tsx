import { db } from "@/lib/db"
import { EventsClient } from "./events-client"

export const metadata = {
  title: "Event Albums - JBMGMC Nandurbar",
  description: "Explore our past events, ceremonies, and celebrations through beautiful photo albums."
}

export const dynamic = 'force-dynamic'

export default function EventBlogsPage() {
  const albums = db.getEventBlogs()

  return <EventsClient initialAlbums={albums} />
}
