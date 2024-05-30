import React from "react";

import ReactDOM from "react-dom/client";

import { App } from "./app/components/App";
import { mockServerConfig } from "./mock-server/constants";

export async function enableMocking() {
  if (!import.meta.env.VITE_ENABLE_MSW) {
    return;
  }
  const { worker } = await import("@/mock-server/browser");
  return worker.start(mockServerConfig);
}

const root = ReactDOM.createRoot(document.getElementById("root")!);

enableMocking().then(() => {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
});
