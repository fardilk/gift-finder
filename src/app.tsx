import React, { Suspense, lazy } from 'react';
import './global.css';
import { AppQueryClientProvider } from './app/providers/query-client-provider';
import MeshBg from 'src/shared/components/welcome/MeshBg';

const Router = lazy(() => import('./app/routes').then((m) => ({ default: m.Router })));

export default function App() {
  return (
    <AppQueryClientProvider>
      <MeshBg />
      <Suspense fallback={<div className="p-4">Loading...</div>}>
        <Router />
      </Suspense>
    </AppQueryClientProvider>
  );
}
