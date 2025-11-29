import React, { useState } from 'react';
import ClusterDetail from './views/ClusterDetail';

// Mock data showing bidirectional relationship
const mockClusters = [
	{
		id: 1,
		name: 'Engineering Team',
		description: 'Software development and technical infrastructure',
		color: 'blue',
		memberCount: 45,
		members: [
			{
				id: 1,
				firstName: 'John',
				lastName: 'Doe',
				email: 'john@example.com',
				photo: '',
				role: 'Senior Engineer',
			},
			{
				id: 2,
				firstName: 'Jane',
				lastName: 'Smith',
				email: 'jane@example.com',
				photo: '',
				role: 'Tech Lead',
			},
		],
	},
];

const mockAllMembers = [
	{
		id: 1,
		firstName: 'John',
		lastName: 'Doe',
		email: 'john@example.com',
		photo: '',
		role: 'Senior Engineer',
	},
	{
		id: 2,
		firstName: 'Jane',
		lastName: 'Smith',
		email: 'jane@example.com',
		photo: '',
		role: 'Tech Lead',
	},
	{
		id: 3,
		firstName: 'Bob',
		lastName: 'Johnson',
		email: 'bob@example.com',
		photo: '',
		role: 'Marketing Manager',
	},
	{
		id: 4,
		firstName: 'Alice',
		lastName: 'Williams',
		email: 'alice@example.com',
		photo: '',
		role: 'Sales Representative',
	},
];

export default function ClusterDetailPage() {
	// const { id } = useParams(); // TODO: Use this to fetch actual cluster data
	const [cluster, setCluster] = useState(mockClusters[0]);
	const [allMembers] = useState(mockAllMembers);

	// Available members are those not already in this cluster
	const availableMembers = allMembers.filter(
		(member) => !cluster.members.some((m) => m.id === member.id)
	);

	const handleAddMember = (clusterId: number, memberId: number) => {
		// Find the member to add
		const memberToAdd = allMembers.find((m) => m.id === memberId);
		if (!memberToAdd) return;

		// Update cluster's members (add new member)
		setCluster({
			...cluster,
			members: [...cluster.members, memberToAdd],
			memberCount: cluster.memberCount + 1,
		});

		// In real implementation, also update member's clusters list via API
		console.log(`Bidirectional: Cluster ${clusterId} added Member ${memberId}`);
		console.log(
			`This should also update member ${memberId}'s cluster list to include cluster ${clusterId}`
		);
	};

	const handleRemoveMember = (clusterId: number, memberId: number) => {
		// Update cluster's members (remove member)
		setCluster({
			...cluster,
			members: cluster.members.filter((m) => m.id !== memberId),
			memberCount: cluster.memberCount - 1,
		});

		// In real implementation, also update member's clusters list via API
		console.log(`Bidirectional: Cluster ${clusterId} removed Member ${memberId}`);
		console.log(
			`This should also update member ${memberId}'s cluster list to remove cluster ${clusterId}`
		);
	};

	return (
		<ClusterDetail
			cluster={cluster}
			availableMembers={availableMembers}
			onAddMember={handleAddMember}
			onRemoveMember={handleRemoveMember}
		/>
	);
}
