import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Locale } from "../i18n.types";

export function LocaleSelector() {
  const { i18n } = useTranslation();

  const [language, setLanguage] = useState(i18n.language);

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setLanguage(event.target.value);
  };

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [i18n, language]);

  return (
    <select
      value={language}
      onChange={handleLanguageChange}
      className="px-2 py-1 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    >
      {Object.values(Locale).map((locale) => (
        <option key={locale} value={locale}>
          {locale.toUpperCase()}
        </option>
      ))}
    </select>
  );
}
