"use client"

import type { ReactNode } from "react"
import { motion, type MotionValue } from "framer-motion"

interface MacBookFrameProps {
  children: ReactNode
  opacity?: MotionValue<number>
  scale?: MotionValue<number>
  className?: string
}

export function MacBookFrame({
  children,
  opacity,
  scale,
  className = "",
}: MacBookFrameProps) {
  return (
    <motion.div
      style={{ opacity, scale }}
      className={`relative flex items-center justify-center ${className}`}
    >
      <div className="relative w-[720px] max-w-[80vw]">
        {/* Screen bezel */}
        <div className="rounded-xl overflow-hidden border border-[var(--glass-border)] glass-panel-strong">
          {/* Camera notch */}
          <div className="flex items-center justify-center py-2 bg-[rgba(0,0,0,0.4)]">
            <div className="w-2 h-2 rounded-full bg-[rgba(255,255,255,0.15)]" />
          </div>
          {/* Screen */}
          <div className="relative aspect-[16/10] bg-[hsl(220,20%,6%)] overflow-hidden">
            {children}
          </div>
        </div>
        {/* Keyboard deck */}
        <div className="mx-auto w-[110%] -ml-[5%] h-3 bg-gradient-to-b from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.03)] rounded-b-xl border-x border-b border-[var(--glass-border)]" />
        {/* Hinge line */}
        <div className="mx-auto w-[30%] h-1 bg-[rgba(255,255,255,0.06)] rounded-b-sm" />
      </div>
    </motion.div>
  )
}

interface IPhoneFrameProps {
  children: ReactNode
  opacity?: MotionValue<number>
  scale?: MotionValue<number>
  rotate?: MotionValue<number>
  className?: string
}

export function IPhoneFrame({
  children,
  opacity,
  scale,
  rotate,
  className = "",
}: IPhoneFrameProps) {
  return (
    <motion.div
      style={{ opacity, scale, rotate }}
      className={`relative flex items-center justify-center ${className}`}
    >
      <div className="relative w-[320px] max-w-[40vw]">
        {/* Phone body */}
        <div className="rounded-[2.5rem] overflow-hidden border-2 border-[rgba(255,255,255,0.15)] glass-panel-strong p-2">
          {/* Dynamic Island */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 w-24 h-6 bg-black rounded-full" />
          {/* Screen */}
          <div className="relative aspect-[9/19.5] bg-[hsl(220,20%,6%)] rounded-[2rem] overflow-hidden">
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
