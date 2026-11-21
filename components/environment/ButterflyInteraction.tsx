'use client'

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import { canopyAssets } from '@/lib/assets'

// Safe meadow flight waypoints across open wildflower areas
interface Waypoint {
  x: number
  y: number
}

const MEADOW_WAYPOINTS: Waypoint[] = [
  { x: 50, y: 55 }, // Center meadow
  { x: 62, y: 46 }, // Mid-right opening
  { x: 72, y: 58 }, // Sunlit rise
  { x: 78, y: 48 }, // Right breeze
  { x: 58, y: 66 }, // Lower clover
  { x: 44, y: 60 }, // Lower-left glide
  { x: 56, y: 50 }, // Upper horizon
  { x: 68, y: 62 }, // Lower-right border
]

// 32 screen-wide floating sparkles during the golden overlay
const SCREEN_SPARKLES = Array.from({ length: 32 }, (_, i) => ({
  id: i,
  left: `${(i * 13.7) % 94 + 3}%`,
  top: `${(i * 17.3) % 88 + 6}%`,
  size: 3.5 + (i % 4) * 2.5,
  delay: (i % 8) * 0.08,
  duration: 1.4 + (i % 4) * 0.35,
}))

// 20 radiant golden particles bursting from the center butterfly
const BURST_PARTICLES = Array.from({ length: 20 }, (_, i) => {
  const angle = (i * (360 / 20) * Math.PI) / 180
  const distance = 90 + (i % 3) * 35
  return {
    id: i,
    targetX: Math.cos(angle) * distance,
    targetY: Math.sin(angle) * distance,
    size: 5 + (i % 3) * 3,
  }
})

interface ButterflyProps {
  isAssembled?: boolean
}

type CelebrationStage = 'hidden' | 'big_center' | 'fly_away'

export function ButterflyInteraction({ isAssembled = true }: ButterflyProps) {
  const reducedMotion = useReducedMotion()
  const butterflyRef = useRef<HTMLDivElement>(null)

  // Interaction refs
  const isCaughtRef = useRef(false)
  const isEvadingRef = useRef(false)
  const evasionCountRef = useRef(0)
  const activeTimersRef = useRef<Set<NodeJS.Timeout>>(new Set())

  // Flight state (Normal meadow mode)
  const [waypointIndex, setWaypointIndex] = useState(0)
  const [flightDuration, setFlightDuration] = useState(3.4)

  // Celebration overlay state
  const [celebrationStage, setCelebrationStage] = useState<CelebrationStage>('hidden')
  const [showGoldenText, setShowGoldenText] = useState(false)
  const [isCelebrationDone, setIsCelebrationDone] = useState(false)

  // Safe timer registration
  const safeTimeout = useCallback((fn: () => void, delay: number) => {
    const timer = setTimeout(() => {
      activeTimersRef.current.delete(timer)
      fn()
    }, delay)
    activeTimersRef.current.add(timer)
    return timer
  }, [])

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      activeTimersRef.current.forEach((t) => clearTimeout(t))
      activeTimersRef.current.clear()
    }
  }, [])

  // =========================================================================
  // CONTINUOUS MEADOW FLIGHT LOOP (Normal state)
  // =========================================================================
  const handleFlightComplete = useCallback(() => {
    if (isCaughtRef.current) return

    safeTimeout(() => {
      if (!isCaughtRef.current) {
        setFlightDuration(3.2 + Math.random() * 0.6)
        setWaypointIndex((prev) => (prev + 1) % MEADOW_WAYPOINTS.length)
      }
    }, 300 + Math.random() * 300)
  }, [safeTimeout])

  // =========================================================================
  // VECTOR-BASED PROXIMITY EVASION (Desktop Pointer)
  // =========================================================================
  useEffect(() => {
    if (reducedMotion || celebrationStage !== 'hidden') return

    const handleWindowPointerMove = (e: PointerEvent) => {
      if (
        isCaughtRef.current ||
        e.pointerType !== 'mouse' ||
        !butterflyRef.current
      )
        return

      if (evasionCountRef.current >= 2) return

      const rect = butterflyRef.current.getBoundingClientRect()
      const bCenterX = rect.left + rect.width / 2
      const bCenterY = rect.top + rect.height / 2

      const dist = Math.hypot(e.clientX - bCenterX, e.clientY - bCenterY)

      if (dist < 85 && dist > 35 && !isEvadingRef.current) {
        isEvadingRef.current = true
        evasionCountRef.current += 1

        setFlightDuration(1.2)
        setWaypointIndex((prev) => (prev + 2) % MEADOW_WAYPOINTS.length)

        safeTimeout(() => {
          isEvadingRef.current = false
        }, 1300)
      }
    }

    window.addEventListener('pointermove', handleWindowPointerMove)
    return () => window.removeEventListener('pointermove', handleWindowPointerMove)
  }, [celebrationStage, reducedMotion, safeTimeout])

  // =========================================================================
  // CHOREOGRAPHED CATCH SEQUENCE
  // 1. Big Golden Butterfly in Screen Center
  // 2. Text Appears: "Well, someone's persistent!"
  // 3. Text SHRINKS & DISAPPEARS FIRST
  // 4. Butterfly Shrinks & Flies Away (Independently)
  // =========================================================================
  const handleCatch = useCallback(() => {
    if (isCaughtRef.current) return
    isCaughtRef.current = true

    // STEP 1: Full-screen overlay activates with BIG golden butterfly in screen center
    setCelebrationStage('big_center')

    // STEP 2: Message banner pops in underneath the big butterfly
    safeTimeout(() => {
      setShowGoldenText(true)
    }, 350)

    // STEP 3: Message banner explicitly SHRINKS and fades away first after 2.2s
    safeTimeout(() => {
      setShowGoldenText(false)
    }, 2500)

    // STEP 4: Only after text has completely shrunk away, the butterfly shrinks and flies away!
    safeTimeout(() => {
      setCelebrationStage('fly_away')

      // STEP 5: Gently dissolve overlay after butterfly departs off-screen
      safeTimeout(() => {
        setIsCelebrationDone(true)
      }, 1900)
    }, 3200)
  }, [safeTimeout])

  if (!isAssembled || isCelebrationDone) return null

  return (
    <>
      {/* =====================================================================
          1. NORMAL MEADOW BUTTERFLY (With "Catch me if you can" bubble)
          ===================================================================== */}
      {celebrationStage === 'hidden' && (
        <div
          className="pointer-events-none absolute inset-0 z-50 overflow-hidden"
          aria-label="Interactive garden butterfly"
        >
          <motion.div
            ref={butterflyRef}
            initial={{ left: '50%', top: '55%' }}
            animate={{
              left: `${MEADOW_WAYPOINTS[waypointIndex].x}%`,
              top: `${MEADOW_WAYPOINTS[waypointIndex].y}%`,
            }}
            transition={{
              duration: flightDuration,
              ease: [0.25, 1, 0.5, 1],
            }}
            onAnimationComplete={handleFlightComplete}
            className="pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2"
          >
            {/* Playful Speech Bubble: "Catch me if you can" */}
            <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 -translate-y-2 whitespace-nowrap">
              <div className="relative rounded-full border border-[#E8DED2] bg-[#FFF8EF]/95 px-3 py-1 shadow-sm backdrop-blur-sm">
                <span className="font-display text-xs font-medium tracking-wide text-[#51443E]">
                  Catch me if you can
                </span>
                {/* Speech bubble pointer triangle */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-2 w-2 rotate-45 border-b border-r border-[#E8DED2] bg-[#FFF8EF]" />
              </div>
            </div>

            {/* Click & Touch Target Button */}
            <button
              type="button"
              onPointerDown={(e) => {
                e.stopPropagation()
                handleCatch()
              }}
              onClick={(e) => {
                e.stopPropagation()
                handleCatch()
              }}
              onTouchStart={(e) => {
                e.stopPropagation()
                handleCatch()
              }}
              className="group relative flex h-24 w-24 sm:h-28 sm:w-28 cursor-pointer items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5D98E]"
              aria-label="Catch the fluttering butterfly"
            >
              {/* Meadow Wing Flutter */}
              <motion.div
                animate={
                  reducedMotion
                    ? {}
                    : {
                        scaleX: [1, 0.36, 1],
                        y: [0, -5, 0],
                      }
                }
                transition={{
                  duration: 0.22,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="relative h-11 w-16 sm:h-12 sm:w-18"
              >
                <Image
                  src={canopyAssets.butterfly1.src}
                  alt="CANOPY Butterfly"
                  fill
                  sizes="72px"
                  priority
                  className="object-contain drop-shadow-[0_2px_4px_rgba(81,68,62,0.18)]"
                />
              </motion.div>
            </button>
          </motion.div>
        </div>
      )}

      {/* =====================================================================
          2. FULL-SCREEN OVERLAY: BIG GOLDEN BUTTERFLY IN SCREEN CENTER
          ===================================================================== */}
      <AnimatePresence>
        {celebrationStage !== 'hidden' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="pointer-events-none fixed inset-0 z-[90] flex flex-col items-center justify-center overflow-hidden"
            aria-live="polite"
          >
            {/* Theatrical background overlay: dims and blurs background garden */}
            <div className="absolute inset-0 bg-[#1D1714]/50 backdrop-blur-[4px]" />

            {/* Radiant golden ambient spotlight */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(circle at center, rgba(245, 217, 142, 0.50) 0%, rgba(201, 121, 92, 0.18) 50%, transparent 80%)',
              }}
            />

            {/* Whole-screen golden sparkles */}
            {SCREEN_SPARKLES.map((s) => (
              <motion.span
                key={s.id}
                initial={{ opacity: 0, scale: 0, y: 20 }}
                animate={{
                  opacity: [0, 0.95, 0.3, 0.9, 0],
                  scale: [0.3, 1.4, 0.8, 1.3, 0],
                  y: [20, -45],
                }}
                transition={{
                  duration: s.duration,
                  delay: s.delay,
                  repeat: 2,
                  ease: 'easeInOut',
                }}
                className="absolute rounded-full bg-[#F5D98E]"
                style={{
                  left: s.left,
                  top: s.top,
                  width: s.size,
                  height: s.size,
                  boxShadow: '0 0 10px #F5D98E, 0 0 20px #FFFDF0',
                }}
              />
            ))}

            {/* Centerpiece Golden Butterfly (BIG in center of screen!) */}
            <motion.div
              initial={{ scale: 0.2, opacity: 0, y: 30 }}
              animate={
                celebrationStage === 'big_center'
                  ? { scale: 1, opacity: 1, x: 0, y: 0 }
                  : {
                      // Stage: fly_away -> butterfly shrinks small and arcs up into the sky
                      scale: 0.18,
                      x: '75vw',
                      y: '-75vh',
                      opacity: [1, 1, 0.8, 0],
                      rotate: 28,
                    }
              }
              transition={
                celebrationStage === 'big_center'
                  ? { duration: 0.75, ease: [0.34, 1.56, 0.64, 1] }
                  : { duration: 1.8, ease: [0.35, 0, 0.15, 1] }
              }
              className="relative flex items-center justify-center"
            >
              {/* BIG Butterfly Image: 280px wide on mobile, 360px wide on desktop! */}
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  y: [0, -6, 0],
                }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="relative h-48 w-68 sm:h-64 sm:w-92"
              >
                <Image
                  src={canopyAssets.butterflyMagical.src}
                  alt="Golden Butterfly"
                  fill
                  sizes="400px"
                  priority
                  className="object-contain drop-shadow-[0_0_35px_rgba(245,217,142,0.95)] filter brightness-115"
                />
              </motion.div>

              {/* Radiant Sparkle Burst radiating from the BIG Butterfly */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {BURST_PARTICLES.map((p) => (
                  <motion.span
                    key={p.id}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 0.5 }}
                    animate={{
                      x: p.targetX,
                      y: p.targetY,
                      opacity: 0,
                      scale: 1.5,
                    }}
                    transition={{
                      duration: 1.2,
                      ease: [0.25, 1, 0.5, 1],
                    }}
                    className="absolute rounded-full bg-[#F5D98E]"
                    style={{
                      width: p.size,
                      height: p.size,
                      boxShadow: '0 0 10px #F5D98E, 0 0 16px #FFFDF0',
                    }}
                  />
                ))}
              </div>
            </motion.div>

            {/* SEPARATE Message Banner: Explicitly shrinks and fades away IN PLACE */}
            <AnimatePresence>
              {showGoldenText && (
                <motion.div
                  key="golden-message-banner"
                  initial={{ opacity: 0, y: 15, scale: 0.85 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.4 }}
                  transition={{ duration: 0.45, ease: 'easeInOut' }}
                  className="mt-6 pointer-events-none whitespace-nowrap rounded-full border border-[#F5D98E] bg-[#FFF8EF]/95 px-6 py-3 shadow-2xl backdrop-blur-md"
                >
                  <span className="font-display text-base sm:text-xl font-semibold tracking-wide text-[#51443E]">
                    Well, someone&apos;s persistent!
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}