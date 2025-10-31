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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../../style/collapsible';
import { cn } from '../../../utils/cn';
import { useMenu } from 'src/app/routes/hooks/use-menu';
import type { MenuEntry } from 'src/auth/api';
import { useAuth } from 'src/auth/context/app-auth/AuthProvider';

const baseItemClass = 'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors duration-200';
const activeItemClass = 'bg-purple-50 text-purple-700 shadow-sm';
const inactiveItemClass = 'text-gray-600 hover:bg-gray-50';

function usePathMatcher() {
  const location = useLocation();
  return React.useCallback(
    (path: string) => {
      const current = location.pathname;
      return current === path || current.startsWith(`${path}/`);
    },
    [location.pathname]
  );
}

type UiMenuItem = {
  key: string;
  title: string;
  url?: string;
  iconComp?: LucideIcon;
  faIconClass?: string; // Optional Font Awesome icon class
  children?: UiMenuItem[];
};

function ChildItem({ item }: { item: UiMenuItem }) {
  return (
    <NavLink
      to={item.url || '#'}
      className={({ isActive }) =>
        cn(
          baseItemClass,
          'text-sm',
          isActive ? activeItemClass : 'text-gray-500 hover:bg-purple-50/60 hover:text-purple-600'
        )
      }
    >
      {() => (
        <>
          {item.iconComp ? (
            <item.iconComp className="h-4 w-4 text-gray-400" />
          ) : null}
          <span>{item.title}</span>
        </>
      )}
    </NavLink>
  );
}

function ParentItem({ item }: { item: UiMenuItem }) {
  const matchPath = usePathMatcher();
  const hasChildren = !!item.children?.length;
  const childActive = hasChildren ? item.children!.some((child) => child.url && matchPath(child.url)) : false;

  if (!hasChildren) {
    return (
      <NavLink
        to={item.url || '#'}
        className={({ isActive }) =>
          cn(baseItemClass, isActive ? activeItemClass : inactiveItemClass, 'group')
        }
      >
        {() => (
          <>
            {item.iconComp ? (
              <item.iconComp className="h-4 w-4 text-gray-400" />
            ) : item.faIconClass ? (
              <i className={cn(item.faIconClass, 'text-[0.9rem] text-gray-400')} />
            ) : null}
            <span>{item.title}</span>
          </>
        )}
      </NavLink>
    );
  }

  const active = childActive || (item.url ? matchPath(item.url) : false);

  return (
    <Collapsible className="flex flex-col gap-1" defaultOpen={active}>
      <CollapsibleTrigger
        className={cn(baseItemClass, active ? activeItemClass : inactiveItemClass, 'group')}
      >
        {item.iconComp ? (
          <item.iconComp className="h-4 w-4 text-gray-400" />
        ) : item.faIconClass ? (
          <i className={cn(item.faIconClass, 'text-[0.9rem] text-gray-400')} />
        ) : null}
        <span>{item.title}</span>
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-4">
        <div className="flex flex-col gap-1 py-1">
          {item.children!.map((child) => (
            <ChildItem key={child.key} item={child} />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export function SidebarMenus() {
  const { data: menus, isLoading, error, refetch } = useMenu();
  const { isAuthenticated } = useAuth();

  // Normalize backend menu to UI-friendly structure
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
    []
  );

  const toUi = React.useCallback((entry: MenuEntry): UiMenuItem => {
    const title = entry.title ?? entry.name ?? entry.id ?? 'Untitled';
    const url = entry.url ?? entry.to;
    const key = (entry.id ?? `${title}-${url ?? 'group'}`).toString();
    const iconName = entry.icon ?? '';
    const iconComp = iconMap[iconName] ?? undefined;
    const children = Array.isArray(entry.children) ? entry.children.map(toUi) : undefined;
    return { key, title: String(title), url: url ? String(url) : undefined, iconComp, children };
  }, [iconMap]);

  const uiMenus = React.useMemo(() => {
    const base = menus ? menus.map(toUi) : [];
    // Inject a Groups nav if missing and user is authenticated
    const hasGroups = base.some((m) => m.url === '/groups' || m.title.toLowerCase() === 'groups');
    if (isAuthenticated && !hasGroups) {
      base.push({
        key: 'groups',
        title: 'Groups',
        url: '/groups',
        faIconClass: 'fa-solid fa-users',
      });
    }
    // Inject Affiliate nav with children if missing
    const hasAffiliate = base.some((m) => m.url === '/affiliate-setting' || m.title.toLowerCase() === 'affiliate');
    if (isAuthenticated && !hasAffiliate) {
      base.push({
        key: 'affiliate',
        title: 'Affiliate',
        url: '/affiliate-setting',
        faIconClass: 'fa-solid fa-link',
        children: [
          { key: 'affiliate-settings', title: 'Settings', url: '/affiliate-setting', faIconClass: 'fa-solid fa-gear' } as UiMenuItem,
          { key: 'affiliate-master', title: 'Master', url: '/affiliate-setting/master', faIconClass: 'fa-solid fa-database' } as UiMenuItem,
        ],
      });
    }
    return base;
  }, [menus, toUi, isAuthenticated]);
  return (
    <nav className="flex flex-col gap-1">
      {isLoading && <div className="px-3 py-2 text-sm text-slate-500">Loading menu…</div>}
      {error && (
        <div className="px-3 py-2 text-sm text-red-600">
          Failed to load menu. <button className="underline" onClick={() => refetch()}>Retry</button>
        </div>
      )}
      {uiMenus.map((menu) => (
        <ParentItem key={menu.key} item={menu} />
      ))}
    </nav>
  );
}

export default SidebarMenus;
