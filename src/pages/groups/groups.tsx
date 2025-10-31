import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from 'src/store/store';
import { Link, useNavigate } from 'react-router-dom';

export default function GroupsPage() {
  const groups = useSelector((s: RootState) => s.groups.groups);
  const navigate = useNavigate();
  return (
    <div className="mx-auto w-full max-w-5xl p-0">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Groups</h1>
            <p className="mt-1 text-sm text-slate-600">
              You have <span className="font-medium text-slate-900">{groups.length}</span> group{groups.length !== 1 ? 's' : ''}.
            </p>
          </div>
          {groups.length > 0 && (
            <button
              onClick={() => navigate('/groups/create')}
              className="inline-flex items-center gap-2 rounded-md bg-purple-600 px-3 py-2 text-sm font-medium text-white hover:bg-purple-700"
            >
              <i className="fa-solid fa-users" />
              <span>Create group</span>
            </button>
          )}
        </header>

        {groups.length === 0 ? (
          <section className="mt-8">
            <div className="flex flex-col items-center justify-center rounded-2xl bg-purple-50/40 p-8 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                <i className="fa-solid fa-users" />
              </div>
              <h2 className="mt-3 text-lg font-semibold text-slate-900">You don’t have groups yet</h2>
              <p className="mt-1 max-w-md text-sm text-slate-600">Create a group, invite people by email or link, and start organizing picks together.</p>
              <button
                onClick={() => navigate('/groups/create')}
                className="mt-4 inline-flex items-center gap-2 rounded-md bg-purple-600 px-3 py-2 text-sm font-medium text-white hover:bg-purple-700"
              >
                <i className="fa-solid fa-plus" />
                <span>Create a group</span>
              </button>
            </div>
          </section>
        ) : (
          <>
            <div className="mt-6 text-xs text-slate-500">{groups.length} groups</div>
            <section className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {groups.map((g) => (
                <Link
                  key={g.id}
                  to={{ pathname: `/groups/${g.id}`, hash: `#${encodeURIComponent(g.name)}` }}
                  className="group block rounded-xl border border-slate-200/70 bg-white/90 p-4 shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-50 text-purple-600">
                      <i className="fa-solid fa-users text-[0.9rem]" />
                    </div>
                    <div className="text-sm font-semibold text-slate-900">{g.name}</div>
                  </div>
                  <div className="mt-2 text-xs text-slate-500">{g.members.length} members • {g.picks.length} picks</div>
                </Link>
              ))}
            </section>
          </>
        )}
    </div>
  );
}
