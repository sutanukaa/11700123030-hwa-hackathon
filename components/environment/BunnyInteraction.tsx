'use client'

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { canopyAssets } from '@/lib/assets'

type BunnyPose = 'peek' | 'alert' | 'sit' | 'hop1' | 'hop2' | 'hide'

interface MeadowWaypoint {
  id: string
  desktop: { left: string; bottom: string }
  mobile: { left: string; bottom: string }
  scale: number
}

// 5 verified meadow waypoints (cleared of flowers, dandelion, butterfly, and UI)
const WAYPOINTS: MeadowWaypoint[] = [
  {
    id: 'waypoint-left-knoll',
    desktop: { left: '17%', bottom: '24%' },
    mobile: { left: '12%', bottom: '20%' },
    scale: 0.95,
  },
  {
    id: 'waypoint-mid-left-slope',
    desktop: { left: '42%', bottom: '30%' },
    mobile: { left: '38%', bottom: '26%' },
    scale: 0.86,
  },
  {
    id: 'waypoint-mid-right-grass',
    desktop: { left: '63%', bottom: '25%' },
    mobile: { left: '60%', bottom: '22%' },
    scale: 0.92,
  },
  {
    id: 'waypoint-right-planting',
    desktop: { left: '81%', bottom: '22%' },
    mobile: { left: '76%', bottom: '18%' },
    scale: 0.96,
  },
  {
    id: 'waypoint-upper-central',
    desktop: { left: '53%', bottom: '36%' },
    mobile: { left: '48%', bottom: '32%' },
    scale: 0.8,
  },
]

// Fisher-Yates shuffle with boundary duplicate avoidance
function generateShuffledIndices(lastIndex: number | null): number[] {
  const pool = [0, 1, 2, 3, 4]
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]]
  }
  if (lastIndex !== null && pool[0] === lastIndex && pool.length > 1) {
    [pool[0], pool[1]] = [pool[1], pool[0]]
  }
  return pool
}

export function BunnyInteraction() {
  const reducedMotion = useReducedMotion()

  const [isVisible, setIsVisible] = useState(false)
  const [currentPose, setCurrentPose] = useState<BunnyPose>('peek')
  const [activeWaypoint, setActiveWaypoint] = useState<MeadowWaypoint>(WAYPOINTS[0])
  const [isInteracting, setIsInteracting] = useState(false)

  // Stable lifecycle refs
  const isInteractingRef = useRef(false)
  const isVisibleRef = useRef(false)
  const lastWaypointIndexRef = useRef<number | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const isMountedRef = useRef(true)

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  // =========================================================================
  // APPEARANCE SCHEDULER
  // =========================================================================
  const runAppearanceCycle = useCallback(() => {
    if (!isMountedRef.current || isInteractingRef.current) return

    const appearanceCount = 2 + Math.floor(Math.random() * 3) // 2, 3, or 4
    const shuffledWaypoints = generateShuffledIndices(lastWaypointIndexRef.current)
    let appearancesCompleted = 0

    const showNextAppearance = () => {
      if (!isMountedRef.current || isInteractingRef.current) return

      const nextWaypointIdx = shuffledWaypoints[appearancesCompleted]
      lastWaypointIndexRef.current = nextWaypointIdx
      setActiveWaypoint(WAYPOINTS[nextWaypointIdx])

      setCurrentPose('peek')
      setIsInteracting(false)
      setIsVisible(true)
      isVisibleRef.current = true

      // Visible duration: 2.2 to 3.8 seconds
      const visibleDuration = 2200 + Math.random() * 1600

      timerRef.current = setTimeout(() => {
        if (!isMountedRef.current || isInteractingRef.current) return

        // Lower back down into grass
        setIsVisible(false)
        isVisibleRef.current = false
        appearancesCompleted += 1

        if (appearancesCompleted < appearanceCount) {
          // Gap between peeks: 1.5 to 3.0 seconds
          const gapDuration = 1500 + Math.random() * 1500
          timerRef.current = setTimeout(() => {
            showNextAppearance()
          }, gapDuration)
        } else {
          // Cycle finished: WAIT EXACTLY 5 SECONDS before next cycle
          timerRef.current = setTimeout(() => {
            runAppearanceCycle()
          }, 5000)
        }
      }, visibleDuration)
    }

    showNextAppearance()
  }, [])

  useEffect(() => {
    isMountedRef.current = true

    // Initial delay before first cycle starts in Explore
    timerRef.current = setTimeout(() => {
      runAppearanceCycle()
    }, 2400)

    return () => {
      isMountedRef.current = false
      clearTimer()
    }
  }, [runAppearanceCycle, clearTimer])

  // =========================================================================
  // USER CLICK / TAP SEQUENCE (Alert -> Sit -> Hop 1 -> Hop 2 -> Hide (Pause) -> Exit)
  // =========================================================================
  const handleBunnyClick = useCallback(() => {
    if (isInteractingRef.current || !isVisibleRef.current) return

    clearTimer()
    isInteractingRef.current = true
    setIsInteracting(true)

    if (reducedMotion) {
      setCurrentPose('alert')
      timerRef.current = setTimeout(() => {
        if (!isMountedRef.current) return
        setIsVisible(false)
        isVisibleRef.current = false
        setCurrentPose('peek')
        timerRef.current = setTimeout(() => {
          if (!isMountedRef.current) return
          isInteractingRef.current = false
          setIsInteracting(false)
          runAppearanceCycle()
        }, 5000)
      }, 1600)
      return
    }

    // Sequence 1: Alert (startled perk)
    setCurrentPose('alert')

    // Sequence 2: Curious Sit after 450ms
    timerRef.current = setTimeout(() => {
      if (!isMountedRef.current) return
      setCurrentPose('sit')

      // Sequence 3: Hop-1 (upward-forward leap) after 600ms
      timerRef.current = setTimeout(() => {
        if (!isMountedRef.current) return
        setCurrentPose('hop1')

        // Sequence 4: Hop-2 (landing on ground) after 340ms
        timerRef.current = setTimeout(() => {
          if (!isMountedRef.current) return
          setCurrentPose('hop2')

          // Sequence 5: Show the Hiding Pose visibly in the grass
          timerRef.current = setTimeout(() => {
            if (!isMountedRef.current) return
            setCurrentPose('hide')

            // Let the user clearly see the shy hiding bunny for 850ms before disappearing!
            timerRef.current = setTimeout(() => {
              if (!isMountedRef.current) return
              // Sequence 6: Submerge into meadow
              setIsVisible(false)
              isVisibleRef.current = false
              setCurrentPose('peek')

              // Exactly 5-second cooldown before resuming appearance scheduler
              timerRef.current = setTimeout(() => {
                if (!isMountedRef.current) return
                isInteractingRef.current = false
                setIsInteracting(false)
                runAppearanceCycle()
              }, 5000)
            }, 850)
          }, 340)
        }, 340)
      }, 600)
    }, 450)
  }, [reducedMotion, clearTimer, runAppearanceCycle])

  // Asset mapping
  const activeAsset =
    currentPose === 'alert'
      ? canopyAssets.rabbitAlert
      : currentPose === 'sit'
        ? canopyAssets.rabbitSit
        : currentPose === 'hop1'
          ? canopyAssets.rabbitHop1
          : currentPose === 'hop2'
            ? canopyAssets.rabbitHop2
            : currentPose === 'hide'
              ? canopyAssets.rabbitHide
              : canopyAssets.rabbitPeek

  return (
    <div
      className="pointer-events-none absolute inset-0 z-32 overflow-hidden select-none"
      aria-label="Meadow wildlife interaction plane"
    >
      <AnimatePresence>
        {isVisible && (
          <div
            style={
              {
                '--bx-m': activeWaypoint.mobile.left,
                '--by-m': activeWaypoint.mobile.bottom,
                '--bx-d': activeWaypoint.desktop.left,
                '--by-d': activeWaypoint.desktop.bottom,
              } as React.CSSProperties
            }
            className="pointer-events-none absolute left-[var(--bx-m)] bottom-[var(--by-m)] md:left-[var(--bx-d)] md:bottom-[var(--by-d)] -translate-x-1/2 origin-bottom overflow-visible"
          >
            <motion.div
              key={`bunny-actor-${activeWaypoint.id}`}
              initial={{ y: 52, opacity: 0.6 }}
              animate={
                isInteracting
                  ? currentPose === 'hop1'
                    ? { x: 30, y: -26, opacity: 1 }
                    : currentPose === 'hop2'
                      ? { x: 62, y: 0, opacity: 1 }
                      : currentPose === 'hide'
                        ? { x: 68, y: 4, opacity: 1 }
                        : { x: 0, y: 0, opacity: 1 }
                  : {
                      y: 0,
                      opacity: 1,
                      rotate: reducedMotion ? 0 : [-1.2, 1.2, -0.6, 0.6, 0],
                    }
              }
              exit={{ y: 52, opacity: 0 }}
              transition={
                isInteracting
                  ? { duration: 0.32, ease: [0.25, 1, 0.5, 1] }
                  : {
                      duration: 0.52,
                      ease: [0.22, 1, 0.36, 1],
                      rotate: reducedMotion
                        ? { duration: 0 }
                        : { repeat: Infinity, duration: 3.2, ease: 'easeInOut' },
                    }
              }
              className="pointer-events-none relative origin-bottom"
            >
              {/* Playful Bunny Speech Bubble */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={isInteracting ? 'bunny-fren' : 'bunny-psst'}
                  initial={{ opacity: 0, scale: 0.6, y: 6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.6, y: -4 }}
                  transition={{ duration: 0.22, ease: [0.25, 1, 0.5, 1] }}
                  className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap z-20"
                >
                  <div className="relative rounded-full border border-slate-200/90 bg-white/95 px-3 py-1 shadow-md">
                    <span className="text-xs font-bold tracking-wide text-slate-800 [font-family:var(--font-fredoka)]">
                      {isInteracting ? 'hellooo there fren' : 'psst psst'}
                    </span>
                    {/* Speech bubble pointer triangle */}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-2 w-2 rotate-45 border-b border-r border-slate-200 bg-white" />
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Clickable Hit Target */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleBunnyClick()
                }}
                className="group pointer-events-auto relative flex cursor-pointer items-end justify-center rounded-full p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-emerald-600"
                aria-label="A shy bunny peeking out from the meadow grass (click to interact)"
              >
                {/* 
                  Anchored Meadow Mask:
                  Prevents baked-in base grass from floating above terrain
                */}
                <div
                  className="relative aspect-[3/2] w-28 sm:w-34 md:w-42 overflow-hidden select-none"
                  style={{
                    transform: `scale(${activeWaypoint.scale})`,
                    transformOrigin: 'bottom center',
                    maskImage:
                      'linear-gradient(to top, transparent 0%, black 14%, black 100%)',
                    WebkitMaskImage:
                      'linear-gradient(to top, transparent 0%, black 14%, black 100%)',
                  }}
                >
                  <Image
                    src={activeAsset.src}
                    alt={activeAsset.alt}
                    fill
                    sizes="(max-width: 768px) 140px, 170px"
                    className="object-contain object-bottom pointer-events-none"
                  />
                </div>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}