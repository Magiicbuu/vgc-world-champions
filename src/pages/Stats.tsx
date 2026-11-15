import { Link } from 'react-router-dom'
import {
  championTitles,
  countryTitles,
  editions,
  species,
  totalPokemon,
  totalTypeSlots,
  typeCounts,
  uniqueChampions,
  uniqueSpecies,
} from '../data'
import { Flag } from '../components/Flag'
import { TypeBadge } from '../components/TypeBadge'
import { usePageTitle } from '../lib/usePageTitle'

function percent(value: number, total: number) {
  return total === 0 ? 0 : Math.round((value / total) * 1000) / 10
}

export function Stats() {
  usePageTitle('Estadísticas')
  const maxChampionTitles = championTitles[0]?.count ?? 1
  const maxCountryTitles = countryTitles[0]?.count ?? 1
  const maxSpecies = species[0]?.count ?? 1
  const maxType = typeCounts[0]?.count ?? 1
  const topSpecies = species.slice(0, 12)
  const topTypes = typeCounts.slice(0, 10)
  const topCountries = countryTitles
  const multiTitleChampions = championTitles.filter((entry) => entry.count > 1)
  const mostRecent = editions[editions.length - 1]

  return (
    <div className="container page">
      <header className="page-header">
        <p className="eyebrow">Datos del archivo</p>
        <h1>Estadísticas de los Mundiales</h1>
        <p>
          Una lectura rápida de {editions.length} ediciones disputadas: títulos por jugador y país,
          Pokémon más repetidos y tipos dominantes. Los cálculos se hacen sobre los equipos
          campeones.
        </p>
      </header>

      <div className="stat-grid stats-summary">
        <article className="stat-card">
          <strong>{editions.length}</strong>
          <span>Ediciones disputadas</span>
          <small>2008–2026</small>
        </article>
        <article className="stat-card">
          <strong>{uniqueChampions}</strong>
          <span>Campeones distintos</span>
          <small>{championTitles.length} jugadores con título</small>
        </article>
        <article className="stat-card">
          <strong>{totalPokemon}</strong>
          <span>Pokémon campeones</span>
          <small>{uniqueSpecies} especies distintas</small>
        </article>
        <article className="stat-card">
          <strong>{countryTitles.length}</strong>
          <span>Países campeones</span>
          <small>{topCountries.slice(0, 3).map((entry) => entry.countryName).join(' · ')}</small>
        </article>
      </div>

      <section className="section-inner">
        <div className="section-heading">
          <p className="eyebrow">Palmarés</p>
          <h2>Jugadores con más títulos</h2>
          <p>
            Ray Rizzo es el único jugador con tres Mundiales; el resto de campeones tiene uno.
          </p>
        </div>
        <div className="rank-list rank-list-columns">
          {championTitles.map((entry) => (
            <article className="rank-item" key={entry.champion}>
              <span className="rank-position">
                <Flag
                  code={entry.country}
                  label={entry.countryName}
                  className="flag-icon-lg"
                />
              </span>
              <div className="rank-body">
                <div className="rank-head">
                  <strong>{entry.champion}</strong>
                  <span>
                    {entry.count} {entry.count === 1 ? 'título' : 'títulos'}
                  </span>
                </div>
                <div className="rank-track">
                  <span style={{ width: `${(entry.count / maxChampionTitles) * 100}%` }} />
                </div>
                <small>
                  {entry.years.join(' · ')} · {entry.countryName}
                </small>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-inner two-columns">
        <div className="panel">
          <h2>Títulos por país</h2>
          <div className="rank-list">
            {topCountries.map((entry) => (
              <article className="rank-item rank-item-compact" key={entry.countryName}>
                <span className="rank-position">{entry.count}</span>
                <div className="rank-body">
                  <div className="rank-head">
                    <strong>
                      <Flag code={entry.country} label={entry.countryName} /> {entry.countryName}
                    </strong>
                    <span>{percent(entry.count, editions.length)} %</span>
                  </div>
                  <div className="rank-track">
                    <span style={{ width: `${(entry.count / maxCountryTitles) * 100}%` }} />
                  </div>
                  <small>{entry.champions.join(', ')}</small>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="panel">
          <h2>Tipos más comunes</h2>
          <p className="panel-note">
            Cuenta ambos tipos de cada Pokémon; un set de doble tipo suma dos veces.
          </p>
          <div className="type-stat-list">
            {topTypes.map((entry) => (
              <div className="type-stat-row" key={entry.typeKey}>
                <TypeBadge typeKey={entry.typeKey} label={entry.type} />
                <div className="type-stat-track">
                  <span style={{ width: `${(entry.count / maxType) * 100}%` }} />
                </div>
                <span className="type-stat-value">
                  {entry.count} <small>({percent(entry.count, totalTypeSlots)} %)</small>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-inner">
        <div className="section-heading">
          <p className="eyebrow">Repeticiones</p>
          <h2>Pokémon con más apariciones</h2>
          <p>
            Se agrupan las formas bajo su especie base. Un mismo Pokémon puede aparecer en varios
            equipos campeones.
          </p>
        </div>
        <div className="species-rank-grid">
          {topSpecies.map((entry, index) => (
            <article className="species-rank-card" key={entry.species}>
              <span className="species-rank-position">#{index + 1}</span>
              <img src={entry.sprite} alt={entry.displayName} loading="lazy" />
              <div className="species-rank-copy">
                <strong>{entry.displayName}</strong>
                <span>
                  {entry.count} {entry.count === 1 ? 'aparición' : 'apariciones'}
                </span>
                <small>{entry.years.join(' · ')}</small>
              </div>
              <span className="species-rank-meter" aria-hidden>
                <span style={{ width: `${(entry.count / maxSpecies) * 100}%` }} />
              </span>
            </article>
          ))}
        </div>
        <p className="stats-cta">
          ¿Buscas un set concreto? <Link to="/pokemon">Explora la Pokédex de campeones</Link>.
        </p>
      </section>

      <section className="section-inner">
        <div className="section-heading">
          <p className="eyebrow">Contexto</p>
          <h2>Curiosidades del archivo</h2>
        </div>
        <div className="curiosity-grid">
          <article className="curiosity-card">
            <strong>3</strong>
            <span>Títulos de Ray Rizzo</span>
            <p>El único tricampeón mundial (2010, 2011 y 2012).</p>
          </article>
          <article className="curiosity-card">
            <strong>4</strong>
            <span>Pokémon en 2008</span>
            <p>La única edición con equipos de cuatro Pokémon; desde 2009 son seis.</p>
          </article>
          <article className="curiosity-card">
            <strong>2020–21</strong>
            <span>Sin Mundial</span>
            <p>El campeonato se canceló por la pandemia de COVID-19.</p>
          </article>
          <article className="curiosity-card">
            <strong>{multiTitleChampions.length}</strong>
            <span>Jugadores con más de un título</span>
            <p>{multiTitleChampions.map((entry) => entry.champion).join(', ') || 'Ninguno'}.</p>
          </article>
          <article className="curiosity-card">
            <strong>2026</strong>
            <span>Vuelve la Mega Evolución</span>
            <p>
              Tras el ciclo de Teracristalización (2023–2025), el formato M-B recupera las Megas.
            </p>
          </article>
          <article className="curiosity-card">
            <strong>{mostRecent.year}</strong>
            <span>Última edición</span>
            <p>
              {mostRecent.champion} ({mostRecent.countryName}) ganó en {mostRecent.location}.
            </p>
          </article>
        </div>
      </section>
    </div>
  )
}
