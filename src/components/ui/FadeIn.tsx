"use client"

import * as React from "react"
import { motion, useInView } from "framer-motion"
import { cn } from "@/lib/utils"

interface FadeInProps {
  children: React.ReactNode
  delay?: number
  className?: string
  direction?: "up" | "down" | "left" | "right" | "none"
  duration?: number
}

export function FadeIn({
  children,
  delay = 0,
  className,
  direction = "up",
  duration = 0.5,
}: FadeInProps) {
  const ref = React.useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-10%" })

  const directionOffset = {
    up: 40,
    down: -40,
    left: 40,
    right: -40,
    none: 0,
  }

  const initialY = direction === "up" || direction === "down" ? directionOffset[direction] : 0
  const initialX = direction === "left" || direction === "right" ? directionOffset[direction] : 0

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: initialY, x: initialX }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : { opacity: 0, y: initialY, x: initialX }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}
