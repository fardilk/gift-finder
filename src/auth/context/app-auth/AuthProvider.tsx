import * as React from 'react';
import { loginApi, meApi, type User } from 'src/auth/api';
import { setAuthTokens } from 'src/lib/api';
import { useQueryClient } from '@tanstack/react-query';

type AuthContextValue = {
  isAuthenticated: boolean;
  isGuest: boolean;
  token: string | null;
  user: User | null;
  login: (email: string, password: string) => Promise<void> | void;
  loginGuest: () => void;
  logout: () => void;
};

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = 'auth_token';
const REFRESH_KEY = 'refresh_token';
const GUEST_KEY = 'guest_mode';
const AUTH_FLAG = 'auth_authenticated';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = React.useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [isGuest, setIsGuest] = React.useState<boolean>(() => localStorage.getItem(GUEST_KEY) === '1');
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(() =>
    !!localStorage.getItem(TOKEN_KEY) || localStorage.getItem(AUTH_FLAG) === '1'
  );
  const [user, setUser] = React.useState<User | null>(null);
  const queryClient = useQueryClient();

  const login = React.useCallback(async (email: string, password: string) => {
    const res = await loginApi({ email, password });
    if (res?.accessToken) {
      setAuthTokens(res.accessToken, res.refreshToken ?? null);
      setToken(res.accessToken);
      localStorage.setItem(TOKEN_KEY, res.accessToken);
    }
    if (res?.refreshToken) {
      localStorage.setItem(REFRESH_KEY, res.refreshToken);
    }
    localStorage.setItem(AUTH_FLAG, '1');
    localStorage.removeItem(GUEST_KEY);
    setIsAuthenticated(true);
    setIsGuest(false);
    if (res?.user) {
      setUser(res.user);
      // eslint-disable-next-line no-console
      console.log('login: received user:', res.user);
      // eslint-disable-next-line no-console
      console.log('login: user.accesses:', res.user.accesses);
    }
    // refresh dependent queries
    queryClient.invalidateQueries({ queryKey: ['menu'] });
  }, []);

  // Keep localStorage in sync with `token` state so refresh preserves it
  React.useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [token]);

  const loginGuest = React.useCallback(() => {
    localStorage.setItem(GUEST_KEY, '1');
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(AUTH_FLAG);
    setIsGuest(true);
    setIsAuthenticated(false);
    setToken(null);
  }, []);

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
  }, []);

  // Persist auth state - restore from localStorage on mount
  React.useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedAuthFlag = localStorage.getItem(AUTH_FLAG);
    
    if (storedToken || storedAuthFlag === '1') {
      setIsAuthenticated(true);
      if (storedToken) {
        setToken(storedToken);
        setAuthTokens(storedToken, localStorage.getItem(REFRESH_KEY));
      }
    }
  }, []);

  // Hydrate user from /auth/me when authenticated (e.g., cookie sessions)
  React.useEffect(() => {
    let cancelled = false;
    async function hydrate() {
      if (isAuthenticated && !user) {
        try {
          const { user: me } = await meApi();
          if (!cancelled) {
            setUser(me);
            // eslint-disable-next-line no-console
            console.log('hydrate: /auth/me returned user:', me);
            // eslint-disable-next-line no-console
            console.log('hydrate: user.accesses:', me.accesses);
          }
        } catch (e) {
          // If session invalid, clear auth flag
          if (!cancelled) logout();
        }
      }
    }
    hydrate();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, user, logout]);

  const value: AuthContextValue = React.useMemo(
    () => ({ isAuthenticated, isGuest, token, user, login, loginGuest, logout }),
    [isAuthenticated, isGuest, token, user, login, loginGuest, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
