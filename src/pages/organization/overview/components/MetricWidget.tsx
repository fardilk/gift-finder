import React from 'react';

type MetricWidgetProps = {
	label: string;
	value: string | number;
	icon: string;
	color: 'amber' | 'purple' | 'blue' | 'green';
	onClick?: () => void;
};

export function MetricWidget({ label, value, icon, color, onClick }: MetricWidgetProps) {
	const getColorClasses = () => {
		switch (color) {
			case 'amber':
				return {
					bg: 'bg-gradient-to-br from-amber-50 to-amber-100',
					label: 'text-amber-700',
					value: 'text-amber-900',
					icon: 'text-amber-600',
				};
			case 'purple':
				return {
					bg: 'bg-gradient-to-br from-purple-50 to-purple-100',
					label: 'text-purple-700',
					value: 'text-purple-900',
					icon: 'text-purple-600',
				};
			case 'blue':
				return {
					bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
					label: 'text-blue-700',
					value: 'text-blue-900',
					icon: 'text-blue-600',
				};
			case 'green':
				return {
					bg: 'bg-gradient-to-br from-green-50 to-green-100',
					label: 'text-green-700',
					value: 'text-green-900',
					icon: 'text-green-600',
				};
		}
	};

	const classes = getColorClasses();

	return (
		<div
			onClick={onClick}
			className={`rounded-xl ${classes.bg} p-6 min-w-0 ${onClick ? 'cursor-pointer hover:shadow-lg transition-all' : ''}`}
		>
			<div className="flex items-center justify-between">
				<div>
					<p className={`text-xs font-medium ${classes.label}`}>{label}</p>
					<p className={`mt-2 text-3xl font-bold ${classes.value}`}>{value}</p>
				</div>
				<i className={`fa-solid ${icon} text-4xl ${classes.icon} opacity-80`}></i>
			</div>
		</div>
	);
}

export default MetricWidget;
