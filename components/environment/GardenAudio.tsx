'use client'

import { useEffect, useRef } from 'react'
import { useCanopyStore } from '@/state/canopy-store'

export function GardenAudio() {
  const mode = useCanopyStore((state) => state.mode)
  const isMuted = useCanopyStore((state) => state.isMuted)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const audio = new Audio('/explore-bg.mp3')
    audio.loop = true
    audio.volume = 0
    audioRef.current = audio

    return () => {
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current)
      audio.pause()
      audio.src = ''
      audioRef.current = null
    }
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current)
      fadeIntervalRef.current = null
    }

    const shouldPlay = mode === 'explore' && !isMuted

    if (shouldPlay) {
      const playPromise = audio.play()
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Handled gracefully if browser requires user gesture first
        })
      }

      // Smooth fade-in to comfortable background volume (0.32)
      fadeIntervalRef.current = setInterval(() => {
        if (audio.volume < 0.32) {
          audio.volume = Math.min(0.32, +(audio.volume + 0.04).toFixed(2))
        } else {
          if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current)
        }
      }, 50)
    } else {
      // Smooth fade-out before pausing
      fadeIntervalRef.current = setInterval(() => {
        if (audio.volume > 0.03) {
          audio.volume = Math.max(0, +(audio.volume - 0.05).toFixed(2))
        } else {
          audio.volume = 0
          audio.pause()
          if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current)
        }
      }, 40)
    }
  }, [mode, isMuted])

  return null
}