import React from 'react';
import GlobalLayout from './global';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from 'src/store/store';
import { addMarketplace, removeMarketplace } from 'src/store/affiliateSlice';

export default function AffiliateMasterPage() {
  const dispatch = useDispatch();
  const masters = useSelector((s: RootState) => s.affiliate.masterMarketplaces);
  const [name, setName] = React.useState('');

  function onAdd(e: React.FormEvent) {
    e.preventDefault();
    const n = name.trim();
    if (!n) return;
    dispatch(addMarketplace(n));
    setName('');
  }

  return (
    <GlobalLayout>
      <section className="space-y-4">
        <header>
          <h1 className="text-2xl font-semibold text-slate-900">Master Affiliate</h1>
          <p className="mt-1 text-sm text-slate-600">Manage the list of marketplaces used in Affiliate Settings.</p>
        </header>

        <form onSubmit={onAdd} className="rounded-xl border border-slate-200/70 bg-white/90 p-4">
          <div className="flex flex-wrap items-end gap-2">
            <div className="min-w-56 flex-1">
              <label className="text-xs font-medium text-slate-700">Marketplace name</label>
              <input value={name} onChange={(e) => setName(e.currentTarget.value)} placeholder="e.g., Shopee" className="mt-1 w-full rounded-md border border-slate-200 px-2 py-2 text-sm" />
            </div>
            <button type="submit" className="rounded-md bg-purple-600 px-3 py-2 text-sm font-medium text-white hover:bg-purple-700">Add</button>
          </div>
        </form>

        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
          {masters.length === 0 ? (
            <div className="rounded-xl bg-purple-50/40 p-4 text-sm text-slate-600">No marketplaces yet. Add one above.</div>
          ) : (
            masters.map((m) => (
              <div key={m} className="flex items-center justify-between rounded-xl border border-slate-200/70 bg-white/90 p-3 text-sm">
                <span className="font-medium text-slate-900">{m}</span>
                <button onClick={() => dispatch(removeMarketplace(m))} className="text-xs text-red-600 hover:underline">Remove</button>
              </div>
            ))
          )}
        </div>
      </section>
    </GlobalLayout>
  );
}
