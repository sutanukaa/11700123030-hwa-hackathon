'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { CanopyHeader } from '@/components/layout/CanopyHeader'
import { AuthSessionSync } from '@/components/auth/AuthSessionSync'
import { SignInModal } from '@/components/auth/SignInModal'
import { useCartStore } from '@/state/cart-store'

export default function CartPage() {
  const items = useCartStore((state) => state.items)
  const removeItem = useCartStore((state) => state.removeItem)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const totalAmount = useCartStore((state) => state.totalAmount())

  return (
    <>
      <div className="min-h-screen bg-[#FFF8EF] text-[#51443E]">
        <CanopyHeader />

        <header className="border-b border-[#F0E2D4] bg-white/70 backdrop-blur-md px-6 py-4">
          <div className="mx-auto flex max-w-5xl items-center justify-between">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-full bg-[#EAF5FC] px-4 py-1.5 text-xs font-bold text-[#3399D4] transition hover:bg-[#d8edf9] [font-family:var(--font-fredoka)]"
            >
              <span>← Back to Shop</span>
            </Link>
          </div>
        </header>

        <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16">
          <h1 className="text-3xl font-extrabold text-[#4A3E39] [font-family:var(--font-fredoka)] sm:text-4xl">
            Your Cart
          </h1>

          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8 rounded-[32px] border border-[#EBD9C8] bg-white p-10 sm:p-14 text-center shadow-[0_16px_40px_rgba(60,45,35,0.06)]"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF0D4] text-[#8D6853]">
                <svg
                  className="h-8 w-8 stroke-current stroke-[2]"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                  <path d="M3 6h18" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </div>

              <h2 className="mt-5 text-2xl font-bold text-[#4A3E39] [font-family:var(--font-fredoka)]">
                Your cart is empty
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[#6E5D53] max-w-md mx-auto">
                No little adventures added yet. Choose your favourite colourway in our shop to bring CANOPY home.
              </p>

              <div className="mt-6 flex justify-center">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 rounded-full bg-[#3399D4] px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#2884B8] [font-family:var(--font-fredoka)]"
                >
                  Explore CANOPY Shop →
                </Link>
              </div>
            </motion.div>
          ) : (
            <div className="mt-8 grid gap-8 lg:grid-cols-12">
              {/* Items List */}
              <div className="lg:col-span-7 space-y-4">
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      key={`${item.id}-${item.colorName}`}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-4 rounded-[26px] border border-[#EBD9C8] bg-white p-4 sm:p-5 shadow-xs"
                    >
                      <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-2xl bg-[#FFFBF7] border border-[#F2E5D5]">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-contain p-1"
                        />
                      </div>

                      <div className="flex-1">
                        <h3 className="text-base font-bold text-[#4A3E39] [font-family:var(--font-fredoka)]">
                          {item.title}
                        </h3>
                        <div className="mt-1 flex items-center gap-2 text-xs text-[#7A675D]">
                          <span
                            className="h-3 w-3 rounded-full border border-black/15 inline-block"
                            style={{ backgroundColor: item.colorHex }}
                          />
                          <span>{item.colorName}</span>
                        </div>
                        <p className="mt-1 font-bold text-sm text-[#4A3E39]">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </p>
                      </div>

                      {/* Quantity buttons */}
                      <div className="flex items-center rounded-full border border-[#EBD9C8] bg-[#FFFBF7] px-2 py-1">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="h-6 w-6 text-sm font-bold text-[#51443E] hover:text-[#3399D4]"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-xs font-bold">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="h-6 w-6 text-sm font-bold text-[#51443E] hover:text-[#3399D4]"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        aria-label="Remove item"
                        className="text-xs font-bold text-[#C74A3D] hover:underline px-2"
                      >
                        ✕
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-5">
                <div className="rounded-[28px] border border-[#EBD9C8] bg-white p-6 shadow-xs">
                  <h2 className="text-lg font-extrabold text-[#4A3E39] [font-family:var(--font-fredoka)]">
                    Order Summary
                  </h2>

                  <div className="mt-4 space-y-2.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#8D786D]">Subtotal</span>
                      <span className="font-bold text-[#4A3E39]">
                        ₹{totalAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8D786D]">Doorstep Delivery</span>
                      <span className="font-bold text-[#1E7E34]">Free</span>
                    </div>
                    <div className="my-3 h-px bg-[#F2E5D5]" />
                    <div className="flex justify-between text-base font-extrabold text-[#4A3E39] [font-family:var(--font-fredoka)]">
                      <span>Total</span>
                      <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      alert('Checkout integration ready for backend order processing.')
                    }
                    className="mt-6 w-full rounded-full bg-[#3399D4] py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-[#2884B8] [font-family:var(--font-fredoka)] cursor-pointer"
                  >
                    Proceed to Checkout
                  </button>

                  <p className="mt-3 text-center text-[11px] text-[#8D786D]">
                    30-day happiness trial • White-glove assembly available
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <AuthSessionSync />
      <SignInModal />
    </>
  )
}