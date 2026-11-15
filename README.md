# VGC World Champions

Archivo divulgativo de los Campeones Mundiales de Pokémon VGC (2008–2026) y de la carrera competitiva de **PokeAlex** (Alex Gómez Berna). Cada edición incluye el equipo campeón, los sets de sus Pokémon, estadísticas base y las fuentes utilizadas.

## Stack

- **Vite + React + TypeScript**
- **React Router** para las rutas del sitio
- Datos estáticos en JSON, enriquecidos con **PokéAPI**
- Sin backend: se puede desplegar como sitio estático

## Comandos

```bash
npm install
npm run dev       # servidor de desarrollo
npm run build     # build de producción en dist/
npm run preview   # previsualizar el build
npm run lint      # Oxlint
```

## Datos

Los datos de los campeones se generan con:

```bash
python scripts/build_data.py
```

El script combina:

- Equipos extraídos de **Limitless VGC** (`scripts/scrape_limitless.py` y `champions-limitless.json`).
- Sets históricos documentados manualmente para 2008, 2009, 2010, 2011, 2013 y 2022.
- Enriquecimiento con **PokéAPI**: nombres en español, tipos, estadísticas base, movimientos, objetos, habilidades y naturalezas.
- Metadatos de cada edición: campeón, subcampeón, país, sede, fecha, juegos, reglamento y fuentes.

Salida:

- `src/data/champions.json`
- `src/data/pokealex.json`

La caché de PokéAPI se guarda en `scripts/.cache/` (ignorada por Git).

## Estructura

```
src/
  components/   Componentes compartidos (layout, tarjetas, badges, stats)
  data/         JSON generados y helpers de acceso a datos
  lib/          Utilidades (tipos, títulos de página)
  pages/        Inicio, campeones, detalle de campeón, detalle de Pokémon,
                Pokédex de sets, estadísticas, PokeAlex, glosario y 404
scripts/        Scraper de Limitless y pipeline de datos
```

## Despliegue

El proyecto incluye configuración para:

- **Vercel** (`vercel.json`): rewrites de SPA a `index.html`.
- **Netlify** (`netlify.toml`): build y redirect de SPA.

Comando de build: `npm run build`. Directorio de publicación: `dist`.

## Aviso

Pokémon y todos los nombres relacionados son marcas de Nintendo, Creatures Inc. y GAME FREAK inc. Este sitio no está afiliado a The Pokémon Company.
