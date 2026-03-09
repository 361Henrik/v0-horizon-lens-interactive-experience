"use client"

import * as React from "react"
import { motion, type MotionValue, useTransform } from "framer-motion"
import { Monitor, Cloud, Smartphone } from "lucide-react"

interface PhaseTransitionProps {
  scrollProgress: MotionValue<number>
}

const terminalLines = [
  { text: "> Compiling route data for Rhine Valley...", type: "command", delay: 0 },
  { text: "  Corridor: Basel to Amsterdam (872 km)", type: "info", delay: 0.12 },
  { text: "> Indexing 247 points of interest...", type: "command", delay: 0.24 },
  { text: "  L0: Quick Facts generated", count: "247/247", type: "success", delay: 0.36 },
  { text: "  L1: Narrative summaries generated", count: "247/247", type: "success", delay: 0.44 },
  { text: "  L2: Deep-dive articles generated", count: "89/89", type: "success", delay: 0.52 },
  { text: "  L3: Panoramic overlays generated", count: "34/34", type: "success", delay: 0.60 },
  { text: "> Caching offline packages...", type: "command", delay: 0.68 },
  { text: "> Generating QR access codes...", type: "command", delay: 0.76 },
  { text: "> Packaging traveler experience...", type: "command", delay: 0.84 },
  { text: "", type: "empty", delay: 0.92 },
  { text: "STATUS: Ready for travelers", type: "status", delay: 0.96 },
]

function AnimatedCounter({ 
  target, 
  progress,
  suffix = ""
}: { 
  target: number
  progress: number 
  suffix?: string
}) {
  const value = Math.floor(target * Math.min(1, progress * 1.5))
  return <span className="text-amber-400 font-mono">{value}{suffix}</span>
}

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
  const lineVisible = phaseStart + range * Math.min(line.delay + 0.06, 1)

  const opacity = useTransform(
    scrollProgress,
    [lineStart, lineVisible],
    [0, 1]
  )
  const x = useTransform(scrollProgress, [lineStart, lineVisible], [15, 0])

  // Track progress for counters
  const innerProgress = useTransform(scrollProgress, [lineStart, phaseEnd], [0, 1])
  const [currentProgress, setCurrentProgress] = React.useState(0)
  
  React.useEffect(() => {
    const unsubscribe = innerProgress.on("change", (v) => {
      setCurrentProgress(Math.min(1, Math.max(0, v)))
    })
    return () => unsubscribe()
  }, [innerProgress])

  const getLineColor = () => {
    switch (line.type) {
      case "command": return "text-primary"
      case "success": return "text-emerald-400"
      case "info": return "text-muted-foreground"
      case "status": return "text-primary font-semibold"
      default: return "text-muted-foreground"
    }
  }

  if (line.type === "empty") return <div className="h-4" />

  return (
    <motion.div style={{ opacity, x }} className="flex items-center justify-between gap-4">
      <span className={`font-mono text-[11px] leading-relaxed ${getLineColor()}`}>
        {line.text}
      </span>
      {line.count && (
        <span className="font-mono text-[10px] text-emerald-400/80">
          ({line.count})
        </span>
      )}
      {line.type === "status" && (
        <motion.div 
          className="w-2 h-2 rounded-full bg-primary"
          animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
    </motion.div>
  )
}

function ConnectionDiagram({ progress }: { progress: number }) {
  const dotPosition = Math.min(100, progress * 100)
  
  return (
    <div className="flex items-center justify-center gap-4 mt-6 px-8">
      {/* MacBook icon */}
      <motion.div
        className="flex flex-col items-center gap-1"
        animate={{ opacity: progress > 0.1 ? 1 : 0.3 }}
      >
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${progress < 0.5 ? 'bg-primary/30 border border-primary/50' : 'bg-muted/30 border border-muted/30'}`}>
          <Monitor className={`w-5 h-5 ${progress < 0.5 ? 'text-primary' : 'text-muted-foreground'}`} />
        </div>
        <span className="text-[8px] text-muted-foreground uppercase tracking-wider">Operator</span>
      </motion.div>

      {/* Connection line */}
      <div className="flex-1 relative h-8 flex items-center">
        {/* Track */}
        <div className="absolute inset-x-0 h-[2px] bg-muted/30 rounded-full">
          <motion.div 
            className="h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full"
            style={{ width: `${dotPosition}%` }}
          />
        </div>
        
        {/* Traveling dot */}
        <motion.div
          className="absolute w-3 h-3 rounded-full bg-primary shadow-lg"
          style={{ 
            left: `calc(${dotPosition}% - 6px)`,
            boxShadow: "0 0 10px hsl(var(--primary))"
          }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />

        {/* Cloud icon in center */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-3">
          <motion.div
            className="w-6 h-6 rounded-full bg-background border border-border/50 flex items-center justify-center"
            animate={{ 
              borderColor: progress > 0.4 && progress < 0.6 ? "hsl(var(--primary))" : "hsl(var(--border) / 0.5)"
            }}
          >
            <Cloud className="w-3 h-3 text-muted-foreground" />
          </motion.div>
        </div>
      </div>

      {/* iPhone icon */}
      <motion.div
        className="flex flex-col items-center gap-1"
        animate={{ opacity: progress > 0.9 ? 1 : 0.3 }}
      >
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${progress > 0.9 ? 'bg-emerald-500/30 border border-emerald-500/50' : 'bg-muted/30 border border-muted/30'}`}>
          <Smartphone className={`w-5 h-5 ${progress > 0.9 ? 'text-emerald-400' : 'text-muted-foreground'}`} />
        </div>
        <span className="text-[8px] text-muted-foreground uppercase tracking-wider">Traveler</span>
      </motion.div>
    </div>
  )
}

function MatrixRain() {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-[0.03] pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-primary font-mono text-[10px] leading-none"
          style={{ left: `${i * 5}%` }}
          initial={{ top: "-10%" }}
          animate={{ top: "110%" }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "linear"
          }}
        >
          {Array.from({ length: 15 }).map((_, j) => (
            <div key={j} className="opacity-60">
              {String.fromCharCode(0x30A0 + Math.random() * 96)}
            </div>
          ))}
        </motion.div>
      ))}
    </div>
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

  // Progress value for animations
  const progressValue = useTransform(scrollProgress, [phaseStart, phaseEnd], [0, 1])
  const [currentProgress, setCurrentProgress] = React.useState(0)
  
  React.useEffect(() => {
    const unsubscribe = progressValue.on("change", (v) => {
      setCurrentProgress(Math.min(1, Math.max(0, v)))
    })
    return () => unsubscribe()
  }, [progressValue])

  // Progress bar width
  const progressWidth = useTransform(
    scrollProgress,
    [phaseStart, phaseEnd],
    ["0%", "100%"]
  )

  return (
    <div className="w-[60vw] h-full shrink-0 relative flex items-center justify-center">
      {/* Matrix code rain background */}
      <MatrixRain />

      <motion.div
        style={{ opacity: containerOpacity, scale: containerScale }}
        className="relative z-20 w-[600px] max-w-[85vw]"
      >
        {/* Terminal window with CRT glow effect */}
        <div className="glass-panel-strong rounded-xl overflow-hidden relative">
          {/* CRT glow overlay */}
          <div 
            className="absolute inset-0 pointer-events-none rounded-xl"
            style={{
              boxShadow: "inset 0 0 60px rgba(52, 211, 153, 0.05), inset 0 0 30px rgba(52, 211, 153, 0.03)"
            }}
          />
          
          {/* Scanline effect */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-[0.02]"
            style={{
              backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)"
            }}
          />

          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--glass-border)] relative">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
            </div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-mono ml-3">
              curated-lens publish
            </span>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-[9px] text-emerald-400/60 font-mono">
                {Math.round(currentProgress * 100)}%
              </span>
            </div>
          </div>

          {/* Terminal content */}
          <div className="px-5 py-4 space-y-1.5 min-h-[260px]">
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
            <div className="h-1.5 bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden">
              <motion.div
                style={{ width: progressWidth }}
                className="h-full bg-gradient-to-r from-primary via-emerald-400 to-primary rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Connection diagram */}
        <ConnectionDiagram progress={currentProgress} />

        {/* Decorative label */}
        <div className="text-center mt-4">
          <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60 font-sans">
            Phase II — Content Handoff
          </span>
        </div>

        {/* Particle burst at completion */}
        {currentProgress > 0.95 && (
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.5 }}
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-primary"
                initial={{ x: 0, y: 0, opacity: 1 }}
                animate={{ 
                  x: Math.cos(i * 30 * Math.PI / 180) * 100,
                  y: Math.sin(i * 30 * Math.PI / 180) * 100,
                  opacity: 0,
                  scale: 0
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
