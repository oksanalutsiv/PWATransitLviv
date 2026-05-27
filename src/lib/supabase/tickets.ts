import { supabase } from './client'

export const fetchUserTickets = (userId: string) =>
  supabase.from('tickets').select('*, ticket_type:ticket_types(*), route:routes(*)').eq('user_id', userId).order('purchased_at', { ascending: false })

export const fetchActiveTicket = (userId: string) =>
  supabase.from('tickets').select('*, ticket_type:ticket_types(*), route:routes(*)').eq('user_id', userId).eq('is_used', false).gte('valid_until', new Date().toISOString()).limit(1).single()

export const fetchAnyValidTicket = (userId: string) =>
  supabase.from('tickets').select('id').eq('user_id', userId).gte('valid_until', new Date().toISOString()).limit(1).single()

export const purchaseTicket = (ticket: {
  user_id: string
  route_id: string | null
  ticket_type_id: number
  quantity: number
  has_baggage: boolean
  valid_until: string
  qr_payload: string
  payment_method_id: string
}) => supabase.from('tickets').insert(ticket).select().single()

export const markTicketUsed = (ticketId: string) =>
  supabase.from('tickets').update({ is_used: true }).eq('id', ticketId)
