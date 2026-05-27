import type { Meta, StoryObj } from '@storybook/react-vite'
import TicketHistoryCard from '@/components/tickets/TicketHistoryCard/TicketHistoryCard'

const meta = {
  title: 'Molecules/TicketHistoryCard',
  component: TicketHistoryCard,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: 358 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TicketHistoryCard>

export default meta
type Story = StoryObj<typeof meta>

export const Used: Story = {
  args: {
    title: 'Разовий квиток',
    date: '18 травня 2026 р. · 18:07',
    status: 'used',
    quantity: 1,
  },
}

export const Valid: Story = {
  args: {
    title: 'Разовий квиток',
    date: '18 травня 2026 р. · 19:00',
    status: 'valid',
    quantity: 2,
  },
}

export const Active: Story = {
  args: {
    title: 'Маршрут №5А',
    date: '18 травня 2026 р. · 17:45',
    status: 'active',
    quantity: 1,
  },
}
