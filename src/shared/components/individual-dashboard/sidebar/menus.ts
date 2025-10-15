import {
	Apple,
	Gift,
	LayoutDashboard,
	Package,
	Settings,
	Sparkles,
	Users,
	UtensilsCrossed,
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export type SidebarChildMenu = {
	id: string;
	label: string;
	to: string;
	icon: LucideIcon;
};

export type SidebarMenu = {
	id: string;
	label: string;
	to: string;
	icon: LucideIcon;
	children?: SidebarChildMenu[];
};

export const sidebarMenus: SidebarMenu[] = [
	{
		id: 'dashboard',
		label: 'Dashboard',
		to: '/dashboard',
		icon: LayoutDashboard,
	},
	{
		id: 'gift',
		label: 'Gift',
		to: '/dashboard/gift',
		icon: Gift,
		children: [
			{ id: 'gift-hampers', label: 'Hampers', to: '/dashboard/gift/hampers', icon: Package },
			{ id: 'gift-surprise', label: 'Surprise', to: '/dashboard/gift/surprise', icon: Sparkles },
			{ id: 'gift-fruit', label: 'Fruit', to: '/dashboard/gift/fruit', icon: Apple },
			{ id: 'gift-utensils', label: 'Utensils', to: '/dashboard/gift/utensils', icon: UtensilsCrossed },
		],
	},
	{
		id: 'receiver',
		label: 'Receiver',
		to: '/dashboard/receiver',
		icon: Users,
	},
	{
		id: 'settings',
		label: 'Settings',
		to: '/dashboard/settings',
		icon: Settings,
	},
];

export type SidebarMenuList = typeof sidebarMenus;
