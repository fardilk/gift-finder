import React from 'react';

export default function OrganizationOccasionsPage() {
	const occasions = [
		{ id: 1, name: 'Employee Birthday', type: 'Recurring', frequency: 'Annual', active: true },
		{ id: 2, name: 'Work Anniversary', type: 'Recurring', frequency: 'Annual', active: true },
		{ id: 3, name: 'New Hire Welcome', type: 'Event-based', frequency: 'As needed', active: true },
		{ id: 4, name: 'Holiday Season', type: 'Recurring', frequency: 'Annual', active: false },
	];

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Occasions</h1>
					<p className="mt-2 text-gray-600">
						Manage gift-giving occasions for your organization
					</p>
				</div>
				<button className="rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700">
					<i className="fa-solid fa-plus mr-2"></i>
					Add Occasion
				</button>
			</div>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				{occasions.map((occasion) => (
					<div key={occasion.id} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
						<div className="flex items-start justify-between">
							<div className="flex items-start gap-4">
								<div className="rounded-full bg-purple-100 p-3">
									<i className="fa-solid fa-calendar-day text-xl text-purple-600"></i>
								</div>
								<div>
									<h3 className="text-lg font-semibold text-gray-900">{occasion.name}</h3>
									<div className="mt-2 space-y-1">
										<p className="text-sm text-gray-600">
											<span className="font-medium">Type:</span> {occasion.type}
										</p>
										<p className="text-sm text-gray-600">
											<span className="font-medium">Frequency:</span> {occasion.frequency}
										</p>
									</div>
								</div>
							</div>
							<div className="flex flex-col items-end gap-2">
								<span
									className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
										occasion.active
											? 'bg-green-100 text-green-800'
											: 'bg-gray-100 text-gray-800'
									}`}
								>
									{occasion.active ? 'Active' : 'Inactive'}
								</span>
								<button className="text-gray-400 hover:text-gray-600">
									<i className="fa-solid fa-ellipsis-vertical"></i>
								</button>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
