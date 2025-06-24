import { bypass } from "msw";
import type { StartOptions } from "msw/browser";
import { API_MOCK_PREFIX } from "../api/api.contants";

export const DEFAULT_DELAY = import.meta.env.VITE_DEFAULT_DELAY
  ? parseInt(import.meta.env.VITE_DEFAULT_DELAY)
  : 500;

export const mockServerConfig: StartOptions = {
  onUnhandledRequest: (request, print) => {
    // only warn requests that are part of the API
    if (request.url.toString().includes(API_MOCK_PREFIX)) {
      return print.warning();
    }

    return bypass(request);
  }
};
