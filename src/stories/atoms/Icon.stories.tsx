import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  IconMap, IconTicket, IconFeedback, IconProfile,
  IconArrow, IconClose, IconCheck, IconCard, IconStar, IconClock,
  IconReview, IconComplaint,
  IconBus, IconWalking, IconAccessibility,
} from '@/assets/Icons'

const ALL_ICONS = {
  IconMap, IconTicket, IconFeedback, IconProfile,
  IconArrow, IconClose, IconCheck, IconCard, IconStar, IconClock,
  IconReview, IconComplaint,
  IconBus, IconWalking, IconAccessibility,
} as const

type IconName = keyof typeof ALL_ICONS

interface IconPreviewProps {
  icon: IconName
  size: number
  color: string
}

const IconPreview = ({ icon, size, color }: IconPreviewProps) => {
  const Component = ALL_ICONS[icon]
  return (
    <div style={{ color, display: 'inline-flex' }}>
      <Component size={size} />
    </div>
  )
}

const meta = {
  title: 'Atoms/Icon',
  component: IconPreview,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    icon: {
      control: 'select',
      options: Object.keys(ALL_ICONS) as IconName[],
    },
    size: {
      control: { type: 'range', min: 12, max: 96, step: 4 },
    },
    color: { control: 'color' },
  },
  args: {
    icon: 'IconBus',
    size: 24,
    color: '#111111',
  },
} satisfies Meta<typeof IconPreview>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: ({ icon, color }) => {
    const Component = ALL_ICONS[icon]
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, color }}>
        {[16, 20, 24, 32, 48].map((s) => (
          <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <Component size={s} />
            <span style={{ fontSize: 11, color: '#6B7280', fontFamily: 'monospace' }}>{s}px</span>
          </div>
        ))}
      </div>
    )
  },
}

export const Gallery: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, padding: 16, maxWidth: 600 }}>
      {(Object.entries(ALL_ICONS) as [IconName, (typeof ALL_ICONS)[IconName]][]).map(([name, Component]) => (
        <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, width: 88 }}>
          <div style={{
            width: 48, height: 48,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: 12, background: '#F4F4F6',
          }}>
            <Component size={24} />
          </div>
          <span style={{ fontSize: 10, color: '#6B7280', textAlign: 'center', fontFamily: 'monospace', wordBreak: 'break-word' }}>
            {name}
          </span>
        </div>
      ))}
    </div>
  ),
}

export const OnColour: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      {(['#111111', '#2563EB', '#16A34A', '#DC2626', '#9333EA'] as const).map((c) => (
        <div key={c} style={{ color: c }}>
          <IconBus size={32} />
        </div>
      ))}
    </div>
  ),
}
