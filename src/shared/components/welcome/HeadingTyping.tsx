import React from 'react';
import { cn } from 'src/shared/utils/cn';
import { useHeadingTyping } from '../effects/typeEffect';

export function HeadingTyping({ className }: { className?: string }) {
  const { text } = useHeadingTyping({ caret: false });

  return (
    <div className={cn('text-center', className)}>
      <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900">
        Smart Recommendation{' '}
        <br />
        <span className="inline-block align-baseline">
          <span className="relative inline-flex items-center min-h-[1.2em] md:min-h-[1.6em]">
            <span
              className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 via-purple-500 to-teal-500"
              aria-live="polite"
            >
              {text}
            </span>
            <span className="ml-1 inline-block h-[1em] w-px bg-gray-400" aria-hidden />
          </span>
        </span>
      </h1>
    </div>
  );
}

export default HeadingTyping;
