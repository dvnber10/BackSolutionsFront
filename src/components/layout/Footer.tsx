import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import { publicNav } from '../../app/navigation';
import { Logo } from './Logo';
import './Footer.scss';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer__grid">
        <div className="site-footer__brand">
          <Logo />
          <p className="site-footer__tagline">
            Diseñamos y desarrollamos software a medida: sitios, plataformas y productos
            digitales que sostienen el crecimiento del negocio.
          </p>
        </div>

        <nav className="site-footer__column" aria-label="Enlaces del sitio">
          <h2 className="site-footer__heading">Sitio</h2>
          <ul className="site-footer__list">
            {publicNav.map((item) => (
              <li key={item.to}>
                <Link className="site-footer__link" to={item.to}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-footer__column">
          <h2 className="site-footer__heading">Contacto</h2>
          <ul className="site-footer__list site-footer__list--contact">
            <li>
              <Mail aria-hidden="true" />
              <a className="site-footer__link" href="mailto:backsolutionsco@gmail.com">
                backsolutionsco@gmail.com
              </a>
            </li>
            <li>
              <Phone aria-hidden="true" />
              <a className="site-footer__link" href="tel:+570000000000">
                +57 302 395 6923
              </a>
            </li>
            <li>
              <MapPin aria-hidden="true" />
              <span>Remoto · Colombia</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="site-footer__bottom">
        <p>&copy; {year} BackSolutions. Todos los derechos reservados.</p>
        <Link className="site-footer__link" to="/contact">
          Trabajemos juntos
        </Link>
      </div>
    </footer>
  );
}
