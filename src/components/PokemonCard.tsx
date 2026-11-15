import { Link } from 'react-router-dom'
import type { TeamPokemon } from '../types'
import { TypeBadge } from './TypeBadge'

interface PokemonCardProps {
  year: number
  pokemon: TeamPokemon
}

export function PokemonCard({ year, pokemon }: PokemonCardProps) {
  return (
    <Link
      to={`/campeones/${year}/${pokemon.key}`}
      className="pokemon-card"
      aria-label={`Ver el set de ${pokemon.displayName}`}
    >
      <span className={`confidence-dot confidence-dot-${pokemon.confidence}`} aria-hidden />
      <span className="pokemon-card-art">
        <img src={pokemon.sprite} alt="" loading="lazy" />
      </span>
      <span className="pokemon-card-info">
        <span className="pokemon-card-name">{pokemon.displayName}</span>
        <span className="type-row">
          {pokemon.types.map((type, index) => (
            <TypeBadge key={type} typeKey={pokemon.typeKeys[index] ?? type.toLowerCase()} label={type} />
          ))}
        </span>
        {pokemon.item.es ? (
          <span className="pokemon-card-item">
            {pokemon.item.sprite ? <img src={pokemon.item.sprite} alt="" loading="lazy" /> : null}
            {pokemon.item.es}
          </span>
        ) : (
          <span className="pokemon-card-item muted">Set sin objetos publicados</span>
        )}
      </span>
      <span className="pokemon-card-cta" aria-hidden>
        Ver set →
      </span>
    </Link>
  )
}
