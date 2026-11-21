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
import { ButterflyInteraction } from './ButterflyInteraction'
import { EnvironmentAtmosphere } from './EnvironmentAtmosphere'
import { EnvironmentLayer } from './EnvironmentLayer'
import { EnvironmentLighting } from './EnvironmentLighting'
import { FlowerInteraction } from './FlowerInteraction'
import { ModeInvitation } from './ModeInvitation'
import { ModeSwitcher } from './ModeSwitcher'
import { ScrollCue } from './ScrollCue'

const clamp = (value: number) => Math.max(-1, Math.min(1, value))

// Calculate effective parallax strength with an absolute 36px ceiling
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
  const reducedMotion = useReducedMotion()
  const mode = useCanopyStore((state) => state.mode)
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

    let timer: NodeJS.Timeout | null = null

    const unsubscribe = scrollYProgress.on('change', (latest) => {
      // Once the garden is fully formed (at or above 84% scroll)
      if (latest >= 0.84) {
        setIsGardenAssembled(true)
        if (!timer && !showInvitation) {
          // Pause for 1 second so the visitor can take in the assembled garden
          timer = setTimeout(() => {
            setShowInvitation(true)
          }, 1000)
        }
      } else {
        setIsGardenAssembled(false)
        // If the user scrolls back up, cancel timer and hide invitation
        if (timer) {
          clearTimeout(timer)
          timer = null
        }
        setShowInvitation(false)
      }
    })

    return () => {
      if (timer) clearTimeout(timer)
      unsubscribe()
    }
  }, [scrollYProgress, reducedMotion, showInvitation])

  // =========================================================================
  // SCROLL-DRIVEN ASSEMBLY TRANSFORMS (Progress: 0.0 to 1.0)
  // =========================================================================

  // Stage A: Mountains & Rolling Hills
  const mountainScale = useTransform(scrollYProgress, [0, 0.4], [1.06, 1.05])
  const hillsOpacity = useTransform(scrollYProgress, [0.04, 0.32], [0, 1])
  const hillsY = useTransform(scrollYProgress, [0.04, 0.32], [35, 0])

  // Stage B: Meadow Ground Floor
  const meadowOpacity = useTransform(scrollYProgress, [0.22, 0.55], [0, 1])
  const meadowY = useTransform(scrollYProgress, [0.22, 0.55], [45, 0])

  // Stage C: Cherry Blossom Tree (Enters from top-left)
  const treeOpacity = useTransform(scrollYProgress, [0.42, 0.78], [0, 1])
  const treeX = useTransform(scrollYProgress, [0.42, 0.78], [-35, 0])
  const treeY = useTransform(scrollYProgress, [0.42, 0.78], [-25, 0])

  // Stage C: Foreground Bushes (Enters from bottom)
  const bushesOpacity = useTransform(scrollYProgress, [0.52, 0.82], [0, 1])
  const bushesY = useTransform(scrollYProgress, [0.52, 0.82], [50, 0])

  // =========================================================================
  // MOUSE-BASED POINTER PARALLAX (Active depth within 36px ceiling)
  // =========================================================================
  const modeMultiplier =
    mode === 'unwind' ? 0.65 : mode === 'explore' ? 1.15 : 1.0

  const mountainParallax = getParallaxValue(5, modeMultiplier, reducedMotion)
  const hillsParallax = getParallaxValue(10, modeMultiplier, reducedMotion)
  const meadowParallax = getParallaxValue(16, modeMultiplier, reducedMotion)
  const treeParallax = getParallaxValue(24, modeMultiplier, reducedMotion)
  const bushesParallax = getParallaxValue(31, modeMultiplier, reducedMotion)

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      // Discard touch events and respect user reduced-motion preference
      if (reducedMotion || event.pointerType !== 'mouse') return

      const bounds = event.currentTarget.getBoundingClientRect()
      const normalizedX =
        ((event.clientX - bounds.left) / bounds.width - 0.5) * 2
      const normalizedY =
        ((event.clientY - bounds.top) / bounds.height - 0.5) * 2

      pointerX.set(clamp(normalizedX))
      pointerY.set(clamp(normalizedY))
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
      className="relative w-full"
      style={{ height: reducedMotion ? '100svh' : '360vh' }}
    >
      <section
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="sticky top-0 h-[100svh] w-full overflow-hidden bg-[#B9D3E6] select-none"
        aria-label="CANOPY Interactive Garden Environment"
      >
        {/* =========================================================================
            LAYER 1: SKY & ATMOSPHERE BACKPLATE
            ========================================================================= */}
        {/* Mobile Viewport */}
        <div className="absolute inset-0 z-0 h-full w-full block md:hidden pointer-events-none">
          <EnvironmentLayer
            src={canopyAssets.skyAtmosphereMobile.src}
            alt="CANOPY Sky and Atmosphere"
            pointerX={pointerX}
            pointerY={pointerY}
            parallaxStrength={0}
            sizes="100vw"
            priority
            objectPosition="center top"
            imageClassName="scale-105 object-cover"
          />
        </div>
        {/* Desktop Viewport */}
        <div className="absolute inset-0 z-0 h-full w-full hidden md:block pointer-events-none">
          <EnvironmentLayer
            src={canopyAssets.skyAtmosphere.src}
            alt="CANOPY Sky and Atmosphere"
            pointerX={pointerX}
            pointerY={pointerY}
            parallaxStrength={0}
            sizes="100vw"
            priority
            objectPosition="center top"
            imageClassName="scale-105 object-cover"
          />
        </div>

        {/* =========================================================================
            LAYER 1.5: MOUNTAIN RANGE
            ========================================================================= */}
        <motion.div
          className="absolute inset-0 z-5 h-full w-full pointer-events-none"
          style={reducedMotion ? {} : { scale: mountainScale }}
        >
          <EnvironmentLayer
            src={canopyAssets.mountainRange.src}
            alt="Distant Mountains"
            pointerX={pointerX}
            pointerY={pointerY}
            parallaxStrength={mountainParallax}
            sizes="100vw"
            priority
            objectPosition="center bottom"
            imageClassName="scale-105 object-cover"
          />
        </motion.div>

        {/* =========================================================================
            LAYER 2: ROLLING HILLS (Midground)
            ========================================================================= */}
        {/* Mobile Viewport */}
        <motion.div
          className="absolute inset-0 z-10 h-full w-full block md:hidden pointer-events-none"
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
            src={canopyAssets.rollingHillsMobile.src}
            alt=""
            pointerX={pointerX}
            pointerY={pointerY}
            parallaxStrength={hillsParallax}
            sizes="100vw"
            objectPosition="center bottom"
            imageClassName="scale-105 object-cover"
          />
        </motion.div>
        {/* Desktop Viewport */}
        <motion.div
          className="absolute inset-0 z-10 h-full w-full hidden md:block pointer-events-none"
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
            objectPosition="center bottom"
            imageClassName="scale-105 object-cover"
          />
        </motion.div>

        {/* =========================================================================
            LAYER 3: MEADOW GROUND (Floor Interaction Plane)
            ========================================================================= */}
        {/* Mobile Viewport */}
        <motion.div
          className="absolute inset-0 z-20 h-full w-full block md:hidden pointer-events-none"
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
            src={canopyAssets.meadowGroundMobile.src}
            alt=""
            pointerX={pointerX}
            pointerY={pointerY}
            parallaxStrength={meadowParallax}
            sizes="100vw"
            objectPosition="center bottom"
            imageClassName="scale-105 object-cover"
          />
        </motion.div>
        {/* Desktop Viewport */}
        <motion.div
          className="absolute inset-0 z-20 h-full w-full hidden md:block pointer-events-none"
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
            LAYER 3.2: FLOWER BLOOMING INTERACTION (Meadow Interaction Plane)
            ========================================================================= */}
        {mode === 'explore' && <FlowerInteraction />}

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
            LAYER 5: FOREGROUND BUSHES (pointer-events-none prevents blocking clicks)
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
            LAYER 6: BUTTERFLY INTERACTION (Active in Explore mode)
            ========================================================================= */}
        {mode === 'explore' && <ButterflyInteraction isAssembled={true} />}

        {/* Atmospheric Overlays */}
        <EnvironmentAtmosphere />
        <EnvironmentLighting />

        {/* Subtle Initial Scroll Cue */}
        <ScrollCue
          scrollYProgress={scrollYProgress}
          reducedMotion={reducedMotion}
        />

        {/* Stage D: Opening Invitation (pointer-events-none container prevents click blocking) */}
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

        {/* Persistent Mode Switcher */}
        <ModeSwitcher />
      </section>
    </div>
  )
}