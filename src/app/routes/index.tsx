import React from 'react';
import { useRoutes } from 'react-router-dom';
import { authRoutes } from './sections/auth';
import { dashboardRoutes } from './sections/dashboard';

const NotFoundPage = React.lazy(() => import('src/pages/NotFound'));

export function Router() {
  const element = useRoutes([
    ...dashboardRoutes,
    ...authRoutes,
    // Catch-all 404 route - must be last
    {
      path: '*',
      element: <NotFoundPage />,
    },
  ]);
  return element;
}
