import React from 'react';
import { RouteObject } from 'react-router-dom';
import { RouteWrapper } from '../components/RouteWrapper';
const DemoFormPage = React.lazy(() => import('src/modules/demo/demo-form'));
const WelcomePage = React.lazy(() => import('src/pages/welcome'));
const KycIndividualPage = React.lazy(() => import('src/pages/kycIndividual'));
const RecommendationsPage = React.lazy(() => import('src/pages/recommendations'));
const GroupsPage = React.lazy(() => import('src/pages/groups'));
const IndividualDashboardPage = React.lazy(() => import('src/pages/individualDashboard'));

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
    path: '/groups',
    element: (
      <RouteWrapper title="KYC Groups">
        <React.Suspense fallback={<div className="p-8">Loading...</div>}>
          <GroupsPage />
        </React.Suspense>
      </RouteWrapper>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <RouteWrapper title="Individual Dashboard">
        <React.Suspense fallback={<div className="p-8">Loading dashboard...</div>}>
          <IndividualDashboardPage />
        </React.Suspense>
      </RouteWrapper>
    ),
  },
  {
    path: '/recommendations',
    element: (
      <RouteWrapper title="Recommendations">
        <React.Suspense fallback={<div className="p-8">Loading...</div>}>
          <RecommendationsPage />
        </React.Suspense>
      </RouteWrapper>
    ),
  },
  {
    path: '/individuals',
    element: (
      <RouteWrapper title="KYC Individuals">
        <React.Suspense fallback={<div className="p-8">Loading...</div>}>
          <KycIndividualPage />
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
