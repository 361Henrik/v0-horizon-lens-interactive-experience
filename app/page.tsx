"use client"

import { useState, useEffect } from "react"
import { HorizonJourney } from "@/components/horizon/horizon-journey"
import { MobileJourney } from "@/components/horizon/mobile-journey"
import { Preloader } from "@/components/horizon/preloader"

function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])
  return isMobile
}

export default function Page() {
  const [isLoaded, setIsLoaded] = useState(false)
  const isMobile = useIsMobile()

  // Don't render until we know viewport size (avoids flash)
  if (isMobile === null) return null

  if (isMobile) {
    return (
      <main className="relative">
        <MobileJourney />
      </main>
    )
  }

  return (
    <main className="relative">
      <Preloader onComplete={() => setIsLoaded(true)} />
      <HorizonJourney isReady={isLoaded} />
    </main>
  )
}
