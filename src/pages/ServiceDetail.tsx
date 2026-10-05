import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { SEO } from '../components/SEO';
import { PageHeader } from '../components/ui/PageHeader';
import { Section } from '../components/layout/Section';
import { StateBlock } from '../components/ui/StateBlock';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { CtaBand } from '../components/content/CtaBand';
import { useService } from '../features/content/queries';
import { ApiError } from '../lib/http';
import { formatCurrency } from '../lib/format';
import './ServiceDetail.scss';

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const service = useService(slug);

  if (service.isLoading) {
    return (
      <Section>
        <StateBlock variant="loading" message="Cargando servicio…" />
      </Section>
    );
  }

  const notFound = service.error instanceof ApiError && service.error.isNotFound;

  if (service.isError || !service.data) {
    return (
      <Section>
        <StateBlock
          variant="error"
          title={notFound ? 'No encontramos este servicio' : 'No pudimos cargar el servicio'}
          message={notFound ? 'Puede que el enlace esté roto o que el servicio ya no esté disponible.' : undefined}
          onRetry={notFound ? undefined : () => service.refetch()}
          action={
            <Button to="/services" variant="secondary">
              Ver todos los servicios
            </Button>
          }
        />
      </Section>
    );
  }

  const data = service.data;

  return (
    <>
      <SEO
        title={data.name}
        description={data.shortDescription}
        image={data.imageUrl}
        path={`/services/${data.slug}`}
      />

      <Section>
        <Link className="back-link" to="/services">
          <ArrowLeft size={16} aria-hidden="true" />
          Volver a servicios
        </Link>

        <PageHeader eyebrow="Servicio" title={data.name} intro={data.shortDescription} />

        <div className="service-detail">
          <div className="service-detail__main">
            {data.fullDescription ? (
              data.fullDescription
                .split(/\n\n+/)
                .filter(Boolean)
                .map((paragraph, index) => (
                  <p key={index} className="service-detail__paragraph">
                    {paragraph}
                  </p>
                ))
            ) : (
              <p className="service-detail__paragraph">{data.shortDescription}</p>
            )}

            {data.technologies.length > 0 && (
              <div className="service-detail__block">
                <h2 className="service-detail__subtitle">Tecnologías</h2>
                <ul className="service-detail__tech">
                  {data.technologies.map((tech) => (
                    <li key={tech}>
                      <Badge>{tech}</Badge>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <aside className="service-detail__aside">
            <div className="service-detail__card">
              <h2 className="service-detail__card-title">Empezar</h2>
              {data.basePrice !== null && (
                <p className="service-detail__price">
                  Desde <strong>{formatCurrency(data.basePrice)}</strong>
                </p>
              )}
              {data.priceNote && <p className="service-detail__note">{data.priceNote}</p>}
              <p className="service-detail__card-text">
                Contanos tu caso y te enviamos una propuesta a medida.
              </p>
              <Button to="/contact" block>
                Consultar por este servicio
              </Button>
            </div>
          </aside>
        </div>
      </Section>

      <CtaBand
        title="¿Avanzamos?"
        text="Coordinamos una llamada, entendemos el alcance y te devolvemos una propuesta."
      />
    </>
  );
}
