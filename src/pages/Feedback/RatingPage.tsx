import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '@/components/layout/TopBar/TopBar'
import PageContainer from '@/components/layout/PageContainer/PageContainer'
import { useAuthStore } from '@/store/authSlice'
import { submitRating } from '@/lib/supabase/feedback'
import { demoRoute } from '@/lib/demoSession'
import { ROUTES } from '@/router/routes'
import { Button } from '@/components/ui/Button'
import TextField from '@/components/ui/TextField/TextField'
import styles from './RatingPage.module.css'
import { IconCheck, IconStar } from '@/assets/Icons'

const STARS = [1, 2, 3, 4, 5]

const RatingPage = () => {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const [routeId, setRouteId] = useState(demoRoute)
  const [stars, setStars] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async () => {
    if (!user || !routeId || stars === 0) return
    setLoading(true)
    await submitRating({ user_id: user.id, route_id: routeId, stars, comment })
    setLoading(false)
    setDone(true)
    setTimeout(() => navigate(ROUTES.FEEDBACK), 1500)
  }

  if (done) {
    return (
      <>
        <TopBar title="Оцінка" showBack />
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
      <TopBar title="Оцінити маршрут" showBack />
      <PageContainer>
        <div className={styles.form}>
          <div className={styles.fields}>
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="route-id">Маршрут</label>
            <input
              id="route-id"
              className={`${styles.input} ${styles.inputPrefilled}`}
              type="text"
              readOnly
              value={routeId}
              onChange={(e) => setRouteId(e.target.value)}
            />
          </div>

          <div className={styles.starsWrap} aria-label="Оцінка маршруту">
            {STARS.map((s) => (
              <button
                key={s}
                type="button"
                aria-label={`${s} зірок`}
                className={`${styles.star} ${s <= (hovered || stars) ? styles.starFilled : ''}`}
                onMouseEnter={() => setHovered(s)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => setStars(s)}
              >
                <IconStar size={32} />
              </button>
            ))}
          </div>

          <TextField
              id="comment"
              label="Коментар (необов'язково)"
              placeholder="Опишіть ваш досвід…"
              value={comment}
              onChange={setComment}
            />          </div>
          <Button
            type="button"
            variant="primary"
            fullWidth
            onClick={handleSubmit}
            disabled={loading || !routeId || stars === 0}
          >
            {loading ? 'Надсилання…' : 'Надіслати оцінку'}
          </Button>
        </div>
      </PageContainer>
    </>
  )
}

export default RatingPage

