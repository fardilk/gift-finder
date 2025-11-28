import React from 'react';

export default function OrganizationEventsPage() {
	const events = [
		{
			id: 1,
			name: 'Annual Company Gala',
			date: '2025-12-15',
			location: 'Grand Hotel',
			attendees: 250,
			status: 'Upcoming',
		},
		{
			id: 2,
			name: 'Q4 Team Building',
			date: '2025-11-30',
			location: 'Outdoor Park',
			attendees: 120,
			status: 'Upcoming',
		},
		{
			id: 3,
			name: 'Holiday Party',
			date: '2025-12-20',
			location: 'Office Rooftop',
			attendees: 180,
			status: 'Planning',
		},
		{
			id: 4,
			name: 'Summer Picnic',
			date: '2025-07-15',
			location: 'City Park',
			attendees: 200,
			status: 'Completed',
		},
	];

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'Upcoming':
				return 'bg-blue-100 text-blue-800';
			case 'Planning':
				return 'bg-yellow-100 text-yellow-800';
			case 'Completed':
				return 'bg-green-100 text-green-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Events</h1>
					<p className="mt-2 text-gray-600">
						Plan and manage organization events and gatherings
					</p>
				</div>
				<button className="rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700">
					<i className="fa-solid fa-plus mr-2"></i>
					Create Event
				</button>
			</div>

			<div className="grid grid-cols-1 gap-6">
				{events.map((event) => (
					<div key={event.id} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
						<div className="flex items-start justify-between">
							<div className="flex items-start gap-4">
								<div className="rounded-lg bg-purple-100 p-3">
									<i className="fa-solid fa-calendar-days text-2xl text-purple-600"></i>
								</div>
								<div className="flex-1">
									<div className="flex items-center gap-3">
										<h3 className="text-xl font-semibold text-gray-900">{event.name}</h3>
										<span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(event.status)}`}>
											{event.status}
										</span>
									</div>
									<div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
										<div className="flex items-center gap-2 text-sm text-gray-600">
											<i className="fa-solid fa-calendar text-gray-400"></i>
											<span>{new Date(event.date).toLocaleDateString()}</span>
										</div>
										<div className="flex items-center gap-2 text-sm text-gray-600">
											<i className="fa-solid fa-location-dot text-gray-400"></i>
											<span>{event.location}</span>
										</div>
										<div className="flex items-center gap-2 text-sm text-gray-600">
											<i className="fa-solid fa-users text-gray-400"></i>
											<span>{event.attendees} attendees</span>
										</div>
									</div>
								</div>
							</div>
							<div className="flex gap-2">
								<button className="rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50">
									<i className="fa-solid fa-pen-to-square mr-2"></i>
									Edit
								</button>
								<button className="rounded-md bg-purple-600 px-3 py-2 text-sm text-white hover:bg-purple-700">
									View Details
								</button>
							</div>
						</div>
					</div>
				))}
			</div>

			<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
				<h2 className="text-xl font-semibold text-gray-900">Event Statistics</h2>
				<div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-4">
					<div className="rounded-lg border border-gray-100 p-4">
						<p className="text-sm text-gray-600">Total Events</p>
						<p className="mt-1 text-2xl font-bold text-gray-900">{events.length}</p>
					</div>
					<div className="rounded-lg border border-gray-100 p-4">
						<p className="text-sm text-gray-600">Upcoming</p>
						<p className="mt-1 text-2xl font-bold text-blue-600">
							{events.filter((e) => e.status === 'Upcoming').length}
						</p>
					</div>
					<div className="rounded-lg border border-gray-100 p-4">
						<p className="text-sm text-gray-600">Total Attendees</p>
						<p className="mt-1 text-2xl font-bold text-gray-900">
							{events.reduce((sum, e) => sum + e.attendees, 0)}
						</p>
					</div>
					<div className="rounded-lg border border-gray-100 p-4">
						<p className="text-sm text-gray-600">Avg. Attendance</p>
						<p className="mt-1 text-2xl font-bold text-gray-900">
							{Math.round(events.reduce((sum, e) => sum + e.attendees, 0) / events.length)}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
