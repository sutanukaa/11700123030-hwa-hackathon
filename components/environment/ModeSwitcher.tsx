'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Sparkles, Flower2, HelpCircle } from 'lucide-react'
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
      className="pointer-events-auto absolute right-4 top-4 z-[70] flex items-center gap-1 rounded-full border border-[#E8DED2]/90 bg-[#FFF8EF]/90 p-1.5 shadow-sm backdrop-blur-md sm:right-6 sm:top-6"
      aria-label="Environmental mood selector"
    >
      <button
        ref={switcherRef}
        type="button"
        onClick={() => setMode('explore')}
        className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5D98E] ${
          mode === 'explore'
            ? 'bg-[#F5D98E] text-[#51443E] font-semibold shadow-xs'
            : 'text-[#897C72] hover:bg-[#FFFEFA] hover:text-[#51443E]'
        }`}
        aria-pressed={mode === 'explore'}
      >
        <Sparkles className="h-3.5 w-3.5" />
        <span>Explore</span>
      </button>

      <button
        type="button"
        onClick={() => setMode('unwind')}
        className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8CBB0] ${
          mode === 'unwind'
            ? 'bg-[#B8CBB0] text-[#51443E] font-semibold shadow-xs'
            : 'text-[#897C72] hover:bg-[#FFFEFA] hover:text-[#51443E]'
        }`}
        aria-pressed={mode === 'unwind'}
      >
        <Flower2 className="h-3.5 w-3.5" />
        <span>Unwind</span>
      </button>

      <button
        type="button"
        onClick={() => setMode('idle')}
        title="Re-open mood question"
        className="ml-0.5 flex h-6 w-6 items-center justify-center rounded-full text-[#897C72] transition-colors hover:bg-[#FFFEFA] hover:text-[#51443E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#51443E]"
        aria-label="Change mood question"
      >
        <HelpCircle className="h-3.5 w-3.5" />
      </button>
    </motion.aside>
  )
}