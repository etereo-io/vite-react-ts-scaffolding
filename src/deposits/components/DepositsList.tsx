import { useTranslation } from "react-i18next";

import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import { AllowedAuth } from "@/auth/components/AllowedAuth";
import { Title } from "@/shared/components/Title";

import { useDepositsControllers } from "../hooks/useDepositsControllers";

export function DepositsList() {
  const { t } = useTranslation();
  const { deposits, canDelete, handleDepositDelete } = useDepositsControllers();

  return (
    <>
      <Title>{t("deposit.recent")}</Title>
      <Table size="small" data-testid="deposits-table">
        <TableHead>
          <TableRow>
            <TableCell>{t("deposit.table.date")}</TableCell>
            <TableCell>{t("deposit.table.id")}</TableCell>
            <TableCell>{t("deposit.table.name")}</TableCell>
            <TableCell>{t("deposit.table.amount")}</TableCell>
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
                <AllowedAuth permissions={canDelete}>
                  <IconButton aria-label="delete" onClick={handleDepositDelete(deposit.id)}>
                    <DeleteIcon />
                  </IconButton>
                </AllowedAuth>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
