"use client"

import * as React from "react"
import { type MotionValue, useTransform, motion, AnimatePresence } from "framer-motion"
import { IPhoneFrame } from "./device-frame"

// POI category icon system — minimalist SVG line icons
function PoiIcon({ type, className = "w-5 h-5" }: { type: string; className?: string }) {
  const icons: Record<string, React.ReactNode> = {
    history: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9,22 9,12 15,12 15,22" />
      </svg>
    ),
    nature: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M17 8C8 10 5.9 16.17 3.82 22" />
        <path d="M9.1 11.16C10.14 12.38 12.05 13.5 16 12.5" />
        <path d="M17 8c0-3.5-3-5-3-5S9.5 4.5 9.5 8c0 2.5 1.5 4.5 4.5 5" />
      </svg>
    ),
    food: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
        <line x1="6" y1="1" x2="6" y2="4" />
        <line x1="10" y1="1" x2="10" y2="4" />
        <line x1="14" y1="1" x2="14" y2="4" />
      </svg>
    ),
    culture: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    experience: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
      </svg>
    ),
    weather: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9z" />
      </svg>
    ),
    local: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  }
  return <>{icons[type] ?? icons.history}</>
}

// POI category pill with animated hover/active state
function PoiCategoryPill({
  type,
  label,
  isActive,
  delay = 0,
  inView,
}: {
  type: string
  label: string
  isActive: boolean
  delay?: number
  inView: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      transition={{ delay, type: "spring", stiffness: 400, damping: 25 }}
      className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-300 cursor-default select-none ${
        isActive
          ? "border-primary/60 bg-primary/15 text-primary"
          : "border-border/30 bg-muted/10 text-muted-foreground hover:border-primary/30 hover:text-foreground"
      }`}
    >
      <motion.div
        animate={isActive ? { scale: [1, 1.15, 1] } : {}}
        transition={{ duration: 1.8, repeat: Infinity }}
      >
        <PoiIcon type={type} className="w-4 h-4" />
      </motion.div>
      <span className="text-[11px] font-sans">{label}</span>
      {isActive && (
        <motion.div
          layoutId="activePill"
          className="w-1.5 h-1.5 rounded-full bg-primary ml-auto"
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
      )}
    </motion.div>
  )
}

// --- PHONE SCREEN CONTENT for each scene ---

function Scene1Screen({ progress }: { progress: number }) {
  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-card to-background relative overflow-hidden">
      {/* Status bar */}
      <div className="flex justify-between px-4 pt-10 pb-2 shrink-0">
        <span className="text-[8px] text-foreground/40 font-mono">9:41</span>
        <span className="text-[8px] text-primary/60 font-mono">Curated Lens</span>
      </div>

      {/* Background landscape photo */}
      <div className="flex-1 relative mx-3 rounded-2xl overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center scale-110"
          style={{
            backgroundImage: "url(/images/hero-bg.jpeg)",
            transform: `scale(${1.1 + progress * 0.05})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

        {/* Question overlay */}
        <motion.div
          className="absolute bottom-4 inset-x-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: progress > 0.3 ? 1 : 0, y: progress > 0.3 ? 0 : 10 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-background/80 backdrop-blur-sm rounded-xl p-3 border border-border/30">
            <p className="text-[11px] text-foreground font-sans">
              &ldquo;What is that castle on the hill?&rdquo;
            </p>
            <div className="mt-2 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[9px] text-primary/70 font-mono">Scanning surroundings...</span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="px-4 pb-4 pt-2 shrink-0">
        <div className="text-[9px] text-muted-foreground font-sans text-center">Tap anything you see</div>
      </div>
    </div>
  )
}

function Scene2Screen({ progress }: { progress: number }) {
  const pois = [
    { type: "history", label: "Marksburg Castle", distance: "0.2 km", conf: 98 },
    { type: "nature", label: "Rhine Gorge", distance: "0.4 km", conf: 95 },
    { type: "culture", label: "Medieval Village", distance: "1.1 km", conf: 91 },
    { type: "food", label: "Vineyard Estate", distance: "2.3 km", conf: 87 },
  ]

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-card to-background p-3 relative">
      <div className="flex justify-between px-1 pt-8 pb-3 shrink-0">
        <span className="text-[8px] text-foreground/40 font-mono">9:41</span>
        <span className="text-[8px] text-primary/60 font-mono">Detecting POIs</span>
      </div>

      {/* Detection pulse ring */}
      <motion.div
        className="relative w-16 h-16 mx-auto mb-3 shrink-0"
        animate={{ opacity: 1 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border border-primary/40"
            animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.65 }}
          />
        ))}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-primary/60" />
          </div>
        </div>
      </motion.div>

      <div className="flex-1 space-y-1.5 overflow-hidden">
        {pois.map((poi, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 16 }}
            animate={{
              opacity: progress > (i + 1) * 0.22 ? 1 : 0,
              x: progress > (i + 1) * 0.22 ? 0 : 16,
            }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 px-2.5 py-2 rounded-xl bg-muted/20 border border-border/20"
          >
            <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center text-primary shrink-0">
              <PoiIcon type={poi.type} className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-medium text-foreground truncate">{poi.label}</div>
              <div className="text-[8px] text-muted-foreground">{poi.distance}</div>
            </div>
            <div className="text-[8px] text-primary/70 font-mono shrink-0">{poi.conf}%</div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function Scene3Screen({ progress }: { progress: number }) {
  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-card to-background relative overflow-hidden">
      <div className="flex justify-between px-4 pt-10 pb-2 shrink-0">
        <span className="text-[8px] text-foreground/40 font-mono">9:41</span>
        <span className="text-[8px] text-primary/60 font-mono">Marksburg Castle</span>
      </div>

      {/* Hero image */}
      <div className="mx-3 h-28 rounded-xl overflow-hidden relative shrink-0">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(/images/hero-bg.jpeg)" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        <div className="absolute bottom-2 left-3">
          <span className="text-[8px] uppercase tracking-wider text-primary/80 font-sans">History</span>
        </div>
      </div>

      {/* Story text */}
      <motion.div
        className="flex-1 px-3 pt-3 space-y-2 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: progress > 0.25 ? 1 : 0 }}
        transition={{ duration: 0.6 }}
      >
        <h3 className="text-[12px] font-serif font-semibold text-foreground">Marksburg Castle</h3>
        <p className="text-[9px] text-muted-foreground leading-relaxed">
          The only Rhine hilltop fortress never destroyed. Standing since 1117 AD, it has silently watched
          centuries of empires rise and fall along this valley.
        </p>

        {/* Quick fact pills */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {["1117 AD", "Never destroyed", "Rhine gorge", "UNESCO site"].map((tag, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: progress > 0.4 + i * 0.1 ? 1 : 0, scale: progress > 0.4 + i * 0.1 ? 1 : 0.8 }}
              className="px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[8px] text-primary"
            >
              {tag}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Action row */}
      <motion.div
        className="px-3 pb-5 pt-2 flex gap-2 shrink-0"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: progress > 0.6 ? 1 : 0, y: progress > 0.6 ? 0 : 10 }}
      >
        <button className="flex-1 py-2 rounded-xl bg-primary/20 border border-primary/30 text-[9px] text-primary font-sans">
          Audio Story
        </button>
        <button className="flex-1 py-2 rounded-xl border border-border/30 text-[9px] text-muted-foreground font-sans">
          Deep Dive
        </button>
      </motion.div>
    </div>
  )
}

function Scene4Screen({ progress }: { progress: number }) {
  // Landscape mode (panoramic deep-dive)
  const pins = [
    { x: 18, y: 28, label: "Keep Tower" },
    { x: 52, y: 40, label: "Great Hall" },
    { x: 78, y: 33, label: "Rhine View" },
  ]

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-card to-background relative overflow-hidden">
      {/* Panoramic image */}
      <div className="flex-1 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover"
          style={{
            backgroundImage: "url(/images/hero-bg.jpeg)",
            backgroundPosition: `${progress * 30}% 40%`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/90" />

        {/* Annotation pins */}
        {pins.map((pin, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: progress > (i + 1) * 0.28 ? 1 : 0,
              opacity: progress > (i + 1) * 0.28 ? 1 : 0,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="w-5 h-5 rounded-full bg-primary/90 border-2 border-background flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-background" />
            </div>
            <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-background/90 px-1.5 py-0.5 rounded text-[7px] text-foreground whitespace-nowrap">
              {pin.label}
            </div>
          </motion.div>
        ))}

        {/* "Rotate" label in landscape mode */}
        <div className="absolute top-3 inset-x-0 flex justify-center">
          <div className="px-2 py-1 rounded-full bg-background/70 text-[7px] text-foreground border border-border/30">
            Panoramic View — Landscape Mode
          </div>
        </div>
      </div>

      {/* Bottom info strip */}
      <div className="px-3 py-2 shrink-0">
        <div className="text-[9px] font-serif text-foreground">Marksburg Castle — Full Story</div>
        <div className="text-[8px] text-muted-foreground mt-0.5">Explore every corner of the fortress</div>
      </div>
    </div>
  )
}

function Scene5Screen({ progress }: { progress: number }) {
  const cards = [
    { type: "experience", label: "Castle Tour", detail: "Daily 10am–5pm", price: "€18" },
    { type: "food", label: "Vineyard Tasting", detail: "Private cellar experience", price: "€45" },
    { type: "local", label: "Village Market", detail: "Fresh produce & crafts", price: "Free" },
    { type: "culture", label: "Folk Concert", detail: "Tonight 8pm riverside", price: "€22" },
  ]

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-card to-background p-3">
      <div className="flex justify-between px-1 pt-8 pb-2 shrink-0">
        <span className="text-[8px] text-foreground/40 font-mono">9:41</span>
        <span className="text-[8px] text-primary/60 font-mono">Nearby Experiences</span>
      </div>

      <div className="flex-1 space-y-1.5 overflow-hidden">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{
              opacity: progress > i * 0.22 ? 1 : 0,
              y: progress > i * 0.22 ? 0 : 8,
            }}
            transition={{ duration: 0.35 }}
            className="flex items-center gap-2.5 p-2.5 rounded-xl border border-border/20 bg-muted/10"
          >
            <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center text-primary shrink-0">
              <PoiIcon type={card.type} className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-medium text-foreground">{card.label}</div>
              <div className="text-[8px] text-muted-foreground truncate">{card.detail}</div>
            </div>
            <div className="text-[9px] text-primary font-mono shrink-0">{card.price}</div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="mt-2 py-2 rounded-xl bg-primary/20 border border-primary/30 text-center text-[9px] text-primary font-sans shrink-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: progress > 0.8 ? 1 : 0 }}
      >
        Book Through Curated Lens
      </motion.div>
    </div>
  )
}

// Helper to convert a motion value to a React state number
function useProgressValue(mv: MotionValue<number>, range: [number, number]): number {
  const innerMv = useTransform(mv, range, [0, 1])
  const [val, setVal] = React.useState(0)
  React.useEffect(() => {
    const clamp = (v: number) => Math.min(1, Math.max(0, v))
    setVal(clamp(innerMv.get()))
    return innerMv.on("change", (v) => setVal(clamp(v)))
  }, [innerMv])
  return val
}

// The scenes definition
const scenes = [
  {
    id: "discovery",
    range: [0.53, 0.62] as [number, number],
    title: "Discovery",
    subtitle: "What is that mountain?",
    narrative:
      "Your traveler sees the Rhine landscape and wonders what that glowing castle on the hill might be.",
    leftCategory: { type: "history", label: "History" },
    activeCategory: "history",
    categories: ["history", "nature", "culture", "food", "experience", "weather", "local"],
    Screen: Scene1Screen,
    isLandscape: false,
  },
  {
    id: "detection",
    range: [0.62, 0.70] as [number, number],
    title: "POI Detection",
    subtitle: "The system identifies landmarks",
    narrative:
      "Curated Lens scans the surroundings in real time, detecting every point of interest within range.",
    leftCategory: { type: "nature", label: "Nature" },
    activeCategory: "nature",
    categories: ["history", "nature", "culture", "food", "experience", "weather", "local"],
    Screen: Scene2Screen,
    isLandscape: false,
  },
  {
    id: "context",
    range: [0.70, 0.77] as [number, number],
    title: "Contextual Story",
    subtitle: "Stories, facts and history appear",
    narrative:
      "Rich verified content surfaces instantly — audio narration, quick facts, and deep dives.",
    leftCategory: { type: "culture", label: "Culture" },
    activeCategory: "culture",
    categories: ["history", "nature", "culture", "food", "experience", "weather", "local"],
    Screen: Scene3Screen,
    isLandscape: false,
  },
  {
    id: "exploration",
    range: [0.77, 0.83] as [number, number],
    title: "Panoramic Exploration",
    subtitle: "Landscape mode, full story",
    narrative:
      "Rotate to landscape for a cinematic deep-dive with annotated panoramic view of the landmark.",
    leftCategory: { type: "weather", label: "Geography" },
    activeCategory: "weather",
    categories: ["history", "nature", "culture", "food", "experience", "weather", "local"],
    Screen: Scene4Screen,
    isLandscape: true,
  },
  {
    id: "connection",
    range: [0.83, 0.88] as [number, number],
    title: "Local Connection",
    subtitle: "Experiences, tours, food nearby",
    narrative:
      "Beyond stories — curated local experiences, tours, and products surface from trusted operators.",
    leftCategory: { type: "local", label: "Local" },
    activeCategory: "experience",
    categories: ["history", "nature", "culture", "food", "experience", "weather", "local"],
    Screen: Scene5Screen,
    isLandscape: false,
  },
]

// Single phone screen — switches content based on which scene is active
function PhoneScreenContent({
  scrollProgress,
}: {
  scrollProgress: MotionValue<number>
}) {
  const [activeScene, setActiveScene] = React.useState(0)
  const [sceneProgress, setSceneProgress] = React.useState(0)

  React.useEffect(() => {
    return scrollProgress.on("change", (v) => {
      for (let i = scenes.length - 1; i >= 0; i--) {
        const [start, end] = scenes[i].range
        if (v >= start) {
          setActiveScene(i)
          setSceneProgress(Math.min(1, Math.max(0, (v - start) / (end - start))))
          return
        }
      }
      setActiveScene(0)
      setSceneProgress(0)
    })
  }, [scrollProgress])

  const currentScene = scenes[activeScene]
  const Screen = currentScene.Screen

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentScene.id}
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Screen progress={sceneProgress} />
      </motion.div>
    </AnimatePresence>
  )
}

// Scene narrative panel (left side)
function SceneNarrativePanel({
  scrollProgress,
}: {
  scrollProgress: MotionValue<number>
}) {
  const [activeScene, setActiveScene] = React.useState(0)

  React.useEffect(() => {
    return scrollProgress.on("change", (v) => {
      for (let i = scenes.length - 1; i >= 0; i--) {
        if (v >= scenes[i].range[0]) {
          setActiveScene(i)
          return
        }
      }
    })
  }, [scrollProgress])

  const scene = scenes[activeScene]

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={scene.id}
        className="flex flex-col gap-6 max-w-xs"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 30 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Scene counter */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.3em] text-primary/60 font-sans">
            Scene {String(activeScene + 1).padStart(2, "0")}
          </span>
          <div className="flex-1 h-px bg-primary/20" />
        </div>

        <div>
          <h2 className="font-serif text-3xl font-semibold text-foreground leading-tight mb-2">
            {scene.title}
          </h2>
          <p className="text-sm text-primary/80 font-sans italic mb-3">
            &ldquo;{scene.subtitle}&rdquo;
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed font-sans">
            {scene.narrative}
          </p>
        </div>

        {/* POI category icons grid */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { type: "history", label: "History" },
            { type: "nature", label: "Nature" },
            { type: "food", label: "Food" },
            { type: "culture", label: "Culture" },
            { type: "experience", label: "Experiences" },
            { type: "local", label: "Local" },
          ].map((cat, i) => (
            <PoiCategoryPill
              key={cat.type}
              type={cat.type}
              label={cat.label}
              isActive={cat.type === scene.activeCategory}
              delay={i * 0.06}
              inView
            />
          ))}
        </div>

        {/* Scene dots */}
        <div className="flex items-center gap-2">
          {scenes.map((s, i) => (
            <div
              key={s.id}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === activeScene
                  ? "w-6 bg-primary"
                  : i < activeScene
                  ? "w-2 bg-primary/50"
                  : "w-2 bg-muted/40"
              }`}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

// Scene contextual panel (right side)
function SceneContextPanel({
  scrollProgress,
}: {
  scrollProgress: MotionValue<number>
}) {
  const [activeScene, setActiveScene] = React.useState(0)

  React.useEffect(() => {
    return scrollProgress.on("change", (v) => {
      for (let i = scenes.length - 1; i >= 0; i--) {
        if (v >= scenes[i].range[0]) {
          setActiveScene(i)
          return
        }
      }
    })
  }, [scrollProgress])

  const contextContent = [
    { stat: "247", label: "POIs detected", sub: "along Rhine corridor" },
    { stat: "4", label: "Content layers", sub: "per landmark" },
    { stat: "98%", label: "Confidence", sub: "AI accuracy rate" },
    { stat: "< 1s", label: "Response", sub: "real-time detection" },
    { stat: "360°", label: "Coverage", sub: "panoramic exploration" },
  ]

  const ctx = contextContent[activeScene] ?? contextContent[0]

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeScene}
        className="flex flex-col gap-4 max-w-[200px]"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Big stat */}
        <div className="glass-panel rounded-2xl p-4 text-center">
          <div className="font-serif text-4xl text-primary mb-1">{ctx.stat}</div>
          <div className="text-[10px] text-foreground font-sans font-medium">{ctx.label}</div>
          <div className="text-[9px] text-muted-foreground font-sans">{ctx.sub}</div>
        </div>

        {/* POI glow indicators */}
        <div className="space-y-2">
          {["Marksburg Castle", "Rhine Gorge", "St. Goar", "Vineyard"].map((name, i) => (
            <motion.div
              key={name}
              className="flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.08 }}
            >
              <motion.div
                className="w-2 h-2 rounded-full bg-primary shrink-0"
                animate={{
                  boxShadow: [
                    "0 0 0px hsl(var(--primary) / 0)",
                    "0 0 8px hsl(var(--primary) / 0.8)",
                    "0 0 0px hsl(var(--primary) / 0)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
              />
              <span className="text-[10px] text-muted-foreground font-sans">{name}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

interface PhaseHelmutProps {
  scrollProgress: MotionValue<number>
}

export function PhaseHelmut({ scrollProgress }: PhaseHelmutProps) {
  const phaseStart = scenes[0].range[0]
  const phaseEnd = scenes[scenes.length - 1].range[1]

  const phoneOpacity = useTransform(
    scrollProgress,
    [phaseStart - 0.03, phaseStart, phaseEnd, phaseEnd + 0.03],
    [0, 1, 1, 0]
  )
  const phoneScale = useTransform(
    scrollProgress,
    [phaseStart - 0.03, phaseStart, phaseEnd, phaseEnd + 0.03],
    [0.92, 1, 1, 0.92]
  )

  // Rotation: only for the panoramic scene (scene index 3), anchored at center
  const [isLandscape, setIsLandscape] = React.useState(false)
  React.useEffect(() => {
    return scrollProgress.on("change", (v) => {
      const panoramic = scenes[3]
      setIsLandscape(v >= panoramic.range[0] && v < panoramic.range[1])
    })
  }, [scrollProgress])

  const phoneRotate = useTransform(
    scrollProgress,
    [scenes[3].range[0], scenes[3].range[0] + 0.025, scenes[3].range[1] - 0.025, scenes[3].range[1]],
    [0, -90, -90, 0]
  )

  const panelOpacity = useTransform(
    scrollProgress,
    [phaseStart - 0.02, phaseStart + 0.01, phaseEnd - 0.01, phaseEnd + 0.02],
    [0, 1, 1, 0]
  )

  return (
    <div className="w-[160vw] h-full shrink-0 relative flex items-center justify-center">
      {/* Phase label */}
      <motion.div
        style={{ opacity: panelOpacity }}
        className="absolute top-8 left-1/2 -translate-x-1/2 z-30"
      >
        <span className="text-[10px] uppercase tracking-[0.4em] text-primary/50 font-sans">
          Phase III — Traveler Experience
        </span>
      </motion.div>

      {/* Left narrative panel */}
      <motion.div
        style={{ opacity: panelOpacity }}
        className="absolute left-[6vw] top-1/2 -translate-y-1/2 z-20"
      >
        <SceneNarrativePanel scrollProgress={scrollProgress} />
      </motion.div>

      {/* CENTER: iPhone — fixed and anchored, never moves */}
      <div className="relative z-20 flex items-center justify-center">
        <motion.div
          style={{ opacity: phoneOpacity, scale: phoneScale }}
          className="flex items-center justify-center"
        >
          {/* Rotation wrapper — rotates around the phone's own center */}
          <motion.div
            style={{ rotate: phoneRotate }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            className="flex items-center justify-center"
          >
            <IPhoneFrame>
              <div className="relative w-full h-full overflow-hidden rounded-[2rem]">
                <PhoneScreenContent scrollProgress={scrollProgress} />
              </div>
            </IPhoneFrame>
          </motion.div>
        </motion.div>

        {/* Ambient glow behind phone */}
        <motion.div
          style={{ opacity: phoneOpacity }}
          className="absolute inset-0 -z-10 pointer-events-none"
        >
          <div
            className="absolute inset-[-40px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, hsl(var(--primary) / 0.08) 0%, transparent 70%)",
            }}
          />
        </motion.div>
      </div>

      {/* Right context panel */}
      <motion.div
        style={{ opacity: panelOpacity }}
        className="absolute right-[6vw] top-1/2 -translate-y-1/2 z-20"
      >
        <SceneContextPanel scrollProgress={scrollProgress} />
      </motion.div>
    </div>
  )
}
