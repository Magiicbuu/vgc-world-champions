const CONFIDENCE: Record<string, { label: string; hint: string }> = {
  oficial: {
    label: 'Dato oficial',
    hint: 'Publicado por Pokémon, la organización del torneo o el propio jugador.',
  },
  report: {
    label: 'Report del jugador',
    hint: 'Extraído de un report, entrevista o publicación del propio jugador.',
  },
  comunidad: {
    label: 'Fuente comunitaria',
    hint: 'Recopilado por la comunidad. Puede faltar algún detalle del set.',
  },
  desconocido: {
    label: 'Sin confirmar',
    hint: 'No hay una fuente pública fiable para este dato.',
  },
}

export function ConfidenceBadge({ value }: { value: string }) {
  const info = CONFIDENCE[value] ?? {
    label: value,
    hint: 'Nivel de confianza del dato.',
  }
  return (
    <span className={`confidence confidence-${value}`} title={info.hint}>
      <span className="confidence-dot" aria-hidden />
      {info.label}
    </span>
  )
}
