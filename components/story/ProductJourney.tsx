'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { useAuthStore } from '@/state/auth-store'

interface ProductStop {
  id: string
  number: string
  eyebrow: string
  title: string
  subhead: string
  body: string
  supportLine?: string
  imageSrc: string
  imageAlt: string
  layout: 'image-left' | 'image-right'
  doodleType: 'house' | 'sleep' | 'tunnel' | 'ball' | 'flower' | 'face'
}

const STOPS: ProductStop[] = [
  {
    id: 'stop-01',
    number: '01',
    eyebrow: 'THE WHOLE LITTLE WORLD',
    title: 'The Complete CANOPY',
    subhead: 'Meet CANOPY.',
    body: 'One thoughtfully designed space that brings rest, discovery and independent play together. A little world where dogs can follow their own rhythm.',
    supportLine: 'One home. Many little adventures.',
    imageSrc: '/canopy-main-view.png',
    imageAlt: 'The complete CANOPY all-in-one retreat and adventure structure',
    layout: 'image-left',
    doodleType: 'house',
  },
  {
    id: 'stop-02',
    number: '02',
    eyebrow: "WHEN IT'S TIME TO SLOW DOWN",
    title: 'The Retreat',
    subhead: 'A cosy corner of their own.',
    body: 'A sheltered den, soft bedding and a familiar little hideaway. A comfortable place to pause, settle in and enjoy some quiet time.',
    imageSrc: '/canopy-retreat.png',
    imageAlt: 'CANOPY cozy wooden shelter den with soft warm bed and lantern',
    layout: 'image-right',
    doodleType: 'sleep',
  },
  {
    id: 'stop-03',
    number: '03',
    eyebrow: 'FOR LITTLE EXPLORERS',
    title: 'The Crawl Tunnel',
    subhead: 'A little adventure around the corner.',
    body: 'The crawl-through tunnel adds another way to discover the space. A playful passage for curious noses, little paws and everyday exploration.',
    imageSrc: '/canopy-crawl-tunnel.png',
    imageAlt: 'CANOPY round crawl tunnel passage with floral motif',
    layout: 'image-left',
    doodleType: 'tunnel',
  },
  {
    id: 'stop-04',
    number: '04',
    eyebrow: 'UP, OVER AND AROUND',
    title: 'The Play Deck',
    subhead: 'Room to climb, play and discover.',
    body: 'The elevated deck brings different activity areas together, giving dogs more ways to move around, explore and engage at their own pace.',
    imageSrc: '/canopy-playdeck.png',
    imageAlt: 'Elevated wooden play deck with sun canopy and hanging enrichment toys',
    layout: 'image-right',
    doodleType: 'ball',
  },
  {
    id: 'stop-05',
    number: '05',
    eyebrow: 'STOP AND SNIFF',
    title: 'The Sensory Planter',
    subhead: 'A garden of little discoveries.',
    body: 'Flowers, greenery and interesting textures add another layer to the experience. A little invitation to pause, sniff and explore.',
    imageSrc: '/canopy-sensory-planter.png',
    imageAlt: 'Built-in garden planter with pet-safe blooming flowers and greenery',
    layout: 'image-left',
    doodleType: 'flower',
  },
  {
    id: 'stop-06',
    number: '06',
    eyebrow: 'MADE FOR CURIOUS PAWS',
    title: 'The Steps & Climbs',
    subhead: 'Every step has something to discover.',
    body: 'Thoughtful activity details invite dogs to investigate, navigate and interact. Small moments of discovery, built right into their space.',
    imageSrc: '/canopy-steps.png',
    imageAlt: 'Activity ramps with textured blue climbing steps and interactive sensory buttons',
    layout: 'image-right',
    doodleType: 'face',
  },
]

export function ProductJourney() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const reducedMotion = useReducedMotion()
  const openSignIn = useAuthStore((state) => state.openSignIn)

  const [markerPos, setMarkerPos] = useState({ x: 500, y: 40 })
  const [isActiveAtStop, setIsActiveAtStop] = useState(false)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 60%', 'end 90%'],
  })

  // Smooth scroll spring for fluid path drawing
  const springProgress = useSpring(scrollYProgress, {
    stiffness: 350,
    damping: 38,
    restDelta: 0.001,
  })

  // Completely Smooth SVG Path: Zero sharp corners, open loops, and smooth rolling waves
  const pathD =
    'M 500,40 ' +
    // Down to Stop 01
    'C 500,140 620,160 620,280 ' +
    'C 620,400 580,480 430,480 ' +
    // Triple Open Rollercoaster Loops (OOO)
    'C 445,480 445,400 475,400 C 505,400 505,480 475,480 C 455,480 485,480 515,480 ' + // Loop 1
    'C 530,480 530,400 560,400 C 590,400 590,480 560,480 C 540,480 570,480 600,480 ' + // Loop 2
    'C 615,480 615,400 645,400 C 675,400 675,480 645,480 C 625,480 655,480 690,480 ' + // Loop 3
    // Smooth transition from loops to Stop 02 (wide sweeping bend)
    'C 770,480 780,620 720,740 C 660,860 480,840 380,940 ' +
    // Smooth curve leading into gentle rolling waves
    'C 320,1000 320,1100 380,1160 ' +
    // Smooth Sinusoidal Waves (∿∿∿) with continuous tangents and round peaks/troughs
    'C 430,1100 460,1100 500,1160 C 540,1220 570,1220 610,1160 ' + // Wave 1
    'C 650,1100 680,1100 720,1160 C 760,1220 790,1220 820,1160 ' + // Wave 2
    // Smooth curve down to Stop 03
    'C 870,1240 850,1380 720,1480 C 600,1580 420,1540 360,1660 ' +
    // Wide open sweeping wrap-around loop arc (between Stop 03 and Stop 04)
    'C 300,1740 300,1860 420,1900 ' +
    'C 560,1940 680,1860 680,1740 C 680,1600 520,1600 480,1740 C 440,1880 540,2020 640,2140 ' +
    'C 720,2240 700,2360 600,2440 ' +
    // Smooth Open Double Loop (between Stop 04 and Stop 05)
    'C 540,2500 450,2500 450,2560 ' +
    'C 450,2480 500,2480 525,2530 C 550,2580 490,2600 490,2560 C 490,2530 520,2530 550,2560 ' + // Loop A
    'C 550,2480 600,2480 625,2530 C 650,2580 590,2600 590,2560 C 590,2530 630,2530 680,2600 ' + // Loop B
    // Smooth descent towards Stop 05
    'C 760,2700 700,2840 560,2920 C 440,2980 360,3020 360,3120 ' +
    // Smooth final waves to Stop 06
    'C 360,3200 400,3240 450,3270 ' +
    'C 490,3220 520,3220 560,3270 C 600,3320 630,3320 670,3270 ' +
    'C 740,3320 740,3440 660,3560 C 580,3660 440,3680 400,3760 ' +
    // Smooth connection to ending celebration card
    'C 380,3820 440,3880 500,3920'

  // Update marker position directly from the SVG path geometry
  useEffect(() => {
    if (reducedMotion) return
    const path = pathRef.current
    if (!path) return

    const totalLength = path.getTotalLength()

    const unsubscribe = springProgress.on('change', (v) => {
      const clamped = Math.max(0, Math.min(1, v))
      const distance = clamped * totalLength
      const point = path.getPointAtLength(distance)

      setMarkerPos({ x: point.x, y: point.y })

      // Determine if marker is currently resting at any of the 6 stops
      const stopProgresses = [0.08, 0.25, 0.43, 0.61, 0.79, 0.95]
      const isAtStop = stopProgresses.some((p) => Math.abs(clamped - p) < 0.04)
      setIsActiveAtStop(isAtStop)
    })

    return () => unsubscribe()
  }, [springProgress, reducedMotion])

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-[#FFF8EF] pt-18 sm:pt-24 md:pt-28 pb-20 sm:pb-28 text-[#51443E]"
      aria-label="CANOPY Detailed Product Journey"
    >
      {/* Decorative Cherry Blossom Branches at Top Corners */}
      <div className="pointer-events-none absolute -top-8 -left-8 h-40 w-48 sm:h-56 sm:w-64 opacity-90 select-none z-10">
        <svg viewBox="0 0 200 160" fill="none" className="w-full h-full">
          <path
            d="M -10,10 Q 50,20 90,60 T 160,110"
            stroke="#8C6548"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle cx="95" cy="58" r="7" fill="#F8C4D4" />
          <circle cx="125" cy="85" r="8" fill="#F2A6C2" />
          <circle cx="155" cy="110" r="7.5" fill="#F8C4D4" />
          <circle cx="70" cy="35" r="6" fill="#F2A6C2" />
          <circle cx="110" cy="40" r="6.5" fill="#F8C4D4" />
        </svg>
      </div>

      <div className="pointer-events-none absolute -top-8 -right-8 h-40 w-48 sm:h-56 sm:w-64 opacity-90 select-none z-10">
        <svg viewBox="0 0 200 160" fill="none" className="w-full h-full">
          <path
            d="M 210,10 Q 150,20 110,60 T 40,110"
            stroke="#8C6548"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle cx="105" cy="58" r="7" fill="#F8C4D4" />
          <circle cx="75" cy="85" r="8" fill="#F2A6C2" />
          <circle cx="45" cy="110" r="7.5" fill="#F8C4D4" />
          <circle cx="130" cy="35" r="6" fill="#F2A6C2" />
          <circle cx="90" cy="40" r="6.5" fill="#F8C4D4" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        {/* ==============================================================
            SECTION HEADER
            ============================================================== */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          {/* Eyebrow Pill Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#82C2E5]/45 bg-white/90 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#3399D4] shadow-xs backdrop-blur-xs [font-family:var(--font-fredoka)]">
            <span className="text-sm leading-none">✿</span>
            MEET YOUR DOG&apos;S LITTLE WORLD
          </div>

          {/* Heading */}
          <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-extrabold leading-[1.12] text-[#4A3E39] [font-family:var(--font-fredoka)]">
            One little space.{' '}
            <span className="relative inline-block text-[#3399D4]">
              So many ways
              {/* Golden Sunburst Rays */}
              <svg
                className="absolute -top-3.5 -right-3.5 sm:-top-4 sm:-right-4 h-6 w-6 sm:h-7 sm:w-7 text-[#F5B82E] pointer-events-none"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.2"
                strokeLinecap="round"
              >
                <line x1="6" y1="18" x2="2" y2="13" />
                <line x1="12" y1="16" x2="12" y2="9" />
                <line x1="18" y1="18" x2="22" y2="13" />
              </svg>
            </span>{' '}
            to be a dog.
          </h2>

          {/* Supporting Intro Text */}
          <p className="mt-4 text-sm sm:text-base lg:text-lg leading-relaxed text-[#5C4E46]/90 font-medium max-w-2xl">
            From a cosy corner to curious little adventures, every part of CANOPY
            is designed around their freedom to explore, rest and choose.
          </p>

          <div className="mt-2 text-xs font-semibold text-[#82C2E5] tracking-wider uppercase [font-family:var(--font-fredoka)]">
            ↓ Follow the wiggly marker trail below
          </div>
        </div>

        {/* ==============================================================
            INTERACTIVE TRAIL & 6 PRODUCT STOPS
            ============================================================== */}
        <div className="relative mt-12 sm:mt-16 md:mt-20">
          {/* Continuous Scroll-Drawn Pastel Blue Marker Wiggly Path */}
          <div className="pointer-events-none absolute inset-0 z-0 select-none">
            <svg
              viewBox="0 0 1000 3950"
              preserveAspectRatio="none"
              className="h-full w-full overflow-visible"
            >
              {/* Soft Translucent Under-Glow (Felt-tip marker halo) */}
              <path
                d={pathD}
                fill="none"
                stroke="#82C2E5"
                strokeWidth="16"
                strokeOpacity="0.28"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />

              {/* Progressively Drawn Smooth Pastel Blue Marker Line */}
              <motion.path
                ref={pathRef}
                d={pathD}
                fill="none"
                stroke="#82C2E5"
                strokeWidth="9"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
                style={reducedMotion ? {} : { pathLength: springProgress }}
              />
            </svg>

            {/* Moving Paw Marker on Path Geometry */}
            {!reducedMotion && (
              <motion.div
                className="absolute z-20 pointer-events-none -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${(markerPos.x / 1000) * 100}%`,
                  top: `${(markerPos.y / 3950) * 100}%`,
                }}
              >
                <motion.div
                  animate={{
                    scale: isActiveAtStop ? [1, 1.25, 1.12] : 1,
                    rotate: isActiveAtStop ? [0, -8, 8, 0] : 0,
                  }}
                  transition={{ duration: 0.35 }}
                  className="relative h-10 w-10 sm:h-12 sm:w-12 drop-shadow-[0_4px_14px_rgba(51,153,212,0.3)]"
                >
                  <Image
                    src={
                      isActiveAtStop
                        ? '/cursor-pointer.png'
                        : '/cursor-default.png'
                    }
                    alt="Trail paw guide"
                    fill
                    sizes="48px"
                    className="object-contain"
                  />
                </motion.div>
              </motion.div>
            )}
          </div>

          {/* 6 Sequential Product Stops */}
          <div className="relative z-10 flex flex-col gap-16 sm:gap-24 lg:gap-32">
            {STOPS.map((stop, index) => {
              const isImageLeft = stop.layout === 'image-left'

              return (
                <div
                  key={stop.id}
                  className={`grid grid-cols-1 items-center gap-8 md:gap-10 lg:grid-cols-12 ${
                    isImageLeft ? '' : 'lg:grid-flow-dense'
                  }`}
                >
                  {/* Image Column */}
                  <div
                    className={`lg:col-span-6 ${
                      isImageLeft ? 'lg:col-start-1' : 'lg:col-start-7'
                    }`}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-60px' }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      className={`group relative overflow-hidden rounded-[26px] sm:rounded-[36px] border-[6px] border-white bg-white shadow-[0_16px_40px_rgba(50,40,30,0.1)] transition-all duration-300 hover:shadow-[0_24px_50px_rgba(51,153,212,0.22)] ${
                        index === 0 ? 'aspect-[16/10] sm:aspect-[16/9]' : 'aspect-[4/3]'
                      }`}
                    >
                      <Image
                        src={stop.imageSrc}
                        alt={stop.imageAlt}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/10" />
                    </motion.div>
                  </div>

                  {/* Text & Doodle Column */}
                  <div
                    className={`flex flex-col lg:col-span-6 ${
                      isImageLeft
                        ? 'lg:col-start-7 lg:pl-6'
                        : 'lg:col-start-1 lg:pr-6'
                    }`}
                  >
                    <motion.div
                      initial={{ opacity: 0, x: isImageLeft ? 20 : -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '-60px' }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                      className="flex flex-col"
                    >
                      {/* Paw Number Badge & Title Row */}
                      <div className="flex items-center gap-3">
                        {/* Paw-Shaped Badge in Matching Blue */}
                        <div className="relative flex flex-col items-center select-none">
                          <div className="flex gap-0.5 mb-0.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#82C2E5]" />
                            <span className="h-2 w-2 -translate-y-0.5 rounded-full bg-[#82C2E5]" />
                            <span className="h-1.5 w-1.5 rounded-full bg-[#82C2E5]" />
                          </div>
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#82C2E5] text-xs font-bold text-white shadow-xs [font-family:var(--font-fredoka)]">
                            {stop.number}
                          </div>
                        </div>

                        <div>
                          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.16em] text-[#82C2E5] [font-family:var(--font-fredoka)]">
                            {stop.eyebrow}
                          </span>
                          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#4A3E39] [font-family:var(--font-fredoka)]">
                            {stop.title}
                          </h3>
                        </div>
                      </div>

                      {/* Subhead */}
                      <p className="mt-2 text-sm sm:text-base font-bold text-[#3399D4] [font-family:var(--font-fredoka)]">
                        {stop.subhead}
                      </p>

                      {/* Description Body */}
                      <p className="mt-2 text-sm sm:text-base leading-relaxed text-[#5C4E46]/90 font-medium">
                        {stop.body}
                      </p>

                      {/* Optional Support Line (for Stop 01) */}
                      {stop.supportLine && (
                        <p className="mt-2 text-xs font-bold italic text-[#82C2E5]">
                          {stop.supportLine}
                        </p>
                      )}

                      {/* Illustrated Line Doodles Matching the Reference */}
                      <div className="mt-4 flex items-center gap-3">
                        {stop.doodleType === 'house' && (
                          <svg
                            className="h-9 w-16 text-[#82C2E5]/80"
                            viewBox="0 0 60 30"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                          >
                            <path d="M 5,25 L 5,12 L 20,5 L 35,12 L 35,25 Z" />
                            <path d="M 20,5 L 45,5 L 55,15 L 55,25 L 35,25" />
                            <circle cx="20" cy="16" r="3" />
                          </svg>
                        )}

                        {stop.doodleType === 'sleep' && (
                          <div className="flex items-center gap-2 text-[#82C2E5]/85">
                            <svg
                              className="h-8 w-12"
                              viewBox="0 0 40 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                            >
                              <path d="M 6,18 C 6,10 16,8 24,10 C 30,12 34,16 34,18 C 34,21 10,21 6,18 Z" />
                              <path d="M 24,10 C 27,6 32,8 33,12" />
                            </svg>
                            <span className="text-xs font-bold [font-family:var(--font-fredoka)]">
                              z z Z
                            </span>
                          </div>
                        )}

                        {stop.doodleType === 'tunnel' && (
                          <svg
                            className="h-8 w-14 text-[#82C2E5]/80"
                            viewBox="0 0 50 25"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                          >
                            <ellipse cx="14" cy="12" rx="8" ry="10" />
                            <path d="M 14,2 L 38,4 C 44,4 46,20 38,20 L 14,22" />
                            <circle cx="28" cy="12" r="2.5" />
                          </svg>
                        )}

                        {stop.doodleType === 'ball' && (
                          <svg
                            className="h-9 w-12 text-[#82C2E5]/80"
                            viewBox="0 0 40 32"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                          >
                            <line x1="12" y1="2" x2="12" y2="16" />
                            <circle cx="12" cy="22" r="6" />
                            <line x1="8" y1="20" x2="16" y2="24" />
                            <line x1="8" y1="24" x2="16" y2="20" />
                          </svg>
                        )}

                        {stop.doodleType === 'flower' && (
                          <svg
                            className="h-9 w-12 text-[#82C2E5]/80"
                            viewBox="0 0 40 30"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                          >
                            <circle cx="14" cy="10" r="3" />
                            <circle cx="26" cy="14" r="3" />
                            <path d="M 14,13 L 14,26" />
                            <path d="M 26,17 L 26,26" />
                            <path d="M 14,20 Q 8,18 8,24" />
                            <path d="M 26,21 Q 32,20 32,25" />
                          </svg>
                        )}

                        {stop.doodleType === 'face' && (
                          <svg
                            className="h-8 w-10 text-[#82C2E5]/80"
                            viewBox="0 0 32 26"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                          >
                            <circle cx="11" cy="9" r="1.5" fill="currentColor" />
                            <circle cx="21" cy="9" r="1.5" fill="currentColor" />
                            <path d="M 13,15 Q 16,18 19,15" />
                            <path d="M 6,5 Q 4,14 10,12" />
                            <path d="M 26,5 Q 28,14 22,12" />
                          </svg>
                        )}
                      </div>
                    </motion.div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ==============================================================
            FINAL SECTION ENDING WITH "SHOP NOW" BUTTON
            ============================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-20 sm:mt-28 flex flex-col items-center text-center max-w-2xl mx-auto rounded-[32px] border border-white/80 bg-white/70 backdrop-blur-xs p-8 sm:p-10 shadow-[0_16px_40px_rgba(50,40,30,0.06)]"
        >
          {/* Ending Trail Paw Badge in Matching Blue */}
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#82C2E5] text-white shadow-sm mb-4">
            <svg
              className="h-6 w-6 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <ellipse cx="6" cy="6" rx="2" ry="2.8" />
              <ellipse cx="11" cy="4.5" rx="2" ry="3" />
              <ellipse cx="16" cy="5" rx="2" ry="3" />
              <ellipse cx="20" cy="7.5" rx="2" ry="2.7" />
              <path d="M8 12 C5 12 4 16 6 19 C8 22 16 22 18 19 C20 16 19 12 16 12 C14 11 10 11 8 12 Z" />
            </svg>
          </div>

          <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#4A3E39] [font-family:var(--font-fredoka)]">
            All the little things. One happy little world.
          </h3>

          <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#5C4E46]/90 font-medium max-w-lg">
            That&apos;s CANOPY — a space designed around the simple joy of being
            a dog.
          </p>

          {/* Primary "Shop Now" Button */}
          <motion.button
            type="button"
            whileHover={{ y: -2, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={openSignIn}
            aria-haspopup="dialog"
            className="group relative mt-6 inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-[#3399D4] px-8 py-3.5 text-base sm:text-lg font-bold text-white shadow-[0_8px_24px_rgba(51,153,212,0.35)] transition-all duration-300 hover:bg-[#2A86BC] hover:shadow-[0_12px_30px_rgba(51,153,212,0.5)] [font-family:var(--font-fredoka)] cursor-pointer"
          >
            {/* Shimmer sweep on hover */}
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <span>Shop Now</span>
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">
              <svg
                className="h-4 w-4 sm:h-5 sm:w-5 stroke-[2.8]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}