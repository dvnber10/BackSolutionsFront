
// RUTA: src/pages/Contact.tsx
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useCotizacion } from '../hooks/useCotizacion';
import { SEO } from '../components/SEO';

// 🤖 Mensajes dinámicos que simulan la actividad de la IA y el backend de BackSolutions
const PASOS_IA = [
  "🤖 IA: Leyendo y analizando tu requerimiento...",
  "📐 IA: Estructurando la arquitectura idónea (Frontend y Backend)...",
  "🗄️ IA: Diseñando el modelo de datos y persistencia...",
  "📝 IA: Redactando los objetivos y alcances del proyecto...",
  "📊 IA: Calculando estimaciones de tiempo y entregables por fase...",
  "📄 QuestPDF: Renderizando y empaquetando tu propuesta formal...",
  "✉️ MailKit: Preparando el servidor SMTP para el despacho...",
  "🚀 ¡Casi listo! Enviando la propuesta a tu bandeja de entrada..."
];

const Contact = () => {
  const location = useLocation();
  const selectedServiceId = location.state?.selectedService;
  const { formData, error, handleChange, handleSubmit, isLoading, isSuccess, setFormData } = useCotizacion();
  
  // Estado local para manejar qué mensaje de la IA se muestra
  const [indexPaso, setIndexPaso] = useState(0);

  // Efecto para hacer avanzar la secuencia de mensajes de la IA mientras esté cargando
  useEffect(() => {
    let intervalo: number;
    if (isLoading) {
      setIndexPaso(0); // Reiniciar al primer paso cada vez que inicia
      intervalo = window.setInterval(() => {
        setIndexPaso((prevIndex) => {
          if (prevIndex < PASOS_IA.length - 1) {
            return prevIndex + 1;
          }
          return prevIndex; // Se detiene en el último mensaje hasta que .NET responda
        });
      }, 4000); // Cambia el texto cada 2.3 segundos aprox.
    }
    return () => clearInterval(intervalo);
  }, [isLoading]);

  useEffect(() => {
    if (selectedServiceId) {
      setFormData((prev) => ({
        ...prev,
        servicio: selectedServiceId,
      }));
    }
  }, [selectedServiceId, setFormData]);

  return (
    <>
      <SEO
        title="Contacto y Cotización"
        description="Cuéntanos tu idea y te ayudaremos a convertirla en una solución digital sólida y profesional."
        path="/contact"
      />
      <div className="page-shell">
        <section className="page-section">
          <span className="eyebrow">Cotización</span>
          <h1>Contacto y Cotización</h1>
          <p>Cuéntanos tu idea y te ayudaremos a convertirla en una solución digital sólida y profesional.</p>
        </section>

        <section className="form-card">
          {isSuccess ? (
            <div className="success-message" style={{ textAlign: 'center', padding: '2rem 0' }}>
              <h3>¡Gracias por su mensaje!</h3>
              <p>Hemos recibido su solicitud de cotización y nos pondremos en contacto con usted en breve.</p>
            </div>
          ) : isLoading ? (
            // 🚀 LOADER DINÁMICO TIPO IA: Reemplaza temporalmente el formulario mientras se procesa en el host
            <div className="ai-loader-container" style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '3rem 1rem',
              textAlign: 'center',
              gap: '1.5rem'
            }}>
              {/* Animación de carga circular sutil (puedes adaptarla a tus estilos globales) */}
              <div className="ai-spinner" style={{
                width: '45px',
                height: '45px',
                border: '4px solid rgba(0,0,0,0.1)',
                borderTopColor: '#3b82f6', // Color primario de tu marca
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              
              <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes pulseSlow { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
              `}</style>

              <p style={{
                fontSize: '1.15rem',
                fontWeight: 500,
                color: '#374151',
                maxWidth: '500px',
                minHeight: '54px', // Evita saltos de layout si un texto es más largo que otro
                animation: 'pulseSlow 2s ease-in-out infinite'
              }}>
                {PASOS_IA[indexPaso]}
              </p>

              <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                Nuestra IA está estructurando una solución a la medida. Esto puede tomar unos segundos.
              </span>
            </div>
          ) : (
            // Formulario tradicional (Solo visible si no está cargando ni ha terminado)
            <form className="form-grid" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="nombre">Nombre Completo</label>
                <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="telefono">Teléfono (Opcional)</label>
                <input type="tel" id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="servicio">Servicio de Interés</label>
                <select id="servicio" name="servicio" value={formData.servicio} onChange={handleChange}>
                  <option value="desarrollo-web">Desarrollo Web</option>
                  <option value="desarrollo-movil">Desarrollo Móvil</option>
                  <option value="chatbots">Chatbots Inteligentes</option>
                  <option value="diseno-paginas">Diseño de Páginas Web</option>
                  <option value="consultoria">Consultoría DevOps</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="detalles">Detalles del Proyecto</label>
                <textarea id="detalles" name="detalles" value={formData.detalles} onChange={handleChange} rows={5} required></textarea>
              </div>

              {error && <p className="error-message">{error}</p>}

              <button className="btn btn-primary" type="submit">
                Enviar Cotización
              </button>
            </form>
          )}
        </section>
      </div>
    </>
  );
};

export default Contact;
