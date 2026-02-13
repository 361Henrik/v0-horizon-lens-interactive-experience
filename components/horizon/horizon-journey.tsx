"use client"

import { useRef } from "react"
import { useScroll, useTransform, motion } from "framer-motion"
import { VerticalSelector } from "./vertical-selector"
import { PhaseOlga } from "./phase-olga"
import { PhaseTransition } from "./phase-transition"
import { PhaseHelmut } from "./phase-helmut"
import { PhaseConclusion } from "./phase-conclusion"
import { ProgressBar } from "./progress-bar"

const TOTAL_WIDTH_VW = 600

export function HorizonJourney() {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  // Convert vertical scroll to horizontal translation
  const translatePercent = ((TOTAL_WIDTH_VW - 100) / TOTAL_WIDTH_VW) * 100
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", `-${translatePercent}%`]
  )

  // Parallax: background moves at 35% speed
  const bgX = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", `-${translatePercent * 0.35}%`]
  )

  return (
    <div
      ref={containerRef}
      style={{ height: `${TOTAL_WIDTH_VW}vh`, position: "relative" }}
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen w-screen overflow-hidden">
        {/* Background parallax layer */}
        <motion.div
          style={{ x: bgX }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="h-full flex" style={{ width: `${TOTAL_WIDTH_VW * 2}vw` }}>
            {Array.from({ length: Math.ceil(TOTAL_WIDTH_VW / 80) }).map(
              (_, i) => (
                <div
                  key={i}
                  className="h-full shrink-0"
                  style={{
                    width: "160vw",
                    backgroundImage: "url(/images/hero-bg.jpeg)",
                    backgroundSize: "cover",
                    backgroundPosition: `${(i * 20) % 100}% 60%`,
                  }}
                />
              )
            )}
          </div>
        </motion.div>

        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-background/55 pointer-events-none" />

        {/* Vignette effect */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 30%, hsl(220 20% 8% / 0.8) 100%)",
          }}
        />

        {/* Subtle top/bottom gradient bands */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background/80 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" />

        {/* Main horizontal content strip */}
        <motion.div
          style={{ x }}
          className="absolute top-0 left-0 h-full flex"
        >
          {/* Segment 0: Landing Selector */}
          <VerticalSelector scrollProgress={scrollYProgress} />

          {/* Segment 1: Phase I - Olga Architect */}
          <PhaseOlga scrollProgress={scrollYProgress} />

          {/* Segment 2: Phase II - Publishing Transition */}
          <PhaseTransition scrollProgress={scrollYProgress} />

          {/* Segment 3: Phase III - Helmut Experience */}
          <PhaseHelmut scrollProgress={scrollYProgress} />

          {/* Segment 4: Phase IV - Conclusion & CTA */}
          <PhaseConclusion scrollProgress={scrollYProgress} />
        </motion.div>

        {/* Progress bar (fixed UI) */}
        <ProgressBar scrollProgress={scrollYProgress} />
      </div>
    </div>
  )
}
