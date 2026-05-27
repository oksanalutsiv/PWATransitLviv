import { useState } from 'react'
import TopBar from '@/components/layout/TopBar/TopBar'
import PageContainer from '@/components/layout/PageContainer/PageContainer'
import Toggle from '@/components/ui/Toggle/Toggle'
import styles from './AccessibilityPage.module.css'

const AccessibilityPage = () => {
  const [wheelchairOnly, setWheelchairOnly] = useState(false)
  const [lowFloor, setLowFloor] = useState(false)
  const [audioAnnounce, setAudioAnnounce] = useState(false)

  return (
    <>
      <TopBar title="Доступність" showBack />
      <PageContainer>
        <section className={styles.section}>
          <p className={styles.hint}>
            Налаштуйте фільтри для зручнішого пошуку інклюзивного транспорту.
          </p>

          {([
            { id: 'wheelchair', label: 'Тільки маршрути з пандусом', value: wheelchairOnly, setter: setWheelchairOnly },
            { id: 'lowfloor', label: 'Низькопідлоговий транспорт', value: lowFloor, setter: setLowFloor },
            { id: 'audio', label: 'Аудіо-оголошення зупинок', value: audioAnnounce, setter: setAudioAnnounce },
          ] as const).map(({ id, label, value, setter }) => (
            <div key={id} className={styles.row}>
              <label className={styles.rowLabel} htmlFor={id}>{label}</label>
              <Toggle
                checked={value}
                onChange={setter}
                size="lg"
                label={label}
              />
            </div>
          ))}
        </section>
      </PageContainer>
    </>
  )
}

export default AccessibilityPage
