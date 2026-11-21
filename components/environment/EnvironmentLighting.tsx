'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useCanopyStore } from '@/state/canopy-store'

export function EnvironmentLighting() {
  const mode = useCanopyStore((state) => state.mode)
  const reducedMotion = useReducedMotion()

  const transitionConfig = {
    duration: reducedMotion ? 0.05 : 1.0,
    ease: [0.25, 1, 0.5, 1] as const,
  }

  return (
    <div
      className="pointer-events-none absolute inset-0 z-50 overflow-hidden"
      aria-hidden="true"
    >
      {/* Base Daylight Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 45%, transparent 50%, rgba(81, 68, 62, 0.10) 100%)',
        }}
      />

      {/* Explore Mode: Warm Butter-Yellow Sunlight Grading */}
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{
          opacity: mode === 'explore' ? 1 : 0,
        }}
        transition={transitionConfig}
        style={{
          background:
            'radial-gradient(ellipse at 25% 25%, rgba(245, 217, 142, 0.24) 0%, rgba(201, 121, 92, 0.08) 55%, transparent 80%)',
          mixBlendMode: 'soft-light',
        }}
      />
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{
          opacity: mode === 'explore' ? 0.7 : 0,
        }}
        transition={transitionConfig}
        style={{
          background:
            'linear-gradient(180deg, rgba(245, 217, 142, 0.12) 0%, transparent 60%, rgba(119, 125, 84, 0.08) 100%)',
          mixBlendMode: 'soft-light',
        }}
      />

      {/* Unwind Mode: Calming Garden-Sage Soft Haze */}
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{
          opacity: mode === 'unwind' ? 1 : 0,
        }}
        transition={transitionConfig}
        style={{
          background:
            'radial-gradient(ellipse at 65% 30%, rgba(184, 203, 176, 0.26) 0%, rgba(216, 201, 232, 0.12) 50%, transparent 80%)',
          mixBlendMode: 'soft-light',
        }}
      />
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{
          opacity: mode === 'unwind' ? 0.6 : 0,
        }}
        transition={transitionConfig}
        style={{
          background:
            'linear-gradient(180deg, rgba(184, 203, 176, 0.14) 0%, transparent 55%, rgba(81, 68, 62, 0.08) 100%)',
          mixBlendMode: 'soft-light',
        }}
      />

      {/* Subtle Ground Horizon Depth */}
      <div
        className="absolute inset-x-0 bottom-0 h-[22%]"
        style={{
          background:
            'linear-gradient(180deg, transparent 0%, rgba(81, 68, 62, 0.08) 100%)',
          mixBlendMode: 'multiply',
        }}
      />
    </div>
  )
}