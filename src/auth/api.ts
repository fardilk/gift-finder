import api from 'src/lib/api';

export type Access = { id: string; name: string };
export type User = { id: string; email: string; name?: string; accesses?: Access[] };

export type LoginInput = { email: string; password: string };
export type LoginResponse = {
  user: User;
  accessToken?: string;
  refreshToken?: string;
};

// Try /login first (alias). If not available, fall back to /auth/login
export async function loginApi({ email, password }: LoginInput): Promise<LoginResponse> {
  try {
  const res = await api.post<LoginResponse>('/login', { email, password }, { withCredentials: true });
    return res.data;
  } catch (err: unknown) {
    const anyErr = err as { response?: { status?: number } };
    const status = anyErr?.response?.status;
    if (status === 404 || status === 405) {
  const res2 = await api.post<LoginResponse>('/auth/login', { email, password }, { withCredentials: true });
      return res2.data;
    }
    throw err;
  }
}

export type MeResponse = { user: User };
export async function meApi(): Promise<MeResponse> {
  const res = await api.get('/auth/me');
  // Log the /auth/me response for debugging (browser console)
  // eslint-disable-next-line no-console
  console.log('GET /auth/me response data:', res.data);
  // Normalize response: backend may return { user } or the user object directly
  const dataObj = res.data as Record<string, unknown> | User | null;
  if (dataObj && typeof dataObj === 'object' && 'user' in dataObj) {
    return { user: (dataObj as { user: User }).user };
  }
  return { user: (dataObj as User) };
}

// Dynamic menu from backend
// Backend-driven menu: allow multiple key names to support different backends
export type MenuEntry = {
  id?: string;
  title?: string;
  name?: string;
  url?: string;
  to?: string;
  icon?: string;
  children?: MenuEntry[];
};

export async function getMenuApi(): Promise<MenuEntry[]> {
  const res = await api.get<MenuEntry[]>('/menu');
  // Log the response structure for debugging (browser console)
  // eslint-disable-next-line no-console
  console.log('GET /menu axios response data:', res.data);
  return res.data;
}
