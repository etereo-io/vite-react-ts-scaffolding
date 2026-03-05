import { SearchX } from "lucide-react";
import { useTranslation } from "react-i18next";

import { ErrorPage } from "./ErrorPage";

export function Error404() {
  const { t } = useTranslation();

  return (
    <ErrorPage
      errorType="404"
      icon={<SearchX className="w-16 h-16 text-muted-foreground" />}
      errorTitle={t("shared.error.404.title")}
      errorDescription={t("shared.error.404.message")}
    />
  );
}
