import React from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { getMenuApi, type MenuEntry } from 'src/auth/api';
import { useAuth } from 'src/auth/context/app-auth/AuthProvider';

const MENU_CACHE_KEY = 'menu_cache_v1';

export function useMenu(): UseQueryResult<MenuEntry[], Error> {
  const { isAuthenticated, token, user } = useAuth();

  // Read cached menu from localStorage safely
  const cached = React.useMemo<MenuEntry[] | undefined>(() => {
    try {
      const raw = localStorage.getItem(MENU_CACHE_KEY);
      return raw ? (JSON.parse(raw) as MenuEntry[]) : undefined;
    } catch {
      return undefined;
    }
  }, []);

  const query = useQuery<MenuEntry[], Error>({
    queryKey: ['menu'],
    queryFn: async () => {
      const data = await getMenuApi();

      // Cache menu
      try {
        localStorage.setItem(MENU_CACHE_KEY, JSON.stringify(data));
      } catch {
        /* ignore storage write errors */
      }

      return data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
    refetchOnWindowFocus: false,
    retry: 3,
    placeholderData: cached,
    initialData: cached,

    // Enable only if authenticated and token/user ready
    enabled: isAuthenticated && (token !== null || user !== null),
  });

  return query;
}

export default useMenu;
