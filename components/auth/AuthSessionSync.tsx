'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/state/auth-store'
import { useCanopyStore } from '@/state/canopy-store'
import type { CanopyMode } from '@/state/canopy-store'

const AUTH_ERRORS: Record<string, string> = {
  google_not_configured:
    'Google sign-in is not available yet. You can continue with your email instead.',
  google_cancelled: 'Google sign-in was cancelled. You can try again whenever you are ready.',
  google_state_invalid:
    'Your Google sign-in session expired. Please start again from this window.',
  google_exchange_failed:
    'Google could not finish signing you in. Please try again or use email.',
  google_profile_failed:
    'We could not read your Google profile. Please try another sign-in option.',
}

export function AuthSessionSync() {
  const setUser = useAuthStore((state) => state.setUser)
  const setNotice = useAuthStore((state) => state.setNotice)
  const setAuthError = useAuthStore((state) => state.setAuthError)
  const openSignIn = useAuthStore((state) => state.openSignIn)
  const setMode = useCanopyStore((state) => state.setMode)

  useEffect(() => {
    let isActive = true

    const syncSession = async () => {
      const searchParams = new URLSearchParams(window.location.search)
      const authStatus = searchParams.get('auth')
      const reason = searchParams.get('reason')

      if (authStatus === 'success') {
        const savedMode = window.localStorage.getItem('canopy-auth-return-mode')
        window.localStorage.removeItem('canopy-auth-return-mode')
        const nextMode: CanopyMode =
          savedMode === 'explore' || savedMode === 'unwind' ? savedMode : 'explore'
        setMode(nextMode)
      }

      try {
        const response = await fetch('/api/auth/session', { cache: 'no-store' })
        if (!response.ok) return

        const data = (await response.json()) as {
          user: import('@/types/auth').AuthUser | null
        }
        if (!isActive || !data.user) return

        setUser(data.user)
        if (authStatus === 'success') {
          setNotice(
            data.user.provider === 'google'
              ? 'Signed in with Google. Welcome to CANOPY.'
              : 'Welcome back to CANOPY.',
          )
        }
      } catch {
        return
      } finally {
        if (isActive && authStatus === 'error') {
          setAuthError(
            AUTH_ERRORS[reason || ''] ||
              'We could not finish signing you in. Please try again.',
          )
          openSignIn()
        }

        if (isActive && (authStatus === 'success' || authStatus === 'error')) {
          window.history.replaceState(
            {},
            '',
            `${window.location.pathname}${window.location.hash}`,
          )
        }
      }
    }

    void syncSession()

    return () => {
      isActive = false
    }
  }, [openSignIn, setAuthError, setMode, setNotice, setUser])

  return null
}
