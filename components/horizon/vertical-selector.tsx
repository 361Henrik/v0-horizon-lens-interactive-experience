"use client"

import { useState, useEffect } from "react"
import { motion, type MotionValue, useTransform } from "framer-motion"
import { Ship, Anchor, Train } from "lucide-react"
import { ScrollHint } from "./scroll-hint"
import { useI18n } from "@/lib/i18n"

interface VerticalSelectorProps {
  scrollProgress: MotionValue<number>
  isReady?: boolean
}

function TypewriterText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayedText, setDisplayedText] = useState("")
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    setDisplayedText("")
    setIsComplete(false)
    const timeout = setTimeout(() => {
      let currentIndex = 0
      const interval = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayedText(text.slice(0, currentIndex))
          currentIndex++
        } else {
          clearInterval(interval)
          setIsComplete(true)
        }
      }, 40)
      return () => clearInterval(interval)
    }, delay)
    return () => clearTimeout(timeout)
  }, [text, delay])

  return (
    <span>
      {displayedText}
      {!isComplete && <span className="typewriter-cursor" />}
    </span>
  )
}

export function VerticalSelector({ scrollProgress, isReady = true }: VerticalSelectorProps) {
  const { t } = useI18n()
  const [showContent, setShowContent] = useState(false)

  const opacity = useTransform(scrollProgress, [0, 0.06], [1, 0])
  const y = useTransform(scrollProgress, [0, 0.06], [0, -40])
  const overlayOpacity = useTransform(scrollProgress, [0, 0.08], [0.7, 0.3])
  const hintOpacity = useTransform(scrollProgress, [0, 0.03], [1, 0])

  useEffect(() => {
    if (isReady) {
      const timer = setTimeout(() => setShowContent(true), 100)
      return () => clearTimeout(timer)
    }
  }, [isReady])

  const travelModes = [
    { key: "riverCruise" as const, icon: Ship, active: true },
    { key: "oceanCruise" as const, icon: Anchor, active: false },
    { key: "luxuryRail" as const, icon: Train, active: false },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.2 },
    },
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
  }
  const buttonVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.9 },
    visible: {
      opacity: 1, y: 0, scale: 1,
      transition: { type: "spring", stiffness: 400, damping: 25 },
    },
  }

  return (
    <div className="w-[100vw] h-full shrink-0 relative flex items-center justify-center">
      <motion.div
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 bg-background pointer-events-none z-10"
      />

      <motion.div
        style={{ opacity, y }}
        className="relative z-20 flex flex-col items-center gap-12 px-6"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={showContent ? "visible" : "hidden"}
          className="flex flex-col items-center gap-12"
        >
          <div className="flex flex-col items-center gap-4">
            <motion.span
              variants={itemVariants}
              className="text-[10px] uppercase tracking-[0.4em] text-primary/80 font-sans"
            >
              {t.landing.introducing}
            </motion.span>

            <motion.h1
              variants={itemVariants}
              className="font-serif text-5xl md:text-7xl font-semibold text-foreground text-center leading-tight"
            >
              <motion.span
                className="shimmer-text inline-block"
                initial={{ x: -60, opacity: 0 }}
                animate={showContent ? { x: 0, opacity: 1 } : {}}
                transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                Curated
              </motion.span>{" "}
              <motion.span
                className="text-foreground inline-block"
                initial={{ x: 60, opacity: 0 }}
                animate={showContent ? { x: 0, opacity: 1 } : {}}
                transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                Lens
              </motion.span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-sm md:text-base text-muted-foreground text-center max-w-md leading-relaxed font-sans"
            >
              {showContent && (
                <>
                  <TypewriterText text={t.landing.tagline} delay={800} />
                  <br />
                  <span className="text-foreground/60">{t.landing.subtitle}</span>
                </>
              )}
            </motion.p>
          </div>

          <motion.div variants={itemVariants} className="flex gap-4 flex-wrap justify-center">
            {travelModes.map((mode, index) => {
              const Icon = mode.icon
              const label = t.landing.modes[mode.key]
              return (
                <motion.button
                  key={mode.key}
                  variants={buttonVariants}
                  custom={index}
                  whileHover={mode.active ? { scale: 1.05, y: -4 } : {}}
                  whileTap={mode.active ? { scale: 0.98 } : {}}
                  className={`group relative flex flex-col items-center gap-3 px-6 py-4 rounded-xl border transition-all duration-300 ${
                    mode.active
                      ? "border-primary/40 bg-primary/10 gold-glow"
                      : "border-[var(--glass-border)] bg-[var(--glass)] hover:border-primary/20 opacity-50 cursor-not-allowed"
                  }`}
                  disabled={!mode.active}
                >
                  <Icon
                    className={`w-6 h-6 transition-transform duration-300 ${
                      mode.active ? "text-primary group-hover:scale-110" : "text-muted-foreground"
                    }`}
                  />
                  <span
                    className={`text-xs uppercase tracking-[0.15em] font-sans text-center ${
                      mode.active ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {label}
                  </span>
                  {mode.active && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full"
                    />
                  )}
                  {mode.active && <div className="absolute inset-0 rounded-xl pulse-ring" />}
                </motion.button>
              )
            })}
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-xs text-muted-foreground/60 uppercase tracking-[0.2em] font-sans text-center"
          >
            {t.landing.demoRoute}
          </motion.p>
        </motion.div>
      </motion.div>

      <ScrollHint opacity={hintOpacity} label={t.scrollHint} />
    </div>
  )
}
