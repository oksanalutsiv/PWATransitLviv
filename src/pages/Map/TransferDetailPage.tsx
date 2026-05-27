import { useLocation } from 'react-router-dom'
import TopBar from '@/components/layout/TopBar/TopBar'
import PageContainer from '@/components/layout/PageContainer/PageContainer'
import OccupancyBadge from '@/components/map/OccupancyBadge/OccupancyBadge'
import { IconAccessibility, IconWalking } from '@/assets/Icons'
import { simulateArrival } from '@/utils/simulateArrival'
import { formatMinutes } from '@/utils/formatTime'
import type { TransferPlan } from '@/lib/supabase/types'
import styles from './TransferDetailPage.module.css'

const formatRouteNumber = (n: string) =>
  /[A-Za-zА-Яа-яҐґЄєІіЇї]$/.test(n) ? n.replace(/^([A-Za-zА-Яа-яҐґЄєІіЇї]*)0+(\d)/, '$1$2') : n

const TransferDetailPage = () => {
  const location = useLocation()
  const state = location.state as { plan: TransferPlan; fromQuery: string; toQuery: string } | null

  if (!state?.plan) {
    return <div className={styles.loading}>Маршрут не знайдено</div>
  }

  const { plan, fromQuery = '', toQuery = '' } = state
  const leg2BoardStop = plan.walkToStopName ?? plan.transferStopName

  // Sort both legs' stops
  const leg1Sorted = ((plan.leg1 as any).route_stops ?? []).slice().sort((a: any, b: any) => a.stop_order - b.stop_order)
  const leg2Sorted = ((plan.leg2 as any).route_stops ?? []).slice().sort((a: any, b: any) => a.stop_order - b.stop_order)

  // Leg1: slice from departure stop to transfer stop
  const leg1FromIdx = fromQuery.trim()
    ? Math.max(0, leg1Sorted.findIndex((rs: any) => rs.stop?.name?.toLowerCase().includes(fromQuery.trim().toLowerCase())))
    : 0
  const leg1TransferIdx = leg1Sorted.findIndex((rs: any) =>
    rs.stop?.name?.toLowerCase().includes(plan.transferStopName.toLowerCase())
  )
  const leg1Stops: any[] = leg1Sorted.slice(leg1FromIdx, leg1TransferIdx !== -1 ? leg1TransferIdx + 1 : undefined)

  // Leg2: slice from board stop to destination stop
  const leg2FromIdx = Math.max(
    0,
    leg2Sorted.findIndex((rs: any) => rs.stop?.name?.toLowerCase().includes(leg2BoardStop.toLowerCase()))
  )
  let leg2Stops: any[] = leg2Sorted.slice(leg2FromIdx)
  if (toQuery.trim()) {
    const destIdx = leg2Stops.findIndex((rs: any) =>
      rs.stop?.name?.toLowerCase().includes(toQuery.trim().toLowerCase())
    )
    if (destIdx !== -1) leg2Stops = leg2Stops.slice(0, destIdx + 1)
  }

  // transferOffsetSec: offset to add to leg2 cumulative times so they continue from leg1's end
  const leg1ToTransferSec = leg1TransferIdx !== -1
    ? leg1Sorted.slice(0, leg1TransferIdx + 1).reduce((s: number, r: any) => s + r.avg_travel_time_sec, 0)
    : 0
  const leg2BoardSec = leg2Sorted.slice(0, leg2FromIdx + 1).reduce((s: number, r: any) => s + r.avg_travel_time_sec, 0)
  const transferOffsetSec = Math.max(0, leg1ToTransferSec - leg2BoardSec) + 300

  const TYPE_COLORS: Record<string, string> = {
    bus: 'var(--color-bus)',
    tram: 'var(--color-tram)',
    trolleybus: 'var(--color-trolley)',
  }
  const typeColor1 = TYPE_COLORS[(plan.leg1 as any).transport_type?.name ?? 'bus'] ?? 'var(--color-bus)'
  const typeColor2 = TYPE_COLORS[(plan.leg2 as any).transport_type?.name ?? 'bus'] ?? 'var(--color-bus)'

  return (
    <>
      <TopBar title="Маршрут з пересадкою" showBack />
      <PageContainer>

        {/* Leg 1 header */}
        <div className={styles.legHeader}>
          <span className={styles.badge} style={{ backgroundColor: typeColor1 }}>
            {formatRouteNumber(plan.leg1.number)}
          </span>
          <div className={styles.legHeaderInfo}>
            <h2 className={styles.routeName}>{plan.leg1.name}</h2>
            <div className={styles.headerMeta}>
              <OccupancyBadge level={(plan.leg1 as any).occupancy_level} />
              {(plan.leg1 as any).avg_rating > 0 && (
                <span className={styles.rating}>★ {(plan.leg1 as any).avg_rating.toFixed(1)}</span>
              )}
              {(plan.leg1 as any).is_inclusive && <IconAccessibility size={14} style={{ opacity: 0.5 }} />}
            </div>
          </div>
        </div>

        {/* Leg 1 stops */}
        <section className={styles.stopsSection}>
          <h3 className={styles.sectionTitle}>Зупинки</h3>
          <ol className={styles.stopList}>
            {leg1Stops.map((rs: any, i: number) => {
              const absIdx = leg1FromIdx + i
              const cumulativeSec = leg1Sorted
                .slice(0, absIdx + 1)
                .reduce((s: number, r: any) => s + r.avg_travel_time_sec, 0)
              return (
                <li key={rs.id} className={styles.stopItem}>
                  <div className={styles.timeline}>
                    <div className={`${styles.dot} ${i === 0 ? styles.dotFirst : ''}`} />
                    {i < leg1Stops.length - 1 && <div className={styles.line} />}
                  </div>
                  <div className={styles.stopContent}>
                    <span className={styles.stopName}>{rs.stop?.name}</span>
                    <span className={styles.arrival}>{formatMinutes(simulateArrival(cumulativeSec))}</span>
                  </div>
                </li>
              )
            })}
          </ol>
        </section>

        {/* Transfer divider */}
        <div className={styles.transferDivider}>
          <div className={styles.transferRow}>
            <span className={styles.transferArrow}>↓</span>
            <span className={styles.transferStop}>Пересадка: {plan.transferStopName}</span>
          </div>
          {plan.walkToStopName && (
            <div className={styles.transferRow}>
              <IconWalking size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span className={styles.transferWalk}>Пішки до {plan.walkToStopName}</span>
            </div>
          )}
        </div>

        {/* Leg 2 header */}
        <div className={styles.legHeader}>
          <span className={styles.badge} style={{ backgroundColor: typeColor2 }}>
            {formatRouteNumber(plan.leg2.number)}
          </span>
          <div className={styles.legHeaderInfo}>
            <h2 className={styles.routeName}>{plan.leg2.name}</h2>
            <div className={styles.headerMeta}>
              <OccupancyBadge level={(plan.leg2 as any).occupancy_level} />
              {(plan.leg2 as any).avg_rating > 0 && (
                <span className={styles.rating}>★ {(plan.leg2 as any).avg_rating.toFixed(1)}</span>
              )}
              {(plan.leg2 as any).is_inclusive && <IconAccessibility size={14} style={{ opacity: 0.5 }} />}
            </div>
          </div>
        </div>

        {/* Leg 2 stops */}
        <section className={styles.stopsSection}>
          <h3 className={styles.sectionTitle}>Зупинки</h3>
          <ol className={styles.stopList}>
            {leg2Stops.map((rs: any, i: number) => {
              const absIdx = leg2FromIdx + i
              const cumulativeSec =
                leg2Sorted.slice(0, absIdx + 1).reduce((s: number, r: any) => s + r.avg_travel_time_sec, 0) +
                transferOffsetSec
              return (
                <li key={rs.id} className={styles.stopItem}>
                  <div className={styles.timeline}>
                    <div className={`${styles.dot} ${i === 0 ? styles.dotFirst : ''}`} />
                    {i < leg2Stops.length - 1 && <div className={styles.line} />}
                  </div>
                  <div className={styles.stopContent}>
                    <span className={styles.stopName}>{rs.stop?.name}</span>
                    <span className={styles.arrival}>{formatMinutes(simulateArrival(cumulativeSec))}</span>
                  </div>
                </li>
              )
            })}
          </ol>
        </section>

      </PageContainer>
    </>
  )
}

export default TransferDetailPage
