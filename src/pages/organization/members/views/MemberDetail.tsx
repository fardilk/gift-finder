import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProfileWidget from '../components/ProfileWidget';
import AddressWidget from '../components/AddressWidget';
import GiftHistoryWidget from '../components/GiftHistoryWidget';
import ClusterWidget from '../components/ClusterWidget';
import { showSuccessToast } from '@/shared/components/toast/successToast';

interface MemberDetailProps {
	member: {
		id: number;
		photo?: string;
		firstName: string;
		lastName: string;
		email: string;
		dateOfBirth?: string;
		phone?: string;
		role?: string;
		status: 'active' | 'pending' | 'inactive';
		address?: {
			street?: string;
			city?: string;
			state?: string;
			zipCode?: string;
			country?: string;
		};
		gifts?: Array<{
			id: number;
			name: string;
			occasion: string;
			date: string;
			status: 'given' | 'pending' | 'planned';
		}>;
		clusters?: Array<{
			id: number;
			name: string;
			color?: string;
			memberCount?: number;
		}>;
	};
	availableClusters: Array<{
		id: number;
		name: string;
		color?: string;
		memberCount?: number;
	}>;
	onAssignCluster: (memberId: number, clusterId: number) => void;
	onRemoveCluster: (memberId: number, clusterId: number) => void;
}

export default function MemberDetail({
	member,
	availableClusters,
	onAssignCluster,
	onRemoveCluster,
}: MemberDetailProps) {
	const navigate = useNavigate();
	const { id } = useParams();

	const handleAssignCluster = (memberId: number, clusterId: number) => {
		onAssignCluster(memberId, clusterId);
		showSuccessToast('Cluster Assignment');
	};

	const handleRemoveCluster = (memberId: number, clusterId: number) => {
		onRemoveCluster(memberId, clusterId);
		showSuccessToast('Cluster Removal');
	};

	const statusStyles = {
		active: 'bg-green-100 text-green-800',
		pending: 'bg-yellow-100 text-yellow-800',
		inactive: 'bg-gray-100 text-gray-800',
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center space-x-4">
					<button
						onClick={() => navigate('/organization/members')}
						className="text-gray-600 hover:text-gray-900"
					>
						<i className="fa-solid fa-arrow-left mr-2"></i>
						Back to Members
					</button>
				</div>
				<div className="flex items-center space-x-3">
					<span
						className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${statusStyles[member.status]}`}
					>
						{member.status}
					</span>
					<button
						onClick={() => navigate(`/organization/members/${id}/edit`)}
						className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
					>
						<i className="fa-solid fa-pen-to-square mr-2"></i>
						Edit
					</button>
				</div>
			</div>

			{/* Member Details Header */}
			<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-4">
						{member.photo ? (
							<img
								src={member.photo}
								alt={`${member.firstName} ${member.lastName}`}
								className="h-16 w-16 rounded-full object-cover"
							/>
						) : (
							<div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
								<span className="text-2xl font-semibold text-purple-600">
									{member.firstName[0]}
									{member.lastName[0]}
								</span>
							</div>
						)}
						<div>
							<h1 className="text-2xl font-bold text-gray-900">
								{member.firstName} {member.lastName}
							</h1>
							<div className="mt-1 flex items-center space-x-4 text-sm text-gray-600">
								<span>
									<i className="fa-solid fa-envelope mr-1"></i>
									{member.email}
								</span>
								{member.phone && (
									<span>
										<i className="fa-solid fa-phone mr-1"></i>
										{member.phone}
									</span>
								)}
								{member.role && (
									<span>
										<i className="fa-solid fa-briefcase mr-1"></i>
										{member.role}
									</span>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Widgets Grid */}
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				{/* Profile Widget */}
				<ProfileWidget member={member} />

				{/* Address Widget */}
				<AddressWidget member={member} />

				{/* Gift History Widget */}
				<GiftHistoryWidget member={member} />

				{/* Cluster Widget */}
				<ClusterWidget
					member={member}
					availableClusters={availableClusters}
					onAssignCluster={handleAssignCluster}
					onRemoveCluster={handleRemoveCluster}
				/>
			</div>
		</div>
	);
}
