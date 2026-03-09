"use client"

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react"
import Lenis from "lenis"
import { MotionValue, useMotionValue, useSpring } from "framer-motion"

interface SmoothScrollContextType {
  lenis: Lenis | null
  scrollProgress: MotionValue<number>
  scrollTo: (target: number | string | HTMLElement) => void
}

const SmoothScrollContext = createContext<SmoothScrollContextType | null>(null)

export function useSmoothScroll() {
  const context = useContext(SmoothScrollContext)
  if (!context) {
    throw new Error("useSmoothScroll must be used within SmoothScrollProvider")
  }
  return context
}

interface SmoothScrollProviderProps {
  children: ReactNode
  totalHeight: number // in vh units
}

export function SmoothScrollProvider({ children, totalHeight }: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null)
  const scrollProgress = useMotionValue(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Initialize Lenis with smooth scrolling
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
    })

    lenisRef.current = lenis

    // Animation frame loop
    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    // Track scroll progress
    const handleScroll = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight
      if (scrollableHeight <= 0) return
      const progress = Math.min(Math.max(window.scrollY / scrollableHeight, 0), 1)
      scrollProgress.set(progress)
    }

    lenis.on("scroll", handleScroll)
    handleScroll()

    return () => {
      lenis.destroy()
      lenisRef.current = null
    }
  }, [mounted, scrollProgress])

  const scrollTo = (target: number | string | HTMLElement) => {
    lenisRef.current?.scrollTo(target, { duration: 1.5 })
  }

  return (
    <SmoothScrollContext.Provider
      value={{
        lenis: lenisRef.current,
        scrollProgress,
        scrollTo,
      }}
    >
      <div style={{ height: `${totalHeight}vh` }} className="relative">
        {children}
      </div>
    </SmoothScrollContext.Provider>
  )
}
