import React from 'react';
import Sidebar from 'src/shared/components/layout/sidebar';
import FloatingAiChat from 'src/shared/components/layout/aibox/FloatingAiChat';

type GlobalLayoutProps = {
	children: React.ReactNode;
};

export default function GlobalLayout({ children }: GlobalLayoutProps) {
	return (
		<div className="flex min-h-screen gap-6 bg-slate-50/70 p-6 text-slate-900">
			<Sidebar />
			<main className="flex flex-1 items-start gap-6">
				{/* Content area takes remaining space */}
				<div className="flex-1 flex flex-col rounded-3xl border border-purple-100 bg-white/80 p-8 shadow-lg shadow-purple-100/70 backdrop-blur">
					{children}
				</div>
			</main>
			<FloatingAiChat />
		</div>
	);
}

