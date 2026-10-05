import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { ExternalLink, LogOut, Menu, X } from 'lucide-react';
import { Logo } from '../layout/Logo';
import { ThemeToggle } from '../layout/ThemeToggle';
import { useAuth } from '../../features/auth/useAuth';
import { adminNav, canAccess } from '../../features/admin/navigation';
import './AdminLayout.scss';

export function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // En pantallas chicas el drawer se cierra solo al navegar.
  useEffect(() => {
    setSidebarOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    function onClick(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [menuOpen]);

  const groups = adminNav
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => canAccess(user, item)),
    }))
    .filter((group) => group.items.length > 0);

  const initials = (user?.fullName ?? '?')
    .split(' ')
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');

  return (
    <div className={`admin${sidebarOpen ? ' admin--sidebar-open' : ''}`}>
      <aside className="admin__sidebar">
        <div className="admin__brand">
          <Logo />
          <button
            type="button"
            className="admin__sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Cerrar menú"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <nav className="admin__nav" aria-label="Navegación del panel">
          {groups.map((group) => (
            <div className="admin__group" key={group.label}>
              <p className="admin__group-label">{group.label}</p>
              <ul className="admin__list">
                {group.items.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.end}
                      className={({ isActive }) =>
                        `admin__link${isActive ? ' admin__link--active' : ''}`
                      }
                    >
                      <item.icon size={18} aria-hidden="true" />
                      <span>{item.label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="admin__sidebar-foot">
          <Link className="admin__site-link" to="/" target="_blank" rel="noreferrer">
            <ExternalLink size={16} aria-hidden="true" />
            Ver sitio público
          </Link>
        </div>
      </aside>

      {sidebarOpen && (
        <button
          type="button"
          className="admin__scrim"
          onClick={() => setSidebarOpen(false)}
          aria-label="Cerrar menú"
        />
      )}

      <div className="admin__body">
        <header className="admin__topbar">
          <button
            type="button"
            className="admin__menu"
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menú"
          >
            <Menu size={20} aria-hidden="true" />
          </button>

          <div className="admin__spacer" />

          <ThemeToggle />

          <div className="admin__user" ref={menuRef}>
            <button
              type="button"
              className="admin__user-trigger"
              onClick={() => setMenuOpen((value) => !value)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
            >
              <span className="admin__avatar" aria-hidden="true">
                {user?.avatarUrl ? <img src={user.avatarUrl} alt="" /> : initials}
              </span>
              <span className="admin__user-meta">
                <span className="admin__user-name">{user?.fullName}</span>
                <span className="admin__user-roles">{user?.roles.join(' · ')}</span>
              </span>
            </button>

            {menuOpen && (
              <div className="admin__dropdown" role="menu">
                <div className="admin__dropdown-head">
                  <strong>{user?.fullName}</strong>
                  <span>{user?.email}</span>
                </div>
                <button
                  type="button"
                  className="admin__dropdown-item"
                  role="menuitem"
                  onClick={() => void logout()}
                >
                  <LogOut size={16} aria-hidden="true" />
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="admin__main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
