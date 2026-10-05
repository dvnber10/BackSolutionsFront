import { http } from '../../lib/http';
import type {
  ChatMessage,
  ConversationStarted,
  PublicConversation,
  SendChatMessageRequest,
  StartConversationRequest,
} from './types';

function apiBase(): string {
  return (import.meta.env.VITE_API_URL as string | undefined) ?? '/api';
}

async function get<T>(url: string): Promise<T> {
  const { data } = await http.get<T>(url);
  return data;
}

async function post<T>(url: string, body: unknown): Promise<T> {
  const { data } = await http.post<T>(url, body);
  return data;
}

export const chatApi = {
  /** Abre el hilo con el primer mensaje y devuelve el token con el que se sigue. */
  start: (body: StartConversationRequest) =>
    post<ConversationStarted>('/public/conversations', body),

  /** Historial ya filtrado: el que se usa al reabrir la pestaña. */
  history: (publicToken: string) => get<PublicConversation>(`/public/conversations/${publicToken}`),

  send: (publicToken: string, body: SendChatMessageRequest) =>
    post<ChatMessage>(`/public/conversations/${publicToken}/messages`, body),

  /** El adjunto se baja por URL porque es un `FileContentResult`, no un JSON. */
  attachmentUrl: (publicToken: string, messageId: string) =>
    `${apiBase()}/public/conversations/${publicToken}/attachments/${messageId}`,
};