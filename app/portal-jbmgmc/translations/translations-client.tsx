'use client'

import React, { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Loader2, Save, Globe } from 'lucide-react'

type TranslationsMap = Record<string, string>

// Flatten an object: { "a": { "b": "c" } } -> { "a.b": "c" }
function flattenObject(ob: any, prefix = ''): TranslationsMap {
  let result: TranslationsMap = {}
  for (const i in ob) {
    if (typeof ob[i] === 'object' && ob[i] !== null) {
      const flatObj = flattenObject(ob[i], prefix + i + '.')
      result = { ...result, ...flatObj }
    } else {
      result[prefix + i] = ob[i]
    }
  }
  return result
}

// Unflatten: { "a.b": "c" } -> { "a": { "b": "c" } }
function unflattenObject(ob: TranslationsMap): any {
  const result: any = {}
  for (const i in ob) {
    const keys = i.split('.')
    keys.reduce((r, e, j) => {
      return r[e] || (r[e] = (isNaN(Number(keys[j + 1])) ? (keys.length - 1 === j ? ob[i] : {}) : []))
    }, result)
  }
  return result
}

export default function TranslationsClient() {
  const [lang, setLang] = useState('en')
  const [messages, setMessages] = useState<TranslationsMap>({})
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const fetchTranslations = async (l: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/translations?lang=${l}`)
      const data = await res.json()
      if (res.ok) {
        setMessages(flattenObject(data))
      } else {
        toast.error('Failed to load translations')
      }
    } catch (e) {
      toast.error('Error loading translations')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTranslations(lang)
  }, [lang])

  const handleSave = async () => {
    setSaving(true)
    try {
      const nestedMessages = unflattenObject(messages)
      const res = await fetch('/api/translations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lang, messages: nestedMessages })
      })
      if (res.ok) {
        toast.success(`Translations saved successfully for ${lang}`)
      } else {
        toast.error('Failed to save translations')
      }
    } catch (e) {
      toast.error('Error saving translations')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="w-full space-y-8 max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 flex items-center gap-2">
            <Globe className="w-8 h-8 text-primary" />
            Static Translations Manager
          </h2>
          <p className="text-slate-500 mt-1">Manage global UI text like header links, buttons, and footers.</p>
        </div>
        <div className="flex items-center gap-4">
          <select 
            value={lang} 
            onChange={(e) => setLang(e.target.value)}
            className="px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white font-medium shadow-sm"
          >
            <option value="en">English (en.json)</option>
            <option value="hi">हिंदी (hi.json)</option>
            <option value="mr">मराठी (mr.json)</option>
          </select>
          <button 
            onClick={handleSave}
            disabled={saving || loading}
            className="flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-xl hover:bg-primary/90 font-semibold shadow-md shadow-primary/20 transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-slate-50 border-b border-slate-200">
            <div className="font-semibold text-slate-600 text-sm uppercase tracking-wider">Translation Key</div>
            <div className="font-semibold text-slate-600 text-sm uppercase tracking-wider">Value ({lang})</div>
          </div>
          
          <div className="divide-y divide-slate-100">
            {Object.keys(messages).length === 0 ? (
              <div className="p-8 text-center text-slate-500">No translations found.</div>
            ) : (
              Object.entries(messages).map(([key, value]) => (
                <div key={key} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 hover:bg-slate-50/50 transition-colors items-start">
                  <div className="font-mono text-sm text-slate-500 bg-slate-100/50 px-3 py-1.5 rounded-lg border border-slate-200/60 inline-block w-fit break-all">
                    {key}
                  </div>
                  <div>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => setMessages({ ...messages, [key]: e.target.value })}
                      className={`w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm transition-all ${lang !== 'en' ? 'font-mukta text-base' : 'text-sm'}`}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
