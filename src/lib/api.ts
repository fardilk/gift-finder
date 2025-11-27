import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

const { VITE_API_URL, VITE_API_BASE_URL } = import.meta.env as unknown as {
  VITE_API_URL?: string;
  VITE_API_BASE_URL?: string;
};

const API_BASE =
  VITE_API_URL ||
  VITE_API_BASE_URL ||
  (import.meta.env.DEV ? '' : 'http://localhost:3000');
const TOKEN_KEY = 'auth_token';
const REFRESH_KEY = 'refresh_token';

function setAuthHeader(config: InternalAxiosRequestConfig, token: string | null) {
  // Use a narrow indexable type without 'any'
  type H = { [key: string]: unknown };
  const h: H = (config.headers as H) ?? {};
  if (token) h['Authorization'] = `Bearer ${token}`;
  else delete h['Authorization'];
  config.headers = h as unknown as InternalAxiosRequestConfig['headers'];
}

function setAccessTokenCookie(token: string | null) {
  // Dev default: SameSite=Lax; not Secure; Path=/
  if (token) {
    document.cookie = `access_token=${token}; Path=/; SameSite=Lax`;
  } else {
    // expire the cookie
    document.cookie = 'access_token=; Path=/; Max-Age=0; SameSite=Lax';
  }
}

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem(TOKEN_KEY);
  setAuthHeader(config, token);
  return config;
});

let refreshing: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const storedRefresh = localStorage.getItem(REFRESH_KEY);
  try {
    const resp = await api.post<{ accessToken?: string; refreshToken?: string }>(
      '/auth/refresh'
    );
   
    const newAccess = typeof resp.data?.accessToken === 'string' ? resp.data.accessToken : '';
    const newRefresh = resp.data?.refreshToken ?? null;
    if (newAccess) {
      localStorage.setItem(TOKEN_KEY, newAccess);
      setAccessTokenCookie(newAccess);
    }
    if (newRefresh) localStorage.setItem(REFRESH_KEY, newRefresh);
    // Return empty string to indicate success via cookies even if no access token provided
    return newAccess;
  } catch (cookieRefreshErr) {
    if (!storedRefresh) {
      // No stored refresh token, cannot proceed further
      localStorage.removeItem(TOKEN_KEY);
      setAccessTokenCookie(null);
      return null;
    }
    try {
      const resp2 = await api.post<{ accessToken?: string; refreshToken?: string }>(
        '/auth/refresh',
        { refreshToken: storedRefresh }
      );
      const newAccess2 = typeof resp2.data?.accessToken === 'string' ? resp2.data.accessToken : '';
      const newRefresh2 = resp2.data?.refreshToken ?? null;
      if (newAccess2) {
        localStorage.setItem(TOKEN_KEY, newAccess2);
        setAccessTokenCookie(newAccess2);
      }
      if (newRefresh2) localStorage.setItem(REFRESH_KEY, newRefresh2);
      return newAccess2;
    } catch (e) {

      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_KEY);
      setAccessTokenCookie(null);
      return null;
    }
  }
}

api.interceptors.response.use(
  (res: AxiosResponse) => res,
  async (err: unknown) => {
    const axiosErr = err as AxiosError & { config?: InternalAxiosRequestConfig & { _retry?: boolean } };
    const status = axiosErr?.response?.status;
    const original = (axiosErr.config || {}) as InternalAxiosRequestConfig & { _retry?: boolean };
    // Avoid attempting to refresh while already calling the refresh endpoint
    if (original?.url && original.url.includes('/auth/refresh')) {
      return Promise.reject(axiosErr);
    }
    if (status === 401 && !original._retry) {
      original._retry = true;
      try {
        if (!refreshing) refreshing = refreshAccessToken();
        const newToken = await refreshing;
        refreshing = null;
        // Retry if refresh succeeded (non-null). When using cookie-only refresh, newToken may be an empty string.
        if (newToken !== null) {
          // retry the original request with updated header
          setAuthHeader(original, newToken);
          return api(original);
        }
      } catch {
        // fallthrough to reject
      }
    }
    return Promise.reject(axiosErr);
  }
);

// Utility for other modules to set tokens and cookie at login/logout
export function setAuthTokens(accessToken: string | null, refreshToken?: string | null) {
  if (accessToken) localStorage.setItem(TOKEN_KEY, accessToken);
  else localStorage.removeItem(TOKEN_KEY);
  if (typeof refreshToken !== 'undefined') {
    if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
    else localStorage.removeItem(REFRESH_KEY);
  }
  setAccessTokenCookie(accessToken);
}

export default api;
