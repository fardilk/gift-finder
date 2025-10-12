import React, { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

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
