import { useEffect, useState } from 'react'
import TopBar from '@/components/layout/TopBar/TopBar'
import PageContainer from '@/components/layout/PageContainer/PageContainer'
import { useAuthStore } from '@/store/authSlice'
import { fetchUserTickets } from '@/lib/supabase/tickets'
import { formatDate, formatHHMM } from '@/utils/formatTime'
import type { Ticket } from '@/lib/supabase/types'
import TicketHistoryCard from '@/components/tickets/TicketHistoryCard/TicketHistoryCard'
import type { TicketStatus } from '@/components/tickets/TicketHistoryCard/TicketHistoryCard'
import styles from './PurchaseHistoryPage.module.css'

const PurchaseHistoryPage = () => {
  const user = useAuthStore((s) => s.user)
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    fetchUserTickets(user.id).then(({ data }) => {
      setTickets(data ?? [])
      setLoading(false)
    })
  }, [user])

  return (
    <>
      <TopBar title="Історія купівлі" showBack />
      <PageContainer>
        {loading && <p className={styles.status}>Завантаження…</p>}

        {!loading && tickets.length === 0 && (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>🕐</span>
            <p>Покупок ще немає</p>
          </div>
        )}

        {!loading && tickets.length > 0 && (
          <ul className={styles.list} role="list">
            {tickets.map((t) => {
              const now = new Date()
              const isExpired = new Date(t.valid_until) <= now
              const status: TicketStatus = isExpired ? 'used' : t.is_used ? 'active' : 'valid'
              return (
                <li key={t.id}>
                  <TicketHistoryCard
                    title={t.route?.name ?? 'Разовий квиток'}
                    date={`${formatDate(t.purchased_at)} · ${formatHHMM(t.purchased_at)}`}
                    status={status}
                    quantity={t.quantity}
                  />
                </li>
              )
            })}
          </ul>
        )}
      </PageContainer>
    </>
  )
}

export default PurchaseHistoryPage

