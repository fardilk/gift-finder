import React from 'react';
import GlobalLayout from '../global';
import { useDispatch } from 'react-redux';
import { createGroup, createInviteLink } from 'src/store/groupsSlice';
import { nanoid } from '@reduxjs/toolkit';
import { useNavigate } from 'react-router-dom';

export default function CreateGroupPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [name, setName] = React.useState('');
  const [invites, setInvites] = React.useState<Array<{ id: string; personName: string; email: string; linkCode?: string }>>([
    { id: nanoid(), personName: '', email: '' },
  ]);
  const [emailModal, setEmailModal] = React.useState<{ open: boolean; to?: string; person?: string }>(() => ({ open: false }));

  function addInviteRow() {
    setInvites((rows) => [...rows, { id: nanoid(), personName: '', email: '' }]);
  }

  function updateInvite(id: string, field: 'personName' | 'email', value: string) {
    setInvites((rows) => rows.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  }

  function handleShareLink(id: string) {
    // Generate a unique link code now; persist to group after save
    const code = nanoid(8);
    setInvites((rows) => rows.map((r) => (r.id === id ? { ...r, linkCode: code } : r)));
  }

  function handleSendEmail(id: string) {
    const row = invites.find((r) => r.id === id);
    if (!row) return;
    setEmailModal({ open: true, to: row.email, person: row.personName });
  }

  function closeEmailModal() {
    setEmailModal({ open: false });
  }

  function handleSave() {
    const trimmedName = name.trim();
    if (!trimmedName) return;
    // Create group and capture the generated id from action payload
    const action = dispatch(createGroup(trimmedName)) as unknown as { payload?: { id: string } };
    const newId = action?.payload?.id;
    if (newId) {
      // Persist any pre-generated invite codes
      invites.forEach((inv) => {
        if (inv.linkCode) {
          dispatch(createInviteLink({ groupId: newId, code: inv.linkCode }));
        }
      });
      navigate(`/groups/${newId}`);
    } else {
      navigate('/groups');
    }
  }

  return (
    <GlobalLayout>
      <div className="mx-auto w-full max-w-3xl">
        <h1 className="text-2xl font-semibold text-slate-900">Create Group</h1>
        <p className="mt-1 text-sm text-slate-600">Set a name and invite members to collaborate on gift ideas.</p>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <label className="block text-sm font-medium text-slate-900">Group name</label>
          <input
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
            placeholder="e.g., Family Surprise, Office Team A"
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
          />

          <div className="mt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">Member invites</h2>
              <button onClick={addInviteRow} className="text-xs font-medium text-purple-600 hover:underline">Add another</button>
            </div>
            <div className="mt-3 flex flex-col gap-3">
              {invites.map((row) => (
                <div key={row.id} className="flex flex-col gap-2 rounded-lg border border-slate-200 p-3 sm:flex-row sm:items-center">
                  <input
                    value={row.personName}
                    onChange={(e) => updateInvite(row.id, 'personName', e.currentTarget.value)}
                    placeholder="Name"
                    className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm sm:w-1/3"
                  />
                  <input
                    value={row.email}
                    onChange={(e) => updateInvite(row.id, 'email', e.currentTarget.value)}
                    placeholder="Email"
                    className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm sm:flex-1"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSendEmail(row.id)}
                      className="rounded-md border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Send email
                    </button>
                    <button
                      type="button"
                      onClick={() => handleShareLink(row.id)}
                      className="rounded-md bg-purple-600 px-3 py-2 text-xs font-medium text-white hover:bg-purple-700"
                    >
                      Get share link
                    </button>
                  </div>
                  {row.linkCode ? (
                    <div className="text-[11px] text-slate-500">
                      Link ready: {window.location.origin}/join?code={row.linkCode}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSave}
              className="rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
            >
              Save group
            </button>
          </div>
        </div>
      </div>

      {emailModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={closeEmailModal}>
          <div className="w-full max-w-sm rounded-lg bg-white p-4 shadow" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-sm font-semibold text-slate-900">Send email invite</h3>
            <p className="mt-1 text-sm text-slate-600">
              We will simulate sending an email to <span className="font-medium text-slate-900">{emailModal.to}</span>
              {emailModal.person ? ` (${emailModal.person})` : ''}.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={closeEmailModal} className="rounded-md border border-slate-200 px-3 py-1.5 text-sm">Cancel</button>
              <button onClick={closeEmailModal} className="rounded-md bg-purple-600 px-3 py-1.5 text-sm font-medium text-white">Send</button>
            </div>
          </div>
        </div>
      )}
    </GlobalLayout>
  );
}
