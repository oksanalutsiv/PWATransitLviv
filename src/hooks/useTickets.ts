import { useState, useEffect, useCallback } from 'react'
import { useTicketStore } from '@/store/ticketSlice'
import { fetchUserTickets, fetchActiveTicket } from '@/lib/supabase/tickets'
import type { Ticket } from '@/lib/supabase/types'

export const useTickets = (userId: string | null) => {
  const { tickets, activeTicket, setTickets, setActiveTicket } = useTicketStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadTickets = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    setError(null)
    const { data, error: err } = await fetchUserTickets(userId)
    setLoading(false)
    if (err) {
      setError(err.message)
    } else {
      setTickets((data as Ticket[]) ?? [])
    }
  }, [userId, setTickets])

  const loadActiveTicket = useCallback(async () => {
    if (!userId) return
    const { data, error: err } = await fetchActiveTicket(userId)
    if (!err && data) {
      setActiveTicket(data as Ticket)
    } else {
      setActiveTicket(null)
    }
  }, [userId, setActiveTicket])

  useEffect(() => {
    loadTickets()
    loadActiveTicket()
  }, [loadTickets, loadActiveTicket])

  return {
    tickets,
    activeTicket,
    loading,
    error,
    refresh: loadTickets,
    refreshActive: loadActiveTicket,
  }
}
