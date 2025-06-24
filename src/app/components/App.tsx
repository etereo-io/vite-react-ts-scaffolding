import "@/assets/styles/global.css";

import "../features/modules/modules";

import { AppRoutes } from "@/app/components/AppRoutes";

import type { Config } from "../features/config/config.types";
import { AppProviders } from "./AppProviders";

export function App({ config }: { readonly config?: Config | null }) {
  return (
    <AppProviders config={config}>
      <AppRoutes />
    </AppProviders>
  );
}
