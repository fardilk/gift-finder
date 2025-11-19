import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from 'src/store/store';
import { createOccasion } from 'src/store/occasionsSlice';

export default function OccasionCreatePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const groups = useSelector((s: RootState) => s.groups.groups);

  const [title, setTitle] = React.useState('');
  const [date, setDate] = React.useState<string>('');
  const [selectedGroups, setSelectedGroups] = React.useState<string[]>([]);

  function toggleGroup(id: string) {
    setSelectedGroups((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    const action = dispatch(createOccasion(title.trim(), date || undefined, selectedGroups));
    const newId = (action as unknown as { payload: { id: string } }).payload.id;
    if (newId) navigate(`/occasion/${newId}`);
    else navigate('/occasion');
  }

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-semibold">Create Occasion</h1>
      <form onSubmit={onSubmit} className="grid max-w-2xl gap-4">
        <label className="grid gap-1">
          <span className="text-sm text-gray-600">Title</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-md border px-3 py-2"
            placeholder="e.g., Sarah’s Birthday"
            required
          />
        </label>
        <label className="grid gap-1">
          <span className="text-sm text-gray-600">Date (optional)</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-md border px-3 py-2"
          />
        </label>
        <div className="grid gap-2">
          <div className="text-sm text-gray-600">Link existing groups (optional)</div>
          <div className="rounded-lg border p-3">
            {groups.length === 0 ? (
              <div className="text-sm text-gray-500">No groups yet.</div>
            ) : (
              <ul className="grid gap-2">
                {groups.map((g) => (
                  <li key={g.id} className="flex items-center gap-3">
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedGroups.includes(g.id)}
                        onChange={() => toggleGroup(g.id)}
                      />
                      <span className="text-sm">{g.name}</span>
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="inline-flex items-center rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
          >
            Create
          </button>
          <button
            type="button"
            onClick={() => navigate('/occasion')}
            className="inline-flex items-center rounded-md border px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
