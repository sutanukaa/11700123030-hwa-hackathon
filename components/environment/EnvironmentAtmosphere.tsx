'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useCanopyStore } from '@/state/canopy-store'

interface ParticleDef {
  id: number
  left: string
  top: string
  size: number
  duration: number
  delay: number
}

const PARTICLES: ParticleDef[] = [
  { id: 1, left: '20%', top: '35%', size: 4, duration: 8, delay: 0 },
  { id: 2, left: '38%', top: '48%', size: 3, duration: 11, delay: 1.2 },
  { id: 3, left: '58%', top: '28%', size: 5, duration: 9, delay: 0.6 },
  { id: 4, left: '72%', top: '52%', size: 3, duration: 12, delay: 2.0 },
  { id: 5, left: '85%', top: '38%', size: 4, duration: 10, delay: 1.5 },
]

export function EnvironmentAtmosphere() {
  const mode = useCanopyStore((state) => state.mode)
  const reducedMotion = useReducedMotion()

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[35] overflow-hidden"
      aria-hidden="true"
    >
      {/* Mid-Ground Atmospheric Mist Band */}
      <motion.div
        className="absolute inset-x-0 top-[28%] h-[28%]"
        animate={{
          opacity: mode === 'unwind' ? 0.65 : mode === 'explore' ? 0.35 : 0.45,
        }}
        transition={{ duration: 1.0 }}
        style={{
          background:
            'linear-gradient(180deg, transparent 0%, rgba(255, 248, 239, 0.20) 50%, transparent 100%)',
          filter: 'blur(12px)',
        }}
      />

      {/* Floating Light Motes */}
      {!reducedMotion &&
        PARTICLES.map((p) => {
          const speedMultiplier =
            mode === 'unwind' ? 1.4 : mode === 'explore' ? 0.75 : 1.0
          const particleColor =
            mode === 'explore'
              ? 'rgba(245, 217, 142, 0.70)'
              : mode === 'unwind'
                ? 'rgba(242, 197, 210, 0.60)'
                : 'rgba(255, 254, 250, 0.55)'

          return (
            <motion.span
              key={p.id}
              className="absolute rounded-full"
              style={{
                left: p.left,
                top: p.top,
                width: p.size,
                height: p.size,
                backgroundColor: particleColor,
                boxShadow: '0 0 8px rgba(255, 255, 255, 0.7)',
              }}
              animate={{
                y: [0, -22, 0],
                x: [0, 10, 0],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: p.duration * speedMultiplier,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: p.delay,
              }}
            />
          )
        })}
    </div>
  )
}