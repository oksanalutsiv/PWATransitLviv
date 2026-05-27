import { supabase } from './client'

export const getProfile = (userId: string) =>
  supabase
    .from('profiles')
    .select('id, full_name, email, avatar_url, language, theme, created_at')
    .eq('id', userId)
    .single()

export const updateProfile = (userId: string, patch: { language?: 'uk' | 'en'; theme?: 'light' | 'dark'; full_name?: string }) =>
  supabase
    .from('profiles')
    .update(patch)
    .eq('id', userId)
