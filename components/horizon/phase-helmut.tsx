"use client"

import * as React from "react"
import { type MotionValue, useTransform, motion } from "framer-motion"
import { Compass, Headphones, Maximize2, HelpCircle } from "lucide-react"
import { IPhoneFrame } from "./device-frame"
import { VoiceBubble } from "./voice-bubble"
import { ProximityScreen, AudioPlayerScreen } from "./screen-content"

interface PhaseHelmutProps {
  scrollProgress: MotionValue<number>
}

const experiences = [
  {
    id: "proximity",
    range: [0.53, 0.61] as [number, number],
    title: "Proximity Discovery",
    description: "What is that castle on the hill?",
    voice: "Curiosity satisfied in seconds, without breaking the moment.",
    icon: Compass,
  },
  {
    id: "audio",
    range: [0.61, 0.69] as [number, number],
    title: "Audio Storytelling",
    description: "Narrated tales so guests stay heads-up",
    voice:
      "Stories whispered, not typed, so your guests stay immersed in the scenery.",
    icon: Headphones,
  },
  {
    id: "panoramic",
    range: [0.69, 0.77] as [number, number],
    title: "Panoramic Deep-Dive",
    description: "Landscape mode reveals the full story",
    voice: "The full story, in cinematic widescreen.",
    icon: Maximize2,
  },
  {
    id: "safeguard",
    range: [0.77, 0.84] as [number, number],
    title: "Soft Truth Safeguard",
    description: "Tap an unmarked area for honest boundaries",
    voice:
      "Honest AI. If we do not have a verified story, we say so. No hallucinations.",
    icon: HelpCircle,
  },
]

function ProximityContent({ progress }: { progress: number }) {
  return (
    <div className="w-full h-full bg-gradient-to-br from-card to-background p-4 flex flex-col">
      {/* Status bar */}
      <div className="flex justify-between px-1 mb-3">
        <span className="text-[8px] text-foreground/40 font-mono">9:41</span>
        <span className="text-[8px] text-primary/60 font-mono">Horizon Lens</span>
      </div>

      {/* Notification toast */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: progress > 0.2 ? 0 : -20, opacity: progress > 0.2 ? 1 : 0 }}
        className="rounded-xl bg-muted/30 border border-border/30 p-3 mb-3"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Compass className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1">
            <div className="text-[10px] font-medium text-foreground">Marksburg Castle</div>
            <div className="text-[8px] text-primary/70">200m away</div>
          </div>
          <div className="px-2 py-0.5 rounded-full bg-primary/20 text-[8px] text-primary">Nearby</div>
        </div>
      </motion.div>
      
      {/* Expanded card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: progress > 0.5 ? 1 : 0.95, opacity: progress > 0.5 ? 1 : 0 }}
        className="flex-1 rounded-xl overflow-hidden border border-border/30 relative"
      >
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/images/hero-bg.jpeg)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        
        <div className="absolute bottom-0 inset-x-0 p-3">
          <div className="text-[11px] font-medium text-foreground mb-1">Marksburg Castle</div>
          <div className="text-[9px] text-muted-foreground leading-relaxed">
            The only hilltop castle on the Rhine never destroyed. Built 1117 AD.
          </div>
          <div className="mt-2 px-3 py-1 rounded-full bg-primary/20 text-[8px] text-primary inline-block border border-primary/30">
            Explore Story
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function AudioContent({ progress }: { progress: number }) {
  return (
    <div className="w-full h-full bg-gradient-to-br from-card to-background p-4 flex flex-col items-center justify-center">
      {/* Status bar */}
      <div className="absolute top-4 inset-x-4 flex justify-between">
        <span className="text-[8px] text-foreground/40 font-mono">9:41</span>
        <span className="text-[8px] text-primary/60 font-mono">Now Playing</span>
      </div>

      {/* Album art */}
      <div className="w-28 h-28 rounded-2xl overflow-hidden mb-4 relative shadow-2xl">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/images/hero-bg.jpeg)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        
        {/* Play button overlay */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center shadow-lg">
            <div className="w-0 h-0 border-l-[10px] border-l-background border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1" />
          </div>
        </motion.div>
      </div>
      
      <div className="text-center mb-3">
        <div className="text-[12px] font-medium text-foreground">Rhine Valley Chapter</div>
        <div className="text-[10px] text-primary/70">Marksburg Castle</div>
      </div>
      
      {/* Waveform */}
      <div className="flex items-end gap-[3px] h-10 mb-3">
        {Array.from({ length: 24 }).map((_, i) => (
          <motion.div
            key={i}
            className="w-[3px] bg-primary rounded-full"
            animate={{ height: [4, Math.random() * 28 + 6, 4] }}
            transition={{
              duration: 0.5 + Math.random() * 0.3,
              repeat: Infinity,
              delay: i * 0.04,
            }}
          />
        ))}
      </div>
      
      {/* Timeline */}
      <div className="w-full flex items-center gap-2 px-2">
        <span className="text-[9px] text-muted-foreground font-mono">1:18</span>
        <div className="flex-1 h-1.5 bg-muted/30 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-primary rounded-full"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <span className="text-[9px] text-muted-foreground font-mono">4:52</span>
      </div>
    </div>
  )
}

function PanoramicContent({ progress }: { progress: number }) {
  return (
    <div className="w-full h-full bg-gradient-to-br from-card to-background flex flex-col items-center justify-center relative overflow-hidden">
      {/* Wide landscape background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: "url(/images/hero-bg.jpeg)",
          transform: `scale(${1.1 + progress * 0.1})`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      
      {/* Annotation pins */}
      {[
        { x: 25, y: 30, label: "Castle Tower" },
        { x: 60, y: 45, label: "Village Square" },
        { x: 80, y: 35, label: "River Bend" },
      ].map((pin, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: progress > (i + 1) * 0.3 ? 1 : 0,
            opacity: progress > (i + 1) * 0.3 ? 1 : 0,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="relative">
            <div className="w-6 h-6 rounded-full bg-primary/90 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-background" />
            </div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 translate-y-full">
              <div className="bg-background/90 px-2 py-0.5 rounded text-[7px] text-foreground whitespace-nowrap">
                {pin.label}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
      
      {/* Rotate hint */}
      <motion.div
        className="absolute bottom-4 inset-x-0 flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: progress > 0.3 ? 1 : 0 }}
      >
        <div className="px-3 py-1.5 rounded-full bg-background/80 border border-border/30 flex items-center gap-2">
          <Maximize2 className="w-3 h-3 text-primary" />
          <span className="text-[9px] text-foreground">Rotate for immersive view</span>
        </div>
      </motion.div>
    </div>
  )
}

function SafeguardContent({ progress }: { progress: number }) {
  return (
    <div className="w-full h-full bg-gradient-to-br from-card to-background p-5 flex flex-col items-center justify-center">
      {/* Empty state illustration */}
      <motion.div
        className="w-20 h-20 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center mb-4"
        animate={{ 
          borderColor: ["hsl(var(--muted-foreground) / 0.3)", "hsl(var(--muted-foreground) / 0.5)", "hsl(var(--muted-foreground) / 0.3)"]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <HelpCircle className="w-8 h-8 text-muted-foreground/40" />
      </motion.div>
      
      <div className="text-center mb-4">
        <div className="text-[12px] font-medium text-foreground mb-1">No Story Here (Yet)</div>
        <div className="text-[10px] text-muted-foreground/70">Unmarked Location</div>
      </div>
      
      <p className="text-[10px] text-muted-foreground text-center leading-relaxed max-w-[180px] mb-4">
        No verified POI exists at this location. Our AI only shares confirmed stories.
      </p>
      
      <motion.button
        className="px-4 py-2 rounded-xl border border-muted-foreground/30 text-[10px] text-muted-foreground flex items-center gap-2"
        whileHover={{ scale: 1.02, borderColor: "hsl(var(--primary) / 0.5)" }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.div
          className="w-3 h-3"
          animate={{ scale: progress > 0.5 ? [1, 1.2, 1] : 1 }}
          transition={{ duration: 0.3 }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </motion.div>
        Save for later
      </motion.button>
    </div>
  )
}

function PhoneScreenForExperience({
  experienceId,
  scrollProgress,
  range,
}: {
  experienceId: string
  scrollProgress: MotionValue<number>
  range: [number, number]
}) {
  const [start, end] = range
  const opacity = useTransform(
    scrollProgress,
    [start, start + 0.015, end - 0.015, end],
    [0, 1, 1, 0]
  )
  
  const innerProgress = useTransform(scrollProgress, [start, end], [0, 1])
  const [currentProgress, setCurrentProgress] = React.useState(0)
  
  React.useEffect(() => {
    const unsubscribe = innerProgress.on("change", (v) => {
      setCurrentProgress(Math.min(1, Math.max(0, v)))
    })
    return () => unsubscribe()
  }, [innerProgress])

  const contentMap: Record<string, React.ReactNode> = {
    proximity: <ProximityContent progress={currentProgress} />,
    audio: <AudioContent progress={currentProgress} />,
    panoramic: <PanoramicContent progress={currentProgress} />,
    safeguard: <SafeguardContent progress={currentProgress} />,
  }

  return (
    <motion.div style={{ opacity }} className="absolute inset-0">
      {contentMap[experienceId]}
    </motion.div>
  )
}

export function PhaseHelmut({ scrollProgress }: PhaseHelmutProps) {
  const phoneOpacity = useTransform(
    scrollProgress,
    [0.49, 0.54, 0.82, 0.85],
    [0, 1, 1, 0]
  )
  const phoneScale = useTransform(
    scrollProgress,
    [0.49, 0.54, 0.82, 0.85],
    [0.9, 1, 1, 0.9]
  )

  // Panoramic rotation
  const phoneRotate = useTransform(
    scrollProgress,
    [0.68, 0.71, 0.75, 0.77],
    [0, -90, -90, 0]
  )
  const phoneViewScale = useTransform(
    scrollProgress,
    [0.68, 0.71, 0.75, 0.77],
    [1, 1.15, 1.15, 1]
  )

  return (
    <div className="w-[160vw] h-full shrink-0 relative flex items-center justify-center">
      {/* Centered iPhone */}
      <motion.div style={{ scale: phoneViewScale }} className="z-20">
        <IPhoneFrame
          opacity={phoneOpacity}
          scale={phoneScale}
          rotate={phoneRotate}
        >
          <div className="relative w-full h-full overflow-hidden rounded-[20px]">
            {experiences.map((exp) => (
              <PhoneScreenForExperience
                key={exp.id}
                experienceId={exp.id}
                scrollProgress={scrollProgress}
                range={exp.range}
              />
            ))}
          </div>
        </IPhoneFrame>
      </motion.div>

      {/* Overlays for each experience */}
      {experiences.map((exp, i) => (
        <ExperienceOverlay
          key={exp.id}
          experience={exp}
          scrollProgress={scrollProgress}
          index={i}
        />
      ))}
    </div>
  )
}

function ExperienceOverlay({
  experience,
  scrollProgress,
  index,
}: {
  experience: (typeof experiences)[0]
  scrollProgress: MotionValue<number>
  index: number
}) {
  const [start, end] = experience.range
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
  const titleOpacity = useTransform(
    scrollProgress,
    [start, start + 0.02, end - 0.02, end],
    [0, 1, 1, 0]
  )
  const titleX = useTransform(
    scrollProgress,
    [start, start + 0.02, end - 0.02, end],
    [40, 0, 0, -40]
  )

  const isLeft = index % 2 === 0
  const Icon = experience.icon

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {/* Title label with flowing animation */}
      <motion.div
        style={{ opacity: titleOpacity, x: titleX }}
        className={`absolute top-[18%] ${isLeft ? "left-[8%]" : "right-[8%]"}`}
      >
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <motion.div
              className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center"
              animate={{ 
                boxShadow: ["0 0 0px hsl(var(--primary) / 0.3)", "0 0 15px hsl(var(--primary) / 0.3)", "0 0 0px hsl(var(--primary) / 0.3)"]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Icon className="w-4 h-4 text-primary" />
            </motion.div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-primary/60 font-sans">
              {`0${index + 1}`}
            </span>
          </div>
          <h3 className="font-serif text-xl text-foreground font-semibold">
            {experience.title}
          </h3>
          <p className="text-xs text-muted-foreground max-w-[220px] leading-relaxed">
            {experience.description}
          </p>
        </div>
      </motion.div>

      {/* Voice bubble */}
      <motion.div
        style={{ opacity: voiceOpacity }}
        className={`absolute bottom-[16%] ${isLeft ? "right-[8%]" : "left-[8%]"}`}
      >
        <VoiceBubble
          text={experience.voice}
          opacity={voiceOpacity}
          y={voiceY}
        />
      </motion.div>
    </div>
  )
}
