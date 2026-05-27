import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import InclusivityFilter from '@/components/map/InclusivityFilter/InclusivityFilter'

const meta = {
  title: 'Molecules/InclusivityFilter',
  component: InclusivityFilter,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ background: '#e8edf2', padding: 16, borderRadius: 12 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof InclusivityFilter>

export default meta
type Story = StoryObj<typeof meta>

const Controlled = ({ initial }: { initial: boolean }) => {
  const [value, setValue] = useState(initial)
  return <InclusivityFilter value={value} onChange={setValue} />
}

export const Off: Story = {
  args: { value: false, onChange: () => {} },
  render: () => <Controlled initial={false} />,
}

export const On: Story = {
  args: { value: true, onChange: () => {} },
  render: () => <Controlled initial={true} />,
}
