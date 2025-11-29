import React from 'react';

interface AddressWidgetProps {
	member: {
		id: number;
		address?: {
			street?: string;
			city?: string;
			state?: string;
			zipCode?: string;
			country?: string;
		};
	};
}

export default function AddressWidget({ member }: AddressWidgetProps) {
	const hasAddress = member.address && Object.values(member.address).some(val => val);

	return (
		<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
			<h3 className="mb-4 text-lg font-semibold text-gray-900">Address</h3>
			{hasAddress ? (
				<div className="space-y-2">
					{member.address?.street && (
						<div className="flex items-start text-sm text-gray-600">
							<i className="fa-solid fa-location-dot mr-2 mt-1 w-5"></i>
							<span>{member.address.street}</span>
						</div>
					)}
					{(member.address?.city || member.address?.state || member.address?.zipCode) && (
						<div className="flex items-start text-sm text-gray-600">
							<i className="fa-solid fa-map-pin mr-2 mt-1 w-5"></i>
							<span>
								{[member.address?.city, member.address?.state, member.address?.zipCode]
									.filter(Boolean)
									.join(', ')}
							</span>
						</div>
					)}
					{member.address?.country && (
						<div className="flex items-start text-sm text-gray-600">
							<i className="fa-solid fa-globe mr-2 mt-1 w-5"></i>
							<span>{member.address.country}</span>
						</div>
					)}
				</div>
			) : (
				<div className="flex items-center justify-center py-8 text-gray-400">
					<div className="text-center">
						<i className="fa-solid fa-map-location-dot mb-2 text-3xl"></i>
						<p className="text-sm">No address information</p>
					</div>
				</div>
			)}
		</div>
	);
}
