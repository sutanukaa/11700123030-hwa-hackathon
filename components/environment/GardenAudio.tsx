'use client'

import { useEffect, useRef } from 'react'
import { useCanopyStore } from '@/state/canopy-store'

export function GardenAudio() {
  const mode = useCanopyStore((state) => state.mode)
  const isMuted = useCanopyStore((state) => state.isMuted)

  const exploreAudioRef = useRef<HTMLAudioElement | null>(null)
  const unwindAudioRef = useRef<HTMLAudioElement | null>(null)

  // Web Audio Context for slow organic wind and delicate bird chirps
  const webAudioCtxRef = useRef<AudioContext | null>(null)
  const unwindMasterGainRef = useRef<GainNode | null>(null)
  const birdTimerRef = useRef<NodeJS.Timeout | null>(null)
  const hasAudioFileRef = useRef<boolean>(false)

  // Initialize Explore and Unwind audio elements
  useEffect(() => {
    // 1. Explore background audio
    const exploreAudio = new Audio('/explore-bg.mp3')
    exploreAudio.loop = true
    exploreAudio.volume = 0
    exploreAudioRef.current = exploreAudio

    // 2. Unwind audio file hook
    const unwindAudio = new Audio('/unwind-bg.mp3')
    unwindAudio.loop = true
    unwindAudio.volume = 0
    unwindAudio.oncanplaythrough = () => {
      hasAudioFileRef.current = true
    }
    unwindAudio.onerror = () => {
      hasAudioFileRef.current = false
    }
    unwindAudioRef.current = unwindAudio

    return () => {
      exploreAudio.pause()
      exploreAudio.src = ''
      unwindAudio.pause()
      unwindAudio.src = ''

      if (birdTimerRef.current) clearTimeout(birdTimerRef.current)
      if (webAudioCtxRef.current) {
        webAudioCtxRef.current.close().catch(() => {})
        webAudioCtxRef.current = null
      }
    }
  }, [])

  // Procedural Slow Wind & Soft Bird Chirps Generator
  const ensureUnwindSoundscape = () => {
    if (webAudioCtxRef.current) return
    try {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (!AudioCtxClass) return

      const ctx = new AudioCtxClass()
      const master = ctx.createGain()
      master.gain.setValueAtTime(0.0001, ctx.currentTime)
      master.connect(ctx.destination)

      // ==========================================
      // 1. Slow, breathing wind rustle through trees
      // ==========================================
      const bufferSize = ctx.sampleRate * 2
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const data = noiseBuffer.getChannelData(0)
      let b0 = 0, b1 = 0, b2 = 0
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1
        b0 = 0.997 * b0 + white * 0.055
        b1 = 0.985 * b1 + white * 0.075
        b2 = 0.950 * b2 + white * 0.150
        data[i] = (b0 + b1 + b2) * 0.024
      }

      const noiseSource = ctx.createBufferSource()
      noiseSource.buffer = noiseBuffer
      noiseSource.loop = true

      const windFilter = ctx.createBiquadFilter()
      windFilter.type = 'lowpass'
      windFilter.frequency.setValueAtTime(240, ctx.currentTime)

      // Rhythmic LFO simulating slow wind swells (7.5s cycle)
      const lfo = ctx.createOscillator()
      const lfoGain = ctx.createGain()
      lfo.frequency.setValueAtTime(0.13, ctx.currentTime)
      lfoGain.gain.setValueAtTime(110, ctx.currentTime)
      lfo.connect(lfoGain)
      lfoGain.connect(windFilter.frequency)
      lfo.start()

      noiseSource.connect(windFilter)
      windFilter.connect(master)
      noiseSource.start()

      // Calming warm pad tone at 174 Hz
      const padOsc = ctx.createOscillator()
      const padGain = ctx.createGain()
      padOsc.type = 'sine'
      padOsc.frequency.setValueAtTime(174, ctx.currentTime)
      padGain.gain.setValueAtTime(0.05, ctx.currentTime)
      padOsc.connect(padGain)
      padGain.connect(master)
      padOsc.start()

      webAudioCtxRef.current = ctx
      unwindMasterGainRef.current = master

      // ==========================================
      // 2. Soft, delicate distant bird chirps
      // ==========================================
      const scheduleNextBirdChirp = () => {
        if (!webAudioCtxRef.current || webAudioCtxRef.current.state === 'closed') return

        const delay = 4000 + Math.random() * 4500 // Every 4 to 8.5 seconds
        birdTimerRef.current = setTimeout(() => {
          playGentleBirdCall(ctx, master)
          scheduleNextBirdChirp()
        }, delay)
      }

      scheduleNextBirdChirp()
    } catch {
      // AudioContext unavailable
    }
  }

  // Synthesis of an authentic, gentle distant songbird chirp
  const playGentleBirdCall = (ctx: AudioContext, destination: GainNode) => {
    if (ctx.state === 'suspended') return

    const now = ctx.currentTime
    const notes = [
      { f1: 2400 + Math.random() * 200, f2: 2900 + Math.random() * 300, start: 0, dur: 0.12 },
      { f1: 2700 + Math.random() * 200, f2: 3200 + Math.random() * 300, start: 0.15, dur: 0.14 },
    ]

    notes.forEach((note) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'

      const startTime = now + note.start
      osc.frequency.setValueAtTime(note.f1, startTime)
      osc.frequency.exponentialRampToValueAtTime(note.f2, startTime + note.dur * 0.6)
      osc.frequency.exponentialRampToValueAtTime(note.f1 * 0.95, startTime + note.dur)

      gain.gain.setValueAtTime(0.0001, startTime)
      gain.gain.linearRampToValueAtTime(0.075, startTime + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + note.dur)

      osc.connect(gain)
      gain.connect(destination)

      osc.start(startTime)
      osc.stop(startTime + note.dur + 0.02)
    })
  }

  // Explore Audio Transitions
  useEffect(() => {
    const audio = exploreAudioRef.current
    if (!audio) return

    const shouldPlay = mode === 'explore' && !isMuted

    if (shouldPlay) {
      audio.play().catch(() => {})
      let vol = audio.volume
      const timer = setInterval(() => {
        if (vol < 0.32) {
          vol = Math.min(0.32, +(vol + 0.04).toFixed(2))
          audio.volume = vol
        } else {
          clearInterval(timer)
        }
      }, 50)
      return () => clearInterval(timer)
    } else {
      let vol = audio.volume
      const timer = setInterval(() => {
        if (vol > 0.03) {
          vol = Math.max(0, +(vol - 0.05).toFixed(2))
          audio.volume = vol
        } else {
          audio.volume = 0
          audio.pause()
          clearInterval(timer)
        }
      }, 40)
      return () => clearInterval(timer)
    }
  }, [mode, isMuted])

  // Unwind Audio Transitions (Slow wind + sweet bird chirps)
  useEffect(() => {
    const shouldPlay = mode === 'unwind' && !isMuted

    if (shouldPlay) {
      ensureUnwindSoundscape()
      if (webAudioCtxRef.current && unwindMasterGainRef.current) {
        if (webAudioCtxRef.current.state === 'suspended') {
          webAudioCtxRef.current.resume().catch(() => {})
        }
        unwindMasterGainRef.current.gain.linearRampToValueAtTime(
          0.32,
          webAudioCtxRef.current.currentTime + 1.2
        )
      }
    } else {
      if (webAudioCtxRef.current && unwindMasterGainRef.current) {
        unwindMasterGainRef.current.gain.linearRampToValueAtTime(
          0.0001,
          webAudioCtxRef.current.currentTime + 0.8
        )
      }
    }
  }, [mode, isMuted])

  return null
}