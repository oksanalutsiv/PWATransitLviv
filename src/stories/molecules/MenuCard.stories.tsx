import type { Meta, StoryObj } from '@storybook/react-vite'
import MenuCard from '@/components/ui/MenuCard/MenuCard'

// Minimal inline SVG icons for story mock data
const CreditCardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
)

const HistoryIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="12 8 12 12 14 14" />
    <path d="M3.05 11a9 9 0 1 0 .5-4" />
    <polyline points="3 3 3 7 7 7" />
  </svg>
)

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
)

const meta = {
  title: 'Molecules/MenuCard',
  component: MenuCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'A list of tappable menu items with icon, label, and optional disabled state.',
          '',
          '**Changelog**',
          '- Shadow updated from `--shadow-lg` to `--shadow-md` (`0 2px 12px rgba(0,0,0,0.12)`) for a lighter appearance.',
          '- Label uses `--font-size-md` (14px) / `--font-weight-medium` (500), consistent with SegmentedCard.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof MenuCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    items: [
      { icon: <CreditCardIcon />, label: 'Методи оплати', onClick: () => {} },
      { icon: <HistoryIcon />,    label: 'Історія покупок', onClick: () => {} },
      { icon: <SettingsIcon />,   label: 'Налаштування', onClick: () => {} },
    ],
  },
}

export const WithDisabledItem: Story = {
  args: {
    items: [
      { icon: <CreditCardIcon />, label: 'Методи оплати', onClick: () => {} },
      { icon: <HistoryIcon />,    label: 'Історія покупок', onClick: () => {}, disabled: true },
      { icon: <SettingsIcon />,   label: 'Налаштування', onClick: () => {} },
    ],
  },
}

export const SingleItem: Story = {
  args: {
    items: [
      { icon: <SettingsIcon />, label: 'Налаштування', onClick: () => {} },
    ],
  },
}
