import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import Chip from '@/components/ui/Chip/Chip'

const meta = {
  title: 'Atoms/Chip',
  component: Chip,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ padding: 16 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Chip>

export default meta
type Story = StoryObj<typeof meta>

const Controlled = (args: React.ComponentProps<typeof Chip>) => {
  const [selected, setSelected] = useState(args.selected ?? false)
  return <Chip {...args} selected={selected} onClick={() => setSelected((s) => !s)} />
}

export const Default: Story = {
  render: (args) => <Controlled {...args} />,
  args: { label: 'Брудно', selected: false },
}

export const Selected: Story = {
  render: (args) => <Controlled {...args} />,
  args: { label: 'Запізнення', selected: true },
}

export const Group: Story = {
  args: { label: '' },
  render: () => {
    const TAGS = ['Брудно', 'Запізнення', 'Груба поведінка', 'Несправне обладнання', 'Інше']
    const [active, setActive] = useState<string[]>([])
    const toggle = (t: string) => setActive((s) => s.includes(t) ? s.filter((x) => x !== t) : [...s, t])
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 4px' }}>
        {TAGS.map((t) => (
          <Chip key={t} label={t} selected={active.includes(t)} onClick={() => toggle(t)} />
        ))}
      </div>
    )
  },
}
