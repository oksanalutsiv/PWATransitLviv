import type { Meta, StoryObj } from '@storybook/react-vite'
import OccupancyBadge from '@/components/map/OccupancyBadge/OccupancyBadge'

const meta = {
  title: 'Atoms/OccupancyBadge',
  component: OccupancyBadge,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    level: { control: 'radio', options: [1, 2, 3] },
  },
  args: { level: 1 },
} satisfies Meta<typeof OccupancyBadge>

export default meta
type Story = StoryObj<typeof meta>

export const Low: Story = {
  args: { level: 1 },
}

export const Medium: Story = {
  args: { level: 2 },
}

export const High: Story = {
  args: { level: 3 },
}

export const AllLevels: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', gap: 12 }}>
      <OccupancyBadge level={1} />
      <OccupancyBadge level={2} />
      <OccupancyBadge level={3} />
    </div>
  ),
}
