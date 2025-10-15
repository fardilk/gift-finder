import React, {
	ButtonHTMLAttributes,
	HTMLAttributes,
	createContext,
	useContext,
	useId,
	useMemo,
	useState,
} from 'react';
import { cn } from '../utils/cn';

type CollapsibleContextValue = {
	open: boolean;
	toggle: () => void;
	contentId: string;
	triggerId: string;
};

const CollapsibleContext = createContext<CollapsibleContextValue | null>(null);

function useCollapsibleContext(component: string) {
	const ctx = useContext(CollapsibleContext);
	if (!ctx) {
		throw new Error(`${component} must be used within a <Collapsible>`);
	}
	return ctx;
}

export type CollapsibleProps = {
	children: React.ReactNode;
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	className?: string;
};

export function Collapsible({
	children,
	open: openProp,
	defaultOpen = false,
	onOpenChange,
	className,
}: CollapsibleProps) {
	const contentId = useId();
	const triggerId = useMemo(() => `${contentId}-trigger`, [contentId]);
	const [internalOpen, setInternalOpen] = useState(defaultOpen);

	const isControlled = typeof openProp === 'boolean';
	const open = isControlled ? openProp : internalOpen;

	const toggle = () => {
		const next = !open;
		if (!isControlled) {
			setInternalOpen(next);
		}
		onOpenChange?.(next);
	};

	return (
		<CollapsibleContext.Provider value={{ open, toggle, contentId, triggerId }}>
			<div className={cn('flex flex-col', className)} data-open={open}>
				{children}
			</div>
		</CollapsibleContext.Provider>
	);
}

export type CollapsibleTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	caret?: boolean;
};

export const CollapsibleTrigger = React.forwardRef<HTMLButtonElement, CollapsibleTriggerProps>(
	({ className, children, caret = true, ...props }, ref) => {
		const { open, toggle, contentId, triggerId } = useCollapsibleContext('CollapsibleTrigger');
		return (
			<button
				ref={ref}
				type="button"
				className={cn(
					'group flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors',
					className
				)}
				aria-expanded={open}
				aria-controls={contentId}
				id={triggerId}
				onClick={toggle}
				{...props}
			>
				<span className="flex flex-1 items-center gap-2">{children}</span>
				{caret ? (
					<span
						className={cn(
							'transition-transform duration-200 text-gray-400 group-hover:text-gray-600',
							open ? 'rotate-90' : 'rotate-0'
						)}
						aria-hidden
					>
						▸
					</span>
				) : null}
			</button>
		);
	}
);
CollapsibleTrigger.displayName = 'CollapsibleTrigger';

export type CollapsibleContentProps = HTMLAttributes<HTMLDivElement>;

export const CollapsibleContent = React.forwardRef<HTMLDivElement, CollapsibleContentProps>(
	({ className, children, ...props }, ref) => {
		const { open, contentId, triggerId } = useCollapsibleContext('CollapsibleContent');
		return (
			<div
				ref={ref}
				id={contentId}
				role="region"
				aria-labelledby={triggerId}
				data-open={open}
				className={cn(
					'grid overflow-hidden transition-all duration-300 ease-out [&[data-open="false"]]:grid-rows-[0fr] [&[data-open="false"]]:opacity-0 [&[data-open="true"]]:grid-rows-[1fr] [&[data-open="true"]]:opacity-100',
					className
				)}
				{...props}
			>
				<div className="overflow-hidden">{children}</div>
			</div>
		);
	}
);
CollapsibleContent.displayName = 'CollapsibleContent';

export type CollapsibleComponents = {
	Root: typeof Collapsible;
	Trigger: typeof CollapsibleTrigger;
	Content: typeof CollapsibleContent;
};

export const CollapsibleUI: CollapsibleComponents = {
	Root: Collapsible,
	Trigger: CollapsibleTrigger,
	Content: CollapsibleContent,
};
