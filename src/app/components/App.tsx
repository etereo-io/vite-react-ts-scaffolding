import "@/assets/styles/global.css";

import "../modules/modules";

import { AppRoutes } from "@/app/components/AppRoutes";

import { AppProviders } from "./AppProviders";

export function App() {
  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  );
}
