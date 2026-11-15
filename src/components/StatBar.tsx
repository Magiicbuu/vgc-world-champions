interface StatBarProps {
  label: string
  value: number
  max?: number
  accent?: string
}

export function StatBar({ label, value, max = 255, accent }: StatBarProps) {
  const percentage = Math.max(4, Math.min(100, Math.round((value / max) * 100)))
  return (
    <div className="stat-bar">
      <span className="stat-bar-label">{label}</span>
      <span className="stat-bar-value">{value}</span>
      <span className="stat-bar-track">
        <span
          className="stat-bar-fill"
          style={{ width: `${percentage}%`, ...(accent ? { background: accent } : {}) }}
        />
      </span>
    </div>
  )
}
