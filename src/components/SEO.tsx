import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'BackSolutions';
const BASE_URL = (import.meta.env.VITE_SITE_URL as string | undefined) ?? 'https://backsolutions.com';
const DEFAULT_IMAGE = `${BASE_URL}/og-default.png`;

type SeoProps = {
  title: string;
  description?: string | null;
  image?: string | null;
  path?: string;
  type?: 'website' | 'article';
  noIndex?: boolean;
  /** Fecha ISO de publicación, para `article:published_time`. */
  publishedTime?: string | null;
};

/**
 * Metadatos del documento por página. Título Open Graph, canonical y robots en un solo
 * lugar para no repetir el boilerplate en cada página.
 */
export function SEO({
  title,
  description,
  image,
  path,
  type = 'website',
  noIndex = false,
  publishedTime,
}: SeoProps) {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const url = path ? `${BASE_URL}${path}` : BASE_URL;
  const socialImage = image ?? DEFAULT_IMAGE;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={url} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={socialImage} />
      {description && <meta property="og:description" content={description} />}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}

      <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={socialImage} />
    </Helmet>
  );
}
