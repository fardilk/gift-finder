import React from 'react';
import { useNavigate } from 'react-router-dom';
import api from 'src/lib/api';

type AdminCreateUserDto = {
	email: string;
	password: string;
	personName?: string;
	firstName?: string;
	lastName?: string;
	address?: string;
	accessIds?: string[]; // ac02 (individual), ac01 (organization), ac03 (administrator)
};

const ACCESS_OPTIONS = [
	{ id: 'ac02', label: 'Individual' },
	{ id: 'ac01', label: 'Organization' },
	{ id: 'ac03', label: 'Administrator' },
];

export default function CreateUserForms() {
	const navigate = useNavigate();
	const [form, setForm] = React.useState<AdminCreateUserDto>({
		email: '',
		password: 'default',
		personName: '',
		firstName: '',
		lastName: '',
		address: '',
		accessIds: [],
	});
	const [submitting, setSubmitting] = React.useState(false);
	const [error, setError] = React.useState<string | null>(null);

	function update<K extends keyof AdminCreateUserDto>(key: K, value: AdminCreateUserDto[K]) {
		setForm((f) => ({ ...f, [key]: value }));
	}

	function toggleAccess(id: string) {
		setForm((f) => {
			const current = new Set(f.accessIds ?? []);
			if (current.has(id)) current.delete(id);
			else current.add(id);
			return { ...f, accessIds: Array.from(current) };
		});
	}

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setSubmitting(true);
		setError(null);
		try {
			const payload: AdminCreateUserDto = {
				email: form.email.trim(),
				password: form.password,
				personName: form.personName?.trim() || undefined,
				firstName: form.firstName?.trim() || undefined,
				lastName: form.lastName?.trim() || undefined,
				address: form.address?.trim() || undefined,
				accessIds: form.accessIds && form.accessIds.length ? form.accessIds : undefined,
			};
			await api.post('/users', payload);
			alert('User created successfully');
			navigate('/user-management');
		} catch (e: unknown) {
			setError('Failed to create user');
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<div className="p-6">
			<h1 className="mb-4 text-2xl font-semibold">Create User</h1>
			{error && <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}
			<form onSubmit={onSubmit} className="grid max-w-2xl gap-4">
				<label className="grid gap-1">
					<span className="text-sm text-gray-600">Email</span>
					<input
						type="email"
						required
						value={form.email}
						onChange={(e) => update('email', e.target.value)}
						className="rounded-md px-3 py-2 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-purple-300"
						placeholder="new.user@example.com"
					/>
				</label>
				<label className="grid gap-1">
					<span className="text-sm text-gray-600">Password</span>
					<input
						type="text"
						required
						value={form.password}
						onChange={(e) => update('password', e.target.value)}
						className="rounded-md px-3 py-2 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-purple-300"
						placeholder="default"
					/>
				</label>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<label className="grid gap-1">
						<span className="text-sm text-gray-600">Person name (display)</span>
						<input
							value={form.personName}
							onChange={(e) => update('personName', e.target.value)}
							className="rounded-md px-3 py-2 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-purple-300"
							placeholder="New User"
						/>
					</label>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<label className="grid gap-1">
							<span className="text-sm text-gray-600">First name</span>
							<input
								value={form.firstName}
								onChange={(e) => update('firstName', e.target.value)}
								className="rounded-md px-3 py-2 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-purple-300"
								placeholder="New"
							/>
						</label>
						<label className="grid gap-1">
							<span className="text-sm text-gray-600">Last name</span>
							<input
								value={form.lastName}
								onChange={(e) => update('lastName', e.target.value)}
								className="rounded-md px-3 py-2 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-purple-300"
								placeholder="User"
							/>
						</label>
					</div>
				</div>
				<label className="grid gap-1">
					<span className="text-sm text-gray-600">Address</span>
					<textarea
						value={form.address}
						onChange={(e) => update('address', e.target.value)}
						rows={3}
						className="rounded-md px-3 py-2 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-purple-300"
						placeholder="Somewhere"
					/>
				</label>
				<div className="grid gap-2">
					<div className="text-sm text-gray-600">Access roles</div>
					<div className="flex flex-wrap gap-3">
						{ACCESS_OPTIONS.map((opt) => (
							<label key={opt.id} className="inline-flex items-center gap-2 text-sm">
								<input
									type="checkbox"
									checked={!!form.accessIds?.includes(opt.id)}
									onChange={() => toggleAccess(opt.id)}
								/>
								<span>{opt.label} ({opt.id})</span>
							</label>
						))}
					</div>
				</div>
				<div className="flex gap-2 pt-2">
					<button
						type="submit"
						disabled={submitting}
						className="rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 disabled:opacity-60"
					>
						{submitting ? 'Creating…' : 'Create user'}
					</button>
					<button
						type="button"
						onClick={() => navigate('/user-management')}
						className="rounded-md px-4 py-2 text-gray-700 hover:bg-gray-50"
					>
						Cancel
					</button>
				</div>
			</form>
		</div>
	);
}
