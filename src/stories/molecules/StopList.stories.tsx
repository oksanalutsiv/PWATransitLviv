import type { Meta, StoryObj } from '@storybook/react-vite'
import StopList from '@/components/routes/StopList/StopList'

const meta = {
  title: 'Molecules/StopList',
  component: StopList,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: 390, padding: '16px 12px', background: 'var(--color-surface-default)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof StopList>

export default meta
type Story = StoryObj<typeof meta>

const mockStops = [
  { id: '1', name: 'Академія мистецтв',  arrival: 'за 18 хв' },
  { id: '2', name: 'Стрийський парк',     arrival: 'за 20 хв' },
  { id: '3', name: 'Стрийський ринок',    arrival: 'за 22 хв' },
  { id: '4', name: 'Саксаганського',      arrival: 'за 25 хв' },
  { id: '5', name: 'Шухевича',            arrival: 'за 27 хв' },
]

export const Default: Story = {
  args: { stops: mockStops },
}

export const TwoStops: Story = {
  args: {
    stops: [
      { id: '1', name: 'Проспект Свободи', arrival: 'за 5 хв' },
      { id: '2', name: 'Площа Ринок',      arrival: 'за 8 хв' },
    ],
  },
}

export const SingleStop: Story = {
  args: {
    stops: [{ id: '1', name: 'Кінцева зупинка', arrival: 'за 2 хв' }],
  },
}
