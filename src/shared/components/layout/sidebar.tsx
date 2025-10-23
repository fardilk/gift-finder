import React from 'react';
import { cn } from '../../utils/cn';
import BrandIdentity from './sidebar/brandIdentity';
import SidebarMenus from './sidebar/SidebarMenus';

type SidebarProps = {
	className?: string;
};

export function IndividualDashboardSidebar({ className }: SidebarProps) {
	return (
		<div className={cn('w-72 min-w-[18rem] flex-none', className)}>
			<aside
				className={cn(
					'fixed left-6 top-6 h-[calc(100vh-1.5rem)] flex w-72 min-w-[18rem] flex-col rounded-3xl border border-purple-100 bg-white/70 p-4 shadow-lg shadow-purple-100/60 backdrop-blur'
				)}
			>
				<BrandIdentity className="flex-1">
					<SidebarMenus />
				</BrandIdentity>
			</aside>
		</div>
	);
}

export default IndividualDashboardSidebar;
