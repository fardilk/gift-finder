import React from 'react';
import IndividualDashboardSidebar from 'src/shared/components/individual-dashboard/sidebar';
import { Button } from 'src/shared/ui/button';

const quickMetrics = [
	{ label: 'Active wishlists', value: 12, helper: '+3 this week' },
	{ label: 'Gifts in progress', value: 5, helper: '2 need attention' },
	{ label: 'Average sentiment', value: '92%', helper: 'Based on 28 responses' },
];

const upcomingOccasions = [
	{ name: 'Aisha’s Graduation', date: 'June 12', relationship: 'Cousin' },
	{ name: 'Dad’s Birthday', date: 'July 02', relationship: 'Parent' },
	{ name: 'Team Offsite', date: 'July 18', relationship: 'Colleagues' },
];

export default function IndividualDashboardPage() {
	return (
		<div className="flex min-h-screen gap-6 bg-slate-50/70 p-6 text-slate-900">
			<IndividualDashboardSidebar />
			<main className="flex flex-1 flex-col rounded-3xl border border-purple-100 bg-white/80 p-8 shadow-lg shadow-purple-100/70 backdrop-blur">
				<section className="flex flex-col gap-4 border-b border-purple-100 pb-6 lg:flex-row lg:items-center lg:justify-between">
					<div>
						<p className="text-sm uppercase tracking-[0.2em] text-purple-500">Welcome back</p>
						<h1 className="text-3xl font-semibold text-slate-900">Your gifting dashboard</h1>
						<p className="max-w-2xl text-sm text-slate-500">
							Track the people you care about, discover thoughtful ideas, and keep gifting conversations flowing.
						</p>
					</div>
					<div className="flex gap-3">
						<Button>Start new wishlist</Button>
						<Button variant="outline">Add recipient</Button>
					</div>
				</section>

				<section className="mt-8 grid gap-6 md:grid-cols-3">
					{quickMetrics.map((metric) => (
						<div
							key={metric.label}
							className="rounded-2xl border border-purple-50 bg-gradient-to-br from-purple-50/80 via-white to-white p-6 shadow-sm"
						>
							<p className="text-xs uppercase tracking-[0.18em] text-purple-400">{metric.label}</p>
							<p className="mt-3 text-3xl font-semibold text-slate-900">{metric.value}</p>
							<p className="mt-1 text-xs text-slate-500">{metric.helper}</p>
						</div>
					))}
				</section>

				<section className="mt-10 grid gap-6 lg:grid-cols-5">
					<div className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm lg:col-span-3">
						<h2 className="text-lg font-semibold text-slate-900">Upcoming occasions</h2>
						<ul className="mt-4 space-y-4">
							{upcomingOccasions.map((occasion) => (
								<li key={occasion.name} className="flex items-center justify-between rounded-xl border border-purple-50 bg-purple-50/40 px-4 py-3 text-sm">
									<div>
										<p className="font-medium text-slate-900">{occasion.name}</p>
										<p className="text-xs text-slate-500">{occasion.relationship}</p>
									</div>
									<span className="text-xs font-semibold uppercase tracking-[0.18em] text-purple-500">{occasion.date}</span>
								</li>
							))}
						</ul>
					</div>
					<div className="rounded-2xl border border-dashed border-purple-200 bg-white/70 p-6 text-center text-sm text-slate-500 lg:col-span-2">
						<h2 className="text-lg font-semibold text-slate-900">Personalized recommendations</h2>
						<p className="mt-2">
							Connect your wishlist or start a new gift journey to see curated suggestions based on shared interests.
						</p>
						<Button className="mt-4">See recommendations</Button>
					</div>
				</section>
			</main>
		</div>
	);
}

