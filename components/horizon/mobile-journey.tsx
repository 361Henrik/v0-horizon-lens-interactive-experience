"use client"

import * as React from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { Ship, Anchor, Train, ChevronDown } from "lucide-react"
import { useI18n } from "@/lib/i18n"

// Reuse PoiIcon inline for mobile to avoid import coupling
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
        <path d="M17 8C8 10 5.9 16.17 3.82 22" /><path d="M9.1 11.16C10.14 12.38 12.05 13.5 16 12.5" /><path d="M17 8c0-3.5-3-5-3-5S9.5 4.5 9.5 8c0 2.5 1.5 4.5 4.5 5" />
      </svg>
    ),
    food: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" />
      </svg>
    ),
    culture: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    experience: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
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

// A section that fades + slides up when scrolled into view
function RevealSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Mobile phone mockup shell
function MobilePhoneMockup({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto w-[240px]">
      <div className="rounded-[2rem] overflow-hidden border-2 border-border/30 bg-card/80 backdrop-blur-sm p-1.5 shadow-2xl">
        {/* Dynamic island */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 w-16 h-4 bg-background rounded-full" />
        <div className="relative aspect-[9/19.5] rounded-[1.6rem] overflow-hidden bg-[hsl(220,20%,6%)]">
          {children}
        </div>
      </div>
    </div>
  )
}

// POI cards that scroll up through the phone screen (sticky demo)
function StickyPhoneDemo() {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  const poiCards = [
    {
      type: "history",
      name: "Marksburg Castle",
      distance: "0.2 km",
      description: "The only Rhine hilltop fortress never destroyed. Built 1117 AD.",
      tags: ["1117 AD", "UNESCO", "Never destroyed"],
    },
    {
      type: "nature",
      name: "Rhine Gorge",
      distance: "0.4 km",
      description: "A dramatic river valley carved through ancient slate mountains.",
      tags: ["UNESCO", "60 km long", "Volcanic rock"],
    },
    {
      type: "food",
      name: "Vineyard Estate",
      distance: "2.3 km",
      description: "Riesling grapes grown on steep terraces since Roman times.",
      tags: ["Riesling", "Cellar tour", "Wine tasting"],
    },
    {
      type: "experience",
      name: "River Festival",
      distance: "4.1 km",
      description: "Traditional Rhine festival with folk music and local cuisine.",
      tags: ["Tonight", "Family-friendly", "Live music"],
    },
  ]

  const [activePoi, setActivePoi] = React.useState(0)

  React.useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      const idx = Math.min(poiCards.length - 1, Math.floor(v * poiCards.length))
      setActivePoi(idx)
    })
  }, [scrollYProgress, poiCards.length])

  const poi = poiCards[activePoi]

  return (
    <div ref={containerRef} className="relative" style={{ height: `${poiCards.length * 80}vh` }}>
      {/* Sticky phone */}
      <div className="sticky top-[10vh] z-10">
        <RevealSection>
          <div className="mb-6 text-center px-6">
            <span className="text-[10px] uppercase tracking-[0.3em] text-primary/60 font-sans">
              POI Discovery
            </span>
            <h2 className="font-serif text-2xl font-semibold text-foreground mt-1">
              Every landmark, instantly revealed
            </h2>
          </div>
        </RevealSection>

        <MobilePhoneMockup>
          <div className="w-full h-full flex flex-col p-3 relative">
            {/* Status */}
            <div className="flex justify-between pt-6 pb-2 px-1 shrink-0">
              <span className="text-[7px] text-foreground/40 font-mono">9:41</span>
              <span className="text-[7px] text-primary/60 font-mono">Curated Lens</span>
            </div>

            {/* Detection pulse */}
            <div className="relative h-12 flex items-center justify-center my-1 shrink-0">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute w-8 h-8 rounded-full border border-primary/30"
                  animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.65 }}
                />
              ))}
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center z-10">
                <div className="w-3 h-3 rounded-full bg-primary/60" />
              </div>
            </div>

            {/* Active POI card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={poi.name}
                className="flex-1 rounded-xl border border-primary/20 bg-primary/5 p-2.5 relative overflow-hidden"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
              >
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className="w-5 h-5 rounded-md bg-primary/20 flex items-center justify-center text-primary">
                    <PoiIcon type={poi.type} className="w-3 h-3" />
                  </div>
                  <span className="text-[9px] font-medium text-foreground">{poi.name}</span>
                  <span className="ml-auto text-[7px] text-primary/60 font-mono">{poi.distance}</span>
                </div>
                <p className="text-[8px] text-muted-foreground leading-relaxed mb-2">
                  {poi.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {poi.tags.map((tag) => (
                    <span key={tag} className="px-1.5 py-0.5 rounded-full bg-primary/10 text-[7px] text-primary border border-primary/20">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Bottom action */}
                <div className="mt-2 py-1 rounded-lg bg-primary/15 text-center text-[8px] text-primary">
                  Discover Story
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Mini dot nav */}
            <div className="flex justify-center gap-1.5 py-2 shrink-0">
              {poiCards.map((_, i) => (
                <div
                  key={i}
                  className={`rounded-full transition-all duration-300 ${
                    i === activePoi ? "w-4 h-1.5 bg-primary" : "w-1.5 h-1.5 bg-muted/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </MobilePhoneMockup>

        {/* Scroll indicator */}
        <p className="text-center text-[10px] text-muted-foreground/50 mt-4 font-sans">
          Scroll to explore more POIs
        </p>
      </div>
    </div>
  )
}

// Feature highlight card
function FeatureCard({
  type,
  title,
  description,
  index,
}: {
  type: string
  title: string
  description: string
  index: number
}) {
  return (
    <RevealSection>
      <motion.div
        className="flex gap-4 p-4 rounded-2xl border border-border/20 bg-card/40 backdrop-blur-sm"
        whileHover={{ borderColor: "hsl(var(--primary) / 0.4)", backgroundColor: "hsl(var(--primary) / 0.04)" }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center text-primary shrink-0"
          animate={{ boxShadow: ["0 0 0px hsl(var(--primary)/0.2)", "0 0 16px hsl(var(--primary)/0.2)", "0 0 0px hsl(var(--primary)/0.2)"] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.3 }}
        >
          <PoiIcon type={type} className="w-5 h-5" />
        </motion.div>
        <div>
          <h3 className="font-serif text-base font-semibold text-foreground mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </motion.div>
    </RevealSection>
  )
}

export function MobileJourney() {
  const { t } = useI18n()
  
  const travelModes = [
    { label: t.landing.modes.riverCruise, icon: Ship, active: true },
    { label: t.landing.modes.oceanCruise, icon: Anchor, active: false },
    { label: t.landing.modes.luxuryRail, icon: Train, active: false },
  ]

  const categories = [
    { type: "history", label: t.phaseHelmut.poiCategories.history },
    { type: "nature", label: t.phaseHelmut.poiCategories.nature },
    { type: "food", label: t.phaseHelmut.poiCategories.food },
    { type: "culture", label: t.phaseHelmut.poiCategories.culture },
    { type: "experience", label: t.phaseHelmut.poiCategories.experience },
    { type: "local", label: t.phaseHelmut.poiCategories.local },
  ]

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-background">
      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-16">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/images/hero-bg.jpeg)" }}
        />
        <div className="absolute inset-0 bg-background/70" />
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at center, transparent 20%, hsl(220 20% 8% / 0.9) 100%)" }}
        />

        <div className="relative z-10 flex flex-col items-center text-center gap-6">
          <motion.span
            className="text-[10px] uppercase tracking-[0.4em] text-primary/80 font-sans"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {t.landing.introducing}
          </motion.span>

          <motion.h1
            className="font-serif text-5xl font-semibold leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="shimmer-text">Curated</span>{" "}
            <span className="text-foreground">Lens</span>
          </motion.h1>

          <motion.p
            className="text-base text-muted-foreground max-w-xs leading-relaxed font-sans"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {t.landing.tagline} {t.landing.subtitle}
          </motion.p>

          {/* Mode selector */}
          <motion.div
            className="flex gap-3 flex-wrap justify-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.6 }}
          >
            {travelModes.map((mode) => {
              const Icon = mode.icon
              return (
                <div
                  key={mode.label}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-sans ${
                    mode.active
                      ? "border-primary/40 bg-primary/10 text-foreground"
                      : "border-border/30 bg-muted/10 text-muted-foreground opacity-50"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${mode.active ? "text-primary" : "text-muted-foreground"}`} />
                  {mode.label}
                </div>
              )
            })}
          </motion.div>

          <motion.p
            className="text-xs text-muted-foreground/50 uppercase tracking-[0.2em] font-sans"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            {t.landing.demoRoute}
          </motion.p>
        </div>

        {/* Scroll down cue */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-[10px] text-muted-foreground/50 uppercase tracking-wider font-sans">{t.scrollHint}</span>
          <ChevronDown className="w-4 h-4 text-primary/50" />
        </motion.div>
      </section>

      {/* Concept explanation */}
      <section className="px-6 py-16 max-w-lg mx-auto">
        <RevealSection>
          <span className="text-[10px] uppercase tracking-[0.3em] text-primary/60 font-sans">{t.phaseConclusion.ctaEyebrow}</span>
          <h2 className="font-serif text-3xl font-semibold text-foreground mt-2 mb-4 text-balance">
            {t.phaseConclusion.ctaHeading1} {t.phaseConclusion.ctaHeading2}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed font-sans">
            {t.phaseConclusion.ctaBody}
          </p>
        </RevealSection>

        {/* Category grid */}
        <div className="grid grid-cols-3 gap-2 mt-8">
          {categories.map((cat, i) => (
            <RevealSection key={cat.type}>
              <motion.div
                className="flex flex-col items-center gap-2 p-3 rounded-xl border border-border/20 bg-card/30"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, type: "spring", stiffness: 300, damping: 25 }}
                whileHover={{ borderColor: "hsl(var(--primary) / 0.5)", backgroundColor: "hsl(var(--primary) / 0.06)" }}
              >
                <div className="text-primary">
                  <PoiIcon type={cat.type} className="w-5 h-5" />
                </div>
                <span className="text-[10px] text-muted-foreground font-sans">{cat.label}</span>
              </motion.div>
            </RevealSection>
          ))}
        </div>
      </section>

      {/* Sticky POI demo */}
      <section className="px-4">
        <StickyPhoneDemo />
      </section>

      {/* Feature highlights */}
      <section className="px-6 py-16 max-w-lg mx-auto space-y-4">
        <RevealSection>
          <span className="text-[10px] uppercase tracking-[0.3em] text-primary/60 font-sans">Features</span>
          <h2 className="font-serif text-2xl font-semibold text-foreground mt-2 mb-6 text-balance">
            Everything a traveler needs, in one glance
          </h2>
        </RevealSection>

        {[
          {
            type: "history",
            title: "Real-Time POI Detection",
            description: "247 points of interest scanned automatically along your route corridor, no searching required.",
          },
          {
            type: "culture",
            title: "Verified Stories",
            description: "Four content tiers — Quick Facts, Narratives, Deep Dives, and Panoramic overlays — all pre-baked and human-reviewed.",
          },
          {
            type: "experience",
            title: "Audio Narration",
            description: "Narrated stories delivered hands-free so guests stay immersed in the scenery, not their screens.",
          },
          {
            type: "local",
            title: "Local Connections",
            description: "Curated experiences, vineyard tours, and village markets surfaced from trusted local operators.",
          },
          {
            type: "nature",
            title: "Panoramic Mode",
            description: "Rotate to landscape for an annotated cinematic view of the landmark with interactive hotspots.",
          },
          {
            type: "food",
            title: "Soft Truth Safeguard",
            description: "No hallucinations. If there is no verified story for a location, Curated Lens says so honestly.",
          },
        ].map((feat, i) => (
          <FeatureCard key={feat.title} {...feat} index={i} />
        ))}
      </section>

      {/* CTA */}
      <section className="px-6 py-20 text-center max-w-sm mx-auto">
        <RevealSection>
          <div className="flex flex-col items-center gap-6">
            <span className="text-[10px] uppercase tracking-[0.3em] text-primary/60 font-sans">
              {t.phaseConclusion.ctaEyebrow}
            </span>
            <h2 className="font-serif text-3xl font-semibold text-balance text-foreground">
              <span className="shimmer-text">{t.phaseConclusion.ctaHeading1}</span>
              <br />{t.phaseConclusion.ctaHeading2}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t.phaseConclusion.ctaBody}
            </p>
            <motion.button
              className="w-full py-4 rounded-2xl bg-primary/20 border border-primary/40 text-sm font-sans text-foreground uppercase tracking-[0.15em]"
              whileHover={{ scale: 1.02, backgroundColor: "hsl(var(--primary) / 0.3)" }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15 }}
            >
              {t.phaseConclusion.ctaButton}
            </motion.button>
            <p className="text-[10px] text-muted-foreground/50 uppercase tracking-[0.15em] font-sans">
              {t.phaseConclusion.trustBadge}
            </p>
          </div>
        </RevealSection>
      </section>
    </div>
  )
}
