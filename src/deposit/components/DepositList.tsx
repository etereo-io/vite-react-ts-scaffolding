import { useTranslation } from "react-i18next";

import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import { Title } from "@/shared/components/Title";

import { useDepositControllers } from "../hooks/useDepositControllers";

export function DepositList() {
  const { t } = useTranslation();
  const { deposits } = useDepositControllers();

  return (
    <>
      <Title>{t("deposit.recent")}</Title>
      <Table size="small" data-testid="deposits-table">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {deposits?.data.map((deposit) => (
            <TableRow key={deposit.id}>
              <TableCell>{new Date(deposit.date).toLocaleDateString()}</TableCell>
              <TableCell>...{deposit.id.split("-").at(-1)}</TableCell>
              <TableCell>{deposit.name}</TableCell>
              <TableCell>${deposit.amount}</TableCell>
              <TableCell align="right">
                <IconButton aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
