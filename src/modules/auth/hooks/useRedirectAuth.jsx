import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/auth-context.js';
import { ROUTES } from '../../../routes/routes.js';

export function useRedirectAfterAuth() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname;

  return useCallback(
    ({ adminOverride } = {}) => {
      const shouldGoAdmin =
        typeof adminOverride === "boolean" ? adminOverride : isAdmin;
      if (shouldGoAdmin) {
        navigate(ROUTES.admin.dashboard, { replace: true });
      } else {
        navigate(from || ROUTES.auth.profile, { replace: true });
      }
    },
    [isAdmin, navigate, from],
  );
}
