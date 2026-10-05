/**
 * Enums del backend como uniones de strings.
 *
 * El backend serializa los enums con `JsonStringEnumConverter(CamelCase)`, así que en
 * JSON viajan como `"inReview"`, `"quoteSent"`, etc. Estos tipos reflejan exactamente
 * esos valores. Para los filtros de query el backend acepta el mismo nombre de forma
 * case-insensitive, así que sirven igual.
 */

export type BadgeTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info';

export type LeadStatus =
  | 'new'
  | 'inReview'
  | 'quoteSent'
  | 'won'
  | 'lost'
  | 'spam'
  | 'archived';

export type LeadSource = 'web' | 'referral' | 'socialMedia' | 'direct' | 'other';

export type ProposalStatus =
  | 'draft'
  | 'sent'
  | 'viewed'
  | 'accepted'
  | 'rejected'
  | 'expired';

export type ConversationStatus = 'open' | 'awaitingClient' | 'awaitingTeam' | 'closed';

export type EscalationSeverity = 'low' | 'medium' | 'high' | 'critical';

export type EscalationStatus = 'open' | 'acknowledged' | 'resolved' | 'cancelled';

export type ContentStatus = 'draft' | 'published' | 'archived';

export type MessageSenderType = 'client' | 'team' | 'system';

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

export type Option<T extends string> = { value: T; label: string };

// ── Lead ─────────────────────────────────────────────────────
export const leadStatusLabels: Record<LeadStatus, string> = {
  new: 'Nuevo',
  inReview: 'En revisión',
  quoteSent: 'Propuesta enviada',
  won: 'Ganado',
  lost: 'Perdido',
  spam: 'Spam',
  archived: 'Archivado',
};

export const leadStatusTone: Record<LeadStatus, BadgeTone> = {
  new: 'accent',
  inReview: 'info',
  quoteSent: 'warning',
  won: 'success',
  lost: 'danger',
  spam: 'neutral',
  archived: 'neutral',
};

export const leadStatusOptions: Option<LeadStatus>[] = (
  Object.keys(leadStatusLabels) as LeadStatus[]
).map((value) => ({ value, label: leadStatusLabels[value] }));

export const leadSourceLabels: Record<LeadSource, string> = {
  web: 'Web',
  referral: 'Referido',
  socialMedia: 'Redes',
  direct: 'Directo',
  other: 'Otro',
};

// ── Propuesta ────────────────────────────────────────────────
export const proposalStatusLabels: Record<ProposalStatus, string> = {
  draft: 'Borrador',
  sent: 'Enviada',
  viewed: 'Vista',
  accepted: 'Aceptada',
  rejected: 'Rechazada',
  expired: 'Vencida',
};

export const proposalStatusTone: Record<ProposalStatus, BadgeTone> = {
  draft: 'neutral',
  sent: 'info',
  viewed: 'accent',
  accepted: 'success',
  rejected: 'danger',
  expired: 'warning',
};

export const proposalStatusOptions: Option<ProposalStatus>[] = (
  Object.keys(proposalStatusLabels) as ProposalStatus[]
).map((value) => ({ value, label: proposalStatusLabels[value] }));

// ── Conversación ─────────────────────────────────────────────
export const conversationStatusLabels: Record<ConversationStatus, string> = {
  open: 'Abierta',
  awaitingClient: 'Esperando al cliente',
  awaitingTeam: 'Esperando al equipo',
  closed: 'Cerrada',
};

export const conversationStatusTone: Record<ConversationStatus, BadgeTone> = {
  open: 'accent',
  awaitingClient: 'info',
  awaitingTeam: 'warning',
  closed: 'neutral',
};

export const conversationStatusOptions: Option<ConversationStatus>[] = (
  Object.keys(conversationStatusLabels) as ConversationStatus[]
).map((value) => ({ value, label: conversationStatusLabels[value] }));

// ── Severidad / escalamiento ─────────────────────────────────
export const severityLabels: Record<EscalationSeverity, string> = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
  critical: 'Crítica',
};

export const severityTone: Record<EscalationSeverity, BadgeTone> = {
  low: 'neutral',
  medium: 'info',
  high: 'warning',
  critical: 'danger',
};

export const escalationStatusLabels: Record<EscalationStatus, string> = {
  open: 'Abierto',
  acknowledged: 'Reconocido',
  resolved: 'Resuelto',
  cancelled: 'Cancelado',
};

export const escalationStatusTone: Record<EscalationStatus, BadgeTone> = {
  open: 'danger',
  acknowledged: 'warning',
  resolved: 'success',
  cancelled: 'neutral',
};

export const escalationStatusOptions: Option<EscalationStatus>[] = (
  Object.keys(escalationStatusLabels) as EscalationStatus[]
).map((value) => ({ value, label: escalationStatusLabels[value] }));

/** Índice numérico de severidad, para comparar. */
export const severityRank: Record<EscalationSeverity, number> = {
  low: 0,
  medium: 1,
  high: 2,
  critical: 3,
};

/** El backend devuelve `HighestSeverity` como número; lo mapeamos a string. */
export function severityFromRank(rank: number): EscalationSeverity | null {
  const entry = Object.entries(severityRank).find(([, value]) => value === rank);
  return entry ? (entry[0] as EscalationSeverity) : null;
}

// ── Contenido ────────────────────────────────────────────────
export const contentStatusLabels: Record<ContentStatus, string> = {
  draft: 'Borrador',
  published: 'Publicado',
  archived: 'Archivado',
};

export const contentStatusTone: Record<ContentStatus, BadgeTone> = {
  draft: 'neutral',
  published: 'success',
  archived: 'warning',
};

export const contentStatusOptions: Option<ContentStatus>[] = (
  Object.keys(contentStatusLabels) as ContentStatus[]
).map((value) => ({ value, label: contentStatusLabels[value] }));

export const pageSectionTypeLabels: Record<PageSectionType, string> = {
  hero: 'Hero',
  richText: 'Texto enriquecido',
  features: 'Características',
  stats: 'Estadísticas',
  servicesGrid: 'Grilla de servicios',
  projectsGrid: 'Grilla de proyectos',
  blogGrid: 'Grilla de blog',
  testimonials: 'Testimonios',
  faq: 'Preguntas frecuentes',
  gallery: 'Galería',
  logoCloud: 'Logos',
  callToAction: 'Llamado a la acción',
};

export const pageSectionTypeOptions: Option<PageSectionType>[] = (
  Object.keys(pageSectionTypeLabels) as PageSectionType[]
).map((value) => ({ value, label: pageSectionTypeLabels[value] }));

/** Opciones de filtro que agregan "Todos" (el backend lo representa como `all`). */
export function withAll<T extends string>(options: Option<T>[]): Option<T | 'all'>[] {
  return [{ value: 'all', label: 'Todos' }, ...options];
}
