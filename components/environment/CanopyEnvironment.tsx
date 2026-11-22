'use client'

import {
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  motion,
  AnimatePresence,
} from 'framer-motion'
import {
  useCallback,
  useRef,
  useState,
  useEffect,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { canopyAssets } from '@/lib/assets'
import { useCanopyStore } from '@/state/canopy-store'
import { BreathingGuide } from './BreathingGuide'
import { BunnyInteraction } from './BunnyInteraction'
import { ButterflyInteraction } from './ButterflyInteraction'
import { DandelionInteraction } from './DandelionInteraction'
import { EnvironmentAtmosphere } from './EnvironmentAtmosphere'
import { EnvironmentLayer } from './EnvironmentLayer'
import { EnvironmentLighting } from './EnvironmentLighting'
import { ExploreBanner } from './ExploreBanner'
import { FlowerInteraction } from './FlowerInteraction'
import { GardenAudio } from './GardenAudio'
import { LadybugInteraction } from './LadybugInteraction'
import { ModeInvitation } from './ModeInvitation'
import { ModeSwitcher } from './ModeSwitcher'
import { ScrollCue } from './ScrollCue'
import { SleepingBunny } from './SleepingBunny'
import { UnwindBreeze } from './UnwindBreeze'

const clamp = (value: number) => Math.max(-1, Math.min(1, value))

const getParallaxValue = (
  base: number,
  multiplier: number,
  isReduced: boolean | null,
): number => {
  if (isReduced) return 0
  return Math.min(36, Math.round(base * multiplier))
}

export function CanopyEnvironment() {
  const containerRef = useRef<HTMLDivElement>(null)
  const hasReachedGardenRef = useRef(false)
  const reducedMotion = useReducedMotion()
  const mode = useCanopyStore((state) => state.mode)
  const setMode = useCanopyStore((state) => state.setMode)
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)

  // Track vertical scroll through the pinned sequence
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // State to control garden assembly and invitation dialog pause
  const [isGardenAssembled, setIsGardenAssembled] = useState(Boolean(reducedMotion))
  const [showInvitation, setShowInvitation] = useState(Boolean(reducedMotion))

  useEffect(() => {
    if (reducedMotion) {
      setIsGardenAssembled(true)
      setShowInvitation(true)
      return
    }

    // Reset mode to idle if starting at the top of the page
    if (scrollYProgress.get() < 0.84 && useCanopyStore.getState().mode !== 'idle') {
      setMode('idle')
    }

    let timer: NodeJS.Timeout | null = null

    const unsubscribe = scrollYProgress.on('change', (latest) => {
      // Once the garden is fully formed (at or above 84% scroll)
      if (latest >= 0.84) {
        hasReachedGardenRef.current = true
        setIsGardenAssembled(true)
        if (!timer && !showInvitation) {
          timer = setTimeout(() => {
            setShowInvitation(true)
          }, 1000)
        }
      } else {
        // Scrolled back up: teardown assembly and unmount active characters
        setIsGardenAssembled(false)
        if (timer) {
          clearTimeout(timer)
          timer = null
        }
        setShowInvitation(false)

        // Automatically exit active mode so interactions do not float in the sky
        if (useCanopyStore.getState().mode !== 'idle') {
          setMode('idle')
        }
        hasReachedGardenRef.current = false
      }
    })

    return () => {
      if (timer) clearTimeout(timer)
      unsubscribe()
    }
  }, [scrollYProgress, reducedMotion, showInvitation, setMode])

  // =========================================================================
  // SCROLL-DRIVEN ASSEMBLY TRANSFORMS (Progress: 0.0 to 1.0)
  // =========================================================================

  // Stage A: Rolling Hills (Middle Distance)
  const hillsY = useTransform(scrollYProgress, [0.0, 0.3], [48, 0])
  const hillsOpacity = useTransform(scrollYProgress, [0.0, 0.3], [0, 1])

  // Stage B: Meadow Ground & Trunk
  const meadowY = useTransform(scrollYProgress, [0.24, 0.58], [72, 0])
  const meadowOpacity = useTransform(scrollYProgress, [0.24, 0.58], [0, 1])

  // Stage C: Cherry Blossom Tree (Lateral slide from left + vertical rise)
  const treeX = useTransform(scrollYProgress, [0.46, 0.84], [-64, 0])
  const treeY = useTransform(scrollYProgress, [0.46, 0.84], [56, 0])
  const treeOpacity = useTransform(scrollYProgress, [0.46, 0.84], [0, 1])

  // Stage D: Foreground Framing Bushes
  const bushesY = useTransform(scrollYProgress, [0.68, 0.94], [80, 0])
  const bushesOpacity = useTransform(scrollYProgress, [0.68, 0.94], [0, 1])

  // =========================================================================
  // PARALLAX COEFFICIENTS (Ceiling: 36px)
  // =========================================================================
  const mountainsParallax = getParallaxValue(4, 1.0, reducedMotion)
  const hillsParallax = getParallaxValue(8, 1.0, reducedMotion)
  const meadowParallax = getParallaxValue(14, 1.0, reducedMotion)
  const treeParallax = getParallaxValue(20, 1.0, reducedMotion)
  const bushesParallax = getParallaxValue(28, 1.0, reducedMotion)

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (reducedMotion) return
      const bounds = event.currentTarget.getBoundingClientRect()
      if (!bounds.width || !bounds.height) return

      const normalizedX = clamp(((event.clientX - bounds.left) / bounds.width) * 2 - 1)
      const normalizedY = clamp(((event.clientY - bounds.top) / bounds.height) * 2 - 1)

      pointerX.set(normalizedX)
      pointerY.set(normalizedY)
    },
    [pointerX, pointerY, reducedMotion],
  )

  const handlePointerLeave = useCallback(() => {
    pointerX.set(0)
    pointerY.set(0)
  }, [pointerX, pointerY])

  return (
    <div
      ref={containerRef}
      className="relative h-[480vh] w-full bg-[#1b2b23]"
    >
      {/* Fixed viewport ensures the live assembled garden remains visible under DogReveal during Stages A, B, and C */}
      <section
        aria-label="CANOPY Interactive Landscape"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="fixed inset-0 h-screen w-full overflow-hidden select-none bg-[#7cb8d0] z-0"
      >
        {/* =========================================================================
            LAYER 1: SKY & MOUNTAIN RANGE (Permanent panoramic backdrop)
            ========================================================================= */}
        <div className="absolute inset-0 z-0 h-full w-full pointer-events-none">
          <EnvironmentLayer
            src={canopyAssets.mountainRange.src}
            alt=""
            pointerX={pointerX}
            pointerY={pointerY}
            parallaxStrength={mountainsParallax}
            sizes="100vw"
            priority
            objectPosition="center top"
            imageClassName="scale-105 object-cover"
          />
        </div>

        {/* =========================================================================
            LAYER 2: ROLLING HILLS (Middle Distance)
            ========================================================================= */}
        <motion.div
          className="absolute inset-0 z-10 h-full w-full pointer-events-none"
          style={
            reducedMotion
              ? {}
              : {
                  opacity: hillsOpacity,
                  y: hillsY,
                }
          }
        >
          <EnvironmentLayer
            src={canopyAssets.rollingHills.src}
            alt=""
            pointerX={pointerX}
            pointerY={pointerY}
            parallaxStrength={hillsParallax}
            sizes="100vw"
            objectPosition="center center"
            imageClassName="scale-105 object-cover"
          />
        </motion.div>

        {/* =========================================================================
            LAYER 3: MEADOW GROUND (Midground Anchor)
            ========================================================================= */}
        <motion.div
          className="absolute inset-0 z-20 h-full w-full pointer-events-none"
          style={
            reducedMotion
              ? {}
              : {
                  opacity: meadowOpacity,
                  y: meadowY,
                }
          }
        >
          <EnvironmentLayer
            src={canopyAssets.meadowGround.src}
            alt=""
            pointerX={pointerX}
            pointerY={pointerY}
            parallaxStrength={meadowParallax}
            sizes="100vw"
            objectPosition="center bottom"
            imageClassName="scale-105 object-cover"
          />
        </motion.div>

        {/* =========================================================================
            LAYER 3.2: EXPLORE INTERACTIONS (Mounts ONLY in Explore mode when assembled)
            ========================================================================= */}
        {mode === 'explore' && isGardenAssembled && (
          <>
            <FlowerInteraction />
            <DandelionInteraction />
            <BunnyInteraction />
            <LadybugInteraction />
          </>
        )}

        {/* =========================================================================
            LAYER 3.3: UNWIND SANCTUARY (Mounts ONLY in Unwind mode when assembled)
            ========================================================================= */}
        {mode === 'unwind' && isGardenAssembled && (
          <>
            <SleepingBunny />
            <UnwindBreeze />
          </>
        )}

        {/* =========================================================================
            LAYER 4: CHERRY BLOSSOM TREE
            ========================================================================= */}
        <motion.div
          className="absolute inset-0 z-30 h-full w-full pointer-events-none md:inset-auto md:left-0 md:top-0 md:h-full md:w-[min(70vw,1100px)]"
          style={
            reducedMotion
              ? {}
              : {
                  opacity: treeOpacity,
                  x: treeX,
                  y: treeY,
                }
          }
        >
          <EnvironmentLayer
            src={canopyAssets.cherryBlossomTree.src}
            alt=""
            pointerX={pointerX}
            pointerY={pointerY}
            parallaxStrength={treeParallax}
            sizes="100vw"
            priority
            objectPosition="left bottom md:left top"
            imageClassName="scale-105 object-cover md:object-contain md:object-left-top pointer-events-none"
          />
        </motion.div>

        {/* =========================================================================
            LAYER 5: FOREGROUND BUSHES
            ========================================================================= */}
        <motion.div
          className="absolute inset-0 z-40 h-full w-full pointer-events-none"
          style={
            reducedMotion
              ? {}
              : {
                  opacity: bushesOpacity,
                  y: bushesY,
                }
          }
        >
          <EnvironmentLayer
            src={canopyAssets.foregroundBushes.src}
            alt=""
            pointerX={pointerX}
            pointerY={pointerY}
            parallaxStrength={bushesParallax}
            sizes="100vw"
            objectPosition="center bottom"
            imageClassName="scale-105 object-cover pointer-events-none"
          />
        </motion.div>

        {/* =========================================================================
            LAYER 6: BUTTERFLY INTERACTION (Explore Only when assembled)
            ========================================================================= */}
        {mode === 'explore' && isGardenAssembled && (
          <ButterflyInteraction isAssembled={true} />
        )}

        {/* Optional Mindful Breathing Guide (Unwind Only when assembled) */}
        {mode === 'unwind' && isGardenAssembled && <BreathingGuide />}

        {/* Atmospheric Overlays */}
        <EnvironmentAtmosphere />
        <EnvironmentLighting />

        {/* Scroll Cue (Only prompts before entering the garden) */}
        <ScrollCue
          scrollYProgress={scrollYProgress}
          reducedMotion={reducedMotion}
        />

        {/* Opening Invitation (Shows once garden is assembled & mode is idle) */}
        <AnimatePresence>
          {showInvitation && mode === 'idle' && (
            <motion.div
              key="canopy-invitation-stage"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.65, ease: [0.25, 1, 0.5, 1] }}
              className="pointer-events-none absolute inset-0 z-[60] flex items-center justify-center p-3 sm:p-6"
            >
              <ModeInvitation />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ambient Garden Audio */}
        <GardenAudio />

        {/* Exploration Prompt Banner (Only when assembled in Explore mode) */}
        {mode === 'explore' && isGardenAssembled && <ExploreBanner />}

        {/* Persistent Mode Switcher */}
        {isGardenAssembled && <ModeSwitcher />}
      </section>
    </div>
  )
}