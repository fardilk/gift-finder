import React from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { getMenuApi, type MenuEntry } from 'src/auth/api';
import { useAuth } from 'src/auth/context/app-auth/AuthProvider';

const MENU_CACHE_KEY = 'menu_cache_v1';

export function useMenu() {
  const { isAuthenticated, token, user } = useAuth();

  const cached: MenuEntry[] | undefined = React.useMemo(() => {
    try {
      const raw = localStorage.getItem(MENU_CACHE_KEY);
      return raw ? (JSON.parse(raw) as MenuEntry[]) : undefined;
    } catch {
      return undefined;
    }
  }, []);

  const query = useQuery({
    queryKey: ['menu'],
    queryFn: async () => {
      const data = await getMenuApi();
      try {
        localStorage.setItem(MENU_CACHE_KEY, JSON.stringify(data));
      } catch {
        // ignore storage errors
      }
      return data;
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 3,
    placeholderData: cached,
    initialData: cached,
    // Defer until we have either a token or a hydrated user to avoid early 401s on refresh
    enabled: isAuthenticated && (!!token || !!user),
  }) as UseQueryResult<MenuEntry[], Error>;

  React.useEffect(() => {
    if (query.data) {
      // eslint-disable-next-line no-console
      console.log('GET /menu response (useMenu):', query.data);
    }
  }, [query.data]);

  return query;
}

export default useMenu;
