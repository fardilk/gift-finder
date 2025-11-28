import React from 'react';

export default function OrganizationProfilePage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold text-gray-900">Organization Profile</h1>
				<p className="mt-2 text-gray-600">
					Manage your organization's profile and settings
				</p>
			</div>

			<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
				<h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
				<div className="mt-6 space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700">Organization Name</label>
						<input
							type="text"
							defaultValue="Acme Corporation"
							className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700">Description</label>
						<textarea
							rows={4}
							defaultValue="Leading provider of innovative solutions"
							className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
						/>
					</div>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div>
							<label className="block text-sm font-medium text-gray-700">Industry</label>
							<input
								type="text"
								defaultValue="Technology"
								className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">Website</label>
							<input
								type="url"
								defaultValue="https://acme.com"
								className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
							/>
						</div>
					</div>
					<div className="pt-4">
						<button className="rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700">
							Save Changes
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
