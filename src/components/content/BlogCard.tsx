import { Link } from 'react-router-dom';
import type { BlogPostSummary } from '../../features/content/types';
import { formatDate, readingTime } from '../../lib/format';
import { Badge } from '../ui/Badge';
import './BlogCard.scss';

export function BlogCard({ post }: { post: BlogPostSummary }) {
  return (
    <article className="blog-card">
      <Link
        className="blog-card__media"
        to={`/blog/${post.slug}`}
        tabIndex={-1}
        aria-hidden="true"
      >
        {post.coverImageUrl ? (
          <img
            src={post.coverImageUrl}
            alt={post.coverImageAlt ?? post.title}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <span className="blog-card__placeholder" />
        )}
      </Link>

      <div className="blog-card__body">
        <p className="blog-card__meta">
          <time dateTime={post.publishedAtUtc}>{formatDate(post.publishedAtUtc)}</time>
          <span aria-hidden="true">·</span>
          <span>{readingTime(post.readingMinutes)}</span>
        </p>

        <h3 className="blog-card__title">
          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>

        {post.excerpt && <p className="blog-card__excerpt">{post.excerpt}</p>}

        {post.tags.length > 0 && (
          <ul className="blog-card__tags" aria-label="Etiquetas">
            {post.tags.slice(0, 3).map((tag) => (
              <li key={tag}>
                <Badge>{tag}</Badge>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
