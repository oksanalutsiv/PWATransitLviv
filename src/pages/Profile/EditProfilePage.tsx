import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '@/components/layout/TopBar/TopBar'
import PageContainer from '@/components/layout/PageContainer/PageContainer'
import { useAuthStore } from '@/store/authSlice'
import { Button } from '@/components/ui/Button'
import Notification from '@/components/ui/Notification/Notification'
import styles from './EditProfilePage.module.css'

const EditProfilePage = () => {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const [name, setName] = useState('')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    // In a real app: update profile in Supabase
    setSaved(true)
    setTimeout(() => navigate(-1), 1000)
  }

  return (
    <>
      <TopBar title="Редагувати профіль" showBack />
      <PageContainer>
        <div className={styles.form}>
          <div className={styles.fields}>
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="ep-email">Email</label>
            <input
              id="ep-email"
              className={`${styles.input} ${styles.readOnly}`}
              type="email"
              value={user?.email ?? ''}
              readOnly
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="ep-name">Ім'я</label>
            <input
              id="ep-name"
              className={styles.input}
              type="text"
              placeholder="Ваше ім'я"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {saved && <Notification message="Збережено" />}
          </div>

          <Button type="button" variant="primary" fullWidth onClick={handleSave}>
            Зберегти зміни
          </Button>
        </div>
      </PageContainer>
    </>
  )
}

export default EditProfilePage
