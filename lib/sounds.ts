import { useCanopyStore } from '@/state/canopy-store'

export type SoundEffectType =
  | 'butterfly'
  | 'blossom_breeze'
  | 'sunrays'
  | 'droplet_rain'
  | 'dandelion_puff'
  | 'bunny_peek'
  | 'bunny_hop'
  | 'ladybug_fly'

let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (AudioContextClass) {
      audioCtx = new AudioContextClass()
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {})
  }
  return audioCtx
}

export function playSound(type: SoundEffectType) {
  const isMuted = useCanopyStore.getState().isMuted
  if (isMuted) return

  const ctx = getAudioContext()
  if (!ctx) return

  const now = ctx.currentTime

  switch (type) {
    // Golden magical butterfly celebration: Ascending celestial pentatonic chimes
    case 'butterfly': {
      const notes = [659.25, 830.61, 987.77, 1318.51, 1661.22] // E5, G#5, B5, E6, G#6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, now + idx * 0.08)
        gain.gain.setValueAtTime(0, now + idx * 0.08)
        gain.gain.linearRampToValueAtTime(0.14, now + idx * 0.08 + 0.02)
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.6)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now + idx * 0.08)
        osc.stop(now + idx * 0.08 + 0.65)
      })
      break
    }

    // Flower 1: Cherry Blossom Breeze: Airy rustle and delicate chime
    case 'blossom_breeze': {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(880, now)
      osc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.4)
      gain.gain.setValueAtTime(0.12, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 0.95)
      break
    }

    // Flower 2: Radiant Sunburst: Warm shimmering harmonic triad
    case 'sunrays': {
      const chord = [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6
      chord.forEach((freq) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(freq, now)
        gain.gain.setValueAtTime(0, now)
        gain.gain.linearRampToValueAtTime(0.08, now + 0.1)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now)
        osc.stop(now + 1.25)
      })
      break
    }

    // Flower 3: Spring Rain: 4 light, crystalline water droplets
    case 'droplet_rain': {
      const drops = [1500, 1320, 1650, 1420]
      drops.forEach((freq, idx) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        const start = now + idx * 0.11
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, start)
        osc.frequency.exponentialRampToValueAtTime(freq * 0.6, start + 0.08)
        gain.gain.setValueAtTime(0.15, start)
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.09)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(start)
        osc.stop(start + 0.1)
      })
      break
    }

    // Dandelion puff: Airy breath whoosh + tiny sparkle
    case 'dandelion_puff': {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(320, now)
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.45)
      gain.gain.setValueAtTime(0.18, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 0.55)
      break
    }

    // Bunny peek: Playful, gentle wooden "pop!"
    case 'bunny_peek': {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(420, now)
      osc.frequency.exponentialRampToValueAtTime(680, now + 0.08)
      gain.gain.setValueAtTime(0.2, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 0.1)
      break
    }

    // Bunny hop: Two-tone cheerful hop bounce
    case 'bunny_hop': {
      const hops = [
        { freq: 330, delay: 0 },
        { freq: 520, delay: 0.14 },
      ]
      hops.forEach(({ freq, delay }) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        const start = now + delay
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, start)
        osc.frequency.exponentialRampToValueAtTime(freq * 1.6, start + 0.1)
        gain.gain.setValueAtTime(0.22, start)
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.14)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(start)
        osc.stop(start + 0.15)
      })
      break
    }

    // Ladybug liftoff: Quick delicate flutter chirp with upward pitch
    case 'ladybug_fly': {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(580, now)
      osc.frequency.exponentialRampToValueAtTime(980, now + 0.25)
      gain.gain.setValueAtTime(0.16, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 0.38)
      break
    }
  }
}