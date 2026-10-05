import axios from 'axios';
import { http, toApiError } from '../../lib/http';
import type { TokenResponse, UserProfile } from './types';

const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api';

/**
 * Cliente sin interceptores para login, refresh y logout. Si estas llamadas fallan no
 * tiene sentido intentar renovar la sesión ni reintentar, así que se evita el ciclo.
 */
const bare = axios.create({
  baseURL,
  headers: { Accept: 'application/json' },
  timeout: 20_000,
});

async function unwrap<T>(promise: Promise<{ data: T }>): Promise<T> {
  try {
    return (await promise).data;
  } catch (error) {
    throw toApiError(error);
  }
}

export const authApi = {
  login(email: string, password: string): Promise<TokenResponse> {
    return unwrap(bare.post<TokenResponse>('/auth/login', { email, password }));
  },

  refresh(refreshToken: string): Promise<TokenResponse> {
    return unwrap(bare.post<TokenResponse>('/auth/refresh', { refreshToken }));
  },

  async logout(refreshToken: string): Promise<void> {
    await unwrap(bare.post('/auth/logout', { refreshToken }));
  },

  async me(): Promise<UserProfile> {
    return unwrap(http.get<UserProfile>('/auth/me'));
  },
};
