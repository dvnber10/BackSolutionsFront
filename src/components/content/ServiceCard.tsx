import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { ServiceItem } from '../../features/content/types';
import { Badge } from '../ui/Badge';
import './ServiceCard.scss';

export function ServiceCard({ service }: { service: ServiceItem }) {
  return (
    <article className="service-card">
      <h3 className="service-card__title">
        <Link to={`/services/${service.slug}`}>{service.name}</Link>
      </h3>
      <p className="service-card__text">{service.shortDescription}</p>

      {service.technologies.length > 0 && (
        <ul className="service-card__tech" aria-label="Tecnologías">
          {service.technologies.slice(0, 4).map((tech) => (
            <li key={tech}>
              <Badge>{tech}</Badge>
            </li>
          ))}
        </ul>
      )}

      <Link className="service-card__link" to={`/services/${service.slug}`}>
        Ver detalle
        <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </article>
  );
}
