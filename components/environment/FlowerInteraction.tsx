'use client'

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useState, useCallback } from 'react'
import Image from 'next/image'
import { canopyAssets } from '@/lib/assets'
import { playSound } from '@/lib/sounds'

type FlowerEffectType = 'blossom_breeze' | 'sunrays' | 'droplet_rain'

interface FlowerBush {
  id: string
  assetKey: 'flower1' | 'flower2' | 'flower3'
  label: string
  x: number // percentage along bottom border
  bottomOffset: number
  effect: FlowerEffectType
  containerClasses: string
  baseScale: number
  rotationOffset: number
  swayDuration: number
}

// 3 spaced-out flower bouquets kept at modest, elegant botanical proportions
const FLOWER_BUSHES: FlowerBush[] = [
  {
    id: 'bush-left-corner',
    assetKey: 'flower1',
    label: 'Left Corner Rose (Summons Cherry Blossom Breeze)',
    x: 8, // Left Corner
    bottomOffset: -6,
    effect: 'blossom_breeze',
    containerClasses: 'h-24 w-34 sm:h-28 sm:w-40 md:h-32 md:w-46',
    baseScale: 0.95,
    rotationOffset: -3,
    swayDuration: 4.8,
  },
  {
    id: 'bush-middle-center',
    assetKey: 'flower2',
    label: 'Middle Wildflower Bouquet (Summons Sunrays Across Screen)',
    x: 50, // Middle Center
    bottomOffset: -8,
    effect: 'sunrays',
    containerClasses: 'h-28 w-38 sm:h-32 sm:w-44 md:h-36 md:w-50',
    baseScale: 1.0,
    rotationOffset: 1,
    swayDuration: 5.4,
  },
  {
    id: 'bush-right-corner',
    assetKey: 'flower3',
    label: 'Right Corner Daisy (Summons Heavy Spring Rain)',
    x: 92, // Right Corner
    bottomOffset: -6,
    effect: 'droplet_rain',
    containerClasses: 'h-22 w-30 sm:h-26 sm:w-36 md:h-30 md:w-42',
    baseScale: 0.92,
    rotationOffset: 2,
    swayDuration: 4.5,
  },
]

// 36 cleft-notched authentic sakura petals tumbling across the screen
const BREEZE_PETALS = Array.from({ length: 36 }, (_, i) => ({
  id: i,
  startX: `${(i * 11) % 115 - 15}%`,
  startY: `${-15 - (i % 6) * 12}%`,
  driftX: 420 + (i % 5) * 85,
  driftY: 650 + (i % 7) * 95,
  scale: 0.75 + (i % 4) * 0.18,
  rotate: 240 + i * 50,
  width: 22 + (i % 4) * 3,
  height: 30 + (i % 4) * 4,
  delay: (i % 10) * 0.08,
  duration: 3.3 + (i % 4) * 0.35,
}))

// 27 radiant sunbeam shafts fanning out in ALL directions from off-screen sun origin
const SUNRAYS = Array.from({ length: 27 }, (_, i) => {
  const angle = -84 + i * 6.5
  const isMajor = i % 2 === 0
  return {
    id: i,
    angle,
    width: isMajor ? 68 : 42,
    length: isMajor ? '160vmax' : '135vmax',
    opacity: isMajor ? 0.75 : 0.45,
  }
})

// 24 floating golden sun motes
const SUN_MOTES = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  left: `${(i * 13.7) % 90 + 5}%`,
  top: `${(i * 17.3) % 75 + 10}%`,
  driftY: -40 - (i % 4) * 20,
  size: 4 + (i % 4) * 3,
  delay: (i % 6) * 0.12,
  duration: 2.2 + (i % 3) * 0.4,
}))

// 110 DENSE, HEAVY SPRING RAINDROPS (High velocity, layered depths, wind slant)
const HEAVY_RAINDROPS = Array.from({ length: 110 }, (_, i) => {
  const isForeground = i % 3 === 0
  return {
    id: i,
    startX: `${(i * 3.4) % 104 - 2}%`,
    startY: `${-20 - (i % 11) * 8}%`,
    fallDist: 1100 + (i % 7) * 90,
    windSlant: -32 - (i % 4) * 8, // Realistic wind slant
    height: isForeground ? 44 + (i % 5) * 16 : 28 + (i % 4) * 10,
    width: isForeground ? 2.6 : 1.7,
    opacity: isForeground ? 0.95 : 0.7,
    delay: (i % 20) * 0.045, // Rapid continuous shower
    duration: isForeground ? 0.85 + (i % 4) * 0.1 : 1.05 + (i % 4) * 0.12,
  }
})

// 16 ground splash ripples where heavy rain strikes the meadow
const RAIN_SPLASHES = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  left: `${(i * 6.3 + 3) % 94}%`,
  bottom: `${2 + (i % 5) * 4}%`,
  delay: 0.35 + (i % 8) * 0.14,
}))

export function FlowerInteraction() {
  const reducedMotion = useReducedMotion()
  const [bloomedIds, setBloomedIds] = useState<Set<string>>(() => new Set())
  const [effectCounter, setEffectCounter] = useState(0)
  const [activeEffect, setActiveEffect] = useState<FlowerEffectType | null>(null)

  const handleBushClick = useCallback(
    (bush: FlowerBush) => {
      // Play matching synthesized sound effect
      playSound(bush.effect)

      setBloomedIds((prev) => {
        const next = new Set(prev)
        next.add(bush.id)
        return next
      })

      if (reducedMotion) return

      setActiveEffect(bush.effect)
      setEffectCounter((c) => c + 1)

      setTimeout(() => {
        setActiveEffect((curr) => (curr === bush.effect ? null : curr))
      }, 3800)
    },
    [reducedMotion],
  )

  return (
    <>
      {/* =====================================================================
          1. CHERRY BLOSSOM BREEZE (Authentic Notched Petals with Natural Texture)
          ===================================================================== */}
      <AnimatePresence mode="wait">
        {activeEffect === 'blossom_breeze' && !reducedMotion && (
          <div
            key={`blossom-breeze-${effectCounter}`}
            className="pointer-events-none fixed inset-0 z-[65] overflow-hidden"
            aria-hidden="true"
            style={{ perspective: 900 }}
          >
            <div className="absolute inset-0 bg-[rgba(255,225,232,0.16)]" />

            {BREEZE_PETALS.map((p) => (
              <motion.div
                key={p.id}
                initial={{
                  left: p.startX,
                  top: p.startY,
                  scale: 0.4,
                  opacity: 0,
                  rotateZ: 0,
                  rotateX: 0,
                  rotateY: 0,
                }}
                animate={{
                  x: [0, p.driftX * 0.45, p.driftX],
                  y: [0, p.driftY * 0.6, p.driftY],
                  scale: [0.4, p.scale, p.scale * 0.95],
                  opacity: [0, 0.95, 0.9, 0],
                  rotateZ: [0, p.rotate * 0.5, p.rotate],
                  rotateX: [0, 240, 520],
                  rotateY: [0, 180, 400],
                }}
                transition={{
                  duration: p.duration,
                  delay: p.delay,
                  ease: [0.25, 0.85, 0.45, 1],
                }}
                className="absolute flex items-center justify-center"
                style={{ width: p.width, height: p.height }}
              >
                <svg
                  viewBox="0 0 40 52"
                  className="h-full w-full drop-shadow-[0_2px_4px_rgba(180,90,110,0.22)] select-none"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient
                      id={`sakura-grad-${p.id}`}
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#FFF2F5" />
                      <stop offset="45%" stopColor="#FFCCD9" />
                      <stop offset="100%" stopColor="#F48CA4" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 20 4 C 15 1, 6 7, 7 24 C 8 36, 17 48, 20 50 C 23 48, 32 36, 33 24 C 34 7, 25 1, 20 4 Z"
                    fill={`url(#sakura-grad-${p.id})`}
                  />
                  <path
                    d="M 20 50 C 20 40, 20 28, 20 18"
                    stroke="rgba(235, 115, 145, 0.35)"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* =====================================================================
          2. RADIANT SUNRAYS (Only Rays Visible — Sun Origin Off-Screen Above)
          ===================================================================== */}
      <AnimatePresence mode="wait">
        {activeEffect === 'sunrays' && !reducedMotion && (
          <div
            key={`sunrays-event-${effectCounter}`}
            className="pointer-events-none fixed inset-0 z-[65] overflow-hidden"
            aria-hidden="true"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.65, 0.75, 0.4, 0] }}
              transition={{ duration: 3.8, ease: 'easeInOut' }}
              className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,236,170,0.38)_0%,rgba(245,217,142,0.15)_50%,transparent_85%)]"
            />

            <div className="absolute -top-[140px] left-1/2 -translate-x-1/2 flex items-center justify-center">
              <motion.div
                initial={{ scaleY: 0.2, opacity: 0 }}
                animate={{
                  scaleY: [0.2, 1, 1.02, 0.95, 0.85],
                  opacity: [0, 0.95, 1, 0.65, 0],
                }}
                transition={{ duration: 3.8, ease: 'easeInOut' }}
                className="relative flex items-center justify-center origin-top"
              >
                {SUNRAYS.map((r) => (
                  <motion.div
                    key={r.id}
                    className="absolute top-0 left-1/2 -translate-x-1/2 origin-top"
                    style={{
                      transform: `rotate(${r.angle}deg)`,
                      width: `${r.width}px`,
                      height: r.length,
                      clipPath: 'polygon(46% 0%, 54% 0%, 100% 100%, 0% 100%)',
                      background:
                        'linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(255,238,170,0.65) 15%, rgba(245,217,142,0.3) 50%, rgba(245,217,142,0.06) 85%, transparent 100%)',
                    }}
                  />
                ))}
              </motion.div>
            </div>

            {SUN_MOTES.map((m) => (
              <motion.div
                key={m.id}
                initial={{ left: m.left, top: m.top, opacity: 0, scale: 0.4 }}
                animate={{
                  y: [0, m.driftY],
                  opacity: [0, 0.95, 0.9, 0],
                  scale: [0.4, 1.3, 0.7],
                }}
                transition={{
                  duration: m.duration,
                  delay: m.delay,
                  ease: 'easeInOut',
                }}
                className="absolute rounded-full bg-[#FFFDF0]"
                style={{
                  width: m.size,
                  height: m.size,
                  boxShadow:
                    '0 0 10px #F5D98E, 0 0 20px rgba(255,253,240,0.95)',
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* =====================================================================
          3. HEAVY SPRING RAIN (Dense, high-velocity rain shower + splashes)
          ===================================================================== */}
      <AnimatePresence mode="wait">
        {activeEffect === 'droplet_rain' && !reducedMotion && (
          <div
            key={`rain-shower-${effectCounter}`}
            className="pointer-events-none fixed inset-0 z-[65] overflow-hidden"
            aria-hidden="true"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.35, 0.45, 0.4, 0] }}
              transition={{ duration: 3.8, ease: 'easeInOut' }}
              className="absolute inset-0 bg-gradient-to-b from-[#2B4162]/35 via-[#385F71]/25 to-transparent backdrop-blur-[0.5px]"
            />

            {HEAVY_RAINDROPS.map((d) => (
              <motion.div
                key={d.id}
                initial={{
                  left: d.startX,
                  top: d.startY,
                  opacity: 0,
                }}
                animate={{
                  x: [0, d.windSlant],
                  y: [0, d.fallDist],
                  opacity: [0, d.opacity, d.opacity, 0],
                }}
                transition={{
                  duration: d.duration,
                  delay: d.delay,
                  repeat: 2,
                  ease: 'linear',
                }}
                className="absolute origin-top"
                style={{
                  width: `${d.width}px`,
                  height: `${d.height}px`,
                  transform: 'rotate(-7deg)',
                  background:
                    'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(200,230,255,0.7) 60%, transparent 100%)',
                  boxShadow: '0 0 4px rgba(255,255,255,0.6)',
                }}
              />
            ))}

            {RAIN_SPLASHES.map((s) => (
              <motion.div
                key={s.id}
                initial={{ left: s.left, bottom: s.bottom, scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1.4, 2.2],
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  duration: 0.65,
                  delay: s.delay,
                  repeat: 3,
                  ease: 'easeOut',
                }}
                className="absolute h-2.5 w-7 rounded-full border border-white/70 bg-white/20"
                style={{
                  boxShadow: '0 0 6px rgba(255,255,255,0.8)',
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* =====================================================================
          FLOWER BOUQUETS: TOUCHING BOTTOM BORDER AT z-45
          ===================================================================== */}
      <div
        className="pointer-events-none absolute inset-0 z-45 overflow-hidden"
        aria-label="Meadow flower interaction plane"
      >
        {FLOWER_BUSHES.map((bush) => {
          const isBloomed = bloomedIds.has(bush.id)
          const asset = canopyAssets[bush.assetKey]

          return (
            <div
              key={bush.id}
              className="absolute pointer-events-none"
              style={{
                left: `${bush.x}%`,
                bottom: `${bush.bottomOffset}px`,
                transform: 'translateX(-50%)',
              }}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleBushClick(bush)
                }}
                className="group pointer-events-auto relative flex cursor-pointer items-end justify-center rounded-full p-1.5 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5D98E]"
                aria-label={bush.label}
              >
                <motion.div
                  animate={
                    reducedMotion
                      ? {}
                      : {
                          rotate: [
                            bush.rotationOffset - 1.2,
                            bush.rotationOffset + 1.2,
                            bush.rotationOffset - 1.2,
                          ],
                          y: [0, -2, 0],
                        }
                  }
                  transition={{
                    duration: bush.swayDuration,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="relative flex items-end justify-center origin-bottom"
                >
                  <motion.div
                    animate={{
                      scale: isBloomed
                        ? [bush.baseScale, bush.baseScale * 1.15, bush.baseScale * 1.06]
                        : bush.baseScale,
                      filter: isBloomed
                        ? 'brightness(1.15) contrast(1.05) drop-shadow(0 6px 14px rgba(245,217,142,0.65))'
                        : 'brightness(1) contrast(1) drop-shadow(0 4px 8px rgba(44,36,32,0.22))',
                    }}
                    transition={{
                      duration: 0.6,
                      ease: [0.34, 1.56, 0.64, 1],
                    }}
                    className={`relative ${bush.containerClasses} origin-bottom`}
                  >
                    <Image
                      src={asset.src}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 140px, 190px"
                      priority
                      className="object-contain object-bottom select-none pointer-events-none"
                    />
                  </motion.div>
                </motion.div>
              </button>
            </div>
          )
        })}
      </div>
    </>
  )
}