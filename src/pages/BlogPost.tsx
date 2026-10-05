import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { SEO } from '../components/SEO';
import { Section } from '../components/layout/Section';
import { StateBlock } from '../components/ui/StateBlock';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Prose } from '../components/content/Prose';
import { CtaBand } from '../components/content/CtaBand';
import { useBlogPost } from '../features/content/queries';
import { ApiError } from '../lib/http';
import { formatDate, readingTime } from '../lib/format';
import './BlogPost.scss';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = useBlogPost(slug);

  if (post.isLoading) {
    return (
      <Section>
        <StateBlock variant="loading" message="Cargando artículo…" />
      </Section>
    );
  }

  const notFound = post.error instanceof ApiError && post.error.isNotFound;

  if (post.isError || !post.data) {
    return (
      <Section>
        <StateBlock
          variant="error"
          title={notFound ? 'No encontramos este artículo' : 'No pudimos cargar el artículo'}
          message={notFound ? 'Puede que el enlace esté roto o que el artículo ya no esté publicado.' : undefined}
          onRetry={notFound ? undefined : () => post.refetch()}
          action={
            <Button to="/blog" variant="secondary">
              Volver al blog
            </Button>
          }
        />
      </Section>
    );
  }

  const data = post.data;

  return (
    <>
      <SEO
        title={data.seoTitle ?? data.title}
        description={data.seoDescription ?? data.excerpt}
        image={data.coverImageUrl}
        path={`/blog/${data.slug}`}
        type="article"
        publishedTime={data.publishedAtUtc}
      />

      <article className="post">
        <div className="post__container">
          <Link className="back-link" to="/blog">
            <ArrowLeft size={16} aria-hidden="true" />
            Volver al blog
          </Link>

          <header className="post__head">
            {data.tags.length > 0 && (
              <ul className="post__tags" aria-label="Etiquetas">
                {data.tags.map((tag) => (
                  <li key={tag}>
                    <Badge tone="accent">{tag}</Badge>
                  </li>
                ))}
              </ul>
            )}

            <h1 className="post__title">{data.title}</h1>

            {data.excerpt && <p className="post__excerpt">{data.excerpt}</p>}

            <p className="post__meta">
              {data.publishedAtUtc && (
                <>
                  <time dateTime={data.publishedAtUtc}>{formatDate(data.publishedAtUtc)}</time>
                  <span aria-hidden="true">·</span>
                </>
              )}
              <span>{readingTime(data.readingMinutes)}</span>
              {data.authorName && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{data.authorName}</span>
                </>
              )}
            </p>
          </header>

          {data.coverImageUrl && (
            <figure className="post__cover">
              <img
                src={data.coverImageUrl}
                alt={data.coverImageAlt ?? data.title}
                loading="eager"
                decoding="async"
              />
            </figure>
          )}

          <Prose html={data.contentHtml} className="post__content" />
        </div>
      </article>

      <CtaBand
        title="¿Te resultó útil?"
        text="Si querés que trabajemos juntos en algo así, escribinos."
        buttonLabel="Contactanos"
      />
    </>
  );
}
