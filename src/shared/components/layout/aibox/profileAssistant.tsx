import * as React from 'react';

export function ProfileAssistant({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="relative h-10 w-10 overflow-hidden rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-100 via-white to-white shadow-sm">
        <div className="absolute inset-0 grid place-items-center text-1xl">🤖</div>
      </div>
    </div>
  );
}
