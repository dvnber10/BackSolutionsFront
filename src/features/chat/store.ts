/**
 * Persistencia del chat del visitante.
 *
 * El visitante no tiene cuenta: la única credencial que tiene es el `publicToken` que le
 * devuelve el backend al abrir el hilo, y con él puede leer y escribir en esa
 * conversación. Guardarlo es lo que permite retomar la consulta al día siguiente.
 *
 * Va en `localStorage` y no en `sessionStorage` a propósito: si fuera por sesión, cerrar
 * la pestaña perdería el hilo, que es justamente el caso de uso (preguntar hoy, seguir
 * mañana). El riesgo —que alguien en un navegador compartido abra el hilo— es el mismo
 * que ya asumimos en la página de seguimiento del lead (`/consulta/:token`), y el hilo
 * no tiene datos sensibles: nombre, email y lo que el visitante cuenta de su proyecto.
 *
 * `openChatWidget()` permite que otra pantalla (formulario de contacto, detalle de
 * servicio) abra el widget sin pasarse el estado por props ni por contexto.
 */

const KEY = 'backsolutions:chat';
export const OPEN_EVENT = 'backsolutions:open-chat';

export type SavedChat = {
  publicToken: string;
  name: string;
  email: string;
  /** Último instante leído por el visitante; sirve para el aviso de respuesta nueva. */
  lastReadAtUtc: string | null;
};

export function readChat(): SavedChat | null {
  const raw = localStorage.getItem(KEY);

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as SavedChat;
    return typeof parsed.publicToken === 'string' ? parsed : null;
  } catch {
    // Storage corrupto o de otra versión: se descarta y se empieza de nuevo.
    localStorage.removeItem(KEY);
    return null;
  }
}

export function saveChat(chat: SavedChat): void {
  localStorage.setItem(KEY, JSON.stringify(chat));
}

export function clearChat(): void {
  localStorage.removeItem(KEY);
}

export function markChatRead(atUtc: string): void {
  const current = readChat();
  if (current) {
    saveChat({ ...current, lastReadAtUtc: atUtc });
  }
}

export function openChatWidget(): void {
  window.dispatchEvent(new CustomEvent(OPEN_EVENT));
}