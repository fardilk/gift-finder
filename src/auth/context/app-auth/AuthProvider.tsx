import * as React from 'react';
import { loginApi, meApi, type User } from 'src/auth/api';
import { setAuthTokens } from 'src/lib/api';
import { useQueryClient } from '@tanstack/react-query';

type AuthContextValue = {
  isAuthenticated: boolean;
  isGuest: boolean;
  token: string | null;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  loginGuest: () => void;
  logout: () => void;
};

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

// LocalStorage keys
const TOKEN_KEY = 'auth_token';
const REFRESH_KEY = 'refresh_token';
const GUEST_KEY = 'guest_mode';
const AUTH_FLAG = 'auth_authenticated';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  const [token, setToken] = React.useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY)
  );

  const [isGuest, setIsGuest] = React.useState<boolean>(() =>
    localStorage.getItem(GUEST_KEY) === '1'
  );

  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(() => {
    const hasToken = !!localStorage.getItem(TOKEN_KEY);
    const hasFlag = localStorage.getItem(AUTH_FLAG) === '1';
    return hasToken || hasFlag;
  });

  const [user, setUser] = React.useState<User | null>(null);

  /**
   * LOGIN
   */
  const login = React.useCallback(
    async (email: string, password: string) => {
      const res = await loginApi({ email, password });

      if (res.accessToken) {
        setAuthTokens(res.accessToken, res.refreshToken ?? null);
        localStorage.setItem(TOKEN_KEY, res.accessToken);
        setToken(res.accessToken);
      }

      if (res.refreshToken) {
        localStorage.setItem(REFRESH_KEY, res.refreshToken);
      }

      localStorage.setItem(AUTH_FLAG, '1');
      localStorage.removeItem(GUEST_KEY);

      setIsAuthenticated(true);
      setIsGuest(false);

      if (res.user) {
        setUser(res.user);
      }

      // refresh menus
      queryClient.invalidateQueries({ queryKey: ['menu'] });
    },
    [queryClient]
  );

  /**
   * KEEP TOKEN IN SYNC
   */
  React.useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [token]);

  /**
   * LOGIN GUEST
   */
  const loginGuest = React.useCallback(() => {
    localStorage.setItem(GUEST_KEY, '1');
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(AUTH_FLAG);

    setToken(null);
    setIsGuest(true);
    setIsAuthenticated(false);
  }, []);

  /**
   * LOGOUT
   */
  const logout = React.useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(GUEST_KEY);
    localStorage.removeItem(AUTH_FLAG);

    setAuthTokens(null, null);
    setToken(null);
    setIsGuest(false);
    setIsAuthenticated(false);
    setUser(null);

    queryClient.removeQueries({ queryKey: ['menu'] });
  }, [queryClient]);

  /**
   * RESTORE AUTH STATE ON MOUNT
   */
  React.useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedAuth = localStorage.getItem(AUTH_FLAG);

    if (storedToken || storedAuth === '1') {
      setIsAuthenticated(true);

      if (storedToken) {
        setToken(storedToken);
        const refresh = localStorage.getItem(REFRESH_KEY);
        setAuthTokens(storedToken, refresh);
      }
    }
  }, []);

  /**
   * HYDRATE USER FROM /auth/me
   */
  React.useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      if (isAuthenticated && !user) {
        try {
          const { user: me } = await meApi();
          if (!cancelled) setUser(me);
        } catch {
          if (!cancelled) logout();
        }
      }
    }

    hydrate();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, user, logout]);

  /**
   * CONTEXT VALUE
   */
  const value = React.useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
      isGuest,
      token,
      user,
      login,
      loginGuest,
      logout,
    }),
    [isAuthenticated, isGuest, token, user, login, loginGuest, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
