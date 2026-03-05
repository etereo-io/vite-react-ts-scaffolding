import { useCallback, useEffect, useMemo, useState } from "react";

import type { User } from "@/app/features/auth/auth.types";

import { AuthContext, type AuthContextValue } from "./AuthContext";

const TOKEN_STORAGE_KEY = "auth_access_token";
const REFRESH_TOKEN_STORAGE_KEY = "auth_refresh_token";

interface Props {
  readonly children: React.ReactNode;
}

function getStoredToken(): string | null {
  return sessionStorage.getItem(TOKEN_STORAGE_KEY);
}

function setStoredToken(token: string): void {
  sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
}

function clearStoredTokens(): void {
  sessionStorage.removeItem(TOKEN_STORAGE_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
}

export function SimpleAuthProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [isPending, setIsPending] = useState(true);

  // On mount, attempt to restore session from stored token
  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      // TODO: Validate token and fetch user profile from API
      // For now, mark as not pending with no user
      setIsPending(false);
    } else {
      setIsPending(false);
    }
  }, []);

  const login = useCallback(
    async (credentials: { username: string; password: string }) => {
      setIsPending(true);
      try {
        // TODO: Replace with real API call to authentication endpoint
        const response = await fetch("/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials)
        });

        if (!response.ok) {
          throw new Error("Authentication failed");
        }

        const data = await response.json();
        setStoredToken(data.token);
        setUser(data.user);
      } finally {
        setIsPending(false);
      }
    },
    []
  );

  const logout = useCallback(async () => {
    setIsPending(true);
    try {
      // TODO: Replace with real API call to logout endpoint
      await fetch("/auth/logout", { method: "POST" });
      clearStoredTokens();
      setUser(null);
    } finally {
      setIsPending(false);
    }
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      // TODO: Replace with real API call to refresh endpoint
      const response = await fetch("/auth/refresh", { method: "POST" });

      if (!response.ok) {
        clearStoredTokens();
        setUser(null);
        throw new Error("Token refresh failed");
      }

      const data = await response.json();
      setStoredToken(data.token);
    } catch (error) {
      clearStoredTokens();
      setUser(null);
      throw error;
    }
  }, []);

  const value: AuthContextValue = useMemo(
    () => ({
      user,
      isAuthenticated: user !== null,
      isPending,
      login,
      logout,
      refreshToken
    }),
    [user, isPending, login, logout, refreshToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
