import React from 'react';

export default function OrganizationClustersPage() {
	const clusters = [
		{ id: 1, name: 'Engineering Team', members: 45, color: 'blue' },
		{ id: 2, name: 'Sales Department', members: 28, color: 'green' },
		{ id: 3, name: 'Marketing Team', members: 32, color: 'purple' },
		{ id: 4, name: 'HR Department', members: 12, color: 'amber' },
	];

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Clusters</h1>
					<p className="mt-2 text-gray-600">
						Organize members into teams and departments
					</p>
				</div>
				<button className="rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700">
					<i className="fa-solid fa-plus mr-2"></i>
					Create Cluster
				</button>
			</div>

			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{clusters.map((cluster) => (
					<div
						key={cluster.id}
						className={`rounded-lg border border-${cluster.color}-100 bg-gradient-to-br from-${cluster.color}-50 to-white p-6 shadow-sm`}
					>
						<div className="flex items-start justify-between">
							<div>
								<h3 className="text-lg font-semibold text-gray-900">{cluster.name}</h3>
								<p className="mt-2 text-sm text-gray-600">
									<i className="fa-solid fa-users mr-2"></i>
									{cluster.members} members
								</p>
							</div>
							<button className="text-gray-400 hover:text-gray-600">
								<i className="fa-solid fa-ellipsis-vertical"></i>
							</button>
						</div>
						<div className="mt-4 flex gap-2">
							<button className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50">
								View
							</button>
							<button className="flex-1 rounded-md bg-purple-600 px-3 py-2 text-sm text-white hover:bg-purple-700">
								Manage
							</button>
						</div>
					</div>
				))}
			</div>

			<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
				<h2 className="text-xl font-semibold text-gray-900">Cluster Statistics</h2>
				<div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
					<div className="rounded-lg border border-gray-100 p-4">
						<p className="text-sm text-gray-600">Total Clusters</p>
						<p className="mt-1 text-2xl font-bold text-gray-900">{clusters.length}</p>
					</div>
					<div className="rounded-lg border border-gray-100 p-4">
						<p className="text-sm text-gray-600">Total Members</p>
						<p className="mt-1 text-2xl font-bold text-gray-900">
							{clusters.reduce((sum, c) => sum + c.members, 0)}
						</p>
					</div>
					<div className="rounded-lg border border-gray-100 p-4">
						<p className="text-sm text-gray-600">Avg. Members/Cluster</p>
						<p className="mt-1 text-2xl font-bold text-gray-900">
							{Math.round(clusters.reduce((sum, c) => sum + c.members, 0) / clusters.length)}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
