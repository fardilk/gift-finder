import * as React from 'react';
import { AiResult } from './hooks/useAiResults';

export function AiResults({
  className,
  isLoading,
  error,
  results,
}: {
  className?: string;
  isLoading: boolean;
  error: string | null;
  results: AiResult[];
}) {
  return (
    <div className={className}>
      {isLoading && <div className="text-sm text-slate-500">Thinking…</div>}
      {!isLoading && error && (
        <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      )}
      {!isLoading && !error && results.length === 0 && (
        <div className="text-sm text-slate-500">No results yet. Try asking something above.</div>
      )}
      {!isLoading && !error && results.length > 0 && (
        <ul className="grid gap-3">
          {results.map((r) => (
            <li key={r.id} className="rounded-xl border border-purple-100 bg-white p-4 shadow-sm">
              <p className="font-medium text-slate-900">{r.title}</p>
              <p className="mt-1 text-sm text-slate-600">{r.detail}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
