'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
  X,
} from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useAuthStore } from '@/state/auth-store'
import { useCanopyStore } from '@/state/canopy-store'
import type { AuthUser } from '@/types/auth'

type AuthMode = 'signin' | 'register'

interface CredentialsFields {
  email: string
  password: string
}

const credentialsSchema = z.object({
  email: z.string().trim().email('Enter a valid email address.'),
  password: z.string().min(8, 'Use at least 8 characters.'),
})

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M21.35 12.27c0-.71-.06-1.4-.19-2.07H12v3.91h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.23Z"
      />
      <path
        fill="#34A853"
        d="M12 21.72c2.62 0 4.82-.87 6.43-2.35l-3.14-2.44c-.87.58-1.98.93-3.29.93-2.53 0-4.68-1.71-5.45-4.01H3.3v2.52A9.73 9.73 0 0 0 12 21.72Z"
      />
      <path
        fill="#FBBC05"
        d="M6.55 13.85A5.87 5.87 0 0 1 6.24 12c0-.64.11-1.26.31-1.85V7.63H3.3A9.73 9.73 0 0 0 2.27 12c0 1.57.38 3.05 1.03 4.37l3.25-2.52Z"
      />
      <path
        fill="#EA4335"
        d="M12 6.14c1.43 0 2.71.49 3.72 1.45l2.79-2.79A9.42 9.42 0 0 0 12 2.28a9.73 9.73 0 0 0-8.7 5.35l3.25 2.52c.77-2.3 2.92-4.01 5.45-4.01Z"
      />
    </svg>
  )
}

function CanopyPaw() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden="true">
      <ellipse cx="6" cy="6" rx="2" ry="2.8" />
      <ellipse cx="11" cy="4.5" rx="2" ry="3" />
      <ellipse cx="16" cy="5" rx="2" ry="3" />
      <ellipse cx="20" cy="7.5" rx="2" ry="2.7" />
      <path d="M8 12c-3 0-4 4-2 7 2 3 10 3 12 0 2-3 1-7-2-7-2-1-6-1-8 0Z" />
    </svg>
  )
}

export function SignInModal() {
  const router = useRouter()
  const isOpen = useAuthStore((state) => state.isSignInOpen)
  const user = useAuthStore((state) => state.user)
  const authError = useAuthStore((state) => state.authError)
  const notice = useAuthStore((state) => state.notice)
  const closeSignIn = useAuthStore((state) => state.closeSignIn)
  const setUser = useAuthStore((state) => state.setUser)
  const clearUser = useAuthStore((state) => state.clearUser)
  const setNotice = useAuthStore((state) => state.setNotice)
  const setAuthError = useAuthStore((state) => state.setAuthError)
  const mode = useCanopyStore((state) => state.mode)
  const reducedMotion = useReducedMotion()
  const dialogRef = useRef<HTMLDivElement>(null)
  const [authMode, setAuthMode] = useState<AuthMode>('signin')
  const [showPassword, setShowPassword] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<CredentialsFields>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onBlur',
  })

  const handleClose = useCallback(() => {
    closeSignIn()
    setAuthError(null)
  }, [closeSignIn, setAuthError])

  const dismissNotice = useCallback(() => setNotice(null), [setNotice])

  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const focusFrame = window.requestAnimationFrame(() => {
      dialogRef.current?.focus()
    })

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        handleClose()
        return
      }

      if (event.key !== 'Tab' || !dialogRef.current) return

      const focusableElements = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.offsetParent !== null)

      if (focusableElements.length === 0) {
        event.preventDefault()
        dialogRef.current.focus()
        return
      }

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      window.cancelAnimationFrame(focusFrame)
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleClose, isOpen])

  const switchAuthMode = (nextMode: AuthMode) => {
    setAuthMode(nextMode)
    setAuthError(null)
    clearErrors()
  }

  const onSubmit = handleSubmit(async (values) => {
    const parsed = credentialsSchema.safeParse(values)
    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0]
        if (field === 'email' || field === 'password') {
          setError(field, { message: issue.message })
        }
      })
      return
    }

    setAuthError(null)

    try {
      const response = await fetch('/api/auth/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mode: authMode,
          email: parsed.data.email,
          password: parsed.data.password,
        }),
      })
      const data = (await response.json()) as {
        user?: AuthUser
        error?: string
      }

      if (!response.ok || !data.user) {
        throw new Error(data.error || 'We could not sign you in right now.')
      }

      setUser(data.user)
      setNotice(
        authMode === 'register'
          ? 'Your CANOPY account is ready.'
          : 'Welcome back to CANOPY.',
      )
      handleClose()

      if (typeof window !== 'undefined') {
        const redirectTarget = localStorage.getItem('canopy-auth-redirect')
        if (redirectTarget) {
          localStorage.removeItem('canopy-auth-redirect')
          router.push(redirectTarget)
        }
      }
    } catch (error) {
      setAuthError(
        error instanceof Error
          ? error.message
          : 'We could not sign you in right now.',
      )
    }
  })

  const handleGoogleSignIn = () => {
    window.localStorage.setItem('canopy-auth-return-mode', mode)
    window.location.assign('/api/auth/google')
  }

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      await fetch('/api/auth/session', { method: 'DELETE' })
      clearUser()
      setNotice('You have been signed out.')
      handleClose()
    } finally {
      setIsSigningOut(false)
    }
  }

  const panelTransition = reducedMotion
    ? { duration: 0.01 }
    : { duration: 0.32, ease: [0.25, 1, 0.5, 1] as const }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="canopy-sign-in-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0.01 : 0.22 }}
            className="fixed inset-0 z-[120] flex items-center justify-center overflow-y-auto bg-[#315F72]/40 p-3 backdrop-blur-[6px] sm:p-6"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) handleClose()
            }}
          >
            <motion.div
              ref={dialogRef}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              aria-labelledby="canopy-auth-title"
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 10 }}
              transition={panelTransition}
              className="relative w-full max-w-[460px] overflow-hidden rounded-[30px] border border-[#F3E3D3] bg-[#FFF9F2] p-6 shadow-[0_24px_64px_rgba(42,34,30,0.18)] outline-none sm:p-8"
              onMouseDown={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close sign in dialog"
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-[#6B5A51] transition hover:bg-white hover:text-[#3C312C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#82C2E5]"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-3 text-[#82C2E5]">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EAF5FC] text-[#3399D4]">
                  <CanopyPaw />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C7669] [font-family:var(--font-fredoka)]">
                    CANOPY MEMBERSHIP
                  </p>
                  <h2
                    id="canopy-auth-title"
                    className="text-2xl font-bold tracking-tight text-[#4A3D36] [font-family:var(--font-fredoka)] sm:text-3xl"
                  >
                    {user
                      ? 'Your Account'
                      : authMode === 'signin'
                        ? 'Welcome back'
                        : 'Join the garden'}
                  </h2>
                </div>
              </div>

              {user ? (
                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl border border-[#F0DFCF] bg-white/80 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#9C8578]">
                      Signed in as
                    </p>
                    <p className="mt-1 text-base font-bold text-[#4A3D36] [font-family:var(--font-fredoka)]">
                      {user.name}
                    </p>
                    <p className="text-xs text-[#7A675D]">{user.email}</p>
                    <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#EAF5FC] px-2.5 py-0.5 text-[11px] font-semibold text-[#3399D4]">
                      <CheckCircle2 className="h-3 w-3" />
                      Connected via {user.provider === 'google' ? 'Google' : 'Email'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#E9D3C2] bg-white px-4 py-3 text-sm font-bold text-[#6B5A51] transition hover:border-[#DF8A7E] hover:bg-[#FFF5F4] hover:text-[#C74A3D] disabled:opacity-60 [font-family:var(--font-fredoka)]"
                  >
                    {isSigningOut ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Signing out...
                      </>
                    ) : (
                      'Sign out of CANOPY'
                    )}
                  </button>
                </div>
              ) : (
                <>
                  <p className="mt-2 text-xs leading-relaxed text-[#7A675D] sm:text-sm">
                    {authMode === 'signin'
                      ? 'Sign in to access your orders, saved dogs and spaces.'
                      : 'Create your account to save your favourite CANOPY configurations.'}
                  </p>

                  <div className="mt-5 grid grid-cols-2 rounded-2xl bg-[#F4E6D8]/70 p-1">
                    <button
                      type="button"
                      onClick={() => switchAuthMode('signin')}
                      className={`rounded-xl py-2 text-xs font-bold transition sm:text-sm [font-family:var(--font-fredoka)] ${
                        authMode === 'signin'
                          ? 'bg-white text-[#4A3D36] shadow-xs'
                          : 'text-[#8A7569] hover:text-[#4A3D36]'
                      }`}
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => switchAuthMode('register')}
                      className={`rounded-xl py-2 text-xs font-bold transition sm:text-sm [font-family:var(--font-fredoka)] ${
                        authMode === 'register'
                          ? 'bg-white text-[#4A3D36] shadow-xs'
                          : 'text-[#8A7569] hover:text-[#4A3D36]'
                      }`}
                    >
                      Create Account
                    </button>
                  </div>

                  <div className="mt-5">
                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      className="flex w-full items-center justify-center gap-3 rounded-2xl border border-[#EAD7C7] bg-white px-4 py-3 text-sm font-bold text-[#4A3D36] shadow-xs transition hover:border-[#82C2E5] hover:bg-[#F8FCFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#82C2E5] [font-family:var(--font-fredoka)] cursor-pointer"
                    >
                      <GoogleMark />
                      Continue with Google
                    </button>
                  </div>

                  <div className="my-5 flex items-center gap-3 text-xs text-[#A69183]">
                    <div className="h-px flex-1 bg-[#E8D6C6]" />
                    <span>or use email</span>
                    <div className="h-px flex-1 bg-[#E8D6C6]" />
                  </div>

                  {authError && (
                    <div className="mb-4 flex items-start gap-2.5 rounded-2xl border border-[#F3C4BE] bg-[#FFF2F0] p-3 text-xs text-[#B43C30]">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#D94F41]" />
                      <p className="leading-relaxed">{authError}</p>
                    </div>
                  )}

                  <form onSubmit={onSubmit} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#8A7569]">
                        Email address
                      </label>
                      <div className="relative mt-1">
                        <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A89487]" />
                        <input
                          type="email"
                          autoComplete="email"
                          {...register('email')}
                          placeholder="doglover@canopy.garden"
                          className="w-full rounded-2xl border border-[#EAD7C7] bg-white py-2.5 pl-10 pr-4 text-sm text-[#4A3D36] placeholder-[#BAA79A] shadow-xs outline-none transition focus:border-[#82C2E5] focus:ring-2 focus:ring-[#82C2E5]/25"
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-xs text-[#C74A3D]">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#8A7569]">
                        Password
                      </label>
                      <div className="relative mt-1">
                        <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A89487]" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          autoComplete={
                            authMode === 'register' ? 'new-password' : 'current-password'
                          }
                          {...register('password')}
                          placeholder="At least 8 characters"
                          className="w-full rounded-2xl border border-[#EAD7C7] bg-white py-2.5 pl-10 pr-10 text-sm text-[#4A3D36] placeholder-[#BAA79A] shadow-xs outline-none transition focus:border-[#82C2E5] focus:ring-2 focus:ring-[#82C2E5]/25"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A89487] hover:text-[#4A3D36]"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="mt-1 text-xs text-[#C74A3D]">
                          {errors.password.message}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#3399D4] py-3 text-sm font-bold text-white shadow-[0_8px_20px_rgba(51,153,212,0.35)] transition hover:bg-[#2884B8] disabled:opacity-60 [font-family:var(--font-fredoka)] cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Please wait...
                        </>
                      ) : (
                        <>
                          <span>
                            {authMode === 'signin' ? 'Sign in' : 'Create account'}
                          </span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {notice && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            className="fixed bottom-5 right-5 z-[130] flex max-w-sm items-center gap-3 rounded-2xl border border-[#D5ECF8] bg-white/95 px-4 py-3 text-xs font-medium text-[#405461] shadow-[0_12px_36px_rgba(20,50,85,0.12)] backdrop-blur-xs"
          >
            <CheckCircle2 className="h-4 w-4 shrink-0 text-[#3399D4]" />
            <p className="flex-1 leading-snug">{notice}</p>
            <button
              type="button"
              onClick={dismissNotice}
              aria-label="Dismiss message"
              className="rounded-md p-1 text-[#8CA0AD] hover:bg-[#F2F8FC] hover:text-[#405461]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}