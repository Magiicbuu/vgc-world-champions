import championsJson from './champions.json'
import pokealexJson from './pokealex.json'
import type { Champion, PokeAlex, TeamPokemon } from '../types'

export const champions = championsJson as Champion[]
export const pokealex = pokealexJson as PokeAlex

export const editions = champions.filter((champion) => !champion.cancelled)
export const latestEdition = editions[editions.length - 1]

export const totalPokemon = editions.reduce(
  (total, champion) => total + champion.team.length,
  0,
)

export const uniqueChampions = new Set(
  editions.map((champion) => champion.champion),
).size

export const countries = Array.from(
  new Set(
    editions
      .map((champion) => champion.countryName)
      .filter((country): country is string => Boolean(country)),
  ),
).sort((a, b) => a.localeCompare(b, 'es'))

export function getChampion(year: number): Champion | undefined {
  return champions.find((champion) => champion.year === year)
}

export function getPokemon(
  year: number,
  key: string,
): { champion: Champion; pokemon: TeamPokemon } | undefined {
  const champion = getChampion(year)
  const pokemon = champion?.team.find((member) => member.key === key)
  if (!champion || !pokemon) return undefined
  return { champion, pokemon }
}

export function getAdjacentEditions(year: number) {
  const index = editions.findIndex((champion) => champion.year === year)
  return {
    previous: index > 0 ? editions[index - 1] : undefined,
    next: index >= 0 && index < editions.length - 1 ? editions[index + 1] : undefined,
  }
}

export function findChampionByTeamMember(query: string): Champion[] {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return editions
  return editions.filter((champion) => {
    const haystack = [
      String(champion.year),
      champion.champion ?? '',
      champion.finalist ?? '',
      champion.countryName ?? '',
      champion.location,
      champion.regulation,
      ...champion.team.map((member) => member.displayName),
    ]
      .join(' ')
      .toLowerCase()
    return haystack.includes(normalized)
  })
}

export interface SetEntry {
  year: number
  champion: string
  country: string | null
  countryName: string | null
  flag: string
  pokemon: TeamPokemon
}

export const pokemonSets: SetEntry[] = editions.flatMap((champion) =>
  champion.team.map((pokemon) => ({
    year: champion.year,
    champion: champion.champion ?? '',
    country: champion.country,
    countryName: champion.countryName,
    flag: champion.flag,
    pokemon,
  })),
)

export interface SpeciesEntry {
  species: string
  displayName: string
  sprite: string
  count: number
  years: number[]
  sets: SetEntry[]
}

function isAlternateForm(name: string) {
  return (
    name.startsWith('Mega ') ||
    name.startsWith('Primigenio ') ||
    name.includes('(Forma') ||
    name.includes(' de Alola')
  )
}

const speciesMap = new Map<string, SpeciesEntry>()
for (const entry of pokemonSets) {
  const existing = speciesMap.get(entry.pokemon.species)
  if (existing) {
    existing.count += 1
    existing.years.push(entry.year)
    existing.sets.push(entry)
    if (isAlternateForm(existing.displayName) && !isAlternateForm(entry.pokemon.displayName)) {
      existing.displayName = entry.pokemon.displayName
      existing.sprite = entry.pokemon.sprite
    }
  } else {
    speciesMap.set(entry.pokemon.species, {
      species: entry.pokemon.species,
      displayName: entry.pokemon.displayName,
      sprite: entry.pokemon.sprite,
      count: 1,
      years: [entry.year],
      sets: [entry],
    })
  }
}

export const species = [...speciesMap.values()].sort(
  (a, b) => b.count - a.count || a.displayName.localeCompare(b.displayName, 'es'),
)

export const uniqueSpecies = species.length

export interface ChampionTitles {
  champion: string
  country: string | null
  countryName: string | null
  flag: string
  count: number
  years: number[]
}

const championTitlesMap = new Map<string, ChampionTitles>()
for (const edition of editions) {
  const name = edition.champion ?? 'Sin campeón'
  const existing = championTitlesMap.get(name)
  if (existing) {
    existing.count += 1
    existing.years.push(edition.year)
  } else {
    championTitlesMap.set(name, {
      champion: name,
      country: edition.country,
      countryName: edition.countryName,
      flag: edition.flag,
      count: 1,
      years: [edition.year],
    })
  }
}

export const championTitles = [...championTitlesMap.values()].sort(
  (a, b) => b.count - a.count || a.champion.localeCompare(b.champion, 'es'),
)

export interface CountryTitles {
  country: string | null
  countryName: string
  count: number
  years: number[]
  champions: string[]
}

const countryTitlesMap = new Map<string, CountryTitles>()
for (const edition of editions) {
  const countryName = edition.countryName ?? 'Sin país'
  const existing = countryTitlesMap.get(countryName)
  if (existing) {
    existing.count += 1
    existing.years.push(edition.year)
    if (edition.champion) existing.champions.push(edition.champion)
  } else {
    countryTitlesMap.set(countryName, {
      country: edition.country,
      countryName,
      count: 1,
      years: [edition.year],
      champions: edition.champion ? [edition.champion] : [],
    })
  }
}

export const countryTitles = [...countryTitlesMap.values()].sort(
  (a, b) => b.count - a.count || a.countryName.localeCompare(b.countryName, 'es'),
)

export interface TypeCount {
  typeKey: string
  type: string
  count: number
}

const typeMap = new Map<string, TypeCount>()
let typeSlots = 0
for (const entry of pokemonSets) {
  entry.pokemon.typeKeys.forEach((typeKey, index) => {
    const type = entry.pokemon.types[index] ?? typeKey
    typeSlots += 1
    const existing = typeMap.get(typeKey)
    if (existing) {
      existing.count += 1
    } else {
      typeMap.set(typeKey, { typeKey, type, count: 1 })
    }
  })
}

export const typeCounts = [...typeMap.values()].sort(
  (a, b) => b.count - a.count || a.type.localeCompare(b.type, 'es'),
)

export const totalTypeSlots = typeSlots

export const setTypeOptions = [...typeMap.values()].sort((a, b) =>
  a.type.localeCompare(b.type, 'es'),
)

export const setYearOptions = editions.map((edition) => edition.year)
