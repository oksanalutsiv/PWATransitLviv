import { create } from 'zustand'
import type { PaymentMethod } from '@/lib/supabase/types'

interface PaymentState {
  methods: PaymentMethod[]
  selectedMethodId: string | null
  setMethods: (methods: PaymentMethod[]) => void
  setSelectedMethodId: (id: string | null) => void
}

export const usePaymentStore = create<PaymentState>((set) => ({
  methods: [],
  selectedMethodId: null,
  setMethods: (methods) => set({ methods }),
  setSelectedMethodId: (selectedMethodId) => set({ selectedMethodId }),
}))
