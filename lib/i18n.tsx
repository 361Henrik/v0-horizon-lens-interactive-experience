"use client"

import * as React from "react"
import en from "@/locales/en.json"
import no from "@/locales/no.json"
import de from "@/locales/de.json"
import fr from "@/locales/fr.json"
import es from "@/locales/es.json"

export type Locale = "en" | "no" | "de" | "fr" | "es"

export const LOCALES: { code: Locale; label: string; flag: string }[] = [
  { code: "en", label: "English",  flag: "GB" },
  { code: "no", label: "Norsk",    flag: "NO" },
  { code: "de", label: "Deutsch",  flag: "DE" },
  { code: "fr", label: "Français", flag: "FR" },
  { code: "es", label: "Español",  flag: "ES" },
]

const dictionaries: Record<Locale, typeof en> = { en, no, de, fr, es }

// ── Context ────────────────────────────────────────────────────────────────

interface I18nContextValue {
  locale: Locale
  t: typeof en
  setLocale: (l: Locale) => void
}

const I18nContext = React.createContext<I18nContextValue>({
  locale: "en",
  t: en,
  setLocale: () => {},
})

// ── Provider ───────────────────────────────────────────────────────────────

const STORAGE_KEY = "cl-locale"

function getStoredLocale(): Locale {
  if (typeof window === "undefined") return "en"
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored && stored in dictionaries) return stored as Locale
  // Auto-detect from browser
  const lang = navigator.language.slice(0, 2).toLowerCase()
  if (lang in dictionaries) return lang as Locale
  return "en"
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = React.useState<Locale>("en")

  // Hydrate from localStorage after mount
  React.useEffect(() => {
    setLocaleState(getStoredLocale())
  }, [])

  const setLocale = React.useCallback((l: Locale) => {
    setLocaleState(l)
    localStorage.setItem(STORAGE_KEY, l)
    // Update <html lang> attribute
    document.documentElement.lang = l
  }, [])

  const value = React.useMemo<I18nContextValue>(
    () => ({ locale, t: dictionaries[locale], setLocale }),
    [locale, setLocale]
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

// ── Hook ───────────────────────────────────────────────────────────────────

export function useI18n() {
  return React.useContext(I18nContext)
}
