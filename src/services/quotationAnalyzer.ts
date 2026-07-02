/**
 * Analizador de cotizaciones - Extrae funcionalidades e identifica requisitos del proyecto
 */

export interface DetectedFeature {
  name: string;
  category: string;
  confidence: number;
  basePrice: number;
}

export interface QuotationAnalysis {
  features: DetectedFeature[];
  estimatedCost: number;
  breakdown: {
    category: string;
    items: string[];
    subtotal: number;
  }[];
  analysis: string;
  complexity: 'bajo' | 'medio' | 'alto';
}

// Base de datos de características y palabras clave asociadas
const featureKeywords: Record<string, { keywords: string[]; price: number; category: string }> = {
  'autenticacion-usuarios': {
    keywords: ['autenticación', 'login', 'registro', 'usuario', 'cuenta', 'sesión', 'contraseña', 'sign up', 'auth'],
    price: 1500,
    category: 'Seguridad & Autenticación',
  },
  'base-datos': {
    keywords: ['base de datos', 'bd', 'database', 'almacenamiento', 'datos', 'sql', 'mongodb', 'firebase', 'persistencia'],
    price: 2000,
    category: 'Backend & Infraestructura',
  },
  'api-integracion': {
    keywords: ['api', 'integración', 'servicios externos', 'webhook', 'rest', 'graphql', 'conexión externa'],
    price: 2500,
    category: 'Integraciones',
  },
  'pago-online': {
    keywords: ['pago', 'pasarela de pago', 'stripe', 'paypal', 'mercado pago', 'transacción', 'carrito', 'e-commerce'],
    price: 3000,
    category: 'Pagos & E-commerce',
  },
  'notificaciones': {
    keywords: ['notificación', 'email', 'sms', 'alertas', 'push notification', 'correo electrónico'],
    price: 1200,
    category: 'Comunicaciones',
  },
  'panel-admin': {
    keywords: ['panel de control', 'dashboard', 'admin', 'administración', 'panel administrativo', 'analytics'],
    price: 2800,
    category: 'Administración',
  },
  'reportes': {
    keywords: ['reporte', 'informe', 'estadísticas', 'gráficos', 'análisis', 'exportar'],
    price: 1800,
    category: 'Reportes & Analytics',
  },
  'busqueda-avanzada': {
    keywords: ['búsqueda', 'filtros', 'buscar', 'search', 'filtrado', 'consulta'],
    price: 1500,
    category: 'Funcionalidades de Búsqueda',
  },
  'multiidioma': {
    keywords: ['multiidioma', 'internacionalización', 'traducción', 'i18n', 'idiomas múltiples'],
    price: 1600,
    category: 'Localización',
  },
  'optimizacion-seo': {
    keywords: ['seo', 'optimización', 'posicionamiento', 'meta tags', 'estructura de datos'],
    price: 1000,
    category: 'SEO & Performance',
  },
  'responsive-design': {
    keywords: ['responsive', 'mobile', 'dispositivos', 'adaptable', 'responsive design'],
    price: 1200,
    category: 'Diseño & UX',
  },
  'animaciones': {
    keywords: ['animación', 'efectos', 'transición', 'micro-interacciones'],
    price: 800,
    category: 'Diseño & UX',
  },
};

/**
 * Analiza el texto de la cotización y detecta funcionalidades
 */
export const analyzeQuotation = (text: string, serviceType: string): QuotationAnalysis => {
  const lowerText = text.toLowerCase();
  const detectedFeatures: DetectedFeature[] = [];
  const foundCategories: Record<string, DetectedFeature[]> = {};

  // Escanear cada característica
  Object.entries(featureKeywords).forEach(([featureId, feature]) => {
    feature.keywords.forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      if (regex.test(lowerText)) {
        const detectedFeature: DetectedFeature = {
          name: featureId.replace(/-/g, ' ').toUpperCase(),
          category: feature.category,
          confidence: 0.8,
          basePrice: feature.price,
        };

        // Verificar si ya existe esta categoría
        if (!foundCategories[feature.category]) {
          foundCategories[feature.category] = [];
        }

        // Evitar duplicados
        if (!foundCategories[feature.category].find((f) => f.name === detectedFeature.name)) {
          detectedFeatures.push(detectedFeature);
          foundCategories[feature.category].push(detectedFeature);
        }
      }
    });
  });

  // Calcular costos base por servicio
  const serviceBasePrices: Record<string, number> = {
    'desarrollo-web': 5000,
    'desarrollo-movil': 6000,
    'chatbots': 4000,
    'diseno-paginas': 2500,
    'consultoria': 3000,
    'otro': 3500,
  };

  const baseServicePrice = serviceBasePrices[serviceType] || 3500;
  const additionalFeaturesPrice = detectedFeatures.reduce((sum, feature) => sum + feature.basePrice, 0);
  const estimatedCost = baseServicePrice + additionalFeaturesPrice;

  // Crear desglose por categoría
  const breakdown = Object.entries(foundCategories).map(([category, features]) => ({
    category,
    items: features.map((f) => f.name),
    subtotal: features.reduce((sum, f) => sum + f.basePrice, 0),
  }));

  // Determinar complejidad
  let complexity: 'bajo' | 'medio' | 'alto' = 'bajo';
  if (detectedFeatures.length > 5) complexity = 'alto';
  else if (detectedFeatures.length > 2) complexity = 'medio';

  // Generar análisis textual
  const analysis = generateAnalysisText(detectedFeatures, complexity, serviceType);

  return {
    features: detectedFeatures,
    estimatedCost,
    breakdown,
    analysis,
    complexity,
  };
};

/**
 * Genera un texto de análisis profesional
 */
function generateAnalysisText(features: DetectedFeature[], complexity: string, serviceType: string): string {
  let text = `Se ha identificado un proyecto de ${serviceType} con complejidad ${complexity}.`;

  if (features.length === 0) {
    text += ' No se detectaron funcionalidades específicas en la descripción. Se recomienda una consultoría inicial.';
  } else {
    text += ` Se detectaron ${features.length} funcionalidades principales:`;
    const categories = [...new Set(features.map((f) => f.category))];
    text += ' ' + categories.join(', ') + '.';
  }

  if (complexity === 'alto') {
    text += ' La complejidad del proyecto requiere un análisis más profundo y múltiples iteraciones de desarrollo.';
  }

  return text;
}

/**
 * Calcula el costo total con márgenes comerciales
 */
export const calculateFinalPrice = (estimatedCost: number, margin: number = 1.2): number => {
  return Math.round(estimatedCost * margin);
};
