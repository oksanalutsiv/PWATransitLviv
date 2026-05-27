import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import RouteSearchGroup from '@/components/map/RouteSearchGroup/RouteSearchGroup'

const meta = {
  title: 'Molecules/RouteSearchGroup',
  component: RouteSearchGroup,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: 358, background: '#e8edf2', padding: 16, borderRadius: 12 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RouteSearchGroup>

export default meta
type Story = StoryObj<typeof meta>

const Controlled = ({ initialFrom = '', initialTo = '' }) => {
  const [from, setFrom] = useState(initialFrom)
  const [to, setTo] = useState(initialTo)
  return (
    <RouteSearchGroup
      fromValue={from}
      toValue={to}
      onFromChange={setFrom}
      onToChange={setTo}
      onSwap={() => { const tmp = from; setFrom(to); setTo(tmp) }}
      onSubmit={() => {}}
    />
  )
}

export const Empty: Story = {
  args: { fromValue: '', toValue: '', onFromChange: () => {}, onToChange: () => {}, onSwap: () => {}, onSubmit: () => {} },
  render: () => <Controlled />,
}

export const WithValues: Story = {
  args: { fromValue: 'Академія мистецтв', toValue: 'Стрийський парк', onFromChange: () => {}, onToChange: () => {}, onSwap: () => {}, onSubmit: () => {} },
  render: () => <Controlled initialFrom="Академія мистецтв" initialTo="Стрийський парк" />,
}

export const FromOnly: Story = {
  args: { fromValue: 'Моє місцезнаходження', toValue: '', onFromChange: () => {}, onToChange: () => {}, onSwap: () => {}, onSubmit: () => {} },
  render: () => <Controlled initialFrom="Моє місцезнаходження" />,
}
