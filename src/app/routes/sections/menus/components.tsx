import React from 'react';
import { type MenuItem } from './api';

/**
 * Component to render Font Awesome icon
 */
export function MenuIcon({ icon, className = '' }: { icon?: string; className?: string }) {
  if (!icon) return null;

  // Handle different icon formats:
  // - "fa-solid fa-home" or "fas fa-home"
  // - "fa-home" (default to solid)
  // - "home" (default to solid with fa- prefix)
  
  let iconClass = icon;
  
  // If icon doesn't start with 'fa', add 'fa-solid fa-' prefix
  if (!icon.startsWith('fa')) {
    iconClass = `fa-solid fa-${icon}`;
  }
  // If icon starts with 'fa-' but doesn't have style prefix (fa-solid, fa-regular, etc.)
  else if (icon.startsWith('fa-') && !icon.match(/^fa[srbldt]\s/)) {
    iconClass = `fa-solid ${icon}`;
  }

  return <i className={`${iconClass} ${className}`.trim()} aria-hidden="true" />;
}

/**
 * Component to render a single menu item
 */
export function MenuItemComponent({ item }: { item: MenuItem }) {
  const url = item.url || item.to || '#';
  const title = item.title || item.name || 'Untitled';
  
  return (
    <div className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded">
      <MenuIcon icon={item.icon} className="w-5 h-5" />
      <a href={url} className="flex-1 text-sm">
        {title}
      </a>
    </div>
  );
}

/**
 * Component to render menu list with nested children
 */
export function MenuList({ menus }: { menus: MenuItem[] }) {
  if (!menus || menus.length === 0) {
    return (
      <div className="p-4 text-gray-500 text-sm">
        No menu items available
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {menus.map((menu) => (
        <div key={menu.id}>
          <MenuItemComponent item={menu} />
          {menu.children && menu.children.length > 0 && (
            <div className="ml-6 mt-1">
              <MenuList menus={menu.children} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
