import type { Meta, StoryObj } from '@storybook/react-vite'
import PaymentMethodCard from '@/components/payment/PaymentMethodCard/PaymentMethodCard'

const meta = {
  title: 'Molecules/PaymentMethodCard',
  component: PaymentMethodCard,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: 358 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PaymentMethodCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Леокарт ···9101',
    isDefault: true,
    iconColor: 'var(--color-bus)',
    onDelete: () => alert('Delete'),
  },
}

export const Selectable: Story = {
  args: {
    label: 'Карта ···4242',
    isDefault: false,
    onSetDefault: () => alert('Set default'),
    onDelete: () => alert('Delete'),
  },
}
