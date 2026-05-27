import { create } from 'zustand'

interface UIState {
  isLoading: boolean
  toast: { message: string; type: 'success' | 'error' | 'info' } | null
  setLoading: (val: boolean) => void
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void
  clearToast: () => void
}

export const useUIStore = create<UIState>((set) => ({
  isLoading: false,
  toast: null,
  setLoading: (isLoading) => set({ isLoading }),
  showToast: (message, type = 'info') => set({ toast: { message, type } }),
  clearToast: () => set({ toast: null }),
}))
