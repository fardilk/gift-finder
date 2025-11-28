import React from 'react';

export default function OrganizationOverviewPage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold text-gray-900">Organization Overview</h1>
				<p className="mt-2 text-gray-600">
					View your organization's statistics and performance metrics
				</p>
			</div>

			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
				<div className="rounded-lg border border-purple-100 bg-gradient-to-br from-purple-50 to-white p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600">Total Members</p>
							<p className="mt-2 text-3xl font-bold text-gray-900">1,234</p>
						</div>
						<i className="fa-solid fa-users text-4xl text-purple-600"></i>
					</div>
				</div>

				<div className="rounded-lg border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600">Active Events</p>
							<p className="mt-2 text-3xl font-bold text-gray-900">18</p>
						</div>
						<i className="fa-solid fa-calendar-check text-4xl text-blue-600"></i>
					</div>
				</div>

				<div className="rounded-lg border border-green-100 bg-gradient-to-br from-green-50 to-white p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600">Total Benefits</p>
							<p className="mt-2 text-3xl font-bold text-gray-900">42</p>
						</div>
						<i className="fa-solid fa-gift text-4xl text-green-600"></i>
					</div>
				</div>

				<div className="rounded-lg border border-amber-100 bg-gradient-to-br from-amber-50 to-white p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600">Wallet Balance</p>
							<p className="mt-2 text-3xl font-bold text-gray-900">$12.5K</p>
						</div>
						<i className="fa-solid fa-wallet text-4xl text-amber-600"></i>
					</div>
				</div>
			</div>

			<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
				<h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
				<div className="mt-4 space-y-3">
					<div className="flex items-center gap-3 border-b border-gray-100 pb-3">
						<i className="fa-solid fa-circle-check text-green-600"></i>
						<span className="text-sm text-gray-600">New member joined: John Doe</span>
						<span className="ml-auto text-xs text-gray-400">2 hours ago</span>
					</div>
					<div className="flex items-center gap-3 border-b border-gray-100 pb-3">
						<i className="fa-solid fa-calendar-plus text-blue-600"></i>
						<span className="text-sm text-gray-600">Event created: Annual Gala 2025</span>
						<span className="ml-auto text-xs text-gray-400">5 hours ago</span>
					</div>
					<div className="flex items-center gap-3">
						<i className="fa-solid fa-gift text-purple-600"></i>
						<span className="text-sm text-gray-600">Benefit updated: Holiday Package</span>
						<span className="ml-auto text-xs text-gray-400">1 day ago</span>
					</div>
				</div>
			</div>
		</div>
	);
}
