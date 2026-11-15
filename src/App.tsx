import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { Champions } from './pages/Champions'
import { ChampionDetail } from './pages/ChampionDetail'
import { PokemonDetail } from './pages/PokemonDetail'
import { PokemonIndex } from './pages/PokemonIndex'
import { PokeAlex } from './pages/PokeAlex'
import { Stats } from './pages/Stats'
import { Glossary } from './pages/Glossary'
import { NotFound } from './pages/NotFound'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="campeones" element={<Champions />} />
        <Route path="campeones/:year" element={<ChampionDetail />} />
        <Route path="campeones/:year/:pokemonKey" element={<PokemonDetail />} />
        <Route path="pokemon" element={<PokemonIndex />} />
        <Route path="estadisticas" element={<Stats />} />
        <Route path="pokealex" element={<PokeAlex />} />
        <Route path="glosario" element={<Glossary />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
