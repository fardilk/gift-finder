import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import type { RootState } from 'src/store/store';

export default function OccasionsPage() {
  const occasions = useSelector((s: RootState) => s.occasions.occasions);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Occasions</h1>
        <Link
          to="/occasion/create"
          className="inline-flex items-center gap-2 rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
        >
          Create Occasion
        </Link>
      </div>

      {occasions.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center text-gray-500">
          No occasions yet. Create your first one to start inviting people and link groups.
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {occasions.map((o) => (
            <li key={o.id} className="rounded-xl border bg-white p-4 shadow-sm">
              <div className="mb-2 text-lg font-medium">{o.title}</div>
              {o.date && (
                <div className="mb-3 text-sm text-gray-500">{new Date(o.date).toLocaleString()}</div>
              )}
              <div className="mb-3 text-sm text-gray-600">
                {o.recipients.length} recipients • {o.linkedGroupIds.length} linked groups
              </div>
              <Link
                to={`/occasion/${o.id}`}
                className="inline-flex items-center rounded-md border px-3 py-1.5 text-sm text-purple-700 hover:bg-purple-50"
              >
                Open
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
