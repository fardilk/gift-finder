import React from 'react';

// Generic menu item structure that works with both backend MenuEntry and UI-normalized menus
export type GenericMenuItem = {
  key?: string; // UUID or unique identifier
  id?: string;
  title?: string;
  name?: string;
  url?: string;
  to?: string;
  icon?: string;
  iconComp?: React.ReactNode;
  faIconClass?: string;
  children?: GenericMenuItem[];
  menuKey?: string; // Backend's key field (e.g., "organizations")
  [key: string]: unknown;
};

type MenuContextValue = {
  activeParentMenu: GenericMenuItem | null;
  setActiveParentMenu: (menu: GenericMenuItem | null) => void;
};

const MenuContext = React.createContext<MenuContextValue | undefined>(undefined);

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [activeParentMenu, setActiveParentMenu] =
    React.useState<GenericMenuItem | null>(null);

  const value = React.useMemo<MenuContextValue>(
    () => ({
      activeParentMenu,
      setActiveParentMenu,
    }),
    [activeParentMenu]
  );

  return (
    <MenuContext.Provider value={value}>{children}</MenuContext.Provider>
  );
}

export function useMenuContext(): MenuContextValue {
  const ctx = React.useContext(MenuContext);
  if (!ctx) {
    throw new Error('useMenuContext must be used within MenuProvider');
  }
  return ctx;
}
