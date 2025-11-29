import React, { useState } from 'react';
import MemberList from './views/MemberList';
import AddMemberForm from './forms/AddMemberForm';

export default function MembersPage() {
	const [showAddForm, setShowAddForm] = useState(false);

	// Mock data - replace with actual API calls
	const [members, setMembers] = useState([
		{
			id: 1,
			firstName: 'John',
			lastName: 'Doe',
			email: 'john@example.com',
			role: 'Admin',
			status: 'active' as const,
			clusters: [
				{ id: 1, name: 'Engineering Team' },
				{ id: 2, name: 'Leadership' },
			],
		},
		{
			id: 2,
			firstName: 'Jane',
			lastName: 'Smith',
			email: 'jane@example.com',
			role: 'Member',
			status: 'active' as const,
			clusters: [{ id: 1, name: 'Engineering Team' }],
		},
		{
			id: 3,
			firstName: 'Bob',
			lastName: 'Johnson',
			email: 'bob@example.com',
			role: 'Member',
			status: 'pending' as const,
			clusters: [],
		},
	]);

	const handleAddMember = async (data: { mode: string; data?: Record<string, string> }) => {
		console.log('Adding member:', data);
		// TODO: Implement actual API call
		// For now, simulate adding a new member
		if (data.mode === 'manual' && data.data) {
			const newMember = {
				id: members.length + 1,
				firstName: data.data.firstName,
				lastName: data.data.lastName,
				email: data.data.email,
				role: 'Member',
				status: 'active' as const,
				clusters: [],
			};
			setMembers([...members, newMember]);
		}
		setShowAddForm(false);
	};

	const handleDeleteMember = (id: number) => {
		setMembers(members.filter((m) => m.id !== id));
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Members</h1>
					<p className="mt-2 text-gray-600">Manage organization members and their permissions</p>
				</div>
				{!showAddForm && (
					<button
						onClick={() => setShowAddForm(true)}
						className="rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
					>
						<i className="fa-solid fa-plus mr-2"></i>
						Add Member
					</button>
				)}
			</div>

			{showAddForm ? (
				<AddMemberForm onSubmit={handleAddMember} onCancel={() => setShowAddForm(false)} />
			) : (
				<MemberList members={members} onDelete={handleDeleteMember} />
			)}
		</div>
	);
}
