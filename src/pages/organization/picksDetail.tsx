import React from 'react';
import { useNavigate } from 'react-router-dom';

type PickItem = {
	id: string;
	productName: string;
	description: string;
	price: number;
	imageUrl: string;
	category: string;
	addedDate: string;
	status: 'Pending' | 'Purchased' | 'Cancelled';
	addedBy: string;
	notes?: string;
};

export default function PicksDetailPage() {
	const navigate = useNavigate();

	// Mock data - will be replaced with API call
	const picks: PickItem[] = [
		{
			id: '1',
			productName: 'Laptop Dell XPS 15',
			description: 'High-performance laptop for development work',
			price: 25000000,
			imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400',
			category: 'Electronics',
			addedDate: '2025-11-15',
			status: 'Pending',
			addedBy: 'John Doe',
			notes: 'For engineering team',
		},
		{
			id: '2',
			productName: 'Office Chair Herman Miller',
			description: 'Ergonomic office chair for better posture',
			price: 8500000,
			imageUrl: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400',
			category: 'Furniture',
			addedDate: '2025-11-20',
			status: 'Pending',
			addedBy: 'Jane Smith',
		},
		{
			id: '3',
			productName: 'Standing Desk',
			description: 'Adjustable standing desk for health benefits',
			price: 6000000,
			imageUrl: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=400',
			category: 'Furniture',
			addedDate: '2025-11-10',
			status: 'Purchased',
			addedBy: 'Bob Johnson',
		},
	];

	const [selectedItems, setSelectedItems] = React.useState<string[]>([]);

	const getStatusColor = (status: PickItem['status']) => {
		switch (status) {
			case 'Pending':
				return 'bg-yellow-100 text-yellow-800';
			case 'Purchased':
				return 'bg-green-100 text-green-800';
			case 'Cancelled':
				return 'bg-red-100 text-red-800';
		}
	};

	const handleToggleSelect = (id: string) => {
		setSelectedItems(prev =>
			prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
		);
	};

	const handlePurchaseSelected = () => {
		const selectedPicks = picks.filter(p => selectedItems.includes(p.id));
		const totalAmount = selectedPicks.reduce((sum, pick) => sum + pick.price, 0);
		navigate('/organizations/transaction-confirm', { 
			state: { items: selectedPicks, totalAmount } 
		});
	};

	const totalSelected = picks
		.filter(p => selectedItems.includes(p.id))
		.reduce((sum, pick) => sum + pick.price, 0);

	return (
		<div className="space-y-6 w-full max-w-full">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Picks (Wish List)</h1>
					<p className="mt-1 text-gray-600">Manage items that are picked for later purchase</p>
				</div>
				<button
					onClick={handlePurchaseSelected}
					disabled={selectedItems.length === 0}
					className="rounded-lg bg-purple-600 px-6 py-2 text-white hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
				>
					<i className="fa-solid fa-shopping-cart mr-2"></i>
					Purchase Selected ({selectedItems.length})
				</button>
			</div>

			{/* Selected Items Summary */}
			{selectedItems.length > 0 && (
				<div className="rounded-xl bg-purple-50 border border-purple-200 p-4 flex items-center justify-between">
					<div>
						<p className="font-semibold text-purple-900">{selectedItems.length} items selected</p>
						<p className="text-sm text-purple-700">Total: Rp {totalSelected.toLocaleString()}</p>
					</div>
					<button
						onClick={() => setSelectedItems([])}
						className="text-purple-600 hover:text-purple-800 text-sm"
					>
						Clear Selection
					</button>
				</div>
			)}

			{/* Picks Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{picks.map((pick) => (
					<div
						key={pick.id}
						className={`rounded-xl bg-white shadow-sm overflow-hidden border-2 transition-all ${
							selectedItems.includes(pick.id) ? 'border-purple-500' : 'border-transparent'
						}`}
					>
						<div className="relative">
							<img
								src={pick.imageUrl}
								alt={pick.productName}
								className="w-full h-48 object-cover"
							/>
							<span className={`absolute top-3 right-3 inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(pick.status)}`}>
								{pick.status}
							</span>
							{pick.status === 'Pending' && (
								<button
									onClick={() => handleToggleSelect(pick.id)}
									className={`absolute top-3 left-3 h-8 w-8 rounded-lg ${
										selectedItems.includes(pick.id) ? 'bg-purple-600' : 'bg-white'
									} flex items-center justify-center shadow-md transition-all`}
								>
									<i className={`fa-solid fa-check text-sm ${
										selectedItems.includes(pick.id) ? 'text-white' : 'text-gray-400'
									}`}></i>
								</button>
							)}
						</div>
						<div className="p-4">
							<div className="flex items-start justify-between mb-2">
								<h3 className="text-lg font-bold text-gray-900">{pick.productName}</h3>
							</div>
							<p className="text-sm text-gray-600 mb-3">{pick.description}</p>
							<div className="flex items-center gap-2 mb-3">
								<span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-700">
									<i className="fa-solid fa-tag"></i>
									{pick.category}
								</span>
								<span className="text-xs text-gray-500">
									Added {new Date(pick.addedDate).toLocaleDateString()}
								</span>
							</div>
							<div className="flex items-center justify-between pt-3 border-t">
								<div>
									<p className="text-xs text-gray-500">Price</p>
									<p className="text-xl font-bold text-purple-600">Rp {pick.price.toLocaleString()}</p>
								</div>
								<div className="text-right">
									<p className="text-xs text-gray-500">Added by</p>
									<p className="text-sm font-semibold text-gray-900">{pick.addedBy}</p>
								</div>
							</div>
							{pick.notes && (
								<div className="mt-3 pt-3 border-t">
									<p className="text-xs text-gray-500">Notes</p>
									<p className="text-sm text-gray-700">{pick.notes}</p>
								</div>
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
