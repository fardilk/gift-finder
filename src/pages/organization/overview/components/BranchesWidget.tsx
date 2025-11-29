import React from 'react';

type Branch = {
	id: number;
	name: string;
	address: string;
};

type BranchesWidgetProps = {
	branches: Branch[];
};

export function BranchesWidget({ branches }: BranchesWidgetProps) {
	return (
		<div className="rounded-xl bg-white p-6 shadow-sm min-w-0">
			<div className="space-y-3">
				{branches.map((branch) => (
					<div key={branch.id} className="flex items-start gap-3">
						<div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
							<i className="fa-solid fa-map-marker-alt text-amber-600"></i>
						</div>
						<div className="min-w-0 flex-1">
							<p className="font-semibold text-gray-900">{branch.name}</p>
							<p className="text-sm text-gray-600">{branch.address}</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default BranchesWidget;
