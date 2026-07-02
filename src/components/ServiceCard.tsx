// RUTA: src/components/ServiceCard.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Service } from '../data/services';

interface ServiceCardProps {
  service: Service;
}

export const ServiceCard = ({ service }: ServiceCardProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <article
        className={`service-card ${expanded ? 'expanded' : ''}`}
        onClick={() => setExpanded(!expanded)}
      >
        {service.image && (
          <div className="service-image-wrapper">
            <img src={service.image} alt={service.name} className="service-image" />
          </div>
        )}
        <div className="service-content">
          <h3>{service.name}</h3>
          <p className="short-desc">{service.shortDescription}</p>
          {service.technologies && service.technologies.length > 0 && (
            <div className="tech-tags">
              {service.technologies.map((tech) => (
                <span key={tech} className="tech-tag">
                  {tech}
                </span>
              ))}
            </div>
          )}
          <button className="expand-btn">
            {expanded ? 'Menos detalles' : 'Ver detalles'}
          </button>
        </div>
      </article>

      {expanded && (
        <div className="service-modal-overlay" onClick={() => setExpanded(false)}>
          <div className="service-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setExpanded(false)}>
              ✕
            </button>
            <h2>{service.name}</h2>
            <p className="full-desc">{service.fullDescription}</p>
            {service.technologies && service.technologies.length > 0 && (
              <div className="tech-section">
                <h4>Tecnologías</h4>
                <div className="tech-tags-large">
                  {service.technologies.map((tech) => (
                    <span key={tech} className="tech-tag-large">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <Link
              className="btn btn-primary"
              to="/contact"
              state={{ selectedService: service.id }}
              onClick={() => setExpanded(false)}
            >
              Cotizar este servicio
            </Link>
          </div>
        </div>
      )}
    </>
  );
};
