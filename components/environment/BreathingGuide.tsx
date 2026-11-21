'use client'

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Wind, Play, Pause, X } from 'lucide-react'
import { useState, useEffect } from 'react'

type BreathPhase = 'inhale' | 'hold' | 'exhale'

export function BreathingGuide() {
  const reducedMotion = useReducedMotion()
  const [isOpen, setIsOpen] = useState(false)
  const [isActive, setIsActive] = useState(true)
  const [phase, setPhase] = useState<BreathPhase>('inhale')
  const [promptText, setPromptText] = useState('Breathe in...')

  useEffect(() => {
    if (!isOpen || !isActive) {
      setPromptText('Take a little breath.')
      return
    }

    let isMounted = true
    let timer: ReturnType<typeof setTimeout>

    // 12-second mindful cycle: 4s Inhale, 2s Hold, 6s Exhale
    const runCycle = () => {
      if (!isMounted) return
      setPhase('inhale')
      setPromptText('Breathe in...')

      timer = setTimeout(() => {
        if (!isMounted) return
        setPhase('hold')
        setPromptText('Hold gently...')

        timer = setTimeout(() => {
          if (!isMounted) return
          setPhase('exhale')
          setPromptText('Breathe out...')

          timer = setTimeout(() => {
            if (!isMounted) return
            runCycle()
          }, 6000)
        }, 2000)
      }, 4000)
    }

    runCycle()

    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [isOpen, isActive])

  return (
    <>
      {/* Unobtrusive Floating Invitation Button (Bottom-center, clear of navigation) */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.35 }}
            className="pointer-events-auto absolute bottom-6 left-1/2 -translate-x-1/2 z-[70]"
          >
            <button
              type="button"
              onClick={() => {
                setIsOpen(true)
                setIsActive(true)
              }}
              className="flex items-center gap-2 rounded-full border-2 border-white/60 bg-[#82C2E5] px-4 py-2 text-xs font-bold text-white shadow-lg backdrop-blur-sm transition-all hover:scale-105 hover:bg-[#6fb5dd] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer [font-family:var(--font-fredoka)]"
              aria-label="Open mindful breathing guide"
            >
              <Wind className="h-4 w-4 stroke-[2.2]" />
              <span>Take a mindful breath</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Mindful Breathing Circle Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
            className="pointer-events-none absolute inset-0 z-[70] flex flex-col items-center justify-center p-4"
            role="region"
            aria-label="Guided breathing exercise"
          >
            {/* Minimal Control Pill */}
            <div className="pointer-events-auto mb-6 flex items-center gap-2 rounded-full border-2 border-white/60 bg-[#82C2E5]/95 px-3.5 py-1.5 shadow-md backdrop-blur-sm">
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className="flex items-center gap-1.5 text-xs font-semibold text-white hover:text-white/80 transition-colors focus:outline-none cursor-pointer [font-family:var(--font-fredoka)]"
                aria-label={isActive ? 'Pause breathing guide' : 'Resume breathing guide'}
              >
                {isActive ? (
                  <>
                    <Pause className="h-3.5 w-3.5 stroke-[2.5]" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5 stroke-[2.5]" />
                    <span>Resume</span>
                  </>
                )}
              </button>

              <div className="h-3 w-[1px] bg-white/40" />

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-5 w-5 items-center justify-center rounded-full text-white/85 hover:bg-white/20 hover:text-white transition-colors focus:outline-none cursor-pointer"
                aria-label="Close breathing guide"
              >
                <X className="h-3.5 w-3.5 stroke-[2.5]" />
              </button>
            </div>

            {/* Breathing Circle Container */}
            <div className="relative flex items-center justify-center">
              {/* Outer Radiant Glow */}
              <motion.div
                className="absolute rounded-full"
                animate={
                  reducedMotion || !isActive
                    ? { scale: 1, opacity: 0.25 }
                    : {
                        scale: phase === 'inhale' ? 1.22 : phase === 'hold' ? 1.22 : 0.96,
                        opacity: phase === 'hold' ? 0.4 : 0.22,
                      }
                }
                transition={{
                  duration: phase === 'inhale' ? 4 : phase === 'hold' ? 2 : 6,
                  ease: 'easeInOut',
                }}
                style={{
                  width: 'min(68vw, 280px)',
                  height: 'min(68vw, 280px)',
                  background: 'radial-gradient(circle, rgba(130,194,229,0.45) 0%, transparent 70%)',
                }}
              />

              {/* Main Soft Sky-Blue Circle (#82C2E5) */}
              <motion.div
                className="relative flex items-center justify-center rounded-full border-2 border-white/70 shadow-[0_12px_45px_rgba(130,194,229,0.45)] backdrop-blur-md"
                style={{
                  width: 'min(56vw, 220px)',
                  height: 'min(56vw, 220px)',
                  background: 'linear-gradient(135deg, rgba(162, 218, 245, 0.88) 0%, rgba(130, 194, 229, 0.94) 100%)',
                }}
                animate={
                  reducedMotion || !isActive
                    ? { scale: 1 }
                    : {
                        scale: phase === 'inhale' ? 1.14 : phase === 'hold' ? 1.14 : 0.88,
                      }
                }
                transition={{
                  duration: phase === 'inhale' ? 4 : phase === 'hold' ? 2 : 6,
                  ease: 'easeInOut',
                }}
              >
                {/* Gentle Guidance Text */}
                <div className="text-center px-4">
                  <motion.p
                    key={promptText}
                    initial={{ opacity: 0, y: 2 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-lg sm:text-xl font-bold tracking-normal text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.15)] [font-family:var(--font-fredoka)]"
                  >
                    {promptText}
                  </motion.p>
                  <p className="mt-1 text-[11px] font-normal text-white/90 sm:text-xs">
                    {reducedMotion
                      ? 'Inhale for 4s, hold for 2s, exhale for 6s.'
                      : 'Take your time.'}
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}