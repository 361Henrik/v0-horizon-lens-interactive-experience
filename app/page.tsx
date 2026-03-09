"use client"

import { useState } from "react"
import { HorizonJourney } from "@/components/horizon/horizon-journey"
import { Preloader } from "@/components/horizon/preloader"

export default function Page() {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <main className="relative">
      <Preloader onComplete={() => setIsLoaded(true)} />
      <HorizonJourney isReady={isLoaded} />
    </main>
  )
}
