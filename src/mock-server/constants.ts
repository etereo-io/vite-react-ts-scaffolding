import { bypass } from "msw";
import { StartOptions } from "msw/browser";

import { getEndpoint } from "@/app/api";

export const DEFAULT_DELAY = import.meta.env.VITE_DEFAULT_DELAY ? parseInt(import.meta.env.VITE_DEFAULT_DELAY) : 500;

export const mockServerConfig: StartOptions = {
  onUnhandledRequest: (request, print) => {
    // only warn requests that are part of the API
    if (request.url.toString().includes(location.host + getEndpoint())) {
      return print.warning();
    }

    return bypass(request);
  },
};
