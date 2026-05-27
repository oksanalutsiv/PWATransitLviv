import { useEffect, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import TopBar from '@/components/layout/TopBar/TopBar'
import PageContainer from '@/components/layout/PageContainer/PageContainer'
import { useAuthStore } from '@/store/authSlice'
import { fetchActiveTicket } from '@/lib/supabase/tickets'
import { formatDate, formatHHMM } from '@/utils/formatTime'
import type { Ticket } from '@/lib/supabase/types'
import styles from './ActiveTicketPage.module.css'

const ActiveTicketPage = () => {
  const user = useAuthStore((s) => s.user)
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    fetchActiveTicket(user.id).then(({ data }) => {
      setTicket(data)
      setLoading(false)
    })
  }, [user])

  return (
    <>
      <TopBar title="Активний квиток" showBack />
      <PageContainer>
        {loading && <p className={styles.status}>Завантаження…</p>}

        {!loading && !ticket && (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>
              <svg width="48" height="48" viewBox="0 0 64 64" fill="none" aria-hidden="true">
                <path d="M22.2373 39.1289C23.6661 39.1292 24.8291 40.2823 24.8291 41.71V44.1367C24.8291 45.5644 23.6661 46.7175 22.2373 46.7178C20.8083 46.7178 19.6445 45.5646 19.6445 44.1367V41.71C19.6445 40.2821 20.8083 39.1289 22.2373 39.1289Z" fill="currentColor"/>
                <path d="M22.2373 28.2061C23.666 28.2063 24.829 29.3585 24.8291 30.7861V33.2139C24.829 34.6415 23.666 35.7937 22.2373 35.7939C20.8084 35.7939 19.6446 34.6416 19.6445 33.2139V30.7861C19.6446 29.3584 20.8084 28.2061 22.2373 28.2061Z" fill="currentColor"/>
                <path d="M22.2373 17.2822C23.6661 17.2825 24.8291 18.4356 24.8291 19.8633V22.29C24.8291 23.7177 23.6661 24.8708 22.2373 24.8711C20.8083 24.8711 19.6445 23.7179 19.6445 22.29V19.8633C19.6445 18.4354 20.8083 17.2822 22.2373 17.2822Z" fill="currentColor"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M44.6924 10C46.7003 10 48.3621 9.99864 49.7129 10.1084C51.0076 10.2136 52.2161 10.4321 53.3584 10.9639L53.5859 11.0742L53.5938 11.0791L53.9229 11.2529L53.9316 11.2578C55.5321 12.1498 56.8528 13.4668 57.7461 15.0615L57.9189 15.3838L57.9229 15.3926L58.0264 15.6035L58.0303 15.6104C58.5656 16.7474 58.7858 17.9505 58.8916 19.2383C59.002 20.582 59 22.2349 59 24.2314V39.7686C59 41.7651 59.002 43.418 58.8916 44.7617C58.7858 46.0496 58.5655 47.2526 58.0303 48.3896L58.0264 48.3965L57.9229 48.6074L57.9189 48.6162C57.0274 50.3563 55.638 51.7909 53.9307 52.7422L53.9219 52.7471L53.5947 52.9209L53.5859 52.9258C52.3768 53.5384 51.0937 53.7794 49.7129 53.8916C48.3621 54.0014 46.7003 54 44.6924 54H19.3076C17.2997 54 15.6379 54.0014 14.2871 53.8916C12.9928 53.7864 11.784 53.5681 10.6416 53.0361L10.6348 53.0322L10.4219 52.9297L10.4141 52.9258C8.66557 52.0398 7.22269 50.6585 6.26563 48.96L6.26074 48.9512L6.08496 48.624L6.08106 48.6162C5.46458 47.4128 5.22131 46.1356 5.1084 44.7617C4.99801 43.4181 5 41.7652 5 39.7686V24.2314C5 22.2349 4.99801 20.582 5.1084 19.2383C5.22131 17.8644 5.46452 16.5872 6.08106 15.3838C7.03195 13.5279 8.54893 12.0194 10.4141 11.0742C11.6231 10.4615 12.9063 10.2206 14.2871 10.1084C15.6379 9.99864 17.2997 10 19.3076 10H44.6924ZM19.3076 15.1611C17.2147 15.1611 15.8009 15.1633 14.71 15.252C13.649 15.3382 13.1227 15.4939 12.7656 15.6748C11.8756 16.1259 11.1523 16.8452 10.6992 17.7295C10.5178 18.0837 10.362 18.6058 10.2754 19.6602C10.1863 20.7446 10.1846 22.1501 10.1846 24.2314V39.7686C10.1846 41.8499 10.1863 43.2554 10.2754 44.3398C10.362 45.3941 10.5178 45.9162 10.6992 46.2705C11.1521 47.1544 11.8751 47.8731 12.7647 48.3242L12.9229 48.3975C13.276 48.5466 13.7921 48.6735 14.71 48.748C15.8009 48.8367 17.2147 48.8389 19.3076 48.8389H44.6924C46.7853 48.8389 48.1991 48.8367 49.29 48.748C50.3509 48.6618 50.8772 48.5062 51.2344 48.3252C52.1244 47.8741 52.8478 47.1548 53.3008 46.2705C53.4823 45.9162 53.638 45.3942 53.7246 44.3398C53.8137 43.2554 53.8154 41.8499 53.8154 39.7686V24.2314C53.8154 22.1501 53.8137 20.7446 53.7246 19.6602C53.6487 18.7365 53.5192 18.2228 53.3672 17.8721L53.293 17.7148C52.8395 16.8374 52.1194 16.1234 51.2344 15.6748C50.8772 15.4938 50.3509 15.3382 49.29 15.252C48.1991 15.1633 46.7853 15.1611 44.6924 15.1611H19.3076Z" fill="currentColor"/>
              </svg>
            </span>
            <div className={styles.emptyText}>
              <p>Активних квитків немає</p>
              <p className={styles.hint}>Придбайте квиток, щоб він з'явився тут</p>
            </div>
          </div>
        )}

        {!loading && ticket && (
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>Квиток</span>
              <span className={styles.cardValid}>
                Дійсний до {formatHHMM(ticket.valid_until)} · {formatDate(ticket.valid_until)}
              </span>
            </div>

            <div className={styles.qrBlock}>
              <div className={styles.qrWrap}>
                <QRCodeSVG
                  value={ticket.qr_payload}
                  size={200}
                  bgColor="#ffffff"
                  fgColor="#141414"
                  level="M"
                />
              </div>

            <div className={styles.meta}>
              {ticket.route && (
                <div className={styles.metaRow}>
                  <span className={styles.metaKey}>Маршрут</span>
                  <span className={styles.metaVal}>{ticket.route.name}</span>
                </div>
              )}
              <div className={styles.metaRow}>
                <span className={styles.metaKey}>Кількість</span>
                <span className={styles.metaVal}>{ticket.quantity} шт.</span>
              </div>
              {ticket.has_baggage && (
                <div className={styles.metaRow}>
                  <span className={styles.metaKey}>Багаж</span>
                  <span className={styles.metaVal}>Включено ✓</span>
                </div>
              )}
            </div>
            </div>

            <p className={styles.scanHint}>Покажіть QR-код контролеру для перевірки</p>
          </div>
        )}
      </PageContainer>
    </>
  )
}

export default ActiveTicketPage

