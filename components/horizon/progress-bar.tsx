"use client"

import { motion, type MotionValue, useTransform } from "framer-motion"

interface ProgressBarProps {
  scrollProgress: MotionValue<number>
}

const phases = [
  { label: "Begin", position: 0 },
  { label: "Architect", position: 0.15 },
  { label: "Publish", position: 0.45 },
  { label: "Experience", position: 0.6 },
  { label: "Insights", position: 0.85 },
]

export function ProgressBar({ scrollProgress }: ProgressBarProps) {
  const width = useTransform(scrollProgress, [0, 1], ["0%", "100%"])
  const labelOpacity = useTransform(scrollProgress, [0, 0.05], [0, 1])

  return (
    <motion.div
      style={{ opacity: labelOpacity }}
      className="fixed bottom-0 left-0 right-0 z-50 px-8 pb-6"
    >
      {/* Phase labels */}
      <div className="relative h-5 mb-2 max-w-4xl mx-auto">
        {phases.map((phase) => (
          <div
            key={phase.label}
            className="absolute -translate-x-1/2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 font-sans"
            style={{ left: `${phase.position * 100}%` }}
          >
            {phase.label}
          </div>
        ))}
      </div>
      {/* Track */}
      <div className="relative h-[2px] bg-[rgba(255,255,255,0.08)] rounded-full max-w-4xl mx-auto overflow-hidden">
        <motion.div
          style={{ width }}
          className="absolute inset-y-0 left-0 bg-primary rounded-full"
        />
      </div>
    </motion.div>
  )
}
