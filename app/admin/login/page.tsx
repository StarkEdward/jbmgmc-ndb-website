'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { loginAction } from './actions'
import { toast } from 'sonner'
import { Lock, ArrowLeft, Loader2, ShieldCheck, User } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

export default function AdminLoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isPending, setIsPending] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  
  // Animation States
  const [failedAttempts, setFailedAttempts] = useState(0)
  const [animationState, setAnimationState] = useState<'idle' | 'scramble' | 'shake' | 'slam' | 'locked'>('idle')
  const [scrambleText, setScrambleText] = useState('')
  
  const router = useRouter()

  const triggerScramble = (originalPassword: string) => {
    setAnimationState('scramble')
    let iterations = 0
    const chars = "*#@!&%X?$"
    
    // We want it to scramble for about 600ms
    const interval = setInterval(() => {
      setScrambleText(originalPassword.split('').map(() => chars[Math.floor(Math.random() * chars.length)]).join(''))
      iterations++
      if (iterations > 12) {
        clearInterval(interval)
        setPassword('')
        setScrambleText('')
        setAnimationState('idle')
      }
    }, 50)
  }

  const triggerShake = () => {
    setAnimationState('shake')
    setPassword('')
    setTimeout(() => setAnimationState('idle'), 600)
  }

  const triggerSlam = () => {
    setAnimationState('slam')
    setPassword('')
    setTimeout(() => setAnimationState('idle'), 2000)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim()) {
      toast.error('Please enter the administrator username')
      return
    }
    if (!password.trim()) {
      toast.error('Please enter the administrator password')
      return
    }

    setIsPending(true)
    try {
      const res = await loginAction(username, password)
      if (res.success) {
        toast.success('Access granted! Opening Admin Dashboard...')
        setFailedAttempts(0)
        setAnimationState('idle')
        router.push('/admin')
        router.refresh()
      } else {
        // Authentication failed - Trigger Progressive Animations
        const isLocked = res.error?.toLowerCase().includes('locked')
        
        if (isLocked) {
           setAnimationState('locked')
           toast.error(res.error)
        } else {
           const newAttempts = failedAttempts + 1
           setFailedAttempts(newAttempts)
           
           if (newAttempts === 1 || newAttempts === 2) {
             triggerScramble(password)
             toast.error('Invalid password detected. Access denied.', { icon: '⚠️' })
           } else if (newAttempts === 3 || newAttempts === 4) {
             triggerShake()
             toast.error('System breach attempt detected. Warning issued.', { icon: '🚨' })
           } else if (newAttempts === 5) {
             triggerSlam()
             toast.error('FINAL WARNING. UNAUTHORIZED ACCESS ATTEMPT.', { icon: '🛑' })
           } else {
             setAnimationState('locked')
             toast.error('Maximum attempts exceeded. System locked.')
           }
        }
      }
    } catch (err: any) {
      toast.error(err?.message || 'An error occurred during login. Please try again.')
    } finally {
      setIsPending(false)
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY })
  }

  return (
    <div 
      className="relative flex min-h-screen w-full bg-slate-950 font-sans text-slate-100 overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1) rotate(0deg); }
          33% { transform: translate(30px, -50px) scale(1.1) rotate(10deg); }
          66% { transform: translate(-20px, 20px) scale(0.9) rotate(-10deg); }
          100% { transform: translate(0px, 0px) scale(1) rotate(0deg); }
        }
        .animate-blob {
          animation: blob 10s infinite alternate cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        
        .text-gradient {
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}} />

      {/* Interactive Mouse Spotlight */}
      <div 
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle 600px at ${mousePos.x}px ${mousePos.y}px, rgba(45, 212, 191, 0.08), transparent 80%)`,
          opacity: isHovered ? 1 : 0
        }}
      />

      {/* Fluid Lava Lamp Background (Left Side Focused) */}
      <div className="absolute top-0 left-0 w-[60%] h-full z-0 overflow-hidden pointer-events-none opacity-60">
        <div className="absolute top-[20%] left-[20%] w-96 h-96 bg-teal-600/30 rounded-full mix-blend-screen filter blur-[100px] animate-blob" />
        <div className="absolute top-[30%] left-[50%] w-96 h-96 bg-purple-600/15 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000" />
        <div className="absolute bottom-[20%] left-[30%] w-96 h-96 bg-emerald-600/30 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-4000" />
        <div className="absolute bottom-[40%] left-[10%] w-96 h-96 bg-rose-600/15 rounded-full mix-blend-screen filter blur-[100px] animate-blob" style={{ animationDelay: '6s' }} />
        <div className="absolute top-[10%] left-[60%] w-96 h-96 bg-blue-600/30 rounded-full mix-blend-screen filter blur-[100px] animate-blob" style={{ animationDelay: '8s' }} />
      </div>

      {/* Main Content Split */}
      <div className="relative z-10 flex w-full h-screen flex-col lg:flex-row">
        
        {/* Left 60% - Creative Typography Display */}
        <div className="hidden lg:flex lg:w-[60%] flex-col justify-center items-center p-12 relative group">
          
          {/* Interactive Tilt Container based on mouse position (subtle parallax) */}
          <div 
            className="flex flex-col items-center justify-center text-center transition-transform duration-700 ease-out"
            style={{
              transform: isHovered 
                ? `perspective(1000px) rotateX(${(mousePos.y - window.innerHeight / 2) * -0.01}deg) rotateY(${(mousePos.x - window.innerWidth * 0.3) * 0.01}deg)` 
                : 'perspective(1000px) rotateX(0deg) rotateY(0deg)'
            }}
          >
            <div className="relative mb-8 transition-transform duration-500 group-hover:scale-110">
              <div className="absolute inset-0 bg-teal-500/20 rounded-full blur-2xl transition-opacity duration-500 group-hover:opacity-100 opacity-50" />
              <div className="relative flex h-28 w-28 items-center justify-center rounded-3xl bg-white/5 backdrop-blur-xl p-4 ring-1 ring-white/20 shadow-2xl overflow-hidden">
                 {/* Internal glow line on hover */}
                 <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-1000 group-hover:left-[100%]" />
                 <Image src="/images/logo.png" alt="Logo" width={96} height={96} className="object-contain w-full h-full drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
              </div>
            </div>

            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
              <span className="text-white drop-shadow-lg transition-all duration-300">Jannayak Birsa Munda </span>
              <span className="block text-white drop-shadow-lg transition-all duration-300">Government Medical College, </span>
              <span className="bg-gradient-to-r from-teal-400 via-emerald-300 to-blue-500 text-gradient bg-300% animate-gradient drop-shadow-lg">
                Nandurbar
              </span>
            </h1>
            
            <p className="text-lg lg:text-xl font-bold text-slate-300 max-w-2xl leading-relaxed opacity-90 transition-opacity duration-300 group-hover:opacity-100 mb-2">
              जननायक बिरसा मुंडा शासकीय वैद्यकीय महाविद्यालय, नंदुरबार
            </p>
            
            <div className="mt-10 flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.2em] text-teal-500/70">
              <span className="w-12 h-[1px] bg-teal-500/30"></span>
              Secure Admin Workspace
              <span className="w-12 h-[1px] bg-teal-500/30"></span>
            </div>
          </div>
        </div>

        {/* Right 40% - Interactive Login Area */}
        <div className="w-full lg:w-[40%] h-full flex flex-col justify-center px-6 sm:px-12 xl:px-20 bg-slate-950/60 backdrop-blur-2xl border-t lg:border-t-0 lg:border-l border-white/10 shadow-[-20px_0_40px_rgba(0,0,0,0.5)] relative">
          
          {/* Reactive Background Glow for Errors */}
          <div className={`absolute top-1/2 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px] pointer-events-none transition-colors duration-500 ${
            (animationState === 'shake' || animationState === 'slam' || animationState === 'locked') ? 'bg-red-600/20' : 'bg-teal-500/5'
          }`} />

          <div className="w-full max-w-sm mx-auto relative z-10">
            <div className="lg:hidden flex items-center gap-4 mb-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md p-1 ring-1 ring-white/20">
                <Image src="/images/logo.png" alt="Logo" width={40} height={40} className="object-contain" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">JBMGMC Admin</h1>
              </div>
            </div>

            <Link 
              href="/" 
              className="group mb-10 inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-teal-400"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Public Portal
            </Link>

            <div className="mb-10">
              <h2 className="text-3xl font-bold text-white tracking-tight mb-3">
                Welcome back
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Enter your administrative credentials to access the workspace.
              </p>
            </div>

            {/* Form Container with Shake Animation */}
            <motion.div
              animate={
                animationState === 'shake' ? { x: [-15, 15, -12, 12, -8, 8, -4, 4, 0] } :
                animationState === 'slam' ? { y: [0, 15, -5, 0] } : {}
              }
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-1.5">
                  <label 
                    htmlFor="username" 
                    className="block text-xs font-semibold text-slate-300 uppercase tracking-wider"
                  >
                    Administrator Username
                  </label>
                  <div className="relative">
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter username"
                      disabled={isPending || animationState !== 'idle'}
                      className="w-full rounded-2xl border border-white/10 bg-slate-900/60 py-3.5 pl-4 pr-12 text-sm text-white placeholder:text-slate-500 focus:border-teal-500/50 focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500/50 disabled:opacity-50 transition-all"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                      <User className="h-5 w-5 text-slate-500" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label 
                    htmlFor="password" 
                    className="block text-xs font-semibold text-slate-300 uppercase tracking-wider"
                  >
                    Security Access Key
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={animationState === 'scramble' ? scrambleText : password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      disabled={isPending || animationState !== 'idle'}
                      className={`w-full rounded-2xl border bg-slate-900/60 py-3.5 pl-4 pr-12 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-1 disabled:opacity-50 transition-all ${
                        animationState === 'scramble' ? 'text-red-500 border-red-500/60 bg-red-950/20 shadow-[0_0_15px_rgba(239,68,68,0.3)] tracking-[0.3em] font-mono' :
                        (animationState === 'shake' || animationState === 'slam') ? 'border-red-500/70 ring-red-500/50 text-white bg-red-950/30' :
                        'border-white/10 text-white focus:border-teal-500/50 focus:bg-slate-900 focus:ring-teal-500/50'
                      }`}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="focus:outline-none transition-colors cursor-pointer"
                        disabled={isPending || animationState !== 'idle'}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        <ShieldCheck className={`h-5 w-5 transition-colors ${showPassword || animationState !== 'idle' ? 'text-red-500' : 'text-emerald-500 hover:text-emerald-400'}`} />
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isPending || animationState !== 'idle' || animationState === 'locked'}
                  className={`flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-bold shadow-[0_0_20px_rgba(20,184,166,0.2)] transition-all disabled:opacity-50 disabled:active:scale-100 mt-4 ${
                    (animationState === 'shake' || animationState === 'slam' || animationState === 'locked') ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]' : 'bg-teal-500 text-slate-950 hover:bg-teal-400 active:scale-[0.98]'
                  }`}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Verifying Keys...
                    </>
                  ) : animationState === 'locked' ? (
                    <>
                      <Lock className="h-4 w-4" />
                      System Locked
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4" />
                      Access Dashboard
                    </>
                  )}
                </button>
              </form>

              {/* Holographic Slam & Locked Overlay */}
              <AnimatePresence>
                {animationState === 'slam' && (
                  <motion.div
                    initial={{ scale: 3, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
                  >
                    {/* Darken the form underneath slightly */}
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] rounded-2xl" />
                    <div className="relative border-4 border-red-500/90 text-red-500 text-3xl font-black tracking-widest px-6 py-4 rounded-xl transform -rotate-12 shadow-[0_0_40px_rgba(239,68,68,0.6)] bg-slate-950/90 flex flex-col items-center">
                       <ShieldCheck className="h-10 w-10 text-red-500 mb-2" />
                       ACCESS DENIED
                    </div>
                  </motion.div>
                )}
                
                {animationState === 'locked' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-md rounded-2xl pointer-events-none text-red-500 border border-red-500/30"
                  >
                    <Lock className="h-12 w-12 mb-4 animate-pulse" />
                    <div className="text-xl font-black tracking-widest mb-2 text-center">
                      SYSTEM LOCKED
                    </div>
                    <div className="text-xs text-red-400/80 uppercase tracking-widest">
                      Max Attempts Exceeded
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <p className="mt-12 text-center text-xs text-slate-500 leading-relaxed">
              This system is restricted to authorized administrative personnel. 
              Unauthorized access attempts are monitored and recorded.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
