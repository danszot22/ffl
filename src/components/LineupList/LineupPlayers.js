import { Typography, Link, useTheme, useMediaQuery } from "@mui/material";
import { TableBody, TableCell, TableRow } from "@mui/material";
import { formatGameInfo } from "../../utils/helpers";
import PlayerImage from "../common/PlayerImage";
import PlayerLink from "../common/PlayerLink";

function PlayerStats({ player, sx, variant }) {

    return (
        player.NflGame.NotPlayed ? (
            <Typography sx={sx} variant={variant}>
                Proj:
                {["TMQB", "QB"].includes(player.RosterPlayer.Player.Position.PositionCode) ? ` ${player.ProjPassYds ?? 0} Yds, ${player.ProjPassTds ?? 0} TDs, ${player.ProjPassInts ?? 0} Ints` : ' '}
                {["RB"].includes(player.RosterPlayer.Player.Position.PositionCode) ? `${player.ProjRushYds ?? 0} Yds, ${player.ProjRushTds ?? 0} TDs` : ' '}
                {["WR", "TE"].includes(player.RosterPlayer.Player.Position.PositionCode) ? `${player.ProjRecYds ?? 0} Yds, ${player.ProjRecTds ?? 0} TDs` : ' '}
                {["TMPK", "PK"].includes(player.RosterPlayer.Player.Position.PositionCode) ? ` ${player.ProjFgYds ?? 0} FGYds, ${player.ProjXPs ?? 0} XPs` : ' '}
                {["S", "CB", "LB", "DE", "DT"].includes(player.RosterPlayer.Player.Position.PositionCode) ? ` ${player.ProjTackles ?? 0} Tcks, ${player.ProjSacks ?? 0} Sacks` : ' '}
            </Typography>
        ) : <Typography sx={sx} variant={variant}>
            {["QB"].includes(player.RosterPlayer.Player.Position.PositionCode) ? `${player.PassYds ?? 0} Yds, ${player.PassTds ?? 0} TDs, ${player.PassInts ?? 0} Ints` : ' '}
            {["RB"].includes(player.RosterPlayer.Player.Position.PositionCode) ? `${player.RushYds ?? 0} Yds, ${player.RushTds ?? 0} TDs` : ' '}
            {["WR", "TE"].includes(player.RosterPlayer.Player.Position.PositionCode) ? `${player.RecYds ?? 0} Yds, ${player.RecTds ?? 0} TDs` : ' '}
            {["PK"].includes(player.RosterPlayer.Player.Position.PositionCode) ? ` ${player.FgYds ?? 0} FGYds, ${player.XPs ?? 0} XPs` : ' '}
            {["S", "CB", "LB", "DE", "DT"].includes(player.RosterPlayer.Player.Position.PositionCode) ? ` ${player.Tackles ?? 0} Tckls, ${player.Sacks ?? 0} Sacks` : ' '}
        </Typography>
    )
}

export default function LineupPlayers({ players }) {
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.only('xs'));

    return (
        <TableBody>
            {players.map((player) => (
                <TableRow key={player.RosterPlayer.RosterPlayerId}>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }, }}>
                        {player.RosterPlayer.Player.Position.PositionCode}
                    </TableCell>
                    <TableCell>
                        <PlayerImage positionCode={player.RosterPlayer.Player.Position.PositionCode}
                            nflTeamCode={player.RosterPlayer.Player.NflTeam?.DisplayCode}
                            espnPlayerId={player.RosterPlayer.Player.EspnPlayerId}
                            height={50} />
                    </TableCell>
                    <TableCell>
                        <PlayerLink playerId={player.RosterPlayer.PlayerId} playerName={player.RosterPlayer.Player.Name} positionCode={player.RosterPlayer.Player.Position.PositionCode} />
                        <Typography variant="caption" sx={{ display: { xs: 'block', sm: 'none' }, }}>
                            {`${player.RosterPlayer.Player.Position.PositionCode} ${player.RosterPlayer.Player.NflTeam?.DisplayCode}`}
                        </Typography>
                    </TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }, }}>
                        {player.RosterPlayer.Player.NflTeam?.DisplayCode}
                    </TableCell>
                    <TableCell>
                        <Typography variant={isXs ? "caption" : " "} color={player.NflGame?.NotPlayed ? "error.light" : player.NflGame?.Playing ? "warning.light" : ""}>
                            <Link color="inherit" to={player.NflGame?.BoxScoreURL}> {formatGameInfo(player.RosterPlayer.Player.NflTeam?.NflTeamId, player.NflGame)}</Link>
                        </Typography>
                        <PlayerStats player={player} sx={{ display: { xs: 'block', md: 'none' }, }} variant="caption" />
                    </TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }, }}>
                        <PlayerStats player={player} />
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    );
}