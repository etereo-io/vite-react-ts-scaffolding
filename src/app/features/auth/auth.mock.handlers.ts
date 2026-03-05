import { delay, HttpResponse, http } from "msw";

import { API_MOCK_PREFIX } from "@/app/features/api/api.constants";
import { DEFAULT_DELAY } from "@/app/features/mock-server/constants";

import { mockAuthDb } from "./__mocks__/auth.mock-db";

export function buildLoginHandler() {
  return http.post(`${API_MOCK_PREFIX}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as {
      username: string;
      password: string;
    };

    await delay(DEFAULT_DELAY);

    const result = mockAuthDb.login(body.username, body.password);

    if (!result) {
      return HttpResponse.json(
        {
          code: "INVALID_CREDENTIALS",
          message: "Invalid username or password"
        },
        { status: 401 }
      );
    }

    return HttpResponse.json({
      user: result.user,
      token: result.token
    });
  });
}

export function buildLogoutHandler() {
  return http.post(`${API_MOCK_PREFIX}/auth/logout`, async () => {
    await delay(DEFAULT_DELAY);
    mockAuthDb.logout();
    return new HttpResponse(null, { status: 204 });
  });
}

export function buildRefreshHandler() {
  return http.post(`${API_MOCK_PREFIX}/auth/refresh`, async () => {
    await delay(DEFAULT_DELAY);

    const newToken = mockAuthDb.refreshToken();

    if (!newToken) {
      return HttpResponse.json(
        { code: "NO_SESSION", message: "No active session to refresh" },
        { status: 401 }
      );
    }

    return HttpResponse.json({ token: newToken });
  });
}

export function buildMeHandler() {
  return http.get(`${API_MOCK_PREFIX}/auth/me`, async () => {
    await delay(DEFAULT_DELAY);

    const currentUser = mockAuthDb.getCurrentUser();

    if (!currentUser) {
      return HttpResponse.json(
        { code: "UNAUTHORIZED", message: "Not authenticated" },
        { status: 401 }
      );
    }

    return HttpResponse.json(currentUser);
  });
}

export const getMockHandlers = () => [
  buildLoginHandler(),
  buildLogoutHandler(),
  buildRefreshHandler(),
  buildMeHandler()
];
