'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { useAuthStore } from '@/state/auth-store'

interface ProductStop {
  id: string
  number: string
  eyebrow: string
  title: string
  subhead: string
  body: string
  supportLine?: string
  imageSrc: string
  imageAlt: string
  layout: 'image-left' | 'image-right'
  doodleType: 'house' | 'sleep' | 'tunnel' | 'ball' | 'flower' | 'face'
}

const STOPS: ProductStop[] = [
  {
    id: 'stop-01',
    number: '01',
    eyebrow: 'THE WHOLE LITTLE WORLD',
    title: 'The Complete CANOPY',
    subhead: 'Meet CANOPY.',
    body: 'One thoughtfully designed space that brings rest, discovery and independent play together. A little world where dogs can follow their own rhythm.',
    supportLine: 'One home. Many little adventures.',
    imageSrc: '/canopy-main-view.png',
    imageAlt: 'The complete CANOPY all-in-one retreat and adventure structure',
    layout: 'image-left',
    doodleType: 'house',
  },
  {
    id: 'stop-02',
    number: '02',
    eyebrow: "WHEN IT'S TIME TO SLOW DOWN",
    title: 'The Retreat',
    subhead: 'A cosy corner of their own.',
    body: 'A sheltered den, soft bedding and a familiar little hideaway. A comfortable place to pause, settle in and enjoy some quiet time.',
    imageSrc: '/canopy-retreat.png',
    imageAlt: 'CANOPY cozy wooden shelter den with soft warm bed and lantern',
    layout: 'image-right',
    doodleType: 'sleep',
  },
  {
    id: 'stop-03',
    number: '03',
    eyebrow: 'FOR LITTLE EXPLORERS',
    title: 'The Crawl Tunnel',
    subhead: 'A little adventure around the corner.',
    body: 'The crawl-through tunnel adds another way to discover the space. A playful passage for curious noses, little paws and everyday exploration.',
    imageSrc: '/canopy-crawl-tunnel.png',
    imageAlt: 'CANOPY round crawl tunnel passage with floral motif',
    layout: 'image-left',
    doodleType: 'tunnel',
  },
  {
    id: 'stop-04',
    number: '04',
    eyebrow: 'UP, OVER AND AROUND',
    title: 'The Play Deck',
    subhead: 'Room to climb, play and discover.',
    body: 'The elevated deck brings different activity areas together, giving dogs more ways to move around, explore and engage at their own pace.',
    imageSrc: '/canopy-playdeck.png',
    imageAlt: 'Elevated wooden play deck with sun canopy and hanging enrichment toys',
    layout: 'image-right',
    doodleType: 'ball',
  },
  {
    id: 'stop-05',
    number: '05',
    eyebrow: 'STOP AND SNIFF',
    title: 'The Sensory Planter',
    subhead: 'A garden of little discoveries.',
    body: 'Flowers, greenery and interesting textures add another layer to the experience. A little invitation to pause, sniff and explore.',
    imageSrc: '/canopy-sensory-planter.png',
    imageAlt: 'Built-in garden planter with pet-safe blooming flowers and greenery',
    layout: 'image-left',
    doodleType: 'flower',
  },
  {
    id: 'stop-06',
    number: '06',
    eyebrow: 'MADE FOR CURIOUS PAWS',
    title: 'The Steps & Climbs',
    subhead: 'Every step has something to discover.',
    body: 'Thoughtful activity details invite dogs to investigate, navigate and interact. Small moments of discovery, built right into their space.',
    imageSrc: '/canopy-steps.png',
    imageAlt: 'Activity ramps with textured blue climbing steps and interactive sensory buttons',
    layout: 'image-right',
    doodleType: 'face',
  },
]

type Flourish =
  | { kind: 'loops'; count: number }
  | { kind: 'waves'; cycles: number }
  | { kind: 'bigLoop'; at: number }

interface RouteVertex {
  x: number
  y: number
  flourish?: Flourish
}

const ROUTE: RouteVertex[] = [
  { x: 500, y: 40 },
  { x: 500, y: 200 },
  { x: 760, y: 200 },
  { x: 760, y: 780, flourish: { kind: 'loops', count: 3 } },
  { x: 240, y: 780 },
  { x: 240, y: 1420, flourish: { kind: 'waves', cycles: 2 } },
  { x: 760, y: 1420 },
  { x: 760, y: 2060, flourish: { kind: 'loops', count: 3 } },
  { x: 240, y: 2060 },
  { x: 240, y: 2700, flourish: { kind: 'waves', cycles: 2 } },
  { x: 760, y: 2700 },
  { x: 760, y: 3340, flourish: { kind: 'loops', count: 3 } },
  { x: 240, y: 3340 },
  { x: 240, y: 3820, flourish: { kind: 'waves', cycles: 2 } },
  { x: 500, y: 3820 },
  { x: 500, y: 3950 },
]

const ROUTE_H = 3950

function buildSmoothPath(w: number, h: number): string {
  if (w <= 0 || h <= 0) return ''
  const sx = (x: number) => (x / 1000) * w
  const sy = (y: number) => (y / ROUTE_H) * h

  const R = Math.max(24, Math.min(60, w * 0.05))
  const loopR = Math.max(16, Math.min(26, w * 0.022))
  const waveA = Math.max(22, Math.min(36, w * 0.03))

  const pts: { x: number; y: number }[] = []
  const push = (px: number, py: number) => {
    const last = pts[pts.length - 1]
    if (!last || Math.hypot(last.x - px, last.y - py) > 0.5) {
      pts.push({ x: px, y: py })
    }
  }

  for (let i = 0; i < ROUTE.length - 1; i++) {
    const A = { x: sx(ROUTE[i].x), y: sy(ROUTE[i].y) }
    const B = { x: sx(ROUTE[i + 1].x), y: sy(ROUTE[i + 1].y) }
    const dx = B.x - A.x
    const dy = B.y - A.y
    const isHoriz = Math.abs(dx) > Math.abs(dy)
    const flourish = ROUTE[i].flourish

    if (i === 0) push(A.x, A.y)

    const prev = i > 0 ? { x: sx(ROUTE[i - 1].x), y: sy(ROUTE[i - 1].y) } : null
    const next =
      i + 2 < ROUTE.length
        ? { x: sx(ROUTE[i + 2].x), y: sy(ROUTE[i + 2].y) }
        : null

    const cornerStart = prev
      ? Math.min(R, Math.hypot(dx, dy) * 0.45)
      : 0
    const cornerEnd = next
      ? Math.min(R, Math.hypot(dx, dy) * 0.45)
      : 0

    if (!flourish) {
      const segLen = Math.hypot(dx, dy)
      const udx = dx / segLen
      const udy = dy / segLen
      const p1 = { x: A.x + udx * cornerStart, y: A.y + udy * cornerStart }
      const p2 = { x: B.x - udx * cornerEnd, y: B.y - udy * cornerEnd }

      push(p1.x, p1.y)
      push(p2.x, p2.y)
    } else if (flourish.kind === 'loops' && isHoriz) {
      const dir = Math.sign(dx)
      const loopsW = flourish.count * loopR * 2
      const totalW = Math.abs(dx)
      const mid = A.x + dx * 0.5
      const loopsStart = mid - (loopsW / 2) * dir
      const loopsEnd = mid + (loopsW / 2) * dir

      push(A.x + dir * cornerStart, A.y)
      push(loopsStart, A.y)

      for (let k = 0; k < flourish.count; k++) {
        const cX = loopsStart + dir * (k * loopR * 2 + loopR)
        const cY = A.y - loopR
        const N = 24
        for (let s = 0; s <= N; s++) {
          const t = (s / N) * Math.PI * 2
          const angle = Math.PI / 2 + dir * t
          push(cX + loopR * Math.cos(angle), cY + loopR * Math.sin(angle))
        }
      }

      push(loopsEnd, A.y)
      push(B.x - dir * cornerEnd, B.y)
    } else if (flourish.kind === 'waves' && isHoriz) {
      const dir = Math.sign(dx)
      const waveSpan = Math.abs(dx) - cornerStart - cornerEnd
      const startX = A.x + dir * cornerStart
      const N = 40 * flourish.cycles

      push(startX, A.y)
      for (let s = 1; s <= N; s++) {
        const u = s / N
        const curX = startX + dir * waveSpan * u
        const curY = A.y - waveA * Math.sin(u * flourish.cycles * Math.PI * 2)
        push(curX, curY)
      }
      push(B.x - dir * cornerEnd, B.y)
    }

    if (next) {
      const ndx = next.x - B.x
      const ndy = next.y - B.y
      const nlen = Math.hypot(ndx, ndy)
      const nudx = ndx / nlen
      const nudy = ndy / nlen

      const segLen = Math.hypot(dx, dy)
      const udx = dx / segLen
      const udy = dy / segLen

      const cIn = { x: B.x - udx * cornerEnd, y: B.y - udy * cornerEnd }
      const cOut = { x: B.x + nudx * cornerEnd, y: B.y + nudy * cornerEnd }

      push(cIn.x, cIn.y)
      const STEPS = 12
      for (let s = 1; s < STEPS; s++) {
        const t = s / STEPS
        const qx = (1 - t) * (1 - t) * cIn.x + 2 * (1 - t) * t * B.x + t * t * cOut.x
        const qy = (1 - t) * (1 - t) * cIn.y + 2 * (1 - t) * t * B.y + t * t * cOut.y
        push(qx, qy)
      }
      push(cOut.x, cOut.y)
    } else {
      push(B.x, B.y)
    }
  }

  if (pts.length < 2) return ''
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`
  for (let i = 1; i < pts.length; i++) {
    d += ` L ${pts[i].x.toFixed(1)} ${pts[i].y.toFixed(1)}`
  }
  return d
}

function SectionDoodle({
  type,
  className = '',
}: {
  type: ProductStop['doodleType']
  className?: string
}) {
  const stroke = '#82C2E5'
  const fill = '#E6F3FA'

  switch (type) {
    case 'house':
      return (
        <svg
          viewBox="0 0 44 44"
          className={className}
          fill="none"
          stroke={stroke}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M 6 20 L 22 8 L 38 20 L 38 38 L 6 38 Z" fill={fill} />
          <path d="M 17 38 L 17 26 L 27 26 L 27 38" />
          <circle cx="22" cy="18" r="2.5" fill={stroke} />
        </svg>
      )
    case 'sleep':
      return (
        <svg
          viewBox="0 0 44 44"
          className={className}
          fill="none"
          stroke={stroke}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M 12 14 Q 18 10 24 14 Q 18 18 12 14 Z" fill={fill} />
          <path d="M 22 22 L 32 22 L 24 32 L 34 32" strokeWidth="2.8" />
          <path d="M 10 26 L 16 26 L 12 32 L 18 32" strokeWidth="2" />
        </svg>
      )
    case 'tunnel':
      return (
        <svg
          viewBox="0 0 44 44"
          className={className}
          fill="none"
          stroke={stroke}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <ellipse cx="22" cy="22" rx="16" ry="12" fill={fill} />
          <ellipse cx="22" cy="22" rx="9" ry="6" strokeDasharray="3 3" />
          <path d="M 6 22 L 38 22" strokeDasharray="2 3" />
        </svg>
      )
    case 'ball':
      return (
        <svg
          viewBox="0 0 44 44"
          className={className}
          fill="none"
          stroke={stroke}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="22" cy="22" r="14" fill={fill} />
          <path d="M 12 14 Q 22 22 32 14" />
          <path d="M 12 30 Q 22 22 32 30" />
        </svg>
      )
    case 'flower':
      return (
        <svg
          viewBox="0 0 44 44"
          className={className}
          fill="none"
          stroke={stroke}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="22" cy="22" r="4" fill={stroke} />
          <circle cx="22" cy="14" r="4" fill={fill} />
          <circle cx="30" cy="22" r="4" fill={fill} />
          <circle cx="22" cy="30" r="4" fill={fill} />
          <circle cx="14" cy="22" r="4" fill={fill} />
        </svg>
      )
    case 'face':
      return (
        <svg
          viewBox="0 0 44 44"
          className={className}
          fill="none"
          stroke={stroke}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="22" cy="22" r="15" fill={fill} />
          <circle cx="17" cy="19" r="1.8" fill={stroke} />
          <circle cx="27" cy="19" r="1.8" fill={stroke} />
          <path d="M 16 26 Q 22 31 28 26" />
        </svg>
      )
  }
}

export function ProductJourney() {
  const router = useRouter()
  const sectionRef = useRef<HTMLElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const prefersReduced = useReducedMotion()

  const user = useAuthStore((state) => state.user)
  const openSignIn = useAuthStore((state) => state.openSignIn)

  const handleShopNow = () => {
    if (user) {
      router.push('/shop')
    } else {
      if (typeof window !== 'undefined') {
        localStorage.setItem('canopy-auth-redirect', '/shop')
      }
      openSignIn()
    }
  }

  const [svgSize, setSvgSize] = useState<{ w: number; h: number }>({
    w: 1200,
    h: 4200,
  })

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry) {
        setSvgSize({
          w: entry.contentRect.width,
          h: entry.contentRect.height,
        })
      }
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const pathD = useMemo(
    () => buildSmoothPath(svgSize.w, svgSize.h),
    [svgSize.w, svgSize.h],
  )

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start center', 'end end'],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 18,
    restDelta: 0.001,
  })

  const [pathTotalLen, setPathTotalLen] = useState(1)
  useEffect(() => {
    if (pathRef.current) {
      try {
        const l = pathRef.current.getTotalLength()
        if (l > 0) setPathTotalLen(l)
      } catch {}
    }
  }, [pathD])

  const [pawPos, setPawPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

  useEffect(() => {
    if (prefersReduced) return
    const unsub = smoothProgress.on('change', (latest) => {
      const el = pathRef.current
      if (!el) return
      try {
        const len = el.getTotalLength()
        if (len > 0) {
          const clamped = Math.max(0, Math.min(1, latest))
          const pt = el.getPointAtLength(clamped * len)
          setPawPos({ x: pt.x, y: pt.y })
        }
      } catch {}
    })
    return () => unsub()
  }, [smoothProgress, prefersReduced, pathD])

  const strokeDashoffset = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 18,
  })
  const [dashOffsetVal, setDashOffsetVal] = useState(0)
  useEffect(() => {
    const unsub = strokeDashoffset.on('change', (v) => {
      setDashOffsetVal((1 - Math.max(0, Math.min(1, v))) * pathTotalLen)
    })
    return () => unsub()
  }, [strokeDashoffset, pathTotalLen])

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-[#FFF8EF] py-20 sm:py-28 lg:py-36"
    >
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative z-20 mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full bg-[#EAF5FC] px-4 py-1 text-xs font-bold tracking-[0.18em] text-[#3399D4] [font-family:var(--font-fredoka)]">
            MEET YOUR DOG&apos;S LITTLE WORLD
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#4A3E39] sm:text-4xl md:text-5xl [font-family:var(--font-fredoka)]">
            One little space.{' '}
            <span className="text-[#82C2E5]">So many ways to be a dog.</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#6E5D53] sm:text-lg">
            From a cosy corner to curious little adventures, every part of
            CANOPY is designed around their freedom to explore, rest and choose.
          </p>
        </div>

        <div
          className="pointer-events-none absolute inset-0 z-0 select-none"
          aria-hidden="true"
        >
          <svg
            className="h-full w-full overflow-visible"
            style={{ width: svgSize.w, height: svgSize.h }}
          >
            {pathD && (
              <path
                d={pathD}
                fill="none"
                stroke="#D6ECFA"
                strokeWidth={17}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.7}
              />
            )}

            {pathD && (
              <path
                ref={pathRef}
                d={pathD}
                fill="none"
                stroke="#82C2E5"
                strokeWidth={11}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={pathTotalLen}
                strokeDashoffset={prefersReduced ? 0 : dashOffsetVal}
                style={{
                  filter: 'drop-shadow(0 2px 5px rgba(130, 194, 229, 0.45))',
                }}
              />
            )}
          </svg>

          {!prefersReduced && (
            <motion.div
              className="absolute left-0 top-0 z-10 -ml-5 -mt-5 flex h-10 w-10 items-center justify-center pointer-events-none"
              style={{
                x: pawPos.x,
                y: pawPos.y,
              }}
            >
              <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-[0_4px_12px_rgba(74,62,57,0.18)] border border-[#82C2E5]/40">
                <svg
                  className="h-5 w-5 text-[#8D6853]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <ellipse cx="6" cy="6" rx="2" ry="2.8" />
                  <ellipse cx="11" cy="4.5" rx="2" ry="3" />
                  <ellipse cx="16" cy="5" rx="2" ry="3" />
                  <ellipse cx="20" cy="7.5" rx="2" ry="2.7" />
                  <path d="M8 12 C5 12 4 16 6 19 C8 22 16 22 18 19 C20 16 19 12 16 12 C14 11 10 11 8 12 Z" />
                </svg>
              </div>
            </motion.div>
          )}
        </div>

        <div className="relative z-10 mt-16 space-y-28 sm:mt-24 sm:space-y-36 lg:space-y-44">
          {STOPS.map((stop, index) => {
            const isLeft = stop.layout === 'image-left'

            return (
              <div
                key={stop.id}
                className={`relative flex flex-col items-center gap-8 md:gap-14 ${
                  isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                <div className="relative w-full md:w-1/2 flex justify-center">
                  <div className="group relative w-full max-w-md">
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[28px] border-4 border-white/90 bg-white/60 shadow-[0_12px_36px_rgba(60,45,35,0.08)] transition-transform duration-500 ease-out group-hover:scale-[1.015]">
                      <Image
                        src={stop.imageSrc}
                        alt={stop.imageAlt}
                        fill
                        sizes="(max-width: 768px) 90vw, 480px"
                        className="object-cover"
                        priority={index === 0}
                      />
                    </div>
                  </div>
                </div>

                <div className="relative w-full md:w-1/2">
                  <div
                    className={`flex flex-col ${
                      isLeft ? 'md:items-start md:text-left' : 'md:items-end md:text-right'
                    } text-center items-center`}
                  >
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 shadow-xs border border-[#F2E5D5]">
                      <SectionDoodle type={stop.doodleType} className="h-4 w-4" />
                      <span className="text-[11px] font-bold tracking-widest text-[#82C2E5] [font-family:var(--font-fredoka)]">
                        PART {stop.number}
                      </span>
                    </div>

                    <span className="mt-3 text-xs font-bold tracking-wider text-[#9E8779] uppercase">
                      {stop.eyebrow}
                    </span>

                    <h3 className="mt-1 text-2xl sm:text-3xl font-extrabold text-[#4A3E39] [font-family:var(--font-fredoka)]">
                      {stop.title}
                    </h3>

                    <h4 className="mt-1 text-base sm:text-lg font-semibold text-[#82C2E5] [font-family:var(--font-fredoka)]">
                      {stop.subhead}
                    </h4>

                    <p className="mt-3 max-w-md text-sm sm:text-base leading-relaxed text-[#6E5D53]">
                      {stop.body}
                    </p>

                    {stop.supportLine && (
                      <p className="mt-3 text-xs sm:text-sm font-semibold italic text-[#82C2E5]">
                        {stop.supportLine}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="mt-20 sm:mt-28 flex flex-col items-center text-center max-w-2xl mx-auto rounded-[32px] border border-white/80 bg-white/70 backdrop-blur-xs p-8 sm:p-10 shadow-[0_16px_40px_rgba(50,40,30,0.06)]"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#82C2E5] text-white shadow-sm mb-4">
            <svg
              className="h-6 w-6 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <ellipse cx="6" cy="6" rx="2" ry="2.8" />
              <ellipse cx="11" cy="4.5" rx="2" ry="3" />
              <ellipse cx="16" cy="5" rx="2" ry="3" />
              <ellipse cx="20" cy="7.5" rx="2" ry="2.7" />
              <path d="M8 12 C5 12 4 16 6 19 C8 22 16 22 18 19 C20 16 19 12 16 12 C14 11 10 11 8 12 Z" />
            </svg>
          </div>

          <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#4A3E39] [font-family:var(--font-fredoka)]">
            All the little things. One happy little world.
          </h3>

          <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#5C4E46]/90 font-medium max-w-lg">
            That&apos;s CANOPY — a space designed around the simple joy of being
            a dog.
          </p>

          <motion.button
            type="button"
            whileHover={{ y: -2, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleShopNow}
            aria-haspopup="dialog"
            className="group relative mt-6 inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-[#3399D4] px-8 py-3.5 text-base sm:text-lg font-bold text-white shadow-[0_8px_24px_rgba(51,153,212,0.35)] transition-all duration-300 hover:bg-[#2A86BC] hover:shadow-[0_12px_30px_rgba(51,153,212,0.5)] [font-family:var(--font-fredoka)] cursor-pointer"
          >
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <span>Shop Now</span>
            <span
              className="inline-block transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            >
              <svg
                className="h-4 w-4 sm:h-5 sm:w-5 stroke-[2.8]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}