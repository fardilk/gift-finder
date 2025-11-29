import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showSuccessToast } from '@/shared/components/toast/successToast';

interface Cluster {
	id: number;
	name: string;
	description?: string;
	color?: string;
	memberCount: number;
	members?: Array<{
		id: number;
		firstName: string;
		lastName: string;
	}>;
}

interface ClusterListProps {
	clusters: Cluster[];
	onDelete: (id: number) => void;
}

export default function ClusterList({ clusters, onDelete }: ClusterListProps) {
	const navigate = useNavigate();
	const [searchTerm, setSearchTerm] = useState('');
	const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

	const filteredClusters = clusters.filter((cluster) =>
		cluster.name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handleDelete = (id: number, name: string) => {
		if (window.confirm(`Are you sure you want to delete "${name}" cluster?`)) {
			onDelete(id);
			showSuccessToast('Cluster Deletion');
		}
	};

	const totalMembers = clusters.reduce((sum, cluster) => sum + cluster.memberCount, 0);
	const avgMembersPerCluster = clusters.length > 0 ? Math.round(totalMembers / clusters.length) : 0;

	return (
		<div className="space-y-6">
			{/* Search and View Toggle */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="relative flex-1">
					<i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
					<input
						type="text"
						placeholder="Search clusters..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 focus:border-purple-500 focus:outline-none focus:ring-purple-500"
					/>
				</div>
				<div className="flex rounded-md border border-gray-300">
					<button
						onClick={() => setViewMode('grid')}
						className={`px-4 py-2 ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
					>
						<i className="fa-solid fa-grid"></i>
					</button>
					<button
						onClick={() => setViewMode('list')}
						className={`border-l border-gray-300 px-4 py-2 ${viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
					>
						<i className="fa-solid fa-list"></i>
					</button>
				</div>
			</div>

			{/* Statistics Cards */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
				<div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
					<p className="text-sm text-gray-600">Total Clusters</p>
					<p className="mt-1 text-2xl font-bold text-gray-900">{clusters.length}</p>
				</div>
				<div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
					<p className="text-sm text-gray-600">Total Members</p>
					<p className="mt-1 text-2xl font-bold text-gray-900">{totalMembers}</p>
				</div>
				<div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
					<p className="text-sm text-gray-600">Avg. Members/Cluster</p>
					<p className="mt-1 text-2xl font-bold text-gray-900">{avgMembersPerCluster}</p>
				</div>
			</div>

			{/* Clusters Grid/List */}
			{filteredClusters.length > 0 ? (
				viewMode === 'grid' ? (
					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{filteredClusters.map((cluster) => (
							<div
								key={cluster.id}
								className="group rounded-lg border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 shadow-sm transition-all hover:shadow-md"
								style={{
									background: `linear-gradient(135deg, var(--tw-gradient-from), var(--tw-gradient-to))`,
								}}
							>
								<div className="flex items-start justify-between">
									<div className="flex-1">
										<div className="flex items-center">
											<div
												className={`mr-3 h-3 w-3 rounded-full bg-${cluster.color || 'purple'}-500`}
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
											<h3 className="text-lg font-semibold text-gray-900">
												{cluster.name}
											</h3>
										</div>
										{cluster.description && (
											<p className="mt-2 text-sm text-gray-600 line-clamp-2">
												{cluster.description}
											</p>
										)}
										<div className="mt-3 flex items-center text-sm text-gray-600">
											<i className="fa-solid fa-users mr-2"></i>
											<span>{cluster.memberCount} members</span>
										</div>
									</div>
									<div className="relative">
										<button className="text-gray-400 hover:text-gray-600">
											<i className="fa-solid fa-ellipsis-vertical"></i>
										</button>
									</div>
								</div>
								<div className="mt-4 flex gap-2">
									<button
										onClick={() => navigate(`/organization/clusters/${cluster.id}`)}
										className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
									>
										<i className="fa-solid fa-eye mr-1"></i>
										View
									</button>
									<button
										onClick={() =>
											navigate(`/organization/clusters/${cluster.id}/edit`)
										}
										className="flex-1 rounded-md bg-purple-600 px-3 py-2 text-sm text-white hover:bg-purple-700"
									>
										<i className="fa-solid fa-pen-to-square mr-1"></i>
										Edit
									</button>
									<button
										onClick={() => handleDelete(cluster.id, cluster.name)}
										className="rounded-md border border-red-300 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
									>
										<i className="fa-solid fa-trash"></i>
									</button>
								</div>
							</div>
						))}
					</div>
				) : (
					<div className="rounded-lg border border-gray-200 bg-white shadow-sm">
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead className="border-b border-gray-200 bg-gray-50">
									<tr>
										<th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
											Cluster Name
										</th>
										<th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
											Description
										</th>
										<th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
											Members
										</th>
										<th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
											Actions
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-200">
									{filteredClusters.map((cluster) => (
										<tr key={cluster.id} className="hover:bg-gray-50">
											<td className="px-6 py-4">
												<div className="flex items-center">
													<div
														className={`mr-3 h-3 w-3 rounded-full bg-${cluster.color || 'purple'}-500`}
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
													<span className="font-medium text-gray-900">
														{cluster.name}
													</span>
												</div>
											</td>
											<td className="px-6 py-4 text-sm text-gray-600">
												{cluster.description || (
													<span className="text-gray-400">No description</span>
												)}
											</td>
											<td className="px-6 py-4 text-sm text-gray-600">
												<i className="fa-solid fa-users mr-1"></i>
												{cluster.memberCount}
											</td>
											<td className="px-6 py-4 text-right text-sm">
												<button
													onClick={() =>
														navigate(`/organization/clusters/${cluster.id}`)
													}
													className="text-purple-600 hover:text-purple-800"
													title="View details"
												>
													<i className="fa-solid fa-eye"></i>
												</button>
												<button
													onClick={() =>
														navigate(
															`/organization/clusters/${cluster.id}/edit`
														)
													}
													className="ml-3 text-blue-600 hover:text-blue-800"
													title="Edit cluster"
												>
													<i className="fa-solid fa-pen-to-square"></i>
												</button>
												<button
													onClick={() => handleDelete(cluster.id, cluster.name)}
													className="ml-3 text-red-600 hover:text-red-800"
													title="Delete cluster"
												>
													<i className="fa-solid fa-trash"></i>
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				)
			) : (
				<div className="flex items-center justify-center rounded-lg border border-gray-200 bg-white py-12 shadow-sm">
					<div className="text-center text-gray-500">
						<i className="fa-solid fa-layer-group mb-3 text-4xl text-gray-300"></i>
						<p>No clusters found</p>
						{searchTerm && <p className="mt-1 text-sm">Try adjusting your search</p>}
					</div>
				</div>
			)}

			{/* Cluster Count */}
			<div className="flex items-center justify-between text-sm text-gray-600">
				<p>
					Showing {filteredClusters.length} of {clusters.length} cluster
					{clusters.length !== 1 ? 's' : ''}
				</p>
			</div>
		</div>
	);
}
