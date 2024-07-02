import { Box, Table, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import Paper from "@mui/material/Paper";

export function ClientsListPage() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4, m: 4 }}>
      <Box>
        <Typography variant={"h5"} fontWeight="bold">
          Clientes
        </Typography>
      </Box>
      <Paper sx={{ p: 4, display: "flex", flexDirection: "column", maxWidth: 500 }}>
        <Table size="small" data-testid="orders-table">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Ship To</TableCell>
              <TableCell>Payment Method</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Sale Amount</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          {/* <TableBody>
            {orders?.data.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.date}</TableCell>
                <TableCell>{order.name}</TableCell>
                <TableCell>{order.shipTo}</TableCell>
                <TableCell>{order.paymentMethod}</TableCell>
                <TableCell>{order.status}</TableCell>
              </TableRow>
            ))}
          </TableBody> */}
        </Table>
      </Paper>
    </Box>
  );
}
