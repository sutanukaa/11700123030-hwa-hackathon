'use client'

import { motion, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import { canopyAssets } from '@/lib/assets'

export function SleepingBunny() {
  const reducedMotion = useReducedMotion()

  const bunnySrc = canopyAssets.sleepingBunny?.src || '/sleeping-bunny.png'
  const bunnyAlt =
    canopyAssets.sleepingBunny?.alt ||
    'Sleeping bunny resting quietly in the meadow grass'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.0, ease: 'easeOut' }}
      /* Placed on the open left-meadow knoll with z-[45] so it is in front of the bushes and clear of the breathing circle */
      className="pointer-events-none absolute z-[45] bottom-[18%] left-[16%] sm:bottom-[21%] sm:left-[22%] md:bottom-[23%] md:left-[25%] select-none"
      aria-label="A sleeping bunny resting quietly in the meadow grass"
    >
      {/* Static ground contact shadow */}
      <div
        className="absolute bottom-1 left-1/2 -translate-x-1/2 w-[75%] h-2.5 rounded-[100%] bg-[#2d3d28]/35 blur-[4px]"
        aria-hidden="true"
      />

      {/* Rhythmic Breathing Animation: Anchored at base so contact foliage remains stationary */}
      <motion.div
        animate={
          reducedMotion
            ? {}
            : {
                scaleY: [1, 1.018, 1],
              }
        }
        transition={{
          duration: 4.8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{ transformOrigin: '50% 88%' }}
        className="relative w-[115px] h-[77px] sm:w-[145px] sm:h-[97px] md:w-[170px] md:h-[113px]"
      >
        <Image
          src={bunnySrc}
          alt={bunnyAlt}
          fill
          sizes="(max-width: 640px) 115px, (max-width: 768px) 145px, 170px"
          className="object-contain"
          priority
        />
      </motion.div>
    </motion.div>
  )
}