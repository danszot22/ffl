import { useEffect, useState } from "react";
import { teamTradesLoader } from "../../api/graphql";
import Root from "../Root";
import PageToolbar from "../common/PageToolbar";
import { Button, IconButton, Paper, Tooltip, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { convertDateToLocal, formatFantasyTeamName, formatPlayerFullName, formatPlayerName, tradeStatuses } from "../../utils/helpers";
import { Delete, ThumbDown, ThumbUp } from "@mui/icons-material";
import withAuth from "../withAuth";

function TeamTrades({ team }) {
    const theme = useTheme();
    const isBelowMedium = useMediaQuery(theme.breakpoints.down('md'));
    const [trades, setTrades] = useState([]);

    useEffect(() => {
        const fetchTrades = async (teamId) => {
            const tradeResponse = await teamTradesLoader(teamId);
            setTrades(tradeResponse);
        }
        fetchTrades(team?.TeamId);
    }, [
        team?.TeamId,
    ]);

    const handleDelete = (id) => {
        const updatedTrades = trades.filter((trade) => {
            return trade.TradeId !== id;
        });
        setTrades(updatedTrades);
        //TODO : Call API
    };
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
            <PageToolbar title={'Team Trades'} />
            <TableContainer component={Paper}>
                <Table size="small" aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                                Trade Date
                            </TableCell>
                            <TableCell colSpan={2}>
                                <Button variant="contained" to="/ProposeTrade">
                                    Propose Trade
                                </Button>
                            </TableCell>
                            <TableCell>
                                Status
                            </TableCell>
                            <TableCell>

                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {trades?.map((trade) => (
                            <TableRow key={trade.TradeId}>
                                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                                    {convertDateToLocal(trade.TradeDate).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    {formatFantasyTeamName(trade.GivingTeam, isBelowMedium)}
                                    {trade.TradeDetails.items?.map((detail) =>
                                        <Typography variant="caption" component="div" >
                                            {isBelowMedium ? formatPlayerName(detail.GivingRosterPlayer.Player.Name, detail.GivingRosterPlayer.Player.Position.PositionCode) : formatPlayerFullName(detail.GivingRosterPlayer.Player.Name)} {detail.GivingRosterPlayer.Player.Position.PositionCode} {detail.GivingRosterPlayer.Player.NflTeam.DisplayCode}
                                        </Typography>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {formatFantasyTeamName(trade.ReceivingTeam, isBelowMedium)}
                                    {trade.TradeDetails.items?.map((detail) =>
                                        <Typography variant="caption" component="div" >
                                            {isBelowMedium ? formatPlayerName(detail.ReceivingRosterPlayer.Player.Name, detail.ReceivingRosterPlayer.Player.Position.PositionCode) : formatPlayerFullName(detail.ReceivingRosterPlayer.Player.Name)} {detail.ReceivingRosterPlayer.Player.Position.PositionCode} {detail.ReceivingRosterPlayer.Player.NflTeam.DisplayCode}
                                        </Typography>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Typography sx={{ display: { xs: 'block', md: 'none' } }}>
                                        {convertDateToLocal(trade.TradeDate).toLocaleDateString()}
                                    </Typography>
                                    {tradeStatuses[trade.TradeStatus]}
                                </TableCell>
                                <TableCell>
                                    {team?.TeamId === trade.GivingTeam?.TeamId ?
                                        <Tooltip title="Delete">
                                            <IconButton color="error" onClick={() => handleDelete(trade.TradeId)}>
                                                <Delete />
                                            </IconButton>
                                        </Tooltip>
                                        : null
                                    }
                                    {team?.TeamId === trade.ReceivingTeam?.TeamId && trade.TradeStatus === 0 ?
                                        <Tooltip title="Accept">
                                            <IconButton color="success" onClick={() => handleAccept(trade.TradeId)}>
                                                <ThumbUp />
                                            </IconButton>
                                        </Tooltip>
                                        : null
                                    }
                                    {team?.TeamId === trade.ReceivingTeam?.TeamId && trade.TradeStatus === 0 ?
                                        <Tooltip title="Reject">
                                            <IconButton color="error" onClick={() => handleReject(trade.TradeId)}>
                                                <ThumbDown />
                                            </IconButton>
                                        </Tooltip>
                                        : null
                                    }
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Root>
    )
}

export default withAuth(TeamTrades);