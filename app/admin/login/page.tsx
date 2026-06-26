'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { loginAction, checkLoginLockoutStatusAction } from './actions'
import { toast } from 'sonner'
import { Lock, ArrowLeft, Loader2, ShieldCheck, User } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

const MatrixBackground = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
    const fontSize = 14
    let columns = canvas.width / fontSize
    let drops: number[] = []
    for (let x = 0; x < columns; x++) drops[x] = Math.random() * -50

    const draw = () => {
      ctx.fillStyle = 'rgba(2, 6, 23, 0.15)' // Fading effect matched to slate-950
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      ctx.fillStyle = 'rgba(20, 184, 166, 0.4)' // Subtle teal/emerald
      ctx.font = fontSize + 'px monospace'

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)]
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.95) {
          drops[i] = 0
        }
        drops[i]++
      }
    }

    const interval = setInterval(draw, 70) // Slower speed
    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none mix-blend-screen opacity-30"
    />
  )
}

export default function AdminLoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isPending, setIsPending] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  
  // Animation States
  const [failedAttempts, setFailedAttempts] = useState(0)
  const [animationState, setAnimationState] = useState<'idle' | 'shake' | 'slam' | 'locked'>('idle')
  const [lockoutTimeLeft, setLockoutTimeLeft] = useState<number | null>(null)
  
  const router = useRouter()

  // On mount, check if user is already locked out
  useEffect(() => {
    checkLoginLockoutStatusAction().then((status) => {
      if (!status.allowed) {
        setAnimationState('locked')
        setLockoutTimeLeft(status.timeLeftSeconds)
      }
    })
  }, [])

  // Timer countdown for locked state
  useEffect(() => {
    if (lockoutTimeLeft !== null && lockoutTimeLeft > 0) {
      const timer = setInterval(() => {
        setLockoutTimeLeft(prev => prev !== null && prev > 0 ? prev - 1 : 0)
      }, 1000)
      return () => clearInterval(timer)
    } else if (lockoutTimeLeft === 0) {
      setAnimationState('idle')
      setLockoutTimeLeft(null)
      setFailedAttempts(0)
    }
  }, [lockoutTimeLeft])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
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
           checkLoginLockoutStatusAction().then(s => setLockoutTimeLeft(s.timeLeftSeconds))
           toast.error(res.error)
        } else {
           const newAttempts = failedAttempts + 1
           setFailedAttempts(newAttempts)
           
           if (newAttempts >= 1 && newAttempts <= 3) {
             triggerShake()
             toast.error('System breach attempt detected. Warning issued.', { icon: '🚨' })
           } else if (newAttempts === 4 || newAttempts === 5) {
             triggerSlam()
             toast.error('FINAL WARNING. UNAUTHORIZED ACCESS ATTEMPT.', { icon: '🛑' })
           } else {
             setAnimationState('locked')
             checkLoginLockoutStatusAction().then(s => setLockoutTimeLeft(s.timeLeftSeconds))
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

        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-scanline {
          animation: scanline 4s linear infinite;
        }

        @keyframes glitch-text {
          0%, 90%, 100% { transform: translate(0); text-shadow: none; }
          92% { transform: translate(-2px, 1px); text-shadow: 2px 0px 0px rgba(239,68,68,0.8), -2px 0px 0px rgba(59,130,246,0.8); }
          94% { transform: translate(2px, -1px); text-shadow: -2px 0px 0px rgba(239,68,68,0.8), 2px 0px 0px rgba(59,130,246,0.8); }
          96% { transform: translate(-1px, -1px); text-shadow: 2px 0px 0px rgba(239,68,68,0.8), -2px 0px 0px rgba(59,130,246,0.8); }
          98% { transform: translate(1px, 2px); text-shadow: -2px 0px 0px rgba(239,68,68,0.8), 2px 0px 0px rgba(59,130,246,0.8); }
        }
        .animate-glitch-text {
          animation: glitch-text 3s infinite;
        }

        @keyframes pulse-red-teal {
          0% { 
            color: rgba(239, 68, 68, 0.6); 
            text-shadow: 0 0 8px rgba(239, 68, 68, 0.4);
            opacity: 1;
          }
          25% {
            color: rgba(239, 68, 68, 0.6); 
            text-shadow: 0 0 8px rgba(239, 68, 68, 0.4);
            opacity: 0.3;
          }
          50% { 
            color: rgba(20, 184, 166, 0.8); 
            text-shadow: 0 0 15px rgba(20, 184, 166, 0.8);
            opacity: 1;
          }
          75% { 
            color: rgba(20, 184, 166, 0.8); 
            text-shadow: 0 0 15px rgba(20, 184, 166, 0.8);
            opacity: 0.3;
          }
          100% {
            color: rgba(239, 68, 68, 0.6); 
            text-shadow: 0 0 8px rgba(239, 68, 68, 0.4);
            opacity: 1;
          }
        }
        .animate-pulse-red-teal {
          animation: pulse-red-teal 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .bg-cyber-grid {
          background-image: 
            linear-gradient(rgba(239, 68, 68, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(239, 68, 68, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      disabled={isPending || animationState !== 'idle'}
                      className={`w-full rounded-2xl border bg-slate-900/60 py-3.5 pl-4 pr-12 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-1 disabled:opacity-50 transition-all ${
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
                    className="absolute inset-0 z-50 overflow-hidden rounded-2xl bg-slate-950/95 backdrop-blur-xl border border-red-500/40 pointer-events-none shadow-[0_0_100px_rgba(239,68,68,0.15)_inset]"
                  >
                    {/* Matrix Falling Background */}
                    <MatrixBackground />

                    {/* Cyber Grid Background */}
                    <div className="absolute inset-0 bg-cyber-grid opacity-30" />
                    
                    {/* Sweeping Scanner Line */}
                    <div className="absolute top-0 left-0 w-full h-full animate-scanline">
                      <div className="h-1 w-full bg-red-500/50 shadow-[0_0_30px_5px_rgba(239,68,68,0.5)]" />
                    </div>

                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 relative z-10">
                      {/* Top Warning Ribbon */}
                      <div className="absolute top-2 left-0 right-0 flex justify-center">
                        <div className="bg-red-500/20 text-red-500 text-[9px] font-mono tracking-[0.3em] px-4 py-1 border-y border-red-500/30 w-full text-center uppercase">
                          Security Protocol Engaged
                        </div>
                      </div>

                      {/* Glowing Lock Icon */}
                      <div className="relative mb-5 mt-6">
                        <div className="absolute inset-0 bg-red-500 blur-[30px] opacity-40 rounded-full animate-pulse" />
                        <Lock className="relative h-10 w-10 text-red-500 animate-pulse drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
                      </div>

                      {/* Glitchy Title */}
                      <div className="text-2xl font-black tracking-widest mb-5 text-center text-red-500 animate-glitch-text drop-shadow-[0_0_10px_rgba(239,68,68,0.6)]">
                        SYSTEM LOCKED
                      </div>

                      {/* Timer Display */}
                      <div className="bg-red-950/50 border border-red-500/30 rounded-lg px-6 py-2.5 relative group">
                        <div className="text-xl font-mono text-red-400 tracking-widest font-bold drop-shadow-[0_0_8px_rgba(248,113,113,0.8)]">
                          {lockoutTimeLeft !== null ? formatTime(lockoutTimeLeft) : '00:00'}
                        </div>
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-slate-950 px-2 text-[8px] font-mono text-red-500/70 tracking-widest uppercase">
                          Countdown
                        </div>
                      </div>

                      {/* Bottom Alert Text */}
                      <div className="mt-8 text-center">
                         <div className="text-[9px] font-mono uppercase tracking-widest animate-pulse-red-teal">
                           Multiple Failed Attempts Detected
                         </div>
                      </div>
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
