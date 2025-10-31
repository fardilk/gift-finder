import React, { lazy, type ComponentType, type LazyExoticComponent, type ReactNode } from 'react';
import { RouteObject } from 'react-router-dom';
import { RouteWrapper } from './components/RouteWrapper';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuth } from 'src/auth/context/app-auth/AuthProvider';
import GlobalLayout from 'src/pages/global';

export function lazyImport<T extends React.ComponentType<unknown>>(factory: () => Promise<{ default: T }>) {
  return lazy(factory);
}

export function pathJoin(...parts: string[]) {
  return parts
    .join('/')
    .replace(/\/+/g, '/')
    .replace(/([^:])\/\//g, '$1/');
}

export function generateRoutes(sections: RouteObject[]): RouteObject[] {
  return sections;
}

type WrapRouteOptions = { authOnly?: boolean; dashboardAccess?: boolean; useGlobalLayout?: boolean };
type AnyPage = LazyExoticComponent<ComponentType<unknown>>;

export function wrapRoute(Page: AnyPage, title: string, options?: WrapRouteOptions) {
  const element = React.createElement(
    React.Suspense,
    { fallback: React.createElement('div', { className: 'p-8' }, 'Loading...') },
    React.createElement(Page)
  );

  const gated: ReactNode = options?.authOnly
    ? React.createElement(AuthOnly, null, element)
    : options?.dashboardAccess
    ? React.createElement(DashboardRouteElement, null, element)
    : element;

  // eslint-disable-next-line react/no-children-prop
  const wrappedContent = React.createElement(RouteWrapper, { title, children: gated });

  return options?.useGlobalLayout
    ? React.createElement(GlobalLayout, null, wrappedContent)
    : wrappedContent;
}

function AuthOnly({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  // eslint-disable-next-line react/no-children-prop
  return React.createElement(ProtectedRoute, { isAllowed: isAuthenticated, children });
}

function DashboardRouteElement({ children }: { children: ReactNode }) {
  const { isAuthenticated, isGuest } = useAuth();
  const allowed = isAuthenticated || isGuest;
  // eslint-disable-next-line react/no-children-prop
  return React.createElement(ProtectedRoute, { isAllowed: allowed, children });
}
