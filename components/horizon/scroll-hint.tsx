"use client"

import { motion, type MotionValue } from "framer-motion"
import { ChevronDown } from "lucide-react"

interface ScrollHintProps {
  opacity: MotionValue<number>
}

export function ScrollHint({ opacity }: ScrollHintProps) {
  return (
    <motion.div
      style={{ opacity }}
      className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
    >
      <span className="text-xs uppercase tracking-[0.3em] text-foreground/40 font-sans">
        Scroll to begin your journey
      </span>
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="w-4 h-4 text-primary/60" />
      </motion.div>
    </motion.div>
  )
}
