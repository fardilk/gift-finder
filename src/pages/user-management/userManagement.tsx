import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import api from 'src/lib/api';

type UserRow = {
  id: string;
  name?: string;
  email: string;
  role?: string;
  status?: 'active' | 'invited' | 'disabled';
  lastLogin?: string; // ISO string
  createdAt?: string; // ISO string
};

async function fetchUsers(): Promise<UserRow[]> {
  try {
    const res = await api.get<UserRow[]>('/users');
    return res.data ?? [];
  } catch (err) {
    // Fallback to mock data if API is not ready
    // eslint-disable-next-line no-console
    console.warn('GET /users failed, falling back to mock data');
    return [
      { id: 'u1', name: 'Alice Wijaya', email: 'alice@example.com', role: 'admin', status: 'active', lastLogin: new Date().toISOString(), createdAt: new Date(Date.now() - 86400000 * 40).toISOString() },
      { id: 'u2', name: 'Budi Santoso', email: 'budi@example.com', role: 'member', status: 'invited', createdAt: new Date(Date.now() - 86400000 * 12).toISOString() },
      { id: 'u3', name: 'Citra Dewi', email: 'citra@example.com', role: 'member', status: 'active', lastLogin: new Date(Date.now() - 86400000 * 1).toISOString(), createdAt: new Date(Date.now() - 86400000 * 120).toISOString() },
      { id: 'u4', name: 'Dimas Arif', email: 'dimas@example.com', role: 'member', status: 'disabled', createdAt: new Date(Date.now() - 86400000 * 300).toISOString() },
    ];
  }
}

function StatusBadge({ status }: { status?: UserRow['status'] }) {
  const map: Record<string, string> = {
    active: 'bg-green-50 text-green-700 border-green-200',
    invited: 'bg-amber-50 text-amber-700 border-amber-200',
    disabled: 'bg-slate-100 text-slate-600 border-slate-200',
  };
  const label = status ?? 'unknown';
  const cls = map[status ?? ''] ?? 'bg-gray-50 text-gray-600 border-gray-200';
  return <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${cls}`}>{label}</span>;
}

export default function UserManagementPage() {
  const navigate = useNavigate();
  const [q, setQ] = React.useState('');
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const users = React.useMemo(() => {
    const list = data ?? [];
    if (!q.trim()) return list;
    const term = q.trim().toLowerCase();
    return list.filter((u) =>
      [u.name, u.email, u.role, u.status].filter(Boolean).some((v) => String(v).toLowerCase().includes(term))
    );
  }, [data, q]);

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">User Management</h1>
          <p className="text-sm text-gray-500">Manage Gift Finder users, roles, and access.</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-64 rounded-md px-3 py-2 text-sm ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-purple-300"
            placeholder="Search name, email, role…"
          />
          <Link
            to="/user-management/create"
            className="rounded-md bg-purple-600 px-3 py-2 text-sm text-white hover:bg-purple-700"
          >
            Create user
          </Link>
          <button
            onClick={() => refetch()}
            className="rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            disabled={isFetching}
          >
            {isFetching ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="p-8 text-gray-500">Loading users…</div>
      ) : error ? (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
          Failed to load users. You may be seeing mock data.
        </div>
      ) : null}

      {/* Borderless list */}
      <ul className="grid gap-3">
        {(users ?? []).map((u) => (
          <li
            key={u.id}
            className="flex items-center justify-between rounded-xl bg-white/70 px-4 py-3 shadow-sm hover:bg-white"
          >
            <div className="flex min-w-0 flex-1 items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-700">
                <i className="fa-solid fa-user text-sm" />
              </div>
              <div className="min-w-0">
                <div className="truncate font-medium text-gray-900">{u.name ?? '-'}</div>
                <div className="truncate text-sm text-gray-600">{u.email}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={u.status} />
              <span className="text-sm text-gray-600">{u.role ?? 'member'}</span>
              <button
                className="rounded-md px-3 py-1.5 text-sm text-purple-700 hover:bg-purple-50"
                onClick={() => navigate(`/user-management/${u.id}`, { state: u })}
              >
                View
              </button>
            </div>
          </li>
        ))}
        {users.length === 0 && (
          <li className="px-4 py-6 text-center text-gray-500">No users found.</li>
        )}
      </ul>
    </div>
  );
}
