import type { Source } from '../types'

export function SourceList({ sources }: { sources: Source[] }) {
  return (
    <ul className="source-list">
      {sources.map((source) => (
        <li key={source.url}>
          <a href={source.url} target="_blank" rel="noopener noreferrer">
            <span>{source.label}</span>
            <span className="source-arrow" aria-hidden>
              ↗
            </span>
          </a>
        </li>
      ))}
    </ul>
  )
}
