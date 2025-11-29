import React from 'react';

type TokenWidgetProps = {
	balance: number;
	onClick: () => void;
};

export function TokenWidget({ balance, onClick }: TokenWidgetProps) {
	const [isRevealed, setIsRevealed] = React.useState(false);
	const [showPasswordModal, setShowPasswordModal] = React.useState(false);
	const [password, setPassword] = React.useState('');
	const [error, setError] = React.useState('');

	const CORRECT_PASSWORD = 'password';

	const handleEyeClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (isRevealed) {
			setIsRevealed(false);
		} else {
			setShowPasswordModal(true);
		}
	};

	const handlePasswordSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (password === CORRECT_PASSWORD) {
			setIsRevealed(true);
			setShowPasswordModal(false);
			setPassword('');
			setError('');
		} else {
			setError('Incorrect password');
		}
	};

	const handleCloseModal = () => {
		setShowPasswordModal(false);
		setPassword('');
		setError('');
	};

	return (
		<>
			<div
				onClick={onClick}
				className="cursor-pointer rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 p-6 hover:shadow-lg transition-all min-w-0"
			>
				<div className="flex items-center justify-between">
					<div className="flex-1">
						<p className="text-xs font-medium text-amber-700">Token Remaining</p>
						<div className="mt-2 flex items-center gap-3">
							<p className="text-3xl font-bold text-amber-900">
								{isRevealed ? balance.toLocaleString() : '******'}
							</p>
							<button
								onClick={handleEyeClick}
								className="text-amber-700 hover:text-amber-900 transition-colors"
							>
								<i className={`fa-solid ${isRevealed ? 'fa-eye-slash' : 'fa-eye'} text-xl`}></i>
							</button>
						</div>
					</div>
					<i className="fa-solid fa-coins text-4xl text-amber-600 opacity-80"></i>
				</div>
			</div>

			{/* Password Modal */}
			{showPasswordModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={handleCloseModal}>
					<div className="bg-white rounded-xl p-6 w-96 shadow-xl" onClick={(e) => e.stopPropagation()}>
						<h3 className="text-lg font-bold text-gray-900 mb-4">Enter Password to View Token</h3>
						<form onSubmit={handlePasswordSubmit}>
							<input
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="Enter password"
								className="w-full rounded-lg border-2 border-gray-200 px-4 py-2 focus:border-purple-500 focus:ring-0"
								autoFocus
							/>
							{error && <p className="mt-2 text-sm text-red-600">{error}</p>}
							<div className="mt-4 flex gap-3">
								<button
									type="submit"
									className="flex-1 rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
								>
									Confirm
								</button>
								<button
									type="button"
									onClick={handleCloseModal}
									className="flex-1 rounded-lg border-2 border-gray-200 px-4 py-2 hover:bg-gray-50"
								>
									Cancel
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</>
	);
}

export default TokenWidget;
