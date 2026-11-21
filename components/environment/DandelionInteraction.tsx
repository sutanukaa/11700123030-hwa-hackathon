'use client'

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useState, useCallback, useRef } from 'react'
import Image from 'next/image'
import { canopyAssets } from '@/lib/assets'

type DandelionMode = 'burst' | 'breeze'

// 24 fluffy dandelion parachute seeds shooting radially out of the seed head
const BURST_SEEDS = Array.from({ length: 24 }, (_, i) => {
  const angle = (i / 24) * 280 - 140 // Radial umbrella (-140° to +140°)
  const radian = (angle * Math.PI) / 180
  const speed = 340 + (i % 6) * 75
  return {
    id: i,
    driftX: Math.sin(radian) * speed + 75 + (i % 5) * 40,
    driftY: -Math.abs(Math.cos(radian)) * speed - 180 - (i % 4) * 85,
    rotation: -18 + (i % 7) * 6,
    scale: 0.85 + (i % 4) * 0.12,
    width: 36 + (i % 4) * 4,
    height: 48 + (i % 4) * 5,
    delay: (i % 8) * 0.05,
    duration: 3.4 + (i % 5) * 0.35,
  }
})

// 32 fluffy dandelion seeds floating across the full screen on the summer breeze
const BREEZE_SEEDS = Array.from({ length: 32 }, (_, i) => ({
  id: i,
  startX: `${-12 - (i % 6) * 8}%`,
  startY: `${8 + (i * 18.7) % 76}%`,
  driftX: 1150 + (i % 5) * 110,
  driftY: -70 - (i % 4) * 45 + (i % 3 === 0 ? 80 : -40),
  scale: 0.8 + (i % 4) * 0.12,
  width: 34 + (i % 4) * 4,
  height: 46 + (i % 4) * 5,
  delay: (i % 10) * 0.08,
  duration: 4.4 + (i % 4) * 0.45,
}))

// 12 golden sunlight motes
const MEADOW_SPARKLES = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  driftX: -80 + (i * 27) % 220,
  driftY: -120 - (i % 4) * 80,
  delay: (i % 6) * 0.06,
  duration: 2.4 + (i % 3) * 0.3,
  size: 3 + (i % 3) * 2,
}))

// Reusable SVG for an authentic fluffy dandelion seed
function DandelionPuffSeed() {
  return (
    <svg
      viewBox="0 0 60 75"
      className="h-full w-full select-none drop-shadow-[0_2px_6px_rgba(255,255,255,0.7)]"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Soft Feathery Glow Behind Umbrella */}
      <circle cx="30" cy="20" r="16" fill="rgba(255, 255, 255, 0.28)" />
      <circle cx="30" cy="20" r="9" fill="rgba(255, 255, 255, 0.45)" />

      {/* Main Fluffy Pappus Umbrella Tufts */}
      <g stroke="rgba(255, 255, 255, 0.95)" strokeLinecap="round">
        {/* Core Radial Umbrella Spokes */}
        <line x1="30" y1="20" x2="10" y2="6" strokeWidth="1.3" />
        <line x1="30" y1="20" x2="16" y2="4" strokeWidth="1.3" />
        <line x1="30" y1="20" x2="23" y2="2" strokeWidth="1.3" />
        <line x1="30" y1="20" x2="30" y2="1" strokeWidth="1.5" />
        <line x1="30" y1="20" x2="37" y2="2" strokeWidth="1.3" />
        <line x1="30" y1="20" x2="44" y2="4" strokeWidth="1.3" />
        <line x1="30" y1="20" x2="50" y2="6" strokeWidth="1.3" />

        {/* Outer Fanned Wings */}
        <line x1="30" y1="20" x2="6" y2="12" strokeWidth="1.1" />
        <line x1="30" y1="20" x2="54" y2="12" strokeWidth="1.1" />
        <line x1="30" y1="20" x2="4" y2="18" strokeWidth="0.9" />
        <line x1="30" y1="20" x2="56" y2="18" strokeWidth="0.9" />

        {/* Secondary Feathery Down Spines */}
        <line x1="30" y1="20" x2="14" y2="10" strokeWidth="0.85" stroke="rgba(255, 250, 240, 0.9)" />
        <line x1="30" y1="20" x2="20" y2="6" strokeWidth="0.85" stroke="rgba(255, 250, 240, 0.9)" />
        <line x1="30" y1="20" x2="27" y2="4" strokeWidth="0.85" stroke="rgba(255, 250, 240, 0.9)" />
        <line x1="30" y1="20" x2="33" y2="4" strokeWidth="0.85" stroke="rgba(255, 250, 240, 0.9)" />
        <line x1="30" y1="20" x2="40" y2="6" strokeWidth="0.85" stroke="rgba(255, 250, 240, 0.9)" />
        <line x1="30" y1="20" x2="46" y2="10" strokeWidth="0.85" stroke="rgba(255, 250, 240, 0.9)" />

        {/* Soft Fluffy Barbs at Tips */}
        <circle cx="10" cy="6" r="1.6" fill="#FFFFFF" />
        <circle cx="16" cy="4" r="1.6" fill="#FFFFFF" />
        <circle cx="23" cy="2" r="1.6" fill="#FFFFFF" />
        <circle cx="30" cy="1" r="2.0" fill="#FFFFFF" />
        <circle cx="37" cy="2" r="1.6" fill="#FFFFFF" />
        <circle cx="44" cy="4" r="1.6" fill="#FFFFFF" />
        <circle cx="50" cy="6" r="1.6" fill="#FFFFFF" />
        <circle cx="6" cy="12" r="1.4" fill="#FFFFFF" />
        <circle cx="54" cy="12" r="1.4" fill="#FFFFFF" />
      </g>

      {/* Central Fluff Hub */}
      <circle cx="30" cy="20" r="2.6" fill="#FFFFFF" />

      {/* Slender Stalk (Pedicel) */}
      <line
        x1="30"
        y1="20"
        x2="30"
        y2="52"
        stroke="rgba(245, 240, 225, 0.9)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* Seed Grain (Achene) */}
      <path
        d="M 30 50 C 27.5 53 27 60 29.5 67 C 30 68.5 30 68.5 30.5 67 C 33 60 32.5 53 30 50 Z"
        fill="#5A432D"
      />
      <ellipse cx="30" cy="57" rx="1.8" ry="6" fill="#6B533A" />
      <ellipse cx="29.4" cy="55" rx="0.7" ry="4" fill="#9C8263" opacity="0.85" />
    </svg>
  )
}

export function DandelionInteraction() {
  const reducedMotion = useReducedMotion()
  const [clickCount, setClickCount] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isBending, setIsBending] = useState(false)
  const lastClickTimeRef = useRef(0)

  const handleDandelionTrigger = useCallback(() => {
    const now = Date.now()
    // Debounce guard to prevent duplicate synthetic events from single clicks
    if (now - lastClickTimeRef.current < 300) return
    lastClickTimeRef.current = now

    // 1. Stem compression recoil
    setIsBending(true)
    setTimeout(() => setIsBending(false), 420)

    // 2. Increment click count by exactly 1
    setClickCount((c) => c + 1)
  }, [])

  // Mathematical alternation: Click 1 = 'burst', Click 2 = 'breeze', Click 3 = 'burst', etc.
  const activeMode: DandelionMode = clickCount % 2 === 1 ? 'burst' : 'breeze'

  return (
    <>
      {/* =====================================================================
          1. FULL-SCREEN DANDELION BREEZE (Mode B: Even Clicks: 2, 4, 6...)
          ===================================================================== */}
      <AnimatePresence>
        {clickCount > 0 && activeMode === 'breeze' && !reducedMotion && (
          <div
            key={`dandelion-breeze-event-${clickCount}`}
            className="pointer-events-none fixed inset-0 z-[65] overflow-hidden"
            aria-hidden="true"
          >
            {/* Soft summer breeze atmosphere sheen */}
            <div className="absolute inset-0 bg-[rgba(255,248,220,0.08)]" />

            {BREEZE_SEEDS.map((s) => (
              <motion.div
                key={s.id}
                initial={{
                  left: s.startX,
                  top: s.startY,
                  opacity: 0,
                  scale: 0.4,
                  rotate: 0,
                }}
                animate={{
                  x: [0, s.driftX * 0.5, s.driftX],
                  y: [0, s.driftY * 0.6, s.driftY],
                  opacity: [0, 0.98, 0.92, 0],
                  scale: [0.45, s.scale * 1.08, s.scale],
                  rotate: [-14, 18, -10, 14],
                }}
                transition={{
                  duration: s.duration,
                  delay: s.delay,
                  ease: [0.25, 1, 0.5, 1],
                }}
                className="absolute flex items-center justify-center origin-center"
                style={{ width: s.width, height: s.height }}
              >
                <DandelionPuffSeed />
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* =====================================================================
          2. DANDELION PLANT IN MEADOW (Clickable unlimited times)
          ===================================================================== */}
      <div
        className="pointer-events-none absolute inset-0 z-35 overflow-hidden select-none"
        aria-label="Meadow dandelion interaction plane"
      >
        <div className="absolute left-[24%] sm:left-[30%] md:left-[32%] bottom-[16%] sm:bottom-[18%] md:bottom-[19%] origin-bottom pointer-events-none">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              handleDandelionTrigger()
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group pointer-events-auto relative flex cursor-pointer items-end justify-center rounded-full p-2 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5D98E]"
            aria-label="Wild dandelion in the meadow (click to blow seeds)"
          >
            {/* Natural plant sway + recoil flex */}
            <motion.div
              animate={
                reducedMotion
                  ? {}
                  : {
                      rotate: isBending
                        ? [0, 5, -2, 0]
                        : isHovered
                          ? [1.8, 3.2, 1.8]
                          : [-1.2, 1.2, -1.2],
                      scaleY: isBending ? [1, 0.9, 1.02, 1] : 1,
                    }
              }
              transition={{
                duration: isBending ? 0.45 : isHovered ? 2.2 : 4.8,
                repeat: isBending ? 0 : Infinity,
                ease: isBending ? [0.25, 1, 0.5, 1] : 'easeInOut',
              }}
              className="relative flex items-end justify-center origin-bottom"
            >
              {/* Dandelion Plant Artwork */}
              <motion.div
                animate={{
                  scale: isBending
                    ? [1, 0.92, 1.03, 1]
                    : isHovered && !reducedMotion
                      ? 1.04
                      : 1,
                  filter:
                    'brightness(1) contrast(1) drop-shadow(0 5px 12px rgba(44,36,32,0.28))',
                }}
                transition={{ duration: 0.5 }}
                className="relative h-28 w-36 sm:h-34 sm:w-44 md:h-40 md:w-52 origin-bottom"
              >
                <Image
                  src={canopyAssets.dandelion.src}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 180px, 220px"
                  priority
                  className="object-contain object-bottom select-none pointer-events-none"
                />
              </motion.div>
            </motion.div>
          </button>

          {/* =====================================================================
              RADIAL PUFF BURST (Mode A: Odd Clicks: 1, 3, 5...)
              ===================================================================== */}
          <AnimatePresence>
            {clickCount > 0 && activeMode === 'burst' && (
              <div
                key={`dandelion-burst-event-${clickCount}`}
                className="pointer-events-none absolute top-[18%] left-[48%] -translate-x-1/2 -translate-y-1/2 overflow-visible"
                aria-hidden="true"
              >
                {/* 24 Ascending Dandelion Seeds */}
                {BURST_SEEDS.map((s) => (
                  <motion.div
                    key={s.id}
                    initial={{
                      x: 0,
                      y: 0,
                      opacity: 0,
                      scale: 0.35,
                      rotate: 0,
                    }}
                    animate={
                      reducedMotion
                        ? {
                            y: -40,
                            opacity: [0, 0.7, 0],
                          }
                        : {
                            x: [0, s.driftX * 0.45, s.driftX],
                            y: [0, s.driftY * 0.55, s.driftY],
                            opacity: [0, 0.98, 0.92, 0],
                            scale: [0.4, s.scale * 1.1, s.scale],
                            rotate: [0, s.rotation, s.rotation * 1.4],
                          }
                    }
                    transition={{
                      duration: s.duration,
                      delay: s.delay,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="absolute flex items-center justify-center origin-center"
                    style={{ width: s.width, height: s.height }}
                  >
                    <DandelionPuffSeed />
                  </motion.div>
                ))}

                {/* 12 Golden Sparkles */}
                {!reducedMotion &&
                  MEADOW_SPARKLES.map((m) => (
                    <motion.div
                      key={m.id}
                      initial={{ x: 0, y: 0, opacity: 0, scale: 0.2 }}
                      animate={{
                        x: [0, m.driftX],
                        y: [0, m.driftY],
                        opacity: [0, 0.95, 0.85, 0],
                        scale: [0.2, 1.2, 0.4],
                      }}
                      transition={{
                        duration: m.duration,
                        delay: m.delay,
                        ease: 'easeOut',
                      }}
                      className="absolute rounded-full bg-[#FFFBEA]"
                      style={{
                        width: m.size,
                        height: m.size,
                        boxShadow:
                          '0 0 6px #F5D98E, 0 0 12px rgba(255,250,230,0.9)',
                      }}
                    />
                  ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  )
}