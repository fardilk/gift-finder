import * as React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from 'src/store/store';
import { addMember, createInviteLink, removePickFromGroup, addOrReplaceGroup } from 'src/store/groupsSlice';
import type { PickItem } from 'src/store/picksSlice';

export default function GroupRoomPage() {
  const { groupId } = useParams();
  const dispatch = useDispatch();
  const group = useSelector((s: RootState) => s.groups.groups.find((g) => g.id === groupId));
  const [email, setEmail] = React.useState('');
  const friends = React.useMemo(() => {
    const toTitle = (s: string) => s.replace(/[-_.]/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());
    return (group?.members || []).map((em) => {
      const local = em.split('@')[0] || em;
      return { name: toTitle(local), occupation: 'Friend' };
    });
  }, [group?.members]);

  // Seed sample data for specific demo URL
  React.useEffect(() => {
    const SAMPLE_ID = 'O0Q0o74EmRv1qeCwj186K';
    const SAMPLE_NAME = 'Maen bola gacor';
    const shouldSeed = groupId === SAMPLE_ID && (!group || (group.members.length === 0 && group.picks.length === 0));
    if (shouldSeed) {
      const members = [
        'agus.setiawan@example.com',
        'budi.santoso@example.com',
        'citra.dewi@example.com',
        'doni.pratama@example.com',
        'eka.lestari@example.com',
      ];
      const picks: PickItem[] = [
        {
          id: 'p1',
          title: 'Premium Football Jersey',
          imageUrl: 'https://picsum.photos/id/1003/1200/900',
          description: 'Official club jersey, breathable fabric, match-ready.',
          cost: '$79',
          savedAt: Date.now(),
        },
        {
          id: 'p2',
          title: 'Match Day Snack Box',
          imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&q=80&fm=jpg',
          description: 'Assorted snacks ideal for watching the big game.',
          cost: '$29',
          savedAt: Date.now(),
        },
        {
          id: 'p3',
          title: 'Team Scarf & Cap Set',
          imageUrl: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=1200&q=80&fm=jpg',
          description: 'Warm scarf and adjustable cap in team colors.',
          cost: '$35',
          savedAt: Date.now(),
        },
        {
          id: 'p4',
          title: 'Personalized Water Bottle',
          imageUrl: 'https://picsum.photos/id/1012/1200/900',
          description: 'Stainless steel bottle with name engraving.',
          cost: '$22',
          savedAt: Date.now(),
        },
        {
          id: 'p5',
          title: 'Portable Mini Speaker',
          imageUrl: 'https://picsum.photos/id/1025/1200/900',
          description: 'Compact Bluetooth speaker perfect for match day.',
          cost: '$45',
          savedAt: Date.now(),
        },
      ];

      dispatch(
        addOrReplaceGroup({
          id: SAMPLE_ID,
          name: SAMPLE_NAME,
          members,
          picks,
          inviteLinks: [],
          createdAt: Date.now(),
        })
      );
    }
  }, [groupId, group, dispatch]);

  if (!group) {
    return (
      <div className="p-6">
        <p className="text-sm">Group not found. Go back to <Link to="/groups" className="text-purple-600 underline">Groups</Link>.</p>
      </div>
    );
  }

  const inviteBase = window.location.origin + `/join?group=${group.id}`;

  return (
    <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-slate-900">{group.name}</h1>
          <Link to="/groups" className="text-sm text-slate-500 underline">Back to groups</Link>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Friends list */}
          <div className="rounded-2xl border border-purple-100 bg-white p-4 shadow-sm">
            <div className="text-sm font-semibold text-slate-900">Friends</div>
            <ul className="mt-2 space-y-2">
              {friends.length === 0 ? (
                <li className="text-xs text-slate-500">No friends yet</li>
              ) : (
                friends.map((f, idx) => (
                  <li key={idx} className="flex items-center justify-between rounded-lg border border-slate-200/70 bg-white/90 px-3 py-2 text-xs">
                    <span className="font-medium text-slate-900">{f.name}</span>
                    <span className="text-slate-500">{f.occupation}</span>
                  </li>
                ))
              )}
            </ul>
            <form
              className="mt-3 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                const em = email.trim();
                if (!em) return;
                dispatch(addMember({ groupId: group.id, email: em }));
                setEmail('');
              }}
            >
              <input value={email} onChange={(e) => setEmail(e.currentTarget.value)} placeholder="Invite email" className="flex-1 rounded-md border border-slate-200 px-2 py-1 text-xs" />
              <button className="rounded-md bg-purple-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-purple-700" type="submit">Invite</button>
            </form>
            <div className="mt-3">
              <button
                className="rounded-md border border-slate-200 px-3 py-1.5 text-xs hover:bg-slate-50"
                onClick={() => dispatch(createInviteLink({ groupId: group.id }))}
              >
                Generate invite link
              </button>
              <ul className="mt-2 space-y-1">
                {group.inviteLinks.map((code) => (
                  <li key={code} className="flex items-center justify-between text-xs">
                    <span className="truncate text-slate-600">{inviteBase + `&code=${code}`}</span>
                    <button
                      className="rounded-md px-2 py-1 text-[10px] text-purple-700 hover:bg-purple-50"
                      onClick={() => navigator.clipboard.writeText(inviteBase + `&code=${code}`)}
                    >
                      Copy
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="md:col-span-2 rounded-2xl border border-purple-100 bg-white p-4 shadow-sm">
            <div className="text-sm font-semibold text-slate-900">Picks in this group</div>
            {group.picks.length === 0 ? (
              <p className="mt-2 text-xs text-slate-500">No picks yet. Add from Dashboard → My Picks &quot;Set to group&quot;.</p>
            ) : (
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {group.picks.map((p) => (
                  <div key={p.id} className="rounded-xl border border-slate-200 bg-white p-3">
                    <div className="aspect-4/3 w-full bg-slate-100">
                      {p.imageUrl ? (
                        <img
                          src={p.imageUrl}
                          alt={p.title}
                          loading="lazy"
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            try {
                              const target = e.currentTarget as HTMLImageElement;
                              target.onerror = null;
                              target.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(
                                '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900"><rect width="100%" height="100%" fill="#f1f5f9"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#94a3b8" font-family="Inter, Arial, sans-serif" font-size="28">Image not available</text></svg>'
                              );
                            } catch (err) {
                              // swallow errors
                            }
                          }}
                        />
                      ) : null}
                    </div>
                    <div className="mt-2 text-sm font-semibold text-slate-900">{p.title}</div>
                    {p.description ? <div className="text-xs text-slate-600">{p.description}</div> : null}
                    {p.cost ? <div className="text-xs font-medium text-slate-900">{p.cost}</div> : null}
                    <button className="mt-2 rounded-md border border-slate-200 px-2 py-1 text-xs hover:bg-slate-50" onClick={() => dispatch(removePickFromGroup({ groupId: group.id, pickId: p.id }))}>Remove</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
  );
}
