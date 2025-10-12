import React from 'react';
import { RouteObject } from 'react-router-dom';
import { RouteWrapper } from '../components/RouteWrapper';

export const authRoutes: RouteObject[] = [
  {
    path: '/login',
    element: (
      <RouteWrapper title="Login">
        <div className="p-8">Login Page</div>
      </RouteWrapper>
    ),
  },
  {
    path: '/register',
    element: (
      <RouteWrapper title="Register">
        <div className="p-8">Register Page</div>
      </RouteWrapper>
    ),
  },
];
