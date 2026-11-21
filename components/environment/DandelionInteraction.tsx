'use client'

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useState, useCallback, useRef } from 'react'
import Image from 'next/image'
import { canopyAssets } from '@/lib/assets'
import { playSound } from '@/lib/sounds'

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
      <defs>
        <radialGradient
          id="pappusGlow"
          cx="50%"
          cy="20%"
          r="50%"
          fx="50%"
          fy="20%"
        >
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="60%" stopColor="#FFF9EB" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#F5EFE0" stopOpacity="0.3" />
        </radialGradient>
      </defs>

      {/* Fluffy Umbrella Filaments (Pappus Rays) */}
      <g stroke="rgba(255, 255, 255, 0.85)" strokeWidth="0.8" strokeLinecap="round">
        <line x1="30" y1="18" x2="30" y2="2" />
        <line x1="30" y1="18" x2="20" y2="4" />
        <line x1="30" y1="18" x2="40" y2="4" />
        <line x1="30" y1="18" x2="11" y2="9" />
        <line x1="30" y1="18" x2="49" y2="9" />
        <line x1="30" y1="18" x2="5" y2="16" />
        <line x1="30" y1="18" x2="55" y2="16" />
        <line x1="30" y1="18" x2="3" y2="24" />
        <line x1="30" y1="18" x2="57" y2="24" />
        <line x1="30" y1="18" x2="7" y2="30" />
        <line x1="30" y1="18" x2="53" y2="30" />
      </g>

      {/* Outer Fluffy Fiber Corona */}
      <circle cx="30" cy="18" r="16" fill="url(#pappusGlow)" />

      {/* Central Pappus Stalk (Beak) */}
      <line
        x1="30"
        y1="18"
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
    if (now - lastClickTimeRef.current < 300) return
    lastClickTimeRef.current = now

    // Play soft airy dandelion puff sound
    playSound('dandelion_puff')

    // Stem compression recoil
    setIsBending(true)
    setTimeout(() => setIsBending(false), 420)

    // Increment click count
    setClickCount((c) => c + 1)
  }, [])

  const activeMode: DandelionMode = clickCount % 2 === 1 ? 'burst' : 'breeze'

  return (
    <>
      {/* =====================================================================
          DANDELION PLANT IN MEADOW
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

          {/* Radial Puff Burst (Odd Clicks: 1, 3, 5...) */}
          <AnimatePresence>
            {clickCount > 0 && activeMode === 'burst' && (
              <div
                key={`dandelion-burst-event-${clickCount}`}
                className="pointer-events-none absolute top-[18%] left-[48%] -translate-x-1/2 -translate-y-1/2 overflow-visible"
                aria-hidden="true"
              >
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
                      className="absolute rounded-full bg-[#FFFDF0]"
                      style={{
                        width: m.size,
                        height: m.size,
                        boxShadow: '0 0 8px #F5D98E, 0 0 14px rgba(255,253,240,0.9)',
                      }}
                    />
                  ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Screen-Wide Summer Breeze (Even Clicks: 2, 4, 6...) */}
      <AnimatePresence>
        {clickCount > 0 && activeMode === 'breeze' && (
          <div
            key={`dandelion-breeze-event-${clickCount}`}
            className="pointer-events-none fixed inset-0 z-[65] overflow-hidden"
            aria-hidden="true"
          >
            {BREEZE_SEEDS.map((s) => (
              <motion.div
                key={s.id}
                initial={{
                  left: s.startX,
                  top: s.startY,
                  opacity: 0,
                  scale: 0.4,
                  rotate: -15,
                }}
                animate={
                  reducedMotion
                    ? {
                        opacity: [0, 0.7, 0],
                      }
                    : {
                        x: [0, s.driftX * 0.48, s.driftX],
                        y: [0, s.driftY * 0.7, s.driftY],
                        opacity: [0, 0.95, 0.9, 0],
                        scale: [0.4, s.scale, s.scale * 0.95],
                        rotate: [-15, 8, -6],
                      }
                }
                transition={{
                  duration: s.duration,
                  delay: s.delay,
                  ease: [0.25, 0.85, 0.45, 1],
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
    </>
  )
}