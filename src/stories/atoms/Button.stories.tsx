import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@/components/ui/Button/Button'

const meta = {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'danger'],
    },
    size: { control: 'radio', options: ['md', 'sm'] },
    fullWidth: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    children: 'Кнопка',
    variant: 'primary',
    size: 'md',
    fullWidth: false,
    disabled: false,
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: { variant: 'primary', children: 'Сплатити' },
}

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Скасувати' },
}

export const Outline: Story = {
  args: { variant: 'outline', children: 'Назад' },
}

export const Ghost: Story = {
  args: { variant: 'ghost', children: 'Увійти без акаунту' },
}

export const Danger: Story = {
  args: { variant: 'danger', children: 'Видалити картку' },
}

export const SmallSize: Story = {
  args: { variant: 'primary', size: 'sm', children: 'Фільтр' },
}

export const Disabled: Story = {
  args: { variant: 'primary', children: 'Недоступно', disabled: true },
}

export const FullWidth: Story = {
  parameters: { layout: 'padded' },
  args: { variant: 'primary', fullWidth: true, children: 'Сплатити 42 ₴' },
}

export const AllVariants: Story = {
  parameters: { layout: 'padded', controls: { disable: true }, backgrounds: { default: 'light' } },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 280, padding: 24, background: '#F5F7FA', borderRadius: 16 }}>
      {(['primary', 'secondary', 'outline', 'ghost', 'danger'] as const).map(v => (
        <Button key={v} variant={v}>{v.charAt(0).toUpperCase() + v.slice(1)}</Button>
      ))}
    </div>
  ),
}
