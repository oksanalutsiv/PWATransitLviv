import { supabase } from './client'

export const fetchPaymentMethods = (userId: string) =>
  supabase.from('payment_methods').select('*').eq('user_id', userId)

export const addPaymentMethod = (method: { user_id: string; type: 'bank_card' | 'leocard'; label: string }) =>
  supabase.from('payment_methods').insert({ ...method, is_default: false }).select().single()

export const setDefaultPaymentMethod = async (userId: string, methodId: string) => {
  await supabase.from('payment_methods').update({ is_default: false }).eq('user_id', userId)
  return supabase.from('payment_methods').update({ is_default: true }).eq('id', methodId)
}

export const deletePaymentMethod = (methodId: string) =>
  supabase.from('payment_methods').delete().eq('id', methodId)
