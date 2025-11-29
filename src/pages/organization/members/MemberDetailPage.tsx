import React, { useState } from 'react';
import MemberDetail from './views/MemberDetail';

// Mock data showing bidirectional relationship
const mockMembers = [
	{
		id: 1,
		photo: '',
		firstName: 'John',
		lastName: 'Doe',
		email: 'john@example.com',
		dateOfBirth: '1990-05-15',
		phone: '+1 (555) 123-4567',
		role: 'Senior Engineer',
		status: 'active' as const,
		address: {
			street: '123 Main St',
			city: 'San Francisco',
			state: 'CA',
			zipCode: '94101',
			country: 'USA',
		},
		gifts: [
			{
				id: 1,
				name: 'Premium Headphones',
				occasion: 'Birthday',
				date: '2024-05-15',
				status: 'given' as const,
			},
			{
				id: 2,
				name: 'Tech Book Bundle',
				occasion: 'Work Anniversary',
				date: '2024-03-20',
				status: 'given' as const,
			},
		],
		clusters: [
			{ id: 1, name: 'Engineering Team', color: 'blue', memberCount: 45 },
			{ id: 3, name: 'Leadership', color: 'purple', memberCount: 12 },
		],
	},
];

const mockClusters = [
	{ id: 1, name: 'Engineering Team', color: 'blue', memberCount: 45 },
	{ id: 2, name: 'Sales Department', color: 'green', memberCount: 28 },
	{ id: 3, name: 'Leadership', color: 'purple', memberCount: 12 },
	{ id: 4, name: 'Marketing Team', color: 'orange', memberCount: 32 },
];

export default function MemberDetailPage() {
	// const { id } = useParams(); // TODO: Use this to fetch actual member data
	const [member, setMember] = useState(mockMembers[0]);
	const [availableClusters] = useState(mockClusters);

	const handleAssignCluster = (memberId: number, clusterId: number) => {
		// Find the cluster to add
		const clusterToAdd = availableClusters.find((c) => c.id === clusterId);
		if (!clusterToAdd) return;

		// Update member's clusters (add new cluster)
		setMember({
			...member,
			clusters: [...(member.clusters || []), clusterToAdd],
		});

		// In real implementation, also update cluster's members list via API
		console.log(`Bidirectional: Member ${memberId} added to Cluster ${clusterId}`);
		console.log(
			`This should also update the cluster's member list to include member ${memberId}`
		);
	};

	const handleRemoveCluster = (memberId: number, clusterId: number) => {
		// Update member's clusters (remove cluster)
		setMember({
			...member,
			clusters: (member.clusters || []).filter((c) => c.id !== clusterId),
		});

		// In real implementation, also update cluster's members list via API
		console.log(`Bidirectional: Member ${memberId} removed from Cluster ${clusterId}`);
		console.log(
			`This should also update the cluster's member list to remove member ${memberId}`
		);
	};

	return (
		<MemberDetail
			member={member}
			availableClusters={availableClusters}
			onAssignCluster={handleAssignCluster}
			onRemoveCluster={handleRemoveCluster}
		/>
	);
}
