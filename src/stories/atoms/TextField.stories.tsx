import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import TextField from '@/components/ui/TextField/TextField'

const meta = {
  title: 'Atoms/TextField',
  component: TextField,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 358, padding: 16 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TextField>

export default meta
type Story = StoryObj<typeof meta>

const Controlled = (args: React.ComponentProps<typeof TextField>) => {
  const [val, setVal] = useState(args.value ?? '')
  return <TextField {...args} value={val} onChange={setVal} />
}

export const WithLabel: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    id: 'comment',
    label: "Коментар (необов'язково)",
    placeholder: 'Опишіть ваш досвід…',
    value: '',
    onChange: () => {},
  },
}

export const WithoutLabel: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    id: 'desc',
    placeholder: 'Детальніше опишіть проблему…',
    value: '',
    onChange: () => {},
  },
}

export const LongText: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    id: 'long',
    label: 'Опис',
    value:
      'Маршрут завжди запізнюється більше ніж на 10 хвилин. Це вже четвертий раз на цьому тижні. Водій грубить пасажирам та не оголошує зупинки.',
    onChange: () => {},
  },
}
