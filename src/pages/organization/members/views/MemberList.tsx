import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showSuccessToast } from '@/shared/components/toast/successToast';

interface Member {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	role?: string;
	status: 'active' | 'pending' | 'inactive';
	clusters?: { id: number; name: string }[];
}

interface MemberListProps {
	members: Member[];
	onDelete: (id: number) => void;
}

export default function MemberList({ members, onDelete }: MemberListProps) {
	const navigate = useNavigate();
	const [searchTerm, setSearchTerm] = useState('');
	const [statusFilter, setStatusFilter] = useState<string>('all');

	const filteredMembers = members.filter((member) => {
		const matchesSearch =
			member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			member.email.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
		return matchesSearch && matchesStatus;
	});

	const handleDelete = (id: number, name: string) => {
		if (window.confirm(`Are you sure you want to delete ${name}?`)) {
			onDelete(id);
			showSuccessToast('Member Deletion');
		}
	};

	const statusStyles = {
		active: 'bg-green-100 text-green-800',
		pending: 'bg-yellow-100 text-yellow-800',
		inactive: 'bg-gray-100 text-gray-800',
	};

	return (
		<div className="space-y-4">
			{/* Search and Filter */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="relative flex-1">
					<i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
					<input
						type="text"
						placeholder="Search members by name or email..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 focus:border-purple-500 focus:outline-none focus:ring-purple-500"
					/>
				</div>
				<select
					value={statusFilter}
					onChange={(e) => setStatusFilter(e.target.value)}
					className="rounded-md border border-gray-300 px-4 py-2 focus:border-purple-500 focus:outline-none focus:ring-purple-500"
				>
					<option value="all">All Status</option>
					<option value="active">Active</option>
					<option value="pending">Pending</option>
					<option value="inactive">Inactive</option>
				</select>
			</div>

			{/* Members Table */}
			<div className="rounded-lg border border-gray-200 bg-white shadow-sm">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="border-b border-gray-200 bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
									Name
								</th>
								<th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
									Email
								</th>
								<th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
									Clusters
								</th>
								<th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
									Status
								</th>
								<th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200">
							{filteredMembers.length > 0 ? (
								filteredMembers.map((member) => (
									<tr key={member.id} className="hover:bg-gray-50">
										<td className="px-6 py-4">
											<div className="flex items-center">
												<div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
													<span className="font-semibold text-purple-600">
														{member.firstName[0]}
														{member.lastName[0]}
													</span>
												</div>
												<div className="ml-3">
													<p className="text-sm font-medium text-gray-900">
														{member.firstName} {member.lastName}
													</p>
													{member.role && (
														<p className="text-xs text-gray-500">
															{member.role}
														</p>
													)}
												</div>
											</div>
										</td>
										<td className="px-6 py-4 text-sm text-gray-600">
											{member.email}
										</td>
										<td className="px-6 py-4">
											{member.clusters && member.clusters.length > 0 ? (
												<div className="flex flex-wrap gap-1">
													{member.clusters.slice(0, 2).map((cluster) => (
														<span
															key={cluster.id}
															className="inline-flex rounded-full bg-purple-100 px-2 py-1 text-xs font-semibold text-purple-800"
														>
															{cluster.name}
														</span>
													))}
													{member.clusters.length > 2 && (
														<span className="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-600">
															+{member.clusters.length - 2}
														</span>
													)}
												</div>
											) : (
												<span className="text-sm text-gray-400">
													No clusters
												</span>
											)}
										</td>
										<td className="px-6 py-4">
											<span
												className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusStyles[member.status]}`}
											>
												{member.status}
											</span>
										</td>
										<td className="px-6 py-4 text-right text-sm">
											<button
												onClick={() =>
													navigate(`/organization/members/${member.id}`)
												}
												className="text-purple-600 hover:text-purple-800"
												title="View details"
											>
												<i className="fa-solid fa-eye"></i>
											</button>
											<button
												onClick={() =>
													navigate(`/organization/members/${member.id}/edit`)
												}
												className="ml-3 text-blue-600 hover:text-blue-800"
												title="Edit member"
											>
												<i className="fa-solid fa-pen-to-square"></i>
											</button>
											<button
												onClick={() =>
													handleDelete(
														member.id,
														`${member.firstName} ${member.lastName}`
													)
												}
												className="ml-3 text-red-600 hover:text-red-800"
												title="Delete member"
											>
												<i className="fa-solid fa-trash"></i>
											</button>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td
										colSpan={5}
										className="px-6 py-12 text-center text-gray-500"
									>
										<i className="fa-solid fa-users mb-3 text-4xl text-gray-300"></i>
										<p>No members found</p>
										{searchTerm && (
											<p className="mt-1 text-sm">
												Try adjusting your search or filter
											</p>
										)}
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>

			{/* Members Count */}
			<div className="flex items-center justify-between text-sm text-gray-600">
				<p>
					Showing {filteredMembers.length} of {members.length} member
					{members.length !== 1 ? 's' : ''}
				</p>
			</div>
		</div>
	);
}
