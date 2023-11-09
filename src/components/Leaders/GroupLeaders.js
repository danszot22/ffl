import { useEffect, useState } from "react";
import { leaguePlayersLoader } from "../../api/graphql";
import { formatPlayerFullName, formatPlayerName } from "../../utils/helpers";
import { Card, CardContent, Table, TableRow, TableCell, TableHead, TableBody, Paper, Link } from "@mui/material";
import withAuth from "../withAuth";
import PlayerImage from "../common/PlayerImage";
import FormattedPlayerStats from "../common/FormattedPlayerStats";

function GroupLeaders({ league, availability, spot }) {
    const [players, setPlayers] = useState([]);

    const formatTableHeaderText = () => {
        return spot === "DF"
            ? "Defense" :
            spot === "RB" ? "RBs" :
                spot === "R" ? "Receivers" :
                    spot === "TMPK" ? "Kickers" :
                        spot === "TMQB" ? "QBs" :
                            "Players";
    }

    useEffect(() => {
        const fetchPlayers = async () => {
            const response = await leaguePlayersLoader(league?.LeagueId, spot, availability, 1, 5, 1, "All", "All", " ", "Points", "DESC");
            setPlayers(response);
        }
        fetchPlayers();
    }, [
        availability, spot, league,
    ]);

    return (
        <Card sx={{ minWidth: { xs: 300, sm: 600 } }}>
            <CardContent p={0}>
                <Paper elevation={8}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' }, }} colSpan={5}>{availability} {formatTableHeaderText()}</TableCell>
                                <TableCell sx={{ display: { xs: 'table-cell', sm: 'none' }, }} colSpan={2}>
                                    {availability} {formatTableHeaderText()}
                                </TableCell>
                                <TableCell>
                                    <Link to={`/PlayerList/1?availability=${availability}&spot=${spot}`}>View</Link>
                                </TableCell>
                                <TableCell>Points</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {players.map((player) => {
                                return (
                                    <TableRow key={player.PlayerId}>
                                        <TableCell>{player.RowNumber}</TableCell>
                                        <TableCell>
                                            <PlayerImage positionCode={player?.PositionCode} nflTeamCode={player?.DisplayCode} espnPlayerId={player.EspnPlayerId} />
                                        </TableCell>
                                        <TableCell>
                                            <Link sx={{ display: { xs: 'block', sm: 'none' }, }} to={`/Player/${player.PlayerId}`}>{formatPlayerName(player.PlayerName, player?.PositionCode)}</Link>
                                            <Link sx={{ display: { xs: 'none', sm: 'block' }, }} to={`/Player/${player.PlayerId}`}>{formatPlayerFullName(player.PlayerName)}</Link>
                                        </TableCell>
                                        <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' }, }} >{player.PositionCode}</TableCell>
                                        <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' }, }} >{player.DisplayCode}</TableCell>
                                        <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' }, }} >
                                            <FormattedPlayerStats player={player} />
                                        </TableCell>
                                        <TableCell>
                                            {player.Points}
                                            <FormattedPlayerStats player={player} sx={{ display: { xs: 'block', sm: 'none' }, }} />
                                        </TableCell>
                                    </TableRow>)
                            })}
                        </TableBody>
                    </Table>
                </Paper>
            </CardContent>
        </Card>
    )
}

export default withAuth(GroupLeaders);