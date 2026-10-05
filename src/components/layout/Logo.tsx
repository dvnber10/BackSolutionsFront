import { Link } from 'react-router-dom';
import './Logo.scss';

type LogoProps = {
  to?: string;
  compact?: boolean;
};

/**
 * Marca del sitio: monograma + nombre.
 *
 * El monograma se dibuja con CSS y no con un PNG para que responda al tema (en claro
 * es tinta oscura sobre acento; en oscuro al revés) y no pierda nitidez en pantallas
 * retina. Los PNG de la marca quedaron sin uso.
 */
export function Logo({ to = '/', compact = false }: LogoProps) {
  return (
    <Link className="logo" to={to} aria-label="BackSolutions, ir al inicio">
      <span className="logo__mark" aria-hidden="true">
        B
      </span>
      {!compact && <span className="logo__word">BackSolutions</span>}
    </Link>
  );
}
