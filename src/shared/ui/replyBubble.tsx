import * as React from 'react';
import { cn } from '../utils/cn';

export type ReplyBubbleProps = {
  role: 'user' | 'assistant';
  children: React.ReactNode;
  className?: string;
  fluid?: boolean;
};

export function ReplyBubble({ role, children, className, fluid }: ReplyBubbleProps) {
  const bubbleWidth = fluid ? 'w-full' : 'max-w-[85%]';
  const roleStyles =
    role === 'user'
      ? 'bg-purple-100 text-purple-900 border border-purple-200'
      : 'bg-slate-100 text-slate-800';
  return (
    <div
      className={cn(
        bubbleWidth,
        'wrap-break-word rounded-2xl px-3 py-2 text-sm shadow-sm',
        roleStyles,
        className
      )}
    >
      {children}
    </div>
  );
}

export default ReplyBubble;
