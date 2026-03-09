"use client"

import { motion, type MotionValue, useTransform } from "framer-motion"
import { useEffect, useState } from "react"

// Animated SVG Map for Route Definition
export function RouteMapScreen({ progress }: { progress: number }) {
  const pathProgress = Math.min(1, progress * 3)
  
  return (
    <div className="w-full h-full bg-gradient-to-br from-card to-background p-4 flex flex-col">
      <div className="text-[10px] uppercase tracking-wider text-primary/60 mb-2 font-sans">Route Definition</div>
      
      {/* Map SVG */}
      <div className="flex-1 relative rounded-lg overflow-hidden border border-border/30">
        <svg viewBox="0 0 200 120" className="w-full h-full">
          {/* Grid lines */}
          {Array.from({ length: 10 }).map((_, i) => (
            <line
              key={`h-${i}`}
              x1="0"
              y1={i * 12}
              x2="200"
              y2={i * 12}
              stroke="hsl(var(--border))"
              strokeOpacity="0.2"
              strokeWidth="0.5"
            />
          ))}
          {Array.from({ length: 20 }).map((_, i) => (
            <line
              key={`v-${i}`}
              x1={i * 10}
              y1="0"
              x2={i * 10}
              y2="120"
              stroke="hsl(var(--border))"
              strokeOpacity="0.2"
              strokeWidth="0.5"
            />
          ))}
          
          {/* Geo corridor (gold band) */}
          <path
            d="M 10 90 Q 50 70 100 60 Q 150 50 190 30"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="20"
            strokeOpacity="0.1"
            strokeLinecap="round"
          />
          <path
            d="M 10 90 Q 50 70 100 60 Q 150 50 190 30"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="12"
            strokeOpacity="0.15"
            strokeLinecap="round"
          />
          
          {/* River route (animated) */}
          <motion.path
            d="M 10 90 Q 50 70 100 60 Q 150 50 190 30"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="300"
            strokeDashoffset={300 * (1 - pathProgress)}
            style={{ transition: "stroke-dashoffset 0.3s ease-out" }}
          />
          
          {/* POI dots */}
          {[
            { x: 30, y: 82, label: "Start" },
            { x: 65, y: 68, label: "Castle" },
            { x: 100, y: 60, label: "Village" },
            { x: 140, y: 48, label: "Vineyard" },
            { x: 175, y: 35, label: "End" },
          ].map((poi, i) => (
            <motion.g
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: pathProgress > (i + 1) * 0.2 ? 1 : 0, 
                scale: pathProgress > (i + 1) * 0.2 ? 1 : 0 
              }}
              transition={{ duration: 0.3 }}
            >
              <circle
                cx={poi.x}
                cy={poi.y}
                r="4"
                fill="hsl(var(--primary))"
                stroke="hsl(var(--background))"
                strokeWidth="1.5"
              />
              <circle
                cx={poi.x}
                cy={poi.y}
                r="8"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeOpacity="0.3"
                strokeWidth="1"
              />
            </motion.g>
          ))}
          
          {/* Ship position */}
          <motion.circle
            cx={10 + pathProgress * 180}
            cy={90 - pathProgress * 60}
            r="3"
            fill="hsl(var(--foreground))"
            animate={{ 
              filter: ["drop-shadow(0 0 2px hsl(var(--primary)))", "drop-shadow(0 0 6px hsl(var(--primary)))", "drop-shadow(0 0 2px hsl(var(--primary)))"]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </svg>
      </div>
      
      <div className="mt-2 flex justify-between text-[9px] text-muted-foreground font-mono">
        <span>Cologne</span>
        <span className="text-primary">247 km</span>
        <span>Mainz</span>
      </div>
    </div>
  )
}

// POI Discovery list screen
export function POIListScreen({ progress }: { progress: number }) {
  const pois = [
    { name: "Marksburg Castle", category: "Historic", distance: "2.3 km" },
    { name: "St. Goar Village", category: "Town", distance: "4.1 km" },
    { name: "Lorelei Rock", category: "Landmark", distance: "6.8 km" },
    { name: "Rheingau Vineyards", category: "Wine", distance: "12.4 km" },
    { name: "Rudesheim", category: "Town", distance: "18.2 km" },
  ]

  return (
    <div className="w-full h-full bg-gradient-to-br from-card to-background p-4 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[10px] uppercase tracking-wider text-primary/60 font-sans">POI Discovery</div>
        <div className="text-[9px] text-muted-foreground font-mono">{Math.round(progress * 247)} scanned</div>
      </div>
      
      <div className="flex-1 space-y-2 overflow-hidden">
        {pois.map((poi, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 20 }}
            animate={{ 
              opacity: progress > (i + 1) * 0.2 ? 1 : 0,
              x: progress > (i + 1) * 0.2 ? 0 : 20
            }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="flex items-center gap-2 p-2 rounded-lg bg-muted/20 border border-border/20"
          >
            <div className="w-6 h-6 rounded-md bg-primary/20 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-medium text-foreground truncate">{poi.name}</div>
              <div className="text-[8px] text-muted-foreground">{poi.category}</div>
            </div>
            <div className="text-[8px] text-primary/60 font-mono">{poi.distance}</div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-2 h-1 bg-muted/30 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-primary rounded-full"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  )
}

// Content Tiers stacking cards
export function ContentTiersScreen({ progress }: { progress: number }) {
  const tiers = [
    { level: "L0", name: "Quick Facts", blur: 0, scale: 1 },
    { level: "L1", name: "Narrative", blur: 1, scale: 0.95 },
    { level: "L2", name: "Deep Dive", blur: 2, scale: 0.9 },
    { level: "L3", name: "Panoramic", blur: 3, scale: 0.85 },
  ]

  return (
    <div className="w-full h-full bg-gradient-to-br from-card to-background p-4 flex flex-col items-center justify-center">
      <div className="text-[10px] uppercase tracking-wider text-primary/60 mb-4 font-sans">Content Tiers</div>
      
      <div className="relative w-32 h-24">
        {tiers.map((tier, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20, scale: tier.scale }}
            animate={{ 
              opacity: progress > (i + 1) * 0.25 ? 1 : 0,
              y: progress > (i + 1) * 0.25 ? i * -12 : 20,
              scale: tier.scale,
            }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="absolute inset-0 rounded-lg border border-primary/20 bg-card/80"
            style={{ 
              backdropFilter: `blur(${tier.blur}px)`,
              zIndex: 4 - i,
            }}
          >
            <div className="p-2 flex items-center gap-2">
              <span className="text-[8px] font-mono text-primary">{tier.level}</span>
              <span className="text-[9px] text-foreground">{tier.name}</span>
            </div>
            <div className="px-2 space-y-1">
              <div className="h-1 bg-muted/30 rounded-full w-full" />
              <div className="h-1 bg-muted/20 rounded-full w-3/4" />
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-4 text-[8px] text-muted-foreground">Pre-baked content layers</div>
    </div>
  )
}

// Tone Calibration slider
export function ToneSliderScreen({ progress }: { progress: number }) {
  const sliderPosition = progress * 100

  return (
    <div className="w-full h-full bg-gradient-to-br from-card to-background p-4 flex flex-col">
      <div className="text-[10px] uppercase tracking-wider text-primary/60 mb-3 font-sans">Brand Voice</div>
      
      {/* Slider track */}
      <div className="relative h-8 flex items-center">
        <div className="absolute inset-x-0 h-2 bg-muted/30 rounded-full">
          <div 
            className="h-full bg-gradient-to-r from-sky-500/50 to-amber-500/50 rounded-full"
            style={{ width: `${sliderPosition}%` }}
          />
        </div>
        <motion.div 
          className="absolute w-5 h-5 rounded-full bg-primary border-2 border-background shadow-lg"
          style={{ left: `calc(${sliderPosition}% - 10px)` }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
      
      <div className="flex justify-between text-[8px] text-muted-foreground mt-1">
        <span>Formal Historian</span>
        <span>Branded Luxury</span>
      </div>
      
      {/* Sample text preview */}
      <div className="mt-4 p-3 rounded-lg bg-muted/10 border border-border/20">
        <div className="text-[9px] text-muted-foreground mb-1">Sample:</div>
        <p className="text-[10px] text-foreground leading-relaxed">
          {progress < 0.5 
            ? "Marksburg Castle, constructed in 1117 AD, remains the only hilltop fortification along the Rhine that has never suffered destruction."
            : "Discover the timeless elegance of Marksburg Castle, an untouched gem rising majestically above the Rhine since 1117."
          }
        </p>
      </div>
    </div>
  )
}

// Human Review approval screen
export function ReviewScreen({ progress }: { progress: number }) {
  const approved = progress > 0.6

  return (
    <div className="w-full h-full bg-gradient-to-br from-card to-background p-4 flex flex-col">
      <div className="text-[10px] uppercase tracking-wider text-primary/60 mb-3 font-sans">Approval Queue</div>
      
      {/* Document preview */}
      <div className="flex-1 rounded-lg border border-border/30 bg-muted/10 p-3 relative overflow-hidden">
        <div className="text-[9px] font-medium text-foreground mb-1">Marksburg Castle - L1 Narrative</div>
        <div className="space-y-1">
          <div className="h-1.5 bg-muted/30 rounded-full w-full" />
          <div className="h-1.5 bg-muted/20 rounded-full w-5/6" />
          <div className="h-1.5 bg-muted/20 rounded-full w-4/5" />
          <div className="h-1.5 bg-muted/20 rounded-full w-3/4" />
        </div>
        
        {/* Approval stamp */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
          animate={{ 
            opacity: approved ? 1 : 0, 
            scale: approved ? 1 : 0.5,
            rotate: approved ? 0 : -15
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1 rounded border-2 border-emerald-500/50 bg-emerald-500/10"
        >
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Approved</span>
        </motion.div>
      </div>
      
      {/* Action buttons */}
      <div className="flex gap-2 mt-3">
        <button className="flex-1 py-1.5 rounded-lg text-[9px] font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          Approve
        </button>
        <button className="flex-1 py-1.5 rounded-lg text-[9px] font-medium bg-rose-500/20 text-rose-400 border border-rose-500/30">
          Flag
        </button>
      </div>
    </div>
  )
}

// Publication Hub with QR code
export function PublishScreen({ progress }: { progress: number }) {
  const channels = [
    { name: "QR Code", active: progress > 0.3 },
    { name: "Web Link", active: progress > 0.5 },
    { name: "Offline", active: progress > 0.7 },
  ]

  return (
    <div className="w-full h-full bg-gradient-to-br from-card to-background p-4 flex flex-col items-center">
      <div className="text-[10px] uppercase tracking-wider text-primary/60 mb-3 font-sans">Publish & Distribute</div>
      
      {/* Animated QR Code */}
      <div className="w-20 h-20 relative mb-3">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* QR Code pattern (simplified) */}
          {Array.from({ length: 10 }).map((_, row) =>
            Array.from({ length: 10 }).map((_, col) => {
              const shouldFill = (row + col) % 3 !== 0 && Math.random() > 0.3
              const delay = (row + col) * 0.03
              return (
                <motion.rect
                  key={`${row}-${col}`}
                  x={col * 10}
                  y={row * 10}
                  width="8"
                  height="8"
                  fill={shouldFill ? "hsl(var(--foreground))" : "transparent"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: progress > delay ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                />
              )
            })
          )}
          {/* Corner markers */}
          <rect x="0" y="0" width="25" height="25" fill="none" stroke="hsl(var(--primary))" strokeWidth="3" />
          <rect x="75" y="0" width="25" height="25" fill="none" stroke="hsl(var(--primary))" strokeWidth="3" />
          <rect x="0" y="75" width="25" height="25" fill="none" stroke="hsl(var(--primary))" strokeWidth="3" />
        </svg>
      </div>
      
      {/* Channel indicators */}
      <div className="flex gap-3">
        {channels.map((channel, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0.3 }}
            animate={{ opacity: channel.active ? 1 : 0.3 }}
            className="flex flex-col items-center gap-1"
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${channel.active ? 'bg-primary/20' : 'bg-muted/20'}`}>
              <div className={`w-2 h-2 rounded-full ${channel.active ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
            </div>
            <span className={`text-[7px] ${channel.active ? 'text-foreground' : 'text-muted-foreground'}`}>{channel.name}</span>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-3 px-3 py-1 rounded-full bg-primary/20 text-[8px] text-primary border border-primary/30">
        One-Click Deploy
      </div>
    </div>
  )
}

// Rich Audio Player for iPhone
export function AudioPlayerScreen({ progress }: { progress: number }) {
  return (
    <div className="w-full h-full bg-gradient-to-br from-card to-background p-4 flex flex-col items-center justify-center">
      {/* Album art */}
      <div className="w-24 h-24 rounded-xl overflow-hidden mb-3 relative">
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
          <div className="w-10 h-10 rounded-full bg-primary/90 flex items-center justify-center">
            <div className="w-0 h-0 border-l-[8px] border-l-background border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent ml-1" />
          </div>
        </motion.div>
      </div>
      
      <div className="text-center mb-2">
        <div className="text-[11px] font-medium text-foreground">Rhine Valley Chapter</div>
        <div className="text-[9px] text-primary/70">Marksburg Castle</div>
      </div>
      
      {/* Waveform */}
      <div className="flex items-end gap-[2px] h-8 mb-2">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="w-[2px] bg-primary/60 rounded-full"
            animate={{ height: [4, Math.random() * 24 + 4, 4] }}
            transition={{
              duration: 0.6 + Math.random() * 0.3,
              repeat: Infinity,
              delay: i * 0.03,
            }}
          />
        ))}
      </div>
      
      {/* Timeline */}
      <div className="w-full flex items-center gap-2">
        <span className="text-[8px] text-muted-foreground font-mono">1:18</span>
        <div className="flex-1 h-1 bg-muted/30 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-primary rounded-full"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <span className="text-[8px] text-muted-foreground font-mono">4:52</span>
      </div>
    </div>
  )
}

// Proximity notification screen
export function ProximityScreen({ progress }: { progress: number }) {
  return (
    <div className="w-full h-full bg-gradient-to-br from-card to-background p-4 flex flex-col">
      {/* Notification toast */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: progress > 0.2 ? 0 : -20, opacity: progress > 0.2 ? 1 : 0 }}
        className="rounded-xl bg-muted/30 border border-border/30 p-3 mb-3"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-primary" />
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
