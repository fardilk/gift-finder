import React from 'react';

export default function RecommendationsPage() {
  return (
    <div className="mx-auto w-full max-w-4xl p-6">
      <div className="rounded-2xl border bg-white/70 p-8 shadow-sm backdrop-blur">
        <h1 className="text-2xl font-semibold text-gray-900">Recommendations</h1>
        <p className="mt-2 text-gray-600">
          Your personalized gift recommendations will appear here.
        </p>
        <div className="mt-6 rounded-lg border border-dashed p-6 text-sm text-gray-500">
          Coming soon: We&apos;ll use your inputs to fetch smart, curated ideas.
        </div>
      </div>
    </div>
  );
}
