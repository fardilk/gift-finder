import React from 'react';

export default function OrganizationMembersPage() {
	const members = [
		{ id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
		{ id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Member', status: 'Active' },
		{ id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Member', status: 'Pending' },
	];

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Members</h1>
					<p className="mt-2 text-gray-600">
						Manage organization members and their permissions
					</p>
				</div>
				<button className="rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700">
					<i className="fa-solid fa-plus mr-2"></i>
					Add Member
				</button>
			</div>

			<div className="rounded-lg border border-gray-200 bg-white shadow-sm">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="border-b border-gray-200 bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
								<th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
								<th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Role</th>
								<th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
								<th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200">
							{members.map((member) => (
								<tr key={member.id} className="hover:bg-gray-50">
									<td className="px-6 py-4 text-sm text-gray-900">{member.name}</td>
									<td className="px-6 py-4 text-sm text-gray-600">{member.email}</td>
									<td className="px-6 py-4 text-sm text-gray-600">{member.role}</td>
									<td className="px-6 py-4">
										<span
											className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
												member.status === 'Active'
													? 'bg-green-100 text-green-800'
													: 'bg-yellow-100 text-yellow-800'
											}`}
										>
											{member.status}
										</span>
									</td>
									<td className="px-6 py-4 text-right text-sm">
										<button className="text-purple-600 hover:text-purple-800">
											<i className="fa-solid fa-pen-to-square"></i>
										</button>
										<button className="ml-3 text-red-600 hover:text-red-800">
											<i className="fa-solid fa-trash"></i>
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
