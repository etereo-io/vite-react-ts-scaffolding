import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

import { Deposit } from "../components/Deposit";
import { DepositList } from "../components/DepositList";

export function DepositPage() {
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
          <Deposit />
        </Paper>
        <Paper
          sx={{
            p: 2,
            mt: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <DepositList />
        </Paper>
      </Grid>
    </>
  );
}
