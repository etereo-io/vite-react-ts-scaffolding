import type { ReactElement, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

import { Button } from "@/shared/components/ui/button";

interface ErrorPageProps {
  readonly errorType: string;
  readonly errorTitle: string;
  readonly errorDescription: string;
  readonly icon?: ReactElement;
  readonly footer?: ReactNode;
}

export function ErrorPageActions() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  function handleGoBack() {
    navigate(-1);
  }

  return (
    <div className="flex justify-center pt-4">
      <Button onClick={handleGoBack} variant="outline">
        {t("shared.error.button.goBack")}
      </Button>
    </div>
  );
}

export function ErrorPage({
  errorType,
  errorTitle,
  errorDescription,
  icon,
  footer
}: ErrorPageProps) {
  return (
    <div
      className="h-full flex items-center justify-center bg-background p-4"
      data-testid={`error-${errorType}-page`}
    >
      <div className="w-full max-w-md mx-auto text-center space-y-8">
        {icon && <div className="flex justify-center">{icon}</div>}

        <div className="space-y-4 mx-auto">
          <h1 className="text-3xl font-semibold text-foreground">
            {errorTitle}
          </h1>
          <p className="text-sm text-muted-foreground">{errorDescription}</p>
        </div>

        {footer ?? <ErrorPageActions />}
      </div>
    </div>
  );
}
