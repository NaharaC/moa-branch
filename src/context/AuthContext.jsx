import { useCallback, useEffect, useMemo, useState } from "react";
import { setOnUnauthorized, setTokenGetter } from "../services/api-client.js";
import { authApi } from "../services/auth.api.js";
import { AuthContext, isAdminRole } from "./auth-context.js";
import { usePersistentState } from "../hooks/usePersistentState.js";

const TOKEN_KEY = "token";
const USER_KEY = "moa.user";
const STATUS = { IDLE: "idle", LOADING: "loading", AUTH: "authenticated" };

export const AuthProvider = ({ children }) => {
  const [token, setToken] = usePersistentState(TOKEN_KEY, {
    initialValue: null,
  });

  const [user, setUser] = usePersistentState(USER_KEY, {
    initialValue: null,
    parser: (v) => {
      try {
        return JSON.parse(v);
      } catch {
        return null;
      }
    },
    serializer: (v) => JSON.stringify(v),
  });

  const [status, setStatus] = useState(() => (token ? STATUS.LOADING : STATUS.IDLE));
  const [error, setError] = useState(null);

  const isReady = status !== STATUS.LOADING || (token && user);

  const syncToken = useCallback(
    (t) => {
      setToken(t ?? null);
      setTokenGetter(() => t);
    },
    [setToken]
  );

  const syncUser = useCallback(
    (u) => {
      setUser(u ?? null);
    },
    [setUser]
  );

  const logout = useCallback(() => {
    syncToken(null);
    syncUser(null);
    setStatus(STATUS.IDLE);
    setError(null);
  }, [syncToken, syncUser]);

  useEffect(() => {
    setTokenGetter(() => token);
    setOnUnauthorized(() => logout);
  }, [token, logout]);

  useEffect(() => {
    if (!token || user) {
      if (!token) setStatus(STATUS.IDLE);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const profile = await authApi.profile();
        if (cancelled) return;
        syncUser(profile);
        setStatus(STATUS.AUTH);
      } catch (err) {
        if (cancelled) return;
        setError(err);
        logout();
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token, user, syncUser, logout]);

  const login = useCallback(
    async (credentials) => {
      setStatus(STATUS.LOADING);
      setError(null);
      try {
        const { token: nextToken, user: profile } = await authApi.login(credentials);
        syncToken(nextToken);
        syncUser(profile);
        setStatus(STATUS.AUTH);
        return profile;
      } catch (err) {
        setError(err);
        setStatus(STATUS.IDLE);
        throw err;
      }
    },
    [syncToken, syncUser]
  );

  const register = useCallback(
    async (payload) => {
      setStatus(STATUS.LOADING);
      setError(null);
      try {
        const { token: nextToken, user: profile } = await authApi.register(payload);
        syncToken(nextToken);
        syncUser(profile);
        setStatus(nextToken ? STATUS.AUTH : STATUS.IDLE);
      } catch (err) {
        setError(err);
        setStatus(STATUS.IDLE);
        throw err;
      }
    },
    [syncToken, syncUser]
  );

  const refreshProfile = useCallback(async () => {
    try {
      const profile = await authApi.profile();
      syncUser(profile);
      return profile;
    } catch (err) {
      logout();
      throw err;
    }
  }, [syncUser, logout]);

  const value = useMemo(
    () => ({
      token,
      user,
      status,
      error,
      isReady,
      isAuthenticated: Boolean(token),
      isAdmin: isAdminRole(user),
      login,
      register,
      logout,
      refreshProfile,
    }),
    [token, user, status, error, isReady, login, register, logout, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
