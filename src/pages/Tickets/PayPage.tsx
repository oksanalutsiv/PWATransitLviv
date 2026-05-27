import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import TopBar from '@/components/layout/TopBar/TopBar'
import PageContainer from '@/components/layout/PageContainer/PageContainer'
import { useAuthStore } from '@/store/authSlice'
import { usePaymentStore } from '@/store/paymentSlice'
import { purchaseTicket } from '@/lib/supabase/tickets'
import { encodeTicketQR } from '@/utils/ticketQR'
import { simulatePayment, extractLast4 } from '@/utils/simulatePayment'
import { fetchPaymentMethods } from '@/lib/supabase/payments'
import { ROUTES } from '@/router/routes'
import { Button } from '@/components/ui/Button'
import SegmentedCard from '@/components/ui/SegmentedCard/SegmentedCard'
import SegmentedRow from '@/components/ui/SegmentedRow/SegmentedRow'
import styles from './PayPage.module.css'
import { IconCard } from '@/assets/Icons'

const PayPage = () => {
  const navigate = useNavigate()
  const { state } = useLocation()
  const user = useAuthStore((s) => s.user)
  const { methods, setMethods } = usePaymentStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Always re-fetch so the selected default is current after visiting PaymentMethodsPage
  useEffect(() => {
    if (!user) return
    fetchPaymentMethods(user.id).then(({ data }) => {
      if (data) setMethods(data)
    })
  }, [user, setMethods])

  const { quantity = 1, hasBaggage = false, total = 18 } = state ?? {}

  const defaultMethod = methods.find((m) => m.is_default) ?? methods[0]

  const handlePay = async () => {
    if (!user) return
    if (!defaultMethod) { setError('Оберіть метод оплати'); return }
    setLoading(true)
    setError('')
    try {
      // Run payment simulation — only bank cards go through the simulator
      if (defaultMethod.type === 'bank_card') {
        const last4 = extractLast4(defaultMethod.label)
        const result = await simulatePayment(last4)
        if (!result.ok) {
          setError(result.reason)
          setLoading(false)
          return
        }
      }

      const validUntil = new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1h
      const qr_payload = encodeTicketQR('pending', user.id, validUntil)
      const { error: err } = await purchaseTicket({
        user_id: user.id,
        route_id: null,
        ticket_type_id: 1,
        quantity,
        has_baggage: hasBaggage,
        valid_until: validUntil,
        qr_payload,
        payment_method_id: defaultMethod?.id ?? '',
      })
      if (err) throw err
      navigate(ROUTES.ACTIVE_TICKET)
    } catch {
      setError('Помилка оплати. Спробуйте ще раз.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <TopBar title="Оплата" showBack />
      <PageContainer>
        <div className={styles.content}>
        <SegmentedCard>
          <SegmentedRow label={`Квитки (${quantity} шт.)`} value={`${quantity * 18} грн`} />
          {hasBaggage && <SegmentedRow label="Багаж" value="18 грн" />}
          <SegmentedRow label="Разом" value={`${total} грн`} bold />
        </SegmentedCard>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Метод оплати</h2>
          {methods.length === 0 ? (
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={() => navigate(ROUTES.PAYMENT_METHODS)}
            >
              + Додати метод оплати
            </Button>
          ) : (
            <div className={styles.methodCard}>
              <span className={styles.methodIcon}>
                <IconCard color={defaultMethod?.type === 'leocard' ? 'var(--color-bus)' : undefined} />
              </span>
              <div className={styles.methodInfo}>
                <span className={styles.methodLabel}>{defaultMethod?.label}</span>
                <span className={styles.methodDefault}>За замовчуванням</span>
              </div>
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate(ROUTES.PAYMENT_METHODS)}
              >
                Змінити
              </Button>
            </div>
          )}
        </section>

        {error && <p className={styles.error}>{error}</p>}

        <Button
          type="button"
          variant="primary"
          fullWidth
          onClick={handlePay}
          disabled={loading || methods.length === 0}
        >
          {loading ? 'Обробка…' : 'Сплатити'}
        </Button>
        </div>
      </PageContainer>
    </>
  )
}

export default PayPage

