# Menu System Module

This module provides functionality to fetch and display dynamic menus from the backend with Font Awesome icons support.

## Files Structure

```
src/app/routes/sections/menus/
├── index.ts          # Main exports
├── api.ts            # API functions for fetching menus
├── hooks.ts          # React Query hooks
└── components.tsx    # UI components for rendering menus
```

## API Endpoint

**GET** `/menu/access/:id/menus`

Fetches menus for a specific access ID. The backend should return:

```typescript
{
  menus: [
    {
      id: "1",
      name: "Dashboard",
      title: "Dashboard",  // Optional: either name or title
      url: "/dashboard",
      to: "/dashboard",     // Optional: either url or to
      icon: "fa-home",      // Font Awesome icon name
      order: 1,
      parentId: null,
      children: []          // Optional: nested menu items
    },
    // ... more menu items
  ]
}
```

### Icon Format Support

The system supports multiple Font Awesome icon formats:
- `"fa-home"` - Adds default `fa-solid` prefix
- `"fas fa-home"` - Full Font Awesome class (solid)
- `"fa-solid fa-home"` - Explicit solid style
- `"far fa-home"` - Regular style
- `"home"` - Adds `fa-solid fa-` prefix automatically

## Usage

### 1. Using the Hook

```tsx
import { useMenusByAccessId } from 'src/app/routes/sections/menus';

function MyComponent() {
  const accessId = "123"; // Get from user context
  const { data: menus, isLoading, error } = useMenusByAccessId(accessId);

  if (isLoading) return <div>Loading menus...</div>;
  if (error) return <div>Error loading menus</div>;

  return (
    <div>
      {menus?.map(menu => (
        <div key={menu.id}>{menu.name || menu.title}</div>
      ))}
    </div>
  );
}
```

### 2. Using Components

```tsx
import { MenuList, MenuIcon } from 'src/app/routes/sections/menus';

// Render full menu list with icons
function Sidebar() {
  const { data: menus } = useMenusByAccessId(accessId);
  
  return (
    <nav>
      <MenuList menus={menus || []} />
    </nav>
  );
}

// Render individual icon
function CustomMenuItem() {
  return (
    <div>
      <MenuIcon icon="fa-cog" className="w-5 h-5 text-blue-500" />
      Settings
    </div>
  );
}
```

### 3. With Auth Context

```tsx
import { useAuth } from 'src/auth/context/app-auth/AuthProvider';
import { useMenusByAccessId } from 'src/app/routes/sections/menus';

function NavigationMenu() {
  const { user } = useAuth();
  const primaryAccessId = user?.accesses?.[0]?.id;
  
  const { data: menus, isLoading } = useMenusByAccessId(
    primaryAccessId,
    !!primaryAccessId // Only enable if accessId exists
  );

  // Render your navigation
}
```

## Component API

### MenuIcon

Renders a Font Awesome icon.

**Props:**
- `icon?: string` - Font Awesome icon class
- `className?: string` - Additional CSS classes

### MenuItemComponent

Renders a single menu item with icon and link.

**Props:**
- `item: MenuItem` - Menu item data

### MenuList

Renders a list of menu items with nested children support.

**Props:**
- `menus: MenuItem[]` - Array of menu items

## TypeScript Types

```typescript
type MenuItem = {
  id: string;
  name?: string;
  title?: string;
  url?: string;
  to?: string;
  icon?: string;
  order?: number;
  parentId?: string | null;
  children?: MenuItem[];
};
```

## Caching

The menu data is cached for 5 minutes using React Query's `staleTime` configuration. This reduces unnecessary API calls while keeping data fresh.

## Integration Notes

1. **Font Awesome** is already installed and imported in `src/index.css`
2. Menus are **protected by authentication** - ensure user is logged in before fetching
3. Query key format: `['menu', 'access', accessId]`
4. The hook automatically disables if `accessId` is undefined or falsy
