import type { Meta, StoryObj } from '@storybook/react-vite'
import TransportBadge from '@/components/routes/TransportBadge/TransportBadge'

const meta = {
  title: 'Atoms/TransportBadge',
  component: TransportBadge,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    type: { control: 'radio', options: ['bus', 'tram', 'trolleybus'] },
    number: { control: 'text' },
  },
  args: { type: 'bus', number: '23' },
} satisfies Meta<typeof TransportBadge>

export default meta
type Story = StoryObj<typeof meta>

export const Bus: Story = {
  args: { type: 'bus', number: '23' },
}

export const Tram: Story = {
  args: { type: 'tram', number: '6' },
}

export const Trolleybus: Story = {
  args: { type: 'trolleybus', number: 'А04' },
}

export const AllTypes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <TransportBadge type="bus"        number="23" />
      <TransportBadge type="tram"       number="6" />
      <TransportBadge type="trolleybus" number="А04" />
    </div>
  ),
}

export const LongNumber: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <TransportBadge type="bus"        number="246" />
      <TransportBadge type="trolleybus" number="А6А" />
    </div>
  ),
}
