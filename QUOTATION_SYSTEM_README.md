# 🎯 Sistema de Análisis y Generación de Cotizaciones Profesionales

## Descripción General

El proyecto **BackSolutions** ahora incluye un sistema inteligente y automatizado de análisis de cotizaciones que:

✅ **Analiza automáticamente** las solicitudes de los clientes  
✅ **Detecta funcionalidades** basadas en palabras clave  
✅ **Calcula presupuestos** precisos con desglose detallado  
✅ **Genera documentos** profesionales en HTML  
✅ **Envía cotizaciones** por email a cliente y empresa  

---

## 🏗️ Arquitectura del Sistema

### Frontend (React)

#### 1. **Analizador de Cotización** (`src/services/quotationAnalyzer.ts`)
Detecta funcionalidades en el texto del cliente y calcula presupuestos:

```typescript
const analysis = analyzeQuotation(
  "Necesito un sitio web con búsqueda, login y base de datos",
  "desarrollo-web"
);
// Resultado:
// - Funcionalidades detectadas: 3
// - Costo estimado: $11,500 (5000 base + 1500 + 2000 + 1500 + 1500)
// - Complejidad: "media"
```

**Funcionalidades detectadas:**
- Autenticación de usuarios ($1,500)
- Base de datos ($2,000)
- API/Integraciones ($2,500)
- Pagos online ($3,000)
- Notificaciones ($1,200)
- Panel de administración ($2,800)
- Reportes ($1,800)
- Búsqueda avanzada ($1,500)
- Multiidioma ($1,600)
- SEO ($1,000)
- Responsive design ($1,200)
- Animaciones ($800)

#### 2. **Generador de Documentos** (`src/services/quotationGenerator.ts`)
Crea HTML profesional de cotización:

```typescript
const document = generateQuotationHTML(formData, analysis, finalPrice);
// Genera:
// - HTML responsivo profesional
// - Número de cotización único
// - Vigencia de 30 días
// - Desglose detallado de costos
// - Términos y próximos pasos
```

#### 3. **Servicio de Cotización** (`src/services/cotizacionService.ts`)
Orquesta todo e integra con backend:

```typescript
await enviarCotizacion({
  nombre: "Juan Pérez",
  email: "juan@empresa.com",
  servicio: "desarrollo-web",
  detalles: "Necesito un sitio web con..."
});
// 1. Analiza automáticamente
// 2. Genera documento profesional
// 3. Envía al backend
// 4. Backend genera PDF y envía emails
```

### Backend (Node.js/Express - Por implementar)

El endpoint `/api/cotizacion` recibe datos enriquecidos:

```javascript
POST /api/cotizacion
Content-Type: application/json

{
  nombre: "Juan Pérez",
  email: "juan@empresa.com",
  telefono: "+57 300 123 4567",
  servicio: "desarrollo-web",
  detalles: "Descripción del proyecto...",
  analysis: {
    features: ["BUSQUEDA-AVANZADA", "AUTENTICACION", ...],
    estimatedCost: 11300,
    finalPrice: 13560,
    complexity: "alto",
    breakdown: [...]
  },
  document: {
    html: "<!-- Documento profesional -->",
    plainText: "Texto plano...",
    filename: "Cotizacion_QT-xxx_Juan_Perez.html"
  }
}
```

---

## 📧 Flujo de Emails

### Email al Cliente
- **Destinatario:** Email del cliente
- **Asunto:** `Cotización Profesional - BackSolutions [QT-xxx]`
- **Contenido:** 
  - Resumen en texto plano
  - PDF adjunto con documento completo
  - Instruye sobre validez y próximos pasos

### Email a la Empresa
- **Destinatario:** info@backsolutions.com
- **Asunto:** `NUEVA COTIZACIÓN: Juan Pérez - desarrollo-web [$13,560]`
- **Contenido:**
  - Datos completos del cliente
  - Análisis automático y complejidad
  - Desglose de funcionalidades y costos
  - PDF adjunto
  - Listo para seguimiento

---

## 🔧 Configuración del Backend Requerida

### 1. Variables de Entorno
```bash
# Email Configuration
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=cotizaciones@backsolutions.com
SMTP_PASS=tu_contraseña_segura

# Frontend URL (para enlaces en emails)
FRONTEND_URL=https://backsolutions.com
```

### 2. Dependencias Node.js Necesarias
```bash
npm install:
- express
- nodemailer
- html-pdf (o puppeteer/pdfkit para mejor calidad)
- dotenv
- body-parser
```

### 3. Base de Datos (Recomendado)
```sql
CREATE TABLE Quotations (
  id UUID PRIMARY KEY,
  clientName VARCHAR(255) NOT NULL,
  clientEmail VARCHAR(255) NOT NULL,
  clientPhone VARCHAR(20),
  service VARCHAR(100) NOT NULL,
  projectDetails TEXT NOT NULL,
  analysisData JSON NOT NULL,
  estimatedCost DECIMAL(10, 2),
  finalPrice DECIMAL(10, 2),
  complexity ENUM('bajo', 'medio', 'alto'),
  status ENUM('draft', 'sent', 'accepted', 'rejected') DEFAULT 'sent',
  pdfPath VARCHAR(500),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  sentAt TIMESTAMP,
  expiresAt TIMESTAMP,
  INDEX idx_client_email (clientEmail),
  INDEX idx_service (service),
  INDEX idx_created_at (createdAt)
);
```

---

## 🚀 Implementación del Backend (Ejemplo Express.js)

```javascript
const express = require('express');
const nodemailer = require('nodemailer');
const app = express();

app.use(express.json());

// Configurar transporter de email
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_SERVER,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

app.post('/api/cotizacion', async (req, res) => {
  try {
    const { nombre, email, telefono, servicio, detalles, analysis, document } = req.body;

    // 1. Generar PDF desde HTML
    const pdf = await htmlToPdf(document.html);

    // 2. Guardar en BD para registro
    // await saveCotationToDB({...});

    // 3. Enviar al cliente
    await transporter.sendMail({
      from: 'cotizaciones@backsolutions.com',
      to: email,
      subject: `Cotización Profesional - BackSolutions [${document.filename.split('_')[1]}]`,
      html: document.plainText.replace(/\n/g, '<br>'),
      attachments: [{
        filename: document.filename.replace('.html', '.pdf'),
        content: pdf
      }]
    });

    // 4. Enviar a empresa con análisis completo
    await transporter.sendMail({
      from: 'cotizaciones@backsolutions.com',
      to: 'info@backsolutions.com',
      subject: `NUEVA COTIZACIÓN: ${nombre} - ${servicio} [$${analysis.finalPrice}]`,
      html: `
        <h2>Nueva Solicitud de Cotización</h2>
        <p><strong>Cliente:</strong> ${nombre}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Servicio:</strong> ${servicio}</p>
        <p><strong>Presupuesto:</strong> $${analysis.finalPrice.toLocaleString('es-CO')}</p>
        <p><strong>Complejidad:</strong> ${analysis.complexity}</p>
        <hr>
        <p>El documento completo está adjunto.</p>
      `,
      attachments: [{
        filename: document.filename.replace('.html', '.pdf'),
        content: pdf
      }]
    });

    // 5. Responder al cliente
    res.json({
      success: true,
      message: 'Cotización enviada exitosamente',
      quotationId: document.filename.split('_')[1]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al procesar la cotización'
    });
  }
});

app.listen(3000, () => console.log('Server running...'));
```

---

## 📊 Ejemplo de Análisis Automático

**Input del Cliente:**
```
"Necesito un sitio web moderno que permita a mis clientes 
buscar productos, registrarse con autenticación, hacer compras 
con pasarela de pago y recibir notificaciones. También quiero 
un panel de administración para gestionar todo."
```

**Análisis Automático:**
```
✓ Búsqueda avanzada detectada: $1,500
✓ Autenticación de usuarios: $1,500
✓ Pago online: $3,000
✓ Notificaciones: $1,200
✓ Panel de administración: $2,800

Costo Base Desarrollo Web: $5,000
Funcionalidades Adicionales: $9,000
────────────────────────────
Subtotal: $14,000
Margen comercial (20%): $2,800
────────────────────────────
PRESUPUESTO FINAL: $16,800 COP
Validez: 30 días
Complejidad: ALTA
```

---

## 🎨 Características del Documento HTML

- ✅ Diseño responsive profesional
- ✅ Colores corporativos (verde menta #44d7b6)
- ✅ Número único de cotización
- ✅ Datos del cliente pre-llenados
- ✅ Análisis detallado de funcionalidades
- ✅ Desglose de costos por categoría
- ✅ Validez de 30 días
- ✅ Términos y condiciones
- ✅ Próximos pasos claros
- ✅ Imprimible y convertible a PDF

---

## 🔄 Próximos Pasos para Completar

1. **Backend:**
   - [ ] Implementar endpoint `/api/cotizacion`
   - [ ] Configurar envío de emails
   - [ ] Implementar generación de PDF
   - [ ] Crear tabla en BD para historial

2. **Frontend:**
   - [ ] Agregar loading visual durante envío
   - [ ] Mostrar confirmación con número de cotización
   - [ ] Permitir al usuario descargar el PDF antes de enviar

3. **Empresa:**
   - [ ] Crear dashboard de cotizaciones
   - [ ] Agregar seguimiento de estado (enviado/aceptado/rechazado)
   - [ ] Generar reportes de cotizaciones

---

## 📝 Notas Importantes

- El presupuesto incluye margen comercial de 20% (configurable)
- Las palabras clave son case-insensitive
- La validez es de 30 días desde la fecha de emisión
- Cambios en alcance se pueden reflejar en presupuesto revisado
- El sistema es extensible: agregar nuevas funcionalidades es fácil

---

## 📞 Soporte

Para preguntas sobre el sistema de cotizaciones, consultar:
- `QUOTATION_SYSTEM_DOCS.ts` - Documentación técnica detallada
- `src/services/quotationAnalyzer.ts` - Lógica de análisis
- `src/services/quotationGenerator.ts` - Generación de documentos
