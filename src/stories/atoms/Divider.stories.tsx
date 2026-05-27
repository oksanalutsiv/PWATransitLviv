import type { Meta, StoryObj } from '@storybook/react-vite'
import Divider from '@/components/ui/Divider/Divider'

const meta = {
  title: 'Atoms/Divider',
  component: Divider,
  tags: ['autodocs'],
  argTypes: {
    vertical: { control: 'boolean' },
  },
  args: {
    vertical: false,
  },
} satisfies Meta<typeof Divider>

export default meta
type Story = StoryObj<typeof meta>

export const Horizontal: Story = {
  parameters: { layout: 'padded' },
  args: { vertical: false },
  render: () => (
    <div style={{ width: 320 }}>
      <div style={{ padding: '8px 0', color: '#3F3F3F', fontSize: 14 }}>Вище</div>
      <Divider />
      <div style={{ padding: '8px 0', color: '#3F3F3F', fontSize: 14 }}>Нижче</div>
    </div>
  ),
}

export const Vertical: Story = {
  parameters: { layout: 'centered' },
  args: { vertical: true },
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, height: 32 }}>
      <span style={{ color: '#3F3F3F', fontSize: 14 }}>Автобус</span>
      <Divider vertical />
      <span style={{ color: '#3F3F3F', fontSize: 14 }}>Трамвай</span>
    </div>
  ),
}
