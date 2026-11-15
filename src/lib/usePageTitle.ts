import { useEffect } from 'react'

const DEFAULT_TITLE = 'VGC World Champions · Historia del Mundial de Pokémon'

export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} · VGC World Champions` : DEFAULT_TITLE
  }, [title])
}
