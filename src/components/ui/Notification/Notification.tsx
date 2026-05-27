import styles from './Notification.module.css'
import { IconCheck } from '@/assets/Icons'

interface NotificationProps {
  message: string
  className?: string
}

const Notification = ({ message, className }: NotificationProps) => (
  <div className={`${styles.notification}${className ? ` ${className}` : ''}`}>
    <IconCheck size={16} />
    {message}
  </div>
)

export default Notification
