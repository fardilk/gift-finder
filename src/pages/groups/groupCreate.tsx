import React from 'react';
import { useDispatch } from 'react-redux';
import { addMember, createGroup, createInviteLink } from 'src/store/groupsSlice';
import { useNavigate } from 'react-router-dom';
import { nanoid, type PayloadAction } from '@reduxjs/toolkit';

type InviteRow = {
  id: string;
  name: string;
  email: string;
  linkCode?: string; 
  emailSent?: boolean;
  linkRequested?: boolean;
  showInvite?: boolean; 
};

export default function GroupCreatePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [groupName, setGroupName] = React.useState('');
  const [rows, setRows] = React.useState<InviteRow[]>([
    { id: nanoid(), name: '', email: '', showInvite: false },
  ]);
  const [saving, setSaving] = React.useState(false);

  function addRow() {
    setRows((r) => [...r, { id: nanoid(), name: '', email: '', showInvite: false }]);
  }

  function updateRow(id: string, patch: Partial<InviteRow>) {
    setRows((r) => r.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  }

  async function onSendEmail(row: InviteRow) {
    updateRow(row.id, { emailSent: true });
    // In a real app, call API to send invite email with a link
    alert(`Invite email queued to ${row.email || '(missing email)'}`);
  }

  async function onGetLink(row: InviteRow) {
    const code = nanoid(8);
    const link = `${location.origin}/join?code=${code}`;
    updateRow(row.id, { linkRequested: true, linkCode: code });
    try {
      await navigator.clipboard.writeText(link);
    } catch { //
    }
    alert('Invite link copied to clipboard');
  }

  function removeRow(id: string) {
    setRows((r) => r.filter((x) => x.id !== id));
  }

  function rowsWithEmails() {
    return rows.filter((r) => r.email.trim() !== '');
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    const name = groupName.trim();
    if (!name) return;
    setSaving(true);
    try {
  const action = dispatch(createGroup(name)) as unknown as PayloadAction<{ id: string; name: string }>;
  const groupId: string | undefined = action?.payload?.id;
      if (groupId) {
        for (const r of rowsWithEmails()) {
          dispatch(addMember({ groupId, email: r.email.trim() }));
        }
        for (const r of rows.filter((x) => x.linkRequested)) {
          dispatch(createInviteLink({ groupId, code: r.linkCode }));
        }
      }
      navigate('/groups');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
        <header>
          <h1 className="text-2xl font-semibold text-slate-900">Create group</h1>
          <p className="mt-1 text-sm text-slate-600">Name your group and invite members by email or shareable link.</p>
        </header>

        <form className="mt-6 space-y-6" onSubmit={onSave}>
          <div>
            <label className="text-sm font-medium text-slate-900">Group name</label>
            <input
              value={groupName}
              onChange={(e) => setGroupName(e.currentTarget.value)}
              placeholder="e.g., Family Gift 2025"
              className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-900">Invite members</label>
              <button type="button" onClick={addRow} className="text-xs font-medium text-purple-600 hover:underline">+ Add another</button>
            </div>
            <div className="mt-2 space-y-2">
              {rows.map((row) => (
                <div key={row.id} className="rounded-xl border border-slate-200/70 bg-white/90 p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      value={row.name}
                      onChange={(e) => updateRow(row.id, { name: e.currentTarget.value })}
                      placeholder="Name"
                      className="min-w-40 flex-1 rounded-md border border-slate-200 px-2 py-1.5 text-sm"
                    />
                    <div className="ml-auto flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateRow(row.id, { showInvite: !row.showInvite })}
                        className="rounded-md px-2.5 py-1.5 text-xs font-medium text-purple-600 hover:bg-purple-50"
                      >
                        {row.showInvite ? 'Hide invite' : 'Invite your friend'}
                      </button>
                      <button
                        type="button"
                        onClick={() => removeRow(row.id)}
                        className="rounded-md px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {row.showInvite && (
                    <div className="mt-3 border-t border-slate-200/70 pt-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <input
                          value={row.email}
                          onChange={(e) => updateRow(row.id, { email: e.currentTarget.value })}
                          placeholder="Email"
                          className="min-w-56 flex-1 rounded-md border border-slate-200 px-2 py-1.5 text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => onSendEmail(row)}
                          className="rounded-md bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
                        >
                          Email
                        </button>
                        <button
                          type="button"
                          onClick={() => onGetLink(row)}
                          className="rounded-md bg-purple-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-purple-700"
                        >
                          Get link
                        </button>
                      </div>
                      {row.linkCode ? (
                        <div className="mt-2 text-[11px] text-slate-500">
                          Link: {location.origin}/join?code={row.linkCode}
                        </div>
                      ) : null}
                      {row.emailSent ? (
                        <div className="mt-1 text-[11px] text-green-600">Email queued</div>
                      ) : null}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => navigate('/groups')}
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-purple-600 px-3 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save group'}
            </button>
          </div>
        </form>
      </div>
  );
}
