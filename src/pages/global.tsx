import React from 'react';
import Sidebar from 'src/shared/components/layout/sidebar';
import FloatingAiChat from 'src/shared/components/layout/aibox/FloatingAiChat';
import { useAuth } from 'src/auth/context/app-auth/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { isProfileComplete, getProfileCompletionMessage } from 'src/shared/utils/profileValidation';

type GlobalLayoutProps = {
	children: React.ReactNode;
};

export default function GlobalLayout({ children }: GlobalLayoutProps) {
	const { isAuthenticated, isGuest, logout, user } = useAuth();
	const navigate = useNavigate();
	const [openProfile, setOpenProfile] = React.useState(false);
	const [openSettings, setOpenSettings] = React.useState(false);

	function go(path: string) {
		navigate(path);
	}

	function closeAll() {
		setOpenProfile(false);
		setOpenSettings(false);
		// no-op for notifications dropdown currently
	}

	React.useEffect(() => {
		function onDocClick(e: MouseEvent) {
			const target = e.target as HTMLElement;
			if (!target.closest?.('[data-topbar]')) {
				closeAll();
			}
		}
		document.addEventListener('click', onDocClick);
		return () => document.removeEventListener('click', onDocClick);
	}, []);
	return (
		<div className="flex min-h-screen gap-6 bg-slate-50/70 p-6 text-slate-900">
			{(isAuthenticated || isGuest) && (
				<div className="fixed right-0 top-0 z-40" data-topbar>
					<div className="flex items-center gap-1.5 rounded-full border border-purple-100 bg-white/90 px-1.5 py-0.5 shadow-sm backdrop-blur">
						{/* Notifications */}
						<button
							className="rounded-full p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
							aria-label="Notifications"
							onClick={(e) => {
								e.stopPropagation();
								setOpenProfile(false);
								setOpenSettings(false);
							}}
						>
							<i className="fa-solid fa-bell text-[0.8rem]"></i>
						</button>
						{/* Settings */}
						<div className="relative">
							<button
								className="rounded-full p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
								aria-label="Settings"
								onClick={(e) => {
									e.stopPropagation();
									setOpenSettings((v: boolean) => !v);
									setOpenProfile(false);
								}}
							>
								<i className="fa-solid fa-gear text-[0.8rem]"></i>
							</button>
							{openSettings && (
								<div className="absolute right-0 mt-2 w-44 overflow-hidden rounded-md border border-slate-200 bg-white py-1 text-sm shadow-md">
									<button
										onClick={() => {
											go('/dashboard/settings/accounts');
											closeAll();
										}}
										className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-slate-50"
									>
										<i className="fa-solid fa-user-gear text-[0.8rem]"></i>
										<span>Accounts</span>
									</button>
								</div>
							)}
						</div>

						{/* Profile */}
						<div className="relative">
							<button
								className="rounded-full p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
								aria-label="Profile"
								onClick={(e) => {
									e.stopPropagation();
									setOpenProfile((v: boolean) => !v);
									setOpenSettings(false);
								}}
							>
								<i className="fa-solid fa-user text-[0.8rem]"></i>
							</button>
							{openProfile && (
								<div className="absolute right-0 mt-2 w-44 overflow-hidden rounded-md border border-slate-200 bg-white py-1 text-sm shadow-md">
									<button
										onClick={() => {
											go('/profile');
											closeAll();
										}}
										className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-slate-50"
									>
										<i className="fa-solid fa-id-badge text-[0.8rem]"></i>
										<span>My Profile</span>
									</button>
									<button
										onClick={() => {
											logout();
											navigate('/login', { replace: true });
											closeAll();
										}}
										className="flex w-full items-center gap-2 px-3 py-2 text-left text-red-600 hover:bg-red-50"
									>
										<i className="fa-solid fa-right-from-bracket text-[0.8rem]"></i>
										<span>Logout</span>
									</button>
								</div>
							)}
						</div>
					</div>
				</div>
			)}
			<Sidebar />
			<main className="flex flex-1 items-start gap-6">
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
	);
}

