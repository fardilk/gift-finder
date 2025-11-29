import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Gift as GiftIcon,
  LayoutDashboard,
  Settings as SettingsIcon,
  Users as UsersIcon,
  Package,
  LucideIcon,
} from 'lucide-react';

import { cn } from '../../../utils/cn';
import { useMenu } from 'src/app/routes/hooks/use-menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as solidIcons from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { useMenuContext } from '../MenuContext';
import type { MenuEntry } from 'src/auth/api';

/* -----------------------------
   Styles
----------------------------- */
const baseItemClass =
  'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors duration-200';
const activeItemClass = 'bg-purple-50 text-purple-700 shadow-sm';
const inactiveItemClass = 'text-gray-500 hover:bg-gray-50';

/* -----------------------------
   Hook: Path Matcher
----------------------------- */
function usePathMatcher() {
  const location = useLocation();
  return React.useCallback(
    (path: string) =>
      location.pathname === path || location.pathname.startsWith(`${path}/`),
    [location.pathname],
  );
}

/* -----------------------------
   Types
----------------------------- */
export type UiMenuItem = {
  key: string;
  title: string;
  url?: string;
  iconComp?: LucideIcon;
  faIcon?: IconDefinition;
  faIconClass?: string;
  children?: UiMenuItem[];
  menuKey?: string;
  parentId?: string | null;
};

type BackendMenuEntry = MenuEntry & {
  title?: string;
  name?: string;
  to?: string;
  children?: BackendMenuEntry[];
  icon?: string;
  parentId?: string | null;
};

/* -----------------------------
   Font Awesome Resolver
----------------------------- */
type SolidIconMap = typeof solidIcons;

function resolveFaIcon(name?: string): IconDefinition | undefined {
  if (!name) return undefined;

  const cleaned = name
    .trim()
    .replace(/^fa-?/i, '')
    .replace(/\s+/g, '-')
    .replace(/_/g, '-')
    .toLowerCase();

  const pascal = cleaned
    .split('-')
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join('');

  const key = `fa${pascal}` as keyof SolidIconMap;
  const candidate = solidIcons[key];

  if (
    candidate &&
    typeof candidate === 'object' &&
    'iconName' in candidate &&
    'icon' in candidate
  ) {
    return candidate as IconDefinition;
  }

  return undefined;
}

/* -----------------------------
   Parent Menu Component
----------------------------- */
function ParentItem({ item }: { item: UiMenuItem }) {
  const matchPath = usePathMatcher();
  const { setActiveParentMenu } = useMenuContext();

  const hasChildren = !!item.children?.length;
  const childActive =
    hasChildren &&
    item.children!.some((child) => child.url && matchPath(child.url));

  const active =
    childActive ||
    (item.url ? matchPath(item.url) : false);

  React.useEffect(() => {
    if (hasChildren && active) {
      setActiveParentMenu(item);
    }
  }, [hasChildren, active, item, setActiveParentMenu]);

  const handleClick = () => {
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
      {item.faIcon ? (
        <FontAwesomeIcon icon={item.faIcon} className="h-4 w-4" />
      ) : item.iconComp ? (
        <item.iconComp className="h-4 w-4" />
      ) : item.faIconClass ? (
        <i className={cn(item.faIconClass, 'text-[0.9rem]')} />
      ) : null}

      <span>{item.title}</span>
    </NavLink>
  );
}

/* -----------------------------
   Sidebar Menus
----------------------------- */
export function SidebarMenus() {
  const { data: menus, isLoading, error, refetch } = useMenu();

  const iconMap: Record<string, LucideIcon> = React.useMemo(
    () => ({
      LayoutDashboard,
      Settings: SettingsIcon,
      Gift: GiftIcon,
      Users: UsersIcon,
      Package,
    }),
    [],
  );

  const toUi = React.useCallback(
    (entry: BackendMenuEntry): UiMenuItem => {
      const e = entry;

      const title = e.title ?? e.name ?? e.id ?? 'Untitled';
      const url = e.url ?? e.to;
      const key = String(e.id ?? `${title}-${url ?? 'group'}`);

      const iconName = e.icon ?? '';
      const iconComp = iconMap[iconName];

      const { faIcon, faIconClass } = resolveFinalFaIcon(iconName);
      function resolveFinalFaIcon(iconName: string) {
        const fa = resolveFaIcon(iconName);

        if (fa) {
          return {
            faIcon: fa,
            faIconClass: undefined as string | undefined,
          };
        }

        if (iconName) {
          return {
            faIcon: undefined,
            faIconClass: `fa-solid fa-${iconName.replace(/^fa-?/i, '')}`,
          };
        }

        return { faIcon: undefined, faIconClass: undefined };
      }


      const children = Array.isArray(e.children)
        ? e.children.map((child) => toUi(child))
        : undefined;

      let menuKey = e.key;
      if (!menuKey && url) {
        const seg = url.split('/').filter(Boolean);
        if (seg.length) menuKey = seg[0];
      }

      return {
        key,
        title: String(title),
        url: url ? String(url) : undefined,
        iconComp,
        faIcon,
        faIconClass,
        children,
        menuKey,
        parentId: e.parentId ?? null,
      };
    },
    [iconMap],
  );

  const uiMenus = React.useMemo(
    () => (menus ? menus.map((m) => toUi(m as BackendMenuEntry)) : []),
    [menus, toUi],
  );

  const parentMenus = React.useMemo(() => {
    return uiMenus.filter((m) => {
      if (m.parentId != null) return false;

      if (m.url) {
        const seg = m.url.split('/').filter(Boolean);
        if (seg.length > 1) {
          const parentPath = '/' + seg[0];
          const hasParent = uiMenus.some(
            (other) => other.url === parentPath && other.key !== m.key,
          );
          if (hasParent) return false;
        }
      }
      return true;
    });
  }, [uiMenus]);

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
