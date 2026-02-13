"use client"

import { type MotionValue, useTransform, motion } from "framer-motion"
import { BarChart3, BookOpen, ArrowRight } from "lucide-react"
import { MacBookFrame } from "./device-frame"
import { VoiceBubble } from "./voice-bubble"

interface PhaseConclusionProps {
  scrollProgress: MotionValue<number>
}

export function PhaseConclusion({ scrollProgress }: PhaseConclusionProps) {
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
                <BarChart3 className="w-5 h-5 text-primary/60" />
              </div>

              {/* Chart bars */}
              <div className="flex-1 flex flex-col justify-center gap-3">
                {[
                  { label: "Marksburg Castle", bar: bar1, pct: "85%" },
                  { label: "Lorelei Rock", bar: bar2, pct: "62%" },
                  { label: "Bacharach Village", bar: bar3, pct: "94%" },
                  { label: "Drachenfels Ruins", bar: bar4, pct: "47%" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <span className="text-[9px] text-muted-foreground w-24 text-right shrink-0">
                      {item.label}
                    </span>
                    <div className="flex-1 h-4 bg-[rgba(255,255,255,0.04)] rounded-sm overflow-hidden">
                      <motion.div
                        style={{ width: item.bar }}
                        className="h-full bg-primary/40 rounded-sm"
                      />
                    </div>
                    <span className="text-[9px] text-primary/80 w-8 font-mono">
                      {item.pct}
                    </span>
                  </div>
                ))}
              </div>

              {/* Stats row */}
              <div className="flex justify-between mt-4 pt-3 border-t border-[var(--glass-border)]">
                {[
                  { label: "Total Interactions", value: "12,847" },
                  { label: "Avg. Time per POI", value: "2m 34s" },
                  { label: "Audio Listens", value: "8,291" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-sm font-semibold text-foreground font-mono">
                      {stat.value}
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
        <motion.div
          style={{ opacity: journalOpacity }}
          className="glass-panel rounded-xl p-6 max-w-sm"
        >
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-5 h-5 text-primary" />
            <div>
              <h4 className="font-serif text-sm font-semibold text-foreground">
                Digital Travel Journal
              </h4>
              <p className="text-[10px] text-muted-foreground">
                Branded keepsake for every guest
              </p>
            </div>
          </div>
          {/* Journal mockup */}
          <div className="aspect-[3/4] bg-[hsl(220,20%,6%)] rounded-lg border border-[var(--glass-border)] p-4 flex flex-col items-center justify-center">
            <span className="text-[10px] uppercase tracking-[0.3em] text-primary/60 font-sans">
              Rhine Valley
            </span>
            <span className="font-serif text-lg text-foreground mt-1">
              Your Journey
            </span>
            <div className="w-8 h-0.5 bg-primary/40 mt-2 rounded-full" />
            <div className="mt-4 space-y-1.5 w-full px-2">
              <div className="h-1.5 bg-foreground/10 rounded-full" />
              <div className="h-1.5 bg-foreground/8 rounded-full w-5/6" />
              <div className="h-1.5 bg-foreground/6 rounded-full w-4/6" />
            </div>
          </div>
        </motion.div>
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
            <h2 className="font-serif text-4xl md:text-5xl font-semibold text-foreground leading-tight text-balance">
              <span className="gold-text">Every Mile,</span>
              <br />
              <span className="text-foreground">A Story Told</span>
            </h2>
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              Join Viking, Scenic, and other premium operators who have
              transformed passive sightseeing into interactive storytelling.
            </p>
          </div>

          <button className="group relative px-8 py-4 rounded-xl border border-primary/40 bg-primary/10 hover:bg-primary/20 transition-all duration-300 gold-glow">
            <span className="flex items-center gap-3 text-sm uppercase tracking-[0.15em] text-foreground font-sans">
              Schedule a Private Demo
              <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
            </span>
          </button>

          <p className="text-[10px] text-muted-foreground/40 uppercase tracking-[0.2em] font-sans">
            30-minute walkthrough with our team
          </p>
        </motion.div>
      </div>
    </div>
  )
}
