import { useAuth } from 'src/auth/context/app-auth/AuthProvider';

// Note: Menus are now served by the backend (/menu). This hook is kept only for
// generic access queries elsewhere in the UI (feature flags, button visibility, etc.).
export function useAccessControl() {
  const { user } = useAuth();
  const accessIds = (user?.accesses || []).map((a) => a.id.toLowerCase());
  const names = (user?.accesses || []).map((a) => (a.name || '').toLowerCase());

  const hasAccessId = (id: string) => accessIds.includes(id.toLowerCase());
  const hasAccessName = (name: string) => names.includes(name.toLowerCase());

  return { user, accessIds, names, hasAccessId, hasAccessName };
}

export default useAccessControl;
