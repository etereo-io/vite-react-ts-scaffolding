import { initReactI18next } from "react-i18next";

import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import { isDevelopment } from "@/app/env";
import { getAllLocalesResources } from "@/app/modules/modules.helpers";

import { Locale } from "./i18n.types";

export const resources = getAllLocalesResources();

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: isDevelopment,
    fallbackLng: Locale.EN,
    supportedLngs: Object.values(Locale),
    interpolation: {
      escapeValue: false,
    },
    resources,
  });

export default i18next;
