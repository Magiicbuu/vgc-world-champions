import { useMemo, useState } from 'react'
import { pokemonSets, setTypeOptions, setYearOptions } from '../data'
import { Flag } from '../components/Flag'
import { PokemonCard } from '../components/PokemonCard'
import { usePageTitle } from '../lib/usePageTitle'

type Order = 'desc' | 'asc'

export function PokemonIndex() {
  usePageTitle('Pokédex de campeones')
  const [query, setQuery] = useState('')
  const [year, setYear] = useState('all')
  const [type, setType] = useState('all')
  const [order, setOrder] = useState<Order>('desc')

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return pokemonSets
      .filter((entry) => {
        if (year !== 'all' && entry.year !== Number(year)) return false
        if (type !== 'all' && !entry.pokemon.typeKeys.includes(type)) return false
        if (!normalized) return true
        const haystack = [
          String(entry.year),
          entry.champion,
          entry.countryName ?? '',
          entry.pokemon.displayName,
          entry.pokemon.species,
          entry.pokemon.item.es ?? '',
          entry.pokemon.ability.es ?? '',
          ...entry.pokemon.types,
          ...entry.pokemon.moves.map((move) => move.es),
        ]
          .join(' ')
          .toLowerCase()
        return haystack.includes(normalized)
      })
      .sort((a, b) => {
        const byYear = order === 'asc' ? a.year - b.year : b.year - a.year
        return byYear || a.pokemon.displayName.localeCompare(b.pokemon.displayName, 'es')
      })
  }, [query, year, type, order])

  return (
    <div className="container page">
      <header className="page-header">
        <p className="eyebrow">Archivo de sets</p>
        <h1>Pokédex de campeones</h1>
        <p>
          Los {pokemonSets.length} Pokémon que forman parte de un equipo campeón del mundo, con
          acceso directo a su set, estadísticas y fuentes. Busca por Pokémon, movimiento, objeto,
          jugador o año.
        </p>
      </header>

      <div className="filters">
        <label className="field field-grow">
          <span>Buscar</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Pokémon, movimiento, objeto, jugador..."
          />
        </label>
        <label className="field">
          <span>Año</span>
          <select value={year} onChange={(event) => setYear(event.target.value)}>
            <option value="all">Todos</option>
            {[...setYearOptions].reverse().map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Tipo</span>
          <select value={type} onChange={(event) => setType(event.target.value)}>
            <option value="all">Todos</option>
            {setTypeOptions.map((option) => (
              <option key={option.typeKey} value={option.typeKey}>
                {option.type}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Orden</span>
          <select value={order} onChange={(event) => setOrder(event.target.value as Order)}>
            <option value="desc">Más recientes</option>
            <option value="asc">Más antiguos</option>
          </select>
        </label>
      </div>

      <p className="results-count">
        {filtered.length} {filtered.length === 1 ? 'set' : 'sets'}
        {year !== 'all' ? ` de ${year}` : ''}
        {type !== 'all' ? ` · tipo ${setTypeOptions.find((option) => option.typeKey === type)?.type ?? type}` : ''}
      </p>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <h2>Sin resultados</h2>
          <p>Prueba con otro Pokémon, movimiento, tipo o año.</p>
          <button
            className="button button-primary"
            type="button"
            onClick={() => {
              setQuery('')
              setYear('all')
              setType('all')
              setOrder('desc')
            }}
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="set-index-grid">
          {filtered.map((entry) => (
            <div className="set-index-item" key={`${entry.year}-${entry.pokemon.key}`}>
              <div className="set-index-meta">
                <span className="set-index-year">{entry.year}</span>
                <span>
                  <Flag code={entry.country} label={entry.countryName} /> {entry.champion}
                </span>
              </div>
              <PokemonCard year={entry.year} pokemon={entry.pokemon} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
