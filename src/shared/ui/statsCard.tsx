import * as React from 'react';

type StatsCardProps = {
  label: string;
  value: string | number;
  helper?: string;
  variant?: 'wishlist' | 'inprogress' | 'sentiment' | 'default';
  className?: string;
};

export function StatsCard({ label, value, helper, variant = 'default', className }: StatsCardProps) {
  const icon = (() => {
    switch (variant) {
      case 'wishlist':
        return <i className="fa-solid fa-heart text-pink-500"></i>;
      case 'inprogress':
        return <i className="fa-solid fa-gift text-purple-600"></i>;
      case 'sentiment':
        return <i className="fa-solid fa-face-smile-beam text-yellow-500"></i>;
      default:
        return <i className="fa-solid fa-chart-simple text-slate-500"></i>;
    }
  })();

  return (
    <div className={`rounded-2xl border border-purple-50 bg-gradient-to-br from-purple-50/80 via-white to-white p-6 shadow-sm ${className || ''}`}>
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.18em] text-purple-400">{label}</p>
        <div className="rounded-full bg-white/60 p-2 text-sm shadow-sm">{icon}</div>
      </div>
      <p className="mt-3 text-3xl font-semibold text-slate-900">{value}</p>
      {helper && <p className="mt-1 text-xs text-slate-500">{helper}</p>}
    </div>
  );
}

export default StatsCard;
