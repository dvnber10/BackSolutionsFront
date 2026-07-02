
// RUTA: src/types/types.ts

/**
 * Define la estructura de los datos para el formulario de cotización.
 * Esto asegura que tanto el hook como el servicio compartan la misma "forma" de datos.
 */
export interface CotizacionFormData {
  nombre: string;
  email: string;
  telefono?: string; // El teléfono es opcional
  servicio: 'desarrollo-web' | 'desarrollo-movil' | 'consultoria' | 'otro';
  detalles: string;
}

export interface BlogPost {
  id: number;
  title: string;
  author: string;
  date: string;
  tags: string[];
  summary: string;
  imageUrl: string;
}
