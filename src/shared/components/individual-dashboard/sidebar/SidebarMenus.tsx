import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../../style/collapsible';
import { cn } from '../../../utils/cn';
import { sidebarMenus, SidebarMenu, SidebarChildMenu } from './menus';

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

type MenuIconProps = {
  icon: SidebarMenu['icon'];
  active: boolean;
};

function MenuIcon({ icon: Icon, active }: MenuIconProps) {
  return <Icon className={cn('h-5 w-5 transition-colors', active ? 'text-purple-600' : 'text-gray-500')} />;
}

function ChildItem({ item, active }: { item: SidebarChildMenu; active: boolean }) {
  return (
    <NavLink
      to={item.to}
      className={({ isActive }) =>
        cn(
          baseItemClass,
          'text-sm',
          isActive ? activeItemClass : 'text-gray-500 hover:bg-purple-50/60 hover:text-purple-600'
        )
      }
    >
      {({ isActive }) => (
        <>
          <MenuIcon icon={item.icon} active={isActive || active} />
          <span>{item.label}</span>
        </>
      )}
    </NavLink>
  );
}

function ParentItem({ item }: { item: SidebarMenu }) {
  const matchPath = usePathMatcher();
  const hasChildren = !!item.children?.length;
  const childActive = hasChildren ? item.children!.some((child) => matchPath(child.to)) : false;

  if (!hasChildren) {
    return (
      <NavLink
        to={item.to}
        className={({ isActive }) =>
          cn(baseItemClass, isActive ? activeItemClass : inactiveItemClass, 'group')
        }
      >
        {({ isActive }) => (
          <>
            <MenuIcon icon={item.icon} active={isActive} />
            <span>{item.label}</span>
          </>
        )}
      </NavLink>
    );
  }

  const active = childActive || matchPath(item.to);

  return (
    <Collapsible className="flex flex-col gap-1" defaultOpen={active}>
      <CollapsibleTrigger
        className={cn(baseItemClass, active ? activeItemClass : inactiveItemClass, 'group')}
      >
        <MenuIcon icon={item.icon} active={active} />
        <span>{item.label}</span>
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-4">
        <div className="flex flex-col gap-1 py-1">
          {item.children!.map((child) => (
            <ChildItem key={child.id} item={child} active={matchPath(child.to)} />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export function SidebarMenus() {
  return (
    <nav className="flex flex-col gap-1">
      {sidebarMenus.map((menu) => (
        <ParentItem key={menu.id} item={menu} />
      ))}
    </nav>
  );
}

export default SidebarMenus;
