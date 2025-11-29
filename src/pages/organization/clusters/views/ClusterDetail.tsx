import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showSuccessToast } from '@/shared/components/toast/successToast';

interface Member {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	photo?: string;
	role?: string;
}

interface ClusterDetailProps {
	cluster: {
		id: number;
		name: string;
		description?: string;
		color?: string;
		memberCount: number;
		members: Member[];
	};
	availableMembers: Member[];
	onAddMember: (clusterId: number, memberId: number) => void;
	onRemoveMember: (clusterId: number, memberId: number) => void;
}

export default function ClusterDetail({
	cluster,
	availableMembers,
	onAddMember,
	onRemoveMember,
}: ClusterDetailProps) {
	const navigate = useNavigate();
	const [showAddMember, setShowAddMember] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');

	const filteredAvailableMembers = availableMembers.filter(
		(member) =>
			member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			member.email.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handleAddMember = (memberId: number) => {
		onAddMember(cluster.id, memberId);
		showSuccessToast('Member Addition to Cluster');
		setShowAddMember(false);
		setSearchTerm('');
	};

	const handleRemoveMember = (memberId: number, memberName: string) => {
		if (window.confirm(`Remove ${memberName} from ${cluster.name}?`)) {
			onRemoveMember(cluster.id, memberId);
			showSuccessToast('Member Removal from Cluster');
		}
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center space-x-4">
					<button
						onClick={() => navigate('/organization/clusters')}
						className="text-gray-600 hover:text-gray-900"
					>
						<i className="fa-solid fa-arrow-left mr-2"></i>
						Back to Clusters
					</button>
				</div>
				<button
					onClick={() => navigate(`/organization/clusters/${cluster.id}/edit`)}
					className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
				>
					<i className="fa-solid fa-pen-to-square mr-2"></i>
					Edit Cluster
				</button>
			</div>

			{/* Cluster Info Card */}
			<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
				<div className="flex items-start justify-between">
					<div className="flex-1">
						<div className="flex items-center">
							<div
								className={`mr-3 h-4 w-4 rounded-full bg-${cluster.color || 'purple'}-500`}
								style={{
									backgroundColor:
										cluster.color === 'purple'
											? '#9333ea'
											: cluster.color === 'blue'
												? '#3b82f6'
												: cluster.color === 'green'
													? '#22c55e'
													: cluster.color === 'red'
														? '#ef4444'
														: cluster.color === 'yellow'
															? '#eab308'
															: cluster.color === 'pink'
																? '#ec4899'
																: cluster.color === 'indigo'
																	? '#6366f1'
																	: cluster.color === 'orange'
																		? '#f97316'
																		: '#9333ea',
								}}
							></div>
							<h1 className="text-2xl font-bold text-gray-900">{cluster.name}</h1>
						</div>
						{cluster.description && (
							<p className="mt-2 text-gray-600">{cluster.description}</p>
						)}
						<div className="mt-3 flex items-center space-x-6 text-sm text-gray-600">
							<span>
								<i className="fa-solid fa-users mr-2"></i>
								{cluster.memberCount} {cluster.memberCount === 1 ? 'Member' : 'Members'}
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* Members Section */}
			<div className="rounded-lg border border-gray-200 bg-white shadow-sm">
				<div className="border-b border-gray-200 px-6 py-4">
					<div className="flex items-center justify-between">
						<h2 className="text-xl font-semibold text-gray-900">Members</h2>
						<button
							onClick={() => setShowAddMember(!showAddMember)}
							className="rounded-md bg-purple-600 px-4 py-2 text-sm text-white hover:bg-purple-700"
						>
							<i className="fa-solid fa-plus mr-2"></i>
							Add Member
						</button>
					</div>
				</div>

				{/* Add Member Section */}
				{showAddMember && (
					<div className="border-b border-gray-200 bg-purple-50 p-4">
						<div className="mb-3 flex items-center justify-between">
							<p className="text-sm font-medium text-gray-700">
								Select members to add to this cluster:
							</p>
							<button
								onClick={() => {
									setShowAddMember(false);
									setSearchTerm('');
								}}
								className="text-gray-500 hover:text-gray-700"
							>
								<i className="fa-solid fa-times"></i>
							</button>
						</div>

						<div className="relative mb-3">
							<i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
							<input
								type="text"
								placeholder="Search members..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 focus:border-purple-500 focus:outline-none focus:ring-purple-500"
							/>
						</div>

						<div className="max-h-64 space-y-2 overflow-y-auto">
							{filteredAvailableMembers.length > 0 ? (
								filteredAvailableMembers.map((member) => (
									<button
										key={member.id}
										onClick={() => handleAddMember(member.id)}
										className="flex w-full items-center justify-between rounded-md border border-gray-200 bg-white p-3 text-left hover:bg-gray-50"
									>
										<div className="flex items-center">
											{member.photo ? (
												<img
													src={member.photo}
													alt={`${member.firstName} ${member.lastName}`}
													className="h-8 w-8 rounded-full object-cover"
												/>
											) : (
												<div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
													<span className="text-sm font-semibold text-purple-600">
														{member.firstName[0]}
														{member.lastName[0]}
													</span>
												</div>
											)}
											<div className="ml-3">
												<p className="text-sm font-medium text-gray-900">
													{member.firstName} {member.lastName}
												</p>
												<p className="text-xs text-gray-500">{member.email}</p>
											</div>
										</div>
										<i className="fa-solid fa-plus text-purple-600"></i>
									</button>
								))
							) : (
								<div className="py-8 text-center text-gray-500">
									<i className="fa-solid fa-users-slash mb-2 text-3xl text-gray-300"></i>
									<p className="text-sm">
										{availableMembers.length === 0
											? 'All members are already in this cluster'
											: 'No members match your search'}
									</p>
								</div>
							)}
						</div>
					</div>
				)}

				{/* Members List */}
				<div className="p-6">
					{cluster.members.length > 0 ? (
						<div className="space-y-3">
							{cluster.members.map((member) => (
								<div
									key={member.id}
									className="flex items-center justify-between rounded-lg border border-gray-100 p-4 hover:bg-gray-50"
								>
									<div className="flex items-center">
										{member.photo ? (
											<img
												src={member.photo}
												alt={`${member.firstName} ${member.lastName}`}
												className="h-12 w-12 rounded-full object-cover"
											/>
										) : (
											<div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
												<span className="font-semibold text-purple-600">
													{member.firstName[0]}
													{member.lastName[0]}
												</span>
											</div>
										)}
										<div className="ml-4">
											<p className="font-medium text-gray-900">
												{member.firstName} {member.lastName}
											</p>
											<p className="text-sm text-gray-500">{member.email}</p>
											{member.role && (
												<p className="text-xs text-gray-400">{member.role}</p>
											)}
										</div>
									</div>
									<div className="flex items-center space-x-3">
										<button
											onClick={() => navigate(`/organization/members/${member.id}`)}
											className="text-purple-600 hover:text-purple-800"
											title="View member details"
										>
											<i className="fa-solid fa-eye"></i>
										</button>
										<button
											onClick={() =>
												handleRemoveMember(
													member.id,
													`${member.firstName} ${member.lastName}`
												)
											}
											className="text-red-600 hover:text-red-800"
											title="Remove from cluster"
										>
											<i className="fa-solid fa-user-minus"></i>
										</button>
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="flex items-center justify-center py-12 text-gray-400">
							<div className="text-center">
								<i className="fa-solid fa-users-slash mb-3 text-4xl text-gray-300"></i>
								<p>No members in this cluster yet</p>
								<p className="mt-1 text-sm">Click &quot;Add Member&quot; to get started</p>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
