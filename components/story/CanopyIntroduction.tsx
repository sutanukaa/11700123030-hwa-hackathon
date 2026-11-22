'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Compass,
  Pause,
  Sprout,
} from 'lucide-react'
import { canopyAssets } from '@/lib/assets'

type FeatureKey = 'explore' | 'rest' | 'choose'

interface FeatureData {
  key: FeatureKey
  label: string
  title: string
  description: string
  icon: typeof Compass
}

const FEATURES: FeatureData[] = [
  {
    key: 'explore',
    label: 'Explore',
    title: 'Explore Freely',
    description:
      'A safe, open space to sniff, roam, and follow their curiosity.',
    icon: Compass,
  },
  {
    key: 'rest',
    label: 'Rest',
    title: 'Find Their Calm',
    description:
      'A peaceful space to slow down, settle in, and enjoy quiet breaths under the blossoms.',
    icon: Pause,
  },
  {
    key: 'choose',
    label: 'Choose',
    title: 'Their Time, Their Way',
    description:
      'Because every dog is different. Let them decide what feels right.',
    icon: Sprout,
  },
]

export function CanopyIntroduction() {
  const containerRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0)
  const [selectedStone, setSelectedStone] = useState<'meadow' | 'bower'>('meadow')
  const [isDogHovered, setIsDogHovered] = useState(false)

  const activeFeature = FEATURES[activeFeatureIndex]

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  // Subtle signature parallax depths
  const puppyParallaxY = useTransform(scrollYProgress, [0, 1], [20, -20])
  const cardParallaxY = useTransform(scrollYProgress, [0, 1], [15, -15])

  // Asset paths
  const dogHappySrc =
    canopyAssets.dogHappy?.src ??
    canopyAssets.dogPlayful?.src ??
    '/dog-happy.png'
  const sleepingBunnySrc =
    canopyAssets.sleepingBunny?.src ?? '/sleeping-bunny.png'
  const butterflySrc =
    canopyAssets.butterfly1?.src ?? '/butterfly-1.png'
  const flower1Src = canopyAssets.flower1?.src ?? '/flower-1.png'
  const flower2Src = canopyAssets.flower2?.src ?? '/flower-2.png'

  const handleNext = () => {
    setActiveFeatureIndex((prev) => (prev + 1) % FEATURES.length)
  }

  const handlePrev = () => {
    setActiveFeatureIndex(
      (prev) => (prev - 1 + FEATURES.length) % FEATURES.length,
    )
  }

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden bg-[#FEF4EA] pt-14 sm:pt-20 md:pt-24 lg:pt-28 pb-10 sm:pb-14 lg:pb-16 text-[#51443E]"
      aria-label="What is CANOPY interactive overview"
    >
      {/* ==============================================================
          PANORAMIC BACKGROUND: canopyintro.png
          Contains top foliage, cream sky, soft blue waves & bottom grass knoll
          ============================================================== */}
      <div className="pointer-events-none absolute inset-0 z-0 select-none">
        <Image
          src="/canopyintro.png"
          alt="Canopy garden landscape background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-bottom"
        />
      </div>

      {/* Main 3-Column Responsive Container */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 items-center gap-10 sm:gap-12 lg:grid-cols-12 lg:gap-6 xl:gap-8">

          {/* ==============================================================
              LEFT COLUMN (lg:cols-4): Editorial Introduction
              ============================================================== */}
          <div className="flex flex-col items-center text-center lg:col-span-4 lg:items-start lg:text-left">
            {/* Pill Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#3399D4]/35 bg-white/90 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#3399D4] shadow-xs backdrop-blur-xs [font-family:var(--font-fredoka)]">
              <span className="text-sm leading-none text-[#3399D4]">✿</span>
              INTRODUCING CANOPY
            </div>

            {/* Main Headline with 3 Golden Rays & Fredoka Font */}
            <h2 className="mt-4 text-4xl sm:text-5xl lg:text-[54px] font-extrabold leading-[1.08] text-[#4A3E39] [font-family:var(--font-fredoka)]">
              What is{' '}
              <span className="relative inline-block text-[#3399D4]">
                CANOPY?
                {/* Three golden sunburst accent rays */}
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
              </span>
            </h2>

            {/* Supporting Copy */}
            <p className="mt-4 max-w-md text-sm sm:text-base lg:text-[17px] leading-relaxed text-[#5C4E46]/90 font-medium">
              A dog-friendly garden space that gives them the freedom to explore,
              choose, and just be a dog.
            </p>

            {/* Primary Tactile Button - Scrolls to #how-canopy-works */}
            <motion.button
              type="button"
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                const el = document.getElementById('how-canopy-works')
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                } else {
                  window.scrollTo({
                    top: window.innerHeight * 2.2,
                    behavior: 'smooth',
                  })
                }
              }}
              className="group relative mt-6 inline-flex items-center gap-3 overflow-hidden rounded-full bg-[#3399D4] px-7 py-3.5 text-base font-bold text-white shadow-[0_8px_20px_rgba(51,153,212,0.35)] transition-all duration-300 hover:bg-[#2A86BC] hover:shadow-[0_12px_28px_rgba(51,153,212,0.48)] [font-family:var(--font-fredoka)] cursor-pointer"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <span>Learn how it works</span>
              <motion.span
                className="inline-block transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              >
                <ArrowRight className="h-4 w-4 stroke-[2.8]" />
              </motion.span>
            </motion.button>
          </div>

          {/* ==============================================================
              CENTRE COLUMN (lg:cols-4): The Playful Puppy Mascot
              Positioned down so the grass patch connects with the meadow lawn
              ============================================================== */}
          <motion.div
            className="relative flex flex-col items-center justify-end lg:col-span-4 translate-y-8 sm:translate-y-12 lg:translate-y-[76px] xl:translate-y-[88px]"
            style={reducedMotion ? {} : { y: puppyParallaxY }}
            onHoverStart={() => setIsDogHovered(true)}
            onHoverEnd={() => setIsDogHovered(false)}
          >
            {/* Fluttering Blue Butterfly with Dotted Loop Trail */}
            <div className="absolute -top-10 left-6 sm:-top-14 sm:left-10 z-20 pointer-events-none">
              <motion.div
                animate={
                  reducedMotion
                    ? {}
                    : {
                        x: [-4, 6, -3, -4],
                        y: [-4, 4, -8, -4],
                        rotate: [-5, 7, -5, -5],
                      }
                }
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="relative"
              >
                <svg
                  className="absolute -bottom-5 -left-8 w-16 h-8 text-[#3399D4]/60 overflow-visible"
                  viewBox="0 0 60 30"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeDasharray="3 3"
                >
                  <path d="M 0,25 C 20,28 35,5 45,15 C 50,22 55,10 60,5" />
                </svg>
                <div className="relative h-7 w-7 sm:h-8 sm:w-8">
                  <Image
                    src={butterflySrc}
                    alt="Blue butterfly"
                    fill
                    className="object-contain"
                  />
                </div>
              </motion.div>
            </div>

            {/* Mascot Container */}
            <div className="relative">
              {/* Three Golden Tail-Wag Curves */}
              <motion.svg
                animate={
                  reducedMotion
                    ? {}
                    : {
                        scale: [1, 1.15, 1],
                        opacity: [0.8, 1, 0.8],
                        rotate: [0, 4, -4, 0],
                      }
                }
                transition={{
                  duration: 1.1,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute top-2 right-4 sm:top-3 sm:right-6 z-20 h-9 w-9 sm:h-12 sm:w-12 text-[#F5B82E] pointer-events-none"
                viewBox="0 0 32 32"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.8"
                strokeLinecap="round"
              >
                <path d="M12 6 C 18 10, 18 18, 12 22" />
                <path d="M18 4 C 25 9, 25 21, 18 26" />
                <path d="M24 2 C 32 8, 32 24, 24 30" />
              </motion.svg>

              {/* Puppy Image */}
              <motion.div
                className="relative z-10 h-[210px] w-[310px] cursor-pointer sm:h-[260px] sm:w-[390px] lg:h-[300px] lg:w-[450px] xl:h-[330px] xl:w-[490px]"
                animate={
                  reducedMotion
                    ? {}
                    : isDogHovered
                      ? { y: [-2, -7, -2], rotate: [-1, 1, 0] }
                      : { y: [0, -4, 0] }
                }
                transition={{
                  duration: isDogHovered ? 0.6 : 3,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: 'easeInOut',
                }}
              >
                <Image
                  src={dogHappySrc}
                  alt="Golden puppy in playful bow pose"
                  fill
                  sizes="(max-width: 640px) 310px, (max-width: 1024px) 390px, 490px"
                  className="object-contain object-bottom select-none"
                  priority
                />
              </motion.div>

              {/* Mascot reaction tooltip on hover */}
              <AnimatePresence>
                {isDogHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.92 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 3, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="pointer-events-none absolute -top-5 left-1/2 -translate-x-1/2 z-30 whitespace-nowrap rounded-full bg-white/95 px-3.5 py-1 text-xs font-bold text-[#51443E] shadow-sm backdrop-blur-xs [font-family:var(--font-fredoka)]"
                  >
                    *Happy tail wag!* 🐾
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* ==============================================================
              RIGHT COLUMN (lg:cols-4): Interactive Feature Showcase
              ============================================================== */}
          <motion.div
            className="flex flex-col items-center lg:col-span-4 lg:items-end"
            style={reducedMotion ? {} : { y: cardParallaxY }}
          >
            {/* Mode Select Tabs with Downward Active Nib */}
            <div className="flex w-full max-w-[360px] sm:max-w-[400px] items-center justify-between gap-1.5 p-1">
              {FEATURES.map((feat, idx) => {
                const isSelected = activeFeatureIndex === idx
                const IconComponent = feat.icon
                return (
                  <button
                    key={feat.key}
                    type="button"
                    onClick={() => setActiveFeatureIndex(idx)}
                    className={`relative flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 px-3 text-xs sm:text-sm font-bold [font-family:var(--font-fredoka)] transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'bg-[#3399D4] text-white shadow-md'
                        : 'bg-white/75 hover:bg-white text-[#51443E]/80 shadow-2xs'
                    }`}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span>{feat.label}</span>
                    {isSelected && (
                      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-3 w-3 bg-[#3399D4] rotate-45 rounded-xs pointer-events-none" />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Feature Panel Card with Blue Edge Arrows */}
            <div className="relative mt-3.5 w-full max-w-[360px] sm:max-w-[400px] rounded-[30px] border border-white/90 bg-[#FFFEFC] p-5 sm:p-6 shadow-[0_20px_50px_rgba(50,40,30,0.08)]">
              {/* Left Circular Navigation Button with Blue Arrow */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePrev}
                aria-label="Previous feature"
                className="absolute -left-4 sm:-left-5 top-1/2 -translate-y-1/2 z-30 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white text-[#3399D4] shadow-[0_4px_16px_rgba(0,0,0,0.12)] border border-gray-100 transition-colors hover:bg-white active:bg-gray-50 cursor-pointer"
              >
                <ChevronLeft className="h-5 w-5 text-[#3399D4] stroke-[2.6]" />
              </motion.button>

              {/* Right Circular Navigation Button with Blue Arrow */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                aria-label="Next feature"
                className="absolute -right-4 sm:-right-5 top-1/2 -translate-y-1/2 z-30 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white text-[#3399D4] shadow-[0_4px_16px_rgba(0,0,0,0.12)] border border-gray-100 transition-colors hover:bg-white active:bg-gray-50 cursor-pointer"
              >
                <ChevronRight className="h-5 w-5 text-[#3399D4] stroke-[2.6]" />
              </motion.button>

              {/* Card Inner Animated Body */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFeature.key}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="flex flex-col"
                >
                  {/* Miniature Illustration Window using Existing Assets */}
                  <div className="relative h-44 sm:h-48 w-full overflow-hidden rounded-2xl border border-[#E9E4DC] bg-gradient-to-b from-[#EBF5FB] via-[#F4F9F4] to-[#E3EEDA]">
                    {/* SCENE 01: EXPLORE FREELY */}
                    {activeFeature.key === 'explore' && (
                      <div className="relative h-full w-full overflow-hidden">
                        {/* Grassy knoll base */}
                        <div className="absolute -bottom-8 -left-4 -right-4 h-32 rounded-t-[100%] bg-gradient-to-t from-[#8EBE67] via-[#A6D47E] to-[#BFE39A]" />

                        {/* Stepping stones trail curving upward */}
                        <div className="absolute bottom-4 right-10 flex flex-col items-center gap-1.5 rotate-12">
                          <div className="h-3 w-8 rounded-full bg-[#E5D5C2] border-b-2 border-[#C9B39B] shadow-xs" />
                          <div className="h-3.5 w-9 rounded-full bg-[#E0CFBB] border-b-2 border-[#C3AC93] shadow-xs translate-x-2" />
                          <div className="h-4 w-10 rounded-full bg-[#D8C6B1] border-b-2 border-[#BC9F83] shadow-xs translate-x-4" />
                        </div>

                        {/* Garden Rock with 3 Golden Rays */}
                        <div className="absolute bottom-5 left-8 sm:left-10">
                          <div className="relative">
                            <svg
                              className="absolute -top-3.5 left-1/2 -translate-x-1/2 h-5 w-5 text-[#F5B82E]"
                              viewBox="0 0 20 20"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                            >
                              <line x1="5" y1="16" x2="2" y2="10" />
                              <line x1="10" y1="15" x2="10" y2="7" />
                              <line x1="15" y1="16" x2="18" y2="10" />
                            </svg>
                            <div className="h-10 w-14 rounded-full bg-gradient-to-b from-[#B8B4AE] to-[#8C8680] shadow-md border-b-2 border-[#696460]" />
                          </div>
                        </div>

                        {/* Blooming Flowers from Existing Assets */}
                        <div className="absolute bottom-1 left-2 h-14 w-14">
                          <Image
                            src={flower1Src}
                            alt="Meadow flower"
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="absolute bottom-1 right-2 h-12 w-12">
                          <Image
                            src={flower2Src}
                            alt="Garden flower"
                            fill
                            className="object-contain"
                          />
                        </div>

                        {/* Fluttering miniature butterfly */}
                        <motion.div
                          animate={
                            reducedMotion
                              ? {}
                              : {
                                  x: [5, 25, 15, 5],
                                  y: [8, 4, 16, 8],
                                  rotate: [0, 8, -6, 0],
                                }
                          }
                          transition={{
                            duration: 4.5,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }}
                          className="absolute top-3 left-10 h-7 w-7"
                        >
                          <Image
                            src={butterflySrc}
                            alt="Mini butterfly"
                            fill
                            className="object-contain"
                          />
                        </motion.div>
                      </div>
                    )}

                    {/* SCENE 02: FIND THEIR CALM */}
                    {activeFeature.key === 'rest' && (
                      <div className="relative h-full w-full overflow-hidden bg-gradient-to-b from-[#E7ECF5] via-[#F4EDE5] to-[#DFD8CC]">
                        {/* Soft drifting blossom petal */}
                        <motion.div
                          animate={
                            reducedMotion
                              ? {}
                              : {
                                  x: [10, 45, 80],
                                  y: [-5, 45, 95],
                                  rotate: [0, 60, 150],
                                }
                          }
                          transition={{
                            duration: 5.5,
                            repeat: Infinity,
                            ease: 'linear',
                          }}
                          className="absolute top-0 left-10 h-3 w-3 rounded-full bg-[#F2C5D2]"
                        />

                        {/* Peaceful Meadow Mound */}
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 h-20 w-52 rounded-t-[100%] bg-[#A8CCA0]/70" />

                        {/* Sleeping Bunny Asset */}
                        <motion.div
                          animate={
                            reducedMotion
                              ? {}
                              : { scale: [1, 1.03, 1] }
                          }
                          transition={{
                            duration: 3.5,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }}
                          className="absolute bottom-2 left-1/2 h-20 w-32 -translate-x-1/2"
                        >
                          <Image
                            src={sleepingBunnySrc}
                            alt="Sleeping bunny"
                            fill
                            className="object-contain object-bottom"
                          />
                        </motion.div>
                      </div>
                    )}

                    {/* SCENE 03: THEIR TIME, THEIR WAY */}
                    {activeFeature.key === 'choose' && (
                      <div className="relative flex h-full w-full flex-col items-center justify-center bg-gradient-to-b from-[#FFF5DE] via-[#F8EFE4] to-[#EBE1D0] p-4">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[#51443E]/75 [font-family:var(--font-fredoka)]">
                          Choose a Path
                        </p>
                        <div className="mt-3 flex items-center gap-3">
                          {/* Choice stone 1 */}
                          <button
                            type="button"
                            onClick={() => setSelectedStone('meadow')}
                            className={`rounded-xl px-4 py-2 text-xs font-bold [font-family:var(--font-fredoka)] transition-all duration-200 cursor-pointer ${
                              selectedStone === 'meadow'
                                ? 'bg-[#3399D4] text-white shadow-sm scale-105'
                                : 'bg-white/80 text-[#51443E] hover:bg-white'
                            }`}
                          >
                            Sunlit Knoll
                          </button>
                          {/* Choice stone 2 */}
                          <button
                            type="button"
                            onClick={() => setSelectedStone('bower')}
                            className={`rounded-xl px-4 py-2 text-xs font-bold [font-family:var(--font-fredoka)] transition-all duration-200 cursor-pointer ${
                              selectedStone === 'bower'
                                ? 'bg-[#3399D4] text-white shadow-sm scale-105'
                                : 'bg-white/80 text-[#51443E] hover:bg-white'
                            }`}
                          >
                            Shaded Bower
                          </button>
                        </div>
                        {/* Border blooming flowers */}
                        <div className="absolute -bottom-2 left-2 h-10 w-10">
                          <Image
                            src={flower1Src}
                            alt="Flower"
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="absolute -bottom-2 right-2 h-10 w-10">
                          <Image
                            src={flower2Src}
                            alt="Flower"
                            fill
                            className="object-contain"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Title in Signature Blue */}
                  <h3 className="mt-4 text-2xl font-extrabold text-[#3399D4] text-center [font-family:var(--font-fredoka)]">
                    {activeFeature.title}
                  </h3>

                  {/* Card Description */}
                  <p className="mt-2 text-xs sm:text-sm text-center leading-relaxed text-[#6B5E55] max-w-[320px] mx-auto font-medium">
                    {activeFeature.description}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Bottom Pagination Dots */}
              <div
                className="mt-4 sm:mt-5 flex items-center justify-center gap-2"
                role="tablist"
              >
                {FEATURES.map((feat, idx) => (
                  <button
                    key={feat.key}
                    type="button"
                    onClick={() => setActiveFeatureIndex(idx)}
                    aria-label={`Go to ${feat.title}`}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      activeFeatureIndex === idx
                        ? 'w-6 bg-[#3399D4]'
                        : 'w-2 bg-[#D9D9D9] hover:bg-[#B0B0B0]'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}