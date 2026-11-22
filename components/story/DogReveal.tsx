'use client'

import Image from 'next/image'
import { useRef } from 'react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { canopyAssets } from '@/lib/assets'

export function DogReveal() {
  const containerRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Stage A: small dog peeks in from the right.
  const peekX = useTransform(
    scrollYProgress,
    [0.02, 0.17],
    ['85%', '0%'],
  )

  const peekOpacity = useTransform(
    scrollYProgress,
    [0, 0.04, 0.19, 0.27],
    [0, 1, 1, 0],
  )

  // Stage B/C: approach and approved close-up.
  const closeupOpacity = useTransform(
    scrollYProgress,
    [0.20, 0.30, 0.57, 0.67],
    [0, 1, 1, 0],
  )

  const closeupScale = useTransform(
    scrollYProgress,
    [0.22, 0.44],
    [0.84, 1],
  )

  const closeupY = useTransform(
    scrollYProgress,
    [0.22, 0.44],
    [115, 90],
  )

  // First speech bubble.
  const bubble1Opacity = useTransform(
    scrollYProgress,
    [0.40, 0.46, 0.56, 0.63],
    [0, 1, 1, 0],
  )

  const bubble1Scale = useTransform(
    scrollYProgress,
    [0.40, 0.46],
    [0.94, 1],
  )

  // Signature-blue transition.
  const blueOpacity = useTransform(
    scrollYProgress,
    [0.59, 0.70],
    [0, 1],
  )

  // Final sitting dog and brand story.
  const sittingOpacity = useTransform(
    scrollYProgress,
    [0.62, 0.72],
    [0, 1],
  )

  const sittingEnterY = useTransform(
    scrollYProgress,
    [0.62, 0.72],
    [30, 0],
  )

  // Headline text entrance.
  const headlineOpacity = useTransform(
    scrollYProgress,
    [0.64, 0.74],
    [0, 1],
  )

  const headlineY = useTransform(
    scrollYProgress,
    [0.64, 0.74],
    [24, 0],
  )

  // Speech bubble entrance.
  const bubble2Opacity = useTransform(
    scrollYProgress,
    [0.70, 0.80],
    [0, 1],
  )

  const bubble2Y = useTransform(
    scrollYProgress,
    [0.70, 0.80],
    [18, 0],
  )

  // Tagline entrance.
  const taglineOpacity = useTransform(
    scrollYProgress,
    [0.76, 0.86],
    [0, 1],
  )

  // Subtle parallax for the settled brand-story section.
  const dogParallaxY = useTransform(
    scrollYProgress,
    [0.80, 1],
    [0, -25],
  )

  const textParallaxY = useTransform(
    scrollYProgress,
    [0.80, 1],
    [0, -40],
  )

  const sittingDogY = useTransform(
    [sittingEnterY, dogParallaxY],
    ([enter, parallax]) =>
      (enter as number) + (parallax as number),
  )

  const dogPeekSrc = canopyAssets.dogPeek?.src ?? '/dog-peek.png'
  const dogCloseupSrc =
    canopyAssets.dogCloseup?.src ?? '/dog-closeup.png'
  const dogSitSrc = canopyAssets.dogSit?.src ?? '/dog-sit.png'

  return (
    <section
    id="canopy-dog-reveal"
      ref={containerRef}
      className="relative h-[450vh] w-full"
      aria-label="CANOPY brand story"
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden select-none">

        {/* Signature blue fades over the existing assembled garden. */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-10 bg-[#82C2E5]"
          style={{ opacity: blueOpacity }}
        />

        {/* STAGE A: Small cinematic peek. */}
        <motion.div
          className="
            pointer-events-none absolute z-30
            bottom-3 right-2
            h-[155px] w-[145px]
            sm:bottom-5 sm:right-5
            sm:h-[205px] sm:w-[190px]
            md:h-[245px] md:w-[225px]
          "
          style={
            reducedMotion
              ? { opacity: peekOpacity }
              : {
                  x: peekX,
                  opacity: peekOpacity,
                }
          }
        >
          <Image
            src={dogPeekSrc}
            alt="A friendly golden puppy peeking into the garden"
            fill
            sizes="(max-width: 640px) 145px, (max-width: 1024px) 190px, 225px"
            className="object-contain object-right-bottom"
            priority
          />
        </motion.div>

        {/* STAGE B/C: Close-up with approved scale and lower position. */}
        <motion.div
          className="
            pointer-events-none absolute inset-0 z-[35]
            flex items-center justify-center
            p-2 sm:p-6
          "
          style={
            reducedMotion
              ? {
                  opacity: closeupOpacity,
                  y: 90,
                }
              : {
                  opacity: closeupOpacity,
                  scale: closeupScale,
                  y: closeupY,
                }
          }
        >
          <div className="
            relative
            h-[min(86svh,920px)]
            w-[min(94vw,1050px)]
          ">
            <Image
              src={dogCloseupSrc}
              alt="The friendly golden puppy up close"
              fill
              sizes="(max-width: 640px) 94vw, 1050px"
              className="object-contain object-center"
              priority
            />
          </div>
        </motion.div>

        {/* STAGE C: First speech bubble. */}
        <motion.div
          className="
            pointer-events-none absolute z-40
            left-1/2 top-[8%] w-[min(92vw,560px)]
            -translate-x-1/2 px-3 text-center
            sm:top-[10%]
          "
          style={
            reducedMotion
              ? { opacity: bubble1Opacity }
              : {
                  opacity: bubble1Opacity,
                  scale: bubble1Scale,
                }
          }
        >
          <div className="
            relative inline-block rounded-3xl
            border-2 border-white/70
            bg-[#FFF8EF] px-5 py-4
            shadow-[0_16px_40px_rgba(40,30,25,0.18)]
            sm:px-8 sm:py-5
          ">
            <p className="
              text-base font-bold leading-snug
              text-[#51443E]
              sm:text-xl md:text-2xl
              [font-family:var(--font-fredoka)]
            ">
              &ldquo;See? You could choose what you wanted.
              I want to be able to do that too.&rdquo;
            </p>

            <div className="
              absolute -bottom-2.5 left-1/2
              h-5 w-5 -translate-x-1/2 rotate-45
              border-b-2 border-r-2 border-white/70
              bg-[#FFF8EF]
            " />
          </div>
        </motion.div>

        {/* ================================================================
            STAGE E/F: THE CANOPY PROMISE — Mobile-Optimized Brand Story
            ================================================================ */}
        <div className="
          pointer-events-none absolute inset-0 z-30
          flex h-full w-full flex-col justify-between
          px-4 py-4 sm:px-6 sm:py-6 md:px-10 md:py-8 lg:px-16
        ">
          {/* Main Content Layout */}
          <div className="
            relative mx-auto flex h-full w-full max-w-[1400px]
            flex-col items-center justify-center gap-1.5
            sm:gap-3 md:flex-row md:items-end md:justify-center md:gap-0 md:pb-14 lg:pb-16
          ">

            {/* SITTING DOG + PEDESTAL */}
            <motion.div
              className="
                relative flex shrink-0 flex-col items-center
                md:mr-4 lg:mr-8
              "
              style={
                reducedMotion
                  ? { opacity: sittingOpacity }
                  : {
                      opacity: sittingOpacity,
                      y: sittingDogY,
                    }
              }
            >
              {/* Three little expression lines beside the dog's ear */}
              <div
                className="absolute right-0 top-[18%] z-20 sm:right-[-6px] sm:top-[15%] md:right-[-12px] md:top-[12%]"
                aria-hidden="true"
              >
                <div className="flex flex-col gap-[4px] sm:gap-[6px]">
                  <div className="ml-0.5 h-[1.5px] w-[8px] rounded-full bg-white/75 sm:h-[2px] sm:w-[14px] md:w-[16px]" style={{ transform: 'rotate(-30deg)' }} />
                  <div className="h-[1.5px] w-[12px] rounded-full bg-white/85 sm:h-[2px] sm:w-[18px] md:w-[22px]" style={{ transform: 'rotate(-12deg)' }} />
                  <div className="ml-0.5 h-[1.5px] w-[8px] rounded-full bg-white/75 sm:h-[2px] sm:w-[14px] md:w-[16px]" style={{ transform: 'rotate(8deg)' }} />
                </div>
              </div>

              {/* Sitting Puppy: Scaled comfortably for mobile screen heights */}
              <div className="
                relative z-10
                h-[145px] w-[125px]
                sm:h-[210px] sm:w-[175px]
                md:h-[min(68svh,480px)] md:w-[min(57svh,400px)]
                lg:h-[min(76svh,580px)] lg:w-[min(63svh,485px)]
              ">
                <Image
                  src={dogSitSrc}
                  alt="The golden puppy sitting happily"
                  fill
                  sizes="(max-width: 640px) 125px, (max-width: 1024px) 210px, 485px"
                  className="object-contain object-bottom"
                  priority
                />
              </div>

              {/* Pedestal mat */}
              <div
                className="
                  -mt-3 z-0
                  h-[14px] w-[130px]
                  sm:-mt-4 sm:h-[20px] sm:w-[190px]
                  md:-mt-6 md:h-[30px] md:w-[320px]
                  lg:h-[34px] lg:w-[380px]
                  rounded-[100%] bg-[#FFF8EF]/80
                  shadow-[0_4px_16px_rgba(20,50,85,0.05)]
                "
                aria-hidden="true"
              />
            </motion.div>

            {/* HEADLINE + SPEECH BUBBLE COLUMN */}
            <div className="
              flex flex-col items-center text-center
              md:items-start md:text-left md:self-center
              md:max-w-[55%] lg:max-w-[50%]
            ">

              {/* Subtitle row with clean horizontal rule */}
              <motion.div
                className="mb-1 flex w-full items-center justify-center gap-2 sm:mb-2.5 md:mb-4 md:justify-start md:gap-4"
                style={
                  reducedMotion
                    ? { opacity: headlineOpacity }
                    : {
                        opacity: headlineOpacity,
                        y: headlineY,
                      }
                }
              >
                <p className="
                  shrink-0 text-[9px] font-bold uppercase tracking-[0.18em]
                  text-white/80
                  sm:text-[11px] sm:tracking-[0.22em]
                  [font-family:var(--font-fredoka)]
                ">
                  The Canopy Promise
                </p>
                <div className="h-[1px] w-12 sm:w-20 md:w-auto md:grow rounded-full bg-white/35" aria-hidden="true" />
              </motion.div>

              {/* Two-tone headline with responsive mobile font size */}
              <motion.div
                style={
                  reducedMotion
                    ? { opacity: headlineOpacity }
                    : {
                        opacity: headlineOpacity,
                        y: headlineY,
                      }
                }
              >
                <h2 className="
                  text-[19px] font-extrabold leading-[1.1]
                  sm:text-[28px]
                  md:text-[40px]
                  lg:text-[50px]
                  xl:text-[56px]
                  [font-family:var(--font-fredoka)]
                ">
                  <span className="text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.05)]">
                    A little space.
                  </span>
                  <br />
                  <span className="text-[#FFF0D4] drop-shadow-[0_2px_6px_rgba(0,0,0,0.04)]">
                    A whole lot of
                  </span>
                  <br />
                  <span className="text-[#FFF0D4] drop-shadow-[0_2px_6px_rgba(0,0,0,0.04)]">
                    personality.
                  </span>
                </h2>
              </motion.div>

              {/* Speech bubble: Clean responsive padding without viewport cutoff */}
              <motion.div
                className="
                  relative mt-2 sm:mt-4 md:mt-7
                  w-full max-w-[290px] sm:max-w-[360px] md:max-w-[450px]
                "
                style={
                  reducedMotion
                    ? { opacity: bubble2Opacity }
                    : {
                        opacity: bubble2Opacity,
                        y: bubble2Y,
                      }
                }
              >
                <div className="
                  relative rounded-[18px] sm:rounded-[24px]
                  bg-[#FFF5E6] px-4 py-2.5 sm:px-6 sm:py-3.5 md:px-8 md:py-4.5
                  shadow-[0_8px_24px_rgba(20,50,85,0.08)]
                ">
                  <p className="
                    text-sm font-bold leading-snug
                    text-[#51443E]
                    sm:text-lg md:text-2xl lg:text-[26px]
                    [font-family:var(--font-fredoka)]
                  ">
                    &ldquo;That&rsquo;s why I need CANOPY.&rdquo;
                  </p>

                  {/* Tail pointing left toward the dog on desktop */}
                  <div
                    className="
                      absolute -left-2.5 top-1/2 -translate-y-1/2 hidden md:block
                      h-0 w-0
                      border-y-[9px] border-y-transparent
                      border-r-[13px] border-r-[#FFF5E6]
                    "
                    aria-hidden="true"
                  />
                </div>
              </motion.div>
            </div>
          </div>

          {/* BOTTOM TAGLINE: Flows naturally on mobile, pins on desktop */}
          <motion.div
            className="
              relative z-40 mt-1 flex shrink-0 items-center justify-center gap-2 pb-1
              sm:gap-3
              md:absolute md:bottom-3 md:left-1/2 md:mt-0 md:-translate-x-1/2 md:pb-0
            "
            style={
              reducedMotion
                ? { opacity: taglineOpacity }
                : {
                    opacity: taglineOpacity,
                    y: textParallaxY,
                  }
            }
          >
            <span className="
              rounded-md border border-white/40
              bg-white/15 px-2 py-0.5
              text-[9px] font-bold uppercase tracking-[0.16em]
              text-white
              sm:px-3 sm:py-1 sm:text-xs sm:tracking-[0.18em]
              [font-family:var(--font-fredoka)]
            ">
              CANOPY
            </span>

            {/* Vertical separator */}
            <div className="h-3.5 w-[1px] bg-white/40 sm:h-4.5" aria-hidden="true" />

            <p className="
              text-[11px] font-medium text-white/90
              sm:text-sm md:text-base
              [font-family:var(--font-fredoka)]
            ">
              A little space to be a dog.
            </p>
          </motion.div>
        </div>

      </div>
    </section>
  )
}