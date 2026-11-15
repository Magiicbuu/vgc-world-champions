import { Link, useParams } from 'react-router-dom'
import { getAdjacentEditions, getChampion } from '../data'
import { Flag } from '../components/Flag'
import { PokemonCard } from '../components/PokemonCard'
import { SourceList } from '../components/SourceList'
import { usePageTitle } from '../lib/usePageTitle'

export function ChampionDetail() {
  const { year } = useParams()
  const champion = getChampion(Number(year))
  usePageTitle(
    champion
      ? champion.cancelled
        ? `Edición cancelada · ${champion.year}`
        : `${champion.champion} · ${champion.year}`
      : 'Edición no encontrada',
  )

  if (!champion) {
    return (
      <div className="container page">
        <div className="empty-state">
          <p className="eyebrow">Error 404</p>
          <h1>Edición no encontrada</h1>
          <p>No existe una edición del Mundial con ese año.</p>
          <Link className="button button-primary" to="/campeones">
            Volver a campeones
          </Link>
        </div>
      </div>
    )
  }

  if (champion.cancelled) {
    return (
      <div className="container page">
        <nav className="breadcrumb" aria-label="Migas de pan">
          <Link to="/">Inicio</Link>
          <span aria-hidden>/</span>
          <Link to="/campeones">Campeones</Link>
          <span aria-hidden>/</span>
          <span>{champion.year}</span>
        </nav>
        <div className="empty-state">
          <p className="eyebrow">{champion.year}</p>
          <h1>Edición cancelada</h1>
          <p>{champion.summary}</p>
          <Link className="button button-primary" to="/campeones">
            Ver otras ediciones
          </Link>
        </div>
      </div>
    )
  }

  const { previous, next } = getAdjacentEditions(champion.year)

  return (
    <div className="container page">
      <nav className="breadcrumb" aria-label="Migas de pan">
        <Link to="/">Inicio</Link>
        <span aria-hidden>/</span>
        <Link to="/campeones">Campeones</Link>
        <span aria-hidden>/</span>
        <span>{champion.year}</span>
      </nav>

      <header className="champion-hero">
        <div className="champion-hero-main">
          <span className="champion-hero-year" aria-hidden>
            {champion.year}
          </span>
          <p className="eyebrow">
            Campeón del Mundo · {champion.games}
          </p>
          <h1>
            <Flag
              code={champion.country}
              label={champion.countryName}
              className="flag-icon-lg"
            />{' '}
            {champion.champion}
          </h1>
          <p className="champion-hero-sub">
            {champion.countryName} · {champion.location}
          </p>
          <p className="champion-hero-summary">{champion.summary}</p>

          <div className="meta-grid">
            <div>
              <span>Fecha</span>
              <strong>{champion.date}</strong>
            </div>
            <div>
              <span>Formato</span>
              <strong>{champion.format}</strong>
            </div>
            <div>
              <span>Reglamento</span>
              <strong>{champion.regulation}</strong>
            </div>
            <div>
              <span>Subcampeón</span>
              <strong>
                <Flag code={champion.finalistCountry} label={champion.finalistCountryName} />{' '}
                {champion.finalist}
              </strong>
            </div>
          </div>
        </div>

        <aside className="finalist-card">
          <p className="eyebrow">Final</p>
          <div className="finalist-versus">
            <div>
              <Flag
                code={champion.country}
                label={champion.countryName}
                className="flag-icon-lg"
              />
              <strong>{champion.champion}</strong>
              <span className="pill pill-win">Campeón</span>
            </div>
            <span className="versus" aria-hidden>
              vs
            </span>
            <div>
              <Flag
                code={champion.finalistCountry}
                label={champion.finalistCountryName}
                className="flag-icon-lg"
              />
              <strong>{champion.finalist}</strong>
              <span className="pill">Subcampeón</span>
            </div>
          </div>
          <p className="muted">
            {champion.location} · {champion.date}
          </p>
        </aside>
      </header>

      <section className="section-inner">
        <div className="section-heading section-heading-row">
          <div>
            <p className="eyebrow">Equipo campeón</p>
            <h2>Los {champion.team.length} Pokémon del título</h2>
            <p>Haz clic en cualquier Pokémon para ver su set completo y sus estadísticas.</p>
          </div>
          <span className="pill">{champion.team.length} miembros</span>
        </div>

        <div className="team-grid">
          {champion.team.map((pokemon) => (
            <PokemonCard key={pokemon.key} year={champion.year} pokemon={pokemon} />
          ))}
        </div>
      </section>

      <section className="section-inner two-columns">
        <div className="panel">
          <h2>Fuentes de esta edición</h2>
          <SourceList sources={champion.sources} />
        </div>
        <div className="panel panel-muted">
          <h2>Sobre los sets</h2>
          <p>
            Los datos se han reconstruido a partir de las fuentes listadas. Cuando un set no tiene
            EVs o naturaleza públicos, se muestra como «no publicados» en lugar de estimarlos.
          </p>
          <Link className="text-link" to="/glosario">
            Cómo se clasifica la información →
          </Link>
        </div>
      </section>

      <nav className="pager" aria-label="Ediciones anterior y siguiente">
        {previous ? (
          <Link to={`/campeones/${previous.year}`} className="pager-link">
            <span>← Edición anterior</span>
            <strong>
              <Flag code={previous.country} label={previous.countryName} /> {previous.year} ·{' '}
              {previous.champion}
            </strong>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link to={`/campeones/${next.year}`} className="pager-link pager-link-right">
            <span>Edición siguiente →</span>
            <strong>
              <Flag code={next.country} label={next.countryName} /> {next.year} · {next.champion}
            </strong>
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  )
}
