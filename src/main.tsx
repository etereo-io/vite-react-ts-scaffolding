import React from "react";

import ReactDOM from "react-dom/client";

import { cleanOldStorageVersions } from "@/lib/storage/storage";
import { App } from "./app/components/App";

cleanOldStorageVersions();

// biome-ignore lint/style/noNonNullAssertion: checked
const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
