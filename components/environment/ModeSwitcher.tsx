'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Compass, Moon, HelpCircle } from 'lucide-react'
import { useRef, useEffect } from 'react'
import { useCanopyStore } from '@/state/canopy-store'

export function ModeSwitcher() {
  const mode = useCanopyStore((state) => state.mode)
  const setMode = useCanopyStore((state) => state.setMode)
  const reducedMotion = useReducedMotion()
  const switcherRef = useRef<HTMLButtonElement>(null)

  const isVisible = mode !== 'idle'

  useEffect(() => {
    if (isVisible) {
      switcherRef.current?.focus()
    }
  }, [isVisible])

  if (!isVisible) return null

  return (
    <motion.aside
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reducedMotion ? 0.05 : 0.35, delay: 0.15 }}
      className="pointer-events-auto absolute right-4 top-4 z-[70] flex items-center gap-1 rounded-full border-2 border-white/50 bg-[#82C2E5] p-1.5 shadow-lg sm:right-6 sm:top-6"
      aria-label="Environmental mood selector"
    >
      <button
        ref={switcherRef}
        type="button"
        onClick={() => setMode('explore')}
        className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold [font-family:var(--font-fredoka)] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
          mode === 'explore'
            ? 'bg-white text-[#5293B8] shadow-sm'
            : 'text-white hover:bg-white/20'
        }`}
        aria-pressed={mode === 'explore'}
      >
        <Compass className="h-3.5 w-3.5 stroke-[2.2]" />
        <span>Explore</span>
      </button>

      <button
        type="button"
        onClick={() => setMode('unwind')}
        className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold [font-family:var(--font-fredoka)] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
          mode === 'unwind'
            ? 'bg-white text-[#5293B8] shadow-sm'
            : 'text-white hover:bg-white/20'
        }`}
        aria-pressed={mode === 'unwind'}
      >
        <Moon className="h-3.5 w-3.5 stroke-[2.2]" />
        <span>Unwind</span>
      </button>

      <button
        type="button"
        onClick={() => setMode('idle')}
        title="Re-open mood question"
        className="ml-0.5 flex h-6 w-6 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        aria-label="Change mood question"
      >
        <HelpCircle className="h-3.5 w-3.5" />
      </button>
    </motion.aside>
  )
}