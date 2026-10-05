import { useMutation, useQuery, useQueryClient, type QueryKey } from '@tanstack/react-query';
import { adminApi, type PageParams } from './api';
import type {
  AssignConversationRequest,
  AssignLeadRequest,
  AssignRolesRequest,
  CloseConversationRequest,
  CreateEscalationRequest,
  CreateUserRequest,
  ResetPasswordRequest,
  SaveBlogPostRequest,
  SavePageRequest,
  SavePortfolioProjectRequest,
  SaveServiceItemRequest,
  SaveTagRequest,
  SendMessageRequest,
  UpdateEscalationStatusRequest,
  UpdateLeadNotesRequest,
  UpdateLeadStatusRequest,
  UpdateSiteSettingsRequest,
  UpdateUserRequest,
} from './types';

export const adminKeys = {
  all: ['admin'] as const,
  dashboard: ['admin', 'dashboard'] as const,
  leads: (params: object) => ['admin', 'leads', params] as const,
  lead: (id: string) => ['admin', 'leads', 'detail', id] as const,
  proposals: (params: object) => ['admin', 'proposals', params] as const,
  proposal: (id: string) => ['admin', 'proposals', 'detail', id] as const,
  conversations: (params: object) => ['admin', 'conversations', params] as const,
  conversation: (id: string) => ['admin', 'conversations', 'detail', id] as const,
  users: (params: object) => ['admin', 'users', params] as const,
  roles: ['admin', 'users', 'roles'] as const,
  services: (params: object) => ['admin', 'services', params] as const,
  service: (id: string) => ['admin', 'services', 'detail', id] as const,
  projects: (params: object) => ['admin', 'portfolio', params] as const,
  project: (id: string) => ['admin', 'portfolio', 'detail', id] as const,
  posts: (params: object) => ['admin', 'blog', params] as const,
  post: (id: string) => ['admin', 'blog', 'detail', id] as const,
  tags: ['admin', 'blog', 'tags'] as const,
  pages: (params: object) => ['admin', 'pages', params] as const,
  pageNav: ['admin', 'pages', 'navigation'] as const,
  page: (id: string) => ['admin', 'pages', 'detail', id] as const,
  settings: ['admin', 'settings'] as const,
};

/** Invalida por prefijo. Las listas filtradas comparten prefijo y se refrescan juntas. */
function useInvalidate() {
  const client = useQueryClient();
  return (key: QueryKey) => client.invalidateQueries({ queryKey: key });
}

// ── Dashboard ────────────────────────────────────────────────
export function useDashboardStats() {
  return useQuery({ queryKey: adminKeys.dashboard, queryFn: adminApi.getDashboardStats });
}

// ── Leads ────────────────────────────────────────────────────
export function useLeads(params: PageParams & {
  status?: string;
  assignedToUserId?: string | null;
  unassignedOnly?: boolean;
}) {
  return useQuery({
    queryKey: adminKeys.leads(params),
    queryFn: () => adminApi.listLeads(params),
    placeholderData: (previous) => previous,
  });
}

export function useLead(id: string | undefined) {
  return useQuery({
    queryKey: adminKeys.lead(id ?? ''),
    queryFn: () => adminApi.getLead(id as string),
    enabled: Boolean(id),
  });
}

export function useUpdateLeadStatus(id: string) {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (body: UpdateLeadStatusRequest) => adminApi.updateLeadStatus(id, body),
    onSuccess: () => {
      invalidate(adminKeys.lead(id));
      invalidate(['admin', 'leads']);
      invalidate(adminKeys.dashboard);
    },
  });
}

export function useAssignLead(id: string) {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (body: AssignLeadRequest) => adminApi.assignLead(id, body),
    onSuccess: () => invalidate(adminKeys.lead(id)),
  });
}

export function useUpdateLeadNotes(id: string) {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (body: UpdateLeadNotesRequest) => adminApi.updateLeadNotes(id, body),
    onSuccess: () => invalidate(adminKeys.lead(id)),
  });
}

export function useDeleteLead() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (id: string) => adminApi.deleteLead(id),
    onSuccess: () => invalidate(['admin', 'leads']),
  });
}

// ── Propuestas ───────────────────────────────────────────────
export function useProposals(params: PageParams & { leadId?: string | null; status?: string }) {
  return useQuery({
    queryKey: adminKeys.proposals(params),
    queryFn: () => adminApi.listProposals(params),
    placeholderData: (previous) => previous,
  });
}

export function useProposal(id: string | undefined) {
  return useQuery({
    queryKey: adminKeys.proposal(id ?? ''),
    queryFn: () => adminApi.getProposal(id as string),
    enabled: Boolean(id),
  });
}

export function useSaveProposal(id?: string) {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (body: Parameters<typeof adminApi.createProposal>[0]) =>
      id ? adminApi.updateProposal(id, body) : adminApi.createProposal(body),
    onSuccess: (proposal) => {
      invalidate(['admin', 'proposals']);
      invalidate(adminKeys.proposal(proposal.id));
    },
  });
}

export function useUpdateProposalStatus(id: string) {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (body: { status: string; reason?: string | null }) =>
      adminApi.updateProposalStatus(id, body),
    onSuccess: () => {
      invalidate(adminKeys.proposal(id));
      invalidate(['admin', 'proposals']);
    },
  });
}

export function useDeleteProposal() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (id: string) => adminApi.deleteProposal(id),
    onSuccess: () => invalidate(['admin', 'proposals']),
  });
}

// ── Conversaciones ───────────────────────────────────────────
export function useConversations(params: PageParams & {
  status?: string;
  assignedToUserId?: string | null;
  minSeverity?: string;
}) {
  return useQuery({
    queryKey: adminKeys.conversations(params),
    queryFn: () => adminApi.listConversations(params),
    placeholderData: (previous) => previous,
  });
}

export function useConversation(id: string | undefined, poll = false) {
  return useQuery({
    queryKey: adminKeys.conversation(id ?? ''),
    queryFn: () => adminApi.getConversation(id as string),
    enabled: Boolean(id),
    refetchInterval: poll ? 10_000 : false,
  });
}

export function useSendMessage(id: string) {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (body: SendMessageRequest) => adminApi.sendMessage(id, body),
    onSuccess: () => invalidate(adminKeys.conversation(id)),
  });
}

export function useAssignConversation(id: string) {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (body: AssignConversationRequest) => adminApi.assignConversation(id, body),
    onSuccess: () => invalidate(adminKeys.conversation(id)),
  });
}

export function useCloseConversation(id: string) {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (body: CloseConversationRequest) => adminApi.closeConversation(id, body),
    onSuccess: () => {
      invalidate(adminKeys.conversation(id));
      invalidate(['admin', 'conversations']);
    },
  });
}

export function useCreateEscalation(id: string) {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (body: CreateEscalationRequest) => adminApi.createEscalation(id, body),
    onSuccess: () => invalidate(adminKeys.conversation(id)),
  });
}

export function useUpdateEscalationStatus(conversationId: string) {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateEscalationStatusRequest }) =>
      adminApi.updateEscalationStatus(id, body),
    onSuccess: () => invalidate(adminKeys.conversation(conversationId)),
  });
}

// ── Usuarios ─────────────────────────────────────────────────
export function useUsers(params: PageParams & { activeOnly?: boolean }) {
  return useQuery({
    queryKey: adminKeys.users(params),
    queryFn: () => adminApi.listUsers(params),
    placeholderData: (previous) => previous,
  });
}

export function useUser(id: string | undefined) {
  return useQuery({
    queryKey: ['admin', 'users', 'detail', id ?? ''] as const,
    queryFn: () => adminApi.getUser(id as string),
    enabled: Boolean(id),
  });
}

export function useRoles() {
  return useQuery({ queryKey: adminKeys.roles, queryFn: adminApi.listRoles });
}

export function useCreateUser() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (body: CreateUserRequest) => adminApi.createUser(body),
    onSuccess: () => invalidate(['admin', 'users']),
  });
}

export function useUpdateUser() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateUserRequest }) =>
      adminApi.updateUser(id, body),
    onSuccess: () => invalidate(['admin', 'users']),
  });
}

export function useAssignRoles() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: AssignRolesRequest }) =>
      adminApi.assignRoles(id, body),
    onSuccess: () => invalidate(['admin', 'users']),
  });
}

export function useUnlockUser() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (id: string) => adminApi.unlockUser(id),
    onSuccess: () => invalidate(['admin', 'users']),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: ResetPasswordRequest }) =>
      adminApi.resetPassword(id, body),
  });
}

export function useDeactivateUser() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (id: string) => adminApi.deactivateUser(id),
    onSuccess: () => invalidate(['admin', 'users']),
  });
}

// ── Servicios ────────────────────────────────────────────────
export function useAdminServices(params: PageParams & { status?: string }) {
  return useQuery({
    queryKey: adminKeys.services(params),
    queryFn: () => adminApi.listServices(params),
    placeholderData: (previous) => previous,
  });
}

export function useAdminService(id: string | undefined) {
  return useQuery({
    queryKey: adminKeys.service(id ?? ''),
    queryFn: () => adminApi.getService(id as string),
    enabled: Boolean(id),
  });
}

export function useSaveService(id?: string) {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (body: SaveServiceItemRequest) =>
      id ? adminApi.updateService(id, body) : adminApi.createService(body),
    onSuccess: () => {
      invalidate(['admin', 'services']);
      invalidate(['content', 'services']);
    },
  });
}

export function useDeleteService() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (id: string) => adminApi.deleteService(id),
    onSuccess: () => invalidate(['admin', 'services']),
  });
}

// ── Portafolio ───────────────────────────────────────────────
export function useAdminProjects(params: PageParams & { status?: string; featuredOnly?: boolean }) {
  return useQuery({
    queryKey: adminKeys.projects(params),
    queryFn: () => adminApi.listProjects(params),
    placeholderData: (previous) => previous,
  });
}

export function useAdminProject(id: string | undefined) {
  return useQuery({
    queryKey: adminKeys.project(id ?? ''),
    queryFn: () => adminApi.getProject(id as string),
    enabled: Boolean(id),
  });
}

export function useSaveProject(id?: string) {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (body: SavePortfolioProjectRequest) =>
      id ? adminApi.updateProject(id, body) : adminApi.createProject(body),
    onSuccess: () => {
      invalidate(['admin', 'portfolio']);
      invalidate(['content', 'portfolio']);
    },
  });
}

export function useDeleteProject() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (id: string) => adminApi.deleteProject(id),
    onSuccess: () => invalidate(['admin', 'portfolio']),
  });
}

// ── Blog ─────────────────────────────────────────────────────
export function useAdminPosts(params: PageParams & { status?: string }) {
  return useQuery({
    queryKey: adminKeys.posts(params),
    queryFn: () => adminApi.listPosts(params),
    placeholderData: (previous) => previous,
  });
}

export function useAdminPost(id: string | undefined) {
  return useQuery({
    queryKey: adminKeys.post(id ?? ''),
    queryFn: () => adminApi.getPost(id as string),
    enabled: Boolean(id),
  });
}

export function useSavePost(id?: string) {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (body: SaveBlogPostRequest) =>
      id ? adminApi.updatePost(id, body) : adminApi.createPost(body),
    onSuccess: () => {
      invalidate(['admin', 'blog']);
      invalidate(['content', 'blog']);
    },
  });
}

export function useDeletePost() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (id: string) => adminApi.deletePost(id),
    onSuccess: () => invalidate(['admin', 'blog']),
  });
}

export function useAdminTags() {
  return useQuery({ queryKey: adminKeys.tags, queryFn: adminApi.listTags });
}

export function useSaveTag() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: ({ id, body }: { id?: string; body: SaveTagRequest }) =>
      id ? adminApi.updateTag(id, body) : adminApi.createTag(body),
    onSuccess: () => invalidate(adminKeys.tags),
  });
}

export function useDeleteTag() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (id: string) => adminApi.deleteTag(id),
    onSuccess: () => invalidate(adminKeys.tags),
  });
}

// ── Páginas ──────────────────────────────────────────────────
export function useAdminPages(params: PageParams & { status?: string }) {
  return useQuery({
    queryKey: adminKeys.pages(params),
    queryFn: () => adminApi.listPages(params),
    placeholderData: (previous) => previous,
  });
}

export function useAdminPage(id: string | undefined) {
  return useQuery({
    queryKey: adminKeys.page(id ?? ''),
    queryFn: () => adminApi.getPage(id as string),
    enabled: Boolean(id),
  });
}

export function usePageNavigation() {
  return useQuery({ queryKey: adminKeys.pageNav, queryFn: adminApi.getPageNavigation });
}

export function useSavePage(id?: string) {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (body: SavePageRequest) =>
      id ? adminApi.updatePage(id, body) : adminApi.createPage(body),
    onSuccess: () => {
      invalidate(['admin', 'pages']);
      invalidate(['content', 'pages']);
    },
  });
}

export function useDeletePage() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (id: string) => adminApi.deletePage(id),
    onSuccess: () => invalidate(['admin', 'pages']),
  });
}

// ── Configuración ────────────────────────────────────────────
export function useAdminSettings() {
  return useQuery({ queryKey: adminKeys.settings, queryFn: adminApi.getSettings });
}

export function useUpdateSettings() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (body: UpdateSiteSettingsRequest) => adminApi.updateSettings(body),
    onSuccess: () => {
      invalidate(adminKeys.settings);
      invalidate(['content', 'settings']);
    },
  });
}
