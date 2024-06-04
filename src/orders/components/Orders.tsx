import { useTranslation } from "react-i18next";

import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Pagination } from "@mui/material";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import { AllowedAuth } from "@/auth/components/AllowedAuth";
import { Title } from "@/shared/components/Title";

import { useOrdersController } from "../hooks/useOrdersController";

export function Orders() {
  const { t } = useTranslation();

  const { canDelete, page, orders, handleOnPaginationChange, handleOrderDelete, handleSeeMoreOrders } =
    useOrdersController();

  return (
    <>
      <Title>{t("orders.recent")}</Title>
      <Table size="small" data-testid="orders-table">
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
                {/* this could be also valid, but just to show an example with already evaluated permission */}
                {/* <AllowedAuth permissions={PERMISSION_ORDERS_DELETE}> */}
                <AllowedAuth permissions={canDelete}>
                  <IconButton aria-label="delete" onClick={handleOrderDelete(order.id)}>
                    <DeleteIcon />
                  </IconButton>
                </AllowedAuth>
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

      <Link color="primary" href="#" onClick={handleSeeMoreOrders} sx={{ mt: 3 }}>
        See more orders
      </Link>
    </>
  );
}
