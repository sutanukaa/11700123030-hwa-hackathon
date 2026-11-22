'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { useAuthStore } from '@/state/auth-store'
import { useCartStore } from '@/state/cart-store'

export function CanopyHeader({ cartCount }: { cartCount?: number }) {
  const user = useAuthStore((state) => state.user)
  const dynamicCartCount = useCartStore((state) => state.totalCount())
  const count = typeof cartCount === 'number' ? cartCount : dynamicCartCount

  const pathname = usePathname()
  const isHome = pathname === '/'

  const [isVisible, setIsVisible] = useState(!isHome)

  useEffect(() => {
    if (!isHome) {
      setIsVisible(true)
      return
    }

    const checkScroll = () => {
      const dogSection = document.getElementById('canopy-dog-reveal')
      if (dogSection) {
        const rect = dogSection.getBoundingClientRect()
        setIsVisible(rect.top <= 140)
      } else {
        setIsVisible(false)
      }
    }

    checkScroll()
    window.addEventListener('scroll', checkScroll, { passive: true })
    window.addEventListener('resize', checkScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [isHome])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.header
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.95 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed top-4 right-4 sm:top-6 sm:right-8 z-[100] flex items-center gap-2 sm:gap-3 pointer-events-auto"
        >
          {/* Account Icon Button */}
          <Link
            href="/account"
            aria-label="View account and past orders"
            className="group relative flex h-11 items-center gap-2 rounded-full border border-[#EBD9C8]/90 bg-[#FFF8EF]/95 px-3.5 py-1.5 shadow-[0_6px_20px_rgba(60,45,35,0.12)] backdrop-blur-md transition-all duration-200 hover:scale-105 hover:border-[#82C2E5] hover:bg-white hover:shadow-[0_8px_24px_rgba(130,194,229,0.3)] cursor-pointer"
          >
            {user?.picture ? (
              <img
                src={user.picture}
                alt={user.name || 'Account'}
                referrerPolicy="no-referrer"
                className="h-6 w-6 rounded-full object-cover border border-[#82C2E5]/50"
              />
            ) : (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#EAF5FC] text-[#3399D4]">
                <svg
                  className="h-3.5 w-3.5 fill-current"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12Zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8Z" />
                </svg>
              </div>
            )}

            <span className="hidden sm:inline-block text-xs font-bold text-[#51443E] [font-family:var(--font-fredoka)] group-hover:text-[#3399D4]">
              {user ? user.name.split(' ')[0] : 'Account'}
            </span>
          </Link>

          {/* Cart Icon Button */}
          <Link
            href="/cart"
            aria-label={`View cart (${count} items)`}
            className="group relative flex h-11 items-center gap-2 rounded-full border border-[#EBD9C8]/90 bg-[#FFF8EF]/95 px-3.5 py-1.5 shadow-[0_6px_20px_rgba(60,45,35,0.12)] backdrop-blur-md transition-all duration-200 hover:scale-105 hover:border-[#82C2E5] hover:bg-white hover:shadow-[0_8px_24px_rgba(130,194,229,0.3)] cursor-pointer"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FFF0D4] text-[#8D6853] group-hover:text-[#3399D4]">
              <svg
                className="h-3.5 w-3.5 stroke-current stroke-[2.2]"
                viewBox="0 0 24 24"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>

            <span className="hidden sm:inline-block text-xs font-bold text-[#51443E] [font-family:var(--font-fredoka)] group-hover:text-[#3399D4]">
              Cart
            </span>

            {/* Counter Badge */}
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#82C2E5] px-1.5 text-[10px] font-extrabold text-white">
              {count}
            </span>
          </Link>
        </motion.header>
      )}
    </AnimatePresence>
  )
}