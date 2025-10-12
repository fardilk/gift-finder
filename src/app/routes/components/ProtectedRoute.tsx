import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

type ProtectedRouteProps = {
  isAllowed?: boolean;
  redirectTo?: string;
  children: React.ReactNode;
};

export function ProtectedRoute({ isAllowed = true, redirectTo = '/login', children }: ProtectedRouteProps) {
  const location = useLocation();

  if (!isAllowed) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
