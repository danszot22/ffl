import { Paper, Link } from "@mui/material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { convertDateToLocal, formatPlayerFullName } from "../../utils/helpers";
import { StyledTableHeaderRow } from "../common/styled";

export default function TeamTransactions({ transactions }) {

    return (
        <TableContainer component={Paper}>
            <Table size="small" aria-label="simple table">
                <TableHead>
                    <StyledTableHeaderRow>
                        <TableCell colSpan={3}>
                            Transactions
                        </TableCell>
                    </StyledTableHeaderRow>
                    <TableRow>
                        <TableCell>
                            Date
                        </TableCell>
                        <TableCell>
                            Type
                        </TableCell>
                        <TableCell>
                            Details
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {transactions?.map((transaction) => (
                        <TableRow key={transaction.TransactionId}>
                            <TableCell>{convertDateToLocal(transaction.TransactionDate).toLocaleDateString()}</TableCell>
                            <TableCell>
                                {transaction.TransactionType === 0 ? "Unlimited" :
                                    transaction.TransactionType === 1 ? "FreeIR" :
                                        transaction.TransactionType === 2 ? "AddDrop" :
                                            transaction.TransactionType === 3 ? "Delete" :
                                                transaction.TransactionType === 4 ? "Add" :
                                                    " "}
                                {transaction.TransactionFee > 0 ? " $" : " "}
                            </TableCell>
                            <TableCell>
                                {`Added `}
                                <Link to={`/Player/${transaction.RosterPlayerAdded.Player.PlayerId}`} >
                                    {formatPlayerFullName(transaction.RosterPlayerAdded.Player.Name, transaction.RosterPlayerAdded.Player.Position.PositionCode)}
                                </Link>
                                {` ${transaction.RosterPlayerAdded.Player.Position.PositionCode}`}
                                <br />
                                {` dropped `}
                                <Link to={`/Player/${transaction.RosterPlayerDeleted.Player.PlayerId}`} >
                                    {formatPlayerFullName(transaction.RosterPlayerDeleted.Player.Name, transaction.RosterPlayerDeleted.Player.Position.PositionCode)}
                                </Link>
                                {` ${transaction.RosterPlayerDeleted.Player.Position.PositionCode}`}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}