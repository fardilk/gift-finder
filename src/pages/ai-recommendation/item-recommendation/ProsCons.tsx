import * as React from 'react';

type Props = {
  pros: string[];
  cons: string[];
};

export default function ProsCons({ pros, cons }: Props) {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="rounded-xl border border-green-200 bg-green-50/40 p-4">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-green-800">
          <i className="fa-solid fa-circle-check" /> Pros
        </div>
        <ul className="list-inside list-disc text-sm text-green-900">
          {pros.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl border border-red-200 bg-red-50/40 p-4">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-red-800">
          <i className="fa-solid fa-circle-xmark" /> Cons
        </div>
        <ul className="list-inside list-disc text-sm text-red-900">
          {cons.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
