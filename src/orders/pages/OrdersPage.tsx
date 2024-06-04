import { Trans } from "react-i18next";

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

import { AllowedAuth } from "@/auth/components/AllowedAuth";

import { Orders } from "../components/Orders";
import { PERMISSION_ORDERS_LIST } from "../orders.constants";

export function OrdersPage() {
  return (
    <Grid item xs={12}>
      <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
        <AllowedAuth permissions={PERMISSION_ORDERS_LIST} error={<Trans i18nKey="shared.error.page.permissions" />}>
          <Orders />
        </AllowedAuth>
      </Paper>
    </Grid>
  );
}
