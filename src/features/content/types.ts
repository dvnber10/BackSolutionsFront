/**
 * Tipos de la API. Espejo de los DTOs del backend tal como los serializa: camelCase y
 * enums como string camelCase (`JsonStringEnumConverter(JsonNamingPolicy.CamelCase)`).
 */

export type ContentStatus = 'draft' | 'published' | 'archived';

export type PageSectionType =
  | 'hero'
  | 'richText'
  | 'features'
  | 'stats'
  | 'servicesGrid'
  | 'projectsGrid'
  | 'blogGrid'
  | 'testimonials'
  | 'faq'
  | 'gallery'
  | 'logoCloud'
  | 'callToAction';

export type LeadStatus =
  | 'new'
  | 'inReview'
  | 'quoteSent'
  | 'won'
  | 'lost'
  | 'spam'
  | 'archived';

export type LeadSource = 'web' | 'referral' | 'socialMedia' | 'direct' | 'other';

export type Cta = {
  text: string;
  url: string;
};

export type SocialLinks = {
  facebookUrl: string | null;
  instagramUrl: string | null;
  linkedInUrl: string | null;
  githubUrl: string | null;
  xUrl: string | null;
};

export type Hero = {
  title: string;
  subtitle: string;
  imageUrl: string | null;
  primaryCta: Cta;
  secondaryCta: Cta;
};

export type SeoDefaults = {
  title: string;
  description: string | null;
  ogImageUrl: string | null;
};

export type SiteSettings = {
  id: number;
  companyName: string;
  legalName: string;
  taxId: string | null;
  logoUrl: string | null;
  faviconUrl: string | null;
  contactEmail: string;
  phone: string | null;
  whatsApp: string | null;
  address: string | null;
  social: SocialLinks;
  hero: Hero;
  footerText: string;
  footerLegalText: string | null;
  seo: SeoDefaults;
  defaultCurrency: string;
  proposalValidityDays: number;
  updatedAtUtc: string;
};

export type PageSection = {
  id: string;
  type: PageSectionType;
  title: string | null;
  subtitle: string | null;
  content: unknown;
  sortOrder: number;
  isVisible: boolean;
};

export type Page = {
  id: string;
  slug: string;
  title: string;
  eyebrow: string | null;
  intro: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  ogImageUrl: string | null;
  status: ContentStatus;
  showInNavigation: boolean;
  sortOrder: number;
  publishedAtUtc: string | null;
  sections: PageSection[];
  updatedAtUtc: string;
};

export type PageNavItem = {
  id: string;
  slug: string;
  title: string;
  sortOrder: number;
};

export type ServiceItem = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  fullDescription: string | null;
  icon: string | null;
  imageUrl: string | null;
  technologies: string[];
  basePrice: number | null;
  priceNote: string | null;
  sortOrder: number;
};

export type ProjectImage = {
  id: string;
  url: string;
  altText: string | null;
  sortOrder: number;
};

export type PortfolioProject = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  descriptionHtml: string | null;
  coverImageUrl: string | null;
  coverImageAlt: string | null;
  clientName: string | null;
  techStack: string[];
  liveUrl: string | null;
  isFeatured: boolean;
  images: ProjectImage[];
};

export type BlogPostSummary = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  coverImageAlt: string | null;
  publishedAtUtc: string;
  readingMinutes: number;
  tags: string[];
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  contentHtml: string;
  coverImageUrl: string | null;
  coverImageAlt: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  status: ContentStatus;
  publishedAtUtc: string | null;
  readingMinutes: number;
  viewCount: number;
  authorId: string | null;
  authorName: string | null;
  tags: string[];
  updatedAtUtc: string;
};

export type Tag = {
  id: string;
  name: string;
  slug: string;
};

export type PagedResult<T> = {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
};

/**
 * Alta de consulta desde el formulario público. `website` es el honeypot: si un bot lo
 * completa, el backend descarta el envío pero igual responde 201.
 */
export type CreateLeadRequest = {
  name: string;
  email: string;
  phone?: string | null;
  serviceId?: string | null;
  details: string;
  budgetMin?: number | null;
  budgetMax?: number | null;
  currency?: string | null;
  targetStartDate?: string | null;
  source?: LeadSource;
  website?: string | null;
};

export type PublicLeadCreated = {
  id: string;
  publicToken: string;
  status: LeadStatus;
  createdAtUtc: string;
};

export type PublicProposalSummary = {
  id: string;
  number: string;
  title: string;
  status: string;
  currency: string;
  totalAmount: number;
  sentAtUtc: string | null;
  validUntil: string | null;
  pdfUrl: string | null;
};

export type PublicLead = {
  id: string;
  publicToken: string;
  name: string;
  status: LeadStatus;
  createdAtUtc: string;
  targetStartDate: string | null;
  proposals: PublicProposalSummary[];
};
