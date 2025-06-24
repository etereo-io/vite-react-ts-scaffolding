import { bypass } from "msw";
import type { StartOptions } from "msw/browser";

// import { getEndpoint } from "@/app/features/api/api";
// import { API_ENDPOINT_DEFAULT } from "@/app/features/api/api.contants";

export const DEFAULT_DELAY = import.meta.env.VITE_DEFAULT_DELAY
  ? parseInt(import.meta.env.VITE_DEFAULT_DELAY)
  : 500;

export const mockServerConfig: StartOptions = {
  onUnhandledRequest: (request, _print) => {
    // only warn requests that are part of the API
    // if (
    //   request.url
    //     .toString()
    //     .includes(location.host + getEndpoint(API_ENDPOINT_DEFAULT))
    // ) {
    //   return print.warning();
    // }

    return bypass(request);
  }
};
