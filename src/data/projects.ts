export interface Project {
  id: string;
  name: string;
  description: string;
  category: string;
  image?: string;
  technologies: string[];
  status: 'completed' | 'in-progress' | 'planned';
}

export const projects: Project[] = [
  {
    id: 'datafono-pagos',
    name: 'Sistema de Pagos - Datáfono',
    description: 'Aplicación para procesar pagos con pasarela integrada. Acepta pagos con tarjeta y efectivo con etiquetado automático.',
    category: 'E-commerce / Fintech',
    technologies: ['React', '.NET', 'API Stripe'],
    status: 'completed',
    image: '/imagen telefono.jpeg',
  },
  {
    id: 'restaurante-pedidos',
    name: 'Gestión de Restaurante',
    description: 'Sistema integral para restaurantes con registro de pedidos, gestión de pagos por mesa y control de inventario.',
    category: 'Restauración',
    technologies: ['React', 'Python', 'PostgreSQL'],
    status: 'completed',
    image: '/Screenshot_2026-07-01-210222.png',
  },
  {
    id: 'reserva-apartamentos',
    name: 'Sistema de Reservas - Apartamentos',
    description: 'Plataforma para gestionar reservas de apartamentos con precios dinámicos según temporada alta y baja.',
    category: 'Hospitalidad',
    technologies: ['React', 'Angular', '.NET'],
    status: 'in-progress',
  },
  {
    id: 'seguimiento-reparacion',
    name: 'Seguimiento de Equipos - Centro de Reparación',
    description: 'Sistema de registro y seguimiento de equipos electrónicos. Los usuarios reciben actualizaciones en tiempo real del estado de sus equipos.',
    category: 'Logística / Servicios',
    technologies: ['React', 'Python', 'WebSocket'],
    status: 'in-progress',
  },
];
