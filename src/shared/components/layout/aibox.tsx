import React from 'react';
import { cn } from '../../utils/cn';
import { AiInputs } from './aibox/inputs';
import { ProfileAssistant } from './aibox/profileAssistant';
import { AiResults } from './aibox/results';
import { useAiResults } from './aibox/hooks/useAiResults';

type AiBoxProps = {
	className?: string;
};

export default function AiBox({ className }: AiBoxProps) {
	const { results, isLoading, error, submit } = useAiResults();

	const base = 'w-full md:w-[25vw] mb-6 rounded-2xl border border-purple-100 bg-white/80 p-4 shadow-sm shadow-purple-100/70 backdrop-blur';

	return (
		<section className={cn(base, className)}>
			<div className="flex flex-col gap-4">
				<ProfileAssistant className="w-full" />
				<AiInputs onSubmit={submit} />
				<AiResults className="mt-2" isLoading={isLoading} error={error} results={results} />
			</div>
		</section>
	);
}

