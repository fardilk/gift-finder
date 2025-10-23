import React, { useMemo } from 'react';
import { cn } from '../../../utils/cn';

type BrandIdentityProps = {
	className?: string;
	children?: React.ReactNode;
};

const LOGO_SRC = 'https://cdn-fardil-2025.s3.us-east-2.amazonaws.com/uploads/gift/logo-gift-finder.png';

export function BrandIdentity({ className, children }: BrandIdentityProps) {
	const version = useMemo(() => `beta-${Math.floor(Math.random() * 900) + 100}`, []);

	return (
		<div className={cn('flex h-full flex-col gap-6', className)}>
			<div className="flex items-center gap-3 rounded-2xl border border-purple-100 bg-white/85 px-4 py-3 shadow-sm backdrop-blur">
				<div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white/90">
					<img src={LOGO_SRC} alt="Gift Finder logo" className="h-10 w-10 object-contain" loading="lazy" />
				</div>
				<div className="flex flex-col">
					<span className="text-base font-semibold text-gray-900">Gift Finder</span>
					<span className="text-xs text-gray-500">Curated gifting assistant</span>
				</div>
			</div>

			{children ? <div className="flex-1 overflow-auto pr-1">{children}</div> : null}

			<div className="mt-auto pb-2">
				<div className="sticky bottom-2 rounded-xl border border-dashed border-purple-200 bg-purple-50/80 px-4 py-3 text-xs text-purple-600 shadow-sm">
					<p>© 2025 Sevenrose</p>
					<p className="mt-1 font-medium text-purple-700">App version: {version}</p>
				</div>
			</div>
		</div>
	);
}

export default BrandIdentity;
