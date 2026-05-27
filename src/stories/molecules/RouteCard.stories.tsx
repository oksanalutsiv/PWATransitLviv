import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import RouteCard from '@/components/routes/RouteCard/RouteCard'
import type { Route } from '@/lib/supabase/types'

const MobileWrapper = ({ children }: { children: React.ReactNode }) => (
  <div style={{ width: 390, padding: '16px 12px', background: 'var(--color-surface-default)' }}>
    {children}
  </div>
)

const meta = {
  title: 'Molecules/RouteCard',
  component: RouteCard,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  decorators: [
    (Story: React.ComponentType) => <MobileWrapper><Story /></MobileWrapper>,
  ],
  argTypes: {
    minutesAway: { control: 'number' },
  },
} satisfies Meta<typeof RouteCard>

export default meta
type Story = StoryObj<typeof meta>

const busRoute: Route = {
  id: '1',
  number: '23',
  name: 'Центр — Сихів',
  type_id: 1,
  is_active: true,
  occupancy_level: 1,
  is_inclusive: true,
  avg_rating: 4.2,
  transport_type: { id: 1, name: 'bus', color_hex: '#9C1A87' },
}

const tramRoute: Route = {
  id: '2',
  number: '6',
  name: 'Стрийська — Городоцька',
  type_id: 2,
  is_active: true,
  occupancy_level: 2,
  is_inclusive: false,
  avg_rating: 3.8,
  transport_type: { id: 2, name: 'tram', color_hex: '#008CCC' },
}

const trolleyRoute: Route = {
  id: '3',
  number: 'А04',
  name: 'Вокзал — Знесіння',
  type_id: 3,
  is_active: true,
  occupancy_level: 3,
  is_inclusive: false,
  avg_rating: 0,
  transport_type: { id: 3, name: 'trolleybus', color_hex: '#E87D0D' },
}

export const BusWithArrival: Story = {
  args: {
    route: busRoute,
    onClick: () => {},
    minutesAway: 3,
  },
}

export const TramNoArrival: Story = {
  args: {
    route: tramRoute,
    onClick: () => {},
    minutesAway: null,
  },
}

export const TrolleybusFull: Story = {
  args: {
    route: trolleyRoute,
    onClick: () => {},
    minutesAway: 8,
  },
}

export const AllTypes: Story = {
  args: { route: busRoute, onClick: () => {} },
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <RouteCard route={busRoute} onClick={() => {}} minutesAway={3} />
      <RouteCard route={tramRoute} onClick={() => {}} minutesAway={null} />
      <RouteCard route={trolleyRoute} onClick={() => {}} minutesAway={8} />
    </div>
  ),
}

