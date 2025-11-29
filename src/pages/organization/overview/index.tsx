import React from 'react';
import { useNavigate } from 'react-router-dom';
import GlobalLayout from 'src/pages/global';
import { EmployeeTable, type Employee } from 'src/shared/components/tables/EmployeeTable';
import { MetricWidget } from './components/MetricWidget';
import { TokenWidget } from './components/TokenWidget';
import { ContactWidget } from './components/ContactWidget';
import { BranchesWidget } from './components/BranchesWidget';
import { EditForm } from './components/EditForm';

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

export default function OrganizationOverviewPage() {
	const navigate = useNavigate();

	// Mock data - will be replaced with API calls later
	const organizationData = {
		name: 'TechCorp Industries',
		description: 'A leading technology company focused on innovation and digital transformation. We provide cutting-edge solutions for businesses worldwide.',
		contact: {
			email: 'contact@techcorp.com',
			phone: '+62 21 1234 5678',
			website: 'https://techcorp.com',
		},
		branches: [
			{ id: 1, name: 'Headquarters - Jakarta', address: 'Jl. Sudirman No. 123, Jakarta' },
			{ id: 2, name: 'Branch Office - Surabaya', address: 'Jl. Tunjungan No. 45, Surabaya' },
			{ id: 3, name: 'Branch Office - Bandung', address: 'Jl. Asia Afrika No. 78, Bandung' },
		],
		tokenBalance: 12500,
		totalEmployees: 1234,
		totalSpend: 45600,
		totalPicks: 892,
		logo: null,
		banner: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=300&fit=crop',
	};

	const mockEmployees: Employee[] = [
		{ id: 1, name: 'John Doe', email: 'john.doe@techcorp.com', position: 'Software Engineer', department: 'Engineering', joinDate: '2023-01-15', status: 'Active' },
		{ id: 2, name: 'Jane Smith', email: 'jane.smith@techcorp.com', position: 'Product Manager', department: 'Product', joinDate: '2022-06-10', status: 'Active' },
		{ id: 3, name: 'Bob Johnson', email: 'bob.johnson@techcorp.com', position: 'Designer', department: 'Design', joinDate: '2023-03-20', status: 'Active' },
		{ id: 4, name: 'Alice Williams', email: 'alice.williams@techcorp.com', position: 'HR Manager', department: 'Human Resources', joinDate: '2021-11-05', status: 'On Leave' },
		{ id: 5, name: 'Charlie Brown', email: 'charlie.brown@techcorp.com', position: 'Marketing Lead', department: 'Marketing', joinDate: '2022-08-18', status: 'Active' },
	];

	const [isEditing, setIsEditing] = React.useState(false);
	const [formData, setFormData] = React.useState<FormData>({
		name: organizationData.name,
		description: organizationData.description,
		branches: organizationData.branches,
		contact: organizationData.contact,
	});

	const handleSave = () => {
		console.log('Saving:', formData);
		setIsEditing(false);
	};

	return (
		<GlobalLayout>
			<section
				className="relative flex flex-col gap-4 pb-6 lg:flex-row lg:items-center lg:justify-between min-w-0 rounded-2xl overflow-hidden"
				style={{ minHeight: "160px" }}
			>
				{/* Background Banner */}
				<div className="absolute inset-0">
					<img
						src={organizationData.banner}
						alt="Banner"
						className="w-full h-full object-cover"
					/>

					{/* Gradient overlay */}
					<div className="absolute inset-0 bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-[2px]" />
				</div>

				{/* Foreground Content */}
				<div className="relative z-10 flex items-center gap-4 px-2 sm:px-4">
					<div className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl bg-purple-100/80 flex items-center justify-center shrink-0 backdrop-blur-sm">
						{organizationData.logo ? (
							<img src={organizationData.logo} alt="Logo" className="h-full w-full rounded-lg object-cover" />
						) : (
							<i className="fa-solid fa-building text-2xl sm:text-3xl text-purple-600"></i>
						)}
					</div>

					<div className="min-w-0">
						<p className="text-sm uppercase tracking-[0.2em] text-purple-500">
							Organization
						</p>
						<h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 truncate">
							{organizationData.name}
						</h1>
						<p className="text-sm text-slate-600 line-clamp-2">
							{organizationData.description}
						</p>
					</div>
				</div>

				{/* Edit Button */}
				<button
					onClick={() => setIsEditing(!isEditing)}
					className="relative z-10 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition-colors shrink-0 w-full sm:w-auto mr-4"
				>
					<i className="fa-solid fa-edit mr-2"></i>
					{isEditing ? "Cancel Edit" : ""}
				</button>
			</section>

			{!isEditing ? (
				<>
					{/* Metrics Section */}
					<section className="mt-10 grid gap-6">
						<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
							<TokenWidget balance={organizationData.tokenBalance} onClick={() => navigate('/organizations/token-topup')} />
							<MetricWidget
								label="Total Employees"
								value={organizationData.totalEmployees.toLocaleString()}
								icon="fa-users"
								color="purple"
								onClick={() => navigate('/organizations/members')}
							/>
							<MetricWidget
								label="Total Spend"
								value={`$${organizationData.totalSpend.toLocaleString()}`}
								icon="fa-chart-line"
								color="blue"
								onClick={() => navigate('/organizations/wallet')}
							/>
							<MetricWidget
								label="Total Picks"
								value={organizationData.totalPicks.toLocaleString()}
								icon="fa-gift"
								color="green"
								onClick={() => navigate('/organizations/picks')}
							/>
						</div>
					</section>

					{/* Contact & Branches Section */}
					<section className="mt-10 grid gap-6 min-w-0">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-w-0">
							<ContactWidget contact={organizationData.contact} />
							<BranchesWidget branches={organizationData.branches} />
						</div>
					</section>

					{/* Employee Table Section */}
					<section className="mt-10 grid gap-6 min-w-0">
						<div className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm min-w-0">
							<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
								<h2 className="text-lg font-semibold text-slate-900">Employee List</h2>
								<button
									onClick={() => navigate('/organizations/members')}
									className="rounded-lg bg-purple-600 px-4 py-2 text-sm text-white hover:bg-purple-700 w-full sm:w-auto"
								>
									<i className="fa-solid fa-eye mr-2"></i>
									View All
								</button>
							</div>
							<EmployeeTable employees={mockEmployees} onEmployeeClick={(emp) => navigate(`/organizations/members/${emp.id}`)} />
						</div>
					</section>
				</>
			) : (
				<section className="mt-10">
					<EditForm
						formData={formData}
						onFormChange={setFormData}
						onSave={handleSave}
						onCancel={() => setIsEditing(false)}
					/>
				</section>
			)}
		</GlobalLayout>
	);
}
