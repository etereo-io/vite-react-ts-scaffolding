import { AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";

import { ErrorPage } from "./ErrorPage";

export function RouterErrorBoundary() {
  const { t } = useTranslation();

  return (
    <ErrorPage
      errorType="router"
      icon={<AlertTriangle className="w-16 h-16 text-destructive" />}
      errorTitle={t("shared.error.router.title")}
      errorDescription={t("shared.error.router.message")}
    />
  );
}
