import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import InputField from '@/components/ui/InputField/InputField'

const meta = {
  title: 'Atoms/InputField',
  component: InputField,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 358, padding: 16 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof InputField>

export default meta
type Story = StoryObj<typeof meta>

const Controlled = (args: React.ComponentProps<typeof InputField>) => {
  const [val, setVal] = useState(args.value ?? '')
  return <InputField {...args} value={val} onChange={setVal} />
}

export const EmailField: Story = {
  render: (args) => <Controlled {...args} />,
  args: { id: 'email', label: 'Email', type: 'email', placeholder: 'email@example.com', value: '' },
}

export const PasswordField: Story = {
  render: (args) => <Controlled {...args} />,
  args: { id: 'pass', label: 'Пароль', type: 'password', placeholder: 'Мін. 8 символів', value: '' },
}

export const WithoutLabel: Story = {
  render: (args) => <Controlled {...args} />,
  args: { id: 'bare', type: 'text', placeholder: 'Введіть текст…', value: '' },
}

export const ReadOnly: Story = {
  args: { id: 'route', label: 'Маршрут', type: 'text', value: '№ 6 — Залізничний вокзал', readOnly: true },
}
