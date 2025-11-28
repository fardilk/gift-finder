import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'src/auth/context/app-auth/AuthProvider';

export function ProfileMenu() {
	const { logout } = useAuth();
	const navigate = useNavigate();
	const [openProfile, setOpenProfile] = React.useState(false);
	const [openSettings, setOpenSettings] = React.useState(false);

	function go(path: string) {
		navigate(path);
	}

	function closeAll() {
		setOpenProfile(false);
		setOpenSettings(false);
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
		<div data-topbar>
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
	);
}

export default ProfileMenu;
