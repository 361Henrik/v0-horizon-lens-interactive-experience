"use client"

import { type MotionValue, useTransform, motion } from "framer-motion"
import { Compass, Headphones, Maximize2, HelpCircle } from "lucide-react"
import { IPhoneFrame } from "./device-frame"
import { VoiceBubble } from "./voice-bubble"

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
    screenTitle: "Marksburg Castle",
    screenSubtitle: "Built 1117 AD",
    screenDetail:
      "The only hilltop castle on the Rhine never destroyed. Tap to explore its 900-year story.",
  },
  {
    id: "audio",
    range: [0.61, 0.69] as [number, number],
    title: "Audio Storytelling",
    description: "Narrated tales so guests stay heads-up",
    voice:
      "Stories whispered, not typed, so your guests stay immersed in the scenery.",
    icon: Headphones,
    screenTitle: "Audio Guide",
    screenSubtitle: "Rhine Valley Chapter",
    screenDetail: "3:42 remaining",
  },
  {
    id: "panoramic",
    range: [0.69, 0.77] as [number, number],
    title: "Panoramic Deep-Dive",
    description: "Landscape mode reveals the full story",
    voice: "The full story, in cinematic widescreen.",
    icon: Maximize2,
    screenTitle: "Panoramic View",
    screenSubtitle: "Rotate for immersive experience",
    screenDetail: "Interactive overlay with historical annotations",
  },
  {
    id: "safeguard",
    range: [0.77, 0.84] as [number, number],
    title: "Soft Truth Safeguard",
    description: "Tap an unmarked area for honest boundaries",
    voice:
      "Honest AI. If we do not have a verified story, we say so. No hallucinations.",
    icon: HelpCircle,
    screenTitle: "No Story Here (Yet)",
    screenSubtitle: "Unmarked Location",
    screenDetail:
      "No approved POI at this location. Tap to save this spot for future content.",
  },
]

function PhoneScreenContent({
  experience,
  opacity,
}: {
  experience: (typeof experiences)[0]
  opacity: MotionValue<number>
}) {
  const Icon = experience.icon
  const isAudio = experience.id === "audio"
  const isSafeguard = experience.id === "safeguard"

  return (
    <motion.div
      style={{ opacity }}
      className="absolute inset-0 flex flex-col items-center justify-center p-5 text-center"
    >
      {/* Top status bar mockup */}
      <div className="absolute top-10 left-0 right-0 flex justify-between px-4">
        <span className="text-[8px] text-foreground/40 font-mono">9:41</span>
        <span className="text-[8px] text-primary/60 font-mono">
          Horizon Lens
        </span>
      </div>

      <div
        className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-3 ${
          isSafeguard
            ? "bg-muted/30 border border-muted-foreground/20"
            : "bg-primary/20 border border-primary/30"
        }`}
      >
        <Icon
          className={`w-5 h-5 ${isSafeguard ? "text-muted-foreground" : "text-primary"}`}
        />
      </div>

      <h4 className="font-serif text-sm font-semibold text-foreground">
        {experience.screenTitle}
      </h4>
      <p className="text-[9px] text-primary/70 mt-0.5 uppercase tracking-wider">
        {experience.screenSubtitle}
      </p>
      <p className="text-[9px] text-muted-foreground mt-2 leading-relaxed max-w-[170px]">
        {experience.screenDetail}
      </p>

      {isAudio && (
        <div className="flex items-end gap-[2px] mt-3 h-6">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-[3px] bg-primary/60 rounded-full"
              animate={{ height: [3, Math.random() * 18 + 3, 3] }}
              transition={{
                duration: 0.8 + Math.random() * 0.4,
                repeat: Infinity,
                delay: i * 0.05,
              }}
            />
          ))}
        </div>
      )}

      <div
        className={`mt-3 px-3 py-1 rounded-full text-[9px] font-sans uppercase tracking-wider ${
          isSafeguard
            ? "border border-muted-foreground/30 text-muted-foreground"
            : "border border-primary/30 text-primary bg-primary/10"
        }`}
      >
        {isSafeguard ? "Save for later" : "Explore"}
      </div>
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
          <div className="relative w-full h-full">
            {experiences.map((exp) => (
              <PhoneScreenForExperience
                key={exp.id}
                experience={exp}
                scrollProgress={scrollProgress}
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

function PhoneScreenForExperience({
  experience,
  scrollProgress,
}: {
  experience: (typeof experiences)[0]
  scrollProgress: MotionValue<number>
}) {
  const [start, end] = experience.range
  const opacity = useTransform(
    scrollProgress,
    [start, start + 0.015, end - 0.015, end],
    [0, 1, 1, 0]
  )
  return <PhoneScreenContent experience={experience} opacity={opacity} />
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

  const isLeft = index % 2 === 0

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {/* Title label */}
      <motion.div
        style={{ opacity: titleOpacity }}
        className={`absolute top-[18%] ${isLeft ? "left-[8%]" : "right-[8%]"}`}
      >
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-[0.2em] text-primary/60 font-sans">
            {`0${index + 1}`}
          </span>
          <h3 className="font-serif text-xl text-foreground font-semibold">
            {experience.title}
          </h3>
          <p className="text-xs text-muted-foreground max-w-[200px]">
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
