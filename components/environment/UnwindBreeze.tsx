'use client'

import { motion, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import { canopyAssets } from '@/lib/assets'

interface ResponsivePetal {
  id: number
  startLeft: string
  startTop: string
  driftX: string
  driftY: string
  size: number
  duration: number
  delay: number
  rotation: number
}

// 8 prominent cherry blossom petals gracefully tumbling across the garden
const PETALS: ResponsivePetal[] = [
  { id: 1, startLeft: '12%', startTop: '16%', driftX: '34vw', driftY: '42vh', size: 24, duration: 14, delay: 0,   rotation: 320 },
  { id: 2, startLeft: '22%', startTop: '10%', driftX: '38vw', driftY: '48vh', size: 22, duration: 17, delay: 2.2, rotation: 380 },
  { id: 3, startLeft: '8%',  startTop: '24%', driftX: '30vw', driftY: '38vh', size: 26, duration: 15, delay: 4.8, rotation: 270 },
  { id: 4, startLeft: '28%', startTop: '14%', driftX: '36vw', driftY: '44vh', size: 20, duration: 18, delay: 7.2, rotation: 420 },
  { id: 5, startLeft: '16%', startTop: '20%', driftX: '32vw', driftY: '40vh', size: 25, duration: 16, delay: 9.8, rotation: 300 },
  { id: 6, startLeft: '32%', startTop: '12%', driftX: '40vw', driftY: '46vh', size: 21, duration: 19, delay: 12.0, rotation: 360 },
  { id: 7, startLeft: '6%',  startTop: '28%', driftX: '28vw', driftY: '36vh', size: 27, duration: 14, delay: 14.5, rotation: 250 },
  { id: 8, startLeft: '24%', startTop: '22%', driftX: '35vw', driftY: '45vh', size: 23, duration: 17, delay: 16.8, rotation: 340 },
]

export function UnwindBreeze() {
  const reducedMotion = useReducedMotion()

  if (reducedMotion) return null

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[36] overflow-hidden select-none"
      aria-hidden="true"
    >
      {PETALS.map((petal) => (
        <motion.div
          key={petal.id}
          className="absolute"
          style={{
            left: petal.startLeft,
            top: petal.startTop,
            width: petal.size,
            height: petal.size,
          }}
          initial={{ opacity: 0, x: '0vw', y: '0vh', rotate: 0, scale: 0.8 }}
          animate={{
            opacity: [0, 0.98, 0.98, 0],
            x: ['0vw', petal.driftX],
            y: ['0vh', petal.driftY],
            rotate: [0, petal.rotation],
            scale: [0.8, 1.08, 0.95],
          }}
          transition={{
            duration: petal.duration,
            repeat: Infinity,
            delay: petal.delay,
            ease: 'easeInOut',
          }}
        >
          <div className="relative h-full w-full drop-shadow-[0_3px_8px_rgba(225,120,150,0.45)]">
            <Image
              src={canopyAssets.flowerPetal.src}
              alt=""
              fill
              sizes="32px"
              className="object-contain"
            />
          </div>
        </motion.div>
      ))}
    </div>
  )
}