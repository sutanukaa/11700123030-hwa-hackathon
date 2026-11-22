'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
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
              role="dialog"
              aria-modal="true"
              aria-labelledby="canopy-sign-in-title"
              tabIndex={-1}
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96 }}
              animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.97 }}
              transition={panelTransition}
              className="relative my-auto w-full max-w-[470px] overflow-hidden rounded-[28px] border border-white/90 bg-[#FFF8EF] shadow-[0_28px_90px_rgba(43,67,76,0.28)] outline-none sm:rounded-[34px]"
            >
              <div className="pointer-events-none absolute -right-14 -top-16 h-44 w-44 rounded-full bg-[#C5D9E8]/55 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-16 -left-12 h-40 w-40 rounded-full bg-[#F5D98E]/25 blur-2xl" />

              <button
                type="button"
                onClick={handleClose}
                aria-label="Close sign in"
                className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-[#E8DED2] bg-[#FFFEFA]/90 text-[#6B5E55] shadow-sm transition hover:border-[#82C2E5]/60 hover:text-[#3399D4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3399D4]/50 cursor-pointer"
              >
                <X className="h-4 w-4 stroke-[2.4]" />
              </button>

              <div className="relative px-6 pb-6 pt-7 sm:px-8 sm:pb-8 sm:pt-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#3399D4] text-white shadow-[0_8px_20px_rgba(51,153,212,0.28)]">
                  <CanopyPaw />
                </div>

                {user ? (
                  <div className="mt-5">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#3399D4] [font-family:var(--font-fredoka)]">
                      CANOPY ACCOUNT
                    </p>
                    <h2
                      id="canopy-sign-in-title"
                      className="mt-2 text-3xl font-extrabold leading-tight text-[#4A3E39] [font-family:var(--font-fredoka)]"
                    >
                      You&apos;re signed in
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-[#6B5E55]">
                      Welcome back, {user.name}. Your little world is ready when you are.
                    </p>

                    <div className="mt-6 flex items-center gap-3 rounded-2xl border border-[#D8E7EF] bg-white/75 p-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#C5D9E8] text-lg font-bold text-[#2A86BC] [font-family:var(--font-fredoka)]">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-[#51443E]">
                          {user.name}
                        </p>
                        <p className="truncate text-xs text-[#897C72]">{user.email}</p>
                      </div>
                      <CheckCircle2 className="ml-auto h-5 w-5 shrink-0 text-[#3399D4]" />
                    </div>

                    <button
                      type="button"
                      onClick={handleClose}
                      className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#3399D4] px-6 py-3.5 text-base font-bold text-white shadow-[0_8px_24px_rgba(51,153,212,0.32)] transition hover:bg-[#2A86BC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3399D4]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF8EF] cursor-pointer"
                    >
                      Continue shopping
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </button>

                    <button
                      type="button"
                      onClick={handleSignOut}
                      disabled={isSigningOut}
                      className="mt-3 w-full rounded-full px-5 py-2.5 text-sm font-bold text-[#6B5E55] transition hover:bg-white/70 hover:text-[#3399D4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3399D4]/40 disabled:opacity-60 cursor-pointer"
                    >
                      {isSigningOut ? 'Signing out…' : 'Sign out'}
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mt-5 pr-10">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#3399D4] [font-family:var(--font-fredoka)]">
                        WELCOME TO CANOPY
                      </p>
                      <h2
                        id="canopy-sign-in-title"
                        className="mt-2 text-[30px] font-extrabold leading-tight text-[#4A3E39] [font-family:var(--font-fredoka)] sm:text-[34px]"
                      >
                        {authMode === 'signin'
                          ? 'Come back to their little world'
                          : 'Create their cosy corner'}
                      </h2>
                      <p className="mt-2 text-sm leading-relaxed text-[#6B5E55]">
                        Sign in for orders, updates and more happy little adventures.
                      </p>
                    </div>

                    <div
                      className="mt-5 grid grid-cols-2 rounded-full border border-[#E8DED2] bg-[#F3E9DC] p-1"
                      role="group"
                      aria-label="Choose account action"
                    >
                      <button
                        type="button"
                        onClick={() => switchAuthMode('signin')}
                        aria-pressed={authMode === 'signin'}
                        className={`rounded-full px-4 py-2 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3399D4]/40 cursor-pointer ${
                          authMode === 'signin'
                            ? 'bg-white text-[#3399D4] shadow-sm'
                            : 'text-[#897C72] hover:text-[#51443E]'
                        }`}
                      >
                        Sign in
                      </button>
                      <button
                        type="button"
                        onClick={() => switchAuthMode('register')}
                        aria-pressed={authMode === 'register'}
                        className={`rounded-full px-4 py-2 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3399D4]/40 cursor-pointer ${
                          authMode === 'register'
                            ? 'bg-white text-[#3399D4] shadow-sm'
                            : 'text-[#897C72] hover:text-[#51443E]'
                        }`}
                      >
                        Create account
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      className="mt-4 inline-flex w-full items-center justify-center gap-3 rounded-full border border-[#DED4C8] bg-[#FFFEFA] px-5 py-3 text-sm font-bold text-[#51443E] shadow-sm transition hover:-translate-y-0.5 hover:border-[#82C2E5]/60 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3399D4]/40 cursor-pointer"
                    >
                      <GoogleMark />
                      <span>Continue with Google</span>
                    </button>

                    <div className="my-5 flex items-center gap-3" aria-hidden="true">
                      <span className="h-px flex-1 bg-[#E8DED2]" />
                      <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#A09288] [font-family:var(--font-fredoka)]">
                        or use email
                      </span>
                      <span className="h-px flex-1 bg-[#E8DED2]" />
                    </div>

                    <form onSubmit={onSubmit} noValidate>
                      <div className="space-y-4">
                        <label className="block">
                          <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.12em] text-[#6B5E55] [font-family:var(--font-fredoka)]">
                            Email address
                          </span>
                          <span className="relative block">
                            <Mail className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#82AEBB]" />
                            <input
                              type="email"
                              autoComplete="email"
                              autoCapitalize="none"
                              spellCheck={false}
                              placeholder="you@example.com"
                              {...register('email')}
                              className={`h-12 w-full rounded-2xl border bg-[#FFFEFA] pl-11 pr-4 text-sm text-[#51443E] outline-none transition placeholder:text-[#B4A89E] focus:border-[#3399D4] focus:ring-4 focus:ring-[#82C2E5]/20 ${
                                errors.email
                                  ? 'border-[#C9795C]'
                                  : 'border-[#E4D9CD] hover:border-[#C5D9E8]'
                              }`}
                            />
                          </span>
                          {errors.email && (
                            <span className="mt-1.5 block text-xs font-semibold text-[#B85F45]">
                              {errors.email.message}
                            </span>
                          )}
                        </label>

                        <label className="block">
                          <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.12em] text-[#6B5E55] [font-family:var(--font-fredoka)]">
                            Password
                          </span>
                          <span className="relative block">
                            <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#82AEBB]" />
                            <input
                              type={showPassword ? 'text' : 'password'}
                              autoComplete={
                                authMode === 'register' ? 'new-password' : 'current-password'
                              }
                              placeholder="At least 8 characters"
                              {...register('password')}
                              className={`h-12 w-full rounded-2xl border bg-[#FFFEFA] pl-11 pr-12 text-sm text-[#51443E] outline-none transition placeholder:text-[#B4A89E] focus:border-[#3399D4] focus:ring-4 focus:ring-[#82C2E5]/20 ${
                                errors.password
                                  ? 'border-[#C9795C]'
                                  : 'border-[#E4D9CD] hover:border-[#C5D9E8]'
                              }`}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword((visible) => !visible)}
                              aria-label={showPassword ? 'Hide password' : 'Show password'}
                              className="absolute right-2.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-[#897C72] transition hover:bg-[#EAF3F7] hover:text-[#3399D4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3399D4]/40 cursor-pointer"
                            >
                              {showPassword ? (
                                <EyeOff className="h-[17px] w-[17px]" />
                              ) : (
                                <Eye className="h-[17px] w-[17px]" />
                              )}
                            </button>
                          </span>
                          {errors.password && (
                            <span className="mt-1.5 block text-xs font-semibold text-[#B85F45]">
                              {errors.password.message}
                            </span>
                          )}
                        </label>
                      </div>

                      {authError && (
                        <div
                          role="alert"
                          className="mt-4 flex items-start gap-2.5 rounded-2xl border border-[#E7B8A8] bg-[#FFF0E9] px-4 py-3 text-sm leading-relaxed text-[#9F4F39]"
                        >
                          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                          <span>{authError}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="group mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#3399D4] px-6 py-3.5 text-base font-bold text-white shadow-[0_8px_24px_rgba(51,153,212,0.32)] transition hover:-translate-y-0.5 hover:bg-[#2A86BC] hover:shadow-[0_12px_28px_rgba(51,153,212,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3399D4]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF8EF] disabled:cursor-wait disabled:opacity-70 cursor-pointer"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>{authMode === 'register' ? 'Creating account…' : 'Signing in…'}</span>
                          </>
                        ) : (
                          <>
                            <span>{authMode === 'register' ? 'Create account' : 'Sign in with email'}</span>
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                          </>
                        )}
                      </button>
                    </form>

                    <div className="mt-4 flex items-center justify-center gap-1.5 text-center text-[11px] font-medium text-[#897C72]">
                      <LockKeyhole className="h-3.5 w-3.5 text-[#82AEBB]" />
                      <span>One account for orders, updates and happy little adventures.</span>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthToast notice={notice} isOpen={isOpen} onDismiss={dismissNotice} />
    </>
  )
}

function AuthToast({
  notice,
  isOpen,
  onDismiss,
}: {
  notice: string | null
  isOpen: boolean
  onDismiss: () => void
}) {
  useEffect(() => {
    if (!notice || isOpen) return
    const timer = window.setTimeout(onDismiss, 4200)
    return () => window.clearTimeout(timer)
  }, [isOpen, notice, onDismiss])

  return (
    <AnimatePresence>
      {notice && !isOpen && (
        <motion.div
          role="status"
          initial={{ opacity: 0, y: 18, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.97 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-5 left-1/2 z-[130] flex max-w-[calc(100%-2rem)] -translate-x-1/2 items-center gap-2.5 rounded-full border border-white/80 bg-[#3399D4] px-5 py-3 text-sm font-bold text-white shadow-[0_12px_32px_rgba(51,153,212,0.34)]"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span className="text-center leading-snug">{notice}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
