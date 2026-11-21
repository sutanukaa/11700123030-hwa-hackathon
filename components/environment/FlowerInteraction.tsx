'use client'

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useState, useCallback } from 'react'
import Image from 'next/image'
import { canopyAssets } from '@/lib/assets'

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
    label: 'Right Corner Daisy (Summons Droplet Rain)',
    x: 92, // Right Corner
    bottomOffset: -6,
    effect: 'droplet_rain',
    containerClasses: 'h-22 w-30 sm:h-26 sm:w-36 md:h-30 md:w-42',
    baseScale: 0.92,
    rotationOffset: 2,
    swayDuration: 4.5,
  },
]

// 38 authentic notched cherry blossom petals cascading across the whole screen
const BREEZE_PETALS = Array.from({ length: 38 }, (_, i) => ({
  id: i,
  startX: `${(i * 9.7) % 96 + 2}%`,
  startY: `${-12 - (i % 6) * 7}%`,
  driftX: 180 + (i % 6) * 90,
  driftY: 960 + (i % 5) * 110,
  rotate: 240 + i * 50,
  width: 22 + (i % 4) * 3, // Elongated proportions (not square/circular)
  height: 30 + (i % 4) * 4,
  delay: (i % 10) * 0.08,
  duration: 3.3 + (i % 4) * 0.35,
}))

// 27 radiant sunbeam shafts fanning out in ALL directions from the off-screen sun origin
const SUNRAYS = Array.from({ length: 27 }, (_, i) => {
  const angle = -84 + i * 6.5 // Fanning across -84° to +84°
  const isMajor = i % 2 === 0
  return {
    id: i,
    angle,
    width: isMajor ? 68 : 42,
    length: isMajor ? '160vmax' : '135vmax',
    opacity: isMajor ? 0.75 : 0.45,
  }
})

// 24 floating golden sun motes dancing across the screen
const SUN_MOTES = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  left: `${(i * 13.7) % 90 + 5}%`,
  top: `${(i * 17.3) % 75 + 10}%`,
  driftY: -40 - (i % 4) * 20,
  size: 4 + (i % 4) * 3,
  delay: (i % 6) * 0.12,
  duration: 2.2 + (i % 3) * 0.4,
}))

// 48 crystal spring raindrops (Droplet Rain)
const CRYSTAL_DROPS = Array.from({ length: 48 }, (_, i) => ({
  id: i,
  startX: `${(i * 8.7) % 96 + 2}%`,
  startY: `${-15 - (i % 7) * 7}%`,
  fallDist: 1050 + (i % 6) * 90,
  height: 24 + (i % 5) * 14,
  width: 2.2,
  delay: (i % 12) * 0.07,
  duration: 1.3 + (i % 4) * 0.2,
}))

export function FlowerInteraction() {
  const reducedMotion = useReducedMotion()
  const [bloomedIds, setBloomedIds] = useState<Set<string>>(() => new Set())
  const [effectCounter, setEffectCounter] = useState(0)
  const [activeEffect, setActiveEffect] = useState<FlowerEffectType | null>(null)

  const handleBushClick = useCallback(
    (bush: FlowerBush) => {
      // Mark as bloomed
      setBloomedIds((prev) => {
        const next = new Set(prev)
        next.add(bush.id)
        return next
      })

      if (reducedMotion) return

      // Trigger full-screen atmospheric effect
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
            {/* Soft spring atmosphere blush sheen */}
            <div className="absolute inset-0 bg-[rgba(255,225,232,0.16)]" />

            {BREEZE_PETALS.map((p) => (
              <motion.div
                key={p.id}
                initial={{
                  left: p.startX,
                  top: p.startY,
                  opacity: 0,
                  scale: 0.5,
                  rotate: 0,
                  rotateX: 0,
                  rotateY: 0,
                }}
                animate={{
                  x: [0, p.driftX * 0.45, p.driftX],
                  y: [0, p.driftY * 0.55, p.driftY],
                  opacity: [0, 0.98, 0.92, 0],
                  scale: [0.65, 1.15, 0.85],
                  rotate: [0, p.rotate * 0.6, p.rotate],
                  rotateX: [0, 180, 360],
                  rotateY: [0, 140, 280],
                }}
                transition={{
                  duration: p.duration,
                  delay: p.delay,
                  ease: [0.25, 1, 0.5, 1],
                }}
                className="absolute flex items-center justify-center origin-center"
                style={{ width: p.width, height: p.height }}
              >
                {/* Authentic Cherry Blossom Petal Silhouette & Texture */}
                <svg
                  viewBox="0 0 100 130"
                  className="h-full w-full drop-shadow-[0_2px_4px_rgba(200,85,115,0.35)]"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient
                      id={`sakuraGrad-${p.id}`}
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#FFF2F6" />
                      <stop offset="25%" stopColor="#FFC5D3" />
                      <stop offset="70%" stopColor="#FF94AA" />
                      <stop offset="100%" stopColor="#E65D7B" />
                    </linearGradient>
                    <linearGradient
                      id={`sakuraSheen-${p.id}`}
                      x1="0%"
                      y1="0%"
                      x2="50%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
                      <stop offset="50%" stopColor="rgba(255,255,255,0.15)" />
                      <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                  </defs>

                  {/* Iconic Cleft-Notched Sakura Petal Outline */}
                  <path
                    d="M 50 124 C 36 100 14 74 14 42 C 14 20 28 10 44 14 C 47 15 49 19 50 22 C 51 19 53 15 56 14 C 72 10 86 20 86 42 C 86 74 64 100 50 124 Z"
                    fill={`url(#sakuraGrad-${p.id})`}
                  />

                  {/* Translucent Lobe Highlight Sheen */}
                  <path
                    d="M 50 124 C 36 100 14 74 14 42 C 14 20 28 10 44 14 C 47 15 49 19 50 22 Q 48 70 50 124 Z"
                    fill={`url(#sakuraSheen-${p.id})`}
                  />

                  {/* Subtle Center Petal Fold / Vein Spine */}
                  <path
                    d="M 50 22 Q 49 70 50 124"
                    stroke="rgba(220, 80, 110, 0.35)"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />

                  {/* Translucent Delicate Veinlets */}
                  <path
                    d="M 49 55 Q 35 45 28 40 M 49 75 Q 36 68 25 65 M 50 55 Q 65 45 72 40 M 50 75 Q 64 68 75 65"
                    stroke="rgba(255, 255, 255, 0.45)"
                    strokeWidth="0.8"
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
            {/* Full-Screen Soft Golden Sky Warmth */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.65, 0.75, 0.4, 0] }}
              transition={{ duration: 3.8, ease: 'easeInOut' }}
              className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,236,170,0.38)_0%,rgba(245,217,142,0.15)_50%,transparent_85%)]"
            />

            {/* Sun Origin Moved OFF-SCREEN Above Top Edge (top: -140px, left: 50%) */}
            <div className="absolute -top-[140px] left-1/2 -translate-x-1/2 flex items-center justify-center">
              {/* Radiating Sunbeam Shafts Streaming Down Across Entire Viewport */}
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

            {/* Shimmering Sun Motes Dancing in the Downward Sunrays */}
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
          3. DROPLET RAIN (Full-Screen Spring Crystal Dewdrop Shower)
          ===================================================================== */}
      <AnimatePresence mode="wait">
        {activeEffect === 'droplet_rain' && !reducedMotion && (
          <div
            key={`droplet-rain-${effectCounter}`}
            className="pointer-events-none fixed inset-0 z-[65] overflow-hidden"
            aria-hidden="true"
          >
            {/* Refreshing Cool Mist Sheen */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.45, 0] }}
              transition={{ duration: 3.5, ease: 'easeInOut' }}
              className="absolute inset-0 bg-[rgba(185,211,230,0.12)] backdrop-blur-[0.5px]"
            />

            {CRYSTAL_DROPS.map((r) => (
              <motion.div
                key={r.id}
                initial={{
                  left: r.startX,
                  top: r.startY,
                  opacity: 0,
                  y: 0,
                }}
                animate={{
                  y: r.fallDist,
                  opacity: [0, 0.9, 0.8, 0],
                }}
                transition={{
                  duration: r.duration,
                  delay: r.delay,
                  ease: 'linear',
                }}
                className="absolute rounded-full"
                style={{
                  width: r.width,
                  height: r.height,
                  background:
                    'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(200,230,255,0.7) 70%, transparent 100%)',
                  boxShadow:
                    '0 0 6px rgba(255,255,255,0.85), 0 0 10px rgba(185,211,230,0.6)',
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
        aria-label="Foreground flower bouquets interaction plane"
      >
        {FLOWER_BUSHES.map((bush) => {
          const isBloomed = bloomedIds.has(bush.id)
          const asset = canopyAssets[bush.assetKey]

          return (
            <div
              key={bush.id}
              style={{
                left: `${bush.x}%`,
                bottom: `${bush.bottomOffset}px`,
              }}
              className="pointer-events-none absolute -translate-x-1/2 origin-bottom"
            >
              {/* Touch & Click Target Button */}
              <button
                type="button"
                onPointerDown={(e) => {
                  e.stopPropagation()
                  handleBushClick(bush)
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  handleBushClick(bush)
                }}
                onTouchStart={(e) => {
                  e.stopPropagation()
                  handleBushClick(bush)
                }}
                className="group pointer-events-auto relative flex cursor-pointer items-end justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5D98E]"
                aria-label={`${bush.label} (${isBloomed ? 'bloomed' : 'click to interact'})`}
              >
                {/* Natural Ground Sway */}
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
                        }
                  }
                  transition={{
                    duration: bush.swayDuration,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="relative flex items-end justify-center origin-bottom"
                >
                  {/* Restrained Bouquet Artwork */}
                  <motion.div
                    initial={false}
                    animate={
                      isBloomed
                        ? {
                            scale: [
                              bush.baseScale * 0.98,
                              bush.baseScale * 1.04,
                              bush.baseScale * 0.98,
                            ],
                            filter:
                              'brightness(1.04) drop-shadow(0 6px 14px rgba(44,36,32,0.30))',
                          }
                        : {
                            scale: bush.baseScale * 0.92,
                            filter:
                              'brightness(0.96) saturate(0.92) drop-shadow(0 4px 10px rgba(44,36,32,0.24))',
                          }
                    }
                    whileHover={
                      !reducedMotion
                        ? {
                            scale: bush.baseScale * 1.02,
                            filter:
                              'brightness(1.05) drop-shadow(0 6px 14px rgba(245,217,142,0.35))',
                          }
                        : {}
                    }
                    transition={{
                      duration: 0.6,
                      ease: [0.25, 1, 0.5, 1],
                    }}
                    className={`relative ${bush.containerClasses} origin-bottom select-none`}
                  >
                    <Image
                      src={asset.src}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 180px, 240px"
                      priority
                      className="object-contain object-bottom transition-transform duration-300"
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