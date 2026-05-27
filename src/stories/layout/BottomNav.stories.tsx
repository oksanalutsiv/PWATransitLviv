import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router-dom'
import { BottomNav } from '@/components/layout/BottomNav/BottomNav'

const withRouter = (route: string) => (Story: React.ComponentType) => (
  <MemoryRouter initialEntries={[route]}>
    <div style={{ width: 390, height: 120, position: 'relative', background: 'var(--color-surface-default)', borderRadius: 16 }}>
      <Story />
    </div>
  </MemoryRouter>
)

const meta = {
  title: 'Molecules/BottomNav',
  component: BottomNav,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof BottomNav>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  decorators: [withRouter('/map')],
}

export const OnTickets: Story = {
  decorators: [withRouter('/tickets/my')],
}

export const OnFeedback: Story = {
  decorators: [withRouter('/feedback')],
}

export const OnProfile: Story = {
  decorators: [withRouter('/profile')],
}

