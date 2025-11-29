import React from 'react';

type Branch = {
	id: number;
	name: string;
	address: string;
};

type ContactInfo = {
	email: string;
	phone: string;
	website: string;
};

type FormData = {
	name: string;
	description: string;
	branches: Branch[];
	contact: ContactInfo;
};

type EditFormProps = {
	formData: FormData;
	onFormChange: (data: FormData) => void;
	onSave: () => void;
	onCancel: () => void;
};

export function EditForm({ formData, onFormChange, onSave, onCancel }: EditFormProps) {
	const handleAddBranch = () => {
		onFormChange({
			...formData,
			branches: [...formData.branches, { id: Date.now(), name: '', address: '' }],
		});
	};

	const handleRemoveBranch = (id: number) => {
		onFormChange({
			...formData,
			branches: formData.branches.filter((b) => b.id !== id),
		});
	};

	const handleBranchChange = (id: number, field: 'name' | 'address', value: string) => {
		onFormChange({
			...formData,
			branches: formData.branches.map((b) => (b.id === id ? { ...b, [field]: value } : b)),
		});
	};

	return (
		<div className="rounded-xl bg-white p-8 shadow-sm space-y-6 w-full min-w-0">
			{/* Organization Name */}
			<div>
				<input
					type="text"
					value={formData.name}
					onChange={(e) => onFormChange({ ...formData, name: e.target.value })}
					placeholder="Organization Name"
					className="w-full rounded-lg border-2 border-gray-200 px-4 py-3 text-lg font-semibold focus:border-purple-500 focus:ring-0"
				/>
			</div>

			{/* Description */}
			<div>
				<textarea
					value={formData.description}
					onChange={(e) => onFormChange({ ...formData, description: e.target.value })}
					placeholder="Description"
					rows={4}
					className="w-full rounded-lg border-2 border-gray-200 px-4 py-3 focus:border-purple-500 focus:ring-0"
				/>
			</div>

			{/* Branches */}
			<div>
				<div className="mb-3 flex items-center justify-between">
					<h3 className="font-semibold text-gray-900">Branches</h3>
					<button
						onClick={handleAddBranch}
						type="button"
						className="rounded-lg bg-purple-100 px-3 py-1 text-sm text-purple-700 hover:bg-purple-200"
					>
						<i className="fa-solid fa-plus mr-1"></i>
						Add Branch
					</button>
				</div>
				<div className="space-y-3">
					{formData.branches.map((branch) => (
						<div key={branch.id} className="flex gap-3">
							<input
								type="text"
								value={branch.name}
								onChange={(e) => handleBranchChange(branch.id, 'name', e.target.value)}
								placeholder="Branch Name"
								className="flex-1 rounded-lg border-2 border-gray-200 px-4 py-2 focus:border-purple-500 focus:ring-0"
							/>
							<input
								type="text"
								value={branch.address}
								onChange={(e) => handleBranchChange(branch.id, 'address', e.target.value)}
								placeholder="Address"
								className="flex-1 rounded-lg border-2 border-gray-200 px-4 py-2 focus:border-purple-500 focus:ring-0"
							/>
							<button
								onClick={() => handleRemoveBranch(branch.id)}
								type="button"
								className="rounded-lg bg-red-100 px-3 py-2 text-red-600 hover:bg-red-200 shrink-0"
							>
								<i className="fa-solid fa-trash"></i>
							</button>
						</div>
					))}
				</div>
			</div>

			{/* Contact */}
			<div>
				<h3 className="mb-3 font-semibold text-gray-900">Contact Information</h3>
				<div className="space-y-3">
					<div className="flex items-center gap-3">
						<i className="fa-solid fa-envelope text-gray-400 w-5 shrink-0"></i>
						<input
							type="email"
							value={formData.contact.email}
							onChange={(e) => onFormChange({ ...formData, contact: { ...formData.contact, email: e.target.value } })}
							placeholder="Email"
							className="flex-1 rounded-lg border-2 border-gray-200 px-4 py-2 focus:border-purple-500 focus:ring-0"
						/>
					</div>
					<div className="flex items-center gap-3">
						<i className="fa-solid fa-phone text-gray-400 w-5 shrink-0"></i>
						<input
							type="tel"
							value={formData.contact.phone}
							onChange={(e) => onFormChange({ ...formData, contact: { ...formData.contact, phone: e.target.value } })}
							placeholder="Phone"
							className="flex-1 rounded-lg border-2 border-gray-200 px-4 py-2 focus:border-purple-500 focus:ring-0"
						/>
					</div>
					<div className="flex items-center gap-3">
						<i className="fa-solid fa-globe text-gray-400 w-5 shrink-0"></i>
						<input
							type="url"
							value={formData.contact.website}
							onChange={(e) => onFormChange({ ...formData, contact: { ...formData.contact, website: e.target.value } })}
							placeholder="Website"
							className="flex-1 rounded-lg border-2 border-gray-200 px-4 py-2 focus:border-purple-500 focus:ring-0"
						/>
					</div>
				</div>
			</div>

			{/* Action Buttons */}
			<div className="flex gap-3 pt-4">
				<button onClick={onSave} className="rounded-lg bg-purple-600 px-6 py-2 text-white hover:bg-purple-700">
					<i className="fa-solid fa-save mr-2"></i>
					Save Changes
				</button>
				<button onClick={onCancel} className="rounded-lg border-2 border-gray-200 px-6 py-2 hover:bg-gray-50">
					Cancel
				</button>
			</div>
		</div>
	);
}

export default EditForm;
