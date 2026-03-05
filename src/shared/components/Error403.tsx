import { ShieldAlert } from "lucide-react";
import { useTranslation } from "react-i18next";

import { ErrorPage } from "./ErrorPage";

export function Error403() {
  const { t } = useTranslation();

  return (
    <ErrorPage
      errorType="403"
      icon={<ShieldAlert className="w-16 h-16 text-destructive" />}
      errorTitle={t("shared.error.403.title")}
      errorDescription={t("shared.error.403.message")}
    />
  );
}
