interface FlagProps {
  code?: string | null
  label?: string | null
  className?: string
}

export function Flag({ code, label, className }: FlagProps) {
  if (!code) return null

  return (
    <img
      src={`/flags/${code.toLowerCase()}.png`}
      alt={label ? `Bandera de ${label}` : ''}
      className={className ? `flag-icon ${className}` : 'flag-icon'}
      width={20}
      height={14}
      loading="lazy"
      decoding="async"
    />
  )
}
