import { useTranslation } from "react-i18next";

import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, MenuItem, Pagination, Select } from "@mui/material";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import { AllowedAuth } from "@/auth/components/AllowedAuth";
import { Title } from "@/shared/components/Title";

import { useOrdersController } from "../hooks/useOrdersController";
import { OrderStatus } from "../orders.types";

export function Orders() {
  const { t } = useTranslation();

  const {
    canDelete,
    page,
    orders,
    status,
    handleOrderStatusChange,
    handleOnPaginationChange,
    handleOrderDelete,
    handleSeeMoreOrders,
  } = useOrdersController();

  return (
    <>
      <Title>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {t("orders.recent")}
          <Select value={status ?? ""} displayEmpty label="status" onChange={handleOrderStatusChange}>
            <MenuItem value="">{t("shared.all")}</MenuItem>
            {Object.values(OrderStatus).map((status) => (
              <MenuItem key={status} value={status}>
                {status.toUpperCase()}
              </MenuItem>
            ))}
          </Select>
        </div>
      </Title>
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
        <TableBody>
          {orders?.data.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.date}</TableCell>
              <TableCell>{order.name}</TableCell>
              <TableCell>{order.shipTo}</TableCell>
              <TableCell>{order.paymentMethod}</TableCell>
              <TableCell>{order.status}</TableCell>
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
