"use client"

import * as React from "react"
import { motion, type MotionValue, useTransform, AnimatePresence } from "framer-motion"
import { useSmoothScroll } from "./smooth-scroll-provider"
import { useI18n } from "@/lib/i18n"

interface ProgressBarProps {
  scrollProgress: MotionValue<number>
}

const PHASE_POSITIONS = [
  { position: 0,    id: "landing"    },
  { position: 0.15, id: "operator"   },
  { position: 0.48, id: "handoff"    },
  { position: 0.60, id: "traveler"   },
  { position: 0.87, id: "insights"   },
]

function getActivePhase(progress: number): number {
  for (let i = PHASE_POSITIONS.length - 1; i >= 0; i--) {
    if (progress >= PHASE_POSITIONS[i].position) return i
  }
  return 0
}

export function ProgressBar({ scrollProgress }: ProgressBarProps) {
  const { t } = useI18n()
  const { scrollTo } = useSmoothScroll()

  const phases = React.useMemo(() => [
    { label: t.progressBar.phases.landing,  ...PHASE_POSITIONS[0] },
    { label: t.progressBar.phases.operator, ...PHASE_POSITIONS[1] },
    { label: t.progressBar.phases.handoff,  ...PHASE_POSITIONS[2] },
    { label: t.progressBar.phases.traveler, ...PHASE_POSITIONS[3] },
    { label: t.progressBar.phases.insights, ...PHASE_POSITIONS[4] },
  ], [t])
  const width = useTransform(scrollProgress, [0, 1], ["0%", "100%"])
  const labelOpacity = useTransform(scrollProgress, [0, 0.05], [0, 1])
  
  // Track current progress for phase highlighting
  const [currentProgress, setCurrentProgress] = React.useState(0)
  const [isHovered, setIsHovered] = React.useState(false)
  const [isIdle, setIsIdle] = React.useState(false)
  const idleTimerRef = React.useRef<NodeJS.Timeout | null>(null)

  React.useEffect(() => {
    const unsubscribe = scrollProgress.on("change", (v) => {
      setCurrentProgress(v)
      setIsIdle(false)
      
      // Reset idle timer
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
      idleTimerRef.current = setTimeout(() => setIsIdle(true), 3000)
    })
    return () => {
      unsubscribe()
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    }
  }, [scrollProgress])

  const activePhase = getActivePhase(currentProgress)

  const handlePhaseClick = (position: number) => {
    // Calculate scroll position from progress percentage
    const totalHeight = 600 // TOTAL_WIDTH_VW
    const scrollableHeight = (totalHeight - 100) / 100 * window.innerHeight
    const targetScroll = position * scrollableHeight
    scrollTo(targetScroll)
  }

  return (
    <motion.div
      style={{ opacity: labelOpacity }}
      animate={{ opacity: isIdle && !isHovered ? 0.5 : 1 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-0 left-0 right-0 z-50 px-8 pb-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glass pill container */}
      <div className="max-w-3xl mx-auto">
        <div className="glass-panel rounded-full px-6 py-3">
          {/* Phase dots and labels */}
          <div className="relative h-8 mb-2">
            {phases.map((phase, i) => {
              const isActive = i === activePhase
              const isCompleted = i < activePhase

              return (
                <motion.button
                  key={phase.id}
                  className="absolute -translate-x-1/2 flex flex-col items-center gap-1 group cursor-pointer"
                  style={{ left: `${phase.position * 100}%` }}
                  onClick={() => handlePhaseClick(phase.position)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Phase dot */}
                  <div className="relative">
                    <motion.div
                      className={`w-3 h-3 rounded-full border-2 transition-colors duration-300 ${
                        isCompleted 
                          ? "bg-primary border-primary" 
                          : isActive 
                            ? "bg-primary border-primary" 
                            : "bg-transparent border-muted-foreground/40 group-hover:border-primary/60"
                      }`}
                      animate={isActive ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    {/* Active glow */}
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 rounded-full bg-primary"
                        initial={{ opacity: 0.5, scale: 1 }}
                        animate={{ opacity: 0, scale: 2 }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    )}
                  </div>

                  {/* Label */}
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={`${phase.id}-${isActive}`}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: isActive || isHovered ? 1 : 0.5, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className={`text-[9px] uppercase tracking-[0.15em] font-sans whitespace-nowrap ${
                        isActive ? "text-primary font-medium" : "text-muted-foreground"
                      }`}
                    >
                      {phase.label}
                    </motion.span>
                  </AnimatePresence>
                </motion.button>
              )
            })}
          </div>

          {/* Track */}
          <div className="relative h-[3px] bg-muted/30 rounded-full overflow-hidden">
            {/* Progress fill */}
            <motion.div
              style={{ width }}
              className="absolute inset-y-0 left-0 rounded-full"
            >
              {/* Gradient fill with glow */}
              <div className="w-full h-full bg-primary rounded-full relative">
                <div 
                  className="absolute inset-0 rounded-full"
                  style={{ boxShadow: "0 0 10px hsl(var(--primary)), 0 0 20px hsl(var(--primary) / 0.3)" }}
                />
              </div>
            </motion.div>

            {/* Phase markers on track */}
            {phases.map((phase, i) => (
              <div
                key={`marker-${phase.id}`}
                className="absolute top-1/2 -translate-y-1/2 w-[2px] h-2 bg-muted/50"
                style={{ left: `${phase.position * 100}%` }}
              />
            ))}
          </div>

          {/* Current phase label */}
          <div className="flex justify-between items-center mt-2">
            <span className="text-[9px] text-muted-foreground font-mono">
              {Math.round(currentProgress * 100)}%
            </span>
            <AnimatePresence mode="wait">
              <motion.span
                key={activePhase}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="text-[10px] text-primary font-sans"
              >
                {phases[activePhase]?.label || "Begin"}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
