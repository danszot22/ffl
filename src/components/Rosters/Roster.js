import { Paper, Link } from "@mui/material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { formatPlayerFullName } from "../../utils/helpers";

export default function Roster({ roster }) {

    return (
        <TableContainer sx={{ maxWidth: 400, m: 1 }} component={Paper}>
            <Table size="small" aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell colSpan={4}>
                            <Link to={`/Team/${roster?.team.TeamId}`} >{roster?.team?.TeamName} ({roster?.team?.OwnerName})</Link>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {roster?.Players.map((player) => (
                        <TableRow key={player.PlayerId}>
                            <TableCell>{player.PositionCode}</TableCell>
                            <TableCell>
                                {player?.PositionCode?.startsWith('TM') ?
                                    <img
                                        alt={player?.DisplayCode}
                                        height={50}
                                        src={`https://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/${player?.DisplayCode}.png&h=150&w=150`}
                                        loading="lazy"
                                        style={{ borderRadius: '50%' }}
                                    /> : player.EspnPlayerId ?
                                        <img
                                            alt="?"
                                            height={50}
                                            src={`https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/${player.EspnPlayerId}.png&h=120&w=120&scale=crop`}
                                            loading="lazy"
                                            style={{ borderRadius: '50%' }}
                                        /> :
                                        <img
                                            alt="?"
                                            height={50}
                                            src={`https://a.espncdn.com/combiner/i?img=/i/headshots/nophoto.png&w=120&h=120&scale=crop`}
                                            loading="lazy"
                                            style={{ borderRadius: '50%' }}
                                        />
                                }
                            </TableCell>
                            <TableCell>
                                <Link to={`/Player/${player.PlayerId}`} >{formatPlayerFullName(player.PlayerName)}</Link>
                            </TableCell>
                            <TableCell>{player.Name}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>)
}