import { Button } from '@/components/ui/Button'
import styles from './PaymentMethodCard.module.css'
import { IconCard, IconClose } from '@/assets/Icons'

interface PaymentMethodCardProps {
  label: string
  isDefault?: boolean
  iconColor?: string
  onSetDefault?: () => void
  onDelete?: () => void
}

const PaymentMethodCard = ({ label, isDefault = false, iconColor, onSetDefault, onDelete }: PaymentMethodCardProps) => (
  <div className={styles.card}>
    <span className={styles.icon}><IconCard color={iconColor} /></span>
    <div className={styles.info}>
      <span className={styles.label}>{label}</span>
      {isDefault && <span className={styles.default}>За замовчуванням</span>}
    </div>
    <div className={styles.actions}>
      {!isDefault && onSetDefault && (
        <Button type="button" variant="outline" size="sm" onClick={onSetDefault}>Вибрати</Button>
      )}
      {onDelete && (
        <button type="button" className={styles.deleteBtn} onClick={onDelete} aria-label="Видалити">
          <IconClose size={16} />
        </button>
      )}
    </div>
  </div>
)

export default PaymentMethodCard
