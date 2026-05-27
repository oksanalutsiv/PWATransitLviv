import { useNavigate } from 'react-router-dom'
import styles from './TopBar.module.css'
import { IconArrow } from '@/assets/Icons'

interface TopBarProps {
  title: string
  showBack?: boolean
  action?: React.ReactNode
}

/** Fixed top bar with optional back button, title, and action slot. */
const TopBar = ({ title, showBack = false, action }: TopBarProps) => {
  const navigate = useNavigate()

  return (
    <header className={styles.bar}>
      <div className={styles.left}>
        {showBack && (
          <button
            className={styles.backBtn}
            onClick={() => navigate(-1)}
            aria-label="Назад"
          >
            <IconArrow size={20} style={{ transform: 'rotate(90deg)' }} />
          </button>
        )}
      </div>

      <h1 className={styles.title}>{title}</h1>

      <div className={styles.right}>
        {action ?? null}
      </div>
    </header>
  )
}

export default TopBar
