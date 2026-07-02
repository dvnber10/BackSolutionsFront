/**
 * IMPLEMENTACIÓN DE BACKEND - EJEMPLO COMPLETO
 * ============================================
 * 
 * Este archivo contiene un ejemplo completo de cómo implementar
 * el endpoint /api/cotizacion en tu backend con Express.js
 * 
 * INSTALACIÓN REQUERIDA:
 * npm install express nodemailer html-pdf dotenv cors body-parser uuid
 * 
 * PARA PDF DE MEJOR CALIDAD (alternativa):
 * npm install puppeteer  // Más pesado pero mejor calidad
 * 
 * ARCHIVO: backend/routes/quotations.js (ejemplo)
 */

/*
// ========== CONFIGURACIÓN INICIAL ==========

const express = require('express');
const nodemailer = require('nodemailer');
const htmlPdf = require('html-pdf');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs').promises;
require('dotenv').config();

const router = express.Router();

// ========== CONFIGURACIÓN DE EMAIL ==========

const emailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_SERVER || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Verificar conexión de email
emailTransporter.verify((error, success) => {
  if (error) {
    console.error('Email configuration error:', error);
  } else {
    console.log('✓ Email service ready:', success);
  }
});

// ========== CONFIGURACIÓN DE PDF ==========

const pdfOptions = {
  format: 'A4',
  orientation: 'portrait',
  border: '10mm',
  header: {
    height: '10mm'
  },
  footer: {
    height: '10mm',
    contents: {
      default: '<span style="color: #999; font-size: 10px; text-align: center;">Página <span class="pageNumber"></span> de <span class="totalPages"></span></span>'
    }
  },
  httpTimeout: 30000,
  phantomPath: 'phantomjs',
  phantomArgs: ['--ssl-protocol=any']
};

// ========== FUNCIONES AUXILIARES ==========

/**
 * Convierte HTML a PDF
 */
const convertHtmlToPdf = (html) => {
  return new Promise((resolve, reject) => {
    htmlPdf.create(html, pdfOptions).toBuffer((err, buffer) => {
      if (err) return reject(err);
      resolve(buffer);
    });
  });
};

/**
 * Guarda cotización en base de datos
 * (Ejemplo con archivo JSON - usar base de datos real en producción)
 */
const saveCotationToDB = async (quotationData) => {
  // Ejemplo con archivo JSON (NO USAR EN PRODUCCIÓN)
  const dbPath = path.join(__dirname, '../data/quotations.json');
  
  try {
    let quotations = [];
    try {
      const data = await fs.readFile(dbPath, 'utf-8');
      quotations = JSON.parse(data);
    } catch (e) {
      // Archivo no existe, crear nuevo
    }
    
    quotations.push({
      ...quotationData,
      id: uuidv4(),
      createdAt: new Date().toISOString()
    });
    
    await fs.writeFile(dbPath, JSON.stringify(quotations, null, 2));
    return quotations[quotations.length - 1].id;
  } catch (error) {
    console.error('Error saving quotation:', error);
    throw error;
  }
  
  // CON BASE DE DATOS REAL (PostgreSQL ejemplo):
  // const result = await pool.query(
  //   `INSERT INTO quotations 
  //    (client_name, client_email, service, analysis_data, estimated_cost, final_price)
  //    VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
  //   [quotationData.clientName, quotationData.clientEmail, ...]
  // );
  // return result.rows[0].id;
};

/**
 * Genera HTML para email en formato plano
 */
const generateEmailHtml = (clientData, analysis) => {
  const breakdownHtml = analysis.breakdown
    .map(cat => `
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 8px; font-weight: 600;">${cat.category}</td>
        <td style="padding: 8px; text-align: right;">$${cat.subtotal.toLocaleString('es-CO')}</td>
      </tr>
    `)
    .join('');

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
        }
        .header {
          background: linear-gradient(135deg, #44d7b6 0%, #2ca899 100%);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .content {
          background: white;
          padding: 30px;
          border-left: 1px solid #eee;
          border-right: 1px solid #eee;
        }
        .section {
          margin-bottom: 25px;
        }
        .section h3 {
          color: #44d7b6;
          border-bottom: 2px solid #44d7b6;
          padding-bottom: 10px;
          margin-top: 0;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        .footer {
          background: #f5f5f5;
          padding: 20px;
          text-align: center;
          border-radius: 0 0 8px 8px;
          font-size: 12px;
          color: #999;
          border-left: 1px solid #eee;
          border-right: 1px solid #eee;
          border-bottom: 1px solid #eee;
        }
        .cta-button {
          background: #44d7b6;
          color: white;
          padding: 12px 30px;
          border-radius: 6px;
          text-decoration: none;
          display: inline-block;
          margin-top: 15px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>BackSolutions</h1>
        <p>Tu cotización está lista</p>
      </div>
      
      <div class="content">
        <p>Hola <strong>${clientData.nombre}</strong>,</p>
        
        <p>Agradecemos tu interés en nuestros servicios. Adjunto encontrarás el documento profesional de cotización con el desglose completo.</p>
        
        <div class="section">
          <h3>Resumen de tu Solicitud</h3>
          <p>
            <strong>Servicio:</strong> ${clientData.servicio.replace(/-/g, ' ')}<br>
            <strong>Complejidad:</strong> ${analysis.complexity.toUpperCase()}<br>
            <strong>Presupuesto Total:</strong> <span style="color: #44d7b6; font-size: 18px; font-weight: bold;">$${analysis.finalPrice.toLocaleString('es-CO')}</span>
          </p>
        </div>
        
        <div class="section">
          <h3>Desglose de Costos</h3>
          <table>
            ${breakdownHtml}
            <tr style="background: #f9f9f9; font-weight: bold; border-top: 2px solid #44d7b6;">
              <td style="padding: 12px;">TOTAL</td>
              <td style="padding: 12px; text-align: right;">$${analysis.finalPrice.toLocaleString('es-CO')}</td>
            </tr>
          </table>
        </div>
        
        <div class="section">
          <h3>Próximos Pasos</h3>
          <ol>
            <li>Revisa el documento de cotización en detalle</li>
            <li>Si tienes dudas, nos puedes contactar directamente</li>
            <li>Acepta la cotización y comenzamos el proyecto</li>
            <li>Sesión de kick-off y planeación detallada</li>
          </ol>
        </div>
        
        <p><strong>Validez:</strong> Esta cotización es válida por 30 días a partir de hoy.</p>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="${process.env.FRONTEND_URL || 'https://backsolutions.com'}/portfolio" class="cta-button">
            Ver nuestros proyectos
          </a>
        </div>
        
        <p>Si tienes preguntas o necesitas modificaciones, no dudes en contactarnos.</p>
      </div>
      
      <div class="footer">
        <p>BackSolutions © 2026 | Soluciones Digitales Profesionales</p>
        <p><strong>Email:</strong> info@backsolutions.com</p>
        <p><strong>Teléfono:</strong> +57 (1) 8000000</p>
      </div>
    </body>
    </html>
  `;
};

/**
 * Genera HTML para email interno (empresa)
 */
const generateInternalEmailHtml = (clientData, analysis, document) => {
  const featuresList = analysis.features.map(f => `<li>${f}</li>`).join('');
  
  return `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; color: #333;">
      <h2 style="color: #44d7b6;">🎯 NUEVA SOLICITUD DE COTIZACIÓN RECIBIDA</h2>
      
      <h3>Datos del Cliente</h3>
      <table style="border-collapse: collapse; width: 100%;">
        <tr style="background: #f5f5f5;">
          <td style="padding: 8px; font-weight: bold;">Nombre:</td>
          <td style="padding: 8px;">${clientData.nombre}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold;">Email:</td>
          <td style="padding: 8px;">${clientData.email}</td>
        </tr>
        <tr style="background: #f5f5f5;">
          <td style="padding: 8px; font-weight: bold;">Teléfono:</td>
          <td style="padding: 8px;">${clientData.telefono || 'No proporcionado'}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold;">Servicio:</td>
          <td style="padding: 8px;">${clientData.servicio.replace(/-/g, ' ')}</td>
        </tr>
      </table>
      
      <h3>Análisis Automático</h3>
      <ul>
        <li><strong>Complejidad:</strong> ${analysis.complexity.toUpperCase()}</li>
        <li><strong>Presupuesto Estimado:</strong> $${analysis.estimatedCost.toLocaleString('es-CO')}</li>
        <li><strong>Presupuesto Final:</strong> <span style="color: green; font-weight: bold;">$${analysis.finalPrice.toLocaleString('es-CO')}</span></li>
        <li><strong>Funcionalidades Detectadas:</strong> ${analysis.features.length}</li>
      </ul>
      
      <h3>Funcionalidades Identificadas</h3>
      <ul>
        ${featuresList}
      </ul>
      
      <h3>Descripción del Proyecto</h3>
      <p style="background: #f9f9f9; padding: 10px; border-left: 3px solid #44d7b6;">
        ${clientData.detalles.replace(/\n/g, '<br>')}
      </p>
      
      <h3>Acciones Recomendadas</h3>
      <ol>
        <li>Revisar análisis automático y presupuesto</li>
        <li>Si es necesario, contactar al cliente para aclaraciones</li>
        <li>Confirmar acepta cotización o enviar versión revisada</li>
        <li>Programar reunión de kick-off</li>
      </ol>
      
      <hr style="border: 0; border-top: 1px solid #ddd; margin: 30px 0;">
      <p style="color: #999; font-size: 12px;">
        <strong>Referencia:</strong> ${document.filename.split('_')[1]}<br>
        <strong>Fecha:</strong> ${new Date().toLocaleString('es-CO')}<br>
        El documento profesional de cotización está adjunto.
      </p>
    </body>
    </html>
  `;
};

// ========== ENDPOINT PRINCIPAL ==========

/**
 * POST /api/cotizacion
 * Recibe solicitud de cotización del frontend y:
 * 1. Genera PDF desde HTML
 * 2. Guarda en BD
 * 3. Envía emails (cliente + empresa)
 * 4. Retorna confirmación
 */
router.post('/api/cotizacion', async (req, res) => {
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

    // Validaciones básicas
    if (!nombre || !email || !servicio || !detalles) {
      return res.status(400).json({
        success: false,
        message: 'Faltan datos requeridos'
      });
    }

    console.log(`📧 Procesando cotización para: ${nombre} (${email})`);

    // 1. Generar PDF
    let pdfBuffer;
    try {
      pdfBuffer = await convertHtmlToPdf(document.html);
      console.log(`✓ PDF generado (${pdfBuffer.length / 1024}KB)`);
    } catch (pdfError) {
      console.error('Error generating PDF:', pdfError);
      // Continuar sin PDF si falla, pero lo ideal es manejar esto
      pdfBuffer = null;
    }

    // 2. Guardar en BD
    const quotationId = await saveCotationToDB({
      clientName: nombre,
      clientEmail: email,
      clientPhone: telefono,
      service: servicio,
      details: detalles,
      analysisData: analysis,
      estimatedCost: analysis.estimatedCost,
      finalPrice: analysis.finalPrice,
      complexity: analysis.complexity,
      pdfFilename: document.filename.replace('.html', '.pdf'),
      status: 'sent'
    });
    console.log(`✓ Guardado en BD: ${quotationId}`);

    // 3. Email al cliente
    const clientEmailHtml = generateEmailHtml(
      { nombre, servicio, email },
      analysis
    );

    const attachments = [];
    if (pdfBuffer) {
      attachments.push({
        filename: document.filename.replace('.html', '.pdf'),
        content: pdfBuffer,
        contentType: 'application/pdf'
      });
    }

    await emailTransporter.sendMail({
      from: process.env.SMTP_USER || 'cotizaciones@backsolutions.com',
      to: email,
      subject: `✨ Cotización Profesional - BackSolutions [${document.filename.split('_')[1]}]`,
      html: clientEmailHtml,
      attachments: attachments
    });
    console.log(`✓ Email enviado al cliente: ${email}`);

    // 4. Email a la empresa
    const internalEmailHtml = generateInternalEmailHtml(
      { nombre, email, telefono, servicio, detalles },
      analysis,
      document
    );

    await emailTransporter.sendMail({
      from: process.env.SMTP_USER || 'cotizaciones@backsolutions.com',
      to: process.env.COMPANY_EMAIL || 'info@backsolutions.com',
      subject: `🎯 NUEVA COTIZACIÓN: ${nombre} - ${servicio.replace(/-/g, ' ')} [$${analysis.finalPrice.toLocaleString('es-CO')}]`,
      html: internalEmailHtml,
      attachments: attachments,
      replyTo: email // Para responder directamente al cliente
    });
    console.log(`✓ Email enviado a empresa`);

    // 5. Respuesta al cliente
    res.status(200).json({
      success: true,
      message: 'Cotización enviada exitosamente',
      quotationId: quotationId,
      quotationNumber: document.filename.split('_')[1],
      clientEmail: email,
      companyEmail: process.env.COMPANY_EMAIL || 'info@backsolutions.com',
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('es-CO')
    });

  } catch (error) {
    console.error('❌ Error processing quotation:', error);
    res.status(500).json({
      success: false,
      message: 'Error al procesar la cotización',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ========== RUTAS ADICIONALES (OPCIONALES) ==========

/**
 * GET /api/quotations/:id
 * Obtener detalles de una cotización (requiere autenticación)
 */
router.get('/api/quotations/:id', (req, res) => {
  // TODO: Implementar autenticación y obtención de BD
  res.json({ message: 'Not implemented yet' });
});

/**
 * PUT /api/quotations/:id/status
 * Actualizar estado de cotización (aceptada/rechazada/etc)
 */
router.put('/api/quotations/:id/status', (req, res) => {
  // TODO: Implementar actualización de estado
  res.json({ message: 'Not implemented yet' });
});

module.exports = router;

// ========== EJEMPLO DE USO EN MAIN APP ==========

/*
const express = require('express');
const cors = require('cors');
const quotationRoutes = require('./routes/quotations');

const app = express();

app.use(cors());
app.use(express.json());

// Usar rutas de cotizaciones
app.use('/api', quotationRoutes);

app.listen(3000, () => {
  console.log('🚀 Server running on port 3000');
});
*/

// ========== VARIABLES DE ENTORNO REQUERIDAS (.env) ==========

/*
# SMTP Configuration
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Company Configuration
COMPANY_EMAIL=info@backsolutions.com
FRONTEND_URL=https://backsolutions.com

# Environment
NODE_ENV=production
*/
