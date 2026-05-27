import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authSlice'
import { ROUTES } from '@/router/routes'
import logo2 from '@/assets/Icons/Logo2.svg'
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
      <img src={logo2} alt="LvivTransit" width={180} className={styles.logo} />
      <p className={styles.tagline}>Громадський транспорт Львова</p>
      <div className={styles.loader} aria-hidden="true" />
    </div>
  )
}

export default LandingPage
