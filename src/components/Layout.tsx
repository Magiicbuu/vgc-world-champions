import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'

const NAV_LINKS = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/campeones', label: 'Campeones' },
  { to: '/pokemon', label: 'Pokédex' },
  { to: '/estadisticas', label: 'Estadísticas' },
  { to: '/pokealex', label: 'PokeAlex' },
  { to: '/glosario', label: 'Glosario' },
]

export function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.pathname])

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="container header-inner">
          <Link
            to="/"
            className="brand"
            aria-label="VGC World Champions, inicio"
            onClick={() => setMenuOpen(false)}
          >
            <span className="brand-ball" aria-hidden />
            <span className="brand-text">
              <strong>VGC</strong>
              <span>World Champions</span>
            </span>
          </Link>

          <button
            type="button"
            className="menu-toggle"
            aria-expanded={menuOpen}
            aria-controls="main-nav"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span aria-hidden>{menuOpen ? '✕' : '☰'}</span>
            <span className="sr-only">Abrir menú</span>
          </button>

          <nav id="main-nav" className={`main-nav ${menuOpen ? 'is-open' : ''}`}>
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) => (isActive ? 'nav-link is-active' : 'nav-link')}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="site-main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <div className="brand">
              <span className="brand-ball" aria-hidden />
              <span className="brand-text">
                <strong>VGC</strong>
                <span>World Champions</span>
              </span>
            </div>
            <p>
              Un archivo divulgativo de los Campeones Mundiales de Pokémon VGC y de la carrera
              competitiva de PokeAlex. Proyecto de Fin de Grado.
            </p>
          </div>

          <div className="footer-column">
            <h3>Explorar</h3>
            <Link to="/campeones">Todos los campeones</Link>
            <Link to="/pokemon">Pokédex de campeones</Link>
            <Link to="/estadisticas">Estadísticas</Link>
            <Link to="/pokealex">Carrera de PokeAlex</Link>
            <Link to="/glosario">Glosario y metodología</Link>
          </div>

          <div className="footer-column">
            <h3>Fuentes</h3>
            <a href="https://limitlessvgc.com/" target="_blank" rel="noopener noreferrer">
              Limitless VGC
            </a>
            <a href="https://pokeapi.co/" target="_blank" rel="noopener noreferrer">
              PokéAPI
            </a>
            <a href="https://www.pokemon.com/es/play-pokemon/worlds/" target="_blank" rel="noopener noreferrer">
              Pokémon Worlds
            </a>
          </div>
        </div>

        <div className="container footer-bottom">
          <p>
            Pokémon y todos los nombres relacionados son marcas de Nintendo, Creatures Inc. y GAME
            FREAK inc. Este sitio no está afiliado a The Pokémon Company.
          </p>
          <p>Datos actualizados a noviembre de 2026.</p>
        </div>
      </footer>
    </div>
  )
}
