import Root from "../Root";
import {
  Paper,
  Link,
  useTheme,
  useMediaQuery,
  Typography,
} from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { leagueTransactionsLoader } from "../../api/graphql";
import { useState, useEffect } from "react";
import PageToolbar from "../common/PageToolbar";
import { convertDateToLocal, formatFantasyTeamName } from "../../utils/helpers";
import withAuth from "../withAuth";
import PlayerLink from "../common/PlayerLink";

function Transactions({ league }) {
  const theme = useTheme();
  const isBelowMedium = useMediaQuery(theme.breakpoints.down("md"));
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
    };
    fetchTransactions(league?.LeagueId);
  }, [league?.LeagueId]);

  return (
    <Root title={"Transactions"}>
      <PageToolbar title={"Transactions"} />
      <TableContainer component={Paper}>
        <Table size="small" aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                Date
              </TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Details</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.TransactionId}>
                <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                  {convertDateToLocal(
                    transaction.TransactionDate
                  ).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Typography sx={{ display: { xs: "block", md: "none" } }}>
                    {convertDateToLocal(
                      transaction.TransactionDate
                    ).toLocaleDateString()}
                  </Typography>
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
                  {transaction.WaiverRequestId > 0 ? " (off waivers)" : " "}
                </TableCell>
                <TableCell>
                  {formatFantasyTeamName(
                    transaction.RosterPlayerAdded.Team,
                    isBelowMedium
                  )}
                  {` added `}
                  <PlayerLink
                    playerId={transaction.RosterPlayerAdded.Player.PlayerId}
                    playerName={transaction.RosterPlayerAdded.Player.Name}
                    positionCode={
                      transaction.RosterPlayerAdded.Player.Position.PositionCode
                    }
                  />
                  {` ${transaction.RosterPlayerAdded.Player.Position.PositionCode}`}
                  <br />
                  {formatFantasyTeamName(
                    transaction.RosterPlayerDeleted.Team,
                    isBelowMedium
                  )}
                  {` dropped `}
                  <PlayerLink
                    playerId={transaction.RosterPlayerDeleted.Player.PlayerId}
                    playerName={transaction.RosterPlayerDeleted.Player.Name}
                    positionCode={
                      transaction.RosterPlayerDeleted.Player.Position
                        .PositionCode
                    }
                  />
                  {` ${transaction.RosterPlayerDeleted.Player.Position.PositionCode}`}
                </TableCell>
                <TableCell>
                  <Link
                    to={`/Team/${transaction.RosterPlayerAdded.Team.TeamId}`}
                  >
                    {transaction.RosterPlayerAdded.Team?.OwnerName} - Roster
                  </Link>
                  {transaction.WaiverRequestId > 0 ? ` | ` : " "}
                  {transaction.WaiverRequestId > 0 ? (
                    <Link
                      to={`/WaiverResults/?Week=${
                        transaction.WaiverRequest?.Week
                      }&Date=${convertDateToLocal(
                        transaction.TransactionDate
                      ).toLocaleDateString()}`}
                    >
                      Waiver Report
                    </Link>
                  ) : null}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Root>
  );
}

export default withAuth(Transactions);
