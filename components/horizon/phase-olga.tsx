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
import {
  RouteMapScreen,
  POIListScreen,
  ContentTiersScreen,
  ToneSliderScreen,
  ReviewScreen,
  PublishScreen,
} from "./screen-content"
import { useI18n } from "@/lib/i18n"

interface PhaseOlgaProps {
  scrollProgress: MotionValue<number>
}

const FEATURE_RANGES: Record<string, [number, number]> = {
  route:   [0.08, 0.16],
  poi:     [0.16, 0.23],
  content: [0.23, 0.30],
  tone:    [0.30, 0.36],
  review:  [0.36, 0.41],
  publish: [0.41, 0.45],
}

const FEATURE_ICONS = {
  route:   Map,
  poi:     MapPin,
  content: Layers,
  tone:    SlidersHorizontal,
  review:  ShieldCheck,
  publish: Rocket,
}

const FEATURE_SCREENS = {
  route:   RouteMapScreen,
  poi:     POIListScreen,
  content: ContentTiersScreen,
  tone:    ToneSliderScreen,
  review:  ReviewScreen,
  publish: PublishScreen,
}

export function PhaseOlga({ scrollProgress }: PhaseOlgaProps) {
  const { t } = useI18n()

  const features = (Object.keys(FEATURE_RANGES) as Array<keyof typeof FEATURE_RANGES>).map((id) => ({
    id,
    range: FEATURE_RANGES[id],
    title: t.phaseOlga.features[id as keyof typeof t.phaseOlga.features].title,
    description: t.phaseOlga.features[id as keyof typeof t.phaseOlga.features].description,
    voice: t.phaseOlga.features[id as keyof typeof t.phaseOlga.features].voice,
    icon: FEATURE_ICONS[id as keyof typeof FEATURE_ICONS],
    ScreenComponent: FEATURE_SCREENS[id as keyof typeof FEATURE_SCREENS],
  }))
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
        <div className="w-full h-full relative overflow-hidden rounded-sm">
          {features.map((feature) => (
            <ScreenPanel
              key={feature.id}
              feature={feature}
              scrollProgress={scrollProgress}
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

type FeatureItem = {
  id: string
  range: [number, number]
  title: string
  description: string
  voice: string
  icon: React.ComponentType<{ className?: string }>
  ScreenComponent: React.ComponentType<{ progress: number }>
}

function ScreenPanel({
  feature,
  scrollProgress,
}: {
  feature: FeatureItem
  scrollProgress: MotionValue<number>
}) {
  const [start, end] = feature.range
  const opacity = useTransform(
    scrollProgress,
    [start, start + 0.015, end - 0.015, end],
    [0, 1, 1, 0]
  )

  // Calculate inner progress for screen animations (0 to 1 within the range)
  const innerProgress = useTransform(scrollProgress, [start, end], [0, 1])
  const ScreenComponent = feature.ScreenComponent

  return (
    <motion.div
      style={{ opacity }}
      className="absolute inset-0"
    >
      <ScreenPanelContent 
        ScreenComponent={ScreenComponent} 
        scrollProgress={scrollProgress}
        range={feature.range}
      />
    </motion.div>
  )
}

function ScreenPanelContent({
  ScreenComponent,
  scrollProgress,
  range,
}: {
  ScreenComponent: React.ComponentType<{ progress: number }>
  scrollProgress: MotionValue<number>
  range: [number, number]
}) {
  const [start, end] = range
  const progress = useTransform(scrollProgress, [start, end], [0, 1])
  
  // Use state to track the current progress value
  const [currentProgress, setCurrentProgress] = React.useState(0)
  
  React.useEffect(() => {
    const unsubscribe = progress.on("change", (v) => {
      setCurrentProgress(Math.min(1, Math.max(0, v)))
    })
    return () => unsubscribe()
  }, [progress])

  return <ScreenComponent progress={currentProgress} />
}

// Need to import React for the hooks
import * as React from "react"

function FeatureCallout({
  feature,
  scrollProgress,
  index,
}: {
  feature: FeatureItem
  scrollProgress: MotionValue<number>
  index: number
}) {
  const [start, end] = feature.range

  const calloutOpacity = useTransform(
    scrollProgress,
    [start, start + 0.02, end - 0.02, end],
    [0, 1, 1, 0]
  )
  const calloutX = useTransform(
    scrollProgress,
    [start, start + 0.02, end - 0.02, end],
    [60, 0, 0, -60]
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

  // Calculate callout position based on index
  const positions = [
    { top: "top-[14%]", left: "left-[6%]" },
    { top: "bottom-[18%]", left: "right-[6%]" },
    { top: "top-[18%]", left: "right-[8%]" },
    { top: "bottom-[14%]", left: "left-[8%]" },
    { top: "top-[16%]", left: "left-[6%]" },
    { top: "bottom-[16%]", left: "right-[6%]" },
  ]
  const pos = positions[index]

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {/* Callout bubble with flowing animation */}
      <motion.div
        style={{ opacity: calloutOpacity, x: calloutX, scale: calloutScale }}
        className={`absolute ${pos.top} ${pos.left}`}
      >
        <motion.div 
          className="glass-panel rounded-xl p-4 max-w-[300px] relative"
          whileHover={{ scale: 1.02 }}
        >
          {/* Animated border glow */}
          <div className="absolute inset-0 rounded-xl border border-primary/20 animate-pulse" />
          
          <div className="flex items-start gap-3 relative">
            <motion.div 
              className="shrink-0 w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center"
              animate={{ 
                boxShadow: ["0 0 0px hsl(var(--primary) / 0.3)", "0 0 20px hsl(var(--primary) / 0.3)", "0 0 0px hsl(var(--primary) / 0.3)"]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Icon className="w-5 h-5 text-primary" />
            </motion.div>
            <div>
              <h4 className="font-serif text-sm font-semibold text-foreground leading-tight">
                {feature.title}
              </h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed mt-1.5">
                {feature.description}
              </p>
            </div>
          </div>
          
          {/* Connecting line hint */}
          <div className="absolute -right-4 top-1/2 w-4 h-px bg-gradient-to-r from-primary/40 to-transparent" />
        </motion.div>
      </motion.div>

      {/* Voice bubble */}
      <motion.div
        style={{ opacity: voiceOpacity }}
        className={`absolute ${isTop ? "bottom-[14%]" : "top-[14%]"} ${index % 2 === 0 ? "right-[8%]" : "left-[8%]"}`}
      >
        <VoiceBubble text={feature.voice} opacity={voiceOpacity} y={voiceY} />
      </motion.div>
    </div>
  )
}
