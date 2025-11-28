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
	iconComp?: any;
	faIconClass?: string;
	children?: GenericMenuItem[];
	menuKey?: string; // Backend's key field (e.g., "organizations")
	[key: string]: any;
};

type MenuContextValue = {
	activeParentMenu: GenericMenuItem | null;
	setActiveParentMenu: (menu: GenericMenuItem | null) => void;
};

const MenuContext = React.createContext<MenuContextValue | undefined>(undefined);

export function MenuProvider({ children }: { children: React.ReactNode }) {
	const [activeParentMenu, setActiveParentMenu] = React.useState<GenericMenuItem | null>(null);

	// Wrap setActiveParentMenu with logging
	const setActiveParentMenuWithLogging = React.useCallback((menu: GenericMenuItem | null) => {
		console.log('========== MenuContext ==========');
		console.log('setActiveParentMenu called with:', menu);
		console.log('Menu UUID (key):', menu?.key);
		console.log('Menu Key (menuKey):', menu?.menuKey);
		console.log('Menu id:', menu?.id);
		console.log('Menu title:', menu?.title || menu?.name);
		console.log('=================================');
		setActiveParentMenu(menu);
	}, []);

	const value = React.useMemo(
		() => ({ activeParentMenu, setActiveParentMenu: setActiveParentMenuWithLogging }),
		[activeParentMenu, setActiveParentMenuWithLogging]
	);

	// Log when activeParentMenu changes
	React.useEffect(() => {
		console.log('MenuContext - activeParentMenu updated:', activeParentMenu);
	}, [activeParentMenu]);

	return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

export function useMenuContext() {
	const ctx = React.useContext(MenuContext);
	if (!ctx) {
		throw new Error('useMenuContext must be used within MenuProvider');
	}
	return ctx;
}
