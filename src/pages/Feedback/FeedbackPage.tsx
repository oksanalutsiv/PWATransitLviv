import { useNavigate } from 'react-router-dom'
import TopBar from '@/components/layout/TopBar/TopBar'
import PageContainer from '@/components/layout/PageContainer/PageContainer'
import MenuCard from '@/components/ui/MenuCard/MenuCard'
import { ROUTES } from '@/router/routes'
import { IconReview, IconComplaint, IconBus } from '@/assets/Icons'

const FeedbackPage = () => {
  const navigate = useNavigate()

  return (
    <>
      <TopBar title="Відгуки" />
      <PageContainer>
        <MenuCard items={[
          { icon: <IconReview />, label: 'Оцінити маршрут', onClick: () => navigate(ROUTES.RATING) },
          { icon: <IconComplaint />, label: 'Подати скаргу', onClick: () => navigate(ROUTES.COMPLAINTS) },
          { icon: <IconBus />, label: 'Завантаженість', onClick: () => navigate(ROUTES.OCCUPANCY) },
        ]} />
      </PageContainer>
    </>
  )
}

export default FeedbackPage

