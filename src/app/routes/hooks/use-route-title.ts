import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

export function useRouteTitle(title?: string) {
  useEffect(() => {
    if (title) document.title = title;
  }, [title]);

  return { Helmet, title } as const;
}
