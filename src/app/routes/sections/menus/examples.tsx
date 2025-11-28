/**
 * Example: How to integrate the menu system into your application
 * 
 * This file demonstrates how to use the menu hooks and components
 * in a typical navigation sidebar or header component.
 */

import React from 'react';
import { useAuth } from 'src/auth/context/app-auth/AuthProvider';
import { useMenusByAccessId, MenuList, MenuIcon } from 'src/app/routes/sections/menus';
import { Link } from 'react-router-dom';

/**
 * Example 1: Simple Navigation Sidebar
 */
export function NavigationSidebar() {
  const { user } = useAuth();
  const primaryAccessId = user?.accesses?.[0]?.id;

  const { data: menus, isLoading, error } = useMenusByAccessId(
    primaryAccessId,
    !!primaryAccessId
  );

  if (isLoading) {
    return (
      <aside className="w-64 bg-white shadow-lg p-4">
        <div className="animate-pulse space-y-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-10 bg-gray-200 rounded" />
          ))}
        </div>
      </aside>
    );
  }

  if (error) {
    return (
      <aside className="w-64 bg-white shadow-lg p-4">
        <div className="text-red-500 text-sm">
          <MenuIcon icon="fa-exclamation-triangle" className="mr-2" />
          Failed to load menu
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-64 bg-white shadow-lg p-4">
      <h2 className="text-lg font-semibold mb-4">Navigation</h2>
      <MenuList menus={menus || []} />
    </aside>
  );
}

/**
 * Example 2: Custom Menu Rendering with React Router Link
 */
export function CustomNavigationMenu() {
  const { user } = useAuth();
  const primaryAccessId = user?.accesses?.[0]?.id;
  const { data: menus } = useMenusByAccessId(primaryAccessId);

  return (
    <nav className="space-y-2">
      {menus?.map((menu) => {
        const url = menu.url || menu.to || '#';
        const title = menu.title || menu.name || 'Untitled';

        return (
          <Link
            key={menu.id}
            to={url}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <MenuIcon icon={menu.icon} className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">{title}</span>
            {menu.children && menu.children.length > 0 && (
              <MenuIcon icon="fa-chevron-right" className="ml-auto text-xs text-gray-400" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

/**
 * Example 3: Dropdown Menu in Header
 */
export function HeaderMenuDropdown() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);
  const primaryAccessId = user?.accesses?.[0]?.id;
  const { data: menus } = useMenusByAccessId(primaryAccessId);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50"
      >
        <MenuIcon icon="fa-bars" />
        <span>Menu</span>
        <MenuIcon icon={isOpen ? 'fa-chevron-up' : 'fa-chevron-down'} className="text-xs" />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-64 bg-white border rounded-lg shadow-lg py-2 z-50">
          <MenuList menus={menus || []} />
        </div>
      )}
    </div>
  );
}

/**
 * Example 4: Multiple Access Levels
 * If a user has multiple accesses, show menus for each
 */
export function MultiAccessNavigation() {
  const { user } = useAuth();
  const accesses = user?.accesses || [];

  return (
    <div className="space-y-6">
      {accesses.map((access) => (
        <AccessMenuSection key={access.id} accessId={access.id} accessName={access.name} />
      ))}
    </div>
  );
}

function AccessMenuSection({ accessId, accessName }: { accessId: string; accessName: string }) {
  const { data: menus, isLoading } = useMenusByAccessId(accessId);

  if (isLoading) {
    return <div className="animate-pulse h-20 bg-gray-100 rounded" />;
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">{accessName}</h3>
      <MenuList menus={menus || []} />
    </div>
  );
}

/**
 * Example 5: Menu with Icons Only (Collapsed Sidebar)
 */
export function CollapsedSidebarMenu() {
  const { user } = useAuth();
  const primaryAccessId = user?.accesses?.[0]?.id;
  const { data: menus } = useMenusByAccessId(primaryAccessId);

  return (
    <aside className="w-16 bg-gray-900 flex flex-col items-center gap-4 py-4">
      {menus?.map((menu) => {
        const url = menu.url || menu.to || '#';
        const title = menu.title || menu.name || 'Untitled';

        return (
          <Link
            key={menu.id}
            to={url}
            title={title}
            className="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-gray-800 transition-colors"
          >
            <MenuIcon icon={menu.icon} className="text-xl text-white" />
          </Link>
        );
      })}
    </aside>
  );
}
