import { supabase } from './client'

export const submitRating = (rating: { user_id: string | null; route_id: string; stars: number; comment: string }) =>
  supabase.from('ratings').insert(rating)

export const fetchComplaintTags = () =>
  supabase.from('complaint_tags').select('*').order('id')

export const submitComplaint = (complaint: { user_id: string | null; route_id: string | null; tag_ids: number[]; description?: string }) =>
  supabase.from('complaints').insert(complaint)

export const submitOccupancyReport = async (routeQuery: string, occupancyLevel: number) => {
  if (!routeQuery.trim()) return { error: null }
  const { data: routes } = await supabase
    .from('routes')
    .select('id')
    .ilike('number', `%${routeQuery.trim()}%`)
    .limit(1)
  if (routes && routes.length > 0) {
    await supabase.from('routes').update({ occupancy_level: occupancyLevel }).eq('id', routes[0].id)
  }
  return { error: null }
}
