import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { MenuItem, Select, SelectChangeEvent } from "@mui/material";

import { selectStyles } from "./styles";
import { Locale } from "../i18n.types";

export function LocaleSelector() {
  const { i18n } = useTranslation();

  const [language, setLanguage] = useState(i18n.language);

  /**
   * Handles the change of language selection.
   * @param {SelectChangeEvent<string>} event - The event triggered by changing the language selection.
   */
  const handleLanguageChange = (event: SelectChangeEvent<string>) => {
    setLanguage(event.target.value);
  };

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [i18n, language]);

  return (
    <Select
      value={language}
      label="Language"
      variant="outlined"
      onChange={handleLanguageChange}
      displayEmpty
      size="small"
      sx={selectStyles}
    >
      {Object.values(Locale).map((locale) => (
        <MenuItem key={locale} value={locale}>
          {locale.toUpperCase()}
        </MenuItem>
      ))}
    </Select>
  );
}
