'use client'

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Sparkles, Flower2 } from 'lucide-react'
import { useCanopyStore } from '@/state/canopy-store'

export function ModeInvitation() {
  const mode = useCanopyStore((state) => state.mode)
  const setMode = useCanopyStore((state) => state.setMode)
  const reducedMotion = useReducedMotion()

  const isOpen = mode === 'idle'

  const transitionConfig = {
    duration: reducedMotion ? 0.05 : 0.5,
    ease: [0.25, 1, 0.5, 1] as const,
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="canopy-invitation-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={transitionConfig}
          className="pointer-events-auto relative mx-auto w-full max-w-[340px] sm:max-w-lg overflow-hidden rounded-2xl border border-[#E8DED2]/90 bg-[#FFF8EF]/95 p-4 shadow-xl backdrop-blur-md sm:rounded-3xl sm:p-8 text-center"
          role="region"
          aria-label="Welcome and mood selection"
        >
          {/* Brand Header */}
          <span className="text-[10px] font-semibold tracking-wider text-[#C9795C] uppercase sm:text-xs">
            CANOPY • A little space to be a dog
          </span>

          <h2 className="mt-1 font-display text-lg font-medium tracking-tight text-[#51443E] sm:mt-2 sm:text-3xl">
            What do you need right now?
          </h2>

          <p className="mt-0.5 text-[11px] text-[#897C72] sm:mt-1 sm:text-sm">
            Take a little moment for yourself.
          </p>

          {/* Selection Choices:
              - Mobile: Compact horizontal items (no scrolling needed)
              - Desktop (sm:): Spacious side-by-side vertical cards */}
          <div className="mt-3 flex flex-col gap-2 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3">
            {/* Explore Option */}
            <button
              type="button"
              onClick={() => setMode('explore')}
              className="group flex flex-row items-center justify-between rounded-xl border-2 border-[#E8DED2] bg-[#FFFEFA] p-2.5 text-left transition-all hover:border-[#F5D98E] hover:bg-[#FFFDF5] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5D98E] focus-visible:ring-offset-2 active:scale-[0.98] sm:flex-col sm:justify-between sm:rounded-2xl sm:p-4 sm:text-center"
            >
              <div className="flex items-center gap-2.5 sm:flex-col sm:gap-0">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F5D98E]/35 text-[#51443E] transition-transform group-hover:scale-105 sm:h-11 sm:w-11">
                  <Sparkles className="h-4 w-4 text-[#C9795C] sm:h-5 sm:w-5" />
                </div>
                <div className="sm:mt-3">
                  <span className="block font-display text-xs font-semibold leading-tight text-[#51443E] sm:text-base">
                    I WANT TO EXPLORE!
                  </span>
                  <span className="block text-[10px] leading-tight text-[#897C72] sm:mt-0.5 sm:text-xs">
                    A little curiosity never hurt.
                  </span>
                </div>
              </div>
              <span className="shrink-0 rounded-full bg-[#F5D98E]/25 px-2 py-0.5 text-[9px] font-medium text-[#51443E] sm:mt-3 sm:text-[11px]">
                Warmer
              </span>
            </button>

            {/* Unwind Option */}
            <button
              type="button"
              onClick={() => setMode('unwind')}
              className="group flex flex-row items-center justify-between rounded-xl border-2 border-[#E8DED2] bg-[#FFFEFA] p-2.5 text-left transition-all hover:border-[#B8CBB0] hover:bg-[#F7FAF6] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8CBB0] focus-visible:ring-offset-2 active:scale-[0.98] sm:flex-col sm:justify-between sm:rounded-2xl sm:p-4 sm:text-center"
            >
              <div className="flex items-center gap-2.5 sm:flex-col sm:gap-0">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#B8CBB0]/35 text-[#51443E] transition-transform group-hover:scale-105 sm:h-11 sm:w-11">
                  <Flower2 className="h-4 w-4 text-[#777D54] sm:h-5 sm:w-5" />
                </div>
                <div className="sm:mt-3">
                  <span className="block font-display text-xs font-semibold leading-tight text-[#51443E] sm:text-base">
                    I WANT TO UNWIND.
                  </span>
                  <span className="block text-[10px] leading-tight text-[#897C72] sm:mt-0.5 sm:text-xs">
                    Let&apos;s slow things down.
                  </span>
                </div>
              </div>
              <span className="shrink-0 rounded-full bg-[#B8CBB0]/25 px-2 py-0.5 text-[9px] font-medium text-[#51443E] sm:mt-3 sm:text-[11px]">
                Peaceful
              </span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}