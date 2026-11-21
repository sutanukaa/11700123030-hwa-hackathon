'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useCanopyStore } from '@/state/canopy-store'

export function EnvironmentLighting() {
  const mode = useCanopyStore((state) => state.mode)
  const reducedMotion = useReducedMotion()

  const transitionConfig = {
    duration: reducedMotion ? 0.05 : 1.2,
    ease: [0.25, 1, 0.5, 1] as const,
  }

  return (
    <div
      className="pointer-events-none absolute inset-0 z-50 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Base Neutral Daylight Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 45%, transparent 50%, rgba(81, 68, 62, 0.10) 100%)',
        }}
      />

      {/* =========================================================================
          EXPLORE MODE: Warm Butter-Yellow Sunlight Grading
          ========================================================================= */}
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{ opacity: mode === 'explore' ? 1 : 0 }}
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
        animate={{ opacity: mode === 'explore' ? 0.7 : 0 }}
        transition={transitionConfig}
        style={{
          background:
            'linear-gradient(180deg, rgba(245, 217, 142, 0.12) 0%, transparent 60%, rgba(119, 125, 84, 0.08) 100%)',
          mixBlendMode: 'soft-light',
        }}
      />

      {/* =========================================================================
          UNWIND MODE: Luminous God-Rays, Warm Canopy Sunburst & Sage Atmosphere
          ========================================================================= */}
      {/* 1. Sage-green & pastel pink soothing ambient wash */}
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{ opacity: mode === 'unwind' ? 1 : 0 }}
        transition={transitionConfig}
        style={{
          background:
            'radial-gradient(ellipse at 65% 35%, rgba(168, 195, 160, 0.22) 0%, rgba(228, 206, 216, 0.12) 50%, transparent 80%)',
          mixBlendMode: 'soft-light',
        }}
      />
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{ opacity: mode === 'unwind' ? 0.75 : 0 }}
        transition={transitionConfig}
        style={{
          background:
            'linear-gradient(180deg, rgba(255, 238, 218, 0.18) 0%, transparent 50%, rgba(138, 162, 131, 0.12) 100%)',
          mixBlendMode: 'soft-light',
        }}
      />

      {/* 2. Radiant Cherry Tree Sunburst Bloom (Top-Left Canopy) */}
      {mode === 'unwind' && (
        <motion.div
          className="absolute inset-0"
          animate={
            reducedMotion
              ? { opacity: 0.5 }
              : {
                  opacity: [0.45, 0.65, 0.45],
                  scale: [1, 1.04, 1],
                }
          }
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            background:
              'radial-gradient(circle at 18% 18%, rgba(255, 242, 190, 0.60) 0%, rgba(255, 230, 160, 0.30) 25%, transparent 60%)',
            mixBlendMode: 'screen',
          }}
        />
      )}

      {/* 3. Distinct Luminous God-Rays Streaming Down Across Meadow */}
      {mode === 'unwind' && (
        <motion.div
          className="absolute inset-0"
          animate={
            reducedMotion
              ? { opacity: 0.55 }
              : {
                  opacity: [0.55, 0.75, 0.55],
                  x: ['-2%', '2.5%', '-2%'],
                }
          }
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            background:
              'repeating-linear-gradient(128deg, rgba(255, 248, 220, 0.42) 0px, rgba(255, 245, 210, 0.36) 55px, transparent 100px, transparent 165px)',
            maskImage:
              'radial-gradient(ellipse at 20% 20%, black 20%, rgba(0,0,0,0.65) 60%, transparent 90%)',
            WebkitMaskImage:
              'radial-gradient(ellipse at 20% 20%, black 20%, rgba(0,0,0,0.65) 60%, transparent 90%)',
            mixBlendMode: 'screen',
          }}
        />
      )}

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