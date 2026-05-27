import { useNavigate } from 'react-router-dom'
import TopBar from '@/components/layout/TopBar/TopBar'
import PageContainer from '@/components/layout/PageContainer/PageContainer'
import { useTicketStore } from '@/store/ticketSlice'
import { ROUTES } from '@/router/routes'
import styles from './BuyTicketsPage.module.css'

const TRANSPORT_OPTIONS = [
  { label: 'Автобус', icon: '🚌', color: 'var(--color-bus)' },
  { label: 'Трамвай', icon: '🚃', color: 'var(--color-tram)' },
  { label: 'Тролейбус', icon: '🚎', color: 'var(--color-trolley)' },
]

const BuyTicketsPage = () => {
  const navigate = useNavigate()
  const setPendingRouteId = useTicketStore((s) => s.setPendingRouteId)

  const handleSelect = () => {
    setPendingRouteId(null)
    navigate(ROUTES.TICKET_QUANTITY)
  }

  return (
    <>
      <TopBar title="Купити квиток" showBack />
      <PageContainer>
        <p className={styles.subtitle}>Оберіть тип транспорту</p>
        <ul className={styles.list} role="list">
          {TRANSPORT_OPTIONS.map(({ label, icon, color }) => (
            <li key={label}>
              <button
                type="button"
                className={styles.option}
                style={{ '--accent': color } as React.CSSProperties}
                onClick={handleSelect}
              >
                <span className={styles.optionIcon}>{icon}</span>
                <span className={styles.optionLabel}>{label}</span>
                <svg className={styles.chevron} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      </PageContainer>
    </>
  )
}

export default BuyTicketsPage

