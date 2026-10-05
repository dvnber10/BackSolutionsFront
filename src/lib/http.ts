import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { getAccessToken } from './session';

const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api';

/**
 * Error normalizado de la API. El backend responde con ProblemDetails (RFC 7807),
 * así que acá se extrae el mensaje legible y, si es validación, los errores por campo.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly fieldErrors: Record<string, string[]>;

  constructor(status: number, message: string, fieldErrors: Record<string, string[]> = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fieldErrors = fieldErrors;
  }

  get isUnauthorized() {
    return this.status === 401;
  }

  get isForbidden() {
    return this.status === 403;
  }

  get isNotFound() {
    return this.status === 404;
  }
}

type ProblemDetails = {
  title?: string;
  detail?: string;
  message?: string;
  errors?: Record<string, string[]>;
};

/** Convierte cualquier error (Axios u otro) en un {@link ApiError} presentable. */
export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (axios.isAxiosError<ProblemDetails>(error)) {
    const status = error.response?.status ?? 0;
    const problem = error.response?.data;

    if (status === 0) {
      return new ApiError(0, 'No pudimos conectar con el servidor. Revisá tu conexión.');
    }

    const message =
      problem?.detail ??
      problem?.message ??
      problem?.title ??
      (status >= 500
        ? 'Algo falló de nuestro lado. Probá de nuevo en un momento.'
        : error.message);

    return new ApiError(status, message, problem?.errors ?? {});
  }

  if (error instanceof Error) {
    return new ApiError(0, error.message);
  }

  return new ApiError(0, 'Ocurrió un error inesperado.');
}

export const http: AxiosInstance = axios.create({
  baseURL,
  headers: { Accept: 'application/json' },
  timeout: 20_000,
});

// ── Sesión: el panel admin registra acá su refresco de token y su salida por 401 ──
let onUnauthorized: (() => void) | null = null;
let onRefresh: (() => Promise<boolean>) | null = null;
let refreshPromise: Promise<boolean> | null = null;

export function setUnauthorizedHandler(handler: (() => void) | null) {
  onUnauthorized = handler;
}

export function setRefreshHandler(handler: (() => Promise<boolean>) | null) {
  onRefresh = handler;
}

http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

type RetriableConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
  skipAuthRefresh?: boolean;
};

http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ProblemDetails>) => {
    const config = error.config as RetriableConfig | undefined;
    const status = error.response?.status;

    // Un solo refresco por request: si el token sigue vencido tras renovar, no se
    // vuelve a intentar. Las peticiones que fallan a la vez comparten la misma
    // promesa para no disparar N refrescos en paralelo.
    if (status === 401 && config && !config._retry && !config.skipAuthRefresh && onRefresh) {
      config._retry = true;
      refreshPromise ??= onRefresh().finally(() => {
        refreshPromise = null;
      });

      const refreshed = await refreshPromise;
      const token = getAccessToken();

      if (refreshed && token) {
        config.headers.Authorization = `Bearer ${token}`;
        return http.request(config);
      }
    }

    const apiError = toApiError(error);

    if (apiError.isUnauthorized) {
      onUnauthorized?.();
    }

    return Promise.reject(apiError);
  },
);

/** Extrae un mensaje presentable de cualquier valor lanzado. */
export function errorMessage(error: unknown): string {
  return toApiError(error).message;
}
