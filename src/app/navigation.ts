/**
 * Enlaces de la navegación pública. Una sola fuente para el header de escritorio,
 * el menú móvil y el footer, así no se desincronizan.
 */
export type NavItem = {
  label: string;
  to: string;
};

export const publicNav: NavItem[] = [
  { label: 'Inicio', to: '/' },
  { label: 'Servicios', to: '/services' },
  { label: 'Portafolio', to: '/portfolio' },
  { label: 'Nosotros', to: '/about' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contacto', to: '/contact' },
];
