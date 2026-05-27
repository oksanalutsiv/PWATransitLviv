import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '@/components/layout/TopBar/TopBar'
import PageContainer from '@/components/layout/PageContainer/PageContainer'
import { useAuthStore } from '@/store/authSlice'
import { addPaymentMethod } from '@/lib/supabase/payments'
import { ROUTES } from '@/router/routes'
import { Button } from '@/components/ui/Button'
import styles from './AddCardPage.module.css'

const AddLeoCardPage = () => {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const [cardNumber, setCardNumber] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAdd = async () => {
    if (cardNumber.trim().length < 8) { setError('Введіть номер Леокарту'); return }
    if (!user) return
    setLoading(true)
    const { error: err } = await addPaymentMethod({
      user_id: user.id,
      type: 'leocard',
      label: `Леокарт ···${cardNumber.slice(-4)}`,
    })
    if (err) { setError('Помилка. Спробуйте ще раз.'); setLoading(false); return }
    navigate(ROUTES.PAYMENT_METHODS)
  }

  return (
    <>
      <TopBar title="Додати Леокарт" showBack />
      <PageContainer>
        <div className={styles.form}>
          <label className={styles.label} htmlFor="leocard-num">Номер Леокарту</label>
          <input
            id="leocard-num"
            className={styles.input}
            type="text"
            inputMode="numeric"
            placeholder="0000 0000 0000"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
            maxLength={16}
          />
          {error && <p className={styles.error}>{error}</p>}
          <Button type="button" variant="primary" fullWidth onClick={handleAdd} disabled={loading}>
            {loading ? 'Збереження…' : 'Додати'}
          </Button>
        </div>
      </PageContainer>
    </>
  )
}

export default AddLeoCardPage
