import { Button } from '../components/ui/Button';
import { SEO } from '../components/SEO';
import './NotFound.scss';

export function NotFound() {
  return (
    <>
      <SEO
        title="Página no encontrada"
        description="La página que buscás no existe."
        path="/404"
      />
      <div className="not-found">
        <span className="not-found__code">404</span>
        <h1 className="not-found__title">No encontramos esta página</h1>
        <p className="not-found__text">
          Puede que el enlace esté roto o que la página se haya movido. Probá desde el inicio.
        </p>
        <div className="not-found__actions">
          <Button to="/" variant="primary">
            Ir al inicio
          </Button>
          <Button to="/contact" variant="secondary">
            Contacto
          </Button>
        </div>
      </div>
    </>
  );
}
