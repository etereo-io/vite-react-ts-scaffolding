import * as React from "react";
import { useTranslation } from "react-i18next";

import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

import { Title } from "@/shared/components/Title";

import { useDepositControllers } from "../hooks/useDepositControllers";

function preventDefault(event: React.MouseEvent) {
  event.preventDefault();
}

export function Deposit() {
  const { t } = useTranslation();

  const { totalAmount } = useDepositControllers();

  return (
    <React.Fragment>
      <Title>{t("deposit.total")}</Title>
      <Typography component="p" variant="h4">
        ${totalAmount.toFixed(2)}
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        on {new Date().toLocaleDateString()}
      </Typography>
      <div>
        <Link color="primary" href="#" onClick={preventDefault}>
          {t("deposit.balance")}
        </Link>
      </div>
    </React.Fragment>
  );
}
