"use client"

import Link from "next/link"
import { Phone, Mail, MapPin, ExternalLink, Heart } from "lucide-react"
import Image from "next/image"
import { useLiveData } from "@/hooks/use-live-data"

export function Footer() {
  const { collegeInfo, departments, accreditations, quickLinks } = useLiveData()
  
  const defaultQuickLinks = [
    { id: '1', href: "/about", label: "About Us" },
    { id: '2', href: "/courses", label: "Courses" },
    { id: '3', href: "/departments", label: "Departments" },
    { id: '4', href: "/doctors", label: "Doctors" },
    { id: '5', href: "/hostel", label: "PG/Hostel" },
    { id: '6', href: "/gallery", label: "Gallery" },
  ]
  const footerLinks = quickLinks && quickLinks.length > 0 ? quickLinks : defaultQuickLinks
  return (
    <>
      {/* Institutional Affiliates & Logos Strip */}
      <div className="bg-white dark:bg-slate-200 border-t border-slate-200 dark:border-slate-300 py-2">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex justify-start md:justify-center items-center gap-6 sm:gap-8 md:gap-12 overflow-x-auto snap-x hide-scrollbar py-3">
            {[
              { src: "/images/muhs_logo.png", alt: "MUHS" },
              { src: "/images/nmc_logo.png", alt: "NMC" },
              { src: "/images/yog_day_logo.png", alt: "Yoga Day" },
              { src: "/images/abha_card_lgoo.png", alt: "ABHA Card" },
              { src: "/images/maharashtra_logo.png", alt: "Maharashtra Government" },
              { src: "/images/pmjay_logo.png", alt: "PMJAY" },
              { src: "/images/di_logo.png", alt: "Digital India" },
            ].map((logo, index) => (
              <Image 
                key={index}
                src={logo.src} 
                alt={logo.alt} 
                width={90} 
                height={90} 
                className="object-contain h-8 sm:h-10 md:h-12 lg:h-14 w-auto filter grayscale-[20%] opacity-90 hover:opacity-100 hover:grayscale-0 hover:scale-110 transition-all duration-300 shrink-0 snap-center origin-center" 
              />
            ))}
          </div>
        </div>
      </div>

      <footer className="bg-primary text-primary-foreground relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 relative">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* College Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-lg p-1">
                <Image src="/images/logo.png" alt="JBMGMC Logo" width={40} height={40} className="object-contain w-full h-full" />
              </div>
              <div>
                <h3 className="font-bold">JBMGMC</h3>
                <p className="text-sm opacity-80">Nandurbar</p>
              </div>
            </div>
            <p className="text-sm opacity-90 leading-relaxed mb-6">
              Jannayak Birsa Munda Government Medical College and Hospital - One of the premiere Medical Colleges in Maharashtra, providing excellent medical education and healthcare services.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <Heart className="h-4 w-4 text-accent animate-pulse" />
              <span className="opacity-80">Serving the community since establishment</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-5 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-accent rounded-full" />
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm">
              {footerLinks.map((link) => (
                <li key={link.id || link.href}>
                  <Link 
                    href={link.href} 
                    className="opacity-80 hover:opacity-100 hover:text-accent transition-all duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-accent/50 group-hover:bg-accent group-hover:scale-125 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Departments */}
          <div>
            <h4 className="font-bold text-lg mb-5 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-accent rounded-full" />
              Departments
            </h4>
            <ul className="space-y-3 text-sm">
              {departments.slice(0, 6).map((dept) => (
                <li key={dept.id}>
                  <Link 
                    href={`/departments/${dept.id}`} 
                    className="opacity-80 hover:opacity-100 hover:text-accent transition-all duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-accent/50 group-hover:bg-accent group-hover:scale-125 transition-all" />
                    {dept.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link 
                  href="/departments" 
                  className="text-accent font-semibold hover:underline flex items-center gap-1 group"
                >
                  View All
                  <ExternalLink className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-lg mb-5 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-accent rounded-full" />
              Contact Us
            </h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3 group">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 shrink-0 group-hover:bg-accent/20 transition-colors">
                  <MapPin className="h-4 w-4" />
                </div>
                <span className="opacity-80 group-hover:opacity-100 transition-opacity">
                  {collegeInfo.address}
                </span>
              </li>
              <li>
                <a href={`tel:${collegeInfo.phone}`} className="flex items-center gap-3 group">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 shrink-0 group-hover:bg-accent/20 transition-colors">
                    <Phone className="h-4 w-4" />
                  </div>
                  <span className="opacity-80 group-hover:opacity-100 group-hover:text-accent transition-all">
                    {collegeInfo.phone}
                  </span>
                </a>
              </li>
              <li>
                <a href={`mailto:${collegeInfo.email}`} className="flex items-center gap-3 group">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 shrink-0 group-hover:bg-accent/20 transition-colors">
                    <Mail className="h-4 w-4" />
                  </div>
                  <span className="opacity-80 group-hover:opacity-100 group-hover:text-accent transition-all text-xs">
                    {collegeInfo.email}
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Accreditation Logos Slider & Safety QRs */}
        <div className="mt-12 pt-8 border-t border-white/10 grid gap-8 md:grid-cols-12 items-center">
          {/* Logos Slider */}
          <div className="md:col-span-12 lg:col-span-5 xl:col-span-6 space-y-4">
            <h5 className="text-xs font-bold uppercase tracking-wider text-accent">Institutional Affiliations &amp; Accreditations</h5>
            <div className="flex flex-wrap items-center gap-4 opacity-75 hover:opacity-100 transition-all duration-300">
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded bg-white/10 border border-white/5">NMC India</span>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded bg-white/10 border border-white/5">MUHS Nashik</span>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded bg-white/10 border border-white/5">ABHA Card</span>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded bg-white/10 border border-white/5">Yoga Day</span>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded bg-white/10 border border-white/5">PMJAY India</span>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded bg-white/10 border border-white/5">Digital India</span>
            </div>
          </div>
          {/* QR Safety Scans */}
          <div className="md:col-span-12 lg:col-span-7 xl:col-span-6 flex flex-col sm:flex-row items-center gap-4">
            
            {/* Anti-Ragging QR */}
            <div className="flex-1 flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-xl w-full">
              <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center shrink-0 border border-white/20 p-1">
                {/* Placeholder for uploaded QR */}
                <img src="/images/anti-ragging-qr.png" alt="Anti Ragging QR" className="w-full h-full object-cover rounded" onError={(e) => { e.currentTarget.src = 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=AntiRagging'; }} />
              </div>
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-accent">Anti-Ragging Cell</h5>
                <p className="text-[10px] opacity-80 mt-0.5 leading-relaxed">
                  Scan to report ragging.
                </p>
              </div>
            </div>

            {/* Women's Safety Desk */}
            <div className="flex-1 flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-xl w-full">
              <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center shrink-0 border border-white/20 p-1">
                <img src="/images/woman_safety_qr.png" alt="Women's Safety QR" className="w-full h-full object-cover rounded" />
              </div>
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-accent">Women&apos;s Safety</h5>
                <p className="text-[10px] opacity-80 mt-0.5 leading-relaxed">
                  Scan to report complaints.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Map & Visitor Counter */}
        <div className="mt-8 pt-8 border-t border-white/10 grid gap-8 md:grid-cols-12 items-center">
          {/* Location Map */}
          <div className="md:col-span-8 rounded-xl overflow-hidden border border-white/15 h-32">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3716.1762768957387!2d74.24064!3d21.3713!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDIyJzE2LjciTiA3NMKwMTQnMjYuMyJF!5e0!3m2!1sen!2sin!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="JBMGMC Sakri Road Map"
              className="opacity-75 hover:opacity-100 transition-opacity"
            />
          </div>
          {/* Visitor Counter Box */}
          <div className="md:col-span-4 flex flex-col items-center justify-center bg-white/5 border border-white/10 p-5 rounded-xl h-32 shadow-inner">
            <span className="text-[10px] font-bold tracking-widest text-accent uppercase mb-2">Live Visitor Registry</span>
            <div className="flex gap-1">
              {String(accreditations?.visitorCount || 678582).split("").map((num, i) => (
                <span
                  key={i}
                  className="inline-block w-6 h-8 text-center leading-8 bg-slate-950/80 border border-white/10 text-emerald-400 font-mono font-bold text-base rounded shadow"
                >
                  {num}
                </span>
              ))}
            </div>
            <span className="text-[10px] opacity-75 mt-2">Verified college visitor count</span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/20">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
            <p className="opacity-80 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              © {new Date().getFullYear()} JBMGMC Nandurbar. All rights reserved.
            </p>
            <p className="text-xs text-accent font-semibold tracking-wider hover:opacity-85 transition-opacity">
              Developed &amp; Maintained by : <span className="underline">WKTECHSYS</span>
            </p>
            <p className="opacity-80 font-medium">
              Government of Maharashtra
            </p>
          </div>
        </div>
      </div>
    </footer>
    </>
  )
}
