'use client'

import { create } from 'zustand'
import type { AuthUser } from '@/types/auth'

interface AuthState {
  user: AuthUser | null
  isSignInOpen: boolean
  notice: string | null
  authError: string | null
  openSignIn: () => void
  closeSignIn: () => void
  setUser: (user: AuthUser | null) => void
  clearUser: () => void
  setNotice: (notice: string | null) => void
  setAuthError: (authError: string | null) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isSignInOpen: false,
  notice: null,
  authError: null,
  openSignIn: () => set({ isSignInOpen: true, notice: null }),
  closeSignIn: () => set({ isSignInOpen: false }),
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
  setNotice: (notice) => set({ notice }),
  setAuthError: (authError) => set({ authError }),
}))
