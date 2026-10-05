import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { SEO } from '../components/SEO';
import { Section } from '../components/layout/Section';
import { StateBlock } from '../components/ui/StateBlock';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Prose } from '../components/content/Prose';
import { CtaBand } from '../components/content/CtaBand';
import { useProject } from '../features/content/queries';
import { ApiError } from '../lib/http';
import './ProjectDetail.scss';

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const project = useProject(slug);

  if (project.isLoading) {
    return (
      <Section>
        <StateBlock variant="loading" message="Cargando proyecto…" />
      </Section>
    );
  }

  const notFound = project.error instanceof ApiError && project.error.isNotFound;

  if (project.isError || !project.data) {
    return (
      <Section>
        <StateBlock
          variant="error"
          title={notFound ? 'No encontramos este proyecto' : 'No pudimos cargar el proyecto'}
          message={notFound ? 'Puede que el enlace esté roto o que el proyecto ya no esté publicado.' : undefined}
          onRetry={notFound ? undefined : () => project.refetch()}
          action={
            <Button to="/portfolio" variant="secondary">
              Ver el portafolio
            </Button>
          }
        />
      </Section>
    );
  }

  const data = project.data;

  return (
    <>
      <SEO
        title={data.title}
        description={data.summary}
        image={data.coverImageUrl}
        path={`/portfolio/${data.slug}`}
        type="article"
      />

      <Section>
        <Link className="back-link" to="/portfolio">
          <ArrowLeft size={16} aria-hidden="true" />
          Volver al portafolio
        </Link>

        <div className="project-detail__head">
          {data.clientName && <p className="project-detail__client">{data.clientName}</p>}
          <h1 className="project-detail__title">{data.title}</h1>
          <p className="project-detail__summary">{data.summary}</p>

          {data.techStack.length > 0 && (
            <ul className="project-detail__stack" aria-label="Tecnologías">
              {data.techStack.map((tech) => (
                <li key={tech}>
                  <Badge>{tech}</Badge>
                </li>
              ))}
            </ul>
          )}

          {data.liveUrl && (
            <div className="project-detail__actions">
              <Button href={data.liveUrl} target="_blank" rel="noreferrer">
                Ver sitio
                <ExternalLink size={16} aria-hidden="true" />
              </Button>
            </div>
          )}
        </div>

        {data.coverImageUrl && (
          <figure className="project-detail__cover">
            <img
              src={data.coverImageUrl}
              alt={data.coverImageAlt ?? data.title}
              loading="eager"
              decoding="async"
            />
          </figure>
        )}

        {data.descriptionHtml && (
          <div className="project-detail__body">
            <Prose html={data.descriptionHtml} />
          </div>
        )}

        {data.images.length > 0 && (
          <div className="project-detail__gallery">
            {data.images.map((image) => (
              <figure className="project-detail__figure" key={image.id}>
                <img
                  src={image.url}
                  alt={image.altText ?? data.title}
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            ))}
          </div>
        )}
      </Section>

      <CtaBand
        title="¿Tenés un desafío parecido?"
        text="Contanos de qué se trata y vemos cómo lo resolvemos."
        buttonLabel="Hablemos del proyecto"
      />
    </>
  );
}
