import * as React from 'react';

export function InfoDisplay({
  items,
}: {
  items: Array<{ label: string; value?: string; multiline?: boolean }>;
}) {
  return (
    <dl className="grid gap-4">
      {items.map((it) => (
        <div key={it.label} className="grid gap-1">
          <dt className="text-xs text-slate-500">{it.label}</dt>
          <dd className={`text-sm text-slate-800 ${it.multiline ? 'whitespace-pre-wrap' : ''}`}>
            {it.value && String(it.value).trim().length > 0 ? it.value : '-'}
          </dd>
        </div>
      ))}
    </dl>
  );
}
