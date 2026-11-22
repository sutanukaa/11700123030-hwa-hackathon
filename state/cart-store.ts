'use client'

import { create } from 'zustand'

export interface CartItem {
  id: string
  title: string
  colorName: string
  colorHex: string
  image: string
  price: number
  quantity: number
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, delta: number) => void
  clearCart: () => void
  totalCount: () => number
  totalAmount: () => number
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (newItem) => {
    set((state) => {
      const existingIndex = state.items.findIndex(
        (i) => i.id === newItem.id && i.colorName === newItem.colorName,
      )
      if (existingIndex > -1) {
        const updated = [...state.items]
        updated[existingIndex].quantity += newItem.quantity
        return { items: updated }
      }
      return { items: [...state.items, newItem] }
    })
  },
  removeItem: (id) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }))
  },
  updateQuantity: (id, delta) => {
    set((state) => ({
      items: state.items
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.quantity + delta
            return nextQty > 0 ? { ...item, quantity: nextQty } : null
          }
          return item
        })
        .filter(Boolean) as CartItem[],
    }))
  },
  clearCart: () => set({ items: [] }),
  totalCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
  totalAmount: () =>
    get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
}))