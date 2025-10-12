import React from 'react';
import { useRoutes } from 'react-router-dom';
import { authRoutes } from './sections/auth';
import { dashboardRoutes } from './sections/dashboard';

export function Router() {
  const element = useRoutes([...dashboardRoutes, ...authRoutes]);
  return element;
}
