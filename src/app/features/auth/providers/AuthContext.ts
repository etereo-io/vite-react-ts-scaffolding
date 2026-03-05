import { createContext, useContext } from "react";

import type { User } from "@/app/features/auth/auth.types";

export interface AuthContextValue {
  readonly user: User | null;
  readonly isAuthenticated: boolean;
  readonly isPending: boolean;
  readonly login: (credentials: {
    username: string;
    password: string;
  }) => Promise<void>;
  readonly logout: () => Promise<void>;
  readonly refreshToken: () => Promise<void>;
}

// Store AuthContext on globalThis so it survives vi.resetModules() in tests.
// Without this, route components registered before the reset would reference a
// stale context object that differs from the one used by AuthProvider after the
// reset, causing useAuth() to throw.
type GlobalThisWithAuth = typeof globalThis & {
  __AUTH_CONTEXT__?: React.Context<AuthContextValue | null>;
};

if (!(globalThis as GlobalThisWithAuth).__AUTH_CONTEXT__) {
  (globalThis as GlobalThisWithAuth).__AUTH_CONTEXT__ =
    createContext<AuthContextValue | null>(null);
}

// biome-ignore lint/style/noNonNullAssertion: We know this will be set above, and it simplifies the type signature of useAuth.
export const AuthContext = (globalThis as GlobalThisWithAuth).__AUTH_CONTEXT__!;

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
