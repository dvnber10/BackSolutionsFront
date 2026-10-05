import type {
  ContentStatus,
  Hero,
  LeadSource,
  LeadStatus,
  PageSectionType,
  PagedResult,
  SeoDefaults,
  SiteSettings,
  SocialLinks,
} from '../content/types';
import type {
  ConversationStatus,
  EscalationSeverity,
  EscalationStatus,
  MessageSenderType,
  ProposalStatus,
} from './enums';

export type { PagedResult };

// ── Dashboard ────────────────────────────────────────────────
export type DailyVolume = {
  day: string;
  leads: number;
  proposalsSent: number;
  conversations: number;
};

export type TopService = {
  serviceId: string;
  name: string;
  leads: number;
};

export type DashboardStats = {
  totalLeads: number;
  newLeads: number;
  leadsInReview: number;
  leadsWon: number;
  leadsLost: number;
  wonRevenue: number;
  openConversations: number;
  awaitingTeam: number;
  openEscalations: number;
  criticalEscalations: number;
  activeUsers: number;
  publishedPages: number;
  publishedServices: number;
  publishedProjects: number;
  publishedPosts: number;
  lastThirtyDays: DailyVolume[];
  topServices: TopService[];
};

// ── Leads ────────────────────────────────────────────────────
export type LeadListItem = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  status: LeadStatus;
  source: LeadSource;
  budgetMin: number | null;
  budgetMax: number | null;
  currency: string | null;
  handledByUserId: string | null;
  handledByName: string | null;
  proposalCount: number;
  conversationCount: number;
  createdAtUtc: string;
};

export type ProposalSummary = {
  id: string;
  number: string;
  title: string;
  status: ProposalStatus;
  currency: string;
  totalAmount: number;
  sentAtUtc: string | null;
  validUntil: string | null;
  createdByUserId: string | null;
  createdByName: string | null;
  createdAtUtc: string;
};

export type ConversationSummary = {
  id: string;
  subject: string;
  status: ConversationStatus;
  highestSeverity: number;
  createdAtUtc: string;
  lastMessageAtUtc: string | null;
};

export type LeadDetail = {
  id: string;
  publicToken: string;
  name: string;
  email: string;
  phone: string | null;
  serviceId: string | null;
  serviceName: string | null;
  details: string;
  status: LeadStatus;
  source: LeadSource;
  budgetMin: number | null;
  budgetMax: number | null;
  currency: string | null;
  targetStartDate: string | null;
  internalNotes: string | null;
  handledByUserId: string | null;
  handledByName: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAtUtc: string;
  updatedAtUtc: string;
  proposals: ProposalSummary[];
  conversations: ConversationSummary[];
};

export type UpdateLeadStatusRequest = { status: LeadStatus };
export type AssignLeadRequest = { userId: string | null };
export type UpdateLeadNotesRequest = { internalNotes: string | null };

// ── Propuestas ───────────────────────────────────────────────
export type ProposalItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discountPercent: number | null;
  sortOrder: number;
};

export type Proposal = {
  id: string;
  number: string;
  leadId: string;
  leadName: string;
  leadEmail: string;
  title: string;
  summaryHtml: string;
  notesHtml: string | null;
  status: ProposalStatus;
  currency: string;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  sentAtUtc: string | null;
  viewedAtUtc: string | null;
  validUntil: string | null;
  createdByUserId: string | null;
  createdByName: string | null;
  createdAtUtc: string;
  updatedAtUtc: string;
  items: ProposalItem[];
};

export type ProposalListItem = {
  id: string;
  number: string;
  title: string;
  leadId: string;
  leadName: string;
  status: ProposalStatus;
  currency: string;
  totalAmount: number;
  sentAtUtc: string | null;
  validUntil: string | null;
  createdByUserId: string | null;
  createdByName: string | null;
  createdAtUtc: string;
};

export type SaveProposalItemRequest = {
  id: string | null;
  description: string;
  quantity: number;
  unitPrice: number;
  discountPercent: number | null;
  sortOrder: number;
};

export type SaveProposalRequest = {
  leadId: string;
  title: string;
  summaryHtml: string;
  notesHtml: string | null;
  currency: string | null;
  discountAmount: number;
  taxAmount: number;
  validUntil: string | null;
  items: SaveProposalItemRequest[];
};

export type UpdateProposalStatusRequest = { status: ProposalStatus; reason?: string | null };

// ── Conversaciones ───────────────────────────────────────────
export type Message = {
  id: string;
  senderType: MessageSenderType;
  senderUserId: string | null;
  senderName: string | null;
  body: string;
  isInternal: boolean;
  attachmentName: string | null;
  attachmentContentType: string | null;
  hasAttachment: boolean;
  sentAtUtc: string;
  readAtUtc: string | null;
};

export type Escalation = {
  id: string;
  status: EscalationStatus;
  severity: EscalationSeverity;
  reason: string;
  raisedByUserId: string | null;
  raisedByName: string | null;
  assignedToUserId: string | null;
  assignedToName: string | null;
  resolutionNote: string | null;
  resolvedAtUtc: string | null;
  createdAtUtc: string;
};

export type ConversationListItem = {
  id: string;
  subject: string;
  clientName: string;
  clientEmail: string;
  status: ConversationStatus;
  highestSeverity: number;
  assignedToUserId: string | null;
  assignedToName: string | null;
  messageCount: number;
  unreadCount: number;
  createdAtUtc: string;
  lastMessageAtUtc: string | null;
  firstResponseAtUtc: string | null;
};

export type ConversationDetail = {
  id: string;
  publicToken: string;
  leadId: string | null;
  leadName: string | null;
  clientName: string;
  clientEmail: string;
  clientPhone: string | null;
  subject: string;
  status: ConversationStatus;
  highestSeverity: number;
  assignedToUserId: string | null;
  assignedToName: string | null;
  createdAtUtc: string;
  firstResponseAtUtc: string | null;
  lastMessageAtUtc: string | null;
  closedAtUtc: string | null;
  closeReason: string | null;
  messages: Message[];
  escalations: Escalation[];
};

export type SendMessageRequest = { body: string; isInternal?: boolean };
export type CloseConversationRequest = { reason: string };
export type AssignConversationRequest = { userId: string | null };
export type CreateEscalationRequest = {
  severity: EscalationSeverity;
  reason: string;
  messageId?: string | null;
};
export type UpdateEscalationStatusRequest = {
  status: EscalationStatus;
  resolutionNote?: string | null;
};

// ── Usuarios y roles ─────────────────────────────────────────
export type UserListItem = {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  isActive: boolean;
  mustChangePassword: boolean;
  isLockedOut: boolean;
  roles: string[];
  openConversations: number;
  assignedLeads: number;
  lastLoginAtUtc: string | null;
  createdAtUtc: string;
};

export type CreateUserRequest = {
  email: string;
  password: string;
  fullName: string;
  roles?: string[] | null;
  phone?: string | null;
  avatarUrl?: string | null;
  mustChangePassword?: boolean;
};

export type UpdateUserRequest = {
  fullName?: string | null;
  phone?: string | null;
  avatarUrl?: string | null;
  isActive?: boolean | null;
};

export type AssignRolesRequest = { roles: string[] };
export type ResetPasswordRequest = { newPassword: string; mustChangePassword?: boolean };

export type Role = {
  id: string;
  name: string;
  description: string;
  isSystem: boolean;
  userCount: number;
};

// ── Servicios ────────────────────────────────────────────────
export type AdminServiceItem = {
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
  status: ContentStatus;
  sortOrder: number;
  publishedAtUtc: string | null;
  updatedAtUtc: string;
};

export type SaveServiceItemRequest = {
  slug: string | null;
  name: string;
  shortDescription: string;
  fullDescription: string | null;
  icon: string | null;
  imageUrl: string | null;
  technologies: string[] | null;
  basePrice: number | null;
  priceNote: string | null;
  status: ContentStatus;
  sortOrder: number;
};

// ── Portafolio ───────────────────────────────────────────────
export type ProjectImage = {
  id: string;
  url: string;
  altText: string | null;
  sortOrder: number;
};

export type AdminPortfolioProject = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  descriptionHtml: string | null;
  coverImageUrl: string | null;
  coverImageAlt: string | null;
  clientName: string | null;
  techStack: string[];
  startedOn: string | null;
  deliveredOn: string | null;
  liveUrl: string | null;
  repositoryUrl: string | null;
  isFeatured: boolean;
  status: ContentStatus;
  sortOrder: number;
  images: ProjectImage[];
  updatedAtUtc: string;
};

export type SaveProjectImageRequest = {
  id: string | null;
  url: string;
  altText: string | null;
  sortOrder: number;
};

export type SavePortfolioProjectRequest = {
  slug: string | null;
  title: string;
  summary: string;
  descriptionHtml: string | null;
  coverImageUrl: string | null;
  coverImageAlt: string | null;
  clientName: string | null;
  techStack: string[] | null;
  startedOn: string | null;
  deliveredOn: string | null;
  liveUrl: string | null;
  repositoryUrl: string | null;
  isFeatured: boolean;
  status: ContentStatus;
  sortOrder: number;
  images: SaveProjectImageRequest[] | null;
};

// ── Blog ─────────────────────────────────────────────────────
export type AdminBlogPost = {
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

export type SaveBlogPostRequest = {
  slug: string | null;
  title: string;
  excerpt: string | null;
  contentHtml: string;
  coverImageUrl: string | null;
  coverImageAlt: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  status: ContentStatus;
  authorId: string | null;
  tags: string[] | null;
};

export type Tag = { id: string; name: string; slug: string };
export type SaveTagRequest = { name: string; slug: string | null };

// ── Páginas ──────────────────────────────────────────────────
export type PageSection = {
  id: string;
  type: PageSectionType;
  title: string | null;
  subtitle: string | null;
  content: unknown;
  sortOrder: number;
  isVisible: boolean;
};

export type AdminPage = {
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

export type PageNavItem = { id: string; slug: string; title: string; sortOrder: number };

export type SavePageSectionRequest = {
  id: string | null;
  type: PageSectionType;
  title: string | null;
  subtitle: string | null;
  content: unknown;
  sortOrder: number;
  isVisible: boolean;
};

export type SavePageRequest = {
  slug: string | null;
  title: string;
  eyebrow: string | null;
  intro: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  ogImageUrl: string | null;
  status: ContentStatus;
  showInNavigation: boolean;
  sortOrder: number;
  sections: SavePageSectionRequest[] | null;
};

// ── Settings ─────────────────────────────────────────────────
export type AdminSiteSettings = SiteSettings;

export type UpdateSiteSettingsRequest = {
  companyName: string;
  legalName: string | null;
  taxId: string | null;
  logoUrl: string | null;
  faviconUrl: string | null;
  contactEmail: string;
  phone: string | null;
  whatsApp: string | null;
  address: string | null;
  social: SocialLinks | null;
  hero: Hero | null;
  footerText: string;
  footerLegalText: string | null;
  seo: SeoDefaults | null;
  defaultCurrency: string | null;
  proposalValidityDays: number | null;
};
