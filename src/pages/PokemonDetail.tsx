import { Link, useParams } from 'react-router-dom'
import { getChampion, getPokemon } from '../data'
import { ConfidenceBadge } from '../components/ConfidenceBadge'
import { Flag } from '../components/Flag'
import { StatBar } from '../components/StatBar'
import { TypeBadge } from '../components/TypeBadge'
import { TYPE_LABELS } from '../lib/typeLabels'
import { usePageTitle } from '../lib/usePageTitle'

const STAT_LABELS = [
  { key: 'hp', label: 'PS' },
  { key: 'atk', label: 'Ataque' },
  { key: 'def', label: 'Defensa' },
  { key: 'spa', label: 'At. Esp.' },
  { key: 'spd', label: 'Def. Esp.' },
  { key: 'spe', label: 'Velocidad' },
] as const

const EV_LABELS = ['PS', 'Ata', 'Def', 'AtE', 'DfE', 'Vel']

export function PokemonDetail() {
  const { year, pokemonKey } = useParams()
  const found = getPokemon(Number(year), pokemonKey ?? '')
  usePageTitle(
    found ? `${found.pokemon.displayName} · ${found.champion.year}` : 'Pokémon no encontrado',
  )

  if (!found) {
    return (
      <div className="container page">
        <div className="empty-state">
          <p className="eyebrow">Error 404</p>
          <h1>Pokémon no encontrado</h1>
          <p>No hay ningún Pokémon con ese identificador en esta edición.</p>
          <Link className="button button-primary" to="/campeones">
            Volver a campeones
          </Link>
        </div>
      </div>
    )
  }

  const { champion, pokemon } = found
  const championEdition = getChampion(champion.year)
  const teamMates = championEdition?.team.filter((member) => member.key !== pokemon.key) ?? []
  const baseStatTotal = Object.values(pokemon.baseStats).reduce((total, value) => total + value, 0)
  const teraLabel = pokemon.teraType
    ? (TYPE_LABELS[pokemon.teraType.toLowerCase()] ?? pokemon.teraType)
    : null

  return (
    <div className="container page">
      <nav className="breadcrumb" aria-label="Migas de pan">
        <Link to="/">Inicio</Link>
        <span aria-hidden>/</span>
        <Link to="/campeones">Campeones</Link>
        <span aria-hidden>/</span>
        <Link to={`/campeones/${champion.year}`}>{champion.year}</Link>
        <span aria-hidden>/</span>
        <span>{pokemon.displayName}</span>
      </nav>

      <header className="pokemon-hero">
        <div className="pokemon-art">
          <div className="pokemon-art-glow" aria-hidden />
          <img src={pokemon.sprite} alt={pokemon.displayName} />
        </div>

        <div className="pokemon-hero-copy">
          <p className="eyebrow">
            {champion.year} ·{' '}
            <Flag code={champion.country} label={champion.countryName} /> {champion.champion}
          </p>
          <h1>{pokemon.displayName}</h1>
          <div className="type-row type-row-lg">
            {pokemon.types.map((type, index) => (
              <TypeBadge
                key={type}
                typeKey={pokemon.typeKeys[index] ?? type.toLowerCase()}
                label={type}
                size="md"
              />
            ))}
          </div>
          <p className="pokemon-hero-summary">
            Set usado por {champion.champion} para ganar el Mundial de {champion.year} en{' '}
            {champion.location}.
          </p>
          <div className="pokemon-hero-badges">
            <ConfidenceBadge value={pokemon.confidence} />
            {pokemon.level ? <span className="pill">Nivel {pokemon.level}</span> : null}
            {teraLabel ? <span className="pill">Tera: {teraLabel}</span> : null}
          </div>
        </div>
      </header>

      <div className="detail-layout">
        <section className="panel">
          <h2>Estadísticas base</h2>
          <div className="stat-list">
            {STAT_LABELS.map((stat) => (
              <StatBar
                key={stat.key}
                label={stat.label}
                value={pokemon.baseStats[stat.key]}
                max={180}
              />
            ))}
          </div>
          <div className="stat-total">
            <span>Total</span>
            <strong>{baseStatTotal}</strong>
          </div>
          <p className="small muted">
            Estadísticas base de la especie según PokéAPI. No incluyen EVs, naturaleza ni objeto.
          </p>
        </section>

        <section className="panel">
          <h2>Set competitivo</h2>
          <dl className="set-list">
            <div>
              <dt>Objeto</dt>
              <dd>
                {pokemon.item.es ? (
                  <span className="set-item">
                    {pokemon.item.sprite ? <img src={pokemon.item.sprite} alt="" /> : null}
                    {pokemon.item.es}
                  </span>
                ) : (
                  <span className="muted">No publicado</span>
                )}
              </dd>
            </div>
            <div>
              <dt>Habilidad</dt>
              <dd>{pokemon.ability.es ?? <span className="muted">No publicada</span>}</dd>
            </div>
            <div>
              <dt>Naturaleza</dt>
              <dd>{pokemon.natureEs ?? pokemon.nature ?? <span className="muted">No publicada</span>}</dd>
            </div>
            <div>
              <dt>Nivel</dt>
              <dd>{pokemon.level ?? <span className="muted">50 (estándar)</span>}</dd>
            </div>
            <div>
              <dt>Tera</dt>
              <dd>{teraLabel ?? <span className="muted">—</span>}</dd>
            </div>
          </dl>

          <h3 className="subsection-title">EVs</h3>
          {pokemon.evs ? (
            <div className="ev-grid">
              {pokemon.evs.map((value, index) => (
                <div key={EV_LABELS[index]}>
                  <span>{EV_LABELS[index]}</span>
                  <strong>{value}</strong>
                  <span className="ev-track">
                    <span style={{ width: `${Math.min(100, (value / 252) * 100)}%` }} />
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="notice">
              Los EVs de este set no se publicaron. La información disponible varía según la
              edición: en años recientes el circuito usa equipos abiertos (OTS), que muestran
              objeto, habilidad y movimientos, pero no siempre incluyen EVs ni naturaleza.
            </p>
          )}

          <h3 className="subsection-title">IVs</h3>
          {pokemon.ivs ? (
            <div className="iv-row">
              {pokemon.ivs.map((value, index) => (
                <span key={EV_LABELS[index]}>
                  {EV_LABELS[index]} <strong>{value}</strong>
                </span>
              ))}
            </div>
          ) : (
            <p className="small muted">No publicados.</p>
          )}
        </section>
      </div>

      <section className="section-inner">
        <div className="section-heading section-heading-row">
          <div>
            <p className="eyebrow">Movimientos</p>
            <h2>Los cuatro movimientos</h2>
          </div>
          <span className="pill">{pokemon.moves.length} movimientos</span>
        </div>

        {pokemon.moves.length === 0 ? (
          <p className="notice">No hay movimientos publicados para este set.</p>
        ) : (
          <div className="move-grid">
            {pokemon.moves.map((move) => (
              <article className="move-card" key={move.en}>
                <div className="move-card-head">
                  <h3>{move.es}</h3>
                  <TypeBadge typeKey={move.typeKey} label={move.type} />
                </div>
                <dl className="move-stats">
                  <div>
                    <dt>Categoría</dt>
                    <dd>{move.category}</dd>
                  </div>
                  <div>
                    <dt>Potencia</dt>
                    <dd>{move.power ?? '—'}</dd>
                  </div>
                  <div>
                    <dt>Precisión</dt>
                    <dd>{move.accuracy ?? '—'}</dd>
                  </div>
                  <div>
                    <dt>PP</dt>
                    <dd>{move.pp ?? '—'}</dd>
                  </div>
                </dl>
                {move.effect ? (
                  <details className="move-effect">
                    <summary>Ver efecto</summary>
                    <p lang="en">{move.effect}</p>
                    <p className="small muted">Texto original de PokéAPI.</p>
                  </details>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </section>

      {pokemon.note ? (
        <section className="section-inner">
          <div className="notice notice-accent">
            <strong>Nota del set:</strong> {pokemon.note}
          </div>
        </section>
      ) : null}

      <section className="section-inner">
        <div className="section-heading section-heading-row">
          <div>
            <p className="eyebrow">Compañeros</p>
            <h2>El resto del equipo</h2>
          </div>
          <Link className="text-link" to={`/campeones/${champion.year}`}>
            Ver la edición completa →
          </Link>
        </div>
        <div className="mini-team">
          {teamMates.map((member) => (
            <Link
              key={member.key}
              to={`/campeones/${champion.year}/${member.key}`}
              className="mini-team-item"
            >
              <img src={member.sprite} alt={member.displayName} loading="lazy" />
              <span>{member.displayName}</span>
            </Link>
          ))}
        </div>
      </section>

      <div className="detail-actions">
        <Link className="button button-ghost" to={`/campeones/${champion.year}`}>
          ← Volver al equipo de {champion.year}
        </Link>
        <Link className="button button-ghost" to="/campeones">
          Todos los campeones
        </Link>
      </div>
    </div>
  )
}
