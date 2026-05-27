import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '@/components/layout/TopBar/TopBar'
import PageContainer from '@/components/layout/PageContainer/PageContainer'
import { useAuthStore } from '@/store/authSlice'
import { fetchComplaintTags, submitComplaint } from '@/lib/supabase/feedback'
import type { ComplaintTag } from '@/lib/supabase/types'
import { demoRoute } from '@/lib/demoSession'
import { ROUTES } from '@/router/routes'
import { Button } from '@/components/ui/Button'
import TextField from '@/components/ui/TextField/TextField'
import Chip from '@/components/ui/Chip/Chip'
import styles from './ComplaintsPage.module.css'
import { IconCheck } from '@/assets/Icons'

const ComplaintsPage = () => {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const [tags, setTags] = useState<ComplaintTag[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [routeId, setRouteId] = useState(demoRoute)
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    fetchComplaintTags().then(({ data }) => setTags(data ?? []))
  }, [])

  const toggleTag = (id: string) =>
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    )

  const handleSubmit = async () => {
    if (!user || selectedTags.length === 0) return
    setLoading(true)
    await submitComplaint({
      user_id: user.id,
      route_id: routeId || null,
      tag_ids: selectedTags.map(Number),
      description,
    })
    setLoading(false)
    setDone(true)
    setTimeout(() => navigate(ROUTES.FEEDBACK), 1500)
  }

  if (done) {
    return (
      <>
        <TopBar title="Скарга" showBack />
        <PageContainer>
          <div className={styles.success}>
            <span className={styles.successIcon}>
              <IconCheck size={56} />
            </span>
            <p className={styles.successText}>Скаргу надіслано!</p>
          </div>
        </PageContainer>
      </>
    )
  }

  return (
    <>
      <TopBar title="Подати скаргу" showBack />
      <PageContainer>
        <div className={styles.form}>
          <div className={styles.fields}>
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="comp-route">Маршрут</label>
            <input
              id="comp-route"
              className={`${styles.input} ${styles.inputPrefilled}`}
              type="text"
              readOnly
              value={routeId}
              onChange={(e) => setRouteId(e.target.value)}
            />
          </div>

          <div className={styles.fieldGroup}>
            <p className={styles.label}>Категорія проблеми</p>
            <div className={styles.tags} role="listbox" aria-multiselectable="true" aria-label="Категорія проблеми">
            {tags.map((tag) => (
              <Chip
                key={tag.id}
                label={tag.label_uk}
                selected={selectedTags.includes(String(tag.id))}
                onClick={() => toggleTag(String(tag.id))}
              />
            ))}
            {tags.length === 0 && (
              <>
                {['Брудно', 'Запізнення', 'Груба поведінка', 'Несправне обладнання', 'Інше'].map((t) => (
                  <Chip
                    key={t}
                    label={t}
                    selected={selectedTags.includes(t)}
                    onClick={() => toggleTag(t)}
                  />
                ))}
              </>
            )}
          </div>
          </div>

          <TextField
              id="comp-desc"
              label="Опис"
              placeholder="Детальніше опишіть проблему…"
              value={description}
              onChange={setDescription}
            />
          </div>

          <Button
            type="button"
            variant="primary"
            fullWidth
            onClick={handleSubmit}
            disabled={loading || selectedTags.length === 0}
          >
            {loading ? 'Надсилання…' : 'Надіслати скаргу'}
          </Button>
        </div>
      </PageContainer>
    </>
  )
}

export default ComplaintsPage

