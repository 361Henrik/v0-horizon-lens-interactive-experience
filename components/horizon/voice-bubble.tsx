"use client"

import { motion, type MotionValue } from "framer-motion"
import { MessageCircle } from "lucide-react"

interface VoiceBubbleProps {
  text: string
  opacity: MotionValue<number>
  y?: MotionValue<number>
  className?: string
}

export function VoiceBubble({ text, opacity, y, className = "" }: VoiceBubbleProps) {
  return (
    <motion.div
      style={{ opacity, y }}
      className={`flex items-start gap-3 max-w-sm ${className}`}
    >
      <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
        <MessageCircle className="w-4 h-4 text-primary" />
      </div>
      <div className="glass-panel rounded-xl rounded-tl-sm px-4 py-3">
        <p className="text-sm text-foreground/90 leading-relaxed italic font-serif">
          {`"${text}"`}
        </p>
      </div>
    </motion.div>
  )
}
