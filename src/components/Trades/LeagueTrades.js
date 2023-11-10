import { useEffect, useState } from "react";
import { leagueTradesLoader } from "../../api/graphql";
import Root from "../Root";
import PageToolbar from "../common/PageToolbar";
import { IconButton, Paper, Tooltip, Typography } from "@mui/material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { convertDateToLocal, formatFantasyTeamName, tradeStatuses } from "../../utils/helpers";
import { ThumbDown, ThumbUp } from "@mui/icons-material";
import withAuth from "../withAuth";

function LeagueTrades({ league, user }) {
    const [trades, setTrades] = useState([]);

    useEffect(() => {
        const fetchTrades = async (leagueId) => {
            const tradeResponse = await leagueTradesLoader(leagueId);
            setTrades(tradeResponse);
        }
        fetchTrades(league?.LeagueId);
    }, [
        league?.LeagueId
    ]);

    const handleAccept = (id) => {
        const updatedTrades = trades.filter((trade) => {
            return trade.TradeId !== id;
        });
        setTrades(updatedTrades);
        //TODO : Call API
    };
    const handleReject = (id) => {
        const updatedTrades = trades.filter((trade) => {
            return trade.TradeId !== id;
        });
        setTrades(updatedTrades);
        //TODO : Call API
    };

    return (
        <Root>
            <PageToolbar title={'League Trades'} />
            <TableContainer component={Paper}>
                <Table size="small" aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                Trade Date
                            </TableCell>
                            <TableCell>
                                Team
                            </TableCell>
                            <TableCell>
                                Team
                            </TableCell>
                            <TableCell>
                                Status
                            </TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {trades?.map((trade) => (
                            (((user?.isAdmin || user?.isCommissioner) && trade.TradeStatus === 1) || trade.TradeStatus === 5) ?
                                <TableRow key={trade.TradeId}>
                                    <TableCell>{convertDateToLocal(trade.TradeDate).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        {formatFantasyTeamName(trade.GivingTeam)}
                                        {trade.TradeDetails.items?.map((detail) =>
                                            <Typography key={`${detail.GivingRosterPlayerId}`} variant="caption" component="div" >
                                                {detail.GivingRosterPlayer.Player.Name} {detail.GivingRosterPlayer.Player.Position.PositionCode} {detail.GivingRosterPlayer.Player.NflTeam.DisplayCode}
                                            </Typography>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {formatFantasyTeamName(trade.ReceivingTeam)}
                                        {trade.TradeDetails.items?.map((detail) =>
                                            <Typography key={`${detail.ReceivingRosterPlayerId}`} variant="caption" component="div" >
                                                {detail.ReceivingRosterPlayer.Player.Name} {detail.ReceivingRosterPlayer.Player.Position.PositionCode} {detail.ReceivingRosterPlayer.Player.NflTeam.DisplayCode}
                                            </Typography>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {tradeStatuses[trade.TradeStatus]}
                                    </TableCell>
                                    <TableCell>
                                        {(user?.isAdmin || user?.isCommissioner) && trade.TradeStatus === 1 ?
                                            <Tooltip title="Approve">
                                                <IconButton color="success" onClick={() => handleAccept(trade.TradeId)}>
                                                    <ThumbUp />
                                                </IconButton>
                                            </Tooltip>
                                            : null
                                        }
                                        {(user?.isAdmin || user?.isCommissioner) && trade.TradeStatus === 1 ?
                                            <Tooltip title="Reject">
                                                <IconButton color="error" onClick={() => handleReject(trade.TradeId)}>
                                                    <ThumbDown />
                                                </IconButton>
                                            </Tooltip>
                                            : null
                                        }
                                    </TableCell>
                                </TableRow> :
                                null
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Root>
    )
}

export default withAuth(LeagueTrades);