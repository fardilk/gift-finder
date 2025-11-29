import React from 'react';

interface Gift {
	id: number;
	name: string;
	occasion: string;
	date: string;
	status: 'given' | 'pending' | 'planned';
}

interface GiftHistoryWidgetProps {
	member: {
		id: number;
		gifts?: Gift[];
	};
}

export default function GiftHistoryWidget({ member }: GiftHistoryWidgetProps) {
	const gifts = member.gifts || [];

	const statusStyles = {
		given: 'bg-green-100 text-green-800',
		pending: 'bg-yellow-100 text-yellow-800',
		planned: 'bg-blue-100 text-blue-800',
	};

	return (
		<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
			<div className="mb-4 flex items-center justify-between">
				<h3 className="text-lg font-semibold text-gray-900">Gift History</h3>
				<span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-semibold text-purple-600">
					{gifts.length} {gifts.length === 1 ? 'Gift' : 'Gifts'}
				</span>
			</div>
			{gifts.length > 0 ? (
				<div className="space-y-3">
					{gifts.map((gift) => (
						<div
							key={gift.id}
							className="flex items-center justify-between rounded-lg border border-gray-100 p-3 hover:bg-gray-50"
						>
							<div className="flex-1">
								<h4 className="font-medium text-gray-900">{gift.name}</h4>
								<div className="mt-1 flex items-center text-sm text-gray-500">
									<i className="fa-solid fa-calendar mr-1"></i>
									{gift.occasion} - {new Date(gift.date).toLocaleDateString()}
								</div>
							</div>
							<span
								className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusStyles[gift.status]}`}
							>
								{gift.status}
							</span>
						</div>
					))}
				</div>
			) : (
				<div className="flex items-center justify-center py-8 text-gray-400">
					<div className="text-center">
						<i className="fa-solid fa-gift mb-2 text-3xl"></i>
						<p className="text-sm">No gift history</p>
					</div>
				</div>
			)}
		</div>
	);
}
