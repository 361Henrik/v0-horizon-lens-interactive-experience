"use client"

import { motion, type MotionValue, useTransform } from "framer-motion"
import { Ship, Anchor, Train } from "lucide-react"
import { ScrollHint } from "./scroll-hint"

interface VerticalSelectorProps {
  scrollProgress: MotionValue<number>
}

const travelModes = [
  { label: "River Cruise", icon: Ship, active: true },
  { label: "Ocean Cruise", icon: Anchor, active: false },
  { label: "Luxury Rail", icon: Train, active: false },
]

export function VerticalSelector({ scrollProgress }: VerticalSelectorProps) {
  const opacity = useTransform(scrollProgress, [0, 0.06], [1, 0])
  const y = useTransform(scrollProgress, [0, 0.06], [0, -40])
  const overlayOpacity = useTransform(scrollProgress, [0, 0.08], [0.7, 0.3])
  const hintOpacity = useTransform(scrollProgress, [0, 0.03], [1, 0])

  return (
    <div className="w-[100vw] h-full shrink-0 relative flex items-center justify-center">
      {/* Additional dark overlay for landing */}
      <motion.div
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 bg-background pointer-events-none z-10"
      />

      <motion.div
        style={{ opacity, y }}
        className="relative z-20 flex flex-col items-center gap-12 px-6"
      >
        {/* Logo */}
        <div className="flex flex-col items-center gap-4">
          <span className="text-[10px] uppercase tracking-[0.4em] text-primary/80 font-sans">
            Introducing
          </span>
          <h1 className="font-serif text-5xl md:text-7xl font-semibold text-foreground text-center leading-tight">
            <span className="gold-text">Horizon</span>{" "}
            <span className="text-foreground">Lens</span>
          </h1>
          <p className="text-sm md:text-base text-muted-foreground text-center max-w-md leading-relaxed font-sans">
            Transform every mile into a story worth telling.
            <br />
            <span className="text-foreground/60">
              The AI-powered storytelling engine for premium travel.
            </span>
          </p>
        </div>

        {/* Mode selector */}
        <div className="flex gap-4">
          {travelModes.map((mode) => {
            const Icon = mode.icon
            return (
              <button
                key={mode.label}
                className={`group relative flex flex-col items-center gap-3 px-6 py-4 rounded-xl border transition-all duration-300 ${
                  mode.active
                    ? "border-primary/40 bg-primary/10 gold-glow"
                    : "border-[var(--glass-border)] bg-[var(--glass)] hover:border-primary/20 opacity-50 cursor-not-allowed"
                }`}
                disabled={!mode.active}
              >
                <Icon
                  className={`w-6 h-6 ${
                    mode.active ? "text-primary" : "text-muted-foreground"
                  }`}
                />
                <span
                  className={`text-xs uppercase tracking-[0.15em] font-sans ${
                    mode.active ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {mode.label}
                </span>
                {mode.active && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            )
          })}
        </div>

        {/* Route subtitle */}
        <p className="text-xs text-muted-foreground/60 uppercase tracking-[0.2em] font-sans">
          Rhine Valley Demo Route
        </p>
      </motion.div>

      <ScrollHint opacity={hintOpacity} />
    </div>
  )
}
