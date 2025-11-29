import React from 'react';
import { NavLink } from 'react-router-dom';
import { useMenuContext, type GenericMenuItem } from './MenuContext';
import { cn } from '../../utils/cn';
import { useMenu } from 'src/app/routes/hooks/use-menu';

const MAX_VISIBLE_ITEMS = 4;

export interface ChildMenuItem {
  key: string;
  title: string;
  url: string;
  order: number;
  isActive: boolean;
}

interface NormalizedMenuItem {
  id?: string;
  key?: string;
  title?: string;
  name?: string;
  url?: string;
  to?: string;
  order?: number;
  isActive?: boolean;
  children?: GenericMenuItem[];
}

function toNormalized(item: GenericMenuItem): NormalizedMenuItem {
  return {
    id: typeof item.id === 'string' ? item.id : undefined,
    key: typeof item.key === 'string' ? item.key : undefined,
    title: typeof item.title === 'string' ? item.title : undefined,
    name: typeof item.name === 'string' ? item.name : undefined,
    url: typeof item.url === 'string' ? item.url : undefined,
    to: typeof item.to === 'string' ? item.to : undefined,
    order: typeof item.order === 'number' ? item.order : undefined,
    isActive: typeof item.isActive === 'boolean' ? item.isActive : true,
    children: Array.isArray(item.children) ? item.children : [],
  };
}

function normalizeChildMenu(
  child: GenericMenuItem,
  index: number
): ChildMenuItem {
  const c = toNormalized(child);

  return {
    key: c.key || c.id || `child-${index}`,
    title: c.title || c.name || 'Untitled',
    url: c.url || c.to || '#',
    order: c.order ?? index + 1,
    isActive: c.isActive ?? true,
  };
}

export function ChildMenu() {
  const { activeParentMenu } = useMenuContext();
  const { data: allMenus } = useMenu();

  const [isExpanded, setIsExpanded] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const fullMenuData = React.useMemo(() => {
    if (!activeParentMenu || !allMenus) return null;

    const parent = toNormalized(activeParentMenu);
    const parentTitle = parent.title || parent.name;

    return (
      allMenus
        .map(toNormalized)
        .find(
          (m) =>
            (parent.key && m.key === parent.key) ||
            (parent.id && m.id === parent.id) ||
            (parentTitle && (m.title === parentTitle || m.name === parentTitle))
        ) || null
    );
  }, [activeParentMenu, allMenus]);

  React.useEffect(() => {
    setIsExpanded(false);
  }, [activeParentMenu]);

  React.useEffect(() => {
    if (!isExpanded) return;

    function onClick(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
      }
    }

    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [isExpanded]);

  if (!activeParentMenu) return null;

  const parent = toNormalized(activeParentMenu);

  const childrenSource =
    fullMenuData?.children && fullMenuData.children.length > 0
      ? fullMenuData.children
      : parent.children;

  if (!childrenSource || childrenSource.length === 0) return null;

  const children = childrenSource
    .map(normalizeChildMenu)
    .filter((c) => c.isActive)
    .sort((a, b) => a.order - b.order);

  if (children.length === 0) return null;

  const visibleItems = children.slice(0, MAX_VISIBLE_ITEMS);
  const hiddenItems = children.slice(MAX_VISIBLE_ITEMS);

  const parentTitle =
    fullMenuData?.title ||
    fullMenuData?.name ||
    parent.title ||
    parent.name ||
    'Menu';

  return (
    <div data-topbar ref={dropdownRef}>
      <div className="flex items-center gap-1.5 rounded-full border border-purple-100 bg-white/90 px-3 py-1.5 shadow-sm backdrop-blur">
        <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide px-2">
          {parentTitle}
        </span>

        <div className="h-4 w-px bg-purple-200" />

        {visibleItems.map((child) => (
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

        {hiddenItems.length > 0 && (
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded((s) => !s);
              }}
              className={cn(
                'rounded-full px-2.5 py-1 text-xs font-medium transition-colors flex items-center gap-1',
                isExpanded
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'
              )}
            >
              <i
                className={cn(
                  'fa-solid transition-transform',
                  isExpanded ? 'fa-chevron-up' : 'fa-chevron-down'
                )}
              />
            </button>

            {isExpanded && (
              <div className="absolute left-0 top-full mt-2 w-48 overflow-hidden rounded-md border border-slate-200 bg-white py-1 shadow-lg z-50">
                {hiddenItems.map((child) => (
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
                    {child.title}
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
