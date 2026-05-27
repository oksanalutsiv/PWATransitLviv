import type { Meta, StoryObj } from '@storybook/react-vite'
import LocateButton from '@/components/map/LocateButton/LocateButton'

const meta = {
  title: 'Atoms/Button',
  component: LocateButton,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { onClick: () => {} },
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ background: '#e8edf2', padding: 16, borderRadius: 12 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LocateButton>

export default meta
type Story = StoryObj<typeof meta>

export const LocateButtonDefault: Story = {
  name: 'Locate Button',
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <LocateButton {...args} />
      <LocateButton {...args} active />
      <LocateButton {...args} loading />
    </div>
  ),
}
