'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { CanopyHeader } from '@/components/layout/CanopyHeader'
import { AuthSessionSync } from '@/components/auth/AuthSessionSync'
import { SignInModal } from '@/components/auth/SignInModal'
import { useCartStore } from '@/state/cart-store'

// Centralized pricing configuration
export const PRODUCT_PRICE = 35000
export const PRODUCT_CURRENCY = '₹'
export const PRODUCT_PRICE_LABEL = '₹35,000'

// 6 Selectable Colourways
interface Colourway {
  id: string
  name: string
  hex: string
  image: string
}

const COLOURWAYS: Colourway[] = [
  {
    id: 'signature-blue',
    name: 'Signature Blue',
    hex: '#82C2E5',
    image: '/canopy-blue.png',
  },
  {
    id: 'warm-red',
    name: 'Warm Red',
    hex: '#E06D53',
    image: '/canopy-red.png',
  },
  {
    id: 'pastel-green',
    name: 'Pastel Green',
    hex: '#88B896',
    image: '/canopy-pastel-green.png',
  },
  {
    id: 'blossom-pink',
    name: 'Blossom Pink',
    hex: '#EAA0B5',
    image: '/canopy-pink.png',
  },
  {
    id: 'sunshine-yellow',
    name: 'Sunshine Yellow',
    hex: '#F0C45B',
    image: '/canopy-yellow.png',
  },
  {
    id: 'soft-lilac',
    name: 'Soft Lilac',
    hex: '#B8A2CE',
    image: '/canopy-lilac.png',
  },
]

// 6 Product gallery perspectives mapped to all colour variations
interface GalleryImage {
  id: string
  label: string
  defaultSrc: string
  colorwayOverrides: Record<string, string>
}

const GALLERY_IMAGES: GalleryImage[] = [
  {
    id: 'overview',
    label: 'Complete CANOPY',
    defaultSrc: '/canopy-main-view.png',
    colorwayOverrides: {
      'signature-blue': '/canopy-blue.png',
      'warm-red': '/canopy-red.png',
      'pastel-green': '/canopy-pastel-green.png',
      'blossom-pink': '/canopy-pink.png',
      'sunshine-yellow': '/canopy-yellow.png',
      'soft-lilac': '/canopy-lilac.png',
    },
  },
  {
    id: 'retreat',
    label: 'The Retreat Den',
    defaultSrc: '/canopy-retreat.png',
    colorwayOverrides: {
      'signature-blue': '/canopy-retreat.png',
      'warm-red': '/canopy-retreat-red.png',
      'pastel-green': '/canopy-retreat-green.png',
      'blossom-pink': '/canopy-retreat-pink.png',
      'sunshine-yellow': '/canopy-retreat-yellow.png',
      'soft-lilac': '/canopy-retreat-lilac.png',
    },
  },
  {
    id: 'tunnel',
    label: 'Crawl Tunnel',
    defaultSrc: '/canopy-crawl-tunnel.png',
    colorwayOverrides: {
      'signature-blue': '/canopy-crawl-tunnel.png',
      'warm-red': '/canopy-crawl-tunnel-red.png',
      'pastel-green': '/canopy-crawl-tunnel-green.png',
      'blossom-pink': '/canopy-crawl-tunnel-pink.png',
      'sunshine-yellow': '/canopy-crawl-tunnel-yellow.png',
      'soft-lilac': '/canopy-crawl-tunnel-lilac.png',
    },
  },
  {
    id: 'playdeck',
    label: 'Play Deck',
    defaultSrc: '/canopy-playdeck.png',
    colorwayOverrides: {
      'signature-blue': '/canopy-playdeck.png',
      'warm-red': '/canopy-playdeck-red.png',
      'pastel-green': '/canopy-playdeck-green.png',
      'blossom-pink': '/canopy-playdeck-pink.png',
      'sunshine-yellow': '/canopy-playdeck-yellow.png',
      'soft-lilac': '/canopy-playdeck-lilac.png',
    },
  },
  {
    id: 'planter',
    label: 'Sensory Planter',
    defaultSrc: '/canopy-sensory-planter.png',
    colorwayOverrides: {
      'signature-blue': '/canopy-sensory-planter.png',
      'warm-red': '/canopy-sensory-planter-red.png',
      'pastel-green': '/canopy-sensory-planter-green.png',
      'blossom-pink': '/canopy-sensory-planter-pink.png',
      'sunshine-yellow': '/canopy-sensory-planter-yellow.png',
      'soft-lilac': '/canopy-sensory-planter-lilac.png',
    },
  },
  {
    id: 'steps',
    label: 'Activity Steps',
    defaultSrc: '/canopy-steps.png',
    colorwayOverrides: {
      'signature-blue': '/canopy-steps.png',
      'warm-red': '/canopy-steps-red.png',
      'pastel-green': '/canopy-steps-green.png',
      'blossom-pink': '/canopy-steps-pink.png',
      'sunshine-yellow': '/canopy-steps-yellow.png',
      'soft-lilac': '/canopy-steps-lilac.png',
    },
  },
]

type AccordionItem = {
  id: string
  title: string
  content?: string
  items?: string[]
  isSpecsTable?: boolean
}

const ACCORDIONS: AccordionItem[] = [
  {
    id: 'about',
    title: 'About CANOPY',
    content:
      'CANOPY is a proposed all-in-one dog retreat and enrichment space. It combines a sheltered resting den with a raised activity deck, crawl tunnel, ramps and a sensory planter. Dogs can choose to explore, play, pause or rest at their own pace. It is designed for comfort and enrichment, not as a treatment for separation anxiety or a substitute for supervision.',
  },
  {
    id: 'included',
    title: "What's included",
    items: [
      'Arched sleeping retreat with protective wooden canopy and soft front curtain',
      'Removable plush sleeping mattress and two supportive bolster cushions',
      'Elevated wooden activity deck with shade canopy',
      'Crawl-through fabric tunnel with cushioned interior',
      'Climbing ramp with textured grip steps',
      'Sensory activity ramp with removable fabric grip pads and wooden bone detail',
      'Hanging woven enrichment ball and decorative wind chime',
      'Integrated planter box for dog-safe sensory plants (plants supplied separately)',
      'Decorative floor mat and colour-matched fabric accents',
    ],
  },
  {
    id: 'materials',
    title: 'Materials & Care',
    content:
      'Proposed construction: responsibly sourced birch or equivalent engineered hardwood, rounded and sanded edges, and a pet-safe water-based protective finish. Soft components are envisioned in durable, removable cotton-blend canvas with washable covers and supportive, quick-drying cushion inserts. Wipe wooden surfaces with a soft damp cloth and mild pet-safe cleaner; wash removable covers according to their final care labels. Keep the structure dry and inspect fabric, fasteners and toys regularly. Final material composition and care instructions must be confirmed with the manufacturer.',
  },
  {
    id: 'dimensions',
    title: 'Dimensions & Specifications',
    isSpecsTable: true,
  },
  {
    id: 'safety',
    title: 'Comfort & Safety',
    items: [
      'Rounded corners and smoothly finished exposed edges are proposed design requirements',
      'Non-slip ramp surfaces and a stable, level base are intended design features',
      'Use only securely fixed, pet-safe hanging accessories; remove damaged toys immediately',
      'The planter should contain only dog-safe plants and no accessible pesticides or fertilisers',
      'Introduce the tunnel and ramps gradually and allow the dog to opt out at any time',
      'Adult supervision is recommended during play; this product is not a crate or restraint system',
      'Load limits, tip resistance, finish safety and structural testing must be validated before sale',
    ],
  },
  {
    id: 'sizing',
    title: 'Sizing & Suitable Dogs',
    content:
      'The concept is currently intended for small-to-medium dogs, with a suggested maximum shoulder height of approximately 55 cm and body weight up to 25 kg. These are preliminary design targets only. Before manufacture, the sleeping bay, tunnel diameter, ramp angle and structural load rating must be checked against the individual dog’s measurements, mobility and behaviour. Larger or less agile dogs may need a different configuration.',
  },
  {
    id: 'assembly',
    title: 'Assembly & What to Expect',
    items: [
      'Proposed delivery format: modular wooden panels, pre-fitted soft components and labelled hardware',
      'Estimated assembly time: 60–90 minutes for two adults using supplied instructions',
      'A basic tool kit and illustrated assembly guide are intended to be included',
      'All fixings should be tightened and stability checked before use',
      'Optional assisted assembly is a proposed service and is not yet confirmed',
    ],
  },
  {
    id: 'delivery',
    title: 'Delivery, Warranty & Returns',
    content:
      'The concept price shown is ₹35,000 inclusive of taxes and an assumed standard doorstep-delivery allowance. Nationwide delivery, white-glove assembly, a 30-day trial and warranty coverage are proposed customer policies, not currently verified services. Final delivery zones, lead times, return eligibility, warranty duration and exclusions must be confirmed before accepting real orders. Made-to-order or customised colourways may have a different lead time.',
  },
]

export default function ShopPage() {
  const router = useRouter()
  const prefersReduced = useReducedMotion()
  const addItem = useCartStore((state) => state.addItem)

  // Product Selection States
  const [selectedColour, setSelectedColour] = useState<Colourway>(COLOURWAYS[0])
  const [selectedGalleryIdx, setSelectedGalleryIdx] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [addedToast, setAddedToast] = useState(false)
  const [openAccordion, setOpenAccordion] = useState<string | null>('about')

  // Mobile Fullscreen Viewer Modal
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false)

  // Magnifier States (Desktop)
  const imageContainerRef = useRef<HTMLDivElement>(null)
  const [lensState, setLensState] = useState<{
    show: boolean
    x: number
    y: number
    bgX: number
    bgY: number
  }>({ show: false, x: 0, y: 0, bgX: 0, bgY: 0 })

  // Helper function to resolve the active image for any gallery item based on chosen colourway
  const getPerspectiveImage = useCallback(
    (galleryItem: GalleryImage) => {
      if (
        galleryItem.colorwayOverrides &&
        galleryItem.colorwayOverrides[selectedColour.id]
      ) {
        return galleryItem.colorwayOverrides[selectedColour.id]
      }
      return galleryItem.defaultSrc
    },
    [selectedColour.id],
  )

  // Active Main Image URL based on selected gallery perspective and colourway
  const activeImage = getPerspectiveImage(GALLERY_IMAGES[selectedGalleryIdx])

  // Desktop Magnifier Interaction
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return
    const rect = imageContainerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (x < 0 || x > rect.width || y < 0 || y > rect.height) {
      setLensState((prev) => ({ ...prev, show: false }))
      return
    }

    const bgX = (x / rect.width) * 100
    const bgY = (y / rect.height) * 100

    setLensState({
      show: true,
      x,
      y,
      bgX,
      bgY,
    })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setLensState((prev) => ({ ...prev, show: false }))
  }, [])

  // Cart actions
  const handleAddToCart = () => {
    addItem({
      id: 'canopy-sanctuary',
      title: 'CANOPY Sanctuary',
      colorName: selectedColour.name,
      colorHex: selectedColour.hex,
      image: selectedColour.image,
      price: PRODUCT_PRICE,
      quantity,
    })

    setAddedToast(true)
    setTimeout(() => setAddedToast(false), 3000)
  }

  const handleBuyNow = () => {
    handleAddToCart()
    router.push('/cart')
  }

  // Toggle Accordions
  const toggleAccordion = (id: string) => {
    setOpenAccordion((prev) => (prev === id ? null : id))
  }

  // Close mobile viewer on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileModalOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const renderAccordion = (acc: AccordionItem) => {
    const isOpen = openAccordion === acc.id

    return (
      <div
        key={acc.id}
        className="overflow-hidden rounded-2xl border border-[#EBD9C8] bg-white shadow-xs"
      >
        <button
          type="button"
          onClick={() => toggleAccordion(acc.id)}
          aria-expanded={isOpen}
          className="flex w-full items-center justify-between gap-4 p-4 text-left text-sm font-bold text-[#4A3E39] transition hover:bg-[#FFFBF7] [font-family:var(--font-fredoka)] cursor-pointer"
        >
          <span>{acc.title}</span>
          <span
            className={`shrink-0 transform text-base transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-[#3399D4]' : 'text-[#8D786D]'
            }`}
          >
            ▾
          </span>
        </button>
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: prefersReduced ? 0 : 0.2 }}
              className="border-t border-[#F2E5D5] px-4 pb-4 pt-3 text-xs leading-relaxed text-[#6E5D53]"
            >
              {acc.content && <p>{acc.content}</p>}
              {acc.items && (
                <ul className="mt-1 list-disc space-y-1 pl-4">
                  {acc.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              )}
              {acc.isSpecsTable && (
                <div className="space-y-2">
                  <p className="mb-3 rounded-xl bg-[#FFF8EF] p-3 text-[11px] text-[#8D786D]">
                    Preliminary concept estimates for presentation purposes only. These are not verified manufacturing specifications.
                  </p>
                  {[
                    ['Overall width', 'Approx. 180 cm'],
                    ['Overall depth', 'Approx. 120 cm'],
                    ['Overall height', 'Approx. 150 cm'],
                    ['Sleeping bay', 'Approx. 90 × 70 cm'],
                    ['Tunnel opening', 'Approx. 45 cm diameter'],
                    ['Estimated product weight', 'Approx. 55–65 kg'],
                    ['Suggested dog weight', 'Up to 25 kg'],
                    ['Suggested shoulder height', 'Up to 55 cm'],
                    ['Assembly time', 'Approx. 60–90 minutes (2 adults)'],
                    ['Colourways', '6 proposed finishes'],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex items-start justify-between gap-4 border-b border-[#F7EFE7] pb-2 last:border-0"
                    >
                      <span className="text-[#8D786D]">{label}</span>
                      <span className="text-right font-semibold text-[#4A3E39]">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-[#FFF8EF] text-[#51443E] selection:bg-[#82C2E5]/30">
        <CanopyHeader />

        {/* Breadcrumb Header */}
        <header className="border-b border-[#F0E2D4] bg-white/60 backdrop-blur-md px-4 sm:px-8 py-3.5 sticky top-0 z-40">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 rounded-full bg-[#EAF5FC] px-3.5 py-1.5 text-xs font-bold text-[#3399D4] transition hover:bg-[#d5ecf9] [font-family:var(--font-fredoka)]"
            >
              <span className="transition-transform group-hover:-translate-x-0.5">
                ←
              </span>
              <span>Back to CANOPY Garden</span>
            </Link>

            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C7669] [font-family:var(--font-fredoka)] hidden sm:inline-block">
              THE CANOPY COLLECTION
            </span>
          </div>
        </header>

        {/* Main Product Layout */}
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
            {/* =========================================================
                LEFT COLUMN: PRODUCT GALLERY (~60% width on Desktop)
                ========================================================= */}
            <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4 sm:gap-6 items-start">
              {/* Vertical Thumbnail Strip */}
              <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 w-full sm:w-24 shrink-0">
                {GALLERY_IMAGES.map((img, idx) => {
                  const isSelected = selectedGalleryIdx === idx
                  const thumbSrc = getPerspectiveImage(img)

                  return (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => setSelectedGalleryIdx(idx)}
                      aria-label={`View ${img.label}`}
                      className={`group relative aspect-square w-16 sm:w-20 shrink-0 overflow-hidden rounded-2xl border-2 bg-white p-1 transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'border-[#82C2E5] ring-2 ring-[#82C2E5]/30 shadow-md scale-[1.02]'
                          : 'border-[#EBD9C8]/80 hover:border-[#82C2E5]/60 hover:shadow-sm'
                      }`}
                    >
                      <div className="relative h-full w-full overflow-hidden rounded-xl bg-[#FFFBF7]">
                        <Image
                          src={thumbSrc}
                          alt={img.label}
                          fill
                          sizes="80px"
                          className="object-contain p-1"
                        />
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Main Product Display with Interactive Magnifier */}
              <div className="relative w-full flex-1">
                <div
                  ref={imageContainerRef}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => setIsMobileModalOpen(true)}
                  className="relative aspect-[4/3] sm:aspect-square w-full overflow-hidden rounded-[30px] border border-[#EBD9C8] bg-white p-4 sm:p-8 shadow-[0_16px_40px_rgba(60,45,35,0.06)] cursor-crosshair sm:cursor-zoom-in"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeImage}
                      initial={
                        prefersReduced ? { opacity: 1 } : { opacity: 0.8, scale: 0.98 }
                      }
                      animate={{ opacity: 1, scale: 1 }}
                      exit={prefersReduced ? { opacity: 1 } : { opacity: 0.8 }}
                      transition={{ duration: 0.25 }}
                      className="relative h-full w-full"
                    >
                      <Image
                        src={activeImage}
                        alt="CANOPY Product Display"
                        fill
                        priority
                        sizes="(max-width: 1024px) 100vw, 700px"
                        className="object-contain select-none"
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* Desktop Circular Magnifier Lens */}
                  {lensState.show && (
                    <div
                      className="pointer-events-none hidden sm:block absolute h-44 w-44 rounded-full border-3 border-white shadow-[0_12px_36px_rgba(30,20,15,0.28)]"
                      style={{
                        left: `${lensState.x}px`,
                        top: `${lensState.y}px`,
                        transform: 'translate(-50%, -50%)',
                        backgroundImage: `url(${activeImage})`,
                        backgroundPosition: `${lensState.bgX}% ${lensState.bgY}%`,
                        backgroundSize: '240% 240%',
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: '#FFFFFF',
                      }}
                    />
                  )}

                  {/* Tap to expand badge for mobile */}
                  <span className="sm:hidden absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-[#3399D4] shadow-xs backdrop-blur-xs [font-family:var(--font-fredoka)]">
                    <svg
                      className="h-3 w-3 stroke-current stroke-2"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                    </svg>
                    Tap to expand
                  </span>
                </div>

                <p className="mt-3 text-center sm:text-left text-xs font-medium text-[#8D786D]">
                  Hover over image to inspect textures and detail • 100% natural birch wood
                </p>
              </div>
            </div>

            {/* =========================================================
                RIGHT COLUMN: PRODUCT DETAILS (~40% width on Desktop)
                ========================================================= */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                {/* Eyebrow */}
                <span className="inline-block rounded-full bg-[#EAF5FC] px-3.5 py-1 text-xs font-bold tracking-[0.18em] text-[#3399D4] [font-family:var(--font-fredoka)]">
                  THE CANOPY COLLECTION
                </span>

                {/* Title & Tagline */}
                <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#4A3E39] [font-family:var(--font-fredoka)]">
                  CANOPY
                </h1>
                <p className="mt-1 text-base sm:text-lg font-bold text-[#82C2E5] [font-family:var(--font-fredoka)]">
                  A little space to be a dog.
                </p>

                {/* Price */}
                <div className="mt-5 flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#4A3E39] [font-family:var(--font-fredoka)]">
                    {PRODUCT_PRICE_LABEL}
                  </span>
                  <span className="text-xs text-[#8D786D] font-medium">
                    (Inclusive of all taxes & doorstep delivery)
                  </span>
                </div>

                {/* Description */}
                <p className="mt-5 text-sm sm:text-base leading-relaxed text-[#6E5D53]">
                  A thoughtfully designed little world that brings a cosy retreat
                  and playful discovery together. Made for dogs to explore, rest
                  and simply be themselves, at their own pace.
                </p>
                <p className="mt-2 text-xs sm:text-sm font-semibold italic text-[#82C2E5]">
                  One space. Many little adventures.
                </p>

                <div className="my-7 h-px w-full bg-[#EEDFD0]" />

                {/* =======================================================
                    COLOUR SELECTOR
                    ======================================================= */}
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#8A7569]">
                      Colour:{' '}
                      <span className="text-[#4A3E39] [font-family:var(--font-fredoka)]">
                        {selectedColour.name}
                      </span>
                    </span>
                  </div>

                  <div className="mt-3.5 flex flex-wrap items-center gap-3">
                    {COLOURWAYS.map((c) => {
                      const isSelected = selectedColour.id === c.id

                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setSelectedColour(c)}
                          aria-label={`Select ${c.name}`}
                          className={`relative flex h-10 w-10 items-center justify-center rounded-full transition-transform duration-200 cursor-pointer ${
                            isSelected
                              ? 'ring-2 ring-offset-3 ring-[#3399D4] scale-110 shadow-sm'
                              : 'hover:scale-105 opacity-90 hover:opacity-100'
                          }`}
                        >
                          <span
                            className="h-8 w-8 rounded-full border border-black/10 shadow-inner"
                            style={{ backgroundColor: c.hex }}
                          />
                        </button>
                      )
                    })}
                  </div>
                  <p className="mt-2 text-[11px] text-[#8D786D]">
                    Natural solid birch structure with {selectedColour.name.toLowerCase()} accents and bedding.
                  </p>
                </div>

                {/* =======================================================
                    QUANTITY & ACTIONS
                    ======================================================= */}
                <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  {/* Quantity Selector */}
                  <div className="flex items-center justify-between sm:justify-center rounded-full border border-[#EBD9C8] bg-white px-3 py-1.5 shadow-xs">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                      className="flex h-9 w-9 items-center justify-center rounded-full text-base font-bold text-[#51443E] transition hover:bg-[#FFF5E6] disabled:opacity-40 cursor-pointer"
                    >
                      −
                    </button>
                    <span className="w-10 text-center font-bold text-base text-[#4A3E39] [font-family:var(--font-fredoka)]">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      aria-label="Increase quantity"
                      className="flex h-9 w-9 items-center justify-center rounded-full text-base font-bold text-[#51443E] transition hover:bg-[#FFF5E6] cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddToCart}
                    className="group relative flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-full bg-[#3399D4] px-7 py-3.5 text-base font-bold text-white shadow-[0_8px_24px_rgba(51,153,212,0.35)] transition-colors hover:bg-[#2884B8] [font-family:var(--font-fredoka)] cursor-pointer"
                  >
                    <span>Add to Cart</span>
                    <span className="transition-transform group-hover:translate-x-1">
                      🐾
                    </span>
                  </motion.button>
                </div>

                {/* Secondary Action: Buy Now */}
                <div className="mt-3">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={handleBuyNow}
                    className="w-full rounded-full border-2 border-[#4A3E39] bg-transparent py-3 text-sm font-bold text-[#4A3E39] transition-colors hover:bg-[#4A3E39] hover:text-white [font-family:var(--font-fredoka)] cursor-pointer"
                  >
                    Buy Now
                  </motion.button>
                </div>

                {/* Added Toast Notification */}
                <AnimatePresence>
                  {addedToast && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="mt-4 flex items-center justify-between rounded-2xl bg-[#E6F4EA] border border-[#C3E6CB] p-3 text-xs font-semibold text-[#1E7E34]"
                    >
                      <span>Added to your cart! 🐾 ({quantity} item{quantity > 1 ? 's' : ''})</span>
                      <Link
                        href="/cart"
                        className="underline font-bold hover:text-[#155724]"
                      >
                        View Cart →
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* =======================================================
              PRODUCT INFORMATION ACCORDIONS (2 Independent Columns)
              ======================================================= */}
          <section className="mt-12 lg:mt-16" aria-labelledby="product-details-heading">
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#3399D4] [font-family:var(--font-fredoka)]">
                  Everything you need to know
                </span>
                <h2
                  id="product-details-heading"
                  className="mt-1 text-2xl sm:text-3xl font-extrabold text-[#4A3E39] [font-family:var(--font-fredoka)]"
                >
                  Inside the CANOPY concept
                </h2>
              </div>
              <p className="max-w-xl text-xs leading-relaxed text-[#8D786D]">
                Explore the proposed design, components, sizing and ownership details. All product specifications are illustrative and subject to prototype testing and manufacturer confirmation.
              </p>
            </div>

            <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-4">
                {ACCORDIONS.filter((_, i) => i % 2 === 0).map(renderAccordion)}
              </div>
              <div className="flex flex-col gap-4">
                {ACCORDIONS.filter((_, i) => i % 2 !== 0).map(renderAccordion)}
              </div>
            </div>
          </section>
        </main>

        {/* =============================================================
            STICKY BOTTOM MOBILE PURCHASE BAR
            ============================================================= */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-[#EBD9C8] bg-white/95 backdrop-blur-md px-4 py-3 shadow-[0_-6px_20px_rgba(40,30,20,0.08)]">
          <div className="mx-auto flex max-w-md items-center justify-between gap-3">
            <div>
              <span className="text-xs text-[#8D786D] block font-medium">CANOPY Sanctuary</span>
              <span className="text-lg font-extrabold text-[#4A3E39] [font-family:var(--font-fredoka)]">
                {PRODUCT_PRICE_LABEL}
              </span>
            </div>
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 rounded-full bg-[#3399D4] px-5 py-2.5 text-center text-sm font-bold text-white shadow-md active:scale-95 [font-family:var(--font-fredoka)] cursor-pointer"
            >
              Add to Cart
            </button>
          </div>
        </div>

        {/* =============================================================
            MOBILE FULLSCREEN VIEWER MODAL
            ============================================================= */}
        <AnimatePresence>
          {isMobileModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[150] flex flex-col justify-between bg-black/90 p-4 backdrop-blur-md"
            >
              <div className="flex items-center justify-between text-white">
                <span className="text-xs font-bold tracking-wider [font-family:var(--font-fredoka)]">
                  {GALLERY_IMAGES[selectedGalleryIdx].label} ({selectedColour.name})
                </span>
                <button
                  type="button"
                  onClick={() => setIsMobileModalOpen(false)}
                  className="rounded-full bg-white/20 p-2 text-white hover:bg-white/30"
                >
                  ✕
                </button>
              </div>

              <div className="relative h-[70vh] w-full">
                <Image
                  src={activeImage}
                  alt="CANOPY Fullscreen View"
                  fill
                  className="object-contain"
                />
              </div>

              <div className="flex justify-center gap-2 overflow-x-auto pb-4">
                {GALLERY_IMAGES.map((img, i) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setSelectedGalleryIdx(i)}
                    className={`relative h-12 w-12 rounded-lg overflow-hidden border-2 bg-white ${
                      selectedGalleryIdx === i
                        ? 'border-[#82C2E5]'
                        : 'border-transparent opacity-60'
                    }`}
                  >
                    <Image
                      src={getPerspectiveImage(img)}
                      alt={img.label}
                      fill
                      className="object-contain"
                    />
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AuthSessionSync />
      <SignInModal />
    </>
  )
}