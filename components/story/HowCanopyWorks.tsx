'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'

interface StepCard {
  step: number
  title: string
  imageSrc: string
  caption: string
  raysPosition: 'top-right' | 'top-left'
}

const STEPS: StepCard[] = [
  {
    step: 1,
    title: 'Arrive',
    imageSrc: '/canopy-arrive.png',
    caption: 'Step into a safe, welcoming space made just for them.',
    raysPosition: 'top-right',
  },
  {
    step: 2,
    title: 'Choose',
    imageSrc: '/canopy-explore.png',
    caption: 'They can explore, play, or simply find a quiet corner to unwind.',
    raysPosition: 'top-left',
  },
  {
    step: 3,
    title: 'Enjoy',
    imageSrc: '/canopy-unwind.png',
    caption: 'A space that adapts to their mood, energy, and curiosity.',
    raysPosition: 'top-left',
  },
]

export function HowCanopyWorks() {
  const reducedMotion = useReducedMotion()

  return (
    <section
      id="how-canopy-works"
      className="relative w-full overflow-hidden bg-[#FEF4EA] pt-16 sm:pt-20 md:pt-24 lg:pt-28 pb-16 sm:pb-24 lg:pb-32 text-[#51443E]"
      aria-label="How CANOPY Works - A Simple, Thoughtful Experience"
    >
      {/* ==============================================================
          PANORAMIC BACKGROUND: canopy-adventure-bg.png
          ============================================================== */}
      <div className="pointer-events-none absolute inset-0 z-0 select-none">
        <Image
          src="/canopy-adventure-bg.png"
          alt="Canopy garden adventure background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-bottom"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        {/* ==============================================================
            HEADER: Eyebrow, Main Headline & Subtitle with Butterfly
            ============================================================== */}
        <div className="flex flex-col items-center text-center">
          {/* Eyebrow Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-[#3399D4]/40 bg-white/90 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#3399D4] shadow-xs backdrop-blur-xs [font-family:var(--font-fredoka)]"
          >
            <span className="text-sm leading-none text-[#3399D4]">✿</span>
            HOW CANOPY WORKS
          </motion.div>

          {/* Headline with Golden Sunburst Rays */}
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative mt-4 text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-extrabold leading-[1.12] text-[#4A3E39] [font-family:var(--font-fredoka)]"
          >
            {/* Left Sunburst Rays above "A" */}
            <svg
              className="absolute -top-3 -left-3 sm:-top-4 sm:-left-5 h-6 w-6 sm:h-7 sm:w-7 text-[#F5B82E] pointer-events-none"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.2"
              strokeLinecap="round"
            >
              <line x1="16" y1="18" x2="20" y2="13" />
              <line x1="12" y1="16" x2="12" y2="9" />
              <line x1="8" y1="18" x2="4" y2="13" />
            </svg>

            <span>A Simple, Thoughtful </span>
            <span className="relative inline-block text-[#3399D4]">
              Experience
              {/* Right Sunburst Rays above "Experience" */}
              <svg
                className="absolute -top-3.5 -right-3.5 sm:-top-4 sm:-right-5 h-6 w-6 sm:h-7 sm:w-7 text-[#F5B82E] pointer-events-none"
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
          </motion.h2>

          {/* Subtitle & Blue Butterfly */}
          <div className="relative mt-3 max-w-2xl px-4 sm:px-6">
            <p className="text-sm sm:text-base lg:text-[17px] leading-relaxed text-[#5C4E46]/90 font-medium text-center">
              From arrival to play, rest, and everything in between — CANOPY gives dogs
              a space to be themselves, at their own pace.
            </p>

            {/* Blue Butterfly with Dotted Flight Loop */}
            <div className="hidden sm:block absolute -top-4 -right-10 lg:-right-16 pointer-events-none">
              <motion.div
                animate={
                  reducedMotion
                    ? {}
                    : {
                        x: [-4, 6, -3, -4],
                        y: [-4, 4, -8, -4],
                        rotate: [-6, 8, -6, -6],
                      }
                }
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="relative"
              >
                <svg
                  className="absolute -bottom-4 -left-9 w-14 h-8 text-[#3399D4]/60 overflow-visible"
                  viewBox="0 0 60 30"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeDasharray="3 3"
                >
                  <path d="M 0,25 C 20,28 35,5 45,15 C 50,22 55,10 60,5" />
                </svg>
                <div className="relative h-8 w-8 sm:h-9 sm:w-9">
                  <Image
                    src="/butterfly-1.png"
                    alt="Blue butterfly"
                    fill
                    className="object-contain"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* ==============================================================
            THREE SEQUENTIAL STEPS ROW (Arrive → Choose → Enjoy)
            ============================================================== */}
        <div className="mt-12 sm:mt-16 lg:mt-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-5 lg:gap-8 items-start">
            {STEPS.map((item, idx) => (
              <div key={item.step} className="relative flex flex-col items-center">
                
                {/* Step Header: Blue Badge & Title */}
                <div className="relative flex items-center justify-center gap-2.5 mb-3 sm:mb-4">
                  {/* Sunburst rays for Choose / Enjoy (left-aligned) */}
                  {item.raysPosition === 'top-left' && (
                    <svg
                      className="absolute -top-3.5 -left-4 h-5 w-5 text-[#F5B82E] pointer-events-none"
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                    >
                      <line x1="14" y1="16" x2="18" y2="10" />
                      <line x1="10" y1="15" x2="10" y2="7" />
                      <line x1="6" y1="16" x2="2" y2="10" />
                    </svg>
                  )}

                  {/* Scalloped Blue Number Badge */}
                  <div className="relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-[#3399D4] text-white font-extrabold shadow-sm [font-family:var(--font-fredoka)]">
                    <span className="text-base sm:text-lg">{item.step}</span>
                  </div>

                  {/* Step Title in Signature Blue */}
                  <h3 className="relative text-2xl sm:text-3xl font-extrabold text-[#3399D4] [font-family:var(--font-fredoka)]">
                    {item.title}

                    {/* Sunburst rays for Arrive (top-right) */}
                    {item.raysPosition === 'top-right' && (
                      <svg
                        className="absolute -top-3.5 -right-4 h-5 w-5 text-[#F5B82E] pointer-events-none"
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.8"
                        strokeLinecap="round"
                      >
                        <line x1="4" y1="16" x2="1" y2="10" />
                        <line x1="10" y1="15" x2="10" y2="7" />
                        <line x1="16" y1="16" x2="19" y2="10" />
                      </svg>
                    )}
                  </h3>
                </div>

                {/* Card Container with Thick White Border & Soft Drop Shadow */}
                <motion.div
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="group relative w-full max-w-[340px] sm:max-w-[370px] aspect-[4/3] overflow-hidden rounded-[26px] sm:rounded-[32px] border-[5px] border-white bg-white shadow-[0_16px_36px_rgba(50,40,30,0.1)] transition-shadow duration-300 hover:shadow-[0_22px_45px_rgba(51,153,212,0.25)]"
                >
                  <Image
                    src={item.imageSrc}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 340px, (max-width: 1200px) 320px, 370px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Subtle inner gloss shine */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/10" />
                </motion.div>

                {/* Caption Description Below Card */}
                <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-center leading-relaxed text-[#5C4E46]/90 font-medium max-w-[270px]">
                  {item.caption}
                </p>

                {/* Connecting Arrow (Desktop Only) between cards */}
                {idx < STEPS.length - 1 && (
                  <div className="hidden md:flex absolute -right-3.5 lg:-right-5 top-[52%] -translate-y-1/2 z-20 pointer-events-none">
                    <svg
                      className="w-6 h-6 lg:w-7 lg:h-7 text-[#3399D4]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="4" y1="12" x2="20" y2="12" />
                      <polyline points="14 6 20 12 14 18" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}