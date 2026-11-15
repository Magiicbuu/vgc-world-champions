import { Link } from 'react-router-dom'
import {
  champions,
  countries,
  editions,
  latestEdition,
  pokealex,
  totalPokemon,
  uniqueChampions,
} from '../data'
import { ConfidenceBadge } from '../components/ConfidenceBadge'
import { Flag } from '../components/Flag'
import { usePageTitle } from '../lib/usePageTitle'

export function Home() {
  usePageTitle()
  const timeline = [...champions].reverse()

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Pokémon VGC · 2008–2026</p>
            <h1>
              La historia del <span className="gradient-text">Mundial de Pokémon</span>, equipo a
              equipo.
            </h1>
            <p className="hero-lead">
              Todos los campeones mundiales de VGC, sus equipos y los sets con los que ganaron.
              Sin inventar datos: cada detalle indica de dónde sale.
            </p>
            <div className="hero-actions">
              <Link className="button button-primary" to="/campeones">
                Explorar campeones
              </Link>
              <Link className="button button-ghost" to="/pokealex">
                Carrera de PokeAlex
              </Link>
            </div>
            <dl className="hero-stats">
              <div>
                <dt>Ediciones disputadas</dt>
                <dd>{editions.length}</dd>
              </div>
              <div>
                <dt>Campeones</dt>
                <dd>{uniqueChampions}</dd>
              </div>
              <div>
                <dt>Pokémon</dt>
                <dd>{totalPokemon}</dd>
              </div>
              <div>
                <dt>Países</dt>
                <dd>{countries.length}</dd>
              </div>
            </dl>
          </div>

          <div className="hero-art">
            <div className="hero-art-glow" aria-hidden />
            <div className="hero-champion-label">
              <span className="hero-champion-year">{latestEdition.year}</span>
              <strong>{latestEdition.champion}</strong>
              <span>
                <Flag code={latestEdition.country} label={latestEdition.countryName} />{' '}
                {latestEdition.countryName}
              </span>
            </div>
            <div className="hero-sprites">
              {latestEdition.team.map((pokemon) => (
                <Link
                  key={pokemon.key}
                  to={`/campeones/${latestEdition.year}/${pokemon.key}`}
                  className="hero-sprite"
                  title={pokemon.displayName}
                >
                  <img src={pokemon.sprite} alt={pokemon.displayName} />
                </Link>
              ))}
            </div>
            <p className="hero-art-caption">
              Último campeón · {latestEdition.location}
            </p>
          </div>
        </div>
      </section>

      <section id="historia" className="section">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">Línea temporal</p>
            <h2>Campeones año a año</h2>
            <p>
              De Orlando 2008 a San Francisco 2026. Entra en cada edición para ver el equipo
              completo, los sets y las fuentes.
            </p>
          </div>

          <div className="timeline">
            {timeline.map((champion) =>
              champion.cancelled ? (
                <article className="timeline-item is-cancelled" key={champion.year}>
                  <div className="timeline-year">{champion.year}</div>
                  <div className="timeline-card">
                    <p className="timeline-kicker">Edición cancelada</p>
                    <h3>Sin campeón</h3>
                    <p className="muted">{champion.summary}</p>
                  </div>
                </article>
              ) : (
                <article className="timeline-item" key={champion.year}>
                  <div className="timeline-year">{champion.year}</div>
                  <div className="timeline-card">
                    <div className="timeline-card-head">
                      <div>
                        <p className="timeline-kicker">
                          {champion.regulation} · {champion.format}
                        </p>
                        <h3>
                          <Flag code={champion.country} label={champion.countryName} />{' '}
                          {champion.champion}
                        </h3>
                        <p className="muted">
                          {champion.countryName} · {champion.location}
                        </p>
                      </div>
                      <Link className="button button-small" to={`/campeones/${champion.year}`}>
                        Ver equipo
                      </Link>
                    </div>

                    <div className="timeline-sprites">
                      {champion.team.map((pokemon) => (
                        <Link
                          key={pokemon.key}
                          to={`/campeones/${champion.year}/${pokemon.key}`}
                          className="timeline-sprite"
                          title={pokemon.displayName}
                        >
                          <img src={pokemon.sprite} alt={pokemon.displayName} loading="lazy" />
                        </Link>
                      ))}
                    </div>

                    <p className="timeline-finalist">
                      Subcampeón: <strong>{champion.finalist}</strong>{' '}
                      <Flag code={champion.finalistCountry} label={champion.finalistCountryName} />
                    </p>
                  </div>
                </article>
              ),
            )}
          </div>
        </div>
      </section>

      <section className="section section-tinted">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">Qué encontrarás</p>
            <h2>Un archivo pensado para consultar, no solo para mirar</h2>
          </div>
          <div className="feature-grid">
            <article className="feature-card">
              <span className="feature-icon" aria-hidden>
                ⚡
              </span>
              <h3>Fichas de equipo</h3>
              <p>
                Los equipos completos de cada campeón: 4 Pokémon en 2008 y 6 desde 2009, con objeto,
                habilidad, naturaleza, EVs, movimientos y estadísticas base.
              </p>
            </article>
            <article className="feature-card">
              <span className="feature-icon" aria-hidden>
                🔎
              </span>
              <h3>Datos con procedencia</h3>
              <p>
                Cada set distingue entre dato oficial, report del jugador, fuente comunitaria o
                información sin confirmar.
              </p>
            </article>
            <article className="feature-card">
              <span className="feature-icon" aria-hidden>
                <Flag code="ES" label="España" className="flag-icon-lg" />
              </span>
              <h3>La carrera de PokeAlex</h3>
              <p>
                Una sección independiente con los hitos, resultados y equipos representativos del
                jugador español Alex Gómez «PokeAlex».
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">Explorar el archivo</p>
            <h2>Dos formas de recorrer los datos</h2>
          </div>
          <div className="shortcut-grid">
            <Link to="/pokemon" className="shortcut-card">
              <span className="shortcut-kicker">Sets</span>
              <h3>Pokédex de campeones</h3>
              <p>
                Todos los sets ganadores, con búsqueda por Pokémon, movimiento, objeto, jugador,
                tipo o año.
              </p>
              <span className="text-link">Abrir la Pokédex →</span>
            </Link>
            <Link to="/estadisticas" className="shortcut-card">
              <span className="shortcut-kicker">Datos</span>
              <h3>Estadísticas</h3>
              <p>
                Títulos por jugador y país, Pokémon más repetidos y tipos dominantes en las
                ediciones disputadas.
              </p>
              <span className="text-link">Ver estadísticas →</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container pokealex-teaser">
          <div className="pokealex-teaser-copy">
            <p className="eyebrow">Sección independiente</p>
            <h2>La carrera de PokeAlex</h2>
            <p>
              {pokealex.bio} Repasa su trayectoria desde los foros de 2009 hasta el circuito
              internacional actual.
            </p>
            <div className="teaser-stats">
              {pokealex.stats.slice(0, 4).map((stat) => (
                <div key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
            <Link className="button button-primary" to="/pokealex">
              Ver su carrera completa
            </Link>
          </div>
          <div className="pokealex-teaser-card">
            <div className="avatar avatar-large avatar-photo">
              <img
                src="/pokealex.webp"
                alt=""
                width={720}
                height={1080}
                loading="lazy"
                decoding="async"
              />
            </div>
            <p className="teaser-name">{pokealex.name}</p>
            <p className="muted">
              <Flag code={pokealex.country} label={pokealex.countryName} /> {pokealex.countryName}{' '}
              · {pokealex.team}
            </p>
            <div className="teaser-team-sprites">
              {pokealex.teams[1]?.pokemon.map((pokemon) => (
                <img key={pokemon.key} src={pokemon.sprite} alt={pokemon.displayName} loading="lazy" />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section section-tinted">
        <div className="container methodology">
          <div>
            <p className="eyebrow">Metodología</p>
            <h2>Cómo se construyen los datos</h2>
            <p>
              Los equipos de campeones se reconstruyen a partir de Limitless VGC, reportes de los
              jugadores, cobertura oficial de Pokémon y archivos comunitarios. Las estadísticas,
              tipos y traducciones se obtienen de PokéAPI.
            </p>
            <p>
              Cuando los EVs o la naturaleza no se publicaron, se indica explícitamente. No se
              rellenan huecos con estimaciones.
            </p>
            <Link className="text-link" to="/glosario">
              Leer la metodología completa →
            </Link>
          </div>
          <div className="confidence-legend">
            <ConfidenceBadge value="oficial" />
            <ConfidenceBadge value="report" />
            <ConfidenceBadge value="comunidad" />
            <ConfidenceBadge value="desconocido" />
          </div>
        </div>
      </section>
    </>
  )
}
