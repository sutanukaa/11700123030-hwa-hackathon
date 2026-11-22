'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export function CustomCursor() {
  const [isPointer, setIsPointer] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isClicking, setIsClicking] = useState(false)

  // Track raw mouse coordinates
  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  // Fluid zero-latency spring physics
  const springConfig = { damping: 30, stiffness: 500, mass: 0.08 }
  const cursorX = useSpring(mouseX, springConfig)
  const cursorY = useSpring(mouseY, springConfig)

  useEffect(() => {
    // Only run on desktop devices with a mouse
    if (window.matchMedia('(pointer: coarse)').matches) return

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      if (!isVisible) setIsVisible(true)

      // Detect if hovering over clickable items
      const target = e.target as HTMLElement | null
      const isInteractive = Boolean(
        target?.closest(
          'a, button, [role="button"], input, select, textarea, .cursor-pointer, [data-clickable="true"]'
        )
      )
      setIsPointer(isInteractive)
    }

    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)
    const handleMouseLeave = () => setIsVisible(false)
    const handleMouseEnter = () => setIsVisible(true)

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [mouseX, mouseY, isVisible])

  if (!isVisible) return null

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[9999] select-none"
      style={{
        x: cursorX,
        y: cursorY,
        translateX: '-20%',
        translateY: '-20%',
      }}
      aria-hidden="true"
    >
      <motion.div
        animate={{
          scale: isClicking ? 0.82 : isPointer ? 1.15 : 1,
          rotate: isPointer ? -8 : 0,
        }}
        transition={{ type: 'spring', stiffness: 550, damping: 25 }}
        className="relative h-10 w-10 sm:h-11 sm:w-11 drop-shadow-[0_2px_8px_rgba(0,0,0,0.18)]"
      >
        <Image
          src={isPointer ? '/cursor-pointer.png' : '/cursor-default.png'}
          alt="Paw Cursor"
          fill
          priority
          sizes="48px"
          className="object-contain"
        />
      </motion.div>
    </motion.div>
  )
}