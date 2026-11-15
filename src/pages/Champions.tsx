import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { champions, countries } from '../data'
import { Flag } from '../components/Flag'
import { usePageTitle } from '../lib/usePageTitle'

type Order = 'desc' | 'asc'

export function Champions() {
  usePageTitle('Campeones')
  const [query, setQuery] = useState('')
  const [country, setCountry] = useState('all')
  const [order, setOrder] = useState<Order>('desc')

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()

    return [...champions]
      .filter((champion) => {
        if (champion.cancelled) {
          return normalized === '' && country === 'all'
        }
        if (country !== 'all' && champion.countryName !== country) return false
        if (!normalized) return true
        const haystack = [
          String(champion.year),
          champion.champion ?? '',
          champion.finalist ?? '',
          champion.countryName ?? '',
          champion.location,
          champion.regulation,
          ...champion.team.map((pokemon) => pokemon.displayName),
        ]
          .join(' ')
          .toLowerCase()
        return haystack.includes(normalized)
      })
      .sort((a, b) => (order === 'desc' ? b.year - a.year : a.year - b.year))
  }, [query, country, order])

  return (
    <div className="container page">
      <header className="page-header">
        <p className="eyebrow">Archivo</p>
        <h1>Todos los campeones del mundo</h1>
        <p>
          Explora las {champions.filter((champion) => !champion.cancelled).length} ediciones
          disputadas del Campeonato Mundial de Pokémon VGC. Busca por año, jugador, país o Pokémon.
        </p>
      </header>

      <div className="filters">
        <label className="field field-grow">
          <span>Buscar</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ej. Wolfe, 2022, Rayquaza, España…"
          />
        </label>

        <label className="field">
          <span>País</span>
          <select value={country} onChange={(event) => setCountry(event.target.value)}>
            <option value="all">Todos</option>
            {countries.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Orden</span>
          <select value={order} onChange={(event) => setOrder(event.target.value as Order)}>
            <option value="desc">Más reciente primero</option>
            <option value="asc">Más antiguo primero</option>
          </select>
        </label>
      </div>

      <p className="results-count">
        {filtered.length} {filtered.length === 1 ? 'edición' : 'ediciones'}
      </p>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <h2>Sin resultados</h2>
          <p>Prueba con otro nombre, país o Pokémon.</p>
          <button
            type="button"
            className="button button-ghost"
            onClick={() => {
              setQuery('')
              setCountry('all')
            }}
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="champion-grid">
          {filtered.map((champion) =>
            champion.cancelled ? (
              <article className="champion-tile is-cancelled" key={champion.year}>
                <div className="champion-tile-top">
                  <span className="champion-year">{champion.year}</span>
                  <span className="pill pill-muted">Cancelado</span>
                </div>
                <h2>Sin campeón</h2>
                <p className="muted">{champion.summary}</p>
              </article>
            ) : (
              <Link
                to={`/campeones/${champion.year}`}
                className="champion-tile"
                key={champion.year}
              >
                <div className="champion-tile-top">
                  <span className="champion-year">{champion.year}</span>
                  <span className="pill">{champion.countryName}</span>
                </div>
                <h2>
                  <Flag code={champion.country} label={champion.countryName} />{' '}
                  {champion.champion}
                </h2>
                <p className="muted">
                  {champion.regulation} · {champion.format}
                </p>
                <div className="champion-tile-sprites">
                  {champion.team.map((pokemon) => (
                    <img
                      key={pokemon.key}
                      src={pokemon.sprite}
                      alt={pokemon.displayName}
                      loading="lazy"
                    />
                  ))}
                </div>
                <p className="champion-tile-finalist">
                  Subcampeón: {champion.finalist}{' '}
                  <Flag code={champion.finalistCountry} label={champion.finalistCountryName} />
                </p>
              </Link>
            ),
          )}
        </div>
      )}
    </div>
  )
}
