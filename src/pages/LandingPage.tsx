import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authSlice'
import { ROUTES } from '@/router/routes'
import { IconBus } from '@/assets/Icons'
import styles from './LandingPage.module.css'

const LandingPage = () => {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(user ? ROUTES.MAP : ROUTES.LOGIN, { replace: true })
    }, 1800)
    return () => clearTimeout(timer)
  }, [navigate, user])

  return (
    <div className={styles.splash}>
      <IconBus size={64} className={styles.icon} />
      <h1 className={styles.name}>LvivTransit</h1>
      <p className={styles.tagline}>Громадський транспорт Львова</p>
      <div className={styles.loader} aria-hidden="true" />
    </div>
  )
}

export default LandingPage
