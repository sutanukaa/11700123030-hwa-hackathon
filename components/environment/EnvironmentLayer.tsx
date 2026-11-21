'use client'

import Image from 'next/image'
import { motion, useSpring, useTransform, type MotionValue } from 'framer-motion'
import type { CSSProperties } from 'react'

interface EnvironmentLayerProps {
  src: string
  alt: string
  className?: string
  imageClassName?: string
  style?: CSSProperties
  imageStyle?: CSSProperties
  pointerX: MotionValue<number>
  pointerY: MotionValue<number>
  parallaxStrength?: number
  sizes?: string
  priority?: boolean
  quality?: number
  objectPosition?: string
}

export function EnvironmentLayer({
  src,
  alt,
  className = '',
  imageClassName = '',
  style,
  imageStyle,
  pointerX,
  pointerY,
  parallaxStrength = 0,
  sizes = '100vw',
  priority = false,
  quality = 90,
  objectPosition = 'center bottom',
}: EnvironmentLayerProps) {
  // Translate pointer input (-1 to +1) into exact pixel offsets
  const targetX = useTransform(pointerX, (val) => val * parallaxStrength)
  const targetY = useTransform(pointerY, (val) => val * parallaxStrength * 0.45)

  // Calibrated spring physics for smooth interpolation
  const x = useSpring(targetX, { stiffness: 70, damping: 24, mass: 0.7 })
  const y = useSpring(targetY, { stiffness: 70, damping: 24, mass: 0.7 })

  return (
    <motion.div
      className={`relative h-full w-full ${className}`}
      style={{
        ...style,
        x,
        y,
        willChange: 'transform',
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        quality={quality}
        className={imageClassName}
        style={{ ...imageStyle, objectPosition }}
      />
    </motion.div>
  )
}