import React from 'react';

export default function OrganizationBenefitsPage() {
	const benefits = [
		{
			id: 1,
			name: 'Birthday Gift Card',
			description: '$50 gift card for employee birthdays',
			category: 'Birthday',
			value: '$50',
			active: true,
		},
		{
			id: 2,
			name: 'Anniversary Bonus',
			description: 'Bonus based on years of service',
			category: 'Anniversary',
			value: 'Variable',
			active: true,
		},
		{
			id: 3,
			name: 'Holiday Package',
			description: 'Special gift package for the holiday season',
			category: 'Holiday',
			value: '$100',
			active: true,
		},
		{
			id: 4,
			name: 'Wellness Subsidy',
			description: 'Monthly wellness and fitness subsidy',
			category: 'Wellness',
			value: '$75/mo',
			active: false,
		},
	];

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Benefits</h1>
					<p className="mt-2 text-gray-600">
						Manage employee benefits and rewards programs
					</p>
				</div>
				<button className="rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700">
					<i className="fa-solid fa-plus mr-2"></i>
					Add Benefit
				</button>
			</div>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				{benefits.map((benefit) => (
					<div key={benefit.id} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
						<div className="flex items-start justify-between">
							<div className="flex-1">
								<div className="flex items-center gap-3">
									<div className="rounded-full bg-green-100 p-2">
										<i className="fa-solid fa-gift text-lg text-green-600"></i>
									</div>
									<div className="flex-1">
										<h3 className="text-lg font-semibold text-gray-900">{benefit.name}</h3>
										<span className="inline-flex mt-1 rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800">
											{benefit.category}
										</span>
									</div>
									<span
										className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
											benefit.active
												? 'bg-green-100 text-green-800'
												: 'bg-gray-100 text-gray-800'
										}`}
									>
										{benefit.active ? 'Active' : 'Inactive'}
									</span>
								</div>
								<p className="mt-3 text-sm text-gray-600">{benefit.description}</p>
								<div className="mt-4 flex items-center justify-between">
									<div className="flex items-center gap-2">
										<i className="fa-solid fa-dollar-sign text-sm text-gray-400"></i>
										<span className="text-sm font-semibold text-gray-900">{benefit.value}</span>
									</div>
									<div className="flex gap-2">
										<button className="rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50">
											Edit
										</button>
										<button className="rounded-md bg-purple-600 px-3 py-1 text-sm text-white hover:bg-purple-700">
											View Details
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				))}
			</div>

			<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
				<h2 className="text-xl font-semibold text-gray-900">Benefit Summary</h2>
				<div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-4">
					<div className="rounded-lg border border-gray-100 p-4">
						<p className="text-sm text-gray-600">Total Benefits</p>
						<p className="mt-1 text-2xl font-bold text-gray-900">{benefits.length}</p>
					</div>
					<div className="rounded-lg border border-gray-100 p-4">
						<p className="text-sm text-gray-600">Active</p>
						<p className="mt-1 text-2xl font-bold text-green-600">
							{benefits.filter((b) => b.active).length}
						</p>
					</div>
					<div className="rounded-lg border border-gray-100 p-4">
						<p className="text-sm text-gray-600">Inactive</p>
						<p className="mt-1 text-2xl font-bold text-gray-400">
							{benefits.filter((b) => !b.active).length}
						</p>
					</div>
					<div className="rounded-lg border border-gray-100 p-4">
						<p className="text-sm text-gray-600">Categories</p>
						<p className="mt-1 text-2xl font-bold text-gray-900">
							{new Set(benefits.map((b) => b.category)).size}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
