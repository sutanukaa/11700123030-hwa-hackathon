import { create } from 'zustand'

export type CanopyMode = 'idle' | 'explore' | 'unwind'

interface CanopyState {
  mode: CanopyMode
  setMode: (mode: CanopyMode) => void
  ladybugDeparted: boolean
  setLadybugDeparted: (departed: boolean) => void
  resetSession: () => void
}

export const useCanopyStore = create<CanopyState>((set) => ({
  mode: 'idle',
  setMode: (mode) =>
    set((state) => ({
      mode,
      // Reset departure only when returning to the initial idle landing screen
      ...(mode === 'idle' ? { ladybugDeparted: false } : {}),
    })),
  ladybugDeparted: false,
  setLadybugDeparted: (ladybugDeparted) => set({ ladybugDeparted }),
  resetSession: () => set({ mode: 'idle', ladybugDeparted: false }),
}))