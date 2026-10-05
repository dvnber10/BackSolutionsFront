import { http } from '../../lib/http';
import type { ContentStatus } from './enums';
import type {
  AdminBlogPost,
  AdminPage,
  AdminPortfolioProject,
  AdminServiceItem,
  AdminSiteSettings,
  AssignConversationRequest,
  AssignLeadRequest,
  AssignRolesRequest,
  CloseConversationRequest,
  ConversationDetail,
  ConversationListItem,
  CreateEscalationRequest,
  CreateUserRequest,
  DashboardStats,
  Escalation,
  LeadDetail,
  LeadListItem,
  Message,
  PageNavItem,
  PagedResult,
  Proposal,
  ProposalListItem,
  ResetPasswordRequest,
  Role,
  SaveBlogPostRequest,
  SavePageRequest,
  SavePortfolioProjectRequest,
  SaveServiceItemRequest,
  SaveTagRequest,
  SendMessageRequest,
  Tag,
  UpdateEscalationStatusRequest,
  UpdateLeadNotesRequest,
  UpdateLeadStatusRequest,
  UpdateSiteSettingsRequest,
  UpdateUserRequest,
  UserListItem,
} from './types';

async function get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const { data } = await http.get<T>(url, { params });
  return data;
}

async function post<T>(url: string, body?: unknown): Promise<T> {
  const { data } = await http.post<T>(url, body);
  return data;
}

async function put<T>(url: string, body?: unknown): Promise<T> {
  const { data } = await http.put<T>(url, body);
  return data;
}

export type PageParams = { page?: number; pageSize?: number; search?: string | null };

export const adminApi = {
  // ── Dashboard ──────────────────────────────────────────────
  getDashboardStats: () => get<DashboardStats>('/admin/dashboard/stats'),

  // ── Leads ──────────────────────────────────────────────────
  listLeads: (params: PageParams & {
    status?: string;
    assignedToUserId?: string | null;
    unassignedOnly?: boolean;
  }) => get<PagedResult<LeadListItem>>('/admin/leads', params),
  getLead: (id: string) => get<LeadDetail>(`/admin/leads/${id}`),
  updateLeadStatus: (id: string, body: UpdateLeadStatusRequest) =>
    put<LeadDetail>(`/admin/leads/${id}/status`, body),
  assignLead: (id: string, body: AssignLeadRequest) =>
    put<LeadDetail>(`/admin/leads/${id}/assignee`, body),
  updateLeadNotes: (id: string, body: UpdateLeadNotesRequest) =>
    put<LeadDetail>(`/admin/leads/${id}/notes`, body),
  deleteLead: (id: string) => http.delete(`/admin/leads/${id}`),

  // ── Propuestas ─────────────────────────────────────────────
  listProposals: (params: PageParams & { leadId?: string | null; status?: string }) =>
    get<PagedResult<ProposalListItem>>('/admin/proposals', params),
  getProposal: (id: string) => get<Proposal>(`/admin/proposals/${id}`),
  createProposal: (body: unknown) => post<Proposal>('/admin/proposals', body),
  updateProposal: (id: string, body: unknown) => put<Proposal>(`/admin/proposals/${id}`, body),
  updateProposalStatus: (id: string, body: { status: string; reason?: string | null }) =>
    put<Proposal>(`/admin/proposals/${id}/status`, body),
  deleteProposal: (id: string) => http.delete(`/admin/proposals/${id}`),
  async downloadProposalPdf(id: string): Promise<Blob> {
    const { data } = await http.get(`/admin/proposals/${id}/pdf`, { responseType: 'blob' });
    return data as Blob;
  },

  // ── Conversaciones ─────────────────────────────────────────
  listConversations: (params: PageParams & {
    status?: string;
    assignedToUserId?: string | null;
    minSeverity?: string;
  }) => get<PagedResult<ConversationListItem>>('/admin/conversations', params),
  getConversation: (id: string) => get<ConversationDetail>(`/admin/conversations/${id}`),
  sendMessage: (id: string, body: SendMessageRequest) =>
    post<Message>(`/admin/conversations/${id}/messages`, body),
  assignConversation: (id: string, body: AssignConversationRequest) =>
    put<ConversationDetail>(`/admin/conversations/${id}/assignee`, body),
  closeConversation: (id: string, body: CloseConversationRequest) =>
    put<ConversationDetail>(`/admin/conversations/${id}/close`, body),
  createEscalation: (id: string, body: CreateEscalationRequest) =>
    post<Escalation>(`/admin/conversations/${id}/escalations`, body),
  updateEscalationStatus: (escalationId: string, body: UpdateEscalationStatusRequest) =>
    put<Escalation>(`/admin/conversations/escalations/${escalationId}/status`, body),

  // ── Usuarios ───────────────────────────────────────────────
  listUsers: (params: PageParams & { activeOnly?: boolean }) =>
    get<PagedResult<UserListItem>>('/admin/users', params),
  listRoles: () => get<Role[]>('/admin/users/roles'),
  getUser: (id: string) => get<UserListItem>(`/admin/users/${id}`),
  createUser: (body: CreateUserRequest) => post<UserListItem>('/admin/users', body),
  updateUser: (id: string, body: UpdateUserRequest) =>
    put<UserListItem>(`/admin/users/${id}`, body),
  assignRoles: (id: string, body: AssignRolesRequest) =>
    put<UserListItem>(`/admin/users/${id}/roles`, body),
  unlockUser: (id: string) => http.post(`/admin/users/${id}/unlock`),
  resetPassword: (id: string, body: ResetPasswordRequest) =>
    http.post(`/admin/users/${id}/reset-password`, body),
  deactivateUser: (id: string) => http.delete(`/admin/users/${id}`),

  // ── Servicios ──────────────────────────────────────────────
  listServices: (params: PageParams & { status?: string }) =>
    get<PagedResult<AdminServiceItem>>('/admin/services', params),
  getService: (id: string) => get<AdminServiceItem>(`/admin/services/${id}`),
  createService: (body: SaveServiceItemRequest) =>
    post<AdminServiceItem>('/admin/services', body),
  updateService: (id: string, body: SaveServiceItemRequest) =>
    put<AdminServiceItem>(`/admin/services/${id}`, body),
  deleteService: (id: string) => http.delete(`/admin/services/${id}`),

  // ── Portafolio ─────────────────────────────────────────────
  listProjects: (params: PageParams & { status?: string; featuredOnly?: boolean }) =>
    get<PagedResult<AdminPortfolioProject>>('/admin/portfolio', params),
  getProject: (id: string) => get<AdminPortfolioProject>(`/admin/portfolio/${id}`),
  createProject: (body: SavePortfolioProjectRequest) =>
    post<AdminPortfolioProject>('/admin/portfolio', body),
  updateProject: (id: string, body: SavePortfolioProjectRequest) =>
    put<AdminPortfolioProject>(`/admin/portfolio/${id}`, body),
  deleteProject: (id: string) => http.delete(`/admin/portfolio/${id}`),

  // ── Blog ───────────────────────────────────────────────────
  listPosts: (params: PageParams & { status?: string }) =>
    get<PagedResult<AdminBlogPost>>('/admin/blog/posts', params),
  getPost: (id: string) => get<AdminBlogPost>(`/admin/blog/posts/${id}`),
  createPost: (body: SaveBlogPostRequest) => post<AdminBlogPost>('/admin/blog/posts', body),
  updatePost: (id: string, body: SaveBlogPostRequest) =>
    put<AdminBlogPost>(`/admin/blog/posts/${id}`, body),
  deletePost: (id: string) => http.delete(`/admin/blog/posts/${id}`),
  listTags: () => get<Tag[]>('/admin/blog/tags'),
  createTag: (body: SaveTagRequest) => post<Tag>('/admin/blog/tags', body),
  updateTag: (id: string, body: SaveTagRequest) => put<Tag>(`/admin/blog/tags/${id}`, body),
  deleteTag: (id: string) => http.delete(`/admin/blog/tags/${id}`),

  // ── Páginas ────────────────────────────────────────────────
  listPages: (params: PageParams & { status?: string }) =>
    get<PagedResult<AdminPage>>('/admin/pages', params),
  getPageNavigation: () => get<PageNavItem[]>('/admin/pages/navigation'),
  getPage: (id: string) => get<AdminPage>(`/admin/pages/${id}`),
  createPage: (body: SavePageRequest) => post<AdminPage>('/admin/pages', body),
  updatePage: (id: string, body: SavePageRequest) => put<AdminPage>(`/admin/pages/${id}`, body),
  deletePage: (id: string) => http.delete(`/admin/pages/${id}`),

  // ── Configuración ──────────────────────────────────────────
  getSettings: () => get<AdminSiteSettings>('/admin/settings'),
  updateSettings: (body: UpdateSiteSettingsRequest) =>
    put<AdminSiteSettings>('/admin/settings', body),
};

/** Tipos de filtro reutilizados por las pantallas. */
export type ContentStatusParam = ContentStatus | 'all';
