import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from 'src/lib/api';
import { isProfileComplete } from '../../../shared/utils/profileValidation';

type UserRow = {
	id: string;
	name?: string;
	email: string;
	role?: string;
	status?: 'active' | 'invited' | 'disabled';
	firstName?: string;
	lastName?: string;
	address?: string;
};

async function getUser(id: string): Promise<UserRow | null> {
	try {
		const res = await api.get<UserRow>(`/users/${id}`);
		return res.data ?? null;
	} catch {
		// Try fallback by loading list then find
		try {
			const list = await api.get<UserRow[]>('/users');
			return list.data?.find((u) => u.id === id) ?? null;
		} catch {
			return null;
		}
	}
}

export default function ViewDetailUser() {
	const { userId = '' } = useParams();
	const navigate = useNavigate();
	const location = useLocation() as { state?: UserRow };
	const stateUser = location.state;

	const { data: user, isLoading, error } = useQuery({
		queryKey: ['user', userId],
		queryFn: () => getUser(userId),
		enabled: !!userId && !stateUser,
		initialData: stateUser ?? undefined,
	});

	if (!userId) {
		return (
			<div className="p-6">
				<div className="text-sm text-gray-500">No user selected.</div>
			</div>
		);
	}

	if (isLoading) {
		return <div className="p-6 text-gray-500">Loading…</div>;
	}
	if (error) {
		return <div className="p-6 text-red-600">Failed to load user.</div>;
	}
	if (!user) {
		return (
			<div className="p-6">
				<div className="mb-3 text-sm text-gray-500">User not found.</div>
				<button onClick={() => navigate('/user-management')} className="rounded-md px-4 py-2 text-gray-700 hover:bg-gray-50">Back</button>
			</div>
		);
	}

	const incomplete = !isProfileComplete({ id: user.id, email: user.email, name: user.name });

	return (
		<div className="p-6">
			<div className="mb-4 flex items-start justify-between">
				<div>
					<h1 className="text-2xl font-semibold">{user.name || user.email}</h1>
					<div className="text-sm text-gray-500">ID: {user.id}</div>
				</div>
				<button onClick={() => navigate('/user-management')} className="rounded-md px-4 py-2 text-gray-700 hover:bg-gray-50">Back</button>
			</div>

			{incomplete && (
				<div className="mb-4 rounded-md bg-amber-50 p-3 text-sm text-amber-800">
					This profile is incomplete. Please complete the profile fields below.
				</div>
			)}

			<div className="grid max-w-2xl gap-4">
				<div>
					<div className="text-xs text-gray-500">Email</div>
					<div className="text-sm text-gray-800">{user.email}</div>
				</div>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div>
						<div className="text-xs text-gray-500">First name</div>
						<div className="text-sm text-gray-800">{user.firstName || '-'}</div>
					</div>
					<div>
						<div className="text-xs text-gray-500">Last name</div>
						<div className="text-sm text-gray-800">{user.lastName || '-'}</div>
					</div>
				</div>
				<div>
					<div className="text-xs text-gray-500">Address</div>
					<div className="text-sm text-gray-800">{user.address || '-'}</div>
				</div>
			</div>
		</div>
	);
}
