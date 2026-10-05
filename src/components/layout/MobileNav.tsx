import { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { X } from 'lucide-react';
import { publicNav } from '../../app/navigation';
import { ThemeToggle } from './ThemeToggle';
import './MobileNav.scss';

type MobileNavProps = {
  open: boolean;
  onClose: () => void;
};

/**
 * Cajón de navegación para móvil.
 *
 * Se cierra con Escape, con el botón, o tocando el fondo. Mientras está abierto se
 * bloquea el scroll del body y el foco entra al panel, para que no se pueda tabular
 * hacia el contenido de atrás.
 */
export function MobileNav({ open, onClose }: MobileNavProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="mobile-nav">
      <div className="mobile-nav__scrim" onClick={onClose} aria-hidden="true" />

      <div
        id="menu-movil"
        className="mobile-nav__panel"
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
        ref={panelRef}
      >
        <div className="mobile-nav__head">
          <span className="mobile-nav__title">Menú</span>
          <div className="mobile-nav__head-actions">
            <ThemeToggle />
            <button
              type="button"
              className="mobile-nav__close"
              aria-label="Cerrar menú"
              onClick={onClose}
              ref={closeButtonRef}
            >
              <X aria-hidden="true" />
            </button>
          </div>
        </div>

        <nav aria-label="Navegación principal móvil">
          <ul className="mobile-nav__links">
            {publicNav.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    isActive ? 'mobile-nav__link is-active' : 'mobile-nav__link'
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
