import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

type EmployeeDetail = {
	id: string;
	name: string;
	email: string;
	phone: string;
	position: string;
	department: string;
	joinDate: string;
	status: 'Active' | 'Inactive' | 'On Leave';
	address: string;
	salary: number;
	benefits: string[];
	emergencyContact: {
		name: string;
		phone: string;
		relationship: string;
	};
};

export default function EmployeeDetailPage() {
	const { employeeId } = useParams<{ employeeId: string }>();
	const navigate = useNavigate();

	// Mock data - will be replaced with API call
	const employee: EmployeeDetail = {
		id: employeeId || '1',
		name: 'John Doe',
		email: 'john.doe@techcorp.com',
		phone: '+62 812 3456 7890',
		position: 'Software Engineer',
		department: 'Engineering',
		joinDate: '2023-01-15',
		status: 'Active',
		address: 'Jl. Sudirman No. 123, Jakarta Selatan, DKI Jakarta',
		salary: 15000000,
		benefits: ['Health Insurance', 'Annual Leave (14 days)', 'Performance Bonus', 'Remote Work'],
		emergencyContact: {
			name: 'Jane Doe',
			phone: '+62 812 9876 5432',
			relationship: 'Spouse',
		},
	};

	const getStatusColor = (status: EmployeeDetail['status']) => {
		switch (status) {
			case 'Active':
				return 'bg-green-100 text-green-800';
			case 'Inactive':
				return 'bg-gray-100 text-gray-800';
			case 'On Leave':
				return 'bg-yellow-100 text-yellow-800';
		}
	};

	return (
		<div className="space-y-6 w-full max-w-full">
			{/* Header */}
			<div className="flex items-center justify-between">
				<button
					onClick={() => navigate('/organizations/members')}
					className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
				>
					<i className="fa-solid fa-arrow-left"></i>
					<span>Back to Employees</span>
				</button>
				<button className="rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700">
					<i className="fa-solid fa-edit mr-2"></i>
					Edit Employee
				</button>
			</div>

			{/* Employee Profile Card */}
			<div className="rounded-xl bg-white p-8 shadow-sm">
				<div className="flex items-start gap-6">
					<div className="h-24 w-24 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
						<span className="text-3xl font-bold text-purple-600">
							{employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
						</span>
					</div>
					<div className="flex-1">
						<div className="flex items-start justify-between">
							<div>
								<h1 className="text-3xl font-bold text-gray-900">{employee.name}</h1>
								<p className="mt-1 text-lg text-gray-600">{employee.position}</p>
							</div>
							<span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(employee.status)}`}>
								{employee.status}
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* Information Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Contact Information */}
				<div className="rounded-xl bg-white p-6 shadow-sm">
					<h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
					<div className="space-y-4">
						<div className="flex items-center gap-3">
							<div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
								<i className="fa-solid fa-envelope text-purple-600"></i>
							</div>
							<div>
								<p className="text-xs text-gray-500">Email</p>
								<p className="font-semibold text-gray-900">{employee.email}</p>
							</div>
						</div>
						<div className="flex items-center gap-3">
							<div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
								<i className="fa-solid fa-phone text-blue-600"></i>
							</div>
							<div>
								<p className="text-xs text-gray-500">Phone</p>
								<p className="font-semibold text-gray-900">{employee.phone}</p>
							</div>
						</div>
						<div className="flex items-start gap-3">
							<div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
								<i className="fa-solid fa-location-dot text-green-600"></i>
							</div>
							<div>
								<p className="text-xs text-gray-500">Address</p>
								<p className="font-semibold text-gray-900">{employee.address}</p>
							</div>
						</div>
					</div>
				</div>

				{/* Employment Details */}
				<div className="rounded-xl bg-white p-6 shadow-sm">
					<h2 className="text-xl font-bold text-gray-900 mb-4">Employment Details</h2>
					<div className="space-y-4">
						<div className="flex items-center gap-3">
							<div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
								<i className="fa-solid fa-briefcase text-amber-600"></i>
							</div>
							<div>
								<p className="text-xs text-gray-500">Department</p>
								<p className="font-semibold text-gray-900">{employee.department}</p>
							</div>
						</div>
						<div className="flex items-center gap-3">
							<div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
								<i className="fa-solid fa-calendar-days text-indigo-600"></i>
							</div>
							<div>
								<p className="text-xs text-gray-500">Join Date</p>
								<p className="font-semibold text-gray-900">{new Date(employee.joinDate).toLocaleDateString()}</p>
							</div>
						</div>
						<div className="flex items-center gap-3">
							<div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
								<i className="fa-solid fa-money-bill-wave text-emerald-600"></i>
							</div>
							<div>
								<p className="text-xs text-gray-500">Salary</p>
								<p className="font-semibold text-gray-900">Rp {employee.salary.toLocaleString()}</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Benefits */}
			<div className="rounded-xl bg-white p-6 shadow-sm">
				<h2 className="text-xl font-bold text-gray-900 mb-4">Benefits</h2>
				<div className="flex flex-wrap gap-2">
					{employee.benefits.map((benefit, index) => (
						<span
							key={index}
							className="inline-flex items-center gap-2 rounded-lg bg-purple-50 px-4 py-2 text-sm font-medium text-purple-700"
						>
							<i className="fa-solid fa-check-circle"></i>
							{benefit}
						</span>
					))}
				</div>
			</div>

			{/* Emergency Contact */}
			<div className="rounded-xl bg-white p-6 shadow-sm">
				<h2 className="text-xl font-bold text-gray-900 mb-4">Emergency Contact</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div>
						<p className="text-xs text-gray-500 mb-1">Name</p>
						<p className="font-semibold text-gray-900">{employee.emergencyContact.name}</p>
					</div>
					<div>
						<p className="text-xs text-gray-500 mb-1">Phone</p>
						<p className="font-semibold text-gray-900">{employee.emergencyContact.phone}</p>
					</div>
					<div>
						<p className="text-xs text-gray-500 mb-1">Relationship</p>
						<p className="font-semibold text-gray-900">{employee.emergencyContact.relationship}</p>
					</div>
				</div>
			</div>
		</div>
	);
}
