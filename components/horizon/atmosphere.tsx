"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

export function Atmosphere() {
  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)
  const springX = useSpring(cursorX, { stiffness: 150, damping: 20 })
  const springY = useSpring(cursorY, { stiffness: 150, damping: 20 })
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      setIsHovering(true)
    }

    const handleMouseLeave = () => {
      setIsHovering(false)
    }

    window.addEventListener("mousemove", handleMouseMove)
    document.body.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      document.body.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [cursorX, cursorY])

  return (
    <>
      {/* Floating particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
        {Array.from({ length: 40 }).map((_, i) => (
          <Particle key={i} index={i} />
        ))}
      </div>

      {/* Film grain overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.025] mix-blend-overlay z-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Cursor glow follower */}
      <motion.div
        className="fixed w-[400px] h-[400px] rounded-full pointer-events-none z-30"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          background: "radial-gradient(circle, rgba(205, 160, 60, 0.12) 0%, rgba(205, 160, 60, 0.05) 30%, transparent 70%)",
          opacity: isHovering ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      />

      {/* Golden light streaks */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-5">
        <div 
          className="absolute w-[200vw] h-[2px] bg-gradient-to-r from-transparent via-primary/10 to-transparent"
          style={{
            top: "30%",
            left: "-50%",
            transform: "rotate(-5deg)",
            animation: "light-streak 20s linear infinite",
          }}
        />
        <div 
          className="absolute w-[200vw] h-[1px] bg-gradient-to-r from-transparent via-primary/8 to-transparent"
          style={{
            top: "60%",
            left: "-50%",
            transform: "rotate(3deg)",
            animation: "light-streak 25s linear infinite reverse",
          }}
        />
      </div>
    </>
  )
}

function Particle({ index }: { index: number }) {
  const size = 1 + Math.random() * 2
  const initialX = Math.random() * 100
  const initialY = Math.random() * 100
  const duration = 15 + Math.random() * 20
  const delay = Math.random() * -30

  return (
    <div
      className="absolute rounded-full"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        left: `${initialX}%`,
        top: `${initialY}%`,
        background: `radial-gradient(circle, hsl(35 80% 55% / 0.6) 0%, hsl(35 80% 55% / 0.2) 50%, transparent 100%)`,
        animation: `particle-float ${duration}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        boxShadow: `0 0 ${size * 2}px hsl(35 80% 55% / 0.3)`,
      }}
    />
  )
}
