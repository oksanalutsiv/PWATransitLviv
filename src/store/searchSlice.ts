import { create } from 'zustand'
import type { Route, TransferPlan } from '@/lib/supabase/types'

export interface LatLng { lat: number; lng: number }

interface SearchState {
  query: string
  fromQuery: string
  inclusiveOnly: boolean
  results: Route[]
  transferPlans: TransferPlan[]
  userLocation: LatLng | null
  setQuery: (query: string) => void
  setFromQuery: (fromQuery: string) => void
  setInclusiveOnly: (val: boolean) => void
  setResults: (results: Route[]) => void
  setTransferPlans: (plans: TransferPlan[]) => void
  setUserLocation: (loc: LatLng | null) => void
}

export const useSearchStore = create<SearchState>((set) => ({
  query: '',
  fromQuery: '',
  inclusiveOnly: false,
  results: [],
  transferPlans: [],
  userLocation: null,
  setQuery: (query) => set({ query }),
  setFromQuery: (fromQuery) => set({ fromQuery }),
  setInclusiveOnly: (inclusiveOnly) => set({ inclusiveOnly }),
  setResults: (results) => set({ results }),
  setTransferPlans: (transferPlans) => set({ transferPlans }),
  setUserLocation: (userLocation) => set({ userLocation }),
}))
