import { useEffect, useState } from "react";
import { leagueTradesLoader } from "../../api/graphql";
import Root from "../Root";
import PageToolbar from "../common/PageToolbar";
import {
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
import { ThumbDown, ThumbUp } from "@mui/icons-material";
import withAuth from "../withAuth";
import { approveTrade, denyTrade } from "../../api/ffl";
import ConfirmationDialog from "../common/ConfirmationDialog";

function LeagueTrades({ league, user }) {
  const theme = useTheme();
  const isBelowMedium = useMediaQuery(theme.breakpoints.down("md"));
  const [trades, setTrades] = useState([]);
  const [tradeId, setTradeId] = useState();
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState(false);
  const [showApproveConfirmation, setShowApproveConfirmation] = useState(false);
  const [showDenyConfirmation, setShowDenyConfirmation] = useState(false);

  useEffect(() => {
    const fetchTrades = async (leagueId) => {
      const tradeResponse = await leagueTradesLoader(leagueId);
      setTrades(tradeResponse);
    };
    fetchTrades(league?.LeagueId);
  }, [league?.LeagueId]);

  const handleApprove = async (id) => {
    setTradeId(id);
    setShowApproveConfirmation(true);
  };

  const handleDeny = async (id) => {
    setTradeId(id);
    setShowDenyConfirmation(true);
  };

  const handleApproveConfirmClick = async () => {
    setShowApproveConfirmation(false);
    setMessage();
    setIsUpdating(true);
    const result = await approveTrade(tradeId);
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

  const handleDenyConfirmClick = async () => {
    setShowDenyConfirmation(false);
    setMessage();
    setIsUpdating(true);
    const result = await denyTrade(tradeId);
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
    <Root title={"League Trades"}>
      <PageToolbar title={"League Trades"} />
      <ConfirmationDialog
        open={showApproveConfirmation}
        setOpen={setShowApproveConfirmation}
        message={message}
        isUpdating={isUpdating}
        handleConfirmClick={handleApproveConfirmClick}
        confirmationMessage={"Approve Trade Request?"}
      />
      <ConfirmationDialog
        open={showDenyConfirmation}
        setOpen={setShowDenyConfirmation}
        message={message}
        isUpdating={isUpdating}
        handleConfirmClick={handleDenyConfirmClick}
        confirmationMessage={"Deny Trade Request?"}
      />
      {isUpdating ? <CircularProgress /> : null}
      <Typography color="error">{message}</Typography>
      <TableContainer component={Paper}>
        <Table size="small" aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                Trade Date
              </TableCell>
              <TableCell>Team</TableCell>
              <TableCell>Team</TableCell>
              <TableCell>Status</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trades?.map((trade) =>
              ((user?.isAdmin || user?.isCommissioner) &&
                trade.TradeStatus === 1) ||
              trade.TradeStatus === 5 ? (
                <TableRow key={trade.TradeId}>
                  <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                    {convertDateToLocal(trade.TradeDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {formatFantasyTeamName(trade.GivingTeam, isBelowMedium)}
                    {trade.TradeDetails.items?.map((detail) => (
                      <Typography
                        key={`${detail.GivingRosterPlayerId}`}
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
                        key={`${detail.ReceivingRosterPlayerId}`}
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
                        {
                          detail.ReceivingRosterPlayer.Player.NflTeam
                            .DisplayCode
                        }
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
                    {(user?.isAdmin || user?.isCommissioner) &&
                    trade.TradeStatus === 1 ? (
                      <Tooltip title="Approve">
                        <IconButton
                          color="success"
                          onClick={() => handleApprove(trade.TradeId)}
                        >
                          <ThumbUp />
                        </IconButton>
                      </Tooltip>
                    ) : null}
                    {(user?.isAdmin || user?.isCommissioner) &&
                    trade.TradeStatus === 1 ? (
                      <Tooltip title="Deny">
                        <IconButton
                          color="error"
                          onClick={() => handleDeny(trade.TradeId)}
                        >
                          <ThumbDown />
                        </IconButton>
                      </Tooltip>
                    ) : null}
                  </TableCell>
                </TableRow>
              ) : null
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Root>
  );
}

export default withAuth(LeagueTrades);
