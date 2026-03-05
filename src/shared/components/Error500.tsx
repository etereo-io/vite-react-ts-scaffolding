import { ServerCrash } from "lucide-react";
import { useTranslation } from "react-i18next";

import { ErrorPage } from "./ErrorPage";

export function Error500() {
  const { t } = useTranslation();

  return (
    <ErrorPage
      errorType="500"
      icon={<ServerCrash className="w-16 h-16 text-destructive" />}
      errorTitle={t("shared.error.500.title")}
      errorDescription={t("shared.error.500.message")}
    />
  );
}
