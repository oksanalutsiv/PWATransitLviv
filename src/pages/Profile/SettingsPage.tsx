import { useEffect, useState } from 'react'
import TopBar from '@/components/layout/TopBar/TopBar'
import PageContainer from '@/components/layout/PageContainer/PageContainer'
import { useAuthStore } from '@/store/authSlice'
import { getProfile, updateProfile } from '@/lib/supabase/profiles'
import Notification from '@/components/ui/Notification/Notification'
import styles from './SettingsPage.module.css'

type Language = 'uk' | 'en'

const SettingsPage = () => {
  const user = useAuthStore((s) => s.user)
  const [language, setLanguage] = useState<Language>('uk')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!user) return
    getProfile(user.id).then(({ data }) => {
      if (data) {
        setLanguage(data.language)
      }
    })
  }, [user])

  const save = async (patch: { language?: Language }) => {
    if (!user) return
    setSaving(true)
    setSaved(false)
    await updateProfile(user.id, patch)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleLanguage = (val: Language) => {
    setLanguage(val)
    save({ language: val })
  }

  return (
    <>
      <TopBar title="Налаштування" showBack />
      <PageContainer>
        <section className={styles.section}>

          <div className={styles.row}>
            <span className={styles.rowLabel}>Мова</span>
            <div className={styles.segment} role="group" aria-label="Мова">
              <button
                type="button"
                className={`${styles.segBtn} ${language === 'uk' ? styles.segBtnActive : ''}`}
                onClick={() => handleLanguage('uk')}
                aria-pressed={language === 'uk'}
              >
                УК
              </button>
              <button
                type="button"
                className={`${styles.segBtn} ${language === 'en' ? styles.segBtnActive : ''}`}
                onClick={() => handleLanguage('en')}
                aria-pressed={language === 'en'}
              >
                EN
              </button>
            </div>
          </div>

        </section>

        {saving && <p className={styles.status}>Зберігаємо…</p>}
        {saved  && <Notification message="Збережено" className={styles.statusOk} />}
      </PageContainer>
    </>
  )
}

export default SettingsPage

