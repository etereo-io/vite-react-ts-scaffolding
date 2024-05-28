import "@/assets/styles/global.css";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

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
