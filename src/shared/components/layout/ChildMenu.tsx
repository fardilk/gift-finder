import React from 'react';
import { NavLink } from 'react-router-dom';
import { useMenuContext, type GenericMenuItem } from './MenuContext';
import { cn } from '../../utils/cn';
import { useMenu } from 'src/app/routes/hooks/use-menu';

const MAX_VISIBLE_ITEMS = 4;

type ChildMenuItem = {
  key: string;
  title: string;
  url: string;
  order?: number;
  isActive?: boolean;
};

/**
 * Normalizes a GenericMenuItem child to a consistent ChildMenuItem format
 */
function normalizeChildMenu(child: GenericMenuItem, index: number): ChildMenuItem {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const childAny = child as any;
  return {
    key: childAny.key?.toString() || child.id?.toString() || `child-${index}`,
    title: (child.title || child.name || 'Untitled') as string,
    url: (child.url || child.to || '#') as string,
    order: typeof childAny.order === 'number' ? childAny.order : index + 1,
    isActive: childAny.isActive !== false,
  };
}

/**
 * ChildMenu Component
 * 
 * A dynamic, backend-driven component that displays level-2 menu items
 * for the currently selected parent menu from the sidebar.
 * 
 * Features:
 * - Only appears when a parent menu with children is selected
 * - Shows first 4 items directly, rest under "More" dropdown
 * - Fully dynamic - fetches children from backend API
 * - Click-outside to close dropdown
 * - Smooth navigation with React Router
 * 
 * Backend Data Structure:
 * Fetches menu data from:
 * GET /menu/access/:accessId/menus/:menuKey
 * 
 * Expected response format:
 * {
 *   id: "uuid",
 *   key: "organizations",
 *   title: "Organizations",
 *   children: [
 *     { id: "uuid", key: "organizations-overview", url: "/organizations/overview", title: "Overview" },
 *     { id: "uuid", key: "organizations-profile", url: "/organizations/profile", title: "Profile" },
 *     ...
 *   ]
 * }
 */
export function ChildMenu() {
  const { activeParentMenu } = useMenuContext();
  const { data: allMenus } = useMenu();
  const [isExpanded, setIsExpanded] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Find the full menu data with children from the global menu list
  // Match by menuKey, key (UUID), or title
  const fullMenuData = React.useMemo(() => {
    if (!activeParentMenu || !allMenus) return null;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const menuKey = (activeParentMenu as any)?.menuKey;
    const key = activeParentMenu?.key;
    const title = activeParentMenu?.title || activeParentMenu?.name;
    
    return allMenus.find((menu) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const m = menu as any;
      return (
        (menuKey && m.key === menuKey) ||
        (key && m.id === key) ||
        (title && (m.title === title || m.name === title))
      );
    });
  }, [activeParentMenu, allMenus]);

  // Debug logging
  React.useEffect(() => {
    console.log('========== ChildMenu Debug ==========');
    console.log('All menus from GET /menu:', allMenus);
    console.log('Number of menus:', allMenus?.length || 0);
    if (allMenus) {
      allMenus.forEach((menu, idx) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const m = menu as any;
        console.log(`  Menu ${idx}: title="${m.title || m.name}", key="${m.key}", id="${m.id}", children=${m.children?.length || 0}`);
      });
    }
    if (activeParentMenu) {
      console.log('Active parent menu:', activeParentMenu);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.log('  - title:', (activeParentMenu as any)?.title || (activeParentMenu as any)?.name);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.log('  - menuKey:', (activeParentMenu as any)?.menuKey);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.log('  - key:', (activeParentMenu as any)?.key);
      console.log('Matched full menu data:', fullMenuData);
      if (fullMenuData) {
        console.log('  - Children in matched data:', fullMenuData.children?.length || 0);
        if (fullMenuData.children) {
          fullMenuData.children.forEach((child, idx) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const c = child as any;
            console.log(`    Child ${idx}: ${c.title || c.name} -> ${c.url || c.to}`);
          });
        }
      }
    }
    console.log('====================================');
  }, [activeParentMenu, fullMenuData, allMenus]);

  // Reset expansion state when active parent changes
  React.useEffect(() => {
    setIsExpanded(false);
  }, [activeParentMenu]);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    if (!isExpanded) return;

    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isExpanded]);

  // Don't render if no active parent
  if (!activeParentMenu) {
    return null;
  }

  // Use children from fullMenuData (from global menu list) or fall back to context
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const childrenSource = fullMenuData?.children || (activeParentMenu as any)?.children;

  // If no children available, don't render
  if (!childrenSource || childrenSource.length === 0) {
    console.log('ChildMenu - not rendering because no children:', {
      hasActiveParent: true,
      hasFullMenuData: !!fullMenuData,
      hasChildren: !!childrenSource,
      childrenLength: childrenSource?.length,
      fullMenuDataChildren: fullMenuData?.children?.length,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      activeParentMenuChildren: (activeParentMenu as any)?.children?.length
    });
    return null;
  }

  // Normalize and sort children by order
  const children = childrenSource
    .map(normalizeChildMenu)
    .filter((child: ChildMenuItem) => child.isActive)
    .sort((a: ChildMenuItem, b: ChildMenuItem) => (a.order || 0) - (b.order || 0));

  if (children.length === 0) {
    return null;
  }

  // Split into visible and hidden items
  const visibleItems = children.slice(0, MAX_VISIBLE_ITEMS);
  const hiddenItems = children.slice(MAX_VISIBLE_ITEMS);
  const hasMore = hiddenItems.length > 0;

  // Use title from full menu data if available, otherwise use context
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parentTitle = fullMenuData?.title || fullMenuData?.name || (activeParentMenu as any)?.title || (activeParentMenu as any)?.name || 'Menu';

  return (
    <div data-topbar ref={dropdownRef}>
      <div className="flex items-center gap-1.5 rounded-full border border-purple-100 bg-white/90 px-3 py-1.5 shadow-sm backdrop-blur">
        {/* Parent Title */}
        <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide px-2">
          {parentTitle}
        </span>

        <div className="h-4 w-px bg-purple-200"></div>

        {/* First 4 Menu Items - Always Visible */}
        {visibleItems.map((child: ChildMenuItem) => (
          <NavLink
            key={child.key}
            to={child.url}
            className={({ isActive }) =>
              cn(
                'rounded-full px-3 py-1 text-xs font-medium transition-colors whitespace-nowrap',
                isActive
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'
              )
            }
          >
            {child.title}
          </NavLink>
        ))}

        {/* More Dropdown - For items 5+ */}
        {hasMore && (
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className={cn(
                'rounded-full px-2.5 py-1 text-xs font-medium transition-colors flex items-center gap-1',
                isExpanded
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'
              )}
              aria-label="Show more menu items"
            >
              <i className={cn('fa-solid transition-transform', isExpanded ? 'fa-chevron-up' : 'fa-chevron-down')}></i>
            </button>

            {/* Dropdown Menu */}
            {isExpanded && (
              <div className="absolute left-0 top-full mt-2 w-48 overflow-hidden rounded-md border border-slate-200 bg-white py-1 shadow-lg z-50">
                {hiddenItems.map((child: ChildMenuItem) => (
                  <NavLink
                    key={child.key}
                    to={child.url}
                    onClick={() => setIsExpanded(false)}
                    className={({ isActive }) =>
                      cn(
                        'flex w-full items-center gap-2 px-4 py-2 text-left text-sm transition-colors',
                        isActive
                          ? 'bg-purple-50 text-purple-700 font-medium'
                          : 'text-gray-700 hover:bg-slate-50'
                      )
                    }
                  >
                    <span>{child.title}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ChildMenu;


