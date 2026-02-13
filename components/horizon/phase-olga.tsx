"use client"

import { motion, type MotionValue, useTransform } from "framer-motion"
import {
  Map,
  MapPin,
  Layers,
  SlidersHorizontal,
  ShieldCheck,
  Rocket,
} from "lucide-react"
import { MacBookFrame } from "./device-frame"
import { VoiceBubble } from "./voice-bubble"

interface PhaseOlgaProps {
  scrollProgress: MotionValue<number>
}

const features = [
  {
    id: "route",
    range: [0.08, 0.16] as [number, number],
    title: "Geo-Bounded Corridor",
    description:
      "Define your exact route on a map. The AI scans only within your corridor, ensuring every story is relevant.",
    voice:
      "Draw the path your ship sails, and we'll find every story along the way.",
    icon: Map,
    screenTitle: "Route Definition",
    screenContent: "Interactive map with geo-bounded corridor overlay",
  },
  {
    id: "poi",
    range: [0.16, 0.23] as [number, number],
    title: "POI Discovery Engine",
    description:
      "Automated ingestion scans your corridor for castles, vineyards, villages, and landmarks.",
    voice:
      "The system discovers every point of interest your guests will wonder about.",
    icon: MapPin,
    screenTitle: "POI Ingestion",
    screenContent: "Auto-discovered landmarks populating the route",
  },
  {
    id: "content",
    range: [0.23, 0.30] as [number, number],
    title: "Content Baking Engine",
    description:
      "Four tiers: Quick Facts, Narrative Summaries, Deep Dives, and Panoramic overlays. All pre-baked.",
    voice:
      "From quick facts to cinematic deep-dives, every tier is pre-baked and ready.",
    icon: Layers,
    screenTitle: "Content Tiers",
    screenContent: "L0 through L3 content layers stacking",
  },
  {
    id: "tone",
    range: [0.30, 0.36] as [number, number],
    title: "Tone Calibration",
    description:
      "Slide between Formal Historian and Branded Luxury. Your brand voice infuses every word.",
    voice: "Dial in your brand's voice — from scholarly to indulgent.",
    icon: SlidersHorizontal,
    screenTitle: "Brand Voice",
    screenContent: "Tone slider from Formal Historian to Branded Luxury",
  },
  {
    id: "review",
    range: [0.36, 0.41] as [number, number],
    title: "Human Review Gate",
    description:
      "Nothing goes live without your explicit approval. Flag, edit, or approve every piece of content.",
    voice: "Nothing reaches your guests without your seal of approval.",
    icon: ShieldCheck,
    screenTitle: "Approval Queue",
    screenContent: "Content review and approval interface",
  },
  {
    id: "publish",
    range: [0.41, 0.45] as [number, number],
    title: "Publication Hub",
    description:
      "One-click publishing generates QR codes, web links, and offline packages instantly.",
    voice: "One click. Every channel. Instantly live.",
    icon: Rocket,
    screenTitle: "Publish & Distribute",
    screenContent: "QR code generation and multi-channel deployment",
  },
]

export function PhaseOlga({ scrollProgress }: PhaseOlgaProps) {
  const macOpacity = useTransform(
    scrollProgress,
    [0.06, 0.1, 0.43, 0.47],
    [0, 1, 1, 0]
  )
  const macScale = useTransform(
    scrollProgress,
    [0.06, 0.1, 0.43, 0.47],
    [0.95, 1, 1, 0.95]
  )

  return (
    <div className="w-[200vw] h-full shrink-0 relative flex items-center justify-center">
      {/* MacBook centered */}
      <MacBookFrame opacity={macOpacity} scale={macScale}>
        <div className="w-full h-full relative">
          {features.map((feature, i) => (
            <ScreenPanel
              key={feature.id}
              feature={feature}
              scrollProgress={scrollProgress}
              index={i}
            />
          ))}
        </div>
      </MacBookFrame>

      {/* Callouts floating around the device */}
      {features.map((feature, i) => (
        <FeatureCallout
          key={feature.id}
          feature={feature}
          scrollProgress={scrollProgress}
          index={i}
        />
      ))}
    </div>
  )
}

function ScreenPanel({
  feature,
  scrollProgress,
  index,
}: {
  feature: (typeof features)[0]
  scrollProgress: MotionValue<number>
  index: number
}) {
  const [start, end] = feature.range
  const opacity = useTransform(
    scrollProgress,
    [start, start + 0.015, end - 0.015, end],
    [0, 1, 1, 0]
  )

  const Icon = feature.icon
  const gradients = [
    "from-amber-500/20 to-amber-500/5",
    "from-sky-500/20 to-sky-500/5",
    "from-emerald-500/20 to-emerald-500/5",
    "from-orange-500/20 to-orange-500/5",
    "from-rose-500/20 to-rose-500/5",
    "from-teal-500/20 to-teal-500/5",
  ]

  return (
    <motion.div
      style={{ opacity }}
      className="absolute inset-0 flex flex-col items-center justify-center p-6"
    >
      <div
        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradients[index]} flex items-center justify-center mb-3`}
      >
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="font-serif text-base font-semibold text-foreground">
        {feature.screenTitle}
      </h3>
      <p className="text-[10px] text-muted-foreground mt-1 max-w-[260px] text-center">
        {feature.screenContent}
      </p>
      {/* Decorative progress bars */}
      <div className="w-full max-w-[240px] space-y-1.5 mt-4">
        <div className="h-1.5 bg-primary/20 rounded-full" />
        <div className="h-1.5 bg-primary/10 rounded-full w-3/4" />
        <div className="h-1.5 bg-primary/5 rounded-full w-1/2" />
      </div>
    </motion.div>
  )
}

function FeatureCallout({
  feature,
  scrollProgress,
  index,
}: {
  feature: (typeof features)[0]
  scrollProgress: MotionValue<number>
  index: number
}) {
  const [start, end] = feature.range

  const calloutOpacity = useTransform(
    scrollProgress,
    [start, start + 0.02, end - 0.02, end],
    [0, 1, 1, 0]
  )
  const calloutScale = useTransform(
    scrollProgress,
    [start, start + 0.02, end - 0.02, end],
    [0.85, 1, 1, 0.85]
  )
  const voiceOpacity = useTransform(
    scrollProgress,
    [start + 0.01, start + 0.03, end - 0.02, end],
    [0, 1, 1, 0]
  )
  const voiceY = useTransform(
    scrollProgress,
    [start + 0.01, start + 0.03],
    [10, 0]
  )

  const isTop = index % 2 === 0
  const Icon = feature.icon

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {/* Callout bubble */}
      <motion.div
        style={{ opacity: calloutOpacity, scale: calloutScale }}
        className={`absolute ${isTop ? "top-[12%]" : "bottom-[12%]"} ${index % 3 === 0 ? "left-[8%]" : index % 3 === 1 ? "right-[8%]" : "left-[12%]"}`}
      >
        <div className="glass-panel rounded-xl p-4 max-w-[280px]">
          <div className="flex items-start gap-3">
            <div className="shrink-0 w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Icon className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-semibold text-foreground leading-tight">
                {feature.title}
              </h4>
              <p className="text-[10px] text-muted-foreground leading-relaxed mt-1">
                {feature.description}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Voice bubble */}
      <motion.div
        style={{ opacity: voiceOpacity }}
        className={`absolute ${isTop ? "bottom-[14%]" : "top-[14%]"} ${index % 2 === 0 ? "right-[6%]" : "left-[6%]"}`}
      >
        <VoiceBubble text={feature.voice} opacity={voiceOpacity} y={voiceY} />
      </motion.div>
    </div>
  )
}
