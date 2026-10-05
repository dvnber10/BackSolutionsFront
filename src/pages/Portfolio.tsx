import { useState } from 'react';
import { SEO } from '../components/SEO';
import { PageHeader } from '../components/ui/PageHeader';
import { Section } from '../components/layout/Section';
import { StateBlock } from '../components/ui/StateBlock';
import { ProjectCard } from '../components/content/ProjectCard';
import { CtaBand } from '../components/content/CtaBand';
import { usePortfolio } from '../features/content/queries';
import './Portfolio.scss';

export default function Portfolio() {
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const projects = usePortfolio(false);

  const all = projects.data ?? [];
  const list = featuredOnly ? all.filter((project) => project.isFeatured) : all;

  return (
    <>
      <SEO
        title="Portafolio"
        description="Proyectos de diseño y desarrollo web que construimos para nuestros clientes."
        path="/portfolio"
      />

      <PageHeader
        eyebrow="Portafolio"
        title="Proyectos que salieron del taller"
        intro="Una selección de trabajos reales. Cada uno con su contexto, su desafío y la solución que construimos."
      />

      <Section>
        <div className="filter-bar" role="group" aria-label="Filtrar proyectos">
          <button
            type="button"
            className={`filter-pill${featuredOnly ? '' : ' is-active'}`}
            aria-pressed={!featuredOnly}
            onClick={() => setFeaturedOnly(false)}
          >
            Todos
          </button>
          <button
            type="button"
            className={`filter-pill${featuredOnly ? ' is-active' : ''}`}
            aria-pressed={featuredOnly}
            onClick={() => setFeaturedOnly(true)}
          >
            Destacados
          </button>
        </div>

        {projects.isLoading && <StateBlock variant="loading" message="Cargando proyectos…" />}
        {projects.isError && (
          <StateBlock
            variant="error"
            title="No pudimos cargar el portafolio"
            onRetry={() => projects.refetch()}
          />
        )}
        {projects.data && list.length === 0 && (
          <StateBlock
            variant="empty"
            message={
              featuredOnly
                ? 'No hay proyectos destacados por ahora.'
                : 'Todavía no hay proyectos publicados.'
            }
          />
        )}
        {list.length > 0 && (
          <div className="grid grid--3">
            {list.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </Section>

      <CtaBand
        title="¿Querés ver tu proyecto acá?"
        text="Contanos tu idea y la convertimos en el próximo caso de éxito."
        buttonLabel="Empezar un proyecto"
      />
    </>
  );
}
