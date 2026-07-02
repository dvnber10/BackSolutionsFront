/**
 * Generador de documentos de cotización profesionales
 */

import { type CotizacionFormData } from '../types/types';
import { type QuotationAnalysis } from './quotationAnalyzer';

interface QuotationDocument {
  html: string;
  text: string;
  filename: string;
}

/**
 * Genera el HTML para cada categoría de funcionalidades
 */
const generateBreakdownHTML = (breakdown: Array<{ category: string; items: string[]; subtotal: number }>): string => {
  return breakdown
    .map(
      (cat) => `
          <div class="breakdown-category">
            <div class="breakdown-category-name">${cat.category}</div>
            <div class="breakdown-items">
              ${cat.items.map((item) => `<div class="breakdown-item"><span class="breakdown-item-name">• ${item}</span></div>`).join('')}
            </div>
          </div>
        `
    )
    .join('');
};

/**
 * Genera las filas de precios adicionales
 */
const generateAdditionalPricesHTML = (breakdown: Array<{ category: string; items: string[]; subtotal: number }>): string => {
  if (breakdown.length === 0) return '';

  return breakdown
    .map(
      (cat) => `
            <div class="price-row">
              <span style="margin-left: 20px; font-size: 13px;">+ ${cat.category}:</span>
              <span class="amount">$${cat.subtotal.toLocaleString('es-CO')}</span>
            </div>
          `
    )
    .join('');
};

/**
 * Genera un documento HTML profesional de cotización
 */
export const generateQuotationHTML = (
  formData: CotizacionFormData,
  analysis: QuotationAnalysis,
  finalPrice: number
): QuotationDocument => {
  const today = new Date();
  const quotationNumber = `QT-${Date.now()}`;
  const validUntil = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

  const serviceNames: Record<string, string> = {
    'desarrollo-web': 'Desarrollo Web',
    'desarrollo-movil': 'Desarrollo Móvil',
    'chatbots': 'Chatbots Inteligentes',
    'diseno-paginas': 'Diseño de Páginas Web',
    'consultoria': 'Consultoría DevOps',
    'otro': 'Otro',
  };

  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cotización ${quotationNumber}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #f5f5f5;
      padding: 20px;
    }
    
    .container {
      max-width: 900px;
      margin: 0 auto;
      background: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 40px;
      border-bottom: 3px solid #44d7b6;
      padding-bottom: 20px;
    }
    
    .company-info h1 {
      font-size: 28px;
      color: #44d7b6;
      margin-bottom: 5px;
    }
    
    .company-info p {
      color: #666;
      font-size: 14px;
    }
    
    .quotation-meta {
      text-align: right;
      font-size: 14px;
    }
    
    .quotation-meta div {
      margin-bottom: 5px;
    }
    
    .label {
      color: #666;
      font-weight: 600;
    }
    
    .value {
      color: #44d7b6;
      font-weight: bold;
    }
    
    .client-info {
      background: #f9f9f9;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 30px;
      border-left: 4px solid #44d7b6;
    }
    
    .client-info h3 {
      color: #44d7b6;
      margin-bottom: 10px;
      font-size: 14px;
      text-transform: uppercase;
    }
    
    .client-details {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      font-size: 14px;
    }
    
    .client-detail-item {
      display: flex;
      flex-direction: column;
    }
    
    .client-detail-item strong {
      color: #333;
      margin-bottom: 3px;
    }
    
    .client-detail-item span {
      color: #666;
    }
    
    .section {
      margin-bottom: 30px;
    }
    
    .section h2 {
      font-size: 16px;
      color: #44d7b6;
      text-transform: uppercase;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 2px solid #e0e0e0;
    }
    
    .section h3 {
      font-size: 14px;
      color: #333;
      margin-top: 15px;
      margin-bottom: 8px;
      font-weight: 600;
    }
    
    .analysis-text {
      background: #f0f8f7;
      padding: 15px;
      border-radius: 6px;
      color: #333;
      font-size: 14px;
      line-height: 1.7;
    }
    
    .breakdown {
      margin-top: 15px;
    }
    
    .breakdown-category {
      background: #fafafa;
      padding: 12px;
      margin-bottom: 10px;
      border-radius: 6px;
      border-left: 3px solid #44d7b6;
    }
    
    .breakdown-category-name {
      font-weight: 600;
      color: #333;
      margin-bottom: 8px;
    }
    
    .breakdown-items {
      font-size: 13px;
      color: #666;
      margin-left: 10px;
    }
    
    .breakdown-item {
      padding: 4px 0;
      display: flex;
      justify-content: space-between;
    }
    
    .breakdown-item-name {
      flex: 1;
    }
    
    .breakdown-item-price {
      color: #44d7b6;
      font-weight: 600;
      margin-left: 20px;
    }
    
    .pricing-summary {
      background: linear-gradient(135deg, #f0f8f7 0%, #f9fffe 100%);
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    
    .price-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      font-size: 14px;
    }
    
    .price-row.total {
      border-top: 2px solid #44d7b6;
      padding-top: 10px;
      margin-top: 10px;
      font-size: 16px;
      font-weight: bold;
    }
    
    .price-row.total .label {
      color: #333;
    }
    
    .price-row.total .amount {
      color: #44d7b6;
      font-size: 20px;
    }
    
    .amount {
      color: #44d7b6;
      font-weight: 600;
    }
    
    .complexity-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      margin-bottom: 10px;
    }
    
    .complexity-bajo {
      background: #d4edda;
      color: #155724;
    }
    
    .complexity-medio {
      background: #fff3cd;
      color: #856404;
    }
    
    .complexity-alto {
      background: #f8d7da;
      color: #721c24;
    }
    
    .notes {
      background: #f9f9f9;
      padding: 15px;
      border-radius: 6px;
      font-size: 13px;
      color: #666;
      line-height: 1.6;
      margin-top: 20px;
    }
    
    .notes strong {
      color: #333;
    }
    
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #e0e0e0;
      text-align: center;
      color: #999;
      font-size: 12px;
    }
    
    .validity {
      background: #f0f8f7;
      padding: 12px;
      border-radius: 6px;
      text-align: center;
      color: #44d7b6;
      font-weight: 600;
      margin: 20px 0;
    }
    
    @media print {
      body {
        background: white;
        padding: 0;
      }
      .container {
        box-shadow: none;
        max-width: 100%;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="company-info">
        <h1>BackSolutions</h1>
        <p>Soluciones Digitales Profesionales</p>
      </div>
      <div class="quotation-meta">
        <div><span class="label">Número de Cotización:</span> <span class="value">${quotationNumber}</span></div>
        <div><span class="label">Fecha:</span> <span>${today.toLocaleDateString('es-ES')}</span></div>
        <div><span class="label">Válido hasta:</span> <span>${validUntil.toLocaleDateString('es-ES')}</span></div>
      </div>
    </div>

    <div class="client-info">
      <h3>Información del Cliente</h3>
      <div class="client-details">
        <div class="client-detail-item">
          <strong>Nombre:</strong>
          <span>${formData.nombre}</span>
        </div>
        <div class="client-detail-item">
          <strong>Email:</strong>
          <span>${formData.email}</span>
        </div>
        <div class="client-detail-item">
          <strong>Teléfono:</strong>
          <span>${formData.telefono || 'No proporcionado'}</span>
        </div>
        <div class="client-detail-item">
          <strong>Servicio Solicitado:</strong>
          <span>${serviceNames[formData.servicio as keyof typeof serviceNames]}</span>
        </div>
      </div>
    </div>

    <div class="section">
      <h2>Descripción del Proyecto</h2>
      <p style="color: #666; font-size: 14px; line-height: 1.7;">${formData.detalles.replace(/\n/g, '<br>')}</p>
    </div>

    <div class="section">
      <h2>Análisis de Funcionalidades</h2>
      <span class="complexity-badge complexity-${analysis.complexity}">${analysis.complexity}</span>
      <div class="analysis-text">
        <p>${analysis.analysis}</p>
      </div>
      
      <h3>Funcionalidades Detectadas</h3>
      <div class="breakdown">
        ${generateBreakdownHTML(analysis.breakdown)}
      </div>
    </div>

    <div class="section">
      <h2>Presupuesto</h2>
      <div class="pricing-summary">
        <div class="price-row">
          <span class="label">Servicio Base:</span>
          <span class="amount">$${analysis.estimatedCost.toLocaleString('es-CO')}</span>
        </div>
        ${generateAdditionalPricesHTML(analysis.breakdown)}
        <div class="price-row total">
          <span class="label">PRESUPUESTO TOTAL:</span>
          <span class="amount">$${finalPrice.toLocaleString('es-CO')}</span>
        </div>
      </div>

      <div class="validity">
        ℹ️ Esta cotización es válida por 30 días desde la fecha de emisión
      </div>

      <div class="notes">
        <strong>Notas Importantes:</strong>
        <ul style="margin-left: 20px; margin-top: 8px;">
          <li>El presupuesto incluye el análisis de requisitos inicial y hasta 3 reuniones de seguimiento.</li>
          <li>Cambios significativos en el alcance del proyecto pueden afectar el presupuesto final.</li>
          <li>Se incluye hospedaje por 3 meses (aplicable a servicios web/móvil).</li>
          <li>El mantenimiento posterior y soporte se cotizarán según lo acordado.</li>
          <li>El plazo estimado de desarrollo dependerá de la disponibilidad del cliente para retroalimentación.</li>
        </ul>
      </div>
    </div>

    <div class="section">
      <h2>Próximos Pasos</h2>
      <p style="color: #666; font-size: 14px; line-height: 1.7;">
        1. Revisión de esta cotización<br>
        2. Aceptación de términos y condiciones<br>
        3. Reunión de kick-off para detallar el proyecto<br>
        4. Inicio del desarrollo<br>
        5. Entregas progresivas y revisiones
      </p>
    </div>

    <div class="footer">
      <p>BackSolutions © 2026 | Soluciones Digitales Profesionales</p>
      <p>Esta cotización es un documento profesional y confidencial. Para más información, contacte a info@backsolutions.com</p>
    </div>
  </div>
</body>
</html>
  `;

  const filename = `Cotizacion_${quotationNumber}_${formData.nombre.replace(/\s+/g, '_')}.html`;

  return {
    html,
    text: `Cotización ${quotationNumber} para ${formData.nombre}`,
    filename,
  };
};

/**
 * Genera un texto plano para incluir en el email
 */
export const generateQuotationText = (
  formData: CotizacionFormData,
  analysis: QuotationAnalysis,
  finalPrice: number
): string => {
  const breakdownText = analysis.breakdown
    .map((cat) => `\n${cat.category}:\n${cat.items.map((item: string) => `  - ${item}`).join('\n')}`)
    .join('');

  const additionalPrice = analysis.breakdown.length > 0 ? `Funcionalidades Adicionales: $${analysis.breakdown.reduce((sum: number, cat) => sum + cat.subtotal, 0).toLocaleString('es-CO')}` : '';

  return `
COTIZACIÓN PROFESIONAL - BackSolutions

Cliente: ${formData.nombre}
Email: ${formData.email}
Teléfono: ${formData.telefono || 'No proporcionado'}

DESCRIPCIÓN DEL PROYECTO:
${formData.detalles}

ANÁLISIS:
${analysis.analysis}

FUNCIONALIDADES DETECTADAS:
${breakdownText}

PRESUPUESTO:
Servicio Base: $${analysis.estimatedCost.toLocaleString('es-CO')}
${additionalPrice}
---
PRESUPUESTO TOTAL: $${finalPrice.toLocaleString('es-CO')}

Válido por 30 días desde hoy.

BackSolutions - Soluciones Digitales Profesionales
  `;
};
