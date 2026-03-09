"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Globe, Check } from "lucide-react"
import { useI18n, LOCALES, type Locale } from "@/lib/i18n"

// Unicode regional indicator flags from country code
function FlagEmoji({ code }: { code: string }) {
  // Use text abbreviation instead of emoji for reliability
  return (
    <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground w-5 text-center">
      {code === "GB" ? "EN" : code}
    </span>
  )
}

interface LanguageSwitcherProps {
  /** compact = icon-only trigger (for header); full = inline list (for mobile menu) */
  variant?: "compact" | "full"
}

export function LanguageSwitcher({ variant = "compact" }: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useI18n()
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  // Close on outside click
  React.useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open])

  const handleSelect = (code: Locale) => {
    setLocale(code)
    setOpen(false)
  }

  // ── Full inline variant (mobile menu) ────────────────────────────────────
  if (variant === "full") {
    return (
      <div className="flex flex-col gap-1">
        <span className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground/60 px-1 mb-1">
          {t.languageSwitcher.label}
        </span>
        <div className="flex flex-wrap gap-2">
          {LOCALES.map((l) => {
            const isActive = l.code === locale
            return (
              <button
                key={l.code}
                onClick={() => handleSelect(l.code)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-sans transition-all duration-200 ${
                  isActive
                    ? "bg-primary/15 border border-primary/30 text-foreground"
                    : "bg-[var(--glass)] border border-[var(--glass-border)] text-muted-foreground hover:border-primary/20 hover:text-foreground"
                }`}
              >
                <FlagEmoji code={l.flag} />
                <span>{l.label}</span>
                {isActive && <Check className="w-3 h-3 text-primary ml-1" />}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  // ── Compact dropdown variant (desktop header) ─────────────────────────────
  const current = LOCALES.find((l) => l.code === locale)!

  return (
    <div ref={ref} className="relative z-50">
      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={t.languageSwitcher.choose}
        className={`group flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-200 ${
          open
            ? "bg-primary/10 border-primary/30 text-foreground"
            : "bg-[var(--glass)] border-[var(--glass-border)] text-muted-foreground hover:border-primary/20 hover:text-foreground"
        }`}
      >
        <Globe className="w-3.5 h-3.5 shrink-0" />
        <span className="text-[10px] uppercase tracking-[0.15em] font-sans">
          {current.code.toUpperCase()}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-muted-foreground/60 text-[8px] leading-none"
        >
          ▾
        </motion.span>
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-[calc(100%+6px)] glass-panel-strong rounded-xl overflow-hidden min-w-[160px] shadow-2xl"
          >
            <div className="px-3 pt-3 pb-1">
              <span className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground/60">
                {t.languageSwitcher.choose}
              </span>
            </div>
            <div className="py-1">
              {LOCALES.map((l) => {
                const isActive = l.code === locale
                return (
                  <button
                    key={l.code}
                    onClick={() => handleSelect(l.code)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors duration-150 ${
                      isActive
                        ? "bg-primary/10 text-foreground"
                        : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                    }`}
                  >
                    <FlagEmoji code={l.flag} />
                    <span className="text-xs font-sans flex-1">{l.label}</span>
                    {isActive && (
                      <Check className="w-3 h-3 text-primary shrink-0" />
                    )}
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Fixed position header bar with language switcher (desktop)
export function SiteHeader() {
  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-[200] flex items-center justify-between px-8 py-4 pointer-events-none"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Wordmark */}
      <div className="pointer-events-auto flex items-center gap-2">
        <span className="font-serif text-sm text-foreground/80 shimmer-text tracking-wide">
          Curated Lens
        </span>
      </div>

      {/* Language switcher */}
      <div className="pointer-events-auto">
        <LanguageSwitcher variant="compact" />
      </div>
    </motion.header>
  )
}
