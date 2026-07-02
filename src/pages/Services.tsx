// RUTA: src/pages/Services.tsx
import { services } from '../data/services';
import { ServiceCard } from '../components/ServiceCard';

const Services = () => (
  <div className="page-shell">
    <section className="page-section">
      <span className="eyebrow">Servicios</span>
      <h1>Nuestros Servicios</h1>
      <p>Diseñamos y desarrollamos experiencias digitales con enfoque en calidad, impacto y crecimiento.</p>
    </section>
    <section className="services-grid">
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </section>
  </div>
);
export default Services;
