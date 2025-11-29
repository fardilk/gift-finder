import React from 'react';

export type Employee = {
	id: string | number;
	name: string;
	email: string;
	position: string;
	department: string;
	joinDate: string;
	status: 'Active' | 'Inactive' | 'On Leave';
};

type EmployeeTableProps = {
	employees: Employee[];
	onEmployeeClick?: (employee: Employee) => void;
};

export function EmployeeTable({ employees, onEmployeeClick }: EmployeeTableProps) {
	const getStatusColor = (status: Employee['status']) => {
		switch (status) {
			case 'Active':
				return 'bg-green-100 text-green-800';
			case 'Inactive':
				return 'bg-gray-100 text-gray-800';
			case 'On Leave':
				return 'bg-yellow-100 text-yellow-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	return (
		<div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
			<div className="overflow-x-auto">
				<table className="min-w-full divide-y divide-gray-200">
					<thead className="bg-gray-50">
						<tr>
							<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Name
							</th>
							<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Email
							</th>
							<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Position
							</th>
							<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Department
							</th>
							<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Join Date
							</th>
							<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Status
							</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{employees.length === 0 ? (
							<tr>
								<td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">
									<i className="fa-solid fa-users text-4xl text-gray-300 mb-2"></i>
									<p>No employees found</p>
								</td>
							</tr>
						) : (
							employees.map((employee) => (
								<tr
									key={employee.id}
									onClick={() => onEmployeeClick?.(employee)}
									className={onEmployeeClick ? 'cursor-pointer hover:bg-gray-50 transition-colors' : ''}
								>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="flex items-center">
											<div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
												<span className="text-sm font-medium text-purple-600">
													{employee.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
												</span>
											</div>
											<div className="ml-4">
												<div className="text-sm font-medium text-gray-900">{employee.name}</div>
											</div>
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm text-gray-600">{employee.email}</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm text-gray-900">{employee.position}</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm text-gray-600">{employee.department}</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm text-gray-600">{new Date(employee.joinDate).toLocaleDateString()}</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(employee.status)}`}>
											{employee.status}
										</span>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default EmployeeTable;
