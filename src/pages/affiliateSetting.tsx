import React from 'react';
import GlobalLayout from './global';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from 'src/store/store';
import { addAffiliate, removeAffiliate } from 'src/store/affiliateSlice';

export default function AffiliateSettingPage() {
  const dispatch = useDispatch();
  const affiliates = useSelector((s: RootState) => s.affiliate.affiliates);
  const masters = useSelector((s: RootState) => s.affiliate.masterMarketplaces);
  const [adding, setAdding] = React.useState(false);
  const [marketplace, setMarketplace] = React.useState('');
  const [code, setCode] = React.useState('');

  function resetForm() {
    setMarketplace('');
    setCode('');
  }

  function onSave(e: React.FormEvent) {
    e.preventDefault();
    const m = marketplace.trim();
    const c = code.trim();
    if (!m || !c) return;
    dispatch(addAffiliate(m, c));
    setAdding(false);
    resetForm();
  }

  return (
    <GlobalLayout>
      <section className="space-y-4">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Affiliate Settings</h1>
            <p className="mt-1 text-sm text-slate-600">Manage your affiliate codes for marketplaces.</p>
          </div>
          {affiliates.length > 0 && (
            <button onClick={() => setAdding(true)} className="rounded-md bg-purple-600 px-3 py-2 text-sm font-medium text-white hover:bg-purple-700">
              + Affiliate
            </button>
          )}
        </header>

        {affiliates.length === 0 && !adding ? (
          <div className="mt-4 flex flex-col items-center justify-center rounded-2xl bg-purple-50/40 p-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600">
              <i className="fa-solid fa-link" />
            </div>
            <h2 className="mt-3 text-lg font-semibold text-slate-900">You don’t have affiliation right now</h2>
            <p className="mt-1 max-w-md text-sm text-slate-600">Create your first affiliate mapping to start tracking conversions.</p>
            <button onClick={() => setAdding(true)} className="mt-4 rounded-md bg-purple-600 px-3 py-2 text-sm font-medium text-white hover:bg-purple-700">
              + Affiliate
            </button>
          </div>
        ) : null}

        {(adding || affiliates.length > 0) && (
          <div className="space-y-4">
            {adding && (
              <form onSubmit={onSave} className="rounded-xl border border-slate-200/70 bg-white/90 p-4">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <div>
                    <label className="text-xs font-medium text-slate-700">Marketplace</label>
                    <select value={marketplace} onChange={(e) => setMarketplace(e.currentTarget.value)} className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-2 text-sm">
                      <option value="">Select…</option>
                      {masters.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-700">Affiliate Code</label>
                    <input value={code} onChange={(e) => setCode(e.currentTarget.value)} placeholder="Your affiliate code" className="mt-1 w-full rounded-md border border-slate-200 px-2 py-2 text-sm" />
                  </div>
                  <div className="flex items-end gap-2">
                    <button type="submit" className="rounded-md bg-purple-600 px-3 py-2 text-sm font-medium text-white hover:bg-purple-700">Save</button>
                    <button type="button" onClick={() => { setAdding(false); resetForm(); }} className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">Cancel</button>
                  </div>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {affiliates.map((a) => (
                <div key={a.id} className="rounded-xl border border-slate-200/70 bg-white/90 p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-slate-900">{a.marketplace}</div>
                    <button onClick={() => dispatch(removeAffiliate({ id: a.id }))} className="text-xs text-red-600 hover:underline">Remove</button>
                  </div>
                  <div className="mt-1 text-xs text-slate-600">Code: <span className="font-mono">{a.code}</span></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </GlobalLayout>
  );
}
