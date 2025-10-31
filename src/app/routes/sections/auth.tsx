import React from 'react';
import { RouteObject } from 'react-router-dom';
import { RouteWrapper } from '../components/RouteWrapper';
const LoginPage = React.lazy(() => import('src/pages/login'));
const RegistrationPage = React.lazy(() => import('src/pages/registration'));

export const authRoutes: RouteObject[] = [
  {
    path: '/login',
    element: (
      <RouteWrapper title="Login">
        <React.Suspense fallback={<div className="p-8">Loading...</div>}>
          <LoginPage />
        </React.Suspense>
      </RouteWrapper>
    ),
  },
  {
    path: '/register',
    element: (
      <RouteWrapper title="Register">
        <React.Suspense fallback={<div className="p-8">Loading...</div>}>
          <RegistrationPage />
        </React.Suspense>
      </RouteWrapper>
    ),
  },
  {
    path: '/registration',
    element: (
      <RouteWrapper title="Register">
        <React.Suspense fallback={<div className="p-8">Loading...</div>}>
          <RegistrationPage />
        </React.Suspense>
      </RouteWrapper>
    ),
  },
];
