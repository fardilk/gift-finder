import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Apple,
  Gift as GiftIcon,
  LayoutDashboard,
  Package,
  Settings as SettingsIcon,
  Sparkles,
  Users as UsersIcon,
  UtensilsCrossed,
  LucideIcon,
} from 'lucide-react';

import { cn } from '../../../utils/cn';
import { useMenu } from 'src/app/routes/hooks/use-menu';
import { useMenuContext } from '../MenuContext';
import type { MenuEntry } from 'src/auth/api';

// CSS utility classes
const baseItemClass =
  'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors duration-200';
const activeItemClass = 'bg-purple-50 text-purple-700 shadow-sm';
const inactiveItemClass = 'text-gray-600 hover:bg-gray-50';

// Hook: match current URL with a menu path
function usePathMatcher() {
  const location = useLocation();
  return React.useCallback(
    (path: string) => {
      const current = location.pathname;
      return current === path || current.startsWith(`${path}/`);
    },
    [location.pathname],
  );
}

// UI-friendly menu type
export type UiMenuItem = {
  key: string; // UUID from backend (id field)
  title: string;
  url?: string;
  iconComp?: LucideIcon;
  faIconClass?: string;
  children?: UiMenuItem[];
  menuKey?: string; // Backend's key field (e.g., "organizations")
  parentId?: string | null; // Used to distinguish parent vs child
};

function ParentItem({ item }: { item: UiMenuItem }) {
  const matchPath = usePathMatcher();
  const { setActiveParentMenu } = useMenuContext();

  const hasChildren = !!item.children?.length;

  // Heuristic: items that might have submenus (for the right-chevron indicator)
  const mightHaveChildren =
    item.menuKey === 'organizations' ||
    item.title.toLowerCase().includes('organization') ||
    hasChildren;

  const childActive = hasChildren
    ? item.children!.some((child) => child.url && matchPath(child.url))
    : false;

  // Automatically set active parent if route matches one of its children
  React.useEffect(() => {
    if (hasChildren && (childActive || (item.url && matchPath(item.url)))) {
      console.log('SidebarMenus - Auto-setting activeParentMenu:', item);
      setActiveParentMenu(item);
    }
  }, [hasChildren, childActive, item, matchPath, setActiveParentMenu]);

  const active = childActive || (item.url ? matchPath(item.url) : false);

  // const handleClick = () => {
  //   console.log('SidebarMenus - Menu clicked:', item.title);
  //   console.log('SidebarMenus - UUID key:', item.key);
  //   console.log('SidebarMenus - Menu key:', item.menuKey);
  //   console.log('SidebarMenus - parentId:', item.parentId);
  //   console.log('SidebarMenus - Might have children:', mightHaveChildren);

  //   if (mightHaveChildren) {
  //     console.log('SidebarMenus - Setting activeParentMenu to:', item);
  //     setActiveParentMenu(item);
  //   } else {
  //     console.log('SidebarMenus - Clearing activeParentMenu');
  //     setActiveParentMenu(null);
  //   }
  // };

  const handleClick = () => {
  console.log('SidebarMenus - Menu clicked:', item.title);
  console.log('SidebarMenus - UUID key:', item.key);
  console.log('SidebarMenus - Menu key:', item.menuKey);
  console.log('SidebarMenus - parentId:', item.parentId);
  console.log('SidebarMenus - Might have children:', mightHaveChildren);

  setActiveParentMenu(item);
};


  return (
    <NavLink
      to={item.url || '#'}
      className={({ isActive }) =>
        cn(
          baseItemClass,
          isActive || active ? activeItemClass : inactiveItemClass,
          'group',
        )
      }
      onClick={handleClick}
    >
      {item.iconComp ? (
        <item.iconComp className="h-4 w-4 text-gray-400" />
      ) : item.faIconClass ? (
        <i className={cn(item.faIconClass, 'text-[0.9rem] text-gray-400')} />
      ) : null}

      <span>{item.title}</span>

      {mightHaveChildren && (
        <i className="fa-solid fa-chevron-right ml-auto text-xs text-gray-400" />
      )}
    </NavLink>
  );
}

export function SidebarMenus() {
  const { data: menus, isLoading, error, refetch } = useMenu();

  // Icon mapping from backend icon name → Lucide component
  const iconMap: Record<string, LucideIcon> = React.useMemo(
    () => ({
      LayoutDashboard,
      Sparkles,
      Gift: GiftIcon,
      Users: UsersIcon,
      Settings: SettingsIcon,
      Package,
      Apple,
      UtensilsCrossed,
    }),
    [],
  );

  // Convert backend MenuEntry → UiMenuItem (recursive)
  const toUi = React.useCallback(
    (entry: MenuEntry): UiMenuItem => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const anyEntry = entry as any;

      const title = anyEntry.title ?? anyEntry.name ?? anyEntry.id ?? 'Untitled';
      const url = anyEntry.url ?? anyEntry.to;
      const key = anyEntry.id ? String(anyEntry.id) : `${title}-${url ?? 'group'}`;

      const iconName = anyEntry.icon ?? '';
      const iconComp = iconMap[iconName];

      // Recursively map children (backend already sends nested structure)
      const children = Array.isArray(anyEntry.children)
        ? anyEntry.children.map(toUi)
        : undefined;

      // Extract semantic menuKey from backend's 'key' field
      // If not present, try to infer from URL path (e.g., /organizations → "organizations")
      let menuKey = anyEntry.key;
      if (!menuKey && url) {
        const pathSegments = url.split('/').filter(Boolean);
        if (pathSegments.length > 0) {
          menuKey = pathSegments[0]; // Use first path segment as key
        }
      }
      
      const parentId = anyEntry.parentId ?? null;

      return {
        key,
        title: String(title),
        url: url ? String(url) : undefined,
        iconComp,
        children,
        menuKey: menuKey ? String(menuKey) : undefined,
        parentId,
      };
    },
    [iconMap],
  );

  const uiMenus = React.useMemo(() => {
    return menus ? menus.map(toUi) : [];
  }, [menus, toUi]);

  // ✅ Only parent-level menus: parentId === null OR filter by URL pattern
  const parentMenus = React.useMemo(() => {
    // Filter logic:
    // 1. Must have parentId === null OR undefined (not a child)
    // 2. If backend sends flat list, also filter out URLs that look like children
    //    (e.g., /organizations/overview is a child of /organizations)
    const result = uiMenus.filter((m) => {
      // First check: parentId must be null or undefined
      if (m.parentId != null) {
        return false;
      }
      
      // Second check: filter out URLs that are sub-paths of other menus
      // e.g., /organizations/overview should be filtered out if /organizations exists
      if (m.url) {
        const pathSegments = m.url.split('/').filter(Boolean);
        // If URL has more than 1 segment, check if a parent with fewer segments exists
        if (pathSegments.length > 1) {
          const potentialParentPath = '/' + pathSegments[0];
          const hasParent = uiMenus.some(
            (other) => other.url === potentialParentPath && other.key !== m.key
          );
          if (hasParent) {
            console.log(`Filtering out child menu: ${m.title} (${m.url}) - has parent at ${potentialParentPath}`);
            return false;
          }
        }
      }
      
      return true;
    });
    
    console.log('SidebarMenus - parentMenus (filtered):', result);
    return result;
  }, [uiMenus]);

  React.useEffect(() => {
    if (uiMenus.length) {
      console.log('========== Sidebar Menus ==========');
      console.log('Raw menus from backend:', menus);
      console.log('Sidebar normalized menu (UI):', uiMenus);
      console.log(
        'Menu keys:',
        uiMenus.map((m) => ({
          title: m.title,
          key: m.key,
          menuKey: m.menuKey,
          parentId: m.parentId,
          hasChildren: !!m.children?.length,
        })),
      );
      console.log('Parent menus (filtered):');
      parentMenus.forEach((m) => {
        console.log(`  - ${m.title}: menuKey=${m.menuKey}, hasChildren=${!!m.children?.length}`);
      });
      console.log('===================================');
    }
  }, [uiMenus, menus, parentMenus]);

  return (
    <nav className="flex flex-col gap-1">
      {isLoading && (
        <div className="px-3 py-2 text-sm text-slate-500">Loading menu…</div>
      )}
      {error && (
        <div className="px-3 py-2 text-sm text-red-600">
          Failed to load menu.{' '}
          <button className="underline" onClick={() => refetch()}>
            Retry
          </button>
        </div>
      )}

      {parentMenus.map((menu) => (
        <ParentItem key={menu.key} item={menu} />
      ))}
    </nav>
  );
}

export default SidebarMenus;
