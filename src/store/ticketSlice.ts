import { create } from 'zustand'
import type { Ticket } from '@/lib/supabase/types'

interface TicketState {
  tickets: Ticket[]
  activeTicket: Ticket | null
  pendingRouteId: string | null
  setPendingRouteId: (id: string | null) => void
  setTickets: (tickets: Ticket[]) => void
  setActiveTicket: (ticket: Ticket | null) => void
}

export const useTicketStore = create<TicketState>((set) => ({
  tickets: [],
  activeTicket: null,
  pendingRouteId: null,
  setPendingRouteId: (pendingRouteId) => set({ pendingRouteId }),
  setTickets: (tickets) => set({ tickets }),
  setActiveTicket: (activeTicket) => set({ activeTicket }),
}))
