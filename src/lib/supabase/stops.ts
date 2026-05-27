import { supabase } from './client'

export const fetchAllStops = () =>
  supabase.from('stops').select('*')

export const fetchStopsByRoute = (routeId: string) =>
  supabase.from('route_stops').select('*, stop:stops(*)').eq('route_id', routeId).order('stop_order')
