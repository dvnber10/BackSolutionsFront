/**
 * Tipos del chat público.
 *
 * Espejo de `BackSolutions.Core.Dtos.Chat/ChatDtos.cs`. `ChatMessage` es el mismo
 * `MessageDto` que ve el panel: el filtro de las notas internas no lo hace el endpoint
 * público, lo hace `IChatService` al armar el historial, así que acá nunca llega una
 * nota interna aunque se pida el hilo completo.
 */

export type ConversationStatus = 'open' | 'awaitingClient' | 'awaitingTeam' | 'closed';

export type ChatMessage = {
  id: string;
  senderType: 'client' | 'team' | 'system';
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

export type ConversationStarted = {
  id: string;
  publicToken: string;
  status: ConversationStatus;
  createdAtUtc: string;
  firstMessage: ChatMessage;
};

export type PublicConversation = {
  id: string;
  publicToken: string;
  subject: string;
  status: ConversationStatus;
  createdAtUtc: string;
  lastMessageAtUtc: string | null;
  closeReason: string | null;
  messages: ChatMessage[];
};

/**
 * Alta del hilo. El backend exige `subject` (≤200), `message` (≤4000), `name` y `email`
 * con formato válido; el adjunto solo se puede mandar acá, con el primer mensaje.
 */
export type StartConversationRequest = {
  subject: string;
  message: string;
  name: string;
  email: string;
  phone?: string | null;
  leadId?: string | null;
  serviceId?: string | null;
  attachmentName?: string | null;
  attachmentContentType?: string | null;
  attachmentBase64?: string | null;
};

/** El `SendMessageRequest` público solo lleva el cuerpo: `isInternal` no se acepta. */
export type SendChatMessageRequest = { body: string };

export const conversationStatusLabels: Record<ConversationStatus, string> = {
  open: 'Abierta',
  awaitingClient: 'Esperando tu respuesta',
  awaitingTeam: 'Esperando al equipo',
  closed: 'Cerrada',
};

/** El mismo límite que aplica el backend; avisar antes de mandar es mejor que un 400. */
export const MAX_MESSAGE_LENGTH = 4000;
export const MAX_SUBJECT_LENGTH = 200;
export const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024;