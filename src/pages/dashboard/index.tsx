import React from 'react';
import { useAuth } from 'src/auth/context/app-auth/AuthProvider';
import { fetchMyPerson } from 'src/pages/profile/api';
import type { Person } from 'src/pages/profile/api';
import { showSuccessToast } from 'src/shared/components/toast/successToast';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from 'src/store/store';
import { removePick } from 'src/store/picksSlice';
import { Trash2 } from 'lucide-react';
import { addPickToGroup } from 'src/store/groupsSlice';
import type { PickItem } from 'src/store/picksSlice';
import { Link } from 'react-router-dom';

const upcomingOccasions = [
  { name: 'Aisha’s Graduation', date: 'June 12', relationship: 'Cousin' },
  { name: 'Dad’s Birthday', date: 'July 02', relationship: 'Parent' },
  { name: 'Team Offsite', date: 'July 18', relationship: 'Colleagues' },
];

export default function IndividualDashboardPage() {
  const picks = useSelector((s: RootState) => s.picks.items);
  const dispatch = useDispatch();
  const { user } = useAuth();

  const [person, setPerson] = React.useState<Person | null>(null);


  React.useEffect(() => {
  let mounted = true;

  fetchMyPerson()
    .then((p) => {
      if (!mounted) return;
      setPerson(p);
    })
    .catch((e) => {
      console.error("fetchMyPerson error:", e);
    });

  return () => {
    mounted = false;
  };
  }, []);


  const displayName =
    person?.firstName || person?.lastName
      ? `${person.firstName ?? ''} ${person.lastName ?? ''}`.trim()
      : user?.name ?? 'User';

  return (
    <div className="px-6 py-8">

      {/* HEADER */}
      <section className="flex flex-col gap-4 border-b border-purple-100 pb-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-purple-500">
            Welcome Back {displayName}
          </p>

          <h1 className="text-3xl font-semibold text-slate-900">Your gifting dashboard</h1>

          <p className="max-w-2xl text-sm text-slate-500">
            Track the people you care about, discover thoughtful ideas, and keep gifting conversations flowing.
          </p>
        </div>
      </section>


      {/* MY PICKS */}
      <section className="mt-10 grid gap-6">
        <div className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">My Picks</h2>
            {picks.length > 0 && <span className="text-xs text-slate-500">{picks.length} saved</span>}
          </div>

          {picks.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">No picks yet. Go to AI Recommendation and save some ideas.</p>
          ) : (
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {picks.map((p) => (
                <div
                  key={p.id}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  <div className="aspect-4/3 w-full bg-slate-100">
                    {p.imageUrl && (
                      <img src={p.imageUrl} alt={p.title} className="h-full w-full object-cover" />
                    )}
                  </div>

                  <div className="p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-sm font-semibold text-slate-900">{p.title}</div>

                      <button
                        aria-label="Remove pick"
                        onClick={() => dispatch(removePick(p.id))}
                        className="rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {p.description && <p className="mt-1 text-xs text-slate-600">{p.description}</p>}
                    {p.cost && <div className="mt-2 text-xs font-medium text-slate-900">{p.cost}</div>}

                    <GroupAttachControl pick={p} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>


      {/* OCCASIONS */}
      <section className="mt-10 grid gap-6">
        <div className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Upcoming occasions</h2>

          <ul className="mt-4 space-y-4">
            {upcomingOccasions.map((o) => (
              <li
                key={o.name}
                className="flex items-center justify-between rounded-xl border border-purple-50 bg-purple-50/40 px-4 py-3 text-sm"
              >
                <div>
                  <p className="font-medium text-slate-900">{o.name}</p>
                  <p className="text-xs text-slate-500">{o.relationship}</p>
                </div>

                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-purple-500">
                  {o.date}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

    </div>
  );
}

/*****************************************
 * GROUP ATTACH CONTROL
 *****************************************/
function GroupAttachControl({ pick }: { pick: PickItem }) {
  const groups = useSelector((s: RootState) => s.groups.groups);
  const dispatch = useDispatch();
  const [groupId, setGroupId] = React.useState('');

  const alreadyInIds = React.useMemo(
    () => groups.filter((g) => g.picks.some((p) => p.id === pick.id)).map((g) => g.id),
    [groups, pick.id]
  );

  const onAdd = () => {
    if (!groupId) return;
    const g = groups.find((gg) => gg.id === groupId);
    if (!g) return;
    dispatch(addPickToGroup({ groupId, pick }));
  };

  return (
    <div className="mt-3 border-t border-slate-100 pt-2">
      {groups.length === 0 ? (
        <div className="text-xs text-slate-500">
          No groups yet. <Link className="font-medium text-purple-600 hover:underline" to="/groups">Create one</Link>.
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <select
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-900"
            >
              <option value="">Select group…</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id} disabled={alreadyInIds.includes(g.id)}>
                  {g.name} {alreadyInIds.includes(g.id) ? '✓' : ''}
                </option>
              ))}
            </select>

            <button
              onClick={onAdd}
              disabled={!groupId || alreadyInIds.includes(groupId)}
              className="h-8 rounded-md bg-purple-600 px-3 text-xs font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Add to group
            </button>
          </div>

          {alreadyInIds.length > 0 && (
            <div className="text-[11px] text-slate-500">
              Already in: {groups.filter((g) => alreadyInIds.includes(g.id)).map((g) => g.name).join(', ')}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
