import * as React from 'react';
import { ToastProvider, ToastBridge } from './use-toast';

export function Toaster({ children }: { children?: React.ReactNode }) {
  return (
    <ToastProvider>
      <ToastBridge />
      <div id="toast-root" className="fixed inset-x-0 bottom-4 z-50 flex w-full justify-center px-4">
        <ToastList />
      </div>
      {children}
    </ToastProvider>
  );
}

declare global {
  interface Window {
    __app_toast__?: (opts: { title?: string; description?: string }) => void;
  }
}

type Item = { id: number; title?: string; description?: string };

function ToastList() {
  const [items, setItems] = React.useState<Item[]>([]);
  React.useEffect(() => {
    const original = window.__app_toast__;
    window.__app_toast__ = (opts) => {
      setItems((prev) => [...prev, { id: Date.now() + Math.random(), ...opts }]);
      original?.(opts);
    };
    return () => {
      window.__app_toast__ = original;
    };
  }, []);
  return (
    <div className="flex w-full max-w-md flex-col gap-2">
      {items.map((t) => (
        <div key={t.id} className="rounded-md border border-slate-200 bg-white p-3 shadow-lg">
          {t.title && <div className="text-sm font-medium">{t.title}</div>}
          {t.description && <div className="text-xs text-slate-600">{t.description}</div>}
        </div>
      ))}
    </div>
  );
}
