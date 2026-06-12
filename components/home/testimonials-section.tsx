"use client"

import { useLiveData } from "@/hooks/use-live-data"
import { motion } from "framer-motion"
import { Quote } from "lucide-react"

export function TestimonialsSection() {
  const { testimonials } = useLiveData()
  
  if (!testimonials || testimonials.length === 0) return null

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900 border-t border-border overflow-hidden">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold tracking-tight sm:text-4xl"
          >
            Student & Faculty Voices
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mt-4 flex justify-center"
          >
            <div className="h-1.5 w-24 rounded-full bg-primary" />
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t: any, index: number) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-slate-950 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 relative"
            >
              <Quote className="absolute top-6 right-6 w-12 h-12 text-primary/10 rotate-180" />
              <p className="text-muted-foreground relative z-10 italic mb-6">
                "{t.content}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden shrink-0 font-bold text-primary">
                  {t.image ? <img src={t.image} alt={t.authorName} className="w-full h-full object-cover" /> : t.authorName.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{t.authorName}</h4>
                  <p className="text-sm text-primary">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
