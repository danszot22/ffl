import { Typography, Link } from "@mui/material";
import { TableBody, TableCell, TableRow } from "@mui/material";
import { formatGameInfo, formatPlayerFullName } from "../../utils/helpers";

export default function LineupPlayers({ players }) {

    return (
        <TableBody>
            {players.map((player) => (
                <TableRow key={player.RosterPlayer.RosterPlayerId}>
                    <TableCell>{player.RosterPlayer.Player.Position.PositionCode}</TableCell>
                    <TableCell>
                        {player.RosterPlayer.Player.Position.PositionCode?.startsWith('TM') ?
                            <img
                                alt={player.RosterPlayer.Player.NflTeam?.DisplayCode}
                                height={50}
                                src={`https://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/${player.RosterPlayer.Player.NflTeam?.DisplayCode}.png&h=150&w=150`}
                                loading="lazy"
                                style={{ borderRadius: '50%' }}
                            /> : player.RosterPlayer.Player.EspnPlayerId ?
                                <img
                                    alt="?"
                                    height={50}
                                    src={`https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/${player.RosterPlayer.Player.EspnPlayerId}.png&h=120&w=120&scale=crop`}
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
                    <TableCell><Link to={`/Player/${player.RosterPlayer.PlayerId}`} >{formatPlayerFullName(player.RosterPlayer.Player.Name)}</Link></TableCell>
                    <TableCell>{player.RosterPlayer.Player.NflTeam?.DisplayCode}</TableCell>
                    <TableCell>
                        <Typography color={player.NflGame?.NotPlayed ? "error.light" : player.NflGame?.Playing ? "warning.light" : ""}>
                            <Link color="inherit" to={player.NflGame?.BoxScoreURL}> {formatGameInfo(player.RosterPlayer.Player.NflTeam?.NflTeamId, player.NflGame)}</Link>
                        </Typography>
                    </TableCell>
                    <TableCell>
                        {player.NflGame.NotPlayed ? (
                            <Typography>
                                Proj:
                                {["TMQB", "QB"].includes(player.RosterPlayer.Player.Position.PositionCode) ? ` ${player.ProjPassYds ?? 0} Yds, ${player.ProjPassTds ?? 0} TDs, ${player.ProjPassInts ?? 0} Ints` : ' '}
                                {["RB"].includes(player.RosterPlayer.Player.Position.PositionCode) ? `${player.ProjRushYds ?? 0} Yds, ${player.ProjRushTds ?? 0} TDs` : ' '}
                                {["WR", "TE"].includes(player.RosterPlayer.Player.Position.PositionCode) ? `${player.ProjRecYds ?? 0} Yds, ${player.ProjRecTds ?? 0} TDs` : ' '}
                                {["TMPK", "PK"].includes(player.RosterPlayer.Player.Position.PositionCode) ? ` ${player.ProjFgYds ?? 0} FGYds, ${player.ProjXPs ?? 0} XPs` : ' '}
                                {["S", "CB", "LB", "DE", "DT"].includes(player.RosterPlayer.Player.Position.PositionCode) ? ` ${player.ProjTackles ?? 0} Tcks, ${player.ProjSacks ?? 0} Sacks` : ' '}
                            </Typography>
                        ) : <Typography>
                            {["QB"].includes(player.RosterPlayer.Player.Position.PositionCode) ? `${player.PassYds ?? 0} Yds, ${player.PassTds ?? 0} TDs, ${player.PassInts ?? 0} Ints` : ' '}
                            {["RB"].includes(player.RosterPlayer.Player.Position.PositionCode) ? `${player.RushYds ?? 0} Yds, ${player.RushTds ?? 0} TDs` : ' '}
                            {["WR", "TE"].includes(player.RosterPlayer.Player.Position.PositionCode) ? `${player.RecYds ?? 0} Yds, ${player.RecTds ?? 0} TDs` : ' '}
                            {["PK"].includes(player.RosterPlayer.Player.Position.PositionCode) ? ` ${player.FgYds ?? 0} FGYds, ${player.XPs ?? 0} XPs` : ' '}
                            {["S", "CB", "LB", "DE", "DT"].includes(player.RosterPlayer.Player.Position.PositionCode) ? ` ${player.Tackles ?? 0} Tckls, ${player.Sacks ?? 0} Sacks` : ' '}
                        </Typography>}

                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    );
}