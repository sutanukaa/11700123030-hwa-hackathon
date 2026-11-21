'use client'

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Compass, Moon } from 'lucide-react'
import { useCanopyStore } from '@/state/canopy-store'

export function ModeInvitation() {
  const mode = useCanopyStore((state) => state.mode)
  const setMode = useCanopyStore((state) => state.setMode)
  const reducedMotion = useReducedMotion()

  const isOpen = mode === 'idle'

  const transitionConfig = {
    duration: reducedMotion ? 0.05 : 0.45,
    ease: [0.25, 1, 0.5, 1] as const,
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="canopy-invitation-overlay"
          initial={{ opacity: 0, scale: 0.95, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: -10 }}
          transition={transitionConfig}
          className="pointer-events-auto relative mx-auto w-full max-w-[360px] sm:max-w-[530px] overflow-hidden rounded-3xl border-4 border-white/50 bg-[#82C2E5] p-5 shadow-2xl sm:p-8 text-center"
          role="region"
          aria-label="Welcome and mood selection"
        >
          {/* Brand Eyebrow Badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/40 bg-white/20 px-3.5 py-1 text-[11px] font-semibold tracking-wide text-white [font-family:var(--font-fredoka)] sm:text-xs">
            <span className="h-2 w-2 rounded-full bg-white shadow-xs" />
            <span className="font-bold">CANOPY</span>
            <span className="text-white/60">•</span>
            <span className="font-normal text-white/90">A little space to be a dog</span>
          </div>

          {/* Heading with Rounded Fredoka Font in Crisp White */}
          <h2 className="mt-3 text-2xl font-bold tracking-normal text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.12)] [font-family:var(--font-fredoka)] sm:mt-4 sm:text-3xl">
            What rhythm feels right today?
          </h2>

          <p className="mt-1 text-xs font-normal text-white/90 sm:mt-1.5 sm:text-sm">
            Take a mindful pause in the garden. You can switch moods anytime.
          </p>

          {/* Selection Cards */}
          <div className="mt-5 flex flex-col gap-3 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-4">
            {/* Explore Option */}
            <button
              type="button"
              onClick={() => setMode('explore')}
              className="group flex flex-row items-center justify-between rounded-2xl border-2 border-white/40 bg-white/15 p-3.5 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-white hover:bg-white/25 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#82C2E5] active:scale-[0.98] sm:flex-col sm:justify-between sm:p-5 sm:text-center"
            >
              <div className="flex items-center gap-3 sm:flex-col sm:gap-0">
                {/* Compass Icon */}
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/40 bg-white/25 text-white shadow-xs transition-all duration-300 group-hover:scale-105 group-hover:bg-white/35 sm:h-13 sm:w-13">
                  <Compass className="h-6 w-6 stroke-[2.2] text-white" />
                </div>
                <div className="sm:mt-3">
                  <span className="block text-base font-bold text-white drop-shadow-xs [font-family:var(--font-fredoka)] sm:text-lg">
                    Explore
                  </span>
                  <span className="block text-[11px] leading-snug text-white/85 sm:mt-1 sm:text-xs">
                    Curiosity, fluttering butterflies & floral surprises.
                  </span>
                </div>
              </div>
              <span className="shrink-0 rounded-full border border-white/50 bg-white/25 px-3 py-0.5 text-[10px] font-semibold text-white [font-family:var(--font-fredoka)] sm:mt-4 sm:text-[11px]">
                Daylight & Play
              </span>
            </button>

            {/* Unwind Option */}
            <button
              type="button"
              onClick={() => setMode('unwind')}
              className="group flex flex-row items-center justify-between rounded-2xl border-2 border-white/40 bg-white/15 p-3.5 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-white hover:bg-white/25 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#82C2E5] active:scale-[0.98] sm:flex-col sm:justify-between sm:p-5 sm:text-center"
            >
              <div className="flex items-center gap-3 sm:flex-col sm:gap-0">
                {/* Moon Icon */}
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/40 bg-white/25 text-white shadow-xs transition-all duration-300 group-hover:scale-105 group-hover:bg-white/35 sm:h-13 sm:w-13">
                  <Moon className="h-6 w-6 stroke-[2.2] text-white" />
                </div>
                <div className="sm:mt-3">
                  <span className="block text-base font-bold text-white drop-shadow-xs [font-family:var(--font-fredoka)] sm:text-lg">
                    Unwind
                  </span>
                  <span className="block text-[11px] leading-snug text-white/85 sm:mt-1 sm:text-xs">
                    Quiet stillness, slow deep breaths & tranquil rest.
                  </span>
                </div>
              </div>
              <span className="shrink-0 rounded-full border border-white/50 bg-white/25 px-3 py-0.5 text-[10px] font-semibold text-white [font-family:var(--font-fredoka)] sm:mt-4 sm:text-[11px]">
                Restful & Calm
              </span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}