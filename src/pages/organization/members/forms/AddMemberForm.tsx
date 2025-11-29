import React, { useState } from 'react';
import { showSuccessToast } from '@/shared/components/toast/successToast';

interface AddMemberFormData {
	mode: 'manual' | 'excel' | 'email';
	data?: Record<string, string>;
	file?: File;
	emails?: string[];
}

interface AddMemberFormProps {
	onSubmit: (data: AddMemberFormData) => void;
	onCancel: () => void;
}

type FormMode = 'manual' | 'excel' | 'email';

export default function AddMemberForm({ onSubmit, onCancel }: AddMemberFormProps) {
	const [mode, setMode] = useState<FormMode>('manual');
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		email: '',
		dateOfBirth: '',
		phone: '',
		street: '',
		city: '',
		state: '',
		zipCode: '',
		country: '',
	});
	const [file, setFile] = useState<File | null>(null);
	const [emailList, setEmailList] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleManualSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		try {
			await onSubmit({ mode: 'manual', data: formData });
			showSuccessToast('Member');
			setFormData({
				firstName: '',
				lastName: '',
				email: '',
				dateOfBirth: '',
				phone: '',
				street: '',
				city: '',
				state: '',
				zipCode: '',
				country: '',
			});
		} catch (error) {
			console.error('Failed to add member:', error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleExcelUpload = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!file) return;

		setIsSubmitting(true);
		try {
			await onSubmit({ mode: 'excel', file });
			showSuccessToast('Members via Excel');
			setFile(null);
		} catch (error) {
			console.error('Failed to upload Excel:', error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleEmailInvite = async (e: React.FormEvent) => {
		e.preventDefault();
		const emails = emailList.split('\n').filter((email) => email.trim());

		setIsSubmitting(true);
		try {
			await onSubmit({ mode: 'email', emails });
			showSuccessToast('Email Invitations');
			setEmailList('');
		} catch (error) {
			console.error('Failed to send invitations:', error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="rounded-lg border border-gray-200 bg-white shadow-sm">
			{/* Mode Tabs */}
			<div className="border-b border-gray-200 px-6 pt-6">
				<div className="flex space-x-1">
					<button
						onClick={() => setMode('manual')}
						className={`rounded-t-lg px-4 py-2 text-sm font-medium ${
							mode === 'manual'
								? 'border-b-2 border-purple-600 text-purple-600'
								: 'text-gray-600 hover:text-gray-900'
						}`}
					>
						<i className="fa-solid fa-pen-to-square mr-2"></i>
						Manual Entry
					</button>
					<button
						onClick={() => setMode('excel')}
						className={`rounded-t-lg px-4 py-2 text-sm font-medium ${
							mode === 'excel'
								? 'border-b-2 border-purple-600 text-purple-600'
								: 'text-gray-600 hover:text-gray-900'
						}`}
					>
						<i className="fa-solid fa-file-excel mr-2"></i>
						Excel Upload
					</button>
					<button
						onClick={() => setMode('email')}
						className={`rounded-t-lg px-4 py-2 text-sm font-medium ${
							mode === 'email'
								? 'border-b-2 border-purple-600 text-purple-600'
								: 'text-gray-600 hover:text-gray-900'
						}`}
					>
						<i className="fa-solid fa-envelope mr-2"></i>
						Email Invitation
					</button>
				</div>
			</div>

			{/* Manual Entry Form */}
			{mode === 'manual' && (
				<form onSubmit={handleManualSubmit} className="p-6">
					<div className="space-y-6">
						<div>
							<h3 className="mb-4 text-lg font-semibold text-gray-900">
								Personal Information
							</h3>
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
								<div>
									<label className="block text-sm font-medium text-gray-700">
										First Name *
									</label>
									<input
										type="text"
										name="firstName"
										value={formData.firstName}
										onChange={handleInputChange}
										required
										className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:outline-none focus:ring-purple-500"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700">
										Last Name *
									</label>
									<input
										type="text"
										name="lastName"
										value={formData.lastName}
										onChange={handleInputChange}
										required
										className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:outline-none focus:ring-purple-500"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700">
										Email *
									</label>
									<input
										type="email"
										name="email"
										value={formData.email}
										onChange={handleInputChange}
										required
										className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:outline-none focus:ring-purple-500"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700">
										Date of Birth
									</label>
									<input
										type="date"
										name="dateOfBirth"
										value={formData.dateOfBirth}
										onChange={handleInputChange}
										className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:outline-none focus:ring-purple-500"
									/>
								</div>
								<div className="sm:col-span-2">
									<label className="block text-sm font-medium text-gray-700">
										Phone
									</label>
									<input
										type="tel"
										name="phone"
										value={formData.phone}
										onChange={handleInputChange}
										className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:outline-none focus:ring-purple-500"
									/>
								</div>
							</div>
						</div>

						<div>
							<h3 className="mb-4 text-lg font-semibold text-gray-900">Address</h3>
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
								<div className="sm:col-span-2">
									<label className="block text-sm font-medium text-gray-700">
										Street
									</label>
									<input
										type="text"
										name="street"
										value={formData.street}
										onChange={handleInputChange}
										className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:outline-none focus:ring-purple-500"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700">
										City
									</label>
									<input
										type="text"
										name="city"
										value={formData.city}
										onChange={handleInputChange}
										className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:outline-none focus:ring-purple-500"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700">
										State
									</label>
									<input
										type="text"
										name="state"
										value={formData.state}
										onChange={handleInputChange}
										className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:outline-none focus:ring-purple-500"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700">
										Zip Code
									</label>
									<input
										type="text"
										name="zipCode"
										value={formData.zipCode}
										onChange={handleInputChange}
										className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:outline-none focus:ring-purple-500"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700">
										Country
									</label>
									<input
										type="text"
										name="country"
										value={formData.country}
										onChange={handleInputChange}
										className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:outline-none focus:ring-purple-500"
									/>
								</div>
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
							{isSubmitting ? 'Adding...' : 'Add Member'}
						</button>
					</div>
				</form>
			)}

			{/* Excel Upload Form */}
			{mode === 'excel' && (
				<form onSubmit={handleExcelUpload} className="p-6">
					<div className="space-y-4">
						<div>
							<h3 className="mb-2 text-lg font-semibold text-gray-900">
								Upload Excel File
							</h3>
							<p className="text-sm text-gray-600">
								Upload an Excel file (.xlsx, .xls) with member information. The file
								should contain columns: firstName, lastName, email, dateOfBirth, phone,
								street, city, state, zipCode, country.
							</p>
						</div>

						<div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
							<input
								type="file"
								accept=".xlsx,.xls"
								onChange={(e) => setFile(e.target.files?.[0] || null)}
								className="hidden"
								id="excel-upload"
							/>
							<label
								htmlFor="excel-upload"
								className="cursor-pointer text-gray-600 hover:text-purple-600"
							>
								<i className="fa-solid fa-file-excel mb-3 text-4xl text-gray-400"></i>
								<p className="mb-2 font-medium">
									{file ? file.name : 'Click to upload Excel file'}
								</p>
								<p className="text-sm text-gray-500">or drag and drop</p>
							</label>
						</div>

						<div className="rounded-lg bg-blue-50 p-4">
							<div className="flex">
								<i className="fa-solid fa-circle-info mr-3 text-blue-600"></i>
								<div className="text-sm text-blue-700">
									<p className="font-medium">Template Download</p>
									<p className="mt-1">
										Download our{' '}
										<a href="#" className="underline">
											Excel template
										</a>{' '}
										to ensure your file has the correct format.
									</p>
								</div>
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
							disabled={!file || isSubmitting}
							className="rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 disabled:bg-gray-400"
						>
							{isSubmitting ? 'Uploading...' : 'Upload & Import'}
						</button>
					</div>
				</form>
			)}

			{/* Email Invitation Form */}
			{mode === 'email' && (
				<form onSubmit={handleEmailInvite} className="p-6">
					<div className="space-y-4">
						<div>
							<h3 className="mb-2 text-lg font-semibold text-gray-900">
								Send Email Invitations
							</h3>
							<p className="text-sm text-gray-600">
								Enter email addresses (one per line) to send member invitations. Recipients
								will receive an email with a link to complete their profile.
							</p>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700">
								Email Addresses *
							</label>
							<textarea
								value={emailList}
								onChange={(e) => setEmailList(e.target.value)}
								required
								rows={8}
								placeholder="john@example.com&#10;jane@example.com&#10;bob@example.com"
								className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:outline-none focus:ring-purple-500"
							/>
							<p className="mt-1 text-sm text-gray-500">
								{emailList.split('\n').filter((e) => e.trim()).length} email(s) entered
							</p>
						</div>

						<div className="rounded-lg bg-green-50 p-4">
							<div className="flex">
								<i className="fa-solid fa-envelope-circle-check mr-3 text-green-600"></i>
								<div className="text-sm text-green-700">
									<p className="font-medium">Invitation Email</p>
									<p className="mt-1">
										Each recipient will receive a personalized invitation with
										instructions to join the organization and complete their profile.
									</p>
								</div>
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
							disabled={!emailList.trim() || isSubmitting}
							className="rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 disabled:bg-gray-400"
						>
							{isSubmitting ? 'Sending...' : 'Send Invitations'}
						</button>
					</div>
				</form>
			)}
		</div>
	);
}
