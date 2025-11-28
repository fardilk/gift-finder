import React from 'react';
import Sidebar from 'src/shared/components/layout/sidebar';
import FloatingAiChat from 'src/shared/components/layout/aibox/FloatingAiChat';
import ProfileMenu from 'src/shared/components/layout/ProfileMenu';
import ChildMenu from 'src/shared/components/layout/ChildMenu';
import { MenuProvider } from 'src/shared/components/layout/MenuContext';
import { useAuth } from 'src/auth/context/app-auth/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { isProfileComplete, getProfileCompletionMessage } from 'src/shared/utils/profileValidation';

type GlobalLayoutProps = {
	children: React.ReactNode;
};

export default function GlobalLayout({ children }: GlobalLayoutProps) {
	const { isAuthenticated, isGuest, user } = useAuth();
	const navigate = useNavigate();

	return (
		<MenuProvider>
			<div className="flex min-h-screen gap-6 bg-slate-50/70 p-6 text-slate-900">
				<Sidebar />
				
				<main className="flex flex-1 items-start gap-6 relative">
					{/* Floating top bar menus */}
					{(isAuthenticated || isGuest) && (
						<div className="absolute left-0 right-0 top-2 z-40 flex items-center justify-between pointer-events-none">
							<div className="pointer-events-auto">
								<ChildMenu />
							</div>
							<div className="pointer-events-auto">
								<ProfileMenu />
							</div>
						</div>
					)}
					
					{/* Content area takes remaining space */}
					<div className="flex-1 flex flex-col rounded-3xl border border-purple-100 bg-white/80 p-8 shadow-lg shadow-purple-100/70 backdrop-blur">
						{/* Profile completion notice */}
						{isAuthenticated && !isGuest && !isProfileComplete(user) && (
							<div className="mb-4 flex items-start justify-between gap-4 rounded-md bg-amber-50 p-3 text-sm text-amber-800">
								<div className="flex-1">
									{getProfileCompletionMessage()}
								</div>
								<button
									onClick={() => navigate('/profile')}
									className="rounded-md bg-amber-600 px-3 py-1.5 text-white hover:bg-amber-700"
								>
									Complete profile
								</button>
							</div>
						)}
						{children}
					</div>
				</main>
				
				{/* Floating AI chat - visible only for signed-in users (not guest) */}
				{isAuthenticated && !isGuest && <FloatingAiChat />}
			</div>
		</MenuProvider>
	);
}

