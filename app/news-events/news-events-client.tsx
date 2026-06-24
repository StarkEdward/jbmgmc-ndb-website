'use client'

import React, { useState, useRef } from 'react'
import { CalendarDays, FileText, ArrowRight, FileDown, Bell, Star, Clock } from "lucide-react"
import Link from "next/link"
import type { NewsEventItem } from "@/lib/db"
import { formatDate } from "@/lib/utils"

export default function NewsEventsClient({ items }: { items: NewsEventItem[] }) {
  const [activeTab, setActiveTab] = useState<'all' | 'news' | 'event'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const topRef = useRef<HTMLDivElement>(null)

  const scrollToTop = () => {
    if (topRef.current) {
      const y = topRef.current.getBoundingClientRect().top + window.scrollY - 195;
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  const newsItems = items.filter(item => item.type === 'news')
  const eventItems = items.filter(item => item.type === 'event')
  
  const baseDisplayedItems = activeTab === 'all' ? items : items.filter(item => item.type === activeTab)
  const ITEMS_PER_PAGE = 15
  const totalPages = Math.ceil(baseDisplayedItems.length / ITEMS_PER_PAGE)
  const displayedItems = activeTab === 'all' 
    ? baseDisplayedItems 
    : baseDisplayedItems.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
  
  const spotlightItem = items[0] // Most recent item overall

  const isUpcoming = (dateStr: string) => {
    if (!dateStr) return false;
    // Assuming YYYY-MM-DD
    const parts = dateStr.split('-');
    if (parts.length !== 3) return false;
    const [year, month, day] = parts;
    const eventDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate >= today;
  }

  const isNew = (dateStr: string) => {
    if (!dateStr) return false;
    const parts = dateStr.split('-');
    if (parts.length !== 3) return false;
    const [year, month, day] = parts;
    const itemDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    itemDate.setHours(0, 0, 0, 0);
    const diffTime = today.getTime() - itemDate.getTime();
    if (diffTime < 0) return true; // future dates are new
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays <= 7;
  }

  return (
    <section ref={topRef} className="pt-6 pb-12 md:pt-8 md:pb-16">
      <div className="mx-auto max-w-6xl px-4">
        
        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full shadow-sm">
            {(['all', 'news', 'event'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab)
                  setCurrentPage(1)
                }}
                className={`px-6 py-2.5 rounded-full text-sm font-bold capitalize transition-all ${
                  activeTab === tab 
                    ? 'bg-primary text-white shadow-md' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {tab === 'all' ? 'View All' : tab === 'news' ? 'News & Notices' : 'Events'}
              </button>
            ))}
          </div>
        </div>

        {items.length === 0 ? (
          <div className="bg-white dark:bg-slate-950 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">No Updates Found</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              There are currently no news or announcements. Please check back later.
            </p>
          </div>
        ) : (
          <div className="space-y-12" key={activeTab}>
            {activeTab === 'all' && (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                {/* Spotlight Hero */}
                {spotlightItem && (
                  <div className="relative group bg-white dark:bg-slate-950 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col md:flex-row mb-8">
                    <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-primary to-accent"></div>
                    <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                          <Star className="w-3.5 h-3.5" /> Spotlight
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${spotlightItem.type === 'news' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'}`}>
                          {spotlightItem.type}
                        </span>
                        <span className="text-sm font-medium text-slate-500">
                          {formatDate(spotlightItem.date)}
                        </span>
                      </div>
                      <h2 className="text-xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-3 leading-tight group-hover:text-primary transition-colors">
                        <Link href={`/news-events/${spotlightItem.id}`} className="focus:outline-none">
                          <span className="absolute inset-0" aria-hidden="true"></span>
                          {spotlightItem.title}
                        </Link>
                      </h2>
                      <p className="text-slate-600 dark:text-slate-300 text-base mb-6 leading-relaxed max-w-2xl">
                        {spotlightItem.description}
                      </p>
                      <div>
                        <Link href={`/news-events/${spotlightItem.id}`} className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg group-hover:-translate-y-0.5">
                          Read Full Story <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                {/* Side-by-Side Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
                  {/* Left Column: News Timeline */}
                  <div className="lg:col-span-7 space-y-8">
                    <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                      <Bell className="w-6 h-6 text-primary" />
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Latest News</h3>
                    </div>
                    
                    <div className="relative pl-8 md:pl-0">
                      {/* Timeline Line (Hidden on mobile) */}
                      <div className="hidden md:block absolute left-[8.5rem] top-4 bottom-4 w-px bg-slate-200 dark:bg-slate-800"></div>
                      
                      <div className="space-y-8">
                        {newsItems.filter(n => n.id !== spotlightItem?.id).slice(0, 4).map((news) => (
                          <div key={news.id} className="relative flex flex-col md:flex-row gap-6 md:gap-12 group">
                            {/* Date Column */}
                            <div className="md:w-32 flex-shrink-0 pt-1 relative z-10 hidden md:block">
                              <div className={`absolute right-[-1.56rem] top-1.5 w-3 h-3 rounded-full bg-white dark:bg-slate-950 border-2 transition-colors ${isNew(news.date) ? 'border-emerald-500 group-hover:bg-emerald-500' : 'border-primary group-hover:bg-primary'}`}>
                                {isNew(news.date) && (
                                  <span className="absolute inset-[-2px] rounded-full bg-emerald-500 animate-ping opacity-75"></span>
                                )}
                              </div>
                              <span className="text-sm font-bold text-slate-500 text-right block w-full">{formatDate(news.date)}</span>
                            </div>
                            
                            {/* Card Content */}
                            <div className="flex-1 bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group-hover:-translate-y-1">
                              <div className="md:hidden text-xs font-bold text-primary mb-2">{formatDate(news.date)}</div>
                              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                                <Link href={`/news-events/${news.id}`} className="focus:outline-none">
                                  <span className="absolute inset-0" aria-hidden="true"></span>
                                  {news.title}
                                </Link>
                              </h4>
                              <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">
                                {news.description}
                              </p>
                              <span className="inline-flex items-center text-sm font-bold text-primary">
                                Read More <ArrowRight className="w-4 h-4 ml-1" />
                              </span>
                            </div>
                          </div>
                        ))}
                        {newsItems.filter(n => n.id !== spotlightItem?.id).length === 0 && (
                          <p className="text-slate-500 italic">No additional news at this time.</p>
                        )}
                        {newsItems.filter(n => n.id !== spotlightItem?.id).length > 4 && (
                          <div className="pt-4 text-center">
                            <button 
                              onClick={() => {
                                setActiveTab('news')
                                setCurrentPage(1)
                                scrollToTop()
                              }}
                              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border-2 border-primary/20 text-primary font-bold hover:bg-primary hover:text-white transition-all"
                            >
                              View All News & Notices <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Events Calendar */}
                  <div className="lg:col-span-5 space-y-8">
                    <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                      <CalendarDays className="w-6 h-6 text-emerald-500" />
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Events</h3>
                    </div>
                    
                    <div className="space-y-4">
                      {eventItems.filter(e => e.id !== spotlightItem?.id && isUpcoming(e.date || '')).map((event) => {
                        const dateParts = (event.date || '').split('-') // YYYY-MM-DD
                        const year = dateParts[0] || new Date().getFullYear().toString()
                        const monthNum = parseInt(dateParts[1] || '1', 10)
                        const day = dateParts[2] || '01'
                        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
                        const monthStr = months[monthNum - 1] || 'Jan'

                        return (
                          <div key={event.id} className="group relative flex gap-4 bg-white dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
                            {/* Calendar Leaf */}
                            <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 flex flex-col items-center justify-center border border-emerald-100 dark:border-emerald-900/50">
                              <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">{monthStr}</span>
                              <span className="text-2xl font-black text-slate-800 dark:text-white leading-none">{day}</span>
                            </div>
                            
                            {/* Details */}
                            <div className="flex-1 flex flex-col justify-center">
                              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1 group-hover:text-emerald-600 transition-colors line-clamp-2">
                                <Link href={`/news-events/${event.id}`} className="focus:outline-none">
                                  <span className="absolute inset-0" aria-hidden="true"></span>
                                  {event.title}
                                </Link>
                              </h4>
                              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                                <Clock className="w-3.5 h-3.5" /> {formatDate(event.date)}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                      {eventItems.filter(e => e.id !== spotlightItem?.id && isUpcoming(e.date || '')).length === 0 && (
                        <p className="text-slate-500 italic">No upcoming events scheduled.</p>
                      )}

                      {eventItems.filter(e => e.id !== spotlightItem?.id && !isUpcoming(e.date || '')).length > 0 && (
                        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
                          <h4 className="text-lg font-bold text-slate-500 dark:text-slate-400 mb-4 uppercase tracking-wider">Past Events</h4>
                          <div className="space-y-4 opacity-75 hover:opacity-100 transition-opacity">
                            {eventItems.filter(e => e.id !== spotlightItem?.id && !isUpcoming(e.date || '')).slice(0, 5).map((event) => {
                              const dateParts = (event.date || '').split('-') // YYYY-MM-DD
                              const year = dateParts[0] || new Date().getFullYear().toString()
                              const monthNum = parseInt(dateParts[1] || '1', 10)
                              const day = dateParts[2] || '01'
                              const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
                              const monthStr = months[monthNum - 1] || 'Jan'

                              return (
                                <div key={event.id} className="group relative flex gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all grayscale hover:grayscale-0">
                                  {/* Calendar Leaf */}
                                  <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-slate-200 dark:bg-slate-800 flex flex-col items-center justify-center border border-slate-300 dark:border-slate-700">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{monthStr}</span>
                                    <span className="text-2xl font-black text-slate-600 dark:text-slate-300 leading-none">{day}</span>
                                  </div>
                                  
                                  {/* Details */}
                                  <div className="flex-1 flex flex-col justify-center">
                                    <h4 className="text-base font-bold text-slate-700 dark:text-slate-300 mb-1 group-hover:text-primary transition-colors line-clamp-2">
                                      <Link href={`/news-events/${event.id}`} className="focus:outline-none">
                                        <span className="absolute inset-0" aria-hidden="true"></span>
                                        {event.title}
                                      </Link>
                                    </h4>
                                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                                      <Clock className="w-3.5 h-3.5" /> {formatDate(event.date)}
                                    </div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                          {eventItems.filter(e => e.id !== spotlightItem?.id && !isUpcoming(e.date || '')).length > 5 && (
                            <div className="mt-8 text-center">
                              <button 
                                onClick={() => {
                                  setActiveTab('event')
                                  setCurrentPage(1)
                                  scrollToTop()
                                }}
                                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border-2 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                              >
                                View All Past Events <ArrowRight className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Grid Layout for specific tabs */}
            {activeTab !== 'all' && (
              <div className="space-y-12">
                <div key={`grid-${activeTab}`} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                  {displayedItems.map((item, i) => (
                  <div key={item.id} className="group h-full flex flex-col bg-white dark:bg-slate-950 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'both' }}>
                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${item.type === 'news' ? 'from-blue-500 to-indigo-500' : 'from-emerald-400 to-teal-500'}`}></div>
                    
                    <div className="flex items-center gap-2 mb-4">
                      {item.type === 'event' ? (
                        isUpcoming(item.date) ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide bg-emerald-50 text-emerald-700">Upcoming Event</span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide bg-slate-100 text-slate-600">Past Event</span>
                        )
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide bg-blue-50 text-blue-700">News & Notice</span>
                      )}
                      {item.date && isNew(item.date) && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide bg-red-50 text-red-600 animate-pulse">NEW</span>
                      )}
                      <span className="text-xs font-semibold text-slate-400">
                        {formatDate(item.date)}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-primary transition-colors leading-snug">
                      <Link href={`/news-events/${item.id}`} className="focus:outline-none">
                        <span className="absolute inset-0" aria-hidden="true"></span>
                        {item.title}
                      </Link>
                    </h3>
                    
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 flex-1 line-clamp-3">
                      {item.description}
                    </p>

                    <div className="mt-auto">
                      <span className="inline-flex items-center text-sm font-bold text-primary group-hover:text-accent transition-colors">
                        Read Full Article <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                ))}
                {displayedItems.length === 0 && (
                  <div className="col-span-full py-12 text-center text-slate-500">
                    No items found for this category.
                  </div>
                )}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 pt-8 animate-in fade-in slide-in-from-bottom-4">
                    <button
                      onClick={() => {
                        setCurrentPage(p => Math.max(1, p - 1))
                        scrollToTop()
                      }}
                      disabled={currentPage === 1}
                      className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <span className="sr-only">Previous Page</span>
                      <ArrowRight className="w-4 h-4 rotate-180" />
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => {
                          setCurrentPage(page)
                          scrollToTop()
                        }}
                        className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold transition-all ${
                          currentPage === page
                            ? 'bg-primary text-white shadow-md'
                            : 'border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => {
                        setCurrentPage(p => Math.min(totalPages, p + 1))
                        scrollToTop()
                      }}
                      disabled={currentPage === totalPages}
                      className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <span className="sr-only">Next Page</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
