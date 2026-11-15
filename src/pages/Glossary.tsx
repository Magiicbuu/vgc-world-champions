import { ConfidenceBadge } from '../components/ConfidenceBadge'
import { usePageTitle } from '../lib/usePageTitle'

const TERMS = [
  {
    term: 'VGC',
    definition:
      'Video Game Championships: la escena competitiva oficial de los juegos de Pokémon. Se juega en combates dobles por equipos de seis Pokémon, de los que se eligen cuatro por combate.',
  },
  {
    term: 'EV',
    definition:
      'Puntos de esfuerzo. Reparten 510 puntos entre las estadísticas (máximo 252 por estadística) y modifican los stats finales del Pokémon.',
  },
  {
    term: 'IV',
    definition:
      'Valores individuales, de 0 a 31. Determinan el potencial base de cada estadística y se fijan al capturar o criar al Pokémon.',
  },
  {
    term: 'Naturaleza',
    definition:
      'Aumenta un 10 % una estadística y reduce otro 10 %. Es una de las decisiones clave de cualquier set competitivo.',
  },
  {
    term: 'Objeto',
    definition:
      'Cada Pokémon puede llevar un objeto: bayas, restos, pañuelos de elección, gemas, cristales Z, etc. Muchos sets dependen del objeto para funcionar.',
  },
  {
    term: 'Habilidad',
    definition:
      'Efecto pasivo propio de la especie. Puede cambiar por completo el papel del Pokémon en el equipo.',
  },
  {
    term: 'Tera',
    definition:
      'Teracristalización: mecánica de Escarlata y Púrpura que cambia el tipo del Pokémon durante el combate. El tipo Tera se indica en los sets de 2023 a 2025; en 2026 el formato vuelve a Mega Evolución.',
  },
  {
    term: 'Restringido',
    definition:
      'Pokémon legendarios o singulares limitados por reglamento. Los formatos suelen permitir uno o dos por equipo.',
  },
  {
    term: 'GS Cup',
    definition:
      'Formato clásico de los Mundiales de 2010 y 2011: dos Pokémon restringidos por equipo, entre ellos obligatoriamente uno de la pareja oro/plata (Ho-Oh, Lugia, Groudon, Kyogre, Dialga, Palkia, etc.).',
  },
  {
    term: 'Espacio Raro',
    definition:
      'Movimiento que invierte el orden de velocidad durante cinco turnos. Es la base de los equipos de «Trick Room».',
  },
  {
    term: 'OTS',
    definition:
      'Open Team Sheets: los jugadores comparten objeto, habilidad, Tera y movimientos antes de cada combate. No incluye EVs; la naturaleza puede publicarse según el torneo.',
  },
  {
    term: 'Top cut',
    definition:
      'Fase eliminatoria a la que pasan los mejores clasificados de la fase suiza. Un «Top 8» significa haber llegado a cuartos de final.',
  },
  {
    term: 'Bo3',
    definition:
      'Al mejor de tres combates. Es el formato habitual en las eliminatorias de los torneos internacionales y mundiales.',
  },
  {
    term: 'CP',
    definition:
      'Championship Points: puntos de clasificación que se acumulan durante la temporada para acceder al Mundial.',
  },
]

export function Glossary() {
  usePageTitle('Glosario y metodología')

  return (
    <div className="container page">
      <header className="page-header">
        <p className="eyebrow">Glosario y metodología</p>
        <h1>Cómo leer los datos</h1>
        <p>
          Esta web combina información oficial, reportes de jugadores y archivos comunitarios. Aquí
          se explica qué significa cada término y cómo se clasifica la procedencia de los datos.
        </p>
      </header>

      <section className="section-inner">
        <div className="section-heading">
          <p className="eyebrow">Procedencia</p>
          <h2>Niveles de confianza</h2>
          <p>
            Cada set lleva asociado un nivel de confianza. El objetivo es no mezclar datos
            verificados con reconstrucciones parciales.
          </p>
        </div>
        <div className="confidence-cards">
          <article>
            <ConfidenceBadge value="oficial" />
            <p>
              Publicado por Pokémon, la organización del torneo o el propio jugador. Es el nivel más
              alto de fiabilidad.
            </p>
          </article>
          <article>
            <ConfidenceBadge value="report" />
            <p>
              Extraído de un report, entrevista o publicación del jugador. Suele incluir EVs y
              naturaleza, pero puede tener erratas.
            </p>
          </article>
          <article>
            <ConfidenceBadge value="comunidad" />
            <p>
              Recopilado por la comunidad a partir de vídeos, streams o archivos históricos. Puede
              faltar algún detalle.
            </p>
          </article>
          <article>
            <ConfidenceBadge value="desconocido" />
            <p>
              No hay una fuente pública fiable. Se muestra el dato disponible y se evita inventar el
              resto.
            </p>
          </article>
        </div>
      </section>

      <section className="section-inner">
        <div className="section-heading">
          <p className="eyebrow">Vocabulario</p>
          <h2>Términos del competitivo</h2>
        </div>
        <dl className="term-grid">
          {TERMS.map((item) => (
            <div className="term-card" key={item.term}>
              <dt>{item.term}</dt>
              <dd>{item.definition}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="section-inner two-columns">
        <div className="panel">
          <h2>Fuentes principales</h2>
          <ul className="source-list">
            <li>
              <a href="https://limitlessvgc.com/" target="_blank" rel="noopener noreferrer">
                <span>Limitless VGC · equipos y resultados de torneos</span>
                <span className="source-arrow" aria-hidden>
                  ↗
                </span>
              </a>
            </li>
            <li>
              <a href="https://pokeapi.co/" target="_blank" rel="noopener noreferrer">
                <span>PokéAPI · especies, tipos, stats, movimientos y traducciones</span>
                <span className="source-arrow" aria-hidden>
                  ↗
                </span>
              </a>
            </li>
            <li>
              <a href="https://www.pokemon.com/es/play-pokemon/worlds/" target="_blank" rel="noopener noreferrer">
                <span>Pokémon.com · cobertura oficial de los Mundiales</span>
                <span className="source-arrow" aria-hidden>
                  ↗
                </span>
              </a>
            </li>
            <li>
              <a href="https://bulbapedia.bulbagarden.net/wiki/World_Championships" target="_blank" rel="noopener noreferrer">
                <span>Bulbapedia · archivo histórico de los Mundiales</span>
                <span className="source-arrow" aria-hidden>
                  ↗
                </span>
              </a>
            </li>
          </ul>
        </div>
        <div className="panel panel-muted">
          <h2>Limitaciones</h2>
          <p>
            Los sets más antiguos (2008–2012) no siempre se conservan completos. En esos casos se
            muestran los datos confirmados y se marca el set como fuente comunitaria.
          </p>
          <p>
            Los textos de efectos de movimientos, objetos y habilidades proceden de PokéAPI y se
            muestran en su idioma original para no introducir traducciones no oficiales.
          </p>
          <p>
            Los equipos de PokeAlex son una selección representativa, no un archivo exhaustivo de
            todos los torneos disputados.
          </p>
        </div>
      </section>
    </div>
  )
}
