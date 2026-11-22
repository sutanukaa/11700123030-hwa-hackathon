'use client'

import { create } from 'zustand'

export interface OrderItem {
  name: string
  detail: string
  image: string
  qty: number
  price: string
}

export interface Order {
  orderId: string
  date: string
  status: 'Confirmed' | 'In Production' | 'Out for Delivery' | 'Delivered'
  statusColor: string
  total: string
  items: OrderItem[]
  paymentMethod: string
}

interface OrderStore {
  orders: Order[]
  addOrder: (order: Order) => void
  loadOrders: () => void
  clearOrders: () => void
}

export const useOrderStore = create<OrderStore>((set) => ({
  orders: [],
  addOrder: (newOrder) => {
    set((state) => {
      const updated = [newOrder, ...state.orders]
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('canopy_orders', JSON.stringify(updated))
        } catch {}
      }
      return { orders: updated }
    })
  },
  loadOrders: () => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('canopy_orders')
        if (saved) {
          const parsed = JSON.parse(saved) as Order[]
          // Automatically purge any old hardcoded demo orders
          const realOrders = parsed.filter(
            (o) => o.orderId !== 'CNP-73104' && o.orderId !== 'CNP-84920',
          )
          set({ orders: realOrders })
          localStorage.setItem('canopy_orders', JSON.stringify(realOrders))
        } else {
          set({ orders: [] })
        }
      } catch {}
    }
  },
  clearOrders: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('canopy_orders')
    }
    set({ orders: [] })
  },
}))