import { useCallback, useMemo, useState } from "react";
import { mockAuthDb } from "@/app/features/auth/__mocks__/auth.mock-db";
import type { User } from "@/app/features/auth/auth.types";

import { AuthContext, type AuthContextValue } from "./AuthContext";

interface Props {
  readonly children: React.ReactNode;
}

export function MockAuthProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(mockAuthDb.getCurrentUser());
  const [isPending, setIsPending] = useState(false);

  const login = useCallback(
    async (credentials: { username: string; password: string }) => {
      setIsPending(true);
      try {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 300));

        const result = mockAuthDb.login(
          credentials.username,
          credentials.password
        );

        if (!result) {
          throw new Error("Invalid username or password");
        }

        setUser(result.user);
      } finally {
        setIsPending(false);
      }
    },
    []
  );

  const logout = useCallback(async () => {
    setIsPending(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 100));
      mockAuthDb.logout();
      setUser(null);
    } finally {
      setIsPending(false);
    }
  }, []);

  const refreshToken = useCallback(async () => {
    const newToken = mockAuthDb.refreshToken();
    if (!newToken) {
      setUser(null);
      throw new Error("Failed to refresh token — no active session");
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
