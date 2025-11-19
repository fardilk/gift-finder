import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import type { RootState } from 'src/store/store';
import { addRecipientToOccasion, createOccasionInviteLink, linkGroupToOccasion } from 'src/store/occasionsSlice';

export default function OccasionRoomPage() {
  const { occasionId = '' } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const occasion = useSelector((s: RootState) => s.occasions.occasions.find((o) => o.id === occasionId));
  const groups = useSelector((s: RootState) => s.groups.groups);

  const [email, setEmail] = React.useState('');
  const [groupToLink, setGroupToLink] = React.useState('');

  if (!occasion) {
    return (
      <div className="p-6">
        <div className="mb-4 text-sm text-gray-500">Occasion not found.</div>
        <button
          onClick={() => navigate('/occasion')}
          className="rounded-md border px-4 py-2 text-gray-700 hover:bg-gray-50"
        >
          Back to Occasions
        </button>
      </div>
    );
  }

  function addEmail(e: React.FormEvent) {
    e.preventDefault();
    const v = email.trim();
    if (!v) return;
  dispatch(addRecipientToOccasion({ occasionId: occasion!.id, email: v }));
    setEmail('');
  }

  function linkGroup(e: React.FormEvent) {
    e.preventDefault();
    if (!groupToLink) return;
  dispatch(linkGroupToOccasion({ occasionId: occasion!.id, groupId: groupToLink }));
    setGroupToLink('');
  }

  function makeInvite() {
  dispatch(createOccasionInviteLink({ occasionId: occasion!.id }));
  }

  return (
    <div className="p-6 grid gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{occasion.title}</h1>
          {occasion.date && (
            <div className="text-sm text-gray-500">{new Date(occasion.date).toLocaleString()}</div>
          )}
        </div>
        <Link
          to="/occasion"
          className="rounded-md border px-4 py-2 text-gray-700 hover:bg-gray-50"
        >
          Back to list
        </Link>
      </div>

      <section className="grid gap-3">
        <h2 className="text-lg font-medium">Invite people</h2>
        <form onSubmit={addEmail} className="flex flex-wrap items-center gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="min-w-60 flex-1 rounded-md border px-3 py-2"
            placeholder="name@example.com"
          />
          <button
            type="submit"
            className="rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
          >
            Add
          </button>
          <button
            type="button"
            onClick={makeInvite}
            className="rounded-md border px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            Generate invite link
          </button>
        </form>
        {occasion.inviteLinks.length > 0 && (
          <div className="text-sm text-gray-600">
            Invite links: {occasion.inviteLinks.map((c) => (
              <code key={c} className="ml-2 rounded bg-gray-100 px-1.5 py-0.5">{c}</code>
            ))}
          </div>
        )}
        {occasion.recipients.length > 0 && (
          <ul className="mt-1 grid gap-1 text-sm text-gray-700">
            {occasion.recipients.map((r) => (
              <li key={r}>• {r}</li>
            ))}
          </ul>
        )}
      </section>

      <section className="grid gap-3">
        <h2 className="text-lg font-medium">Linked groups</h2>
        <form onSubmit={linkGroup} className="flex flex-wrap items-center gap-2">
          <select
            value={groupToLink}
            onChange={(e) => setGroupToLink(e.target.value)}
            className="min-w-60 rounded-md border px-3 py-2"
          >
            <option value="">Select a group…</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-md border px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            Link group
          </button>
        </form>
        {occasion.linkedGroupIds.length === 0 ? (
          <div className="text-sm text-gray-500">No linked groups</div>
        ) : (
          <ul className="grid gap-2">
            {occasion.linkedGroupIds.map((gid) => {
              const g = groups.find((x) => x.id === gid);
              return (
                <li key={gid} className="flex items-center justify-between rounded-md border p-3">
                  <div>
                    <div className="font-medium">{g?.name ?? gid}</div>
                    {g && (
                      <div className="text-xs text-gray-500">{g.members.length} members • {g.picks.length} picks</div>
                    )}
                  </div>
                  <Link to={`/groups/${gid}`} className="text-sm text-purple-700 hover:underline">Open group</Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
