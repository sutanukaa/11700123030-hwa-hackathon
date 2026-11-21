'use client'

import { motion, type MotionValue, useTransform } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

interface ScrollCueProps {
  scrollYProgress: MotionValue<number>
  reducedMotion: boolean | null
}

export function ScrollCue({ scrollYProgress, reducedMotion }: ScrollCueProps) {
  // Fade out cue as the garden finishes assembling (between 65% and 82% scroll)
  const opacity = useTransform(scrollYProgress, [0, 0.65, 0.82], [1, 0.9, 0])
  const y = useTransform(scrollYProgress, [0, 0.82], [0, 16])

  if (reducedMotion) return null

  return (
    <motion.div
      style={{ opacity, y }}
      className="pointer-events-none absolute inset-x-0 bottom-8 z-[55] flex flex-col items-center justify-center text-center"
      aria-hidden="true"
    >
      <div className="flex flex-col items-center gap-1.5 rounded-full border border-[#E8DED2]/80 bg-[#FFF8EF]/80 px-4 py-2 shadow-xs backdrop-blur-md">
        <span className="font-display text-xs font-medium tracking-wide text-[#51443E]">
          Scroll to enter the garden
        </span>
        <motion.div
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="h-3.5 w-3.5 text-[#C9795C]" />
        </motion.div>
      </div>
    </motion.div>
  )
}