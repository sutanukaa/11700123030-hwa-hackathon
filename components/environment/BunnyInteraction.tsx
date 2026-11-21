'use client'

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { canopyAssets } from '@/lib/assets'
import { playSound } from '@/lib/sounds'

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

      // Play soft, cute bunny pop sound on appearance
      playSound('bunny_peek')

      // Visible duration: 2.2 to 3.8 seconds
      const visibleDuration = 2200 + Math.random() * 1600

      timerRef.current = setTimeout(() => {
        if (!isMountedRef.current || isInteractingRef.current) return

        setIsVisible(false)
        isVisibleRef.current = false
        appearancesCompleted += 1

        if (appearancesCompleted < appearanceCount) {
          const gapDuration = 1500 + Math.random() * 1500
          timerRef.current = setTimeout(() => {
            showNextAppearance()
          }, gapDuration)
        } else {
          // Exactly 5-second pause between appearance cycles
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

    timerRef.current = setTimeout(() => {
      runAppearanceCycle()
    }, 2400)

    return () => {
      isMountedRef.current = false
      clearTimer()
    }
  }, [runAppearanceCycle, clearTimer])

  // =========================================================================
  // USER CLICK / TAP SEQUENCE (Alert -> Sit -> Hop 1 -> Hop 2 -> Hide -> Exit)
  // =========================================================================
  const handleBunnyClick = useCallback(() => {
    if (isInteractingRef.current || !isVisibleRef.current) return

    clearTimer()
    isInteractingRef.current = true
    setIsInteracting(true)

    // Play cheerful hop bounce sound
    playSound('bunny_hop')

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

    setCurrentPose('alert')

    timerRef.current = setTimeout(() => {
      if (!isMountedRef.current) return
      setCurrentPose('sit')

      timerRef.current = setTimeout(() => {
        if (!isMountedRef.current) return
        setCurrentPose('hop1')
        playSound('bunny_hop')

        timerRef.current = setTimeout(() => {
          if (!isMountedRef.current) return
          setCurrentPose('hop2')

          timerRef.current = setTimeout(() => {
            if (!isMountedRef.current) return
            setCurrentPose('hide')

            // Hold hiding pose visibly for 850ms before disappearing
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
            }, 850)
          }, 340)
        }, 340)
      }, 600)
    }, 450)
  }, [reducedMotion, clearTimer, runAppearanceCycle])

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
      <div
        className="pointer-events-none absolute transition-all duration-700 ease-out"
        style={{
          left: `var(--bunny-left, ${activeWaypoint.desktop.left})`,
          bottom: `var(--bunny-bottom, ${activeWaypoint.desktop.bottom})`,
          transform: `scale(${activeWaypoint.scale})`,
        }}
      >
        <style jsx>{`
          div {
            --bunny-left: ${activeWaypoint.desktop.left};
            --bunny-bottom: ${activeWaypoint.desktop.bottom};
          }
          @media (max-width: 768px) {
            div {
              --bunny-left: ${activeWaypoint.mobile.left};
              --bunny-bottom: ${activeWaypoint.mobile.bottom};
            }
          }
        `}</style>

        <AnimatePresence mode="wait">
          {isVisible && (
            <motion.div
              key={`bunny-actor-${activeWaypoint.id}`}
              initial={{ y: '65%', opacity: 0 }}
              animate={
                currentPose === 'hop1'
                  ? { y: '-28%', x: '18px', opacity: 1 }
                  : currentPose === 'hop2'
                    ? { y: '0%', x: '36px', opacity: 1 }
                    : { y: '0%', x: '0px', opacity: 1 }
              }
              exit={{ y: '65%', opacity: 0 }}
              transition={
                currentPose === 'hop1'
                  ? { duration: 0.32, ease: [0.22, 1, 0.36, 1] }
                  : currentPose === 'hop2'
                    ? { duration: 0.3, ease: [0.34, 1.3, 0.64, 1] }
                    : { duration: 0.45, ease: [0.25, 1, 0.5, 1] }
              }
              className="relative flex items-end justify-center"
              style={{
                width: 'clamp(120px, 12vw, 170px)',
                height: 'clamp(120px, 12vw, 170px)',
              }}
            >
              {/* Speech bubble 1: "psst psst" when peeking */}
              <AnimatePresence>
                {!isInteracting && currentPose === 'peek' && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.85 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.85 }}
                    transition={{ duration: 0.25 }}
                    className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap z-20"
                  >
                    <div className="relative rounded-full border border-[#E8DED2] bg-[#FFF8EF]/95 px-3 py-1 shadow-sm backdrop-blur-sm">
                      <span className="[font-family:var(--font-fredoka)] text-xs font-semibold tracking-wide text-[#51443E]">
                        psst psst
                      </span>
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-2 w-2 rotate-45 border-b border-r border-[#E8DED2] bg-[#FFF8EF]" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Speech bubble 2: "hellooo there fren" when hopping */}
              <AnimatePresence>
                {isInteracting &&
                  (currentPose === 'sit' ||
                    currentPose === 'hop1' ||
                    currentPose === 'hop2' ||
                    currentPose === 'hide') && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.85 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.85 }}
                      transition={{ duration: 0.25 }}
                      className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap z-20"
                    >
                      <div className="relative rounded-full border border-[#E8DED2] bg-[#FFF8EF]/95 px-3 py-1 shadow-sm backdrop-blur-sm">
                        <span className="[font-family:var(--font-fredoka)] text-xs font-semibold tracking-wide text-[#51443E]">
                          hellooo there fren
                        </span>
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-2 w-2 rotate-45 border-b border-r border-[#E8DED2] bg-[#FFF8EF]" />
                      </div>
                    </motion.div>
                  )}
              </AnimatePresence>

              <button
                type="button"
                onClick={handleBunnyClick}
                disabled={isInteracting}
                aria-label="Meadow rabbit peeking from grass"
                className="pointer-events-auto relative h-full w-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5D98E] rounded-full"
              >
                <div
                  className="relative h-full w-full"
                  style={{
                    maskImage:
                      'linear-gradient(to top, transparent 0%, black 18%, black 100%)',
                    WebkitMaskImage:
                      'linear-gradient(to top, transparent 0%, black 18%, black 100%)',
                  }}
                >
                  <Image
                    src={activeAsset.src}
                    alt={activeAsset.alt}
                    fill
                    sizes="(max-width: 768px) 130px, 170px"
                    priority
                    className="object-contain object-bottom pointer-events-none drop-shadow-[0_4px_10px_rgba(40,30,25,0.28)]"
                  />
                </div>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}