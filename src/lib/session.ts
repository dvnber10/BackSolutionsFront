/**
 * Almacenamiento de la sesión del panel.
 *
 * Decisión de seguridad: el access token vive **solo en memoria** (nunca en
 * localStorage/sessionStorage), así que un XSS no puede leerlo de un storage.
 * El refresh token sí tiene que sobrevivir a un reload para no obligar a loguearse
 * de nuevo, pero se guarda en `sessionStorage` y no en `localStorage`: vive por
 * pestaña y desaparece al cerrarla, reduciendo la ventana de exposición.
 *
 * La opción máxima sería que el refresh token viaje en una cookie httpOnly que el
 * front nunca toca; requiere un cambio en el backend (set/clear cookie + CORS con
 * credenciales) y queda anotado como deuda.
 */

const REFRESH_KEY = 'backsolutions:refresh';

let accessToken: string | null = null;

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

export function getRefreshToken(): string | null {
  return sessionStorage.getItem(REFRESH_KEY);
}

export function setRefreshToken(token: string | null): void {
  if (token) {
    sessionStorage.setItem(REFRESH_KEY, token);
  } else {
    sessionStorage.removeItem(REFRESH_KEY);
  }
}

export function clearSession(): void {
  accessToken = null;
  sessionStorage.removeItem(REFRESH_KEY);
}
