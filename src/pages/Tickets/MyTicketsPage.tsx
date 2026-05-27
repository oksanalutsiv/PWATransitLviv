import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '@/components/layout/TopBar/TopBar'
import PageContainer from '@/components/layout/PageContainer/PageContainer'
import MenuCard from '@/components/ui/MenuCard/MenuCard'
import { useAuthStore } from '@/store/authSlice'
import { fetchAnyValidTicket } from '@/lib/supabase/tickets'
import { ROUTES } from '@/router/routes'
import { IconTicket, IconCheck, IconClock, IconCard } from '@/assets/Icons'

const MyTicketsPage = () => {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const [hasValid, setHasValid] = useState(false)

  useEffect(() => {
    if (!user) return
    fetchAnyValidTicket(user.id).then(({ data }) => {
      setHasValid(!!data)
    })
  }, [user])

  return (
    <>
      <TopBar title="Мої квитки" />
      <PageContainer>
        <MenuCard items={[
          { icon: <IconTicket />, label: 'Купити квитки', onClick: () => { if (!hasValid) navigate(ROUTES.TICKET_QUANTITY) }, disabled: hasValid },
          { icon: <IconCheck />, label: 'Активний квиток', onClick: () => navigate(ROUTES.ACTIVE_TICKET) },
          { icon: <IconClock />, label: 'Історія купівлі', onClick: () => navigate(ROUTES.PURCHASE_HISTORY) },
          { icon: <IconCard />, label: 'Метод оплати', onClick: () => navigate(ROUTES.PAYMENT_METHODS) },
        ]} />
      </PageContainer>
    </>
  )
}

export default MyTicketsPage
