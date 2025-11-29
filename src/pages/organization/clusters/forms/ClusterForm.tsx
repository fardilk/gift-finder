import React, { useState } from 'react';
import { showSuccessToast } from '@/shared/components/toast/successToast';

interface ClusterFormData {
	name: string;
	description?: string;
	color?: string;
}

interface ClusterFormProps {
	cluster?: {
		id: number;
		name: string;
		description?: string;
		color?: string;
	};
	onSubmit: (data: ClusterFormData) => void;
	onCancel: () => void;
}

export default function ClusterForm({ cluster, onSubmit, onCancel }: ClusterFormProps) {
	const [formData, setFormData] = useState({
		name: cluster?.name || '',
		description: cluster?.description || '',
		color: cluster?.color || 'purple',
	});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const colors = [
		{ name: 'Purple', value: 'purple' },
		{ name: 'Blue', value: 'blue' },
		{ name: 'Green', value: 'green' },
		{ name: 'Red', value: 'red' },
		{ name: 'Yellow', value: 'yellow' },
		{ name: 'Pink', value: 'pink' },
		{ name: 'Indigo', value: 'indigo' },
		{ name: 'Orange', value: 'orange' },
	];

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		try {
			await onSubmit(formData);
			showSuccessToast(cluster ? 'Cluster Update' : 'Cluster Creation');
		} catch (error) {
			console.error('Failed to save cluster:', error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
			<h2 className="mb-6 text-xl font-semibold text-gray-900">
				{cluster ? 'Edit Cluster' : 'Create New Cluster'}
			</h2>

			<div className="space-y-4">
				<div>
					<label className="block text-sm font-medium text-gray-700">
						Cluster Name *
					</label>
					<input
						type="text"
						name="name"
						value={formData.name}
						onChange={handleInputChange}
						required
						placeholder="e.g., Engineering Team, Marketing Department"
						className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:outline-none focus:ring-purple-500"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700">Description</label>
					<textarea
						name="description"
						value={formData.description}
						onChange={handleInputChange}
						rows={3}
						placeholder="Brief description of this cluster..."
						className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:outline-none focus:ring-purple-500"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700">Color Theme</label>
					<div className="mt-2 grid grid-cols-4 gap-3 sm:grid-cols-8">
						{colors.map((color) => (
							<button
								key={color.value}
								type="button"
								onClick={() => setFormData({ ...formData, color: color.value })}
								className={`flex flex-col items-center justify-center rounded-lg border-2 p-2 transition-all ${
									formData.color === color.value
										? 'border-gray-900 bg-gray-50'
										: 'border-gray-200 hover:border-gray-300'
								}`}
								title={color.name}
							>
								<div
									className={`h-8 w-8 rounded-full bg-${color.value}-500`}
									style={{
										backgroundColor:
											color.value === 'purple'
												? '#9333ea'
												: color.value === 'blue'
													? '#3b82f6'
													: color.value === 'green'
														? '#22c55e'
														: color.value === 'red'
															? '#ef4444'
															: color.value === 'yellow'
																? '#eab308'
																: color.value === 'pink'
																	? '#ec4899'
																	: color.value === 'indigo'
																		? '#6366f1'
																		: '#f97316',
									}}
								></div>
								<span className="mt-1 text-xs text-gray-600">{color.name}</span>
							</button>
						))}
					</div>
				</div>
			</div>

			<div className="mt-6 flex justify-end space-x-3">
				<button
					type="button"
					onClick={onCancel}
					className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
				>
					Cancel
				</button>
				<button
					type="submit"
					disabled={isSubmitting}
					className="rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 disabled:bg-gray-400"
				>
					{isSubmitting
						? 'Saving...'
						: cluster
							? 'Update Cluster'
							: 'Create Cluster'}
				</button>
			</div>
		</form>
	);
}
