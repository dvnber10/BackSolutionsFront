import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  Inbox,
  FileText,
  MessagesSquare,
  Layers,
  Briefcase,
  Newspaper,
  UserCog,
  Settings,
} from 'lucide-react';
import type { UserProfile } from '../auth/types';

/**
 * Navegación del panel. Cada entrada declara qué roles pueden verla, espejando las
 * políticas reales del backend (`OwnerOrAdmin` = Owner + Admin; el resto es TeamMember).
 * Ocultar la entrada no es seguridad —el backend igual responde 403— pero evita ofrecer
 * pantallas que el usuario no puede usar.
 */
export type AdminNavItem = {
  label: string;
  to: string;
  icon: LucideIcon;
  end?: boolean;
  roles?: string[];
};

export type AdminNavGroup = {
  label: string;
  items: AdminNavItem[];
};

const ADMIN_ROLES = ['Owner', 'Admin'];

export const adminNav: AdminNavGroup[] = [
  {
    label: 'General',
    items: [{ label: 'Dashboard', to: '/admin', icon: LayoutDashboard, end: true }],
  },
  {
    label: 'Comercial',
    items: [
      { label: 'Leads', to: '/admin/leads', icon: Inbox, roles: ADMIN_ROLES },
      { label: 'Propuestas', to: '/admin/proposals', icon: FileText, roles: ADMIN_ROLES },
      { label: 'Conversaciones', to: '/admin/conversations', icon: MessagesSquare },
    ],
  },
  {
    label: 'Contenido',
    items: [
      { label: 'Páginas', to: '/admin/pages', icon: Layers, roles: ADMIN_ROLES },
      { label: 'Servicios', to: '/admin/services', icon: Briefcase, roles: ADMIN_ROLES },
      { label: 'Portafolio', to: '/admin/portfolio', icon: Layers, roles: ADMIN_ROLES },
      { label: 'Blog', to: '/admin/blog', icon: Newspaper, roles: ADMIN_ROLES },
    ],
  },
  {
    label: 'Sistema',
    items: [
      { label: 'Usuarios', to: '/admin/users', icon: UserCog, roles: ADMIN_ROLES },
      { label: 'Configuración', to: '/admin/settings', icon: Settings, roles: ADMIN_ROLES },
    ],
  },
];

export function canAccess(user: UserProfile | null, item: AdminNavItem): boolean {
  if (!item.roles || item.roles.length === 0) {
    return true;
  }

  return Boolean(user && item.roles.some((role) => user.roles.includes(role)));
}

export function isAdmin(user: UserProfile | null): boolean {
  return Boolean(user && ADMIN_ROLES.some((role) => user.roles.includes(role)));
}

export function isOwner(user: UserProfile | null): boolean {
  return Boolean(user && user.roles.includes('Owner'));
}
