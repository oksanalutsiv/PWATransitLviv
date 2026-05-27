import QuantityCounter from '@/components/ui/QuantityCounter/QuantityCounter'
import styles from './QuantityCard.module.css'

interface QuantityCardProps {
  title: string
  quantity: number
  onQuantityChange: (v: number) => void
  unitPrice: number
  unitLabel?: string
  min?: number
  max?: number
}

/** Section card with a title, quantity stepper, and unit price row. */
const QuantityCard = ({
  title,
  quantity,
  onQuantityChange,
  unitPrice,
  unitLabel = 'Ціна за квиток',
  min = 0,
  max = 10,
}: QuantityCardProps) => (
  <section className={styles.card}>
    <h2 className={styles.title}>{title}</h2>
    <div className={styles.row}>
      <span className={styles.label}>Кількість</span>
      <QuantityCounter value={quantity} onChange={onQuantityChange} min={min} max={max} />
    </div>
    <div className={styles.priceRow}>
      <span className={styles.label}>{unitLabel}</span>
      <span className={styles.price}>{unitPrice} грн</span>
    </div>
  </section>
)

export default QuantityCard
