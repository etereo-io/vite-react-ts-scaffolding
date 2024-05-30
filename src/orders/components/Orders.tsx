import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Pagination } from "@mui/material";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import { API_DEFAULT_LIMIT } from "@/app/api";
import { Title } from "@/shared/components/Title";

import { useOrderDelete } from "../hooks/useOrderDelete";
import { useOrders } from "../hooks/useOrders";

function preventDefault(event: React.MouseEvent) {
  event.preventDefault();
}

export function Orders() {
  const { t } = useTranslation();

  const [offset, setOffset] = useState(0);

  const handleOnPaginationChange = (_: unknown, page: number) => {
    setOffset((page - 1) * API_DEFAULT_LIMIT);
  };

  const { data: orders } = useOrders(offset);
  const mutation = useOrderDelete();

  const handleOrderDelete = useCallback(
    (orderId: string) => () => {
      mutation.mutate(orderId);
    },
    [mutation],
  );

  const page = Math.floor((offset ?? 0) / (orders?.pagination.limit ?? 0)) + 1 || 0;

  return (
    <>
      <Title>{t("orders.recent")}</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Ship To</TableCell>
            <TableCell>Payment Method</TableCell>
            <TableCell align="right">Sale Amount</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders?.data.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.date}</TableCell>
              <TableCell>{order.name}</TableCell>
              <TableCell>{order.shipTo}</TableCell>
              <TableCell>{order.paymentMethod}</TableCell>
              <TableCell align="right">{`$${order.amount}`}</TableCell>
              <TableCell align="right">
                <IconButton aria-label="delete" onClick={handleOrderDelete(order.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination
        count={orders?.pagination.count || 0}
        page={page}
        onChange={handleOnPaginationChange}
        sx={{
          mt: 3,
        }}
      />

      <Link color="primary" href="#" onClick={preventDefault} sx={{ mt: 3 }}>
        See more orders
      </Link>
    </>
  );
}
