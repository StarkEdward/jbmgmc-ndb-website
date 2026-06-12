'use client'

import React, { useState } from 'react'
import { NavigationItem, QuickLink, StatCounter, Testimonial, CustomBlock } from '@/lib/db'
import { 
  updateNavItemsAction, 
  updateQuickLinksAction, 
  updateStatCountersAction, 
  updateTestimonialsAction, 
  updateCustomBlocksAction 
} from '../actions'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Save, Plus, Trash2, ArrowUp, ArrowDown, GripVertical, Settings2 } from 'lucide-react'
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css'

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

interface Props {
  initialNavItems: NavigationItem[]
  initialQuickLinks: QuickLink[]
  initialStatCounters: StatCounter[]
  initialTestimonials: Testimonial[]
  initialCustomBlocks: CustomBlock[]
}

export default function SiteBuilderClient({
  initialNavItems,
  initialQuickLinks,
  initialStatCounters,
  initialTestimonials,
  initialCustomBlocks
}: Props) {
  const [isSaving, setIsSaving] = useState(false)
  const [navItems, setNavItems] = useState<NavigationItem[]>(initialNavItems)
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>(initialQuickLinks)
  const [statCounters, setStatCounters] = useState<StatCounter[]>(initialStatCounters)
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials)
  const [customBlocks, setCustomBlocks] = useState<CustomBlock[]>(initialCustomBlocks)

  // --- Handlers for Nav Items ---
  const handleAddNavItem = () => {
    const newItem: NavigationItem = {
      id: Date.now().toString(),
      label: 'New Link',
      href: '/',
      order: navItems.length,
      submenus: []
    }
    setNavItems([...navItems, newItem])
  }

  const handleUpdateNavItem = (index: number, field: keyof NavigationItem, value: any) => {
    const updated = [...navItems]
    updated[index] = { ...updated[index], [field]: value }
    setNavItems(updated)
  }

  const handleDeleteNavItem = (id: string) => {
    setNavItems(navItems.filter(item => item.id !== id))
  }

  const handleAddSubmenu = (navIndex: number) => {
    const updated = [...navItems]
    const newSub = {
      id: Date.now().toString(),
      label: 'New Submenu',
      href: '/',
      order: updated[navIndex].submenus.length
    }
    updated[navIndex].submenus.push(newSub)
    setNavItems(updated)
  }

  const handleUpdateSubmenu = (navIndex: number, subIndex: number, field: string, value: string) => {
    const updated = [...navItems]
    updated[navIndex].submenus[subIndex] = { ...updated[navIndex].submenus[subIndex], [field]: value }
    setNavItems(updated)
  }

  const handleDeleteSubmenu = (navIndex: number, subId: string) => {
    const updated = [...navItems]
    updated[navIndex].submenus = updated[navIndex].submenus.filter(s => s.id !== subId)
    setNavItems(updated)
  }

  const handleSaveNavItems = async () => {
    setIsSaving(true)
    const res = await updateNavItemsAction(navItems)
    if (res.success) toast.success('Navigation updated successfully')
    else toast.error('Failed to update navigation')
    setIsSaving(false)
  }

  // --- Handlers for Quick Links ---
  const handleAddQuickLink = () => {
    setQuickLinks([...quickLinks, { id: Date.now().toString(), label: '', href: '', icon: 'Link', order: quickLinks.length }])
  }
  const handleSaveQuickLinks = async () => {
    setIsSaving(true)
    const res = await updateQuickLinksAction(quickLinks)
    if (res.success) toast.success('Quick links updated')
    setIsSaving(false)
  }

  // --- Handlers for Custom Blocks ---
  const handleAddCustomBlock = () => {
    setCustomBlocks([...customBlocks, { id: Date.now().toString(), title: 'New Block', content: '', active: false }])
  }
  const handleSaveCustomBlocks = async () => {
    setIsSaving(true)
    const res = await updateCustomBlocksAction(customBlocks)
    if (res.success) toast.success('Custom blocks updated')
    setIsSaving(false)
  }

  // ... (Testimonials & Stats handlers would follow the exact same pattern)

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Site Builder</h1>
        <p className="mt-2 text-sm text-muted-foreground">Manage dynamic homepage content and global navigation menus.</p>
      </div>

      <Tabs defaultValue="navigation" className="space-y-6">
        <TabsList className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl">
          <TabsTrigger value="navigation" className="rounded-lg">Navigation</TabsTrigger>
          <TabsTrigger value="quicklinks" className="rounded-lg">Quick Links</TabsTrigger>
          <TabsTrigger value="blocks" className="rounded-lg">Custom HTML Blocks</TabsTrigger>
        </TabsList>

        <TabsContent value="navigation" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Main Navigation</h2>
            <Button onClick={handleAddNavItem} size="sm" variant="outline" className="gap-2">
              <Plus className="h-4 w-4" /> Add Link
            </Button>
          </div>
          
          <div className="space-y-4">
            {navItems.map((item, index) => (
              <div key={item.id} className="border border-border rounded-xl p-4 bg-card shadow-sm space-y-4">
                <div className="flex items-start gap-4">
                  <div className="grid grid-cols-2 gap-4 flex-1">
                    <div className="space-y-2">
                      <Label>Label</Label>
                      <Input value={item.label} onChange={(e) => handleUpdateNavItem(index, 'label', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>URL/Href</Label>
                      <Input value={item.href} onChange={(e) => handleUpdateNavItem(index, 'href', e.target.value)} />
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteNavItem(item.id)} className="text-destructive mt-6">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Submenus */}
                <div className="pl-6 border-l-2 border-slate-100 dark:border-slate-800 space-y-3">
                  <div className="flex justify-between items-center text-sm text-muted-foreground font-medium">
                    Submenu Items (Dropdown)
                    <Button variant="ghost" size="sm" onClick={() => handleAddSubmenu(index)} className="h-7 text-xs">
                      <Plus className="h-3 w-3 mr-1" /> Add Submenu
                    </Button>
                  </div>
                  {item.submenus.map((sub, sIndex) => (
                    <div key={sub.id} className="flex items-center gap-3">
                      <Input placeholder="Label" value={sub.label} onChange={(e) => handleUpdateSubmenu(index, sIndex, 'label', e.target.value)} className="h-8 text-sm" />
                      <Input placeholder="URL" value={sub.href} onChange={(e) => handleUpdateSubmenu(index, sIndex, 'href', e.target.value)} className="h-8 text-sm" />
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteSubmenu(index, sub.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4 border-t border-border">
            <Button onClick={handleSaveNavItems} disabled={isSaving} className="gap-2 bg-teal-600 hover:bg-teal-700">
              <Save className="h-4 w-4" /> Save Navigation
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="blocks" className="space-y-6">
           <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Custom Rich Text Blocks (Homepage)</h2>
            <Button onClick={handleAddCustomBlock} size="sm" variant="outline" className="gap-2">
              <Plus className="h-4 w-4" /> Add Block
            </Button>
          </div>
          
          <div className="space-y-6">
            {customBlocks.map((block, index) => (
              <div key={block.id} className="border border-border rounded-xl p-4 bg-card shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <Input 
                    value={block.title} 
                    onChange={(e) => {
                      const updated = [...customBlocks];
                      updated[index].title = e.target.value;
                      setCustomBlocks(updated);
                    }} 
                    className="font-semibold text-lg border-none bg-transparent px-0 w-1/2 focus-visible:ring-0"
                    placeholder="Block Title"
                  />
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-sm">
                      <input 
                        type="checkbox" 
                        checked={block.active}
                        onChange={(e) => {
                          const updated = [...customBlocks];
                          updated[index].active = e.target.checked;
                          setCustomBlocks(updated);
                        }}
                      /> Active
                    </label>
                    <Button variant="ghost" size="icon" onClick={() => setCustomBlocks(customBlocks.filter(b => b.id !== block.id))} className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* React Quill Editor */}
                <div className="bg-white dark:bg-slate-950 text-black dark:text-white pb-10 sm:pb-0 h-64 overflow-hidden rounded-md border border-slate-200 dark:border-slate-800">
                  <ReactQuill 
                    theme="snow" 
                    value={block.content} 
                    onChange={(val) => {
                      const updated = [...customBlocks];
                      updated[index].content = val;
                      setCustomBlocks(updated);
                    }}
                    className="h-48"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4 border-t border-border">
            <Button onClick={handleSaveCustomBlocks} disabled={isSaving} className="gap-2 bg-teal-600 hover:bg-teal-700">
              <Save className="h-4 w-4" /> Save Blocks
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
