import { useNavigate } from 'react-router-dom'
import TopBar from '@/components/layout/TopBar/TopBar'
import PageContainer from '@/components/layout/PageContainer/PageContainer'
import RouteCard from '@/components/routes/RouteCard/RouteCard'
import Divider from '@/components/ui/Divider/Divider'
import { useSearchStore } from '@/store/searchSlice'
import { useArrival } from '@/hooks/useArrival'
import type { Route, TransferPlan } from '@/lib/supabase/types'
import { ROUTES } from '@/router/routes'
import styles from './RouteListPage.module.css'
import { IconArrow, IconWalking } from '@/assets/Icons'

const formatRouteNumber = (n: string) =>
  /[A-Za-zА-Яа-яҐґЄєІіЇї]$/.test(n) ? n.replace(/^([A-Za-zА-Яа-яҐґЄєІіЇї]*)0+(\d)/, '$1$2') : n

const MY_LOCATION_LABEL = 'Моє місцезнаходження'

type RawRouteStop = { stop_order: number; avg_travel_time_sec: number; stop: { name: string; lat?: number; lng?: number } | null }

const getDepartureSeed = (route: any, fromQuery: string, userLocation?: { lat: number; lng: number } | null): number | null => {
  const routeStops: RawRouteStop[] = route.route_stops ?? []
  if (!routeStops.length) return null

  const sorted = routeStops.slice().sort((a, b) => a.stop_order - b.stop_order)

  if (fromQuery.trim() === MY_LOCATION_LABEL && userLocation) {
    // Find the nearest stop to the user's GPS position
    let minDist = Infinity
    let matchIdx = -1
    sorted.forEach((rs, i) => {
      if (rs.stop?.lat == null || rs.stop?.lng == null) return
      const dLat = rs.stop.lat - userLocation.lat
      const dLng = rs.stop.lng - userLocation.lng
      const d = dLat * dLat + dLng * dLng
      if (d < minDist) { minDist = d; matchIdx = i }
    })
    if (matchIdx !== -1) {
      return sorted.slice(0, matchIdx + 1).reduce((sum, rs) => sum + rs.avg_travel_time_sec, 0)
    }
  } else if (fromQuery.trim()) {
    const fromLow = fromQuery.toLowerCase()
    const matchIdx = sorted.findIndex(rs => rs.stop?.name?.toLowerCase().includes(fromLow))
    if (matchIdx !== -1) {
      // Cumulative travel time to the FROM stop — same calculation as RouteDetailPage
      return sorted.slice(0, matchIdx + 1).reduce((sum, rs) => sum + rs.avg_travel_time_sec, 0)
    }
  }

  const first = sorted[0]
  return first ? first.avg_travel_time_sec : null
}

const RouteListItem = ({
  route,
  onSelect,
  departureSeed,
}: {
  route: Route
  onSelect: (r: Route) => void
  departureSeed: number | null
}) => {
  const minutesAway = useArrival(departureSeed)
  return <RouteCard route={route} onClick={onSelect} minutesAway={minutesAway} />
}

const TYPE_COLORS: Record<string, string> = {
  bus: 'var(--color-bus)',
  tram: 'var(--color-tram)',
  trolleybus: 'var(--color-trolley)',
}

const TransferCard = ({ plan, onSelect, fromQuery, userLocation }: { plan: TransferPlan; onSelect: (plan: TransferPlan) => void; fromQuery: string; userLocation: { lat: number; lng: number } | null }) => {
  const c1 = TYPE_COLORS[plan.leg1.transport_type?.name ?? 'bus'] ?? 'var(--color-primary)'
  const c2 = TYPE_COLORS[plan.leg2.transport_type?.name ?? 'bus'] ?? 'var(--color-primary)'
  const departureSeed = getDepartureSeed(plan.leg1, fromQuery, userLocation)
  const minutesAway = useArrival(departureSeed)
  return (
    <button type="button" className={styles.transferCard} onClick={() => onSelect(plan)}>
      <div className={styles.transferLeg}>
        <span className={styles.number} style={{ backgroundColor: c1 }}>{formatRouteNumber(plan.leg1.number)}</span>
        <span className={styles.legName}>{plan.leg1.name}</span>
        {minutesAway != null && (
          <span className={styles.transferArrival} aria-label={`Прибуття через ${minutesAway} хв`}>~{minutesAway} хв</span>
        )}
        <IconArrow size={16} className={styles.chevron} />
      </div>
      <Divider className={styles.insetDivider} />
      <div className={styles.transferBadge}>
        <span className={styles.transferArrow}>↓</span>
        <span className={styles.transferStop}>Пересадка: {plan.transferStopName}</span>
        {plan.walkToStopName && (
          <span className={styles.transferWalk}><IconWalking size={14} style={{ flexShrink: 0, marginTop: '2px' }} /> Пішки до {plan.walkToStopName}</span>
        )}
      </div>
      <Divider className={styles.insetDivider} />
      <div className={styles.transferLeg}>
        <span className={styles.number} style={{ backgroundColor: c2 }}>{formatRouteNumber(plan.leg2.number)}</span>
        <span className={styles.legName}>{plan.leg2.name}</span>
      </div>
    </button>
  )
}

const RouteListPage = () => {
  const navigate = useNavigate()
  const { results, transferPlans, query, fromQuery, userLocation } = useSearchStore()

  const handleSelect = (route: Route) => {
    navigate(ROUTES.ROUTE_DETAIL.replace(':routeId', route.id), { state: { toQuery: query } })
  }

  const handleSelectTransfer = (plan: TransferPlan) => {
    navigate(ROUTES.TRANSFER_DETAIL, { state: { plan, fromQuery, toQuery: query } })
  }

  const showTransfers = results.length === 0 && transferPlans.length > 0
  const hasAny = results.length > 0 || showTransfers

  // Build context label based on search type
  let searchContext: string | null = null
  if (fromQuery && query) {
    searchContext = `${fromQuery} — ${query}`
  } else if (fromQuery && !query) {
    searchContext = fromQuery
  }

  return (
    <>
      <TopBar
        title='Маршрути'
        showBack
      />
      <PageContainer>
        {!hasAny ? (
          <div className={styles.empty}>
            <p>Маршрути не знайдено</p>
            <p className={styles.hint}>Спробуйте змінити запит або вимкніть фільтр доступності</p>
          </div>
        ) : (
          <>
            {searchContext && (
              <p className={styles.searchContext}>{searchContext}</p>
            )}
            {results.length > 0 && (
              <>
                {showTransfers && results.length > 0 && (
                  <p className={styles.sectionLabel}>Прямі маршрути</p>
                )}
                <ul className={styles.list} role="list">
                  {results.map((route) => (
                    <li key={route.id}>
                      <RouteListItem
                        route={route}
                        onSelect={handleSelect}
                        departureSeed={getDepartureSeed(route, fromQuery, userLocation)}
                      />
                    </li>
                  ))}
                </ul>
              </>
            )}
            {showTransfers && (
              <>
                <p className={styles.sectionLabel}>З пересадкою</p>
                <ul className={styles.list} role="list">
                  {transferPlans.map((plan, i) => (
                    <li key={i}>
                      <TransferCard plan={plan} onSelect={handleSelectTransfer} fromQuery={fromQuery} userLocation={userLocation} />
                    </li>
                  ))}
                </ul>
              </>
            )}
          </>
        )}
      </PageContainer>
    </>
  )
}

export default RouteListPage

