import { useTranslation } from "react-i18next";

import { Box } from "@mui/material";
import { CircularProgress } from "@mui/material";
import Chip from "@mui/material/Chip";
import Pagination from "@mui/material/Pagination";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { format } from "date-fns/format";

import { useSalesController } from "../../hooks/useSalesController";

export function SalesTable() {
  const { t } = useTranslation();
  const { sales, isFetching, page, handleOnPaginationChange } = useSalesController();

  return (
    <>
      {isFetching ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%" py={8}>
          <CircularProgress />
        </Box>
      ) : (
        <Table size="small" data-testid="clients-table">
          <TableHead>
            <TableRow>
              <TableCell>Numero de pedido</TableCell>
              <TableCell>Suscripcion</TableCell>
              <TableCell>Numero cliente</TableCell>
              <TableCell>Fecha venta</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sales?.data.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell>
                  <Typography variant="body2">#{sale.orderNumber}</Typography>
                </TableCell>
                <TableCell>
                  <Chip color={"secondary"} label={t(`sales.bundle.${sale.bundle.type}`).toUpperCase()} />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{sale.client.id}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{format(new Date(sale.createdAt), "dd/MM/yyyy, HH:mm")}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Pagination
        count={sales?.pagination.count || 0}
        page={page}
        onChange={handleOnPaginationChange}
        sx={{
          mt: 3,
          display: "flex",
          justifyContent: "center",
        }}
      />
    </>
  );
}
