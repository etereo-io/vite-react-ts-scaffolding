/** biome-ignore-all lint/correctness/useUniqueElementIds: poc */
import { Lock } from "lucide-react";
import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router";

import { mockUserEntries } from "@/app/features/auth/__mocks__/auth.mock-db";
import { AUTH_DEFAULT_REDIRECT } from "@/app/features/auth/auth.constants";
import { getAndClearRedirectAfterLogin } from "@/app/features/auth/auth.helpers";
import { useAuth } from "@/app/features/auth/providers/AuthContext";

const isDev = import.meta.env.DEV;

export function SignInPage() {
  const navigate = useNavigate();
  const { login, isPending } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [selectedMockUser, setSelectedMockUser] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const data = new FormData(event.currentTarget);
    const username = (data.get("email") as string) ?? "";
    const password = (data.get("password") as string) ?? "";

    try {
      await login({ username, password });
      navigate(getAndClearRedirectAfterLogin() ?? AUTH_DEFAULT_REDIRECT);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  };

  const handleMockUserSelect = async (value: string) => {
    setSelectedMockUser(value);
    setError(null);

    if (!value) {
      return;
    }

    const entry = mockUserEntries.find((e) => e.username === value);
    if (!entry) {
      return;
    }

    try {
      await login({ username: entry.username, password: entry.password });
      navigate(getAndClearRedirectAfterLogin() ?? AUTH_DEFAULT_REDIRECT);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex" data-testid="login-page">
      {/* Background Image Side */}
      <div
        className="hidden lg:block lg:w-1/2 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url(https://source.unsplash.com/random?wallpapers)"
        }}
      />

      {/* Login Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white shadow-lg">
        <div className="max-w-md w-full space-y-6">
          {/* Logo/Avatar */}
          <div className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h1 className="mt-4 text-3xl font-bold text-gray-900">Sign in</h1>
          </div>

          {/* Dev Mode Mock User Selection */}
          {isDev && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
              <label
                htmlFor="mock-user-select"
                className="block text-sm font-medium text-amber-800 mb-1"
              >
                Dev Mode: Quick Login
              </label>
              <select
                id="mock-user-select"
                value={selectedMockUser}
                onChange={(e) => handleMockUserSelect(e.target.value)}
                disabled={isPending}
                className="w-full px-3 py-2 border border-amber-300 rounded-md shadow-sm bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="">Select a mock user...</option>
                {mockUserEntries.map((entry) => (
                  <option key={entry.username} value={entry.username}>
                    {entry.user.name} ({entry.username}) -{" "}
                    {entry.user.roles.length > 0
                      ? entry.user.roles.join(", ")
                      : "no roles"}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-700"
              >
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Signing in..." : "Sign In"}
            </button>

            <div className="flex items-center justify-between text-sm">
              <button
                type="button"
                className="text-blue-600 hover:text-blue-500 transition-colors"
              >
                Forgot password?
              </button>
              <button
                type="button"
                className="text-blue-600 hover:text-blue-500 transition-colors"
              >
                Don't have an account? Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
