'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { CanopyHeader } from '@/components/layout/CanopyHeader'
import { AuthSessionSync } from '@/components/auth/AuthSessionSync'
import { SignInModal } from '@/components/auth/SignInModal'
import { useAuthStore } from '@/state/auth-store'
import { useCartStore } from '@/state/cart-store'
import { useOrderStore, Order } from '@/state/order-store'
import { playSound } from '@/lib/sounds'

// Floating garden confetti petals
const CONFETTI_PETALS = [
  { src: '/flower-petal.png', x: 25, drift: 35, duration: 3.2, delay: 0, size: 20 },
  { src: '/flower-1.png', x: 80, drift: -25, duration: 3.8, delay: 0.4, size: 24 },
  { src: '/flower-petal.png', x: 140, drift: 40, duration: 3.0, delay: 0.8, size: 18 },
  { src: '/flower-2.png', x: 210, drift: -30, duration: 4.0, delay: 0.2, size: 26 },
  { src: '/flower-petal.png', x: 280, drift: 35, duration: 3.5, delay: 1.0, size: 22 },
  { src: '/flower-1.png', x: 340, drift: -40, duration: 3.3, delay: 0.6, size: 20 },
  { src: '/flower-petal.png', x: 400, drift: 25, duration: 3.6, delay: 1.2, size: 19 },
]

/* ======================================================================
   BUILT-IN MOCK PAYMENT GATEWAY & CELEBRATION MODAL
   ====================================================================== */
function MockPaymentModal({
  isOpen,
  onClose,
  totalAmount,
}: {
  isOpen: boolean
  onClose: () => void
  totalAmount: number
}) {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const cartItems = useCartStore((state) => state.items)
  const clearCart = useCartStore((state) => state.clearCart)
  const addOrder = useOrderStore((state) => state.addOrder)

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card'>('upi')
  const [upiId, setUpiId] = useState('demo@okhdfcbank')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')

  // Flow stages: 'form' | 'processing' | 'celebration'
  const [stage, setStage] = useState<'form' | 'processing' | 'celebration'>('form')
  const [processStep, setProcessStep] = useState('')
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null)

  const handleFillTestCard = () => {
    setCardNumber('4111 •••• •••• 4242')
    setCardExpiry('12/28')
    setCardCvv('789')
  }

  const handleProcessPayment = () => {
    setStage('processing')
    setProcessStep('Connecting to bank gateway...')

    setTimeout(() => {
      setProcessStep(`Authorizing ₹${totalAmount.toLocaleString('en-IN')}...`)
    }, 700)

    setTimeout(() => {
      setProcessStep('Payment Approved! 🎉')
    }, 1400)

    setTimeout(() => {
      const randomNum = Math.floor(10000 + Math.random() * 90000)
      const today = new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })

      const newOrder: Order = {
        orderId: `CNP-${randomNum}`,
        date: today,
        status: 'Confirmed',
        statusColor: 'bg-[#E6F4EA] text-[#1E7E34] border-[#C3E6CB]',
        total: `₹${totalAmount.toLocaleString('en-IN')}`,
        paymentMethod:
          paymentMethod === 'upi' ? `UPI (${upiId})` : 'Visa Card (•••• 4242)',
        items: cartItems.map((item) => ({
          name: item.title,
          detail: `Finish & Accents: ${item.colorName}`,
          image: item.image,
          qty: item.quantity,
          price: `₹${(item.price * item.quantity).toLocaleString('en-IN')}`,
        })),
      }

      // Save order, clear cart, play celestial chime, and launch celebration
      addOrder(newOrder)
      setCreatedOrder(newOrder)
      clearCart()
      playSound('butterfly')
      setStage('celebration')
    }, 2000)
  }

  const handleFinishAndGoToAccount = () => {
    onClose()
    setStage('form')
    router.push('/account')
  }

  const handleFinishAndGoHome = () => {
    onClose()
    setStage('form')
    router.push('/')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={stage === 'form' ? onClose : undefined}
            className="absolute inset-0 bg-[#0C1A2E]/70 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            className="relative w-full max-w-lg overflow-hidden rounded-[32px] border border-[#CBDDE9] bg-white shadow-2xl"
          >
            {/* =========================================================
                STAGE 1 & 2: PAYMENT FORM / PROCESSING
                ========================================================= */}
            {stage !== 'celebration' && (
              <>
                {/* Header */}
                <div className="bg-[#0C2340] px-6 py-4 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3399D4] text-white font-extrabold text-sm [font-family:var(--font-fredoka)]">
                        C
                      </div>
                      <div>
                        <h3 className="font-bold text-sm leading-tight [font-family:var(--font-fredoka)]">
                          CANOPY Pet Spaces
                        </h3>
                        <p className="text-[11px] text-white/70">
                          {user ? user.email : 'guest@canopy.garden'}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="inline-block rounded-md bg-[#25D366]/20 px-2 py-0.5 text-[10px] font-bold text-[#25D366] tracking-wider uppercase">
                        Test Mode
                      </span>
                      <p className="text-lg font-extrabold [font-family:var(--font-fredoka)] text-white">
                        ₹{totalAmount.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6">
                  {stage === 'processing' ? (
                    <div className="py-12 text-center">
                      <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#82C2E5]/30 border-t-[#3399D4]" />
                      <h4 className="text-base font-bold text-[#4A3E39] [font-family:var(--font-fredoka)]">
                        Processing Payment
                      </h4>
                      <p className="mt-1 text-xs font-medium text-[#8D786D] animate-pulse">
                        {processStep}
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Order Preview */}
                      <div className="mb-5 rounded-2xl border border-[#F2E5D5] bg-[#FFFBF7] p-3.5">
                        <div className="flex items-center justify-between text-xs font-semibold text-[#8D786D] pb-1 border-b border-[#F5ECE2]">
                          <span>Item Details</span>
                          <span>Total Amount</span>
                        </div>
                        <div className="mt-2.5 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {cartItems[0]?.image && (
                              <div className="relative h-11 w-14 shrink-0 overflow-hidden rounded-lg bg-white border border-[#EBD9C8]">
                                <Image
                                  src={cartItems[0].image}
                                  alt="Product"
                                  fill
                                  className="object-contain"
                                />
                              </div>
                            )}
                            <div>
                              <p className="text-xs font-bold text-[#4A3E39] [font-family:var(--font-fredoka)]">
                                {cartItems[0]?.title || 'CANOPY Sanctuary'}
                              </p>
                              <p className="text-[11px] text-[#8D786D]">
                                {cartItems[0]?.colorName} • Qty {cartItems[0]?.quantity || 1}
                              </p>
                            </div>
                          </div>
                          <span className="font-extrabold text-sm text-[#4A3E39] [font-family:var(--font-fredoka)]">
                            ₹{totalAmount.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      {/* Payment Method Switcher */}
                      <div className="mb-5 grid grid-cols-2 gap-2 rounded-2xl bg-[#F4E6D8]/60 p-1">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('upi')}
                          className={`rounded-xl py-2 text-xs font-bold transition [font-family:var(--font-fredoka)] cursor-pointer ${
                            paymentMethod === 'upi'
                              ? 'bg-white text-[#3399D4] shadow-xs'
                              : 'text-[#8A7569] hover:text-[#4A3E39]'
                          }`}
                        >
                          UPI / QR Code
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('card')}
                          className={`rounded-xl py-2 text-xs font-bold transition [font-family:var(--font-fredoka)] cursor-pointer ${
                            paymentMethod === 'card'
                              ? 'bg-white text-[#3399D4] shadow-xs'
                              : 'text-[#8A7569] hover:text-[#4A3E39]'
                          }`}
                        >
                          Card (Debit/Credit)
                        </button>
                      </div>

                      {/* UPI Tab */}
                      {paymentMethod === 'upi' && (
                        <div className="space-y-3">
                          <label className="block text-xs font-bold text-[#6E5D53]">
                            Enter Virtual Payment Address (UPI ID)
                          </label>
                          <input
                            type="text"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            placeholder="username@bank"
                            className="w-full rounded-xl border border-[#E0CFBF] bg-white px-3.5 py-2.5 text-xs font-medium text-[#4A3E39] shadow-xs outline-none focus:border-[#3399D4]"
                          />
                          <div className="rounded-lg bg-[#FFF5E6] p-2 text-[11px] text-[#8D786D]">
                            Supported apps: <strong className="text-[#51443E]">Google Pay • PhonePe • Paytm • BHIM</strong>
                          </div>
                        </div>
                      )}

                      {/* Card Tab */}
                      {paymentMethod === 'card' && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <label className="block text-xs font-bold text-[#6E5D53]">
                              Card Details
                            </label>
                            <button
                              type="button"
                              onClick={handleFillTestCard}
                              className="text-[11px] font-bold text-[#3399D4] hover:underline cursor-pointer"
                            >
                              ⚡ Auto-fill Test Card
                            </button>
                          </div>

                          <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="Card Number"
                            className="w-full rounded-xl border border-[#E0CFBF] bg-white px-3.5 py-2 text-xs font-medium text-[#4A3E39] shadow-xs outline-none focus:border-[#3399D4]"
                          />

                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              placeholder="MM / YY"
                              className="w-full rounded-xl border border-[#E0CFBF] bg-white px-3.5 py-2 text-xs font-medium text-[#4A3E39] shadow-xs outline-none focus:border-[#3399D4]"
                            />
                            <input
                              type="password"
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value)}
                              placeholder="CVV"
                              maxLength={3}
                              className="w-full rounded-xl border border-[#E0CFBF] bg-white px-3.5 py-2 text-xs font-medium text-[#4A3E39] shadow-xs outline-none focus:border-[#3399D4]"
                            />
                          </div>
                        </div>
                      )}

                      {/* Submit Button */}
                      <div className="mt-6 flex items-center gap-3">
                        <button
                          type="button"
                          onClick={onClose}
                          className="rounded-full border border-[#E0CFBF] bg-white px-4 py-3 text-xs font-bold text-[#6E5D53] hover:bg-[#FFF5E6] [font-family:var(--font-fredoka)] cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleProcessPayment}
                          className="flex-1 rounded-full bg-[#3399D4] py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#2884B8] [font-family:var(--font-fredoka)] cursor-pointer"
                        >
                          Pay ₹{totalAmount.toLocaleString('en-IN')}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}

            {/* =========================================================
                STAGE 3: CELEBRATION ANIMATION & CUTE TAGLINE
                ========================================================= */}
            {stage === 'celebration' && (
              <div className="relative overflow-hidden bg-gradient-to-b from-[#FFFDF9] via-[#FFF8EF] to-[#F1F9FD] p-6 sm:p-8 text-center">
                {/* Floating Flower Petals / Confetti */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                  {CONFETTI_PETALS.map((petal, i) => (
                    <motion.div
                      key={i}
                      initial={{ y: -30, x: petal.x, rotate: 0, opacity: 0 }}
                      animate={{
                        y: [0, 360],
                        x: [petal.x, petal.x + petal.drift],
                        rotate: [0, 240],
                        opacity: [0, 0.9, 0.9, 0],
                      }}
                      transition={{
                        duration: petal.duration,
                        delay: petal.delay,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      className="absolute top-0"
                    >
                      <Image
                        src={petal.src}
                        alt="Blossom"
                        width={petal.size}
                        height={petal.size}
                        className="object-contain"
                      />
                    </motion.div>
                  ))}
                </div>

                {/* Top Badge */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#EAF5FC] px-4 py-1 text-xs font-bold text-[#3399D4] shadow-xs [font-family:var(--font-fredoka)]"
                >
                  <span>🐾 HOORAY! ORDER CONFIRMED</span>
                </motion.div>

                {/* Animated Puppy with Butterfly */}
                <div className="relative mx-auto mt-4 mb-2 h-36 w-36 sm:h-40 sm:w-40 flex items-center justify-center">
                  {/* Subtle golden sun glow behind puppy */}
                  <div className="absolute inset-0 rounded-full bg-[#FFE8B8]/50 blur-xl scale-110" />

                  {/* Bouncing Happy Puppy */}
                  <motion.div
                    animate={{
                      y: [0, -12, 0],
                      rotate: [-1.5, 1.5, -1.5],
                    }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="relative z-10 h-32 w-32 sm:h-36 sm:w-36"
                  >
                    <Image
                      src="/dog-happy.png"
                      alt="Happy Golden Puppy celebrating"
                      fill
                      className="object-contain drop-shadow-[0_8px_16px_rgba(80,50,30,0.14)]"
                      priority
                    />
                  </motion.div>

                  {/* Fluttering Magical Butterfly beside puppy */}
                  <motion.div
                    animate={{
                      y: [0, -8, 0],
                      x: [0, 5, 0],
                      rotate: [-6, 8, -6],
                    }}
                    transition={{
                      duration: 1.4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="absolute -right-2 top-2 z-20 h-10 w-10 sm:h-12 sm:w-12"
                  >
                    <Image
                      src="/butterfly-magical.png"
                      alt="Magical Butterfly"
                      fill
                      className="object-contain drop-shadow-sm"
                    />
                  </motion.div>
                </div>

                {/* Headline & Cute Tagline */}
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#4A3E39] [font-family:var(--font-fredoka)]">
                    Paws up! Your CANOPY is on the way!
                  </h2>

                  {/* Cute Tagline */}
                  <p className="mt-2 text-sm sm:text-base font-bold text-[#3399D4] [font-family:var(--font-fredoka)]">
                    &ldquo;Someone&rsquo;s tail is about to wag very, very fast.&rdquo; 🐾
                  </p>

                  <p className="mt-1 text-xs text-[#7A675D] max-w-sm mx-auto">
                    We&rsquo;re carefully preparing your dog&rsquo;s new little world. One cosy sanctuary, infinite happy memories.
                  </p>
                </motion.div>

                {/* Order Confirmation Pill Card */}
                {createdOrder && (
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-5 rounded-2xl border border-[#EBD9C8] bg-white/90 p-3.5 text-left shadow-xs backdrop-blur-xs"
                  >
                    <div className="flex items-center justify-between text-xs pb-1.5 border-b border-[#F2E5D5]">
                      <span className="font-semibold text-[#8D786D]">
                        ORDER {createdOrder.orderId}
                      </span>
                      <span className="rounded-full bg-[#E6F4EA] px-2.5 py-0.5 text-[10px] font-bold text-[#1E7E34]">
                        ● In the Making
                      </span>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-[#4A3E39] [font-family:var(--font-fredoka)]">
                          {createdOrder.items[0]?.name || 'CANOPY Sanctuary'}
                        </p>
                        <p className="text-[11px] text-[#8D786D]">
                          {createdOrder.items[0]?.detail}
                        </p>
                      </div>
                      <span className="font-extrabold text-sm text-[#4A3E39] [font-family:var(--font-fredoka)]">
                        {createdOrder.total}
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* Action Buttons */}
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mt-6 flex flex-col sm:flex-row items-center gap-3"
                >
                  <button
                    type="button"
                    onClick={handleFinishAndGoToAccount}
                    className="w-full sm:flex-1 rounded-full bg-[#3399D4] py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#2884B8] [font-family:var(--font-fredoka)] cursor-pointer"
                  >
                    View My Orders →
                  </button>
                  <button
                    type="button"
                    onClick={handleFinishAndGoHome}
                    className="w-full sm:w-auto rounded-full border border-[#D8C7B7] bg-white px-5 py-3 text-xs font-bold text-[#6E5D53] hover:bg-[#FFF5E6] [font-family:var(--font-fredoka)] cursor-pointer"
                  >
                    Return to Garden 🌿
                  </button>
                </motion.div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

/* ======================================================================
   MAIN CART PAGE
   ====================================================================== */
export default function CartPage() {
  const items = useCartStore((state) => state.items)
  const removeItem = useCartStore((state) => state.removeItem)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const totalAmount = useCartStore((state) => state.totalAmount())

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

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
                          className="h-6 w-6 text-sm font-bold text-[#51443E] hover:text-[#3399D4] cursor-pointer"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-xs font-bold">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="h-6 w-6 text-sm font-bold text-[#51443E] hover:text-[#3399D4] cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        aria-label="Remove item"
                        className="text-xs font-bold text-[#C74A3D] hover:underline px-2 cursor-pointer"
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

                  {/* Proceed to Checkout Button */}
                  <button
                    type="button"
                    onClick={() => setIsCheckoutOpen(true)}
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

      {/* Payment Gateway & Celebration Modal */}
      <MockPaymentModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        totalAmount={totalAmount}
      />

      <AuthSessionSync />
      <SignInModal />
    </>
  )
}