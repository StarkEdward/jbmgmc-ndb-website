"use client"

import { useState, useRef } from "react"
import { Upload, CheckCircle2, AlertCircle, Loader2, DatabaseZap } from "lucide-react"

export function RestoreBackupButton() {
  const [isRestoring, setIsRestoring] = useState(false)
  const [step, setStep] = useState<"idle" | "uploading" | "extracting" | "restoring" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.tar.gz')) {
      setErrorMsg("Invalid file format. Please upload a .tar.gz archive.")
      setStep("error")
      return
    }

    if (file.size > 250 * 1024 * 1024) {
      setErrorMsg("File size exceeds 250MB limit.")
      setStep("error")
      return
    }

    setIsRestoring(true)
    setStep("uploading")
    setErrorMsg("")

    const formData = new FormData()
    formData.append("file", file)

    try {
      // Step 1: Uploading
      const res = await fetch("/api/backup/restore", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Restore failed' }))
        throw new Error(errorData.error || `Server returned ${res.status}`)
      }

      // Step 2 & 3: Extraction & Restoring happen on the server, but we can simulate the UI steps 
      // if we don't have SSE. The fetch will wait until the entire process is done.
      // So while fetch is pending, we are uploading + restoring. 
      // Actually, since fetch waits, let's just cycle through text to give feedback.
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to restore backup")
      setStep("error")
      setIsRestoring(false)
      return
    }

    setStep("success")
    setTimeout(() => {
      window.location.reload()
    }, 2000)
  }

  // A small helper hook/effect could cycle texts while fetching, but simple is better:
  // We will just show a pulsing animated box while fetch is ongoing.

  if (step === "success") {
    return (
      <div className="flex items-center justify-center gap-3 w-full rounded-xl bg-green-500/20 px-4 py-3 border border-green-500/50">
        <CheckCircle2 className="h-5 w-5 text-green-500 animate-bounce" />
        <span className="text-sm font-bold text-green-700 dark:text-green-400">Restore Complete! Reloading...</span>
      </div>
    )
  }

  if (step === "error") {
    return (
      <div className="flex flex-col gap-2 w-full">
        <div className="flex items-center justify-center gap-2 w-full rounded-xl bg-red-500/10 px-4 py-3 border border-red-500/30">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <span className="text-xs font-medium text-red-600 dark:text-red-400">{errorMsg}</span>
        </div>
        <button 
          onClick={() => setStep("idle")}
          className="text-xs font-bold text-slate-500 hover:text-slate-800 underline"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (isRestoring) {
    return (
      <div className="relative flex items-center justify-center w-full rounded-xl bg-slate-900 px-4 py-3 overflow-hidden shadow-inner">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 opacity-20 animate-pulse" />
        
        {/* Scanning line effect */}
        <div className="absolute top-0 bottom-0 left-0 w-1 bg-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-[scan_2s_ease-in-out_infinite]" />
        
        <div className="relative flex items-center gap-3 z-10">
          <DatabaseZap className="h-5 w-5 text-blue-400 animate-pulse" />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white tracking-wide">Processing Backup...</span>
            <span className="text-[10px] text-blue-200 uppercase tracking-widest opacity-80">Do not close this window</span>
          </div>
          <Loader2 className="h-4 w-4 text-blue-300 animate-spin ml-2" />
        </div>
        
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes scan {
            0% { transform: translateX(0); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateX(300px); opacity: 0; }
          }
        `}} />
      </div>
    )
  }

  return (
    <>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept=".tar.gz" 
        className="hidden" 
      />
      <button 
        onClick={() => fileInputRef.current?.click()}
        className="group relative flex items-center justify-center gap-2 w-full rounded-xl bg-white border-2 border-dashed border-indigo-200 px-4 py-3 text-sm font-bold text-indigo-600 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all shadow-sm"
      >
        <Upload className="h-4 w-4 group-hover:-translate-y-1 transition-transform" /> 
        Upload & Restore Backup
      </button>
    </>
  )
}
