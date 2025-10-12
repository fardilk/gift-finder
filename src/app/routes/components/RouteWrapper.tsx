import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

type RouteWrapperProps = {
  title?: string;
  children: React.ReactNode;
};

export function RouteWrapper({ title, children }: RouteWrapperProps) {
  useEffect(() => {
    if (title) document.title = title;
  }, [title]);

  return (
    <>
      {title ? (
        <Helmet>
          <title>{title}</title>
        </Helmet>
      ) : null}
      {children}
    </>
  );
}
