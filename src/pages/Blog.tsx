import { useState } from 'react';
import { SEO } from '../components/SEO';
import { PageHeader } from '../components/ui/PageHeader';
import { Section } from '../components/layout/Section';
import { StateBlock } from '../components/ui/StateBlock';
import { Button } from '../components/ui/Button';
import { BlogCard } from '../components/content/BlogCard';
import { useBlogPosts, useTags } from '../features/content/queries';
import './Blog.scss';

const PAGE_SIZE = 6;

export default function Blog() {
  const [tag, setTag] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const posts = useBlogPosts({ page, pageSize: PAGE_SIZE, tag });
  const tags = useTags();

  const selectTag = (next: string | null) => {
    setTag(next);
    setPage(1);
  };

  return (
    <>
      <SEO
        title="Blog"
        description="Notas, aprendizajes y novedades del equipo de BackSolutions."
        path="/blog"
      />

      <PageHeader
        eyebrow="Blog"
        title="Notas y aprendizajes"
        intro="Lo que vamos aprendiendo mientras construimos productos digitales."
      />

      <Section>
        {tags.data && tags.data.length > 0 && (
          <div className="tag-filter" role="group" aria-label="Filtrar por etiqueta">
            <button
              type="button"
              className={`tag-chip${tag === null ? ' is-active' : ''}`}
              aria-pressed={tag === null}
              onClick={() => selectTag(null)}
            >
              Todas
            </button>
            {tags.data.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`tag-chip${tag === item.slug ? ' is-active' : ''}`}
                aria-pressed={tag === item.slug}
                onClick={() => selectTag(item.slug)}
              >
                {item.name}
              </button>
            ))}
          </div>
        )}

        {posts.isLoading && <StateBlock variant="loading" message="Cargando artículos…" />}
        {posts.isError && (
          <StateBlock
            variant="error"
            title="No pudimos cargar el blog"
            onRetry={() => posts.refetch()}
          />
        )}
        {posts.data && posts.data.items.length === 0 && (
          <StateBlock
            variant="empty"
            message={tag ? 'No hay artículos con esta etiqueta.' : 'Todavía no hay artículos publicados.'}
          />
        )}
        {posts.data && posts.data.items.length > 0 && (
          <>
            <div className="grid grid--3">
              {posts.data.items.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>

            {posts.data.totalPages > 1 && (
              <nav className="pagination" aria-label="Paginación del blog">
                <Button
                  variant="secondary"
                  disabled={!posts.data.hasPrevious}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                >
                  Anterior
                </Button>
                <span className="pagination__status">
                  Página {posts.data.page} de {posts.data.totalPages}
                </span>
                <Button
                  variant="secondary"
                  disabled={!posts.data.hasNext}
                  onClick={() => setPage((current) => current + 1)}
                >
                  Siguiente
                </Button>
              </nav>
            )}
          </>
        )}
      </Section>
    </>
  );
}
