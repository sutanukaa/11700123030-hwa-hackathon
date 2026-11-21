'use client'

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import type { Transition } from 'framer-motion'
import { useState, useRef, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { canopyAssets } from '@/lib/assets'
import { useCanopyStore } from '@/state/canopy-store'

type LadybugStage = 'resting' | 'flying' | 'departed'

export function LadybugInteraction() {
  const reducedMotion = useReducedMotion()
  const ladybugDeparted = useCanopyStore((state) => state.ladybugDeparted)
  const setLadybugDeparted = useCanopyStore((state) => state.setLadybugDeparted)

  const [stage, setStage] = useState<LadybugStage>(
    ladybugDeparted ? 'departed' : 'resting'
  )
  const [isHovered, setIsHovered] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const isInteractingRef = useRef(false)

  // Sync state if store updates externally
  useEffect(() => {
    if (ladybugDeparted) {
      setStage('departed')
    }
  }, [ladybugDeparted])

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [])

  const triggerTakeoff = useCallback(() => {
    if (stage !== 'resting' || isInteractingRef.current || ladybugDeparted) return
    isInteractingRef.current = true

    // Tiny 120ms natural anticipation pause, then launch directly into flight!
    timerRef.current = setTimeout(() => {
      setStage('flying')
    }, 120)
  }, [stage, ladybugDeparted])

  const handleFlightComplete = useCallback(() => {
    setStage('departed')
    setLadybugDeparted(true)
    isInteractingRef.current = false
  }, [setLadybugDeparted])

  const flightTransition: Transition = reducedMotion
    ? {
        duration: 1.4,
        ease: 'easeOut',
      }
    : {
        duration: 5.6,
        times: [0, 0.22, 0.44, 0.66, 0.85, 1],
        ease: [0.38, 0.04, 0.2, 0.98] as [number, number, number, number],
      }

  return (
    <>
      {/* =========================================================================
          1. ANCHORED RESTING LEAF CONTAINER (Permanently anchored in meadow)
          - While resting: displays ladybug-idle.png
          - Upon takeoff & departure: seamlessly displays empty-leaf.png
          ========================================================================= */}
      <div
        className="pointer-events-none absolute z-[42] select-none"
        style={{
          right: '12%',
          bottom: '18%',
        }}
      >
        <div className="relative h-[73px] w-[110px] sm:h-[86px] sm:w-[130px] md:h-[100px] md:w-[150px]">
          {/* State A: Resting Ladybug on Leaf */}
          {stage === 'resting' && (
            <motion.div
              key="resting-ladybug-leaf"
              className="relative h-full w-full"
              animate={
                reducedMotion
                  ? undefined
                  : isHovered
                    ? { scale: 1.05, y: -1.5 }
                    : { scale: [1, 1.025, 1], y: [0, -1, 0] }
              }
              transition={{
                duration: isHovered ? 0.25 : 3.2,
                repeat: isHovered ? 0 : Infinity,
                ease: 'easeInOut',
              }}
            >
              <Image
                src={canopyAssets.ladybugIdle.src}
                alt="Ladybug resting on meadow leaf"
                fill
                sizes="(max-width: 768px) 130px, 150px"
                priority
                className="pointer-events-none object-contain"
              />

              {/* Accessible Interactive Target */}
              <button
                type="button"
                onClick={triggerTakeoff}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    triggerTakeoff()
                  }
                }}
                aria-label="Discover shy ladybug resting on meadow leaf"
                className="pointer-events-auto absolute inset-0 cursor-pointer rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              />
            </motion.div>
          )}

          {/* State B: Empty Leaf (Stays behind permanently once ladybug takes off) */}
          {(stage === 'flying' || stage === 'departed') && (
            <motion.div
              key="empty-leaf-stationary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="relative h-full w-full"
            >
              <Image
                src={canopyAssets.emptyLeaf.src}
                alt="Tranquil empty meadow leaf"
                fill
                sizes="(max-width: 768px) 130px, 150px"
                priority
                className="pointer-events-none object-contain"
              />
            </motion.div>
          )}
        </div>
      </div>

      {/* =========================================================================
          2. AIRBORNE FLYING LADYBUG (Full uncropped ladybug-fly.png asset)
          Performs 5 graceful diagonal criss-cross passes across the screen
          ========================================================================= */}
      <AnimatePresence>
        {stage === 'flying' && (
          <motion.div
            key="airborne-ladybug"
            initial={{
              left: '74vw',
              top: '76vh',
              scale: 0.95,
              rotate: -15,
              opacity: 1,
            }}
            animate={
              reducedMotion
                ? {
                    left: ['74vw', '86vw', '104vw'],
                    top: ['76vh', '58vh', '40vh'],
                    rotate: [-15, 15, 25],
                    scale: [0.95, 0.8, 0.5],
                    opacity: [1, 0.8, 0],
                  }
                : {
                    left: [
                      '74vw',  // Takeoff (aligned with resting leaf)
                      '18vw',  // Pass 1: Sweeps up-left across meadow
                      '82vw',  // Pass 2: Sweeps up-right across central garden
                      '14vw',  // Pass 3: Sweeps up-left toward lower cherry tree branches
                      '76vw',  // Pass 4: Sweeps right beneath blooming canopy
                      '108vw', // Pass 5: Soars diagonally off-screen into upper-right sky
                    ],
                    top: [
                      '76vh',  // Takeoff
                      '58vh',  // Pass 1
                      '44vh',  // Pass 2
                      '30vh',  // Pass 3
                      '16vh',  // Pass 4
                      '-14vh', // Pass 5
                    ],
                    rotate: [
                      -15,     // Takeoff
                      -34,     // Flying up-left
                      30,      // Flying up-right
                      -38,     // Flying up-left
                      26,      // Flying up-right
                      45,      // Soaring departure
                    ],
                    scale: [
                      0.95,    // Takeoff
                      1.08,    // Swooping closer
                      1.12,    // Mid-garden
                      0.98,    // Climbing
                      0.80,    // High canopy
                      0.35,    // Distant departure
                    ],
                    opacity: [1, 1, 1, 1, 0.9, 0],
                  }
            }
            transition={flightTransition}
            onAnimationComplete={handleFlightComplete}
            className="pointer-events-none fixed z-[55] flex items-center justify-center"
            style={{
              width: 'clamp(85px, 8vw, 120px)',
              height: 'clamp(57px, 5.3vw, 80px)',
              transformOrigin: 'center center',
            }}
          >
            {/* The full uncropped ladybug-fly illustration */}
            <div className="relative h-full w-full">
              <Image
                src={canopyAssets.ladybugFly.src}
                alt="Ladybug flying across the meadow"
                fill
                sizes="120px"
                priority
                className="pointer-events-none object-contain"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}