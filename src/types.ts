export interface Move {
  en: string
  es: string
  typeKey: string
  type: string
  category: string
  power: number | null
  accuracy: number | null
  pp: number | null
  effect: string
}

export interface ItemInfo {
  en: string | null
  es: string | null
  sprite: string | null
  effect: string
}

export interface AbilityInfo {
  en: string | null
  es: string | null
  effect: string
}

export interface BaseStats {
  hp: number
  atk: number
  def: number
  spa: number
  spd: number
  spe: number
}

export interface TeamPokemon {
  key: string
  species: string
  displayName: string
  sprite: string
  types: string[]
  typeKeys: string[]
  baseStats: BaseStats
  item: ItemInfo
  ability: AbilityInfo
  nature: string | null
  natureEs: string | null
  evs: number[] | null
  ivs: number[] | null
  level: number | null
  teraType: string | null
  moves: Move[]
  confidence: string
  note: string | null
}

export interface Source {
  label: string
  url: string
}

export interface Champion {
  year: number
  cancelled?: boolean
  champion: string | null
  country: string | null
  countryName: string | null
  flag: string
  finalist: string | null
  finalistCountry: string | null
  finalistCountryName: string | null
  finalistFlag: string
  location: string
  date: string
  games: string
  regulation: string
  format: string
  summary: string
  sources: Source[]
  team: TeamPokemon[]
}

export interface PokeAlexTeam {
  key: string
  pokemon: TeamPokemon[]
}

export interface Milestone {
  year: string
  title: string
  text: string
  tier: string
}

export interface PokeAlexStat {
  label: string
  value: string
  detail: string
}

export interface PokeAlex {
  name: string
  alias: string
  country: string
  countryName: string
  flag: string
  born: string
  team: string
  since: string
  role: string
  bio: string
  links: Source[]
  stats: PokeAlexStat[]
  milestones: Milestone[]
  teams: PokeAlexTeam[]
}
