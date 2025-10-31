import * as React from 'react';
import GlobalLayout from '../global';

export default function GiftModuleHome() {
  return (
    <GlobalLayout>
      <section className="space-y-4">
        <h1 className="text-2xl font-semibold text-slate-900">Gift Module</h1>
        <div className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-600">This is a placeholder for the Gift module. Add routes and components as needed.</p>
        </div>
      </section>
    </GlobalLayout>
  );
}
