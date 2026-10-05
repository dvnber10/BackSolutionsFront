import { useMutation, useQuery } from '@tanstack/react-query';
import { publicApi, type BlogListParams } from './api';
import type { CreateLeadRequest } from './types';

/**
 * El contenido público cambia poco y el servidor ya lo cachea con ETag, así que acá se
 * deja un `staleTime` generoso: evita refetches al navegar entre páginas.
 */
const CONTENT_STALE_TIME = 5 * 60 * 1000;

export const contentKeys = {
  all: ['content'] as const,
  settings: ['content', 'settings'] as const,
  navigation: ['content', 'navigation'] as const,
  services: ['content', 'services'] as const,
  service: (slug: string) => ['content', 'services', slug] as const,
  page: (slug: string) => ['content', 'pages', slug] as const,
  portfolio: (onlyFeatured: boolean) => ['content', 'portfolio', onlyFeatured] as const,
  project: (slug: string) => ['content', 'portfolio', slug] as const,
  blog: (params: BlogListParams) => ['content', 'blog', params] as const,
  blogPost: (slug: string) => ['content', 'blog', slug] as const,
  tags: ['content', 'tags'] as const,
};

export function useSiteSettings() {
  return useQuery({
    queryKey: contentKeys.settings,
    queryFn: publicApi.getSettings,
    staleTime: CONTENT_STALE_TIME,
  });
}

export function useNavigation() {
  return useQuery({
    queryKey: contentKeys.navigation,
    queryFn: publicApi.getNavigation,
    staleTime: CONTENT_STALE_TIME,
  });
}

export function useServices() {
  return useQuery({
    queryKey: contentKeys.services,
    queryFn: publicApi.getServices,
    staleTime: CONTENT_STALE_TIME,
  });
}

export function useService(slug: string | undefined) {
  return useQuery({
    queryKey: contentKeys.service(slug ?? ''),
    queryFn: () => publicApi.getService(slug as string),
    enabled: Boolean(slug),
    staleTime: CONTENT_STALE_TIME,
  });
}

export function usePage(slug: string | undefined) {
  return useQuery({
    queryKey: contentKeys.page(slug ?? ''),
    queryFn: () => publicApi.getPage(slug as string),
    enabled: Boolean(slug),
    staleTime: CONTENT_STALE_TIME,
  });
}

export function usePortfolio(onlyFeatured = false) {
  return useQuery({
    queryKey: contentKeys.portfolio(onlyFeatured),
    queryFn: () => publicApi.getPortfolio(onlyFeatured),
    staleTime: CONTENT_STALE_TIME,
  });
}

export function useProject(slug: string | undefined) {
  return useQuery({
    queryKey: contentKeys.project(slug ?? ''),
    queryFn: () => publicApi.getProject(slug as string),
    enabled: Boolean(slug),
    staleTime: CONTENT_STALE_TIME,
  });
}

export function useBlogPosts(params: BlogListParams = {}) {
  return useQuery({
    queryKey: contentKeys.blog(params),
    queryFn: () => publicApi.getBlogPosts(params),
    staleTime: CONTENT_STALE_TIME,
    placeholderData: (previous) => previous,
  });
}

export function useBlogPost(slug: string | undefined) {
  return useQuery({
    queryKey: contentKeys.blogPost(slug ?? ''),
    queryFn: () => publicApi.getBlogPost(slug as string),
    enabled: Boolean(slug),
    staleTime: CONTENT_STALE_TIME,
  });
}

export function useTags() {
  return useQuery({
    queryKey: contentKeys.tags,
    queryFn: publicApi.getTags,
    staleTime: CONTENT_STALE_TIME,
  });
}

export function useCreateLead() {
  return useMutation({
    mutationFn: (body: CreateLeadRequest) => publicApi.createLead(body),
  });
}

/** Seguimiento de una consulta por su publicToken. No reintenta: un token inválido no se arregla solo. */
export function useTrackedLead(publicToken: string | undefined) {
  return useQuery({
    queryKey: ['content', 'lead', publicToken ?? ''],
    queryFn: () => publicApi.trackLead(publicToken as string),
    enabled: Boolean(publicToken),
    retry: false,
  });
}
