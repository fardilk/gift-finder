import React from 'react';
import { RouteObject } from 'react-router-dom';
import { RouteWrapper } from '../components/RouteWrapper';
const DemoFormPage = React.lazy(() => import('src/modules/demo/pages/demo-form'));
const WelcomePage = React.lazy(() => import('src/modules/welcome/pages/welcome'));

export const dashboardRoutes: RouteObject[] = [
  {
    path: '/',
    element: (
      <RouteWrapper title="Welcome">
        <React.Suspense fallback={<div className="p-8">Loading...</div>}>
          <WelcomePage />
        </React.Suspense>
      </RouteWrapper>
    ),
  },
  {
    path: '/about',
    element: (
      <RouteWrapper title="About">
        <div className="p-8">About page</div>
      </RouteWrapper>
    ),
  },
  {
    path: '/demo-form',
    element: (
      <RouteWrapper title="Demo Form">
        <React.Suspense fallback={<div className="p-8">Loading form...</div>}>
          <DemoFormPage />
        </React.Suspense>
      </RouteWrapper>
    ),
  },
];
