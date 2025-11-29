import React from 'react';
import { useNavigate } from 'react-router-dom';

type TopUpPackage = {
	id: string;
	amount: number;
	price: number;
	bonus: number;
	popular?: boolean;
};

export default function TokenTopUpPage() {
	const navigate = useNavigate();

	const [selectedPackage, setSelectedPackage] = React.useState<string | null>(null);
	const [customAmount, setCustomAmount] = React.useState('');
	const [paymentMethod, setPaymentMethod] = React.useState<'bank' | 'card' | 'ewallet'>('bank');
	const [isProcessing, setIsProcessing] = React.useState(false);

	// Mock current balance
	const currentBalance = 150000;

	const packages: TopUpPackage[] = [
		{ id: '1', amount: 50000, price: 500000, bonus: 0 },
		{ id: '2', amount: 100000, price: 950000, bonus: 5000, popular: true },
		{ id: '3', amount: 250000, price: 2250000, bonus: 25000 },
		{ id: '4', amount: 500000, price: 4500000, bonus: 75000 },
	];

	const handleTopUp = async () => {
		setIsProcessing(true);
		// Simulate API call
		await new Promise(resolve => setTimeout(resolve, 2000));
		setIsProcessing(false);
		
		alert('Top-up successful! Your tokens have been added to your balance.');
		navigate('/organizations/overview');
	};

	const getSelectedAmount = () => {
		if (selectedPackage) {
			const pkg = packages.find(p => p.id === selectedPackage);
			return pkg ? pkg.amount + pkg.bonus : 0;
		}
		return parseInt(customAmount) || 0;
	};

	const getSelectedPrice = () => {
		if (selectedPackage) {
			const pkg = packages.find(p => p.id === selectedPackage);
			return pkg ? pkg.price : 0;
		}
		const amount = parseInt(customAmount) || 0;
		return amount * 10; // Rp 10 per token for custom amount
	};

	const newBalance = currentBalance + getSelectedAmount();

	return (
		<div className="space-y-6 w-full max-w-6xl mx-auto">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Top Up Tokens</h1>
					<p className="mt-1 text-gray-600">Add tokens to your organization balance</p>
				</div>
				<button
					onClick={() => navigate('/organizations/overview')}
					className="text-gray-600 hover:text-gray-900"
				>
					<i className="fa-solid fa-times text-xl"></i>
				</button>
			</div>

			{/* Current Balance */}
			<div className="rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 p-6 text-white shadow-lg">
				<div className="flex items-center justify-between">
					<div>
						<p className="text-amber-100 text-sm mb-1">Current Token Balance</p>
						<p className="text-4xl font-bold">{currentBalance.toLocaleString()}</p>
					</div>
					<div className="h-20 w-20 rounded-xl bg-white/20 flex items-center justify-center">
						<i className="fa-solid fa-coins text-4xl"></i>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Left Column - Packages */}
				<div className="lg:col-span-2 space-y-6">
					{/* Package Selection */}
					<div className="rounded-xl bg-white p-6 shadow-sm">
						<h2 className="text-xl font-bold text-gray-900 mb-4">Select Package</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{packages.map((pkg) => (
								<button
									key={pkg.id}
									onClick={() => {
										setSelectedPackage(pkg.id);
										setCustomAmount('');
									}}
									className={`relative rounded-xl border-2 p-6 text-left transition-all ${
										selectedPackage === pkg.id
											? 'border-purple-600 bg-purple-50'
											: 'border-gray-200 hover:border-purple-300'
									}`}
								>
									{pkg.popular && (
										<span className="absolute -top-3 right-4 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 px-3 py-1 text-xs font-semibold text-white shadow-lg">
											Most Popular
										</span>
									)}
									<div className="flex items-start justify-between mb-3">
										<div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
											<i className="fa-solid fa-coins text-xl text-purple-600"></i>
										</div>
										{selectedPackage === pkg.id && (
											<div className="h-6 w-6 rounded-full bg-purple-600 flex items-center justify-center">
												<i className="fa-solid fa-check text-xs text-white"></i>
											</div>
										)}
									</div>
									<div>
										<p className="text-2xl font-bold text-gray-900">{pkg.amount.toLocaleString()}</p>
										<p className="text-sm text-gray-600">Tokens</p>
									</div>
									{pkg.bonus > 0 && (
										<div className="mt-2 inline-flex items-center gap-1 rounded-md bg-green-100 px-2 py-1">
											<i className="fa-solid fa-plus text-xs text-green-700"></i>
											<span className="text-xs font-semibold text-green-700">
												{pkg.bonus.toLocaleString()} Bonus
											</span>
										</div>
									)}
									<div className="mt-4 pt-4 border-t">
										<p className="text-2xl font-bold text-purple-600">
											Rp {pkg.price.toLocaleString()}
										</p>
									</div>
								</button>
							))}
						</div>
					</div>

					{/* Custom Amount */}
					<div className="rounded-xl bg-white p-6 shadow-sm">
						<h2 className="text-xl font-bold text-gray-900 mb-4">Custom Amount</h2>
						<p className="text-sm text-gray-600 mb-4">Enter a custom token amount (Rp 10 per token)</p>
						<input
							type="number"
							value={customAmount}
							onChange={(e) => {
								setCustomAmount(e.target.value);
								setSelectedPackage(null);
							}}
							placeholder="Enter amount"
							min="1000"
							step="1000"
							className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
						/>
						{customAmount && (
							<p className="mt-2 text-sm text-gray-600">
								Price: <span className="font-bold text-purple-600">Rp {getSelectedPrice().toLocaleString()}</span>
							</p>
						)}
					</div>

					{/* Payment Method */}
					<div className="rounded-xl bg-white p-6 shadow-sm">
						<h2 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h2>
						<div className="space-y-3">
							<button
								onClick={() => setPaymentMethod('bank')}
								className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
									paymentMethod === 'bank'
										? 'border-purple-600 bg-purple-50'
										: 'border-gray-200 hover:border-purple-300'
								}`}
							>
								<div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
									<i className="fa-solid fa-building-columns text-xl text-blue-600"></i>
								</div>
								<div className="flex-1 text-left">
									<p className="font-semibold text-gray-900">Bank Transfer</p>
									<p className="text-sm text-gray-600">BCA, Mandiri, BNI, BRI</p>
								</div>
								{paymentMethod === 'bank' && (
									<i className="fa-solid fa-check-circle text-xl text-purple-600"></i>
								)}
							</button>

							<button
								onClick={() => setPaymentMethod('card')}
								className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
									paymentMethod === 'card'
										? 'border-purple-600 bg-purple-50'
										: 'border-gray-200 hover:border-purple-300'
								}`}
							>
								<div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
									<i className="fa-solid fa-credit-card text-xl text-green-600"></i>
								</div>
								<div className="flex-1 text-left">
									<p className="font-semibold text-gray-900">Credit/Debit Card</p>
									<p className="text-sm text-gray-600">Visa, Mastercard, JCB</p>
								</div>
								{paymentMethod === 'card' && (
									<i className="fa-solid fa-check-circle text-xl text-purple-600"></i>
								)}
							</button>

							<button
								onClick={() => setPaymentMethod('ewallet')}
								className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
									paymentMethod === 'ewallet'
										? 'border-purple-600 bg-purple-50'
										: 'border-gray-200 hover:border-purple-300'
								}`}
							>
								<div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
									<i className="fa-solid fa-wallet text-xl text-purple-600"></i>
								</div>
								<div className="flex-1 text-left">
									<p className="font-semibold text-gray-900">E-Wallet</p>
									<p className="text-sm text-gray-600">GoPay, OVO, DANA, ShopeePay</p>
								</div>
								{paymentMethod === 'ewallet' && (
									<i className="fa-solid fa-check-circle text-xl text-purple-600"></i>
								)}
							</button>
						</div>
					</div>
				</div>

				{/* Right Column - Summary */}
				<div className="space-y-6">
					{/* Order Summary */}
					<div className="rounded-xl bg-white p-6 shadow-sm sticky top-6">
						<h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
						
						<div className="space-y-3 mb-6">
							<div className="flex items-center justify-between">
								<span className="text-gray-600">Tokens</span>
								<span className="font-semibold text-gray-900">
									{getSelectedAmount().toLocaleString()}
								</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-gray-600">Payment</span>
								<span className="font-semibold text-gray-900">
									Rp {getSelectedPrice().toLocaleString()}
								</span>
							</div>
							<div className="pt-3 border-t">
								<div className="flex items-center justify-between mb-2">
									<span className="text-gray-600">Current Balance</span>
									<span className="font-semibold text-gray-900">
										{currentBalance.toLocaleString()}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-gray-900 font-semibold">New Balance</span>
									<span className="text-2xl font-bold text-purple-600">
										{newBalance.toLocaleString()}
									</span>
								</div>
							</div>
						</div>

						<button
							onClick={handleTopUp}
							disabled={isProcessing || (!selectedPackage && !customAmount)}
							className="w-full rounded-lg bg-purple-600 px-6 py-3 text-white hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
						>
							{isProcessing ? (
								<>
									<i className="fa-solid fa-spinner fa-spin mr-2"></i>
									Processing...
								</>
							) : (
								<>
									<i className="fa-solid fa-credit-card mr-2"></i>
									Proceed to Payment
								</>
							)}
						</button>

						<div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200">
							<p className="text-xs text-blue-800">
								<i className="fa-solid fa-shield-halved mr-1"></i>
								Your payment is secured with 256-bit SSL encryption
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
