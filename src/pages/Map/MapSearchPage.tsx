import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import MapView from '@/components/map/MapView/MapView'
import InclusivityFilter from '@/components/map/InclusivityFilter/InclusivityFilter'
import LocateButton from '@/components/map/LocateButton/LocateButton'
import RouteSearchGroup from '@/components/map/RouteSearchGroup/RouteSearchGroup'
import { useSearchStore } from '@/store/searchSlice'
import { fetchAllStops } from '@/lib/supabase/stops'
import { searchRoutes, searchRoutesByStops, fetchRoutesByStopId } from '@/lib/supabase/routes'
import type { Stop } from '@/lib/supabase/types'
import { ROUTES } from '@/router/routes'
import styles from './MapSearchPage.module.css'

const MY_LOCATION_LABEL = 'Моє місцезнаходження'

/** Haversine distance in metres */
const distM = (lat1: number, lng1: number, lat2: number, lng2: number) => {
  const R = 6_371_000, toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1), dLng = toRad(lng2 - lng1)
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

const MapSearchPage = () => {
  const navigate = useNavigate()
  const {
    query, fromQuery, inclusiveOnly,
    setQuery, setFromQuery, setInclusiveOnly,
    setResults, setTransferPlans,
    userLocation, setUserLocation,
  } = useSearchStore()
  const [stops, setStops] = useState<Stop[]>([])
  const [locating, setLocating] = useState(false)

  // Reset search fields every time this page mounts
  useEffect(() => {
    setQuery('')
    setFromQuery('')
    setResults([])
    setTransferPlans([])
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Load all stops for map markers on mount
  useEffect(() => {
    fetchAllStops().then(({ data }) => {
      if (data) setStops(data)
    })
  }, [])

  // Silently try to get GPS on first open so the map zooms to the user's area
  useEffect(() => {
    // Use cached position immediately for instant pin, then update with fresh GPS
    if (!userLocation) {
      try {
        const cached = localStorage.getItem('lastLocation')
        if (cached) {
          const loc = JSON.parse(cached)
          if (loc?.lat && loc?.lng) setUserLocation(loc)
        }
      } catch {}
    }
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setUserLocation(loc)
        try { localStorage.setItem('lastLocation', JSON.stringify(loc)) } catch {}
      },
      () => { /* permission denied or unavailable — stay on city view */ },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 }
    )
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleLocate = useCallback(() => {
    if (!navigator.geolocation) {
      alert('Геолокація не підтримується цим браузером')
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setUserLocation(loc)
        setFromQuery(MY_LOCATION_LABEL)
        setLocating(false)
      },
      (err) => {
        setLocating(false)
        if (err.code === 1 /* PERMISSION_DENIED */) {
          alert('Доступ до геолокації відхилено.\nДозвольте доступ у налаштуваннях браузера (🔒 ліворуч від адресного рядка) та спробуйте ще раз.')
        } else if (err.code === 2 /* POSITION_UNAVAILABLE */) {
          alert('Не вдалося визначити місцезнаходження — сигнал недоступний.')
        } else {
          alert('Час очікування геолокації вичерпано. Спробуйте ще раз.')
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    )
  }, [setUserLocation, setFromQuery])

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return

    if (fromQuery.trim()) {
      // Resolve "Моє місцезнаходження" to nearest stop name
      let effectiveFrom = fromQuery
      if (fromQuery === MY_LOCATION_LABEL && userLocation && stops.length > 0) {
        const nearest = stops.reduce((best, s) => {
          const d = distM(userLocation.lat, userLocation.lng, s.lat, s.lng)
          return d < best.d ? { name: s.name, d } : best
        }, { name: '', d: Infinity })
        if (nearest.name) effectiveFrom = nearest.name
      }

      const { data, transfers, error } = await searchRoutesByStops(effectiveFrom, query, inclusiveOnly)
      if (error) console.error('[handleSearch] searchRoutesByStops error:', error)
      setResults(data ?? [])
      setTransferPlans(transfers)
    } else {
      const { data } = await searchRoutes(query, inclusiveOnly)
      setResults(data ?? [])
      setTransferPlans([])
    }
    navigate(ROUTES.ROUTE_LIST)
  }, [query, fromQuery, inclusiveOnly, userLocation, stops, setResults, setTransferPlans, navigate])

  const handleStopClick = useCallback(async (stop: Stop) => {
    const { data } = await fetchRoutesByStopId(stop.id)
    setResults((data ?? []).map(e => e.route))
    setTransferPlans([])
    setFromQuery(stop.name)
    setQuery('')
    navigate(ROUTES.ROUTE_LIST)
  }, [setResults, setTransferPlans, setFromQuery, setQuery, navigate])

  const handleSwap = useCallback(() => {
    const prev = fromQuery
    setFromQuery(query)
    setQuery(prev)
  }, [fromQuery, query, setFromQuery, setQuery])

  return (
    <div className={styles.page}>
      {/* Floating search overlay on top of map */}
      <div className={styles.overlay}>
        <RouteSearchGroup
          fromValue={fromQuery}
          toValue={query}
          onFromChange={setFromQuery}
          onToChange={setQuery}
          onSwap={handleSwap}
          onSubmit={handleSearch}
        />

        <div className={styles.filters}>
          <InclusivityFilter value={inclusiveOnly} onChange={setInclusiveOnly} />
          <LocateButton
            active={fromQuery === MY_LOCATION_LABEL}
            loading={locating}
            onClick={handleLocate}
          />
          <button
            type="button"
            className={styles.searchBtn}
            onClick={handleSearch}
            disabled={!query.trim()}
          >
            Шукати
          </button>
        </div>
      </div>

      {/* Full-bleed Leaflet map */}
      <MapView
        stops={stops}
        routes={[]}
        onStopClick={handleStopClick}
        userLocation={userLocation}
      />
    </div>
  )
}

export default MapSearchPage

