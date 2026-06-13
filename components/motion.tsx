"use client"

import { motion, HTMLMotionProps } from "framer-motion"
import { ReactNode } from "react"

interface BaseProps extends HTMLMotionProps<"div"> {
  children: ReactNode
  className?: string
  delay?: number
}

export function FadeIn({ children, className, delay = 0, ...props }: BaseProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function SlideIn({ children, className, delay = 0, direction = "left", ...props }: BaseProps & { direction?: "left" | "right" | "up" | "down" }) {
  const getInitial = () => {
    switch (direction) {
      case "left": return { opacity: 0, x: -50 }
      case "right": return { opacity: 0, x: 50 }
      case "up": return { opacity: 0, y: 50 }
      case "down": return { opacity: 0, y: -50 }
    }
  }
  return (
    <motion.div
      initial={getInitial()}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function ScaleIn({ children, className, delay = 0, ...props }: BaseProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function StaggerContainer({ children, className, delayChildren = 0, staggerChildren = 0.1, ...props }: BaseProps & { delayChildren?: number, staggerChildren?: number }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren,
            delayChildren,
          },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className, ...props }: BaseProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.5, ease: "easeOut" }
        }
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}
