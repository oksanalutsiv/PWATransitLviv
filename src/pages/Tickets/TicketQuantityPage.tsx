import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '@/components/layout/TopBar/TopBar'
import PageContainer from '@/components/layout/PageContainer/PageContainer'
import { ROUTES } from '@/router/routes'
import { Button } from '@/components/ui/Button'
import QuantityCard from '@/components/tickets/TicketQuantityForm/QuantityCard'
import styles from './TicketQuantityPage.module.css'

const TICKET_PRICE = 18 // UAH
const BAGGAGE_PRICE = 18 // UAH

const TicketQuantityPage = () => {
  const navigate = useNavigate()
  const [quantity, setQuantity] = useState(1)
  const [baggageQty, setBaggageQty] = useState(0)

  const total = quantity * TICKET_PRICE + baggageQty * BAGGAGE_PRICE

  return (
    <>
      <TopBar title="Кількість квитків" showBack />
      <PageContainer>
        <div className={styles.content}>
          <QuantityCard
            title="Квитки"
            quantity={quantity}
            onQuantityChange={setQuantity}
            unitPrice={TICKET_PRICE}
            unitLabel="Ціна за квиток"
            min={1}
          />

          <QuantityCard
            title="Багаж"
            quantity={baggageQty}
            onQuantityChange={setBaggageQty}
            unitPrice={BAGGAGE_PRICE}
            unitLabel="Ціна за місце"
          />

        <div className={styles.summary}>
          <span className={styles.summaryLabel}>До сплати</span>
          <span className={styles.summaryTotal}>{total} грн</span>
        </div>

        <Button
          type="button"
          variant="primary"
          fullWidth
          onClick={() => navigate(ROUTES.PAY, { state: { quantity, baggageQty, total } })}
        >
          Перейти до оплати
        </Button>
        </div>
      </PageContainer>
    </>
  )
}

export default TicketQuantityPage

