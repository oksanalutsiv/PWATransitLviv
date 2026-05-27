import { useNavigate } from 'react-router-dom'
import TopBar from '@/components/layout/TopBar/TopBar'
import PageContainer from '@/components/layout/PageContainer/PageContainer'
import { ROUTES } from '@/router/routes'
import { Button } from '@/components/ui/Button'
import styles from './QRScanPage.module.css'

/** Simulated QR scan screen — shows a viewfinder UI, confirms after 2s */
const QRScanPage = () => {
  const navigate = useNavigate()

  const handleSimulateScan = () => {
    // Simulate a successful scan after a brief delay
    setTimeout(() => navigate(ROUTES.ACTIVE_TICKET), 400)
  }

  return (
    <>
      <TopBar title="Сканування QR-коду" showBack />
      <PageContainer>
        <div className={styles.viewfinder}>
          <div className={styles.corner} />
          <div className={styles.corner} />
          <div className={styles.corner} />
          <div className={styles.corner} />
          <p className={styles.hint}>Наведіть камеру на QR-код квитка</p>
        </div>
        <Button
          type="button"
          variant="primary"
          onClick={handleSimulateScan}
        >
          Симулювати сканування ✓
        </Button>
      </PageContainer>
    </>
  )
}

export default QRScanPage

