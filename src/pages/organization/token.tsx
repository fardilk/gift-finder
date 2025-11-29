import React from 'react';

export default function OrganizationWalletPage() {
	const transactions = [
		{ id: 1, type: 'credit', amount: 5000, description: 'Monthly budget allocation', date: '2025-11-01', status: 'Completed' },
		{ id: 2, type: 'debit', amount: 1250, description: 'Birthday gifts distribution', date: '2025-11-15', status: 'Completed' },
		{ id: 3, type: 'debit', amount: 850, description: 'Team event expenses', date: '2025-11-20', status: 'Completed' },
		{ id: 4, type: 'credit', amount: 2000, description: 'Bonus budget addition', date: '2025-11-25', status: 'Pending' },
	];

	const balance = 12500;
	const pendingAmount = 2000;

		return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold text-gray-900">Token</h1>
				<p className="mt-2 text-gray-600">
					Manage your organization's token budget and transactions
				</p>
			</div>

			<div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
				<div className="rounded-lg border border-purple-100 bg-gradient-to-br from-purple-50 to-white p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600">Token Remaining</p>
							<p className="mt-2 text-3xl font-bold text-gray-900">${balance.toLocaleString()}</p>
						</div>
						<i className="fa-solid fa-wallet text-4xl text-purple-600"></i>
					</div>
				</div>

				<div className="rounded-lg border border-yellow-100 bg-gradient-to-br from-yellow-50 to-white p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600">Pending</p>
							<p className="mt-2 text-3xl font-bold text-gray-900">${pendingAmount.toLocaleString()}</p>
						</div>
						<i className="fa-solid fa-clock text-4xl text-yellow-600"></i>
					</div>
				</div>

				<div className="rounded-lg border border-green-100 bg-gradient-to-br from-green-50 to-white p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600">This Month</p>
							<p className="mt-2 text-3xl font-bold text-gray-900">
								${transactions.reduce((sum, t) => sum + (t.type === 'debit' ? t.amount : 0), 0).toLocaleString()}
							</p>
						</div>
						<i className="fa-solid fa-arrow-trend-down text-4xl text-green-600"></i>
					</div>
				</div>
			</div>

			<div className="flex gap-4">
				<button className="rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700">
					<i className="fa-solid fa-plus mr-2"></i>
					Add Funds
				</button>
				<button className="rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-50">
					<i className="fa-solid fa-download mr-2"></i>
					Export Transactions
				</button>
			</div>

			<div className="rounded-lg border border-gray-200 bg-white shadow-sm">
				<div className="border-b border-gray-200 p-6">
					<h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
				</div>
				<div className="divide-y divide-gray-200">
					{transactions.map((transaction) => (
						<div key={transaction.id} className="p-6 hover:bg-gray-50">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-4">
									<div
										className={`rounded-full p-3 ${
											transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
										}`}
									>
										<i
											className={`fa-solid ${
												transaction.type === 'credit' ? 'fa-arrow-down text-green-600' : 'fa-arrow-up text-red-600'
											}`}
										></i>
									</div>
									<div>
										<p className="font-semibold text-gray-900">{transaction.description}</p>
										<p className="text-sm text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
									</div>
								</div>
								<div className="flex items-center gap-4">
									<p
										className={`text-xl font-bold ${
											transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
										}`}
									>
										{transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toLocaleString()}
									</p>
									<span
										className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
											transaction.status === 'Completed'
												? 'bg-green-100 text-green-800'
												: 'bg-yellow-100 text-yellow-800'
										}`}
									>
										{transaction.status}
									</span>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
