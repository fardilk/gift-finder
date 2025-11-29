import React, { useState } from 'react';
import ClusterList from './views/ClusterList';
import ClusterForm from './forms/ClusterForm';

export default function ClustersPage() {
	const [showCreateForm, setShowCreateForm] = useState(false);

	// Mock data - replace with actual API calls
	const [clusters, setClusters] = useState([
		{
			id: 1,
			name: 'Engineering Team',
			description: 'Software development and technical infrastructure',
			color: 'blue',
			memberCount: 45,
			members: [
				{ id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
				{ id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' },
			],
		},
		{
			id: 2,
			name: 'Sales Department',
			description: 'Customer acquisition and business development',
			color: 'green',
			memberCount: 28,
			members: [],
		},
		{
			id: 3,
			name: 'Marketing Team',
			description: 'Brand management and customer engagement',
			color: 'purple',
			memberCount: 32,
			members: [],
		},
		{
			id: 4,
			name: 'HR Department',
			description: 'Human resources and talent management',
			color: 'orange',
			memberCount: 12,
			members: [],
		},
	]);

	const handleCreateCluster = async (data: { name: string; description?: string; color?: string }) => {
		console.log('Creating cluster:', data);
		// TODO: Implement actual API call
		const newCluster = {
			id: clusters.length + 1,
			name: data.name,
			description: data.description || '',
			color: data.color || 'purple',
			memberCount: 0,
			members: [],
		};
		setClusters([...clusters, newCluster]);
		setShowCreateForm(false);
	};

	const handleDeleteCluster = (id: number) => {
		setClusters(clusters.filter((c) => c.id !== id));
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Clusters</h1>
					<p className="mt-2 text-gray-600">Organize members into teams and departments</p>
				</div>
				{!showCreateForm && (
					<button
						onClick={() => setShowCreateForm(true)}
						className="rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
					>
						<i className="fa-solid fa-plus mr-2"></i>
						Create Cluster
					</button>
				)}
			</div>

			{showCreateForm ? (
				<ClusterForm
					onSubmit={handleCreateCluster}
					onCancel={() => setShowCreateForm(false)}
				/>
			) : (
				<ClusterList clusters={clusters} onDelete={handleDeleteCluster} />
			)}
		</div>
	);
}
