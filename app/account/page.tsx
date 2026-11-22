'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/state/auth-store'
import { CanopyHeader } from '@/components/layout/CanopyHeader'
import { AuthSessionSync } from '@/components/auth/AuthSessionSync'
import { SignInModal } from '@/components/auth/SignInModal'

// Realistic sample orders matching CANOPY product journey stops
const SAMPLE_ORDERS = [
  {
    orderId: 'CNP-84920',
    date: '18 Nov 2026',
    status: 'Delivered',
    statusColor: 'bg-[#E6F4EA] text-[#1E7E34] border-[#C3E6CB]',
    total: '$580.00',
    items: [
      {
        name: 'The Complete CANOPY Sanctuary Set',
        detail: 'Warm Birch Finish • Petal Blue Canopy • Includes Den, Planter & Steps',
        image: '/canopy-main-view.png',
        qty: 1,
        price: '$580.00',
      },
    ],
  },
  {
    orderId: 'CNP-73104',
    date: '04 Oct 2026',
    status: 'Delivered',
    statusColor: 'bg-[#E6F4EA] text-[#1E7E34] border-[#C3E6CB]',
    total: '$145.00',
    items: [
      {
        name: 'The Sensory Planter & Climbing Ramps',
        detail: 'Pet-safe Bloom Box & Blue Textured Activity Steps',
        image: '/canopy-sensory-planter.png',
        qty: 1,
        price: '$145.00',
      },
    ],
  },
]

export default function AccountPage() {
  const user = useAuthStore((state) => state.user)
  const openSignIn = useAuthStore((state) => state.openSignIn)
  const clearUser = useAuthStore((state) => state.clearUser)

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/session', { method: 'DELETE' })
      clearUser()
    } catch {}
  }

  return (
    <>
      <div className="min-h-screen bg-[#FFF8EF] text-[#51443E]">
        <CanopyHeader cartCount={0} />

        <header className="border-b border-[#F0E2D4] bg-white/70 backdrop-blur-md px-6 py-4">
          <div className="mx-auto flex max-w-5xl items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-[#EAF5FC] px-4 py-1.5 text-xs font-bold text-[#3399D4] transition hover:bg-[#d8edf9] [font-family:var(--font-fredoka)]"
            >
              <span>← Back to CANOPY Garden</span>
            </Link>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
          {/* User Profile Card */}
          <div className="rounded-[30px] border border-[#EBD9C8] bg-white p-6 sm:p-8 shadow-[0_12px_36px_rgba(60,45,35,0.06)]">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                {user?.picture ? (
                  <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-[#82C2E5]">
                    <Image
                      src={user.picture}
                      alt={user.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF5FC] text-2xl font-bold text-[#3399D4] [font-family:var(--font-fredoka)]">
                    {user ? user.name[0].toUpperCase() : '🐾'}
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-extrabold text-[#4A3E39] [font-family:var(--font-fredoka)] sm:text-3xl">
                      {user ? user.name : 'Guest Explorer'}
                    </h1>
                    <span className="rounded-full bg-[#FFF0D4] px-2.5 py-0.5 text-[11px] font-bold text-[#8D6853]">
                      CANOPY Club Member
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-[#7A675D] sm:text-sm">
                    {user?.email || 'Sign in to sync your orders and saved designs.'}
                  </p>
                </div>
              </div>

              <div>
                {user ? (
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="rounded-full border border-[#E9D3C2] bg-white px-5 py-2 text-xs font-bold text-[#6B5A51] transition hover:border-[#DF8A7E] hover:bg-[#FFF5F4] hover:text-[#C74A3D] [font-family:var(--font-fredoka)] cursor-pointer"
                  >
                    Sign Out
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={openSignIn}
                    className="rounded-full bg-[#3399D4] px-6 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-[#2884B8] [font-family:var(--font-fredoka)] cursor-pointer"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Previous Orders Section */}
          <div className="mt-12">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-extrabold text-[#4A3E39] [font-family:var(--font-fredoka)]">
                Previous Orders
              </h2>
              <span className="text-xs font-semibold text-[#8D6853]">
                {SAMPLE_ORDERS.length} orders found
              </span>
            </div>

            <div className="mt-6 space-y-6">
              {SAMPLE_ORDERS.map((order) => (
                <motion.div
                  key={order.orderId}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="overflow-hidden rounded-[26px] border border-[#EBD9C8] bg-white shadow-[0_8px_24px_rgba(60,45,35,0.05)]"
                >
                  {/* Order Meta Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F2E5D5] bg-[#FFFBF7] px-6 py-4 text-xs">
                    <div className="flex items-center gap-4">
                      <div>
                        <span className="font-semibold text-[#8C7669]">ORDER PLACED</span>
                        <p className="font-bold text-[#4A3E39]">{order.date}</p>
                      </div>
                      <div className="hidden sm:block h-6 w-px bg-[#EBD9C8]" />
                      <div className="hidden sm:block">
                        <span className="font-semibold text-[#8C7669]">ORDER #</span>
                        <p className="font-bold text-[#4A3E39]">{order.orderId}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full border px-3 py-1 font-bold ${order.statusColor}`}
                      >
                        ● {order.status}
                      </span>
                      <span className="font-bold text-[#4A3E39] sm:text-sm">
                        {order.total}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="divide-y divide-[#F6ECE2] p-6">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between py-2 first:pt-0 last:pb-0"
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative h-18 w-24 shrink-0 overflow-hidden rounded-2xl border border-[#F0DFCF] bg-[#FFF5E6]">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-bold text-[#4A3E39] [font-family:var(--font-fredoka)]">
                              {item.name}
                            </h3>
                            <p className="mt-0.5 text-xs text-[#7A675D]">
                              {item.detail}
                            </p>
                            <span className="mt-1 inline-block text-xs font-semibold text-[#3399D4]">
                              Qty: {item.qty}
                            </span>
                          </div>
                        </div>

                        <div className="text-right sm:self-center">
                          <span className="text-sm font-bold text-[#4A3E39] [font-family:var(--font-fredoka)]">
                            {item.price}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </main>
      </div>

      <AuthSessionSync />
      <SignInModal />
    </>
  )
}