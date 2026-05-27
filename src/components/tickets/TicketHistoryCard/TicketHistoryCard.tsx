import styles from './TicketHistoryCard.module.css'

export type TicketStatus = 'valid' | 'active' | 'used'

interface TicketHistoryCardProps {
  title: string
  date: string
  status: TicketStatus
  quantity: number
}

const STATUS_LABEL: Record<TicketStatus, string> = {
  valid: 'Дійсний',
  active: 'Активний',
  used: 'Використаний',
}

const TicketHistoryCard = ({ title, date, status, quantity }: TicketHistoryCardProps) => (
  <div className={styles.card}>
    <div className={styles.left}>
      <span className={styles.title}>{title}</span>
      <span className={styles.date}>{date}</span>
    </div>
    <div className={styles.right}>
      <span className={`${styles.badge} ${styles[status]}`}>{STATUS_LABEL[status]}</span>
      <span className={styles.qty}>{quantity} шт.</span>
    </div>
  </div>
)

export default TicketHistoryCard
