import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import Toggle from '@/components/ui/Toggle/Toggle'

const meta = {
  title: 'Atoms/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { onChange: () => {} },
} satisfies Meta<typeof Toggle>

export default meta
type Story = StoryObj<typeof meta>

const Controlled = ({ initial = false, disabled = false, size }: { initial?: boolean; disabled?: boolean; size?: 'sm' | 'lg' }) => {
  const [checked, setChecked] = useState(initial)
  return <Toggle checked={checked} onChange={setChecked} disabled={disabled} size={size} />
}

export const SmallOff: Story = {
  args: { checked: false },
  render: () => <Controlled />,
}

export const SmallOn: Story = {
  args: { checked: true },
  render: () => <Controlled initial />,
}

export const LargeOff: Story = {
  args: { checked: false },
  render: () => <Controlled size="lg" />,
}

export const LargeOn: Story = {
  args: { checked: true },
  render: () => <Controlled initial size="lg" />,
}

export const Disabled: Story = {
  args: { checked: false },
  render: () => <Toggle checked={false} onChange={() => {}} disabled />,
}

export const AllStates: Story = {
  args: { checked: false },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {[
        { label: 'sm — off',           checked: false, size: 'sm' as const },
        { label: 'sm — on',            checked: true,  size: 'sm' as const },
        { label: 'sm — off (disabled)', checked: false, size: 'sm' as const, disabled: true },
        { label: 'lg — off',           checked: false, size: 'lg' as const },
        { label: 'lg — on',            checked: true,  size: 'lg' as const },
        { label: 'lg — off (disabled)', checked: false, size: 'lg' as const, disabled: true },
      ].map(({ label, checked, size, disabled }) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Toggle checked={checked} onChange={() => {}} size={size} disabled={disabled} />
          <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{label}</span>
        </div>
      ))}
    </div>
  ),
}
