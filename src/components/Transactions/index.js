import Root from "../Root";
import { Paper, Link } from "@mui/material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { leagueTransactionsLoader } from "../../api/graphql";
import { useState, useEffect } from "react";
import PageToolbar from "../common/PageToolbar";
import { convertDateToLocal, formatPlayerFullName } from "../../utils/helpers";
import withAuth from "../withAuth";

function Transactions({ league }) {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchTransactions = async (leagueId) => {
            try {
                const response = await leagueTransactionsLoader(leagueId);
                setTransactions(response);
            } catch (error) {
                console.error(error);
                return;
            }
        }
        fetchTransactions(league?.LeagueId);
    }, [
        league?.LeagueId,
    ]);

    return (
        <Root>
            <PageToolbar title={'Transactions'} />
            <TableContainer component={Paper}>
                <Table size="small" aria-label="simple table">
                    <TableHead>
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
                            <TableCell>
                                Action
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transactions.map((transaction) => (
                            <TableRow key={transaction.TransactionId}>
                                <TableCell>{convertDateToLocal(transaction.TransactionDate).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    {transaction.TransactionType === 0 ? "Unlimited" :
                                        transaction.TransactionType === 1 ? "FreeIR" :
                                            transaction.TransactionType === 2 ? "AddDrop" :
                                                transaction.TransactionType === 3 ? "Delete" :
                                                    transaction.TransactionType === 4 ? "Add" :
                                                        " "}
                                    {transaction.WaiverRequestId > 0 ? " (off waivers)" : " "}
                                </TableCell>
                                <TableCell>
                                    {transaction.RosterPlayerAdded.Team?.TeamName} ({transaction.RosterPlayerAdded.Team?.OwnerName})
                                    {` added `}
                                    <Link to={`/Player/${transaction.RosterPlayerAdded.Player.PlayerId}`} >
                                        {formatPlayerFullName(transaction.RosterPlayerAdded.Player.Name, transaction.RosterPlayerAdded.Player.Position.PositionCode)}
                                    </Link>
                                    {` ${transaction.RosterPlayerAdded.Player.Position.PositionCode}`}
                                    <br />
                                    {transaction.RosterPlayerDeleted.Team?.TeamName} ({transaction.RosterPlayerDeleted.Team?.OwnerName})
                                    {` dropped `}
                                    <Link to={`/Player/${transaction.RosterPlayerDeleted.Player.PlayerId}`} >
                                        {formatPlayerFullName(transaction.RosterPlayerDeleted.Player.Name, transaction.RosterPlayerDeleted.Player.Position.PositionCode)}
                                    </Link>
                                    {` ${transaction.RosterPlayerDeleted.Player.Position.PositionCode}`}
                                </TableCell>
                                <TableCell>
                                    <Link to={`/Team/${transaction.RosterPlayerAdded.Team.TeamId}`} >{transaction.RosterPlayerAdded.Team?.OwnerName} - Roster</Link>
                                    {transaction.WaiverRequestId > 0 ? ` | ` : ' '}
                                    {transaction.WaiverRequestId > 0 ?
                                        <Link to={`/WaiverResults/?Week=${transaction.WaiverRequest?.Week}&Date=${convertDateToLocal(transaction.TransactionDate).toLocaleDateString()}`}>Waiver Report</Link>
                                        : null}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Root>
    )
}

export default withAuth(Transactions);