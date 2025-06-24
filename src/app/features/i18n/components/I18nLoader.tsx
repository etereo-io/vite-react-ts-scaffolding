import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import type { PropsWithChildren } from "react";
import { initReactI18next } from "react-i18next";

import { isDevelopment } from "@/app/features/env";
import { getAllLocalesResources } from "@/app/features/modules/modules.helpers";
import { Locale } from "../i18n.types";

export function I18nLoader({ children }: PropsWithChildren) {
  const resources = getAllLocalesResources();

  i18next
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      debug: isDevelopment,
      fallbackLng: Locale.EN,
      supportedLngs: Object.values(Locale),
      interpolation: {
        escapeValue: false
      },
      resources
    });

  return children;
}
