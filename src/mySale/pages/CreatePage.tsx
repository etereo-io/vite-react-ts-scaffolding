import { Trans } from "react-i18next";

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

import { AllowedAuth } from "@/auth/components/AllowedAuth";

export function CreatePage() {
  return (
    <Grid item xs={12}>
      <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
        <AllowedAuth permissions={[]} error={<Trans i18nKey="shared.error.page.permissions" />}>
          <div>Test</div>
        </AllowedAuth>
      </Paper>
    </Grid>
  );
}
