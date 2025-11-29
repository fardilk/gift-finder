import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

type TransactionItem = {
	id: string;
	productName: string;
	description: string;
	price: number;
	imageUrl: string;
};

type LocationState = {
	items: TransactionItem[];
	totalAmount: number;
};

export default function TransactionConfirmPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const state = location.state as LocationState;

	const [isProcessing, setIsProcessing] = React.useState(false);
	const [password, setPassword] = React.useState('');
	const [showPassword, setShowPassword] = React.useState(false);

	// Mock data if accessed directly
	const items = state?.items || [];
	const totalAmount = state?.totalAmount || 0;

	// Mock organization token balance
	const currentBalance = 150000;
	const remainingBalance = currentBalance - totalAmount;

	const handleConfirm = async () => {
		if (password !== 'password') {
			alert('Incorrect password');
			return;
		}

		setIsProcessing(true);
		// Simulate API call
		await new Promise(resolve => setTimeout(resolve, 2000));
		setIsProcessing(false);
		
		// Show success and redirect
		alert('Transaction completed successfully!');
		navigate('/organizations/overview');
	};

	if (items.length === 0) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<div className="text-center">
					<i className="fa-solid fa-shopping-cart text-6xl text-gray-300 mb-4"></i>
					<h2 className="text-2xl font-bold text-gray-900 mb-2">No Items Selected</h2>
					<p className="text-gray-600 mb-4">Please select items to purchase from the picks list.</p>
					<button
						onClick={() => navigate('/organizations/picks')}
						className="rounded-lg bg-purple-600 px-6 py-2 text-white hover:bg-purple-700"
					>
						Go to Picks
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6 w-full max-w-4xl mx-auto">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Confirm Transaction</h1>
					<p className="mt-1 text-gray-600">Review your purchase before confirming</p>
				</div>
				<button
					onClick={() => navigate(-1)}
					className="text-gray-600 hover:text-gray-900"
				>
					<i className="fa-solid fa-times text-xl"></i>
				</button>
			</div>

			{/* Transaction Summary */}
			<div className="rounded-xl bg-gradient-to-br from-purple-600 to-purple-700 p-6 text-white shadow-lg">
				<div className="flex items-center justify-between mb-4">
					<div>
						<p className="text-purple-200 text-sm mb-1">Current Token Balance</p>
						<p className="text-3xl font-bold">{currentBalance.toLocaleString()}</p>
					</div>
					<div className="h-16 w-16 rounded-xl bg-white/20 flex items-center justify-center">
						<i className="fa-solid fa-coins text-3xl"></i>
					</div>
				</div>
				<div className="pt-4 border-t border-purple-500">
					<div className="flex items-center justify-between mb-2">
						<span className="text-purple-200">Transaction Amount</span>
						<span className="text-xl font-bold">-{totalAmount.toLocaleString()}</span>
					</div>
					<div className="flex items-center justify-between">
						<span className="text-purple-200">Remaining Balance</span>
						<span className={`text-2xl font-bold ${remainingBalance < 0 ? 'text-red-300' : 'text-white'}`}>
							{remainingBalance.toLocaleString()}
						</span>
					</div>
				</div>
				{remainingBalance < 0 && (
					<div className="mt-4 p-3 rounded-lg bg-red-500/20 border border-red-300">
						<p className="text-sm text-red-100">
							<i className="fa-solid fa-exclamation-triangle mr-2"></i>
							Insufficient balance. Please top up your tokens.
						</p>
					</div>
				)}
			</div>

			{/* Items List */}
			<div className="rounded-xl bg-white p-6 shadow-sm">
				<h2 className="text-xl font-bold text-gray-900 mb-4">Items ({items.length})</h2>
				<div className="space-y-4">
					{items.map((item) => (
						<div key={item.id} className="flex items-center gap-4 p-4 rounded-lg bg-gray-50">
							<img
								src={item.imageUrl}
								alt={item.productName}
								className="h-16 w-16 rounded-lg object-cover"
							/>
							<div className="flex-1">
								<h3 className="font-semibold text-gray-900">{item.productName}</h3>
								<p className="text-sm text-gray-600">{item.description}</p>
							</div>
							<div className="text-right">
								<p className="font-bold text-purple-600">Rp {item.price.toLocaleString()}</p>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Password Verification */}
			<div className="rounded-xl bg-white p-6 shadow-sm">
				<h2 className="text-xl font-bold text-gray-900 mb-4">Verify Your Identity</h2>
				<p className="text-sm text-gray-600 mb-4">Enter your password to confirm this transaction</p>
				<div className="relative">
					<input
						type={showPassword ? 'text' : 'password'}
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="Enter password"
						className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
					/>
					<button
						onClick={() => setShowPassword(!showPassword)}
						className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
					>
						<i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
					</button>
				</div>
			</div>

			{/* Action Buttons */}
			<div className="flex items-center gap-4">
				<button
					onClick={() => navigate(-1)}
					className="flex-1 rounded-lg border border-gray-300 px-6 py-3 text-gray-700 hover:bg-gray-50"
				>
					Cancel
				</button>
				<button
					onClick={handleConfirm}
					disabled={isProcessing || remainingBalance < 0 || !password}
					className="flex-1 rounded-lg bg-purple-600 px-6 py-3 text-white hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
				>
					{isProcessing ? (
						<>
							<i className="fa-solid fa-spinner fa-spin mr-2"></i>
							Processing...
						</>
					) : (
						<>
							<i className="fa-solid fa-check mr-2"></i>
							Confirm Transaction
						</>
					)}
				</button>
			</div>

			{/* Info Notice */}
			<div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
				<div className="flex gap-3">
					<i className="fa-solid fa-info-circle text-blue-600 mt-0.5"></i>
					<div>
						<p className="text-sm font-semibold text-blue-900 mb-1">Transaction Information</p>
						<ul className="text-sm text-blue-800 space-y-1">
							<li>• This transaction cannot be reversed once confirmed</li>
							<li>• Tokens will be deducted immediately from your balance</li>
							<li>• You will receive a confirmation email after successful purchase</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
