import { Paper } from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { convertDateToLocal } from "../../utils/helpers";
import { StyledTableHeaderRow } from "../common/styled";
import PlayerLink from "../common/PlayerLink";

export default function TeamTransactions({ transactions }) {
  return (
    <TableContainer component={Paper}>
      <Table size="small" aria-label="simple table">
        <TableHead>
          <StyledTableHeaderRow>
            <TableCell colSpan={3}>Transactions</TableCell>
          </StyledTableHeaderRow>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Details</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions?.map((transaction) => (
            <TableRow key={transaction.TransactionId}>
              <TableCell sx={{ pr: { xs: 0, sm: 1 } }}>
                {convertDateToLocal(
                  transaction.TransactionDate
                ).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {transaction.TransactionType === 0
                  ? "Unlimited"
                  : transaction.TransactionType === 1
                  ? "FreeIR"
                  : transaction.TransactionType === 2
                  ? "AddDrop"
                  : transaction.TransactionType === 3
                  ? "Delete"
                  : transaction.TransactionType === 4
                  ? "Add"
                  : " "}
                {transaction.TransactionFee > 0 ? " $" : " "}
              </TableCell>
              <TableCell>
                {`Added `}
                <PlayerLink
                  playerId={transaction.RosterPlayerAdded.Player.PlayerId}
                  playerName={transaction.RosterPlayerAdded.Player.Name}
                  positionCode={
                    transaction.RosterPlayerAdded.Player.Position.PositionCode
                  }
                />
                {` ${transaction.RosterPlayerAdded.Player.Position.PositionCode}`}
                <br />
                {` dropped `}
                <PlayerLink
                  playerId={transaction.RosterPlayerDeleted.Player.PlayerId}
                  playerName={transaction.RosterPlayerDeleted.Player.Name}
                  positionCode={
                    transaction.RosterPlayerDeleted.Player.Position.PositionCode
                  }
                />
                {` ${transaction.RosterPlayerDeleted.Player.Position.PositionCode}`}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
