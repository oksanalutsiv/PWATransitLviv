import { useEffect, useState } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import TopBar from '@/components/layout/TopBar/TopBar'
import PageContainer from '@/components/layout/PageContainer/PageContainer'
import { IconAccessibility } from '@/assets/Icons'
import { useSearchStore } from '@/store/searchSlice'
import OccupancyBadge from '@/components/map/OccupancyBadge/OccupancyBadge'
import StopList from '@/components/routes/StopList/StopList'
import type { StopItem } from '@/components/routes/StopList/StopList'
import { fetchRouteById } from '@/lib/supabase/routes'
import { simulateArrival } from '@/utils/simulateArrival'
import { formatMinutes } from '@/utils/formatTime'
import type { Route, RouteStop } from '@/lib/supabase/types'
import styles from './RouteDetailPage.module.css'

const formatRouteNumber = (n: string) =>
  /[A-Za-zА-Яа-яҐґЄєІіЇї]$/.test(n) ? n.replace(/^([A-Za-zА-Яа-яҐґЄєІіЇї]*)0+(\d)/, '$1$2') : n

const RouteDetailPage = () => {
  const { routeId } = useParams()
  const location = useLocation()
  const { toQuery, fromQuery: stateFromQuery, transferOffsetSec } = (location.state as { toQuery?: string; fromQuery?: string; transferOffsetSec?: number } | null) ?? {}
  const { fromQuery: storeFromQuery, userLocation } = useSearchStore()
  // Use navigation-state fromQuery if provided (e.g. leg2 of a transfer), otherwise fall back to store
  const fromQuery = stateFromQuery ?? storeFromQuery
  const [route, setRoute] = useState<Route | null>(null)
  const [stops, setStops] = useState<RouteStop[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!routeId) return
    fetchRouteById(routeId).then(({ data }) => {
      if (data) {
        setRoute(data as Route)
        const sorted = ((data as any).route_stops ?? []).slice().sort(
          (a: RouteStop, b: RouteStop) => a.stop_order - b.stop_order
        )
        setStops(sorted)
      }
      setLoading(false)
    })
  }, [routeId])

  if (loading) return <div className={styles.loading}>Завантаження…</div>
  if (!route) return <div className={styles.loading}>Маршрут не знайдено</div>

  const typeName = route.transport_type?.name ?? 'bus'
  const TYPE_COLORS: Record<string, string> = {
    bus: 'var(--color-bus)',
    tram: 'var(--color-tram)',
    trolleybus: 'var(--color-trolley)',
  }
  const typeColor = TYPE_COLORS[typeName] ?? 'var(--color-bus)'

  const MY_LOCATION_LABEL = 'Моє місцезнаходження'
  let departureIndex = -1
  if (fromQuery.trim() === MY_LOCATION_LABEL && userLocation) {
    // Find route stop nearest to the user's GPS position
    let minDist = Infinity
    stops.forEach((rs, i) => {
      if (rs.stop?.lat == null || rs.stop?.lng == null) return
      const dLat = rs.stop.lat - userLocation.lat
      const dLng = rs.stop.lng - userLocation.lng
      const d = dLat * dLat + dLng * dLng
      if (d < minDist) { minDist = d; departureIndex = i }
    })
  } else if (fromQuery.trim()) {
    departureIndex = stops.findIndex(rs =>
      rs.stop?.name?.toLowerCase().includes(fromQuery.trim().toLowerCase())
    )
  }
  const visibleStops = departureIndex > 0 ? stops.slice(departureIndex) : stops

  // Trim stops after the destination stop (if a destination was provided)
  let displayStops = visibleStops
  if (toQuery?.trim()) {
    const destIdx = visibleStops.findIndex(rs =>
      rs.stop?.name?.toLowerCase().includes(toQuery.trim().toLowerCase())
    )
    if (destIdx !== -1) {
      displayStops = visibleStops.slice(0, destIdx + 1)
    }
  }

  return (
    <>
      <TopBar title={`Маршрут ${formatRouteNumber(route.number)}`} showBack />
      <PageContainer>
        {/* Route header */}
        <div className={styles.header}>
          <span className={styles.badge} style={{ backgroundColor: typeColor }}>
            {formatRouteNumber(route.number)}
          </span>
          <div className={styles.headerInfo}>
            <h2 className={styles.routeName}>{route.name}</h2>
            <div className={styles.headerMeta}>
              <OccupancyBadge level={route.occupancy_level} />
              {route.avg_rating > 0 && (
                <span className={styles.rating}>★ {route.avg_rating.toFixed(1)}</span>
              )}
              {route.is_inclusive && <IconAccessibility size={14} style={{ opacity: 0.5 }} />}
            </div>
          </div>
        </div>

        {/* Stop list with simulated arrivals */}
        {displayStops.length > 0 && (
          <section className={styles.stopsSection}>
            <h3 className={styles.sectionTitle}>Зупинки</h3>
            <StopList
              stops={displayStops.map((rs, i) => {
                const absIndex = (departureIndex > 0 ? departureIndex : 0) + i
                const cumulativeSec = stops.slice(0, absIndex + 1).reduce(
                  (sum, s) => sum + s.avg_travel_time_sec, 0
                ) + (transferOffsetSec ?? 0)
                return {
                  id: rs.id,
                  name: rs.stop?.name ?? '',
                  arrival: formatMinutes(simulateArrival(cumulativeSec)),
                } satisfies StopItem
              })}
            />
          </section>
        )}

      </PageContainer>
    </>
  )
}

export default RouteDetailPage

