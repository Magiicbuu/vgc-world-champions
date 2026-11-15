import { Link } from 'react-router-dom'
import { usePageTitle } from '../lib/usePageTitle'

export function NotFound() {
  usePageTitle('Página no encontrada')

  return (
    <div className="container page">
      <div className="empty-state">
        <p className="eyebrow">Error 404</p>
        <h1>Esta página no existe</h1>
        <p>Puede que el enlace esté mal escrito o que la edición ya no esté disponible.</p>
        <div className="hero-actions">
          <Link className="button button-primary" to="/">
            Volver al inicio
          </Link>
          <Link className="button button-ghost" to="/campeones">
            Ver campeones
          </Link>
        </div>
      </div>
    </div>
  )
}
