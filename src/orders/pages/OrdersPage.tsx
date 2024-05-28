import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

import { Orders } from "../components/Orders";

export function OrdersPage() {
  return (
    <Grid item xs={12}>
      <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
        <Orders />
      </Paper>
    </Grid>
  );
}
