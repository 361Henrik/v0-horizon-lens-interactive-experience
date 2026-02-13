"use client"

import { motion, type MotionValue, useTransform } from "framer-motion"

interface PhaseTransitionProps {
  scrollProgress: MotionValue<number>
}

const terminalLines = [
  { text: "> Compiling route data for Rhine Valley...", delay: 0 },
  { text: "  Corridor: Basel to Amsterdam (872 km)", delay: 0.15 },
  { text: "> Indexing 247 points of interest...", delay: 0.3 },
  { text: "  L0: Quick Facts generated (247/247)", delay: 0.45 },
  { text: "  L1: Narrative summaries generated (247/247)", delay: 0.55 },
  { text: "  L2: Deep-dive articles generated (89/89)", delay: 0.65 },
  { text: "  L3: Panoramic overlays generated (34/34)", delay: 0.75 },
  { text: "> Caching offline packages...", delay: 0.82 },
  { text: "> Generating QR access codes...", delay: 0.9 },
  { text: "> Packaging traveler experience...", delay: 0.95 },
  { text: "", delay: 1.0 },
  { text: "  STATUS: Ready for travelers", delay: 1.0 },
]

function TerminalLine({
  line,
  scrollProgress,
  phaseStart,
  phaseEnd,
}: {
  line: (typeof terminalLines)[0]
  scrollProgress: MotionValue<number>
  phaseStart: number
  phaseEnd: number
}) {
  const range = phaseEnd - phaseStart
  const lineStart = phaseStart + range * line.delay
  const lineVisible = phaseStart + range * Math.min(line.delay + 0.08, 1)

  const opacity = useTransform(
    scrollProgress,
    [lineStart, lineVisible],
    [0, 1]
  )
  const x = useTransform(scrollProgress, [lineStart, lineVisible], [20, 0])

  const isStatus = line.text.includes("STATUS")

  return (
    <motion.div style={{ opacity, x }} className="flex items-center gap-2">
      <span
        className={`font-mono text-xs leading-relaxed ${
          isStatus
            ? "text-primary font-semibold"
            : line.text.startsWith(">")
              ? "text-foreground/80"
              : "text-muted-foreground"
        }`}
      >
        {line.text}
      </span>
      {isStatus && (
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
      )}
    </motion.div>
  )
}

export function PhaseTransition({ scrollProgress }: PhaseTransitionProps) {
  const phaseStart = 0.45
  const phaseEnd = 0.52

  const containerOpacity = useTransform(
    scrollProgress,
    [phaseStart - 0.02, phaseStart, phaseEnd, phaseEnd + 0.02],
    [0, 1, 1, 0]
  )
  const containerScale = useTransform(
    scrollProgress,
    [phaseStart - 0.02, phaseStart, phaseEnd, phaseEnd + 0.02],
    [0.95, 1, 1, 0.95]
  )

  // Progress bar within terminal
  const progressWidth = useTransform(
    scrollProgress,
    [phaseStart, phaseEnd],
    ["0%", "100%"]
  )

  return (
    <div className="w-[60vw] h-full shrink-0 relative flex items-center justify-center">
      <motion.div
        style={{ opacity: containerOpacity, scale: containerScale }}
        className="relative z-20 w-[600px] max-w-[85vw]"
      >
        {/* Terminal window */}
        <div className="glass-panel-strong rounded-xl overflow-hidden">
          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--glass-border)]">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
            </div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-mono ml-3">
              horizon-lens publish
            </span>
          </div>

          {/* Terminal content */}
          <div className="px-5 py-4 space-y-1 min-h-[280px]">
            {terminalLines.map((line, i) => (
              <TerminalLine
                key={i}
                line={line}
                scrollProgress={scrollProgress}
                phaseStart={phaseStart}
                phaseEnd={phaseEnd}
              />
            ))}
          </div>

          {/* Progress bar */}
          <div className="px-5 pb-4">
            <div className="h-1 bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden">
              <motion.div
                style={{ width: progressWidth }}
                className="h-full bg-primary rounded-full"
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-[10px] text-muted-foreground font-mono">
                Publishing...
              </span>
              <span className="text-[10px] text-primary font-mono">
                Operator → Traveler
              </span>
            </div>
          </div>
        </div>

        {/* Decorative label */}
        <div className="text-center mt-6">
          <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60 font-sans">
            Phase II — Content Handoff
          </span>
        </div>
      </motion.div>
    </div>
  )
}
