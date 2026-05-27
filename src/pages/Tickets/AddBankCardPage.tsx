import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '@/components/layout/TopBar/TopBar'
import PageContainer from '@/components/layout/PageContainer/PageContainer'
import { useAuthStore } from '@/store/authSlice'
import { addPaymentMethod } from '@/lib/supabase/payments'
import { validateCardNumber, validateExpiry, validateCVV } from '@/utils/validators'
import { ROUTES } from '@/router/routes'
import { Button } from '@/components/ui/Button'
import styles from './AddCardPage.module.css'

const AddBankCardPage = () => {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const formatCardNumber = (v: string) =>
    v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()

  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 4)
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d
  }

  const handleAdd = async () => {
    const rawCard = cardNumber.replace(/\s/g, '')
    if (!validateCardNumber(rawCard)) { setError('Невірний номер картки'); return }
    if (!validateExpiry(expiry)) { setError('Невірна дата'); return }
    if (!validateCVV(cvv)) { setError('Невірний CVV'); return }
    if (!user) return
    setLoading(true)
    const { error: err } = await addPaymentMethod({
      user_id: user.id,
      type: 'bank_card',
      label: `Карта ···${rawCard.slice(-4)}`,
    })
    if (err) { setError('Помилка. Спробуйте ще раз.'); setLoading(false); return }
    navigate(ROUTES.PAYMENT_METHODS)
  }

  return (
    <>
      <TopBar title="Додати банківську карту" showBack />
      <PageContainer>
        <div className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="card-num">Номер картки</label>
            <input
              id="card-num"
              className={styles.input}
              type="text"
              inputMode="numeric"
              placeholder="0000 0000 0000 0000"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              maxLength={19}
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="card-exp">Термін дії</label>
              <input
                id="card-exp"
                className={styles.input}
                type="text"
                inputMode="numeric"
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                maxLength={5}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="card-cvv">CVV</label>
              <input
                id="card-cvv"
                className={styles.input}
                type="password"
                inputMode="numeric"
                placeholder="•••"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                maxLength={3}
              />
            </div>
          </div>

          {error && <p className={styles.error}>{error}</p>}
          <Button type="button" variant="primary" fullWidth onClick={handleAdd} disabled={loading}>
            {loading ? 'Збереження…' : 'Додати картку'}
          </Button>
        </div>
      </PageContainer>
    </>
  )
}

export default AddBankCardPage
