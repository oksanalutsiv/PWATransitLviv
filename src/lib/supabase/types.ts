// Shared TypeScript types mirroring the Supabase DB schema

export interface Profile {
  id: string
  full_name: string
  email: string
  avatar_url: string | null
  language: 'uk' | 'en'
  theme: 'light' | 'dark'
  created_at: string
}

export interface TransportType {
  id: number
  name: 'bus' | 'tram' | 'trolleybus'
  color_hex: string
}

export interface Route {
  id: string
  number: string
  name: string
  type_id: number
  is_active: boolean
  occupancy_level: 1 | 2 | 3
  is_inclusive: boolean
  avg_rating: number
  transport_type?: TransportType
}

export interface Stop {
  id: string
  name: string
  name_en: string
  lat: number
  lng: number
}

export interface RouteStop {
  id: string
  route_id: string
  stop_id: string
  stop_order: number
  avg_travel_time_sec: number
  stop?: Stop
}

export interface TicketType {
  id: number
  name: string
  price_uah: number
}

export interface Ticket {
  id: string
  user_id: string
  route_id: string | null
  ticket_type_id: number
  quantity: number
  has_baggage: boolean
  purchased_at: string
  valid_until: string
  qr_payload: string
  is_used: boolean
  payment_method_id: string
  ticket_type?: TicketType
  route?: Route
}

export interface PaymentMethod {
  id: string
  user_id: string
  type: 'bank_card' | 'leocard'
  label: string
  is_default: boolean
  created_at: string
}

export interface TransferPlan {
  leg1: Route & { route_stops?: any[] }
  transferStopName: string
  /** Set only when the transfer requires a short walk between two nearby stops */
  walkToStopName?: string
  leg2: Route & { route_stops?: any[] }
}

export interface Rating {
  id: string
  user_id: string | null
  route_id: string
  comfort: number
  cleanliness: number
  driver: number
  created_at: string
}

export interface ComplaintTag {
  id: number
  label_uk: string
}

export interface Complaint {
  id: string
  user_id: string | null
  route_id: string | null
  tag_ids: number[]
  created_at: string
}
