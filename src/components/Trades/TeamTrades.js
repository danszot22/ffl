import { useEffect, useState } from "react";
import { teamTradesLoader } from "../../api/graphql";
import Root from "../Root";
import PageToolbar from "../common/PageToolbar";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  convertDateToLocal,
  formatFantasyTeamName,
  formatPlayerFullName,
  formatPlayerName,
  tradeStatuses,
} from "../../utils/helpers";
import { Delete, ThumbDown, ThumbUp } from "@mui/icons-material";
import withAuth from "../withAuth";
import { acceptTrade, deleteTrade, rejectTrade } from "../../api/ffl";
import ConfirmationDialog from "../common/ConfirmationDialog";

function TeamTrades({ team }) {
  const theme = useTheme();
  const isBelowMedium = useMediaQuery(theme.breakpoints.down("md"));
  const [trades, setTrades] = useState([]);
  const [tradeId, setTradeId] = useState();
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showRejectConfirmation, setShowRejectConfirmation] = useState(false);
  const [showAcceptConfirmation, setShowAcceptConfirmation] = useState(false);

  useEffect(() => {
    const fetchTrades = async (teamId) => {
      const tradeResponse = await teamTradesLoader(teamId);
      setTrades(tradeResponse);
    };
    fetchTrades(team?.TeamId);
  }, [team?.TeamId]);

  const handleDelete = async (id) => {
    setTradeId(id);
    setShowDeleteConfirmation(true);
  };

  const handleReject = async (id) => {
    setTradeId(id);
    setShowRejectConfirmation(true);
  };

  const handleAccept = async (id) => {
    setTradeId(id);
    setShowAcceptConfirmation(true);
  };

  const handleDeleteConfirmClick = async () => {
    setShowDeleteConfirmation(false);
    setMessage();
    setIsUpdating(true);
    const result = await deleteTrade(tradeId);
    setIsUpdating(false);
    if (result?.Message) {
      setMessage(result?.Message);
    } else {
      const updatedTrades = trades.filter((trade) => {
        return trade.TradeId !== tradeId;
      });
      setTrades(updatedTrades);
    }
  };

  const handleAcceptConfirmClick = async () => {
    setShowAcceptConfirmation(false);
    setMessage();
    setIsUpdating(true);
    const result = await acceptTrade(tradeId);
    setIsUpdating(false);
    if (result?.Message) {
      setMessage(result?.Message);
    } else {
      const updatedTrades = trades.filter((trade) => {
        return trade.TradeId !== tradeId;
      });
      setTrades(updatedTrades);
    }
  };

  const handleRejectConfirmClick = async () => {
    setShowRejectConfirmation(false);
    setMessage();
    setIsUpdating(true);
    const result = await rejectTrade(tradeId);
    setIsUpdating(false);
    if (result?.Message) {
      setMessage(result?.Message);
    } else {
      const updatedTrades = trades.filter((trade) => {
        return trade.TradeId !== tradeId;
      });
      setTrades(updatedTrades);
    }
  };

  return (
    <Root title={"Team Trades"}>
      <PageToolbar title={"Team Trades"} />
      {isUpdating ? <CircularProgress /> : null}
      <ConfirmationDialog
        open={showDeleteConfirmation}
        setOpen={setShowDeleteConfirmation}
        message={message}
        isUpdating={isUpdating}
        handleConfirmClick={handleDeleteConfirmClick}
        confirmationMessage={"Delete Trade Request?"}
      />
      <ConfirmationDialog
        open={showRejectConfirmation}
        setOpen={setShowRejectConfirmation}
        message={message}
        isUpdating={isUpdating}
        handleConfirmClick={handleRejectConfirmClick}
        confirmationMessage={"Reject Trade Request?"}
      />
      <ConfirmationDialog
        open={showAcceptConfirmation}
        setOpen={setShowAcceptConfirmation}
        message={message}
        isUpdating={isUpdating}
        handleConfirmClick={handleAcceptConfirmClick}
        confirmationMessage={"Accept Trade Request?"}
      />
      <Typography color="error">{message}</Typography>
      <TableContainer component={Paper}>
        <Table size="small" aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                Trade Date
              </TableCell>
              <TableCell colSpan={2}>
                <Button variant="contained" to="/ProposeTrade">
                  Propose Trade
                </Button>
              </TableCell>
              <TableCell>Status</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trades?.map((trade) => (
              <TableRow key={trade.TradeId}>
                <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                  {convertDateToLocal(trade.TradeDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {formatFantasyTeamName(trade.GivingTeam, isBelowMedium)}
                  {trade.TradeDetails.items?.map((detail) => (
                    <Typography
                      key={detail.GivingRosterPlayerId}
                      variant="caption"
                      component="div"
                    >
                      {isBelowMedium
                        ? formatPlayerName(
                            detail.GivingRosterPlayer.Player.Name,
                            detail.GivingRosterPlayer.Player.Position
                              .PositionCode
                          )
                        : formatPlayerFullName(
                            detail.GivingRosterPlayer.Player.Name
                          )}{" "}
                      {detail.GivingRosterPlayer.Player.Position.PositionCode}{" "}
                      {detail.GivingRosterPlayer.Player.NflTeam.DisplayCode}
                    </Typography>
                  ))}
                </TableCell>
                <TableCell>
                  {formatFantasyTeamName(trade.ReceivingTeam, isBelowMedium)}
                  {trade.TradeDetails.items?.map((detail) => (
                    <Typography
                      key={detail.ReceivingRosterPlayerId}
                      variant="caption"
                      component="div"
                    >
                      {isBelowMedium
                        ? formatPlayerName(
                            detail.ReceivingRosterPlayer.Player.Name,
                            detail.ReceivingRosterPlayer.Player.Position
                              .PositionCode
                          )
                        : formatPlayerFullName(
                            detail.ReceivingRosterPlayer.Player.Name
                          )}{" "}
                      {
                        detail.ReceivingRosterPlayer.Player.Position
                          .PositionCode
                      }{" "}
                      {detail.ReceivingRosterPlayer.Player.NflTeam.DisplayCode}
                    </Typography>
                  ))}
                </TableCell>
                <TableCell>
                  <Typography sx={{ display: { xs: "block", md: "none" } }}>
                    {convertDateToLocal(trade.TradeDate).toLocaleDateString()}
                  </Typography>
                  {tradeStatuses[trade.TradeStatus]}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex" }}>
                    {team?.TeamId === trade.GivingTeam?.TeamId ? (
                      <Tooltip title="Delete">
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(trade.TradeId)}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    ) : null}
                    {team?.TeamId === trade.ReceivingTeam?.TeamId &&
                    trade.TradeStatus === 0 ? (
                      <Tooltip title="Accept">
                        <IconButton
                          color="success"
                          onClick={() => handleAccept(trade.TradeId)}
                        >
                          <ThumbUp />
                        </IconButton>
                      </Tooltip>
                    ) : null}
                    {team?.TeamId === trade.ReceivingTeam?.TeamId &&
                    trade.TradeStatus === 0 ? (
                      <Tooltip title="Reject">
                        <IconButton
                          color="error"
                          onClick={() => handleReject(trade.TradeId)}
                        >
                          <ThumbDown />
                        </IconButton>
                      </Tooltip>
                    ) : null}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Root>
  );
}

export default withAuth(TeamTrades);
