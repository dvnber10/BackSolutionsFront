import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  path?: string;
}

export const SEO: React.FC<SEOProps> = ({ title, description, keywords, path = "" }) => {
  const siteUrl = "https://backsolutions.dev"; // Reemplaza con tu dominio real cuando lo compres
  const fullUrl = `${siteUrl}${path}`;

  return (
    <Helmet>
      {/* Metadatos Estándar */}
      <title>{`${title} | BackSolutions`}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={fullUrl} />

      {/* Protocolo Open Graph (Para redes sociales como LinkedIn, WhatsApp, X) */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={`${siteUrl}/og-image.png`} /> {/* Pon una captura de tu web en public/og-image.png */}

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
};