import React from "react";

import ReactDOM from "react-dom/client";

import { App } from "./app/components/App";
import { getConfig } from "./app/features/config/config.service";
import { mockServerConfig } from "./app/features/mock-server/constants";

export async function enableMocking() {
  if (
    !getConfig("features.msw", {
      defaultValue: true,
      required: false
    })
  ) {
    return;
  }

  const { worker } = await import("@/app/features/mock-server/browser");
  return worker.start(mockServerConfig);
}

// biome-ignore lint/style/noNonNullAssertion: checked
const root = ReactDOM.createRoot(document.getElementById("root")!);

enableMocking().then(() => {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
