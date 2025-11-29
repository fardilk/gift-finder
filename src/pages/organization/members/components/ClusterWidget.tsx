import React, { useState } from 'react';

interface Cluster {
	id: number;
	name: string;
	color?: string;
	memberCount?: number;
}

interface ClusterWidgetProps {
	member: {
		id: number;
		clusters?: Cluster[];
	};
	availableClusters: Cluster[];
	onAssignCluster: (memberId: number, clusterId: number) => void;
	onRemoveCluster: (memberId: number, clusterId: number) => void;
}

export default function ClusterWidget({
	member,
	availableClusters,
	onAssignCluster,
	onRemoveCluster,
}: ClusterWidgetProps) {
	const [isAssigning, setIsAssigning] = useState(false);
	const assignedClusters = member.clusters || [];
	const unassignedClusters = availableClusters.filter(
		(cluster) => !assignedClusters.some((ac) => ac.id === cluster.id)
	);

	const handleAssign = (clusterId: number) => {
		onAssignCluster(member.id, clusterId);
		setIsAssigning(false);
	};

	return (
		<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
			<div className="mb-4 flex items-center justify-between">
				<h3 className="text-lg font-semibold text-gray-900">Clusters</h3>
				{unassignedClusters.length > 0 && (
					<button
						onClick={() => setIsAssigning(!isAssigning)}
						className="rounded-md bg-purple-600 px-3 py-1 text-sm text-white hover:bg-purple-700"
					>
						<i className="fa-solid fa-plus mr-1"></i>
						Assign
					</button>
				)}
			</div>

			{isAssigning && unassignedClusters.length > 0 && (
				<div className="mb-4 rounded-lg border border-purple-200 bg-purple-50 p-3">
					<p className="mb-2 text-sm font-medium text-gray-700">Select a cluster:</p>
					<div className="space-y-2">
						{unassignedClusters.map((cluster) => (
							<button
								key={cluster.id}
								onClick={() => handleAssign(cluster.id)}
								className="flex w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50"
							>
								<span className="font-medium text-gray-900">{cluster.name}</span>
								<i className="fa-solid fa-plus text-purple-600"></i>
							</button>
						))}
					</div>
				</div>
			)}

			{assignedClusters.length > 0 ? (
				<div className="space-y-2">
					{assignedClusters.map((cluster) => (
						<div
							key={cluster.id}
							className="flex items-center justify-between rounded-lg border border-gray-100 bg-gradient-to-r from-purple-50 to-white p-3"
						>
							<div className="flex items-center">
								<div
									className={`mr-3 h-3 w-3 rounded-full bg-${cluster.color || 'purple'}-500`}
								></div>
								<div>
									<h4 className="font-medium text-gray-900">{cluster.name}</h4>
									{cluster.memberCount && (
										<p className="text-xs text-gray-500">
											{cluster.memberCount} members
										</p>
									)}
								</div>
							</div>
							<button
								onClick={() => onRemoveCluster(member.id, cluster.id)}
								className="text-red-600 hover:text-red-800"
								title="Remove from cluster"
							>
								<i className="fa-solid fa-times"></i>
							</button>
						</div>
					))}
				</div>
			) : (
				<div className="flex items-center justify-center py-8 text-gray-400">
					<div className="text-center">
						<i className="fa-solid fa-layer-group mb-2 text-3xl"></i>
						<p className="text-sm">Not assigned to any cluster</p>
					</div>
				</div>
			)}
		</div>
	);
}
