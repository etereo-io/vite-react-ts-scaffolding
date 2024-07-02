import { Box, Typography } from "@mui/material";
import Paper from "@mui/material/Paper";

import NewSaleForm from "../components/forms/NewSaleForm";

export function NewSalePage() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4, m: 4 }}>
      <Box>
        <Typography variant={"h5"} fontWeight="bold">
          Nueva venta
        </Typography>
        <Typography variant={"subtitle1"} fontWeight="light">
          Completa los siguientes datos para dar de alta un nuevo contrato
        </Typography>
      </Box>
      <Paper sx={{ p: 4, display: "flex", flexDirection: "column", maxWidth: 500 }}>
        <NewSaleForm isLoading={false} onSubmit={() => {}} />
      </Paper>
    </Box>
  );
}
