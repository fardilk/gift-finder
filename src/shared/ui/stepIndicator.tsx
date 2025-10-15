import React from 'react';

export type Step = {
	title: string;
	subtitle?: string;
};

export function StepIndicator({ current, steps }: { current: number; steps: Step[] }) {
	return (
		<div className="w-full">
			<div className="mx-auto flex w-full max-w-3xl items-center justify-center gap-3">
				{steps.map((s, idx) => {
					const active = idx === current;
					const done = idx < current;
					return (
						<div key={idx} className="flex items-center gap-3">
							<div
								className={
									`flex h-8 w-8 items-center justify-center rounded-full border ` +
									(active
										? 'border-purple-500 bg-purple-50 text-purple-600'
										: done
										? 'border-teal-500 bg-teal-50 text-teal-600'
										: 'border-gray-300 bg-white text-gray-500')
								}
								aria-current={active ? 'step' : undefined}
							>
								{done ? '✓' : idx + 1}
							</div>
							{idx < steps.length - 1 && <div className="h-px w-10 bg-gray-200" />}
						</div>
					);
				})}
			</div>
			<div className="mt-3 text-center">
				<div className="text-sm font-medium text-gray-800">{steps[current]?.title}</div>
				{steps[current]?.subtitle ? (
					<div className="text-xs text-gray-500">{steps[current]?.subtitle}</div>
				) : null}
			</div>
		</div>
	);
}

export default StepIndicator;
