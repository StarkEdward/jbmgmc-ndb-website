"use client"

import Link from "next/link"
import { useLiveData } from "@/hooks/use-live-data"
import { motion } from "framer-motion"
import { Link as LinkIcon, ExternalLink, GraduationCap, Building2, Stethoscope, FileText, Image as ImageIcon, Users } from "lucide-react"

// Simple icon map fallback
const iconMap: Record<string, React.ReactNode> = {
  GraduationCap: <GraduationCap className="w-8 h-8" />,
  Building2: <Building2 className="w-8 h-8" />,
  Stethoscope: <Stethoscope className="w-8 h-8" />,
  FileText: <FileText className="w-8 h-8" />,
  Image: <ImageIcon className="w-8 h-8" />,
  Users: <Users className="w-8 h-8" />
}

export function QuickLinksSection() {
  const { quickLinks } = useLiveData()
  
  if (!quickLinks || quickLinks.length === 0) return null

  return (
    <section className="py-8 bg-slate-50 dark:bg-slate-900 border-b border-border">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickLinks.map((link: any, index: number) => (
            <motion.div
              key={link.id || link.href}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link 
                href={link.href}
                className="flex flex-col items-center justify-center p-6 gap-4 text-center rounded-2xl bg-white dark:bg-slate-950 shadow-sm hover:shadow-md border border-slate-100 dark:border-slate-800 transition-all hover:-translate-y-1 group"
              >
                <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {iconMap[link.icon] || <LinkIcon className="w-8 h-8" />}
                </div>
                <span className="font-semibold text-sm text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors">
                  {link.label}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
