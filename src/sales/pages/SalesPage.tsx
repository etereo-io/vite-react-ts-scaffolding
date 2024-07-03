import { Box, Typography } from "@mui/material";
import Paper from "@mui/material/Paper";

import { SalesTable } from "../components/tables/SalesTable";

export function SalesPage() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4, m: 4 }}>
      <Box>
        <Typography variant={"h5"} fontWeight="bold">
          Clientes
        </Typography>
      </Box>
      <Paper sx={{ p: 4 }}>
        <SalesTable />
      </Paper>
    </Box>
  );
}
