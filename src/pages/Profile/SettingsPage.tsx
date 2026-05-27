import { useEffect, useState } from 'react'
import TopBar from '@/components/layout/TopBar/TopBar'
import PageContainer from '@/components/layout/PageContainer/PageContainer'
import { useAuthStore } from '@/store/authSlice'
import { getProfile, updateProfile } from '@/lib/supabase/profiles'
import Notification from '@/components/ui/Notification/Notification'
import styles from './SettingsPage.module.css'

type Language = 'uk' | 'en'
type Theme = 'light' | 'dark'

const SettingsPage = () => {
  const user = useAuthStore((s) => s.user)
  const [language, setLanguage] = useState<Language>('uk')
  const [theme, setTheme] = useState<Theme>('light')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!user) return
    getProfile(user.id).then(({ data }) => {
      if (data) {
        setLanguage(data.language)
        setTheme(data.theme)
      }
    })
  }, [user])

  const save = async (patch: { language?: Language; theme?: Theme }) => {
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

  const handleTheme = (val: Theme) => {
    setTheme(val)
    save({ theme: val })
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

          <div className={styles.rowDivider} />

          <div className={styles.row}>
            <span className={styles.rowLabel}>Тема</span>
            <div className={styles.segment} role="group" aria-label="Тема">
              <button
                type="button"
                className={`${styles.segBtn} ${theme === 'light' ? styles.segBtnActive : ''}`}
                onClick={() => handleTheme('light')}
                aria-pressed={theme === 'light'}
              >
                Світла
              </button>
              <button
                type="button"
                className={`${styles.segBtn} ${theme === 'dark' ? styles.segBtnActive : ''}`}
                onClick={() => handleTheme('dark')}
                aria-pressed={theme === 'dark'}
              >
                Темна
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

