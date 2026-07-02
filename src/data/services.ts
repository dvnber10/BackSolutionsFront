export interface Service {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  technologies?: string[];
  icon?: string;
  image?: string;
}

export const services: Service[] = [
  {
    id: 'desarrollo-web',
    name: 'Desarrollo Web',
    shortDescription: 'Aplicaciones web modernas y escalables',
    fullDescription: 'Creamos soluciones web robustas y de alto rendimiento usando las mejores prácticas de la industria. Desde landing pages hasta plataformas SaaS complejas, adaptamos la tecnología a tus necesidades.',
    technologies: ['React', 'Angular', '.NET', 'Python'],
    image: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 300%22%3E%3Crect fill=%22%2344d7b6%22 width=%22400%22 height=%22300%22/%3E%3Crect fill=%22%23064e3b%22 x=%2250%22 y=%2250%22 width=%22300%22 height=%22200%22 rx=%2210%22/%3E%3Ccircle cx=%22200%22 cy=%22150%22 r=%2240%22 fill=%22%2344d7b6%22/%3E%3Crect fill=%22%2344d7b6%22 x=%2270%22 y=%2270%22 width=%2250%22 height=%2220%22 rx=%225%22/%3E%3Crect fill=%22%2344d7b6%22 x=%22280%22 y=%2270%22 width=%2250%22 height=%2220%22 rx=%225%22/%3E%3C/svg%3E',
  },
  {
    id: 'desarrollo-movil',
    name: 'Desarrollo Móvil',
    shortDescription: 'Apps nativas para iOS y Android',
    fullDescription: 'Aplicaciones móviles optimizadas y con excelente experiencia de usuario. Desarrollamos soluciones nativas que funcionan perfectamente en cualquier dispositivo y escenario.',
    technologies: ['Kotlin', 'React Native', 'Swift'],
    image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect fill="%232563eb" width="400" height="300"/><rect fill="%23ffffff" x="80" y="40" width="40" height="220" rx="5"/><rect fill="%232563eb" x="90" y="50" width="20" height="190"/><rect fill="%23ffffff" x="280" y="40" width="40" height="220" rx="5"/><rect fill="%232563eb" x="290" y="50" width="20" height="190"/><circle cx="200" cy="200" r="8" fill="%23ffffff"/></svg>',
  },
  {
    id: 'chatbots',
    name: 'Chatbots Inteligentes',
    shortDescription: 'Automatización de atención al cliente',
    fullDescription: 'Bots conversacionales alimentados por IA que mejoran la experiencia del usuario, reducen costos operativos y están disponibles 24/7 para tu negocio.',
    technologies: ['Python', '.NET', 'API Integration'],
    image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect fill="%2310b981" width="400" height="300"/><circle cx="100" cy="100" r="30" fill="%23ffffff" opacity="0.8"/><rect fill="%23ffffff" x="80" y="150" width="40" height="30" rx="5" opacity="0.8"/><circle cx="300" cy="150" r="30" fill="%23ffffff" opacity="0.8"/><rect fill="%23ffffff" x="280" y="220" width="40" height="30" rx="5" opacity="0.8"/><path stroke="%23ffffff" stroke-width="2" fill="none" d="M 130 130 L 270 180"/></svg>',
  },
  {
    id: 'diseno-paginas',
    name: 'Diseño de Páginas Web',
    shortDescription: 'Diseños premium y sitios atractivos',
    fullDescription: 'Diseñamos experiencias visuales impactantes que generan confianza, atraen usuarios y convierten visitantes en clientes. Cada píxel cuenta.',
    technologies: ['UI/UX', 'Figma', 'Responsive Design'],
    image: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 300%22%3E%3Crect fill=%22%23f59e0b%22 width=%22400%22 height=%22300%22/%3E%3Crect fill=%22%23ffffff%22 x=%2240%22 y=%2240%22 width=%22320%22 height=%22220%22 rx=%2210%22/%3E%3Crect fill=%22%23f59e0b%22 x=%2250%22 y=%2250%22 width=%22300%22 height=%2220%22/%3E%3Crect fill=%22%23e5e7eb%22 x=%2250%22 y=%2280%22 width=%22100%22 height=%2215%22/%3E%3Crect fill=%22%23e5e7eb%22 x=%2250%22 y=%22110%22 width=%22300%22 height=%2280%22/%3E%3Crect fill=%22%23f59e0b%22 x=%2250%22 y=%22210%22 width=%22150%22 height=%2240%22 rx=%225%22/%3E%3C/svg%3E',
  },
  {
    id: 'consultoria',
    name: 'Consultoría DevOps',
    shortDescription: 'Optimización de infraestructura y procesos',
    fullDescription: 'Asesoramos y optimizamos tu pipeline de desarrollo, infraestructura en la nube y procesos de despliegue para máxima eficiencia y confiabilidad.',
    technologies: ['.NET', 'Python', 'AWS', 'Docker'],
    image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect fill="%236366f1" width="400" height="300"/><rect fill="%23ffffff" x="50" y="70" width="80" height="80" rx="5"/><rect fill="%236366f1" x="65" y="85" width="20" height="20"/><rect fill="%23ffffff" x="160" y="70" width="80" height="80" rx="5"/><rect fill="%236366f1" x="175" y="85" width="20" height="20"/><rect fill="%23ffffff" x="270" y="70" width="80" height="80" rx="5"/><rect fill="%236366f1" x="285" y="85" width="20" height="20"/><line stroke="%23ffffff" stroke-width="2" x1="130" y1="110" x2="160" y2="110"/><line stroke="%23ffffff" stroke-width="2" x1="240" y1="110" x2="270" y2="110"/></svg>',
  },
  {
    id: 'otro',
    name: 'Otros Servicios',
    shortDescription: 'Proyectos personalizados',
    fullDescription: 'Si tienes una idea que no encaja en nuestras categorías, conversemos. Estamos listos para ayudarte con soluciones a medida.',
    technologies: [],
    image: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 300%22%3E%3Crect fill=%22%238b5cf6%22 width=%22400%22 height=%22300%22/%3E%3Ccircle cx=%22120%22 cy=%22120%22 r=%2240%22 fill=%22%23ffffff%22 opacity=%220.8%22/%3E%3Crect fill=%22%23ffffff%22 x=%22180%22 y=%2280%22 width=%22120%22 height=%2280%22 rx=%2210%22 opacity=%220.8%22/%3E%3Cpath stroke=%22%23ffffff%22 stroke-width=%223%22 fill=%22none%22 d=%22M 200 100 L 280 200%22/%3E%3C/svg%3E',
  },
];