import api from 'src/lib/api';

export type Access = { id: string; name: string };
export type User = {
  id: string;
  email: string;
  name?: string;
  accesses?: Access[];
};

export type LoginInput = { email: string; password: string };
export type LoginResponse = {
  user: User;
  accessToken?: string;
  refreshToken?: string;
};

/**
 * Login API with fallback:
 * 1. Try POST /login
 * 2. If 404/405 → fallback to POST /auth/login
 */
export async function loginApi({
  email,
  password,
}: LoginInput): Promise<LoginResponse> {
  try {
    const res = await api.post<LoginResponse>(
      '/login',
      { email, password },
      { withCredentials: true }
    );
    return res.data;
  } catch (err: unknown) {
    const status =
      typeof err === 'object' &&
      err !== null &&
      'response' in err &&
      typeof (err as { response?: { status?: number } }).response?.status ===
        'number'
        ? (err as { response?: { status?: number } }).response?.status
        : undefined;

    if (status === 404 || status === 405) {
      const res2 = await api.post<LoginResponse>(
        '/auth/login',
        { email, password },
        { withCredentials: true }
      );
      return res2.data;
    }

    throw err;
  }
}

/**
 * /auth/me → backend bisa return:
 * { user: User }   atau   User langsung
 */
export type MeResponse = { user: User };

export async function meApi(): Promise<MeResponse> {
  const res = await api.get('/auth/me');
  const raw = res.data;

  if (
    raw &&
    typeof raw === 'object' &&
    'user' in raw &&
    (raw as { user: unknown }).user &&
    typeof (raw as { user: unknown }).user === 'object'
  ) {
    return { user: (raw as { user: User }).user };
  }

  return { user: raw as User };
}

/**
 * Backend-driven dynamic menu
 */
export type MenuEntry = {
  id?: string;
  key?: string;
  title?: string;
  name?: string;
  url?: string;
  to?: string;
  icon?: string;
  parentId?: string | null;
  children?: MenuEntry[];
};

export async function getMenuApi(): Promise<MenuEntry[]> {
  const res = await api.get<MenuEntry[]>('/menu');
  return res.data;
}
