import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signIn } from '@/lib/supabase/auth'
import { useAuthStore } from '@/store/authSlice'
import { ROUTES } from '@/router/routes'
import { Button } from '@/components/ui/Button'
import InputField from '@/components/ui/InputField/InputField'
import logo2 from '@/assets/Icons/Logo2.svg'
import styles from './AuthPage.module.css'

const LoginPage = () => {
  const navigate = useNavigate()
  const setUser = useAuthStore((s) => s.setUser)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { data, error: err } = await signIn(email, password)
    if (err) {
      setError('Невірний email або пароль')
      setLoading(false)
      return
    }
    setUser(data.user)
    navigate(ROUTES.MAP)
  }

  return (
    <div className={styles.page}>
      <div className={styles.logoWrap}>
        <img src={logo2} alt="LvivTransit" width={180} className={styles.logo} />
      </div>

      <div className={styles.formHalf}>
      <form className={styles.form} onSubmit={handleLogin} noValidate>
        <h2 className={styles.title}>Увійти в акаунт</h2>

        <div className={styles.fields}>
          <InputField
            id="login-email"
            label="Email"
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={setEmail}
            autoComplete="email"
            required
          />

          <InputField
            id="login-pass"
            label="Пароль"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={setPassword}
            autoComplete="current-password"
            required
          />

          {error && <p className={styles.error} role="alert">{error}</p>}
        </div>

        <Button type="submit" variant="primary" fullWidth disabled={loading} className={styles.submitBtn}>
          {loading ? 'Вхід…' : 'Увійти'}
        </Button>

        <p className={styles.switchText}>
          Немає акаунту?{' '}
          <Link className={styles.switchLink} to={ROUTES.REGISTER}>Зареєструватися</Link>
        </p>
      </form>
      </div>
    </div>
  )
}

export default LoginPage

