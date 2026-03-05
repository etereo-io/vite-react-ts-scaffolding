import { lazy, Suspense } from "react";

import { isDebugMode } from "@/app/features/config/config.helpers";

const ReactQueryDevtools = lazy(() =>
  import("@tanstack/react-query-devtools").then((mod) => ({
    default: mod.ReactQueryDevtools
  }))
);

export function DebugProviders() {
  if (!isDebugMode()) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <ReactQueryDevtools initialIsOpen={false} />
    </Suspense>
  );
}
