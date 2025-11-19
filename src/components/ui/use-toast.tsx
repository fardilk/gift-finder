// Minimal toast API compatible with shadcn's use-toast exports
import * as React from 'react';

export type ToastItem = {
  id: number;
  title?: string;
  description?: string;
};

type ToastContextValue = {
  toasts: ToastItem[];
  add: (t: Omit<ToastItem, 'id'>) => void;
  remove: (id: number) => void;
};

export const ToastContext = React.createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);
  const add = React.useCallback((t: Omit<ToastItem, 'id'>) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, ...t }]);
    // Auto-remove after 3.5s
    setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id));
    }, 3500);
  }, []);
  const remove = React.useCallback((id: number) => setToasts((p) => p.filter((x) => x.id !== id)), []);
  const value = React.useMemo(() => ({ toasts, add, remove }), [toasts, add, remove]);
  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  const { add } = ctx;
  return {
    toast: (opts: { title?: string; description?: string }) => add(opts),
  };
}

export function useToastState() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error('useToastState must be used within ToastProvider');
  return ctx;
}

// Named export used by shadcn-style API
declare global {
  interface Window {
    __app_toast__?: (opts: { title?: string; description?: string }) => void;
  }
}

export const toast = (opts: { title?: string; description?: string }) => {
  // Dynamically call the context handler via window for simplicity
  window.__app_toast__?.(opts);
};

// Internal bridge to support the top-level toast() call above
export function ToastBridge() {
  const { toast } = useToast();
  React.useEffect(() => {
    window.__app_toast__ = toast;
    return () => {
      delete window.__app_toast__;
    };
  }, [toast]);
  return null;
}
