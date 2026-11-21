'use client'

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Sparkles, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useCanopyStore } from '@/state/canopy-store'

export function ExploreBanner() {
  const mode = useCanopyStore((state) => state.mode)
  const reducedMotion = useReducedMotion()
  const [isDismissed, setIsDismissed] = useState(false)

  // Re-display the prompt whenever the user switches back into explore mode
  useEffect(() => {
    if (mode === 'explore') {
      setIsDismissed(false)
    }
  }, [mode])

  return (
    <AnimatePresence>
      {mode === 'explore' && !isDismissed && (
        <motion.div
          initial={{ opacity: 0, y: -24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.95 }}
          transition={{
            duration: reducedMotion ? 0.05 : 0.45,
            ease: [0.25, 1, 0.5, 1],
            delay: 0.2,
          }}
          className="pointer-events-auto absolute top-4 left-4 right-28 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-[70] flex items-center justify-between gap-2.5 rounded-full border-2 border-white/60 bg-[#82C2E5] px-4 py-2 sm:px-5 sm:py-2.5 shadow-lg backdrop-blur-sm"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 shrink-0 text-white animate-pulse" />
            <span className="[font-family:var(--font-fredoka)] text-xs sm:text-sm font-semibold tracking-wide text-white drop-shadow-xs">
              Interact and explore all the living elements of the garden!
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            aria-label="Dismiss exploration prompt"
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white/80 hover:bg-white/20 hover:text-white transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <X className="h-3.5 w-3.5 stroke-[2.5]" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}