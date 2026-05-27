import type { Meta, StoryObj } from '@storybook/react-vite'
import Notification from '@/components/ui/Notification/Notification'

const meta = {
  title: 'Atoms/Notification',
  component: Notification,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    message: { control: 'text' },
  },
  args: {
    message: 'Квиток успішно активовано',
  },
} satisfies Meta<typeof Notification>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { message: 'Квиток успішно активовано' },
}

export const PaymentSuccess: Story = {
  args: { message: 'Оплату здійснено успішно' },
}

export const CardAdded: Story = {
  args: { message: 'Картку додано' },
}
