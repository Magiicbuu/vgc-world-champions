import { pokealex } from '../data'
import { Flag } from '../components/Flag'
import { usePageTitle } from '../lib/usePageTitle'

const TEAM_LABELS: Record<string, { title: string; detail: string }> = {
  worlds2019: { title: 'Worlds 2019', detail: '6º del mundo' },
  naic2023: { title: 'NAIC 2023', detail: 'Campeón' },
  euic2024: { title: 'EUIC 2024', detail: 'Top 4' },
  worlds2024: { title: 'Worlds 2024', detail: '29º' },
  naic2026: { title: 'NAIC 2026', detail: '14º' },
}

const TIER_LABELS: Record<string, string> = {
  inicio: 'Inicios',
  nacional: 'Nacional',
  regional: 'Regional',
  internacional: 'Internacional',
  mundial: 'Mundial',
}

export function PokeAlex() {
  usePageTitle('Carrera de PokeAlex')

  return (
    <div className="container page">
      <header className="pokealex-hero">
        <figure className="pokealex-photo">
          <img
            src="/pokealex.webp"
            alt={`Retrato de ${pokealex.name}`}
            width={720}
            height={1080}
            loading="eager"
            decoding="async"
          />
          <figcaption>
            Foto:{' '}
            <a href="https://www.pokealex.es/" target="_blank" rel="noopener noreferrer">
              pokealex.es
            </a>
          </figcaption>
        </figure>
        <div className="pokealex-hero-copy">
          <p className="eyebrow">Carrera competitiva</p>
          <h1>{pokealex.name}</h1>
          <p className="pokealex-alias">
            «{pokealex.alias}» ·{' '}
            <Flag code={pokealex.country} label={pokealex.countryName} /> {pokealex.countryName}
          </p>
          <p className="pokealex-role">{pokealex.role}</p>
          <div className="pokealex-meta">
            <span>
              <strong>Nacimiento</strong> {pokealex.born}
            </span>
            <span>
              <strong>Equipo</strong> {pokealex.team} (desde {pokealex.since})
            </span>
          </div>
          <div className="link-row">
            {pokealex.links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="button button-small button-ghost"
              >
                {link.label} ↗
              </a>
            ))}
          </div>
        </div>
      </header>

      <section className="section-inner">
        <p className="pokealex-bio">{pokealex.bio}</p>
      </section>

      <section className="section-inner">
        <div className="section-heading">
          <p className="eyebrow">Palmarés</p>
          <h2>Números de su carrera</h2>
        </div>
        <div className="stat-grid">
          {pokealex.stats.map((stat) => (
            <article className="stat-card" key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
              <small>{stat.detail}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="section-inner">
        <div className="section-heading">
          <p className="eyebrow">Trayectoria</p>
          <h2>Hitos año a año</h2>
          <p>Resultados competitivos más relevantes, desde sus inicios hasta 2026.</p>
        </div>
        <ol className="milestones">
          {pokealex.milestones.map((milestone, index) => (
            <li className={`milestone milestone-${milestone.tier}`} key={`${milestone.year}-${index}`}>
              <span className="milestone-year">{milestone.year}</span>
              <div className="milestone-card">
                <span className="milestone-tier">{TIER_LABELS[milestone.tier] ?? milestone.tier}</span>
                <h3>{milestone.title}</h3>
                <p>{milestone.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="section-inner">
        <div className="section-heading">
          <p className="eyebrow">Equipos representativos</p>
          <h2>Con qué compitió</h2>
          <p>
            Una selección de equipos de sus mejores resultados. No se incluyen sets completos porque
            no todos los EVs y naturalezas son públicos.
          </p>
        </div>
        <div className="pokealex-teams">
          {pokealex.teams.map((team) => {
            const label = TEAM_LABELS[team.key] ?? { title: team.key, detail: '' }
            return (
              <article className="pokealex-team-card" key={team.key}>
                <div className="pokealex-team-head">
                  <h3>{label.title}</h3>
                  <span className="pill">{label.detail}</span>
                </div>
                <div className="pokealex-team-sprites">
                  {team.pokemon.map((pokemon) => (
                    <div key={pokemon.key} className="pokealex-team-sprite">
                      <img src={pokemon.sprite} alt={pokemon.displayName} loading="lazy" />
                      <span>{pokemon.displayName}</span>
                    </div>
                  ))}
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section className="section-inner two-columns">
        <div className="panel">
          <h2>Fuentes de la sección</h2>
          <ul className="source-list">
            {pokealex.links.map((link) => (
              <li key={link.url}>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  <span>{link.label}</span>
                  <span className="source-arrow" aria-hidden>
                    ↗
                  </span>
                </a>
              </li>
            ))}
            <li>
              <a href="https://limitlessvgc.com/players/28/results" target="_blank" rel="noopener noreferrer">
                <span>Limitless VGC · resultados del jugador</span>
                <span className="source-arrow" aria-hidden>
                  ↗
                </span>
              </a>
            </li>
          </ul>
        </div>
        <div className="panel panel-muted">
          <h2>Nota metodológica</h2>
          <p>
            Esta sección es independiente del archivo de campeones mundiales. Los hitos se han
            reconstruido con resultados de Limitless VGC, cobertura de torneos y declaraciones
            públicas del jugador.
          </p>
          <p>
            Algunos equipos antiguos no tienen sets completos publicados. Se muestran únicamente los
            Pokémon confirmados.
          </p>
        </div>
      </section>
    </div>
  )
}
