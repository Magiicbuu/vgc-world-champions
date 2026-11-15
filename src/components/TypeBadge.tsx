import { TYPE_LABELS } from '../lib/typeLabels'

interface TypeBadgeProps {
  typeKey: string
  label?: string
  size?: 'sm' | 'md'
}

export function TypeBadge({ typeKey, label, size = 'sm' }: TypeBadgeProps) {
  return (
    <span className={`type-badge type-${typeKey} ${size === 'md' ? 'type-badge-md' : ''}`}>
      {label ?? TYPE_LABELS[typeKey] ?? typeKey}
    </span>
  )
}
