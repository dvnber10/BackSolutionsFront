/**
 * DOCUMENTACIÓN DEL SISTEMA DE ANÁLISIS Y GENERACIÓN DE COTIZACIONES
 * ===================================================================
 * 
 * Este archivo documenta cómo funciona el sistema de cotizaciones integrado
 * en el frontend de BackSolutions.
 * 
 * FLUJO GENERAL:
 * 1. Usuario completa el formulario de contacto/cotización
 * 2. Frontend analiza automáticamente el texto (detección de funcionalidades)
 * 3. Frontend genera un presupuesto profesional en HTML
 * 4. Backend recibe datos enriquecidos con análisis y genera PDF
 * 5. Backend envía cotización al cliente Y a la empresa por email
 * 
 */

/**
 * ESTRUCTURA DE DATOS ENVIADA AL BACKEND
 * ======================================
 * 
 * Ejemplo de payload POST a /api/cotizacion:
 */

const examplePayload = {
  // Datos del cliente (originales del formulario)
  nombre: "Juan Pérez",
  email: "juan@empresa.com",
  telefono: "+57 300 123 4567",
  servicio: "desarrollo-web",
  detalles: "Necesito un sitio web con búsqueda avanzada, autenticación de usuarios, base de datos y panel de administración...",
  
  // Análisis realizado por el frontend
  analysis: {
    features: [
      "BUSQUEDA-AVANZADA",
      "AUTENTICACION-USUARIOS", 
      "BASE-DATOS",
      "PANEL-ADMIN"
    ],
    estimatedCost: 11300, // Costo base + funcionalidades
    finalPrice: 13560,     // Con margen comercial (1.2x)
    complexity: "alto",    // bajo | medio | alto
    breakdown: [
      {
        category: "Seguridad & Autenticación",
        items: ["AUTENTICACION-USUARIOS"],
        subtotal: 1500
      },
      {
        category: "Backend & Infraestructura",
        items: ["BASE-DATOS"],
        subtotal: 2000
      },
      {
        category: "Funcionalidades de Búsqueda",
        items: ["BUSQUEDA-AVANZADA"],
        subtotal: 1500
      },
      {
        category: "Administración",
        items: ["PANEL-ADMIN"],
        subtotal: 2800
      }
    ]
  },
  
  // Documento profesional generado
  document: {
    html: "<!-- HTML completo del documento de cotización -->",
    plainText: "<!-- Texto plano del documento -->",
    filename: "Cotizacion_QT-1234567890_Juan_Perez.html"
  }
};

/**
 * IMPLEMENTACIÓN DEL ENDPOINT EN EL BACKEND
 * =========================================
 * 
 * Pseudocódigo para Express.js:
 */

/*
const express = require('express');
const app = express();
const nodemailer = require('nodemailer');
const { htmlToPdf } = require('html-pdf'); // O usar puppeteer/pdfkit

const emailConfig = {
  from: 'cotizaciones@backsolutions.com',
  companyEmail: 'info@backsolutions.com',
  smtpServer: process.env.SMTP_SERVER,
  smtpPort: process.env.SMTP_PORT,
  smtpUser: process.env.SMTP_USER,
  smtpPass: process.env.SMTP_PASS
};

app.post('/api/cotizacion', async (req, res) => {
  try {
    const {
      nombre,
      email,
      telefono,
      servicio,
      detalles,
      analysis,
      document
    } = req.body;

    // 1. Generar PDF desde HTML
    const pdfBuffer = await htmlToPdf(document.html);
    
    // 2. Guardar en base de datos para registro
    await saveCotizationToDB({
      clientName: nombre,
      clientEmail: email,
      clientPhone: telefono,
      service: servicio,
      details: detalles,
      analysis: analysis,
      pdfPath: '/quotations/' + document.filename,
      createdAt: new Date()
    });
    
    // 3. Configurar transporte de email
    const transporter = nodemailer.createTransport({
      host: emailConfig.smtpServer,
      port: emailConfig.smtpPort,
      auth: {
        user: emailConfig.smtpUser,
        pass: emailConfig.smtpPass
      }
    });
    
    // 4. Enviar al cliente (texto + PDF adjunto)
    await transporter.sendMail({
      from: emailConfig.from,
      to: email,
      subject: `Cotización Profesional - BackSolutions [${document.filename.split('_')[1]}]`,
      html: document.plainText.replace(/\n/g, '<br>'),
      attachments: [{
        filename: document.filename.replace('.html', '.pdf'),
        content: pdfBuffer
      }]
    });
    
    // 5. Enviar a la empresa (HTML completo + PDF + datos del análisis)
    await transporter.sendMail({
      from: emailConfig.from,
      to: emailConfig.companyEmail,
      subject: `NUEVA COTIZACIÓN: ${nombre} - ${servicio} [$${analysis.finalPrice}]`,
      html: `
        <h2>Nueva Solicitud de Cotización Recibida</h2>
        <h3>Datos del Cliente</h3>
        <ul>
          <li><strong>Nombre:</strong> ${nombre}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Teléfono:</strong> ${telefono || 'No proporcionado'}</li>
          <li><strong>Servicio:</strong> ${servicio}</li>
        </ul>
        
        <h3>Análisis Automático</h3>
        <ul>
          <li><strong>Complejidad:</strong> ${analysis.complexity}</li>
          <li><strong>Presupuesto Estimado:</strong> $${analysis.finalPrice.toLocaleString('es-CO')}</li>
          <li><strong>Funcionalidades Detectadas:</strong> ${analysis.features.length}</li>
        </ul>
        
        <h3>Desglose por Categoría</h3>
        ${analysis.breakdown.map(cat => `
          <div>
            <strong>${cat.category}</strong>: $${cat.subtotal.toLocaleString('es-CO')}
            <br><small>${cat.items.join(', ')}</small>
          </div>
        `).join('')}
        
        <h3>Descripción del Proyecto</h3>
        <p>${detalles.replace(/\n/g, '<br>')}</p>
        
        <hr>
        <p>El documento de cotización profesional está adjunto en este email.</p>
      `,
      attachments: [{
        filename: document.filename.replace('.html', '.pdf'),
        content: pdfBuffer
      }]
    });
    
    // 6. Responder al cliente
    res.json({
      success: true,
      message: 'Cotización enviada exitosamente',
      quotationId: document.filename.split('_')[1],
      clientEmail: email,
      companyEmail: emailConfig.companyEmail
    });
    
  } catch (error) {
    console.error('Error processing quotation:', error);
    res.status(500).json({
      success: false,
      message: 'Error al procesar la cotización',
      error: error.message
    });
  }
});
*/

/**
 * CARACTERÍSTICAS DEL SISTEMA
 * ==========================
 * 
 * 1. ANÁLISIS AUTOMÁTICO DE FUNCIONALIDADES:
 *    - Detecta palabras clave en el texto del cliente
 *    - Mapea a funcionalidades predefinidas
 *    - Calcula costo base + adicionales
 *    - Determina nivel de complejidad
 * 
 * 2. GENERACIÓN DE COTIZACIÓN PROFESIONAL:
 *    - HTML responsivo y profesional
 *    - Diseño moderno con marca de BackSolutions
 *    - Información clara del cliente
 *    - Desglose detallado de costos
 *    - Validez de 30 días
 *    - Notas y próximos pasos
 * 
 * 3. ENVÍOS DE EMAIL:
 *    - Al cliente: Cotización en PDF + texto plano
 *    - A la empresa: Análisis completo + PDF + datos para seguimiento
 * 
 * 4. BASE DE DATOS RECOMENDADA:
 *    Tabla: Quotations
 *    - id (UUID)
 *    - clientName (string)
 *    - clientEmail (string)
 *    - clientPhone (string)
 *    - service (string)
 *    - projectDetails (text)
 *    - analysisData (JSON)
 *    - estimatedCost (decimal)
 *    - finalPrice (decimal)
 *    - complexity (enum: bajo/medio/alto)
 *    - status (enum: draft/sent/accepted/rejected)
 *    - pdfPath (string)
 *    - createdAt (timestamp)
 *    - sentAt (timestamp)
 *    - expiresAt (timestamp)
 */

/**
 * PALABRAS CLAVE DETECTADAS (por categoría)
 * ========================================
 */

const detectedKeywords = {
  "Seguridad & Autenticación": [
    "autenticación", "login", "registro", "usuario", "cuenta", "sesión",
    "contraseña", "sign up", "auth"
  ],
  "Backend & Infraestructura": [
    "base de datos", "bd", "database", "almacenamiento", "datos", "sql",
    "mongodb", "firebase", "persistencia"
  ],
  "Integraciones": [
    "api", "integración", "servicios externos", "webhook", "rest",
    "graphql", "conexión externa"
  ],
  "Pagos & E-commerce": [
    "pago", "pasarela de pago", "stripe", "paypal", "mercado pago",
    "transacción", "carrito", "e-commerce"
  ],
  "Comunicaciones": [
    "notificación", "email", "sms", "alertas", "push notification",
    "correo electrónico"
  ],
  "Administración": [
    "panel de control", "dashboard", "admin", "administración",
    "panel administrativo", "analytics"
  ],
  "Reportes & Analytics": [
    "reporte", "informe", "estadísticas", "gráficos", "análisis",
    "exportar"
  ],
  "Funcionalidades de Búsqueda": [
    "búsqueda", "filtros", "buscar", "search", "filtrado", "consulta"
  ],
  "Localización": [
    "multiidioma", "internacionalización", "traducción", "i18n",
    "idiomas múltiples"
  ],
  "SEO & Performance": [
    "seo", "optimización", "posicionamiento", "meta tags",
    "estructura de datos"
  ],
  "Diseño & UX": [
    "responsive", "mobile", "dispositivos", "adaptable",
    "animación", "efectos", "transición", "micro-interacciones"
  ]
};

/**
 * COSTOS BASE POR SERVICIO
 * ======================
 */

const serviceBaseCosts = {
  'desarrollo-web': 5000,        // USD o tu moneda local
  'desarrollo-movil': 6000,
  'chatbots': 4000,
  'diseno-paginas': 2500,
  'consultoria': 3000,
  'otro': 3500
};

/**
 * COSTOS POR FUNCIONALIDAD
 * =======================
 * (Se suman al costo base)
 */

const featureCosts = {
  'autenticacion-usuarios': 1500,
  'base-datos': 2000,
  'api-integracion': 2500,
  'pago-online': 3000,
  'notificaciones': 1200,
  'panel-admin': 2800,
  'reportes': 1800,
  'busqueda-avanzada': 1500,
  'multiidioma': 1600,
  'optimizacion-seo': 1000,
  'responsive-design': 1200,
  'animaciones': 800
};

export { examplePayload, detectedKeywords, serviceBaseCosts, featureCosts };
