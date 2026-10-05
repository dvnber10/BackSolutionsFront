import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { chatApi } from './api';
import type { SendChatMessageRequest, StartConversationRequest } from './types';

export const chatKeys = {
  conversation: (publicToken: string) => ['chat', 'conversation', publicToken] as const,
};

/**
 * Historial del hilo del visitante.
 *
 * `live` activa el polling como respaldo del WebSocket: el Hub es lo que trae la
 * respuesta del equipo al instante, pero si la conexión se cae (proxy, red móvil) el
 * visitante igual tiene que ver la respuesta sin recargar a mano.
 */
export function usePublicConversation(publicToken: string | undefined, live: boolean) {
  return useQuery({
    queryKey: chatKeys.conversation(publicToken ?? ''),
    queryFn: () => chatApi.history(publicToken as string),
    enabled: Boolean(publicToken),
    refetchInterval: live ? 10_000 : false,
    retry: (failureCount, error) => {
      // Un 404 significa que el token ya no existe (conversación borrada o storage viejo):
      // reintentar no lo arregla y hay que volver a empezar el hilo.
      const status = (error as { response?: { status?: number } })?.response?.status;
      if (status === 404 || status === 410) {
        return false;
      }
      return failureCount < 2;
    },
  });
}

/**
 * No escribe nada en la caché a propósito: quien abre el hilo guarda el token, eso
 * habilita `usePublicConversation` y el historial real se lee del servidor.
 */
export function useStartConversation() {
  return useMutation({
    mutationFn: (body: StartConversationRequest) => chatApi.start(body),
  });
}

export function useSendChatMessage(publicToken: string | undefined) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (body: SendChatMessageRequest) => chatApi.send(publicToken as string, body),
    onSuccess: () => {
      // El servidor es la fuente: se relee el hilo en vez de parchearlo en el cliente,
      // así el visitante nunca ve un mensaje que el backend no guardó.
      if (publicToken) {
        void client.invalidateQueries({ queryKey: chatKeys.conversation(publicToken) });
      }
    },
  });
}