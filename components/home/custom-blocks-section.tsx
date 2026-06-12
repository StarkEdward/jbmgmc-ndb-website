"use client"

import { useLiveData } from "@/hooks/use-live-data"
import { motion } from "framer-motion"

export function CustomBlocksSection() {
  const { customBlocks } = useLiveData()
  
  if (!customBlocks || customBlocks.length === 0) return null

  // Filter only active blocks
  const activeBlocks = customBlocks.filter((b: any) => b.active)
  
  if (activeBlocks.length === 0) return null

  return (
    <div className="flex flex-col gap-12 py-12">
      {activeBlocks.map((block: any, index: number) => (
        <section key={block.id} className="mx-auto max-w-7xl px-4 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="prose dark:prose-invert max-w-none bg-white dark:bg-slate-950 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800"
          >
            {block.title && <h2 className="text-2xl font-bold mb-6">{block.title}</h2>}
            <div dangerouslySetInnerHTML={{ __html: block.content }} className="rich-text-content" />
          </motion.div>
        </section>
      ))}
    </div>
  )
}
