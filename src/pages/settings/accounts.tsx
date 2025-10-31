import * as React from 'react';

export default function AccountsPage() {
  return (
    <section className="space-y-4">
        <h1 className="text-2xl font-semibold text-slate-900">Accounts</h1>
        <div className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-600">Change password and account settings (placeholder).</p>
          <form className="mt-4 grid max-w-md gap-3">
            <label className="text-sm">Current password</label>
            <input type="password" className="rounded-md border border-slate-200 p-2 text-sm" />
            <label className="text-sm">New password</label>
            <input type="password" className="rounded-md border border-slate-200 p-2 text-sm" />
            <label className="text-sm">Confirm new password</label>
            <input type="password" className="rounded-md border border-slate-200 p-2 text-sm" />
            <button type="button" className="mt-2 rounded-md bg-purple-600 px-3 py-2 text-sm font-medium text-white hover:bg-purple-700">Save</button>
          </form>
        </div>
      </section>
  );
}
