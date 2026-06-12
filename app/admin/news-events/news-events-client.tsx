'use client'

import React, { useState } from 'react'
import { 
  Megaphone, 
  Calendar, 
  Trash2, 
  Plus, 
  Search, 
  Clock, 
  Heading, 
  AlignLeft, 
  FileText,
  Loader2 
} from 'lucide-react'
import { 
  addNewsAction, 
  deleteNewsAction, 
  addEventAction, 
  deleteEventAction 
} from './actions'
import { toast } from 'sonner'
import { NewsItem, EventItem } from '@/lib/db'

interface NewsEventsClientProps {
  initialNews: NewsItem[]
  initialEvents: EventItem[]
}

export default function NewsEventsClient({ initialNews, initialEvents }: NewsEventsClientProps) {
  const [activeTab, setActiveTab] = useState<'news' | 'events'>('news')
  
  // Lists states
  const [news, setNews] = useState<NewsItem[]>(initialNews)
  const [events, setEvents] = useState<EventItem[]>(initialEvents)
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('')

  // Loading state
  const [isPending, setIsPending] = useState(false)

  // Add News Form State
  const [newsTitle, setNewsTitle] = useState('')
  const [newsDate, setNewsDate] = useState(() => {
    const today = new Date()
    return `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`
  })
  const [newsDesc, setNewsDesc] = useState('')

  // Add Event Form State
  const [eventTitle, setEventTitle] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [eventDesc, setEventDesc] = useState('')
  const [eventFullDesc, setEventFullDesc] = useState('')

  const handleAddNews = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newsTitle.trim() || !newsDesc.trim() || !newsDate.trim()) {
      toast.error('Please fill out all news fields')
      return
    }

    setIsPending(true)
    const newNotice: NewsItem = {
      title: newsTitle,
      date: newsDate,
      description: newsDesc
    }

    try {
      const res = await addNewsAction(newNotice)
      if (res.success) {
        toast.success('Announcement published successfully')
        setNews(prev => [newNotice, ...prev])
        // Reset
        setNewsTitle('')
        setNewsDesc('')
      } else {
        toast.error('Failed to publish circular')
      }
    } catch (e) {
      toast.error('An error occurred')
    } finally {
      setIsPending(false)
    }
  }

  const handleDeleteNews = async (title: string) => {
    if (!confirm(`Are you sure you want to delete news: "${title}"?`)) return

    try {
      const res = await deleteNewsAction(title)
      if (res.success) {
        toast.success('Announcement deleted')
        setNews(prev => prev.filter(n => n.title !== title))
      } else {
        toast.error('Failed to delete announcement')
      }
    } catch (e) {
      toast.error('An error occurred')
    }
  }

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!eventTitle.trim() || !eventDate.trim() || !eventDesc.trim()) {
      toast.error('Please fill out all event fields')
      return
    }

    setIsPending(true)
    const newEv: Omit<EventItem, 'id'> = {
      title: eventTitle,
      date: eventDate,
      description: eventDesc,
      fullDescription: eventFullDesc
    }

    try {
      const res = await addEventAction(newEv)
      if (res.success) {
        toast.success('Event scheduled successfully')
        // Optimistic refresh
        window.location.reload()
      } else {
        toast.error('Failed to schedule event')
      }
    } catch (e) {
      toast.error('An error occurred')
    } finally {
      setIsPending(false)
    }
  }

  const handleDeleteEvent = async (id: number, title: string) => {
    if (!confirm(`Are you sure you want to delete event: "${title}"?`)) return

    try {
      const res = await deleteEventAction(id)
      if (res.success) {
        toast.success('Event removed')
        setEvents(prev => prev.filter(e => e.id !== id))
      } else {
        toast.error('Failed to delete event')
      }
    } catch (e) {
      toast.error('An error occurred')
    }
  }

  // Filter lists based on search query
  const filteredNews = news.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredEvents = events.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">News & Events</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Publish circulars, announcements, or schedule upcoming college events.
          </p>
        </div>
      </div>

      {/* Navigation Tabs and Search */}
      <div className="flex flex-col gap-4 border-b border-slate-200 dark:border-slate-800 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 rounded-2xl bg-slate-50/60 dark:bg-slate-900/60 p-1 ring-1 ring-slate-850">
          <button
            onClick={() => { setActiveTab('news'); setSearchQuery('') }}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'news'
                ? 'bg-teal-500 text-slate-950 shadow-[0_0_15px_rgba(20,184,166,0.15)]'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200'
            }`}
          >
            <Megaphone className="h-4 w-4" />
            Announcements ({news.length})
          </button>
          <button
            onClick={() => { setActiveTab('events'); setSearchQuery('') }}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'events'
                ? 'bg-teal-500 text-slate-950 shadow-[0_0_15px_rgba(20,184,166,0.15)]'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200'
            }`}
          >
            <Calendar className="h-4 w-4" />
            Scheduled Events ({events.length})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative max-w-xs">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder={activeTab === 'news' ? 'Search announcements...' : 'Search scheduled events...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/60 py-2 pl-9 pr-4 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-550 focus:border-teal-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* LEFT COLUMN: Input Forms */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 p-6 shadow-2xl backdrop-blur-md lg:col-span-5 h-fit">
          {activeTab === 'news' ? (
            <form onSubmit={handleAddNews} className="space-y-4">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
                  <Megaphone className="h-4.5 w-4.5" />
                </div>
                <h2 className="text-base font-bold text-slate-250">Publish Announcement</h2>
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Circular Title</label>
                <div className="relative">
                  <Heading className="absolute top-3 left-3 h-4 w-4 text-slate-550" />
                  <input
                    type="text"
                    placeholder="e.g. DNB Admissions Institutional Round"
                    value={newsTitle}
                    onChange={(e) => setNewsTitle(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-950 py-2.5 pl-9 pr-4 text-xs text-slate-800 dark:text-slate-200 focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Publish Date</label>
                  <div className="relative">
                    <Clock className="absolute top-3 left-3 h-4 w-4 text-slate-550" />
                    <input
                      type="text"
                      placeholder="DD/MM/YYYY"
                      value={newsDate}
                      onChange={(e) => setNewsDate(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-950 py-2.5 pl-9 pr-4 text-xs text-slate-800 dark:text-slate-200 focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Description / Link Context</label>
                <div className="relative">
                  <AlignLeft className="absolute top-3 left-3 h-4 w-4 text-slate-550" />
                  <textarea
                    rows={4}
                    placeholder="Provide detailed description of the announcement, or specify link circular details..."
                    value={newsDesc}
                    onChange={(e) => setNewsDesc(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-950 py-2.5 pl-9 pr-4 text-xs text-slate-800 dark:text-slate-200 focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-teal-500 py-3 text-xs font-bold text-slate-950 hover:bg-teal-400 disabled:opacity-50 cursor-pointer"
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin text-slate-950" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                Publish Circular
              </button>
            </form>
          ) : (
            <form onSubmit={handleAddEvent} className="space-y-4">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
                  <Calendar className="h-4.5 w-4.5" />
                </div>
                <h2 className="text-base font-bold text-slate-250">Schedule Event</h2>
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Event Title</label>
                <div className="relative">
                  <Heading className="absolute top-3 left-3 h-4 w-4 text-slate-550" />
                  <input
                    type="text"
                    placeholder="e.g. World AIDS Day Awareness Rally"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-950 py-2.5 pl-9 pr-4 text-xs text-slate-800 dark:text-slate-200 focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Scheduled Date</label>
                <div className="relative">
                  <Clock className="absolute top-3 left-3 h-4 w-4 text-slate-550" />
                  <input
                    type="text"
                    placeholder="e.g. 01 Dec 2026"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-950 py-2.5 pl-9 pr-4 text-xs text-slate-800 dark:text-slate-200 focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Short English Abstract</label>
                <div className="relative">
                  <AlignLeft className="absolute top-3 left-3 h-4 w-4 text-slate-550" />
                  <textarea
                    rows={3}
                    placeholder="Brief description for public events summary cards..."
                    value={eventDesc}
                    onChange={(e) => setEventDesc(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-950 py-2.5 pl-9 pr-4 text-xs text-slate-800 dark:text-slate-200 focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Detailed Marathi / Secondary Context (Optional)</label>
                <div className="relative">
                  <FileText className="absolute top-3 left-3 h-4 w-4 text-slate-550" />
                  <textarea
                    rows={4}
                    placeholder="शासकीय वैद्यकीय महाविद्यालय नंदुरबार येथे..."
                    value={eventFullDesc}
                    onChange={(e) => setEventFullDesc(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-950 py-2.5 pl-9 pr-4 text-xs text-slate-800 dark:text-slate-200 focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-teal-500 py-3 text-xs font-bold text-slate-950 hover:bg-teal-400 disabled:opacity-50 cursor-pointer"
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin text-slate-950" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                Schedule Event
              </button>
            </form>
          )}
        </div>

        {/* RIGHT COLUMN: Interactive Lists */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 p-6 shadow-2xl backdrop-blur-md lg:col-span-7 h-fit">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-250">
              {activeTab === 'news' ? 'Active Announcements' : 'Active Scheduled Events'}
            </h2>
            <span className="rounded-full bg-white/60 dark:bg-slate-950/60 px-2.5 py-1 text-[11px] font-semibold text-teal-600 dark:text-teal-400 ring-1 ring-slate-200 dark:ring-slate-800">
              {activeTab === 'news' ? filteredNews.length : filteredEvents.length} Items Found
            </span>
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
            {activeTab === 'news' ? (
              filteredNews.length > 0 ? (
                filteredNews.map((item, idx) => (
                  <div 
                    key={idx}
                    className="group relative flex items-start gap-4 rounded-2xl bg-white/30 dark:bg-slate-950/30 p-4 ring-1 ring-slate-850 hover:ring-slate-200 dark:ring-slate-800 hover:bg-slate-50/20 dark:bg-slate-900/20 transition-all duration-200"
                  >
                    <button
                      onClick={() => handleDeleteNews(item.title)}
                      className="absolute top-3 right-3 hidden h-8 w-8 items-center justify-center rounded-lg border border-rose-500/20 bg-rose-500/5 text-rose-400 hover:bg-rose-500/20 group-hover:flex"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 ring-1 ring-teal-500/20">
                      <Megaphone className="h-5 w-5" />
                    </div>
                    <div className="overflow-hidden pr-6">
                      <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest">{item.date}</span>
                      <h4 className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-200">{item.title}</h4>
                      <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 py-16 text-center text-xs text-slate-500">
                  No announcements found matching search query.
                </div>
              )
            ) : (
              filteredEvents.length > 0 ? (
                filteredEvents.map((item) => (
                  <div 
                    key={item.id}
                    className="group relative flex items-start gap-4 rounded-2xl bg-white/30 dark:bg-slate-950/30 p-4 ring-1 ring-slate-850 hover:ring-slate-200 dark:ring-slate-800 hover:bg-slate-50/20 dark:bg-slate-900/20 transition-all duration-200"
                  >
                    <button
                      onClick={() => handleDeleteEvent(item.id, item.title)}
                      className="absolute top-3 right-3 hidden h-8 w-8 items-center justify-center rounded-lg border border-rose-500/20 bg-rose-500/5 text-rose-400 hover:bg-rose-500/20 group-hover:flex"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 ring-1 ring-teal-500/20">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div className="overflow-hidden pr-6">
                      <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest">{item.date}</span>
                      <h4 className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-200">{item.title}</h4>
                      <p className="mt-2 text-xs text-slate-600 dark:text-slate-350 leading-relaxed">{item.description}</p>
                      {item.fullDescription && (
                        <p className="mt-3 rounded-lg bg-white/30 dark:bg-slate-950/30 p-2.5 text-[11px] text-slate-500 dark:text-slate-450 border border-slate-900 font-sans italic leading-relaxed">
                          {item.fullDescription}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 py-16 text-center text-xs text-slate-500">
                  No scheduled events found matching search query.
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
