import { create } from 'zustand'

export type CanopyMode = 'idle' | 'explore' | 'unwind'

interface CanopyState {
  mode: CanopyMode
  setMode: (mode: CanopyMode) => void
}

export const useCanopyStore = create<CanopyState>((set) => ({
  mode: 'idle',
  setMode: (mode) => set({ mode }),
}))