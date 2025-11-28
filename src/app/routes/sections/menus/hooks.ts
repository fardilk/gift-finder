import { useQuery } from '@tanstack/react-query';
import { fetchMenusByAccessId, fetchMenuByKey, type MenuItem } from './api';

/**
 * Hook to fetch menus by access ID
 * Uses React Query for caching and automatic refetching
 */
export function useMenusByAccessId(accessId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ['menu', 'access', accessId],
    queryFn: () => fetchMenusByAccessId(accessId!),
    enabled: enabled && !!accessId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch a specific menu by key with its children
 * Example: useMenuByKey('abc123', 'organizations')
 */
export function useMenuByKey(accessId: string | undefined, menuKey: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ['menu', 'access', accessId, 'key', menuKey],
    queryFn: () => fetchMenuByKey(accessId!, menuKey!),
    enabled: enabled && !!accessId && !!menuKey,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export type { MenuItem };
