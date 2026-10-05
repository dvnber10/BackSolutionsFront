import { useCallback, useEffect, useMemo, useState } from 'react';
import { setRefreshHandler, setUnauthorizedHandler } from '../../lib/http';
import { clearSession, getRefreshToken, setAccessToken, setRefreshToken } from '../../lib/session';
import { authApi } from './api';
import { AuthContext, type AuthStatus } from './context';
import type { TokenResponse, UserProfile } from './types';

function applyTokens(tokens: TokenResponse) {
  setAccessToken(tokens.accessToken);
  setRefreshToken(tokens.refreshToken);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');

  const endSession = useCallback(() => {
    clearSession();
    setUser(null);
    setStatus('anonymous');
  }, []);

  const refresh = useCallback(async (): Promise<boolean> => {
    const token = getRefreshToken();

    if (!token) {
      return false;
    }

    try {
      const tokens = await authApi.refresh(token);
      applyTokens(tokens);
      setUser(tokens.user);
      setStatus('authenticated');
      return true;
    } catch {
      endSession();
      return false;
    }
  }, [endSession]);

  // El refresco y la salida por 401 se registran en el cliente HTTP global.
  useEffect(() => {
    setRefreshHandler(refresh);
    setUnauthorizedHandler(endSession);

    return () => {
      setRefreshHandler(null);
      setUnauthorizedHandler(null);
    };
  }, [refresh, endSession]);

  // Al montar: con refresh token guardado se intenta restaurar la sesión.
  useEffect(() => {
    if (!getRefreshToken()) {
      setStatus('anonymous');
      return;
    }

    void refresh();
  }, [refresh]);

  const login = useCallback(async (email: string, password: string) => {
    const tokens = await authApi.login(email, password);
    applyTokens(tokens);
    setUser(tokens.user);
    setStatus('authenticated');
  }, []);

  const logout = useCallback(async () => {
    const token = getRefreshToken();
    endSession();

    if (token) {
      try {
        await authApi.logout(token);
      } catch {
        // El cierre local ya ocurrió; si el servidor no responde, la sesión igual terminó.
      }
    }
  }, [endSession]);

  const value = useMemo(
    () => ({ status, user, login, logout }),
    [status, user, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
