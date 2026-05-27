import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import QuantityCard from '@/components/tickets/TicketQuantityForm/QuantityCard'

const meta = {
  title: 'Molecules/QuantityCard',
  component: QuantityCard,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: 358 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof QuantityCard>

export default meta
type Story = StoryObj<typeof meta>

const Controlled = (props: Omit<React.ComponentProps<typeof QuantityCard>, 'quantity' | 'onQuantityChange'> & { initial?: number }) => {
  const { initial = 1, ...rest } = props
  const [qty, setQty] = useState(initial)
  return <QuantityCard {...rest} quantity={qty} onQuantityChange={setQty} />
}

export const Tickets: Story = {
  args: { title: 'Квитки', quantity: 1, onQuantityChange: () => {}, unitPrice: 18 },
  render: () => (
    <Controlled
      title="Квитки"
      unitPrice={18}
      unitLabel="Ціна за квиток"
      min={1}
      initial={1}
    />
  ),
}

export const Baggage: Story = {
  args: { title: 'Багаж', quantity: 0, onQuantityChange: () => {}, unitPrice: 18 },
  render: () => (
    <Controlled
      title="Багаж"
      unitPrice={18}
      unitLabel="Ціна за місце"
      min={0}
      initial={0}
    />
  ),
}

export const WithQuantity: Story = {
  args: { title: 'Квитки', quantity: 3, onQuantityChange: () => {}, unitPrice: 18 },
  render: () => (
    <Controlled
      title="Квитки"
      unitPrice={18}
      unitLabel="Ціна за квиток"
      min={1}
      initial={3}
    />
  ),
}
