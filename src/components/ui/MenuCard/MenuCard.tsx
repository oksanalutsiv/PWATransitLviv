import styles from './MenuCard.module.css'

interface MenuCardItem {
  icon: React.ReactNode
  label: string
  onClick: () => void
  disabled?: boolean
}

interface MenuCardProps {
  items: MenuCardItem[]
}

const MenuCard = ({ items }: MenuCardProps) => (
  <div className={styles.list}>
    {items.map((item, i) => (
      <button
        key={i}
        type="button"
        className={styles.card}
        onClick={item.onClick}
        disabled={item.disabled}
      >
        <span className={styles.icon}>{item.icon}</span>
        <span className={styles.label}>{item.label}</span>
      </button>
    ))}
  </div>
)

export default MenuCard
