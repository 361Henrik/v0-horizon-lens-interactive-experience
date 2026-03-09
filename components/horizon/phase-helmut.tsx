"use client"

import * as React from "react"
import { type MotionValue, useTransform, motion, AnimatePresence } from "framer-motion"
import { IPhoneFrame } from "./device-frame"

// ---------------------------------------------------------------------------
// Shared image source — the single hero asset used as the environment scene.
// Every phone screen that acts as a camera view uses EXACTLY these values so
// the inner crop matches what the parallax background is showing.
// ---------------------------------------------------------------------------
const SCENE_IMAGE = "/images/hero-bg.jpeg"

// The outer parallax background is positioned at "?% 60%".
// We mirror that here so the phone feels like a window into the same scene.
// Portrait: show sky+castle centered (40% x, 38% y — castle in upper-right)
// Landscape: show the full width band at natural horizon line (50% x, 45% y)
const PORTRAIT_BG_POS = "62% 38%"   // castle stays upper-right of frame
const LANDSCAPE_BG_POS = "50% 45%"  // horizon-level panoramic strip

// ---------------------------------------------------------------------------
// POI Icons
// ---------------------------------------------------------------------------
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

function PoiCategoryPill({
  type, label, isActive, delay = 0, inView,
}: {
  type: string; label: string; isActive: boolean; delay?: number; inView: boolean
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
      <motion.div animate={isActive ? { scale: [1, 1.15, 1] } : {}} transition={{ duration: 1.8, repeat: Infinity }}>
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

// ---------------------------------------------------------------------------
// SCENE SCREENS
// Each screen that shows the environment uses PORTRAIT_BG_POS so it always
// matches the outer parallax. Scene 4 (landscape) uses LANDSCAPE_BG_POS and
// is rendered upright inside the rotated phone wrapper.
// ---------------------------------------------------------------------------

// Shared "live viewfinder" chrome for scenes that act as camera mode
function CameraViewfinder({
  bgPos,
  progress,
  children,
  label,
}: {
  bgPos: string
  progress: number
  children?: React.ReactNode
  label?: string
}) {
  return (
    <div className="w-full h-full relative overflow-hidden">
      {/* The environment image — positioned to match outer background */}
      <div
        className="absolute inset-0 bg-cover transition-all duration-700"
        style={{
          backgroundImage: `url(${SCENE_IMAGE})`,
          backgroundPosition: bgPos,
          transform: `scale(${1.04 + progress * 0.04})`,
          transformOrigin: "center center",
        }}
      />

      {/* Subtle dark layer for UI readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/75 via-background/20 to-background/30" />

      {/* Camera corner brackets (viewfinder aesthetic) */}
      <div className="absolute top-12 left-3 w-5 h-5 border-t-2 border-l-2 border-primary/60 rounded-tl" />
      <div className="absolute top-12 right-3 w-5 h-5 border-t-2 border-r-2 border-primary/60 rounded-tr" />
      <div className="absolute bottom-6 left-3 w-5 h-5 border-b-2 border-l-2 border-primary/60 rounded-bl" />
      <div className="absolute bottom-6 right-3 w-5 h-5 border-b-2 border-r-2 border-primary/60 rounded-br" />

      {/* Optional label top-right */}
      {label && (
        <div className="absolute top-[52px] inset-x-0 flex justify-center">
          <div className="px-2 py-0.5 rounded-full bg-background/60 border border-border/30 text-[7px] font-mono text-foreground/60 tracking-wider uppercase">
            {label}
          </div>
        </div>
      )}

      {children}
    </div>
  )
}

// Scene 1 — Discovery: phone shows viewfinder with "what is that?" prompt
function Scene1Screen({ progress }: { progress: number }) {
  return (
    <CameraViewfinder bgPos={PORTRAIT_BG_POS} progress={progress} label="Live Camera">
      {/* Status bar */}
      <div className="absolute top-0 inset-x-0 flex justify-between px-4 pt-10 pb-1">
        <span className="text-[8px] text-white/50 font-mono">9:41</span>
        <span className="text-[8px] text-primary/70 font-mono">Curated Lens</span>
      </div>

      {/* Scanning indicator anchored near the castle (upper-right area) */}
      <motion.div
        className="absolute top-[28%] right-[22%]"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {[0, 1].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/60"
            animate={{ scale: [1, 2.2], opacity: [0.7, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.9 }}
          />
        ))}
        <div className="w-3 h-3 rounded-full bg-primary/80 border-2 border-background" />
      </motion.div>

      {/* Question card at bottom */}
      <motion.div
        className="absolute bottom-8 inset-x-4"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: progress > 0.25 ? 1 : 0, y: progress > 0.25 ? 0 : 12 }}
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
    </CameraViewfinder>
  )
}

// Scene 2 — POI Detection: translucent AR overlay on top of live view
function Scene2Screen({ progress }: { progress: number }) {
  const pois = [
    { type: "history", label: "Marksburg Castle", distance: "0.2 km", conf: 98, x: "68%", y: "25%" },
    { type: "nature",  label: "Rhine Gorge",      distance: "0.4 km", conf: 95, x: "40%", y: "48%" },
    { type: "culture", label: "Medieval Village", distance: "1.1 km", conf: 91, x: "55%", y: "55%" },
    { type: "food",    label: "Vineyard Estate",  distance: "2.3 km", conf: 87, x: "25%", y: "40%" },
  ]

  return (
    <CameraViewfinder bgPos={PORTRAIT_BG_POS} progress={progress} label="AR Scan">
      {/* Status bar */}
      <div className="absolute top-0 inset-x-0 flex justify-between px-4 pt-10 pb-1">
        <span className="text-[8px] text-white/50 font-mono">9:41</span>
        <span className="text-[8px] text-primary/70 font-mono">Detecting POIs</span>
      </div>

      {/* AR pin labels positioned over the actual scenery */}
      {pois.map((poi, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: poi.x, top: poi.y, transform: "translate(-50%, -50%)" }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: progress > (i + 1) * 0.22 ? 1 : 0,
            scale:   progress > (i + 1) * 0.22 ? 1 : 0,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {/* Pulse ring */}
          <motion.div
            className="absolute inset-0 w-5 h-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/50"
            animate={{ scale: [1, 2], opacity: [0.6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <div className="w-5 h-5 rounded-full bg-primary/90 border-2 border-background flex items-center justify-center">
            <PoiIcon type={poi.type} className="w-2.5 h-2.5 text-background" />
          </div>
          {/* Label chip */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-background/85 backdrop-blur-sm px-1.5 py-0.5 rounded text-[7px] text-foreground whitespace-nowrap border border-border/30">
            {poi.label} · {poi.distance}
          </div>
        </motion.div>
      ))}

      {/* Confidence meter bottom strip */}
      <motion.div
        className="absolute bottom-6 inset-x-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: progress > 0.6 ? 1 : 0 }}
      >
        <div className="bg-background/75 backdrop-blur-sm rounded-xl p-2 border border-border/20 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse shrink-0" />
          <span className="text-[8px] text-primary font-mono">{pois.length} POIs detected</span>
          <span className="text-[7px] text-muted-foreground ml-auto font-mono">&gt;95% confidence</span>
        </div>
      </motion.div>
    </CameraViewfinder>
  )
}

// Scene 3 — Contextual Story: focused crop on castle, story card overlay
function Scene3Screen({ progress }: { progress: number }) {
  return (
    <CameraViewfinder bgPos={PORTRAIT_BG_POS} progress={progress} label="Story Mode">
      {/* Status bar */}
      <div className="absolute top-0 inset-x-0 flex justify-between px-4 pt-10 pb-1">
        <span className="text-[8px] text-white/50 font-mono">9:41</span>
        <span className="text-[8px] text-primary/70 font-mono">Marksburg Castle</span>
      </div>

      {/* Castle lock-on ring in upper-right where it appears in the image */}
      <motion.div
        className="absolute top-[20%] right-[18%] w-14 h-14 -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: progress > 0.1 ? 1 : 0, scale: progress > 0.1 ? 1 : 0.5 }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
      >
        <svg viewBox="0 0 56 56" className="w-full h-full" fill="none">
          <rect x="2" y="2" width="12" height="12" stroke="hsl(var(--primary))" strokeWidth="2" />
          <rect x="42" y="2" width="12" height="12" stroke="hsl(var(--primary))" strokeWidth="2" />
          <rect x="2" y="42" width="12" height="12" stroke="hsl(var(--primary))" strokeWidth="2" />
          <rect x="42" y="42" width="12" height="12" stroke="hsl(var(--primary))" strokeWidth="2" />
          <motion.circle
            cx="28" cy="28" r="6"
            fill="hsl(var(--primary) / 0.4)"
            stroke="hsl(var(--primary))"
            strokeWidth="1.5"
            animate={{ r: [6, 8, 6] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </svg>
      </motion.div>

      {/* Story card slides up from bottom */}
      <motion.div
        className="absolute bottom-5 inset-x-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: progress > 0.2 ? 1 : 0, y: progress > 0.2 ? 0 : 20 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-background/85 backdrop-blur-md rounded-xl p-3 border border-border/30">
          <h3 className="text-[12px] font-serif font-semibold text-foreground mb-1">Marksburg Castle</h3>
          <p className="text-[9px] text-muted-foreground leading-relaxed mb-2">
            The only Rhine hilltop fortress never destroyed. Standing since 1117 AD, it has silently watched
            centuries of empires rise and fall.
          </p>
          {/* Fact pills */}
          <div className="flex flex-wrap gap-1 mb-2">
            {["1117 AD", "Never destroyed", "UNESCO"].map((tag, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: progress > 0.45 + i * 0.1 ? 1 : 0, scale: progress > 0.45 + i * 0.1 ? 1 : 0.8 }}
                className="px-1.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[7px] text-primary"
              >
                {tag}
              </motion.div>
            ))}
          </div>
          <div className="flex gap-2">
            <button className="flex-1 py-1.5 rounded-lg bg-primary/20 border border-primary/30 text-[9px] text-primary font-sans">
              Audio Story
            </button>
            <button className="flex-1 py-1.5 rounded-lg border border-border/30 text-[9px] text-muted-foreground font-sans">
              Deep Dive
            </button>
          </div>
        </div>
      </motion.div>
    </CameraViewfinder>
  )
}

// Scene 4 — Panoramic / Landscape mode
// KEY FIX: The phone rotates -90deg in its parent wrapper.
// The content inside must be authored in portrait dimensions but visually
// fill a landscape viewport. We counter-rotate the image layer +90deg and
// use object-cover semantics so the horizon stays horizontal.
// Result: phone tilts sideways, but the image and all UI text remain upright.
function Scene4Screen({ progress }: { progress: number }) {
  const pins = [
    { x: "18%", y: "38%", label: "Keep Tower" },
    { x: "52%", y: "32%", label: "Great Hall"  },
    { x: "78%", y: "28%", label: "Rhine View"  },
  ]

  return (
    // Counter-rotate so everything stays upright after the phone wrapper rotates -90deg
    <div className="w-full h-full relative overflow-hidden" style={{ transform: "rotate(90deg)" }}>
      {/* 
        Image: use LANDSCAPE_BG_POS. The counter-rotation means this div is
        effectively wider than tall from the viewer's perspective — which gives
        the natural panoramic crop automatically.
      */}
      <div
        className="absolute inset-0 bg-cover transition-all duration-700"
        style={{
          backgroundImage: `url(${SCENE_IMAGE})`,
          backgroundPosition: `${50 + progress * 15}% ${LANDSCAPE_BG_POS.split(" ")[1]}`,
          transform: `scale(1.08)`,
          transformOrigin: "center center",
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/25 via-transparent to-background/70" />

      {/* Camera brackets */}
      <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-primary/60 rounded-tl" />
      <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-primary/60 rounded-tr" />
      <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-primary/60 rounded-bl" />
      <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-primary/60 rounded-br" />

      {/* Mode label */}
      <div className="absolute top-4 inset-x-0 flex justify-center">
        <div className="px-2 py-0.5 rounded-full bg-background/60 border border-border/30 text-[7px] font-mono text-foreground/60 uppercase tracking-wider">
          Panoramic Mode
        </div>
      </div>

      {/* Status bar */}
      <div className="absolute top-0 inset-x-0 flex justify-between px-4 pt-10 pb-1">
        <span className="text-[8px] text-white/50 font-mono">9:41</span>
        <span className="text-[8px] text-primary/70 font-mono">Landscape View</span>
      </div>

      {/* Annotation pins */}
      {pins.map((pin, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: pin.x, top: pin.y, transform: "translate(-50%, -50%)" }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale:   progress > (i + 1) * 0.28 ? 1 : 0,
            opacity: progress > (i + 1) * 0.28 ? 1 : 0,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="w-5 h-5 rounded-full bg-primary/90 border-2 border-background flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-background" />
          </div>
          <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-background/90 px-1.5 py-0.5 rounded text-[7px] text-foreground whitespace-nowrap border border-border/20">
            {pin.label}
          </div>
        </motion.div>
      ))}

      {/* Bottom strip */}
      <div className="absolute bottom-4 inset-x-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: progress > 0.4 ? 1 : 0 }}
          className="bg-background/75 backdrop-blur-sm rounded-xl p-2 border border-border/20"
        >
          <div className="text-[9px] font-serif text-foreground">Marksburg Castle — Full Story</div>
          <div className="text-[7px] text-muted-foreground mt-0.5">Explore every corner of the fortress</div>
        </motion.div>
      </div>
    </div>
  )
}

// Scene 5 — Local Connection: real photo card teasers
function Scene5Screen({ progress }: { progress: number }) {
  const cards = [
    { type: "experience", label: "Castle Tour",      detail: "Daily 10am–5pm",         price: "€18" },
    { type: "food",       label: "Vineyard Tasting", detail: "Private cellar experience", price: "€45" },
    { type: "local",      label: "Village Market",   detail: "Fresh produce & crafts",  price: "Free" },
    { type: "culture",    label: "Folk Concert",     detail: "Tonight 8pm riverside",   price: "€22" },
  ]

  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden">
      {/* Faint scene behind as ambient context */}
      <div
        className="absolute inset-0 bg-cover opacity-20"
        style={{ backgroundImage: `url(${SCENE_IMAGE})`, backgroundPosition: PORTRAIT_BG_POS }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/90 to-background/95" />

      {/* Content */}
      <div className="relative flex flex-col h-full p-3">
        <div className="flex justify-between px-1 pt-8 pb-2 shrink-0">
          <span className="text-[8px] text-foreground/40 font-mono">9:41</span>
          <span className="text-[8px] text-primary/60 font-mono">Nearby Experiences</span>
        </div>

        <div className="flex-1 space-y-1.5 overflow-hidden">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: progress > i * 0.22 ? 1 : 0, y: progress > i * 0.22 ? 0 : 8 }}
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
    </div>
  )
}

// ---------------------------------------------------------------------------
// Scenes definition
// ---------------------------------------------------------------------------
const scenes = [
  {
    id: "discovery",
    range: [0.53, 0.62] as [number, number],
    title: "Discovery",
    subtitle: "What is that castle on the hill?",
    narrative:
      "Your traveler sees the Rhine landscape and wonders what that glowing fortress on the hilltop might be. They raise their phone.",
    activeCategory: "history",
    Screen: Scene1Screen,
    isLandscape: false,
  },
  {
    id: "detection",
    range: [0.62, 0.70] as [number, number],
    title: "POI Detection",
    subtitle: "The system identifies landmarks",
    narrative:
      "Curated Lens overlays AR markers directly onto the live camera view, pinning every point of interest in real time.",
    activeCategory: "nature",
    Screen: Scene2Screen,
    isLandscape: false,
  },
  {
    id: "context",
    range: [0.70, 0.77] as [number, number],
    title: "Contextual Story",
    subtitle: "Stories, facts and history appear",
    narrative:
      "Rich verified content surfaces instantly — audio narration, quick facts, and deep dives anchored to the exact landmark in frame.",
    activeCategory: "culture",
    Screen: Scene3Screen,
    isLandscape: false,
  },
  {
    id: "exploration",
    range: [0.77, 0.83] as [number, number],
    title: "Panoramic Exploration",
    subtitle: "Landscape mode — full story",
    narrative:
      "Rotate to landscape for a cinematic deep-dive. The image stays level and correctly oriented as annotation pins appear over the scene.",
    activeCategory: "weather",
    Screen: Scene4Screen,
    isLandscape: true,
  },
  {
    id: "connection",
    range: [0.83, 0.88] as [number, number],
    title: "Local Connection",
    subtitle: "Experiences, tours, food nearby",
    narrative:
      "Beyond stories — curated local experiences, tours, and products surface from trusted operators connected to your route.",
    activeCategory: "experience",
    Screen: Scene5Screen,
    isLandscape: false,
  },
]

// ---------------------------------------------------------------------------
// PhoneScreenContent — single phone slot, swaps scene content
// ---------------------------------------------------------------------------
function PhoneScreenContent({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
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

// ---------------------------------------------------------------------------
// Narrative + Context panels
// ---------------------------------------------------------------------------
function SceneNarrativePanel({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  const [activeScene, setActiveScene] = React.useState(0)
  React.useEffect(() => {
    return scrollProgress.on("change", (v) => {
      for (let i = scenes.length - 1; i >= 0; i--) {
        if (v >= scenes[i].range[0]) { setActiveScene(i); return }
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

        <div className="grid grid-cols-2 gap-2">
          {[
            { type: "history",    label: "History"     },
            { type: "nature",     label: "Nature"      },
            { type: "food",       label: "Food"        },
            { type: "culture",    label: "Culture"     },
            { type: "experience", label: "Experiences" },
            { type: "local",      label: "Local"       },
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

        <div className="flex items-center gap-2">
          {scenes.map((s, i) => (
            <div
              key={s.id}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === activeScene ? "w-6 bg-primary" : i < activeScene ? "w-2 bg-primary/50" : "w-2 bg-muted/40"
              }`}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

function SceneContextPanel({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  const [activeScene, setActiveScene] = React.useState(0)
  React.useEffect(() => {
    return scrollProgress.on("change", (v) => {
      for (let i = scenes.length - 1; i >= 0; i--) {
        if (v >= scenes[i].range[0]) { setActiveScene(i); return }
      }
    })
  }, [scrollProgress])

  const contextContent = [
    { stat: "247",  label: "POIs detected",    sub: "along Rhine corridor"   },
    { stat: "4",    label: "Content layers",   sub: "per landmark"           },
    { stat: "98%",  label: "Confidence",       sub: "AI accuracy rate"       },
    { stat: "< 1s", label: "Response",         sub: "real-time detection"    },
    { stat: "360°", label: "Coverage",         sub: "panoramic exploration"  },
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
        <div className="glass-panel rounded-2xl p-4 text-center">
          <div className="font-serif text-4xl text-primary mb-1">{ctx.stat}</div>
          <div className="text-[10px] text-foreground font-sans font-medium">{ctx.label}</div>
          <div className="text-[9px] text-muted-foreground font-sans">{ctx.sub}</div>
        </div>

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
                animate={{ boxShadow: ["0 0 0px hsl(var(--primary) / 0)", "0 0 8px hsl(var(--primary) / 0.8)", "0 0 0px hsl(var(--primary) / 0)"] }}
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

// ---------------------------------------------------------------------------
// PhaseHelmut — main export
// ---------------------------------------------------------------------------
interface PhaseHelmutProps {
  scrollProgress: MotionValue<number>
}

export function PhaseHelmut({ scrollProgress }: PhaseHelmutProps) {
  const phaseStart = scenes[0].range[0]
  const phaseEnd   = scenes[scenes.length - 1].range[1]

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

  // Phone rotation — only for scene 4 (panoramic)
  // Rotate the phone body -90deg. Content inside counter-rotates +90deg
  // so the imagery and UI text stay upright (see Scene4Screen).
  const phoneRotate = useTransform(
    scrollProgress,
    [
      scenes[3].range[0],
      scenes[3].range[0] + 0.025,
      scenes[3].range[1] - 0.025,
      scenes[3].range[1],
    ],
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

      {/* CENTER: iPhone — opacity/scale wrapper, never translates */}
      <div className="relative z-20 flex items-center justify-center">
        <motion.div
          style={{ opacity: phoneOpacity, scale: phoneScale }}
          className="flex items-center justify-center"
        >
          {/* 
            Rotation wrapper: rotates the phone body around its own center.
            springConfig is applied via transition on the motion.div.
          */}
          <motion.div
            style={{ rotate: phoneRotate }}
            className="flex items-center justify-center"
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          >
            <IPhoneFrame>
              <div className="relative w-full h-full overflow-hidden rounded-[2rem]">
                <PhoneScreenContent scrollProgress={scrollProgress} />
              </div>
            </IPhoneFrame>
          </motion.div>
        </motion.div>

        {/* Ambient glow behind phone */}
        <motion.div style={{ opacity: phoneOpacity }} className="absolute inset-0 -z-10 pointer-events-none">
          <div
            className="absolute inset-[-40px] rounded-full"
            style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.08) 0%, transparent 70%)" }}
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
