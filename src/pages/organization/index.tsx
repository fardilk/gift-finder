import React from 'react';

export default function OrganizationPage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold text-gray-900">Organizations</h1>
				<p className="mt-2 text-gray-600">
					Manage your organization settings and configurations
				</p>
			</div>

			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
				<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
					<i className="fa-solid fa-building text-3xl text-purple-600"></i>
					<h3 className="mt-4 text-lg font-semibold">Organization Overview</h3>
					<p className="mt-2 text-sm text-gray-600">
						View organization statistics and summary
					</p>
				</div>

				<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
					<i className="fa-solid fa-users text-3xl text-purple-600"></i>
					<h3 className="mt-4 text-lg font-semibold">Members</h3>
					<p className="mt-2 text-sm text-gray-600">
						Manage organization members and permissions
					</p>
				</div>

				<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
					<i className="fa-solid fa-calendar text-3xl text-purple-600"></i>
					<h3 className="mt-4 text-lg font-semibold">Events</h3>
					<p className="mt-2 text-sm text-gray-600">
						Schedule and manage organization events
					</p>
				</div>
			</div>
		</div>
	);
}
