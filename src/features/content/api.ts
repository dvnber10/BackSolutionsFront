import { http } from '../../lib/http';
import type {
  BlogPost,
  BlogPostSummary,
  CreateLeadRequest,
  Page,
  PageNavItem,
  PagedResult,
  PortfolioProject,
  PublicLead,
  PublicLeadCreated,
  ServiceItem,
  SiteSettings,
  Tag,
} from './types';

export type BlogListParams = {
  page?: number;
  pageSize?: number;
  tag?: string | null;
};

/**
 * Endpoints del sitio público (`/api/public/*`). Son anónimos y van cacheados en el
 * servidor con ETag, así que repetir la misma consulta es barato.
 */
export const publicApi = {
  getSettings: () => http.get<SiteSettings>('/public/settings').then((r) => r.data),

  getServices: () => http.get<ServiceItem[]>('/public/services').then((r) => r.data),

  getService: (slug: string) =>
    http.get<ServiceItem>(`/public/services/${encodeURIComponent(slug)}`).then((r) => r.data),

  getNavigation: () => http.get<PageNavItem[]>('/public/pages/navigation').then((r) => r.data),

  getPage: (slug: string) =>
    http.get<Page>(`/public/pages/${encodeURIComponent(slug)}`).then((r) => r.data),

  getPortfolio: (onlyFeatured = false) =>
    http
      .get<PortfolioProject[]>('/public/portfolio', { params: { onlyFeatured } })
      .then((r) => r.data),

  getProject: (slug: string) =>
    http
      .get<PortfolioProject>(`/public/portfolio/${encodeURIComponent(slug)}`)
      .then((r) => r.data),

  getBlogPosts: (params: BlogListParams = {}) =>
    http
      .get<PagedResult<BlogPostSummary>>('/public/blog/posts', { params })
      .then((r) => r.data),

  getBlogPost: (slug: string) =>
    http.get<BlogPost>(`/public/blog/posts/${encodeURIComponent(slug)}`).then((r) => r.data),

  getTags: () => http.get<Tag[]>('/public/blog/tags').then((r) => r.data),

  createLead: (body: CreateLeadRequest) =>
    http.post<PublicLeadCreated>('/public/leads', body).then((r) => r.data),

  trackLead: (publicToken: string) =>
    http
      .get<PublicLead>(`/public/leads/${encodeURIComponent(publicToken)}`)
      .then((r) => r.data),
};
