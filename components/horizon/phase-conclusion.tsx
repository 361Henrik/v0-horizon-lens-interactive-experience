"use client"

import * as React from "react"
import { type MotionValue, useTransform, motion, useSpring } from "framer-motion"
import { BarChart3, BookOpen, ArrowRight, Shield } from "lucide-react"
import { MacBookFrame } from "./device-frame"
import { VoiceBubble } from "./voice-bubble"

interface PhaseConclusionProps {
  scrollProgress: MotionValue<number>
}

// Animated counter component
function AnimatedCounter({ 
  target, 
  suffix = "",
  isVisible 
}: { 
  target: number
  suffix?: string
  isVisible: boolean
}) {
  const [value, setValue] = React.useState(0)

  React.useEffect(() => {
    if (!isVisible) {
      setValue(0)
      return
    }

    let startTime: number | null = null
    const duration = 1500

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.floor(target * eased))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [target, isVisible])

  return (
    <span className="font-mono tabular-nums">
      {value.toLocaleString()}{suffix}
    </span>
  )
}

// Magnetic button component
function MagneticButton({ children }: { children: React.ReactNode }) {
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const [position, setPosition] = React.useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = React.useState(false)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return
    const rect = buttonRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const distanceX = e.clientX - centerX
    const distanceY = e.clientY - centerY
    
    // Magnetic pull effect (max 15px movement)
    const pullStrength = 0.3
    setPosition({
      x: distanceX * pullStrength,
      y: distanceY * pullStrength
    })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
    setIsHovered(false)
  }

  return (
    <motion.button
      ref={buttonRef}
      className="magnetic-btn group relative px-10 py-5 rounded-2xl overflow-hidden"
      animate={{ 
        x: position.x, 
        y: position.y,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.98 }}
    >
      {/* Animated gradient border */}
      <div className="absolute inset-0 rounded-2xl p-[2px] overflow-hidden">
        <div 
          className="absolute inset-0 rounded-2xl"
          style={{
            background: "conic-gradient(from var(--angle, 0deg), hsl(35, 80%, 55%), hsl(40, 60%, 70%), hsl(30, 70%, 45%), hsl(35, 80%, 55%))",
            animation: "gradient-rotate 3s linear infinite"
          }}
        />
      </div>
      
      {/* Inner background */}
      <div className="absolute inset-[2px] rounded-[14px] bg-card" />
      
      {/* Hover glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        animate={{ opacity: isHovered ? 1 : 0 }}
        style={{
          background: "radial-gradient(circle at center, hsl(35 80% 55% / 0.15), transparent 70%)"
        }}
      />
      
      {/* Content */}
      <span className="relative z-10 flex items-center gap-3 text-sm uppercase tracking-[0.15em] text-foreground font-sans">
        {children}
        <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
      </span>

      {/* Particle burst on hover */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-primary"
              style={{
                left: "50%",
                top: "50%",
              }}
              initial={{ scale: 0, x: 0, y: 0 }}
              animate={{ 
                scale: [0, 1, 0],
                x: Math.cos(i * 60 * Math.PI / 180) * 40,
                y: Math.sin(i * 60 * Math.PI / 180) * 40,
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          ))}
        </div>
      )}
    </motion.button>
  )
}

// 3D Journal component
function Journal3D({ opacity }: { opacity: MotionValue<number> }) {
  const [isHovered, setIsHovered] = React.useState(false)

  return (
    <motion.div
      style={{ opacity }}
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="glass-panel rounded-xl p-6 max-w-sm"
        animate={{ 
          rotateY: isHovered ? 5 : 0,
          rotateX: isHovered ? -5 : 0,
        }}
        style={{ 
          transformStyle: "preserve-3d",
          perspective: "1000px"
        }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            animate={{ rotate: isHovered ? 10 : 0 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <BookOpen className="w-5 h-5 text-primary" />
          </motion.div>
          <div>
            <h4 className="font-serif text-sm font-semibold text-foreground">
              Digital Travel Journal
            </h4>
            <p className="text-[10px] text-muted-foreground">
              Branded keepsake for every guest
            </p>
          </div>
        </div>
        
        {/* Journal mockup with parallax content */}
        <motion.div 
          className="aspect-[3/4] bg-[hsl(220,20%,6%)] rounded-lg border border-[var(--glass-border)] p-4 flex flex-col items-center justify-center relative overflow-hidden"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Page fold effect */}
          <div className="absolute top-0 right-0 w-8 h-8">
            <div 
              className="absolute inset-0 bg-gradient-to-br from-muted/20 to-transparent"
              style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }}
            />
          </div>

          <motion.div
            animate={{ z: isHovered ? 20 : 0 }}
            style={{ transformStyle: "preserve-3d" }}
            className="flex flex-col items-center"
          >
            <span className="text-[10px] uppercase tracking-[0.3em] text-primary/60 font-sans">
              Rhine Valley
            </span>
            <span className="font-serif text-lg text-foreground mt-1">
              Your Journey
            </span>
            <div className="w-8 h-0.5 bg-primary/40 mt-2 rounded-full" />
          </motion.div>
          
          <motion.div 
            className="mt-4 space-y-1.5 w-full px-2"
            animate={{ z: isHovered ? 10 : 0 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="h-1.5 bg-foreground/10 rounded-full" />
            <div className="h-1.5 bg-foreground/8 rounded-full w-5/6" />
            <div className="h-1.5 bg-foreground/6 rounded-full w-4/6" />
          </motion.div>
          
          {/* Decorative image placeholder */}
          <motion.div
            className="mt-4 w-20 h-12 rounded bg-primary/10 border border-primary/20"
            animate={{ z: isHovered ? 15 : 0 }}
            style={{ transformStyle: "preserve-3d" }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export function PhaseConclusion({ scrollProgress }: PhaseConclusionProps) {
  // Track progress for counter animations
  const [currentProgress, setCurrentProgress] = React.useState(0)
  
  React.useEffect(() => {
    const unsubscribe = scrollProgress.on("change", (v) => {
      setCurrentProgress(v)
    })
    return () => unsubscribe()
  }, [scrollProgress])

  // MacBook reappears for insights
  const insightsMacOpacity = useTransform(
    scrollProgress,
    [0.82, 0.86, 0.92, 0.94],
    [0, 1, 1, 0]
  )
  const insightsMacScale = useTransform(
    scrollProgress,
    [0.82, 0.86, 0.92, 0.94],
    [0.95, 1, 1, 0.95]
  )

  // Insights voice bubble
  const insightsVoiceOpacity = useTransform(
    scrollProgress,
    [0.84, 0.87, 0.91, 0.93],
    [0, 1, 1, 0]
  )
  const insightsVoiceY = useTransform(
    scrollProgress,
    [0.84, 0.87],
    [10, 0]
  )

  // Journal section
  const journalOpacity = useTransform(
    scrollProgress,
    [0.90, 0.93, 0.95, 0.96],
    [0, 1, 1, 0]
  )

  // CTA section
  const ctaOpacity = useTransform(scrollProgress, [0.94, 0.97], [0, 1])
  const ctaScale = useTransform(scrollProgress, [0.94, 0.97], [0.9, 1])
  const ctaY = useTransform(scrollProgress, [0.94, 0.97], [30, 0])

  // Animated chart bars
  const bar1 = useTransform(scrollProgress, [0.84, 0.88], ["0%", "85%"])
  const bar2 = useTransform(scrollProgress, [0.85, 0.89], ["0%", "62%"])
  const bar3 = useTransform(scrollProgress, [0.86, 0.90], ["0%", "94%"])
  const bar4 = useTransform(scrollProgress, [0.87, 0.91], ["0%", "47%"])

  const isStatsVisible = currentProgress > 0.86

  return (
    <div className="w-[80vw] h-full shrink-0 relative">
      {/* Insights Dashboard */}
      <div className="absolute left-[5vw] top-0 h-full flex items-center">
        <div className="relative">
          <MacBookFrame opacity={insightsMacOpacity} scale={insightsMacScale}>
            <div className="w-full h-full flex flex-col p-6">
              {/* Dashboard header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-serif text-base font-semibold text-foreground">
                    Engagement Insights
                  </h3>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    Rhine Valley Route — Last 30 Days
                  </p>
                </div>
                <motion.div
                  animate={{ rotate: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <BarChart3 className="w-5 h-5 text-primary/60" />
                </motion.div>
              </div>

              {/* Chart bars with gradient and glow */}
              <div className="flex-1 flex flex-col justify-center gap-3">
                {[
                  { label: "Marksburg Castle", bar: bar1, pct: 85 },
                  { label: "Lorelei Rock", bar: bar2, pct: 62 },
                  { label: "Bacharach Village", bar: bar3, pct: 94 },
                  { label: "Drachenfels Ruins", bar: bar4, pct: 47 },
                ].map((item, i) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <span className="text-[9px] text-muted-foreground w-24 text-right shrink-0">
                      {item.label}
                    </span>
                    <div className="flex-1 h-5 bg-[rgba(255,255,255,0.04)] rounded overflow-hidden relative">
                      <motion.div
                        style={{ width: item.bar }}
                        className="h-full rounded relative"
                      >
                        <div 
                          className="absolute inset-0 rounded"
                          style={{
                            background: `linear-gradient(90deg, hsl(35 80% 45% / 0.4), hsl(35 80% 55% / 0.6))`,
                            boxShadow: "0 0 10px hsl(35 80% 55% / 0.3)"
                          }}
                        />
                      </motion.div>
                    </div>
                    <span className="text-[9px] text-primary/80 w-10 font-mono">
                      {item.pct}%
                    </span>
                  </div>
                ))}
              </div>

              {/* Stats row with animated counters */}
              <div className="flex justify-between mt-4 pt-3 border-t border-[var(--glass-border)]">
                {[
                  { label: "Total Interactions", value: 12847 },
                  { label: "Avg. Time per POI", value: 154, suffix: "s" },
                  { label: "Audio Listens", value: 8291 },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-sm font-semibold text-foreground">
                      <AnimatedCounter 
                        target={stat.value} 
                        suffix={stat.suffix || ""} 
                        isVisible={isStatsVisible}
                      />
                    </div>
                    <div className="text-[8px] text-muted-foreground uppercase tracking-wider mt-0.5">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </MacBookFrame>

          {/* Voice bubble */}
          <div className="absolute -bottom-4 -right-8 z-30">
            <VoiceBubble
              text="See what your guests truly cared about, and use it to improve every future voyage."
              opacity={insightsVoiceOpacity}
              y={insightsVoiceY}
            />
          </div>
        </div>
      </div>

      {/* Digital Journal Preview */}
      <div className="absolute left-[30vw] top-0 h-full flex items-center">
        <Journal3D opacity={journalOpacity} />
      </div>

      {/* Final CTA */}
      <div className="absolute left-[55vw] top-0 h-full flex items-center">
        <motion.div
          style={{ opacity: ctaOpacity, scale: ctaScale, y: ctaY }}
          className="flex flex-col items-center gap-8 text-center"
        >
          <div className="flex flex-col items-center gap-3">
            <span className="text-[10px] uppercase tracking-[0.4em] text-primary/60 font-sans">
              Ready to Transform Your Guest Experience?
            </span>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold leading-tight text-balance">
            <span className="shimmer-text">A Hill Is Just a Hill</span>
            <br />
            <span className="text-foreground">Until You Know Its Story</span>
          </h2>
          <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
            Join Viking, Scenic, and other premium operators who use Curated Lens
            to transform passive sightseeing into real-time location storytelling.
          </p>
          </div>

          <MagneticButton>
            Schedule a Private Demo
          </MagneticButton>

          {/* Social proof */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <Shield className="w-3 h-3 text-muted-foreground/40" />
              <p className="text-[10px] text-muted-foreground/60 uppercase tracking-[0.15em] font-sans">
                Trusted by 40+ premium operators worldwide
              </p>
            </div>
            {/* Logo placeholders */}
            <div className="flex gap-4 mt-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <div 
                  key={i}
                  className="w-12 h-4 rounded bg-muted/10 border border-muted/20"
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
