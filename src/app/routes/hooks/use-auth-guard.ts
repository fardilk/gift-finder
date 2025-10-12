import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { isPublicPath } from '../exclude-auth';

export function useAuthGuard(isAuthenticated: boolean) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated && !isPublicPath(location.pathname)) {
      navigate('/login', { replace: true, state: { from: location } });
    }
  }, [isAuthenticated, location, navigate]);
}
