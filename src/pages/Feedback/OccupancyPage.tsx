import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '@/components/layout/TopBar/TopBar'
import PageContainer from '@/components/layout/PageContainer/PageContainer'
import { submitOccupancyReport } from '@/lib/supabase/feedback'
import { demoRoute } from '@/lib/demoSession'
import { ROUTES } from '@/router/routes'
import { Button } from '@/components/ui/Button'
import Chip from '@/components/ui/Chip/Chip'
import styles from './OccupancyPage.module.css'
import { IconCheck } from '@/assets/Icons'

const LEVELS = [
  { label: 'Вільно',      value: 1 },
  { label: 'Зайнято',     value: 2 },
  { label: 'Немає місць', value: 3 },
]

const OccupancyPage = () => {
  const navigate = useNavigate()
  const [routeQuery, setRouteQuery] = useState(demoRoute)
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async () => {
    if (selectedLevel === null) return
    setLoading(true)
    await submitOccupancyReport(routeQuery, selectedLevel)
    setLoading(false)
    setDone(true)
    setTimeout(() => navigate(ROUTES.FEEDBACK), 1500)
  }

  if (done) {
    return (
      <>
        <TopBar title="Завантаженість" showBack />
        <PageContainer>
          <div className={styles.success}>
            <span className={styles.successIcon}>
              <IconCheck size={56} />
            </span>
            <p className={styles.successText}>Дякуємо за відгук!</p>
          </div>
        </PageContainer>
      </>
    )
  }

  return (
    <>
      <TopBar title="Завантаженість" showBack />
      <PageContainer>
        <div className={styles.form}>
          <div className={styles.fields}>
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="occ-route">Маршрут</label>
            <input
              id="occ-route"
              className={`${styles.input} ${styles.inputPrefilled}`}
              type="text"
              readOnly
              value={routeQuery}
              onChange={(e) => setRouteQuery(e.target.value)}
            />
          </div>

          <div className={styles.fieldGroup}>
            <p className={styles.label}>Завантаженість</p>
            <div className={styles.tags} role="listbox" aria-label="Завантаженість">
              {LEVELS.map((lvl) => (
                <Chip
                  key={lvl.value}
                  label={lvl.label}
                  selected={selectedLevel === lvl.value}
                  onClick={() => setSelectedLevel(lvl.value)}
                />
              ))}
            </div>
          </div>
          </div>

          <Button
            type="button"
            variant="primary"
            fullWidth
            onClick={handleSubmit}
            disabled={loading || selectedLevel === null}
          >
            {loading ? 'Надсилання…' : 'Надіслати'}
          </Button>
        </div>
      </PageContainer>
    </>
  )
}

export default OccupancyPage
