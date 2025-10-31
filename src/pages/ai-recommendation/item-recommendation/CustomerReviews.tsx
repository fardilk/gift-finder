import * as React from 'react';

type Review = {
  id: string;
  author: string;
  rating: number; // 1-5
  text: string;
  date: string;
};

function Stars({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(5, value));
  return (
    <div className="text-yellow-500">
      {Array.from({ length: 5 }).map((_, i) => (
        <i key={i} className={[
          'fa-solid',
          i < clamped ? 'fa-star' : 'fa-star-half-stroke opacity-30',
          'mr-0.5'
        ].join(' ')} />
      ))}
    </div>
  );
}

export default function CustomerReviews({ reviews }: { reviews?: Review[] }) {
  return (
    <section>
      <div className="text-sm font-semibold text-slate-900">Customer reviews</div>
      {reviews && reviews.length > 0 ? (
        <div className="mt-2 space-y-2">
          {reviews.map((r) => (
            <div key={r.id} className="rounded-xl border border-slate-200 bg-white p-3 text-sm">
              <div className="flex items-center justify-between">
                <div className="font-medium text-slate-900">{r.author}</div>
                <div className="text-xs text-slate-500">{r.date}</div>
              </div>
              <div className="mt-1"><Stars value={r.rating} /></div>
              <p className="mt-1 text-slate-700">{r.text}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-1 text-xs text-slate-500">No customer reviews yet.</div>
      )}
    </section>
  );
}
