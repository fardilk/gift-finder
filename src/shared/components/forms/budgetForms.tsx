import React from 'react';

export function ReviewAndConfirm({ summary }: { summary: string }) {
  return (
    <div className="space-y-3">
      <div className="rounded-lg border bg-white/70 p-4 text-left shadow-sm backdrop-blur">
        <div className="text-sm text-gray-600">Summary</div>
        <div className="mt-1 text-gray-800">{summary}</div>
      </div>
      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input type="checkbox" className="h-4 w-4" />
        I agree to let the system store my data to generate suggestions.
      </label>
      <button type="button" className="mt-2 inline-flex items-center rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700">
        ✨ Generate Recommendations
      </button>
    </div>
  );
}

export default ReviewAndConfirm;
