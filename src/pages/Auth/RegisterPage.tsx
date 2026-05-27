import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signUp } from '@/lib/supabase/auth'
import { useAuthStore } from '@/store/authSlice'
import { validateEmail, validatePassword } from '@/utils/validators'
import { ROUTES } from '@/router/routes'
import { Button } from '@/components/ui/Button'
import InputField from '@/components/ui/InputField/InputField'
import logo2 from '@/assets/Icons/Logo2.svg'
import styles from './AuthPage.module.css'

const RegisterPage = () => {
  const navigate = useNavigate()
  const setUser = useAuthStore((s) => s.setUser)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!validateEmail(email)) { setError('Невірний формат email'); return }
    if (!validatePassword(password)) { setError('Пароль має бути мінімум 8 символів'); return }
    if (password !== confirm) { setError('Паролі не збігаються'); return }
    setLoading(true)
    const { data, error: err } = await signUp(email, password)
    if (err) { setError(err.message); setLoading(false); return }
    setUser(data.user)
    navigate(ROUTES.MAP)
  }

  return (
    <div className={styles.page}>
      <div className={styles.logoWrap}>
        <img src={logo2} alt="LvivTransit" width={180} className={styles.logo} />
      </div>

      <div className={styles.formHalf}>
      <form className={styles.form} onSubmit={handleRegister} noValidate>
        <h2 className={styles.title}>Створити акаунт</h2>

        <div className={styles.fields}>
          <InputField
            id="reg-email"
            label="Email"
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={setEmail}
            autoComplete="email"
            required
          />

          <InputField
            id="reg-pass"
            label="Пароль"
            type="password"
            placeholder="Мін. 8 символів"
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
            required
          />

          <InputField
            id="reg-confirm"
            label="Підтвердіть пароль"
            type="password"
            placeholder="Повторіть пароль"
            value={confirm}
            onChange={setConfirm}
            autoComplete="new-password"
            required
          />

          {error && <p className={styles.error} role="alert">{error}</p>}
        </div>

        <Button type="submit" variant="primary" fullWidth disabled={loading} className={styles.submitBtn}>
          {loading ? 'Реєстрація…' : 'Зареєструватися'}
        </Button>

        <p className={styles.switchText}>
          Вже є акаунт?{' '}
          <Link className={styles.switchLink} to={ROUTES.LOGIN}>Увійти</Link>
        </p>
      </form>
      </div>
    </div>
  )
}

export default RegisterPage

