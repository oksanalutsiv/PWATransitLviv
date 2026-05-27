import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '@/components/layout/TopBar/TopBar'
import PageContainer from '@/components/layout/PageContainer/PageContainer'
import { useAuthStore } from '@/store/authSlice'
import { usePaymentStore } from '@/store/paymentSlice'
import { fetchPaymentMethods, setDefaultPaymentMethod, deletePaymentMethod } from '@/lib/supabase/payments'
import { ROUTES } from '@/router/routes'
import { Button } from '@/components/ui/Button'
import PaymentMethodCard from '@/components/payment/PaymentMethodCard/PaymentMethodCard'
import styles from './PaymentMethodsPage.module.css'

const PaymentMethodsPage = () => {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const { methods, setMethods } = usePaymentStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    fetchPaymentMethods(user.id).then(({ data }) => {
      setMethods(data ?? [])
      setLoading(false)
    })
  }, [user, setMethods])

  const handleSetDefault = async (id: string) => {
    if (!user) return
    await setDefaultPaymentMethod(user.id, id)
    setMethods(methods.map((m) => ({ ...m, is_default: m.id === id })))
  }

  const handleDelete = async (id: string) => {
    await deletePaymentMethod(id)
    setMethods(methods.filter((m) => m.id !== id))
  }

  return (
    <>
      <TopBar title="Методи оплати" showBack />
      <PageContainer>
        {loading && <p className={styles.status}>Завантаження…</p>}

        {!loading && methods.length === 0 && (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>💳</span>
            <p>Методів оплати ще немає</p>
          </div>
        )}

        {!loading && (
          <div className={styles.content}>
            <div className={styles.section}>
              <div className={styles.sectionFields}>
              <h2 className={styles.sectionTitle}>Банківська карта</h2>
              {methods.filter((m) => m.type !== 'leocard').length > 0 && (
                <ul className={styles.list} role="list">
                  {methods.filter((m) => m.type !== 'leocard').map((m) => (
                    <li key={m.id}>
                      <PaymentMethodCard
                        label={m.label}
                        isDefault={m.is_default}
                        onSetDefault={() => handleSetDefault(m.id)}
                        onDelete={() => handleDelete(m.id)}
                      />
                    </li>
                  ))}
                </ul>
              )}
              </div>
              <Button type="button" variant="outline" fullWidth className={styles.addBtn} onClick={() => navigate(ROUTES.ADD_BANK_CARD)}>
                Додати банківську карту
              </Button>
            </div>

            <div className={styles.section}>
              <div className={styles.sectionFields}>
              <h2 className={styles.sectionTitle}>Леокарт</h2>
              {methods.filter((m) => m.type === 'leocard').length > 0 && (
                <ul className={styles.list} role="list">
                  {methods.filter((m) => m.type === 'leocard').map((m) => (
                    <li key={m.id}>
                      <PaymentMethodCard
                        label={m.label}
                        isDefault={m.is_default}
                        iconColor="var(--color-bus)"
                        onSetDefault={() => handleSetDefault(m.id)}
                        onDelete={() => handleDelete(m.id)}
                      />
                    </li>
                  ))}
                </ul>
              )}
              </div>
              <Button type="button" variant="outline" fullWidth className={styles.addBtn} onClick={() => navigate(ROUTES.ADD_LEOCARD)}>
                Додати Леокарт
              </Button>
            </div>
          </div>
        )}
      </PageContainer>
    </>
  )
}

export default PaymentMethodsPage
