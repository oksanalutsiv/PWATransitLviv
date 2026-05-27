import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import QuantityCounter from '@/components/ui/QuantityCounter/QuantityCounter'

const meta = {
  title: 'Atoms/QuantityCounter',
  component: QuantityCounter,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { onChange: () => {} },
} satisfies Meta<typeof QuantityCounter>

export default meta
type Story = StoryObj<typeof meta>

const Controlled = ({ initial = 1, min = 0, max = 10 }) => {
  const [value, setValue] = useState(initial)
  return <QuantityCounter value={value} onChange={setValue} min={min} max={max} />
}

export const Default: Story = {
  args: { value: 1 },
  render: () => <Controlled />,
}

export const AtMinimum: Story = {
  args: { value: 1 },
  render: () => <Controlled initial={1} min={1} />,
}

export const AtMaximum: Story = {
  args: { value: 10 },
  render: () => <Controlled initial={10} />,
}

export const StartAtZero: Story = {
  args: { value: 0 },
  render: () => <Controlled initial={0} min={0} />,
}
