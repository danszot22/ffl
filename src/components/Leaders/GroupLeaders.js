import { useEffect, useState } from "react";
import { leaguePlayersLoader } from "../../api/graphql";
import { formatPlayerFullName } from "../../utils/helpers";
import { Card, CardContent, Table, TableRow, TableCell, TableHead, TableBody, Paper, Typography, Box, Link } from "@mui/material";
import withAuth from "../withAuth";

function GroupLeaders({ league, availability, spot }) {
    const [players, setPlayers] = useState([]);

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
        <Card sx={{ minWidth: 600 }}>
            <CardContent p={0}>
                <Paper elevation={8}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell colSpan={5}>{availability} {spot === "DF"
                                    ? "Defensive Players" :
                                    spot === "RB" ? "Running Backs" :
                                        spot === "R" ? "Receivers" :
                                            spot === "TMPK" ? "Team Kickers" :
                                                spot === "TMQB" ? "Team Quarterbacks" :
                                                    "Players"}
                                </TableCell>
                                <TableCell><Link to={`/PlayerList/1?availability=${availability}&spot=${spot}`}>View</Link></TableCell>
                                <TableCell>Points</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {players.map((player) => {
                                return (<TableRow key={player.PlayerId}>
                                    <TableCell>{player.RowNumber}</TableCell>
                                    <TableCell>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '1rem',
                                            }}
                                        >
                                            {player.PositionCode.startsWith('TM') ?
                                                <img
                                                    alt={player.DisplayCode}
                                                    height={30}
                                                    src={`https://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/${player.DisplayCode}.png&h=150&w=150`}
                                                    loading="lazy"
                                                    style={{ borderRadius: '50%' }}
                                                /> :
                                                player.EspnPlayerId ?
                                                    <img
                                                        alt="?"
                                                        height={30}
                                                        src={`https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/${player.EspnPlayerId}.png&h=120&w=120&scale=crop`}
                                                        loading="lazy"
                                                        style={{ borderRadius: '50%' }}
                                                    /> :
                                                    <img
                                                        alt="?"
                                                        height={30}
                                                        src={`https://a.espncdn.com/combiner/i?img=/i/headshots/nophoto.png&w=120&h=120&scale=crop`}
                                                        loading="lazy"
                                                        style={{ borderRadius: '50%' }}
                                                    />
                                            }
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Link to={`/Player/${player.PlayerId}`}>{formatPlayerFullName(player.PlayerName)}</Link>
                                    </TableCell>
                                    <TableCell>{player.PositionCode}</TableCell>
                                    <TableCell>{player.DisplayCode}</TableCell>
                                    <TableCell>
                                        <Typography variant="caption">
                                            {["TMQB", "QB"].includes(player.PositionCode) ? `${player.PassYds ?? 0} Yds, ${player.PassTds ?? 0} TDs, ${player.PassInts ?? 0} Ints` : ' '}
                                            {["RB"].includes(player.PositionCode) ? `${player.RushingYds ?? 0} Yds, ${player.RushingTds ?? 0} TDs` : ' '}
                                            {["WR", "TE"].includes(player.PositionCode) ? `${player.ReceivingYds ?? 0} Yds, ${player.ReceivingTds ?? 0} TDs` : ' '}
                                            {["TMPK", "PK"].includes(player.PositionCode) ? ` ${player.FGYds ?? 0} FGYds, ${player.XPs ?? 0} XPs` : ' '}
                                            {["S", "CB", "LB", "DE", "DT"].includes(player.PositionCode) ? ` ${player.Tackles ?? 0} Tckls, ${player.Sacks ?? 0} Sacks` : ' '}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{player.Points}</TableCell>
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