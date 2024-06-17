import { Trans } from "react-i18next";

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

import { AllowedAuth } from "@/auth/components/AllowedAuth";

import { Deposit } from "../components/Deposit";
import { DepositsList } from "../components/DepositsList";
import { PERMISSION_DEPOSITS_LIST } from "../deposits.constants";

export function DepositsPage() {
  return (
    <>
      {/* Recent Deposits */}
      <Grid item xs={12}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: 180,
          }}
        >
          <AllowedAuth permissions={PERMISSION_DEPOSITS_LIST} error={<Trans i18nKey="shared.error.page.permissions" />}>
            <Deposit />
          </AllowedAuth>
        </Paper>
        <Paper
          sx={{
            p: 2,
            mt: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <AllowedAuth permissions={PERMISSION_DEPOSITS_LIST} error={<Trans i18nKey="shared.error.page.permissions" />}>
            <DepositsList />
          </AllowedAuth>
        </Paper>
      </Grid>
    </>
  );
}
