import { formatGameInfo } from "../../utils/helpers";
import { TableCell, TableRow, Typography, Link } from "@mui/material";

export default function PlayerStatisticRow({ statistic, player }) {

    return (
        <TableRow>
            <TableCell>{statistic.Game.Week}</TableCell>
            <TableCell>
                <Typography color={statistic.Game?.NotPlayed ? "error.light" : statistic.Game?.Playing ? "warning.light" : ""}>
                    <Link color="inherit" to={statistic.Game?.BoxScoreURL}>{formatGameInfo(player.Player.NflTeam?.NflTeamId, statistic.Game)}</Link>
                </Typography>
            </TableCell>
            <TableCell>
                {["TMQB", "QB"].includes(player?.Player?.Position?.PositionCode) ? statistic.PassYds ?? (statistic.Game.NotPlayed ? ' ' : 0) :
                    "RB" === player?.Player?.Position?.PositionCode ? statistic.RushYds ?? (statistic.Game.NotPlayed ? ' ' : 0) :
                        ["WR", "TE"].includes(player?.Player?.Position?.PositionCode) ? statistic.RecYds ?? (statistic.Game.NotPlayed ? ' ' : 0) :
                            ["TMPK", "PK"].includes(player?.Player?.Position?.PositionCode) ? statistic.FgYds ?? (statistic.Game.NotPlayed ? ' ' : 0) :
                                ["S", "CB", "LB", "DE", "DT"].includes(player?.Player?.Position?.PositionCode) ? statistic.Tackles ?? (statistic.Game.NotPlayed ? ' ' : 0) :
                                    " "}
            </TableCell>
            <TableCell>
                {["TMQB", "QB"].includes(player?.Player?.Position?.PositionCode) ? statistic.PassTds ?? (statistic.Game.NotPlayed ? ' ' : 0) :
                    "RB" === player?.Player?.Position?.PositionCode ? statistic.RushTds ?? (statistic.Game.NotPlayed ? ' ' : 0) :
                        ["WR", "TE"].includes(player?.Player?.Position?.PositionCode) ? statistic.RecTds ?? (statistic.Game.NotPlayed ? ' ' : 0) :
                            ["TMPK", "PK"].includes(player?.Player?.Position?.PositionCode) ? statistic.XPs ?? (statistic.Game.NotPlayed ? ' ' : 0) :
                                ["S", "CB", "LB", "DE", "DT"].includes(player?.Player?.Position?.PositionCode) ? statistic.SoloTackles ?? (statistic.Game.NotPlayed ? ' ' : 0) :
                                    " "}
            </TableCell>
            <TableCell>
                {["TMQB", "QB"].includes(player?.Player?.Position?.PositionCode) ? statistic.PassInts ?? (statistic.Game.NotPlayed ? ' ' : 0) :
                    "RB" === player?.Player?.Position?.PositionCode ? statistic.RecYds ?? (statistic.Game.NotPlayed ? ' ' : 0) :
                        ["WR", "TE"].includes(player?.Player?.Position?.PositionCode) ? statistic.RushYds ?? (statistic.Game.NotPlayed ? ' ' : 0) :
                            ["TMPK", "PK"].includes(player?.Player?.Position?.PositionCode) ? ' ' :
                                ["S", "CB", "LB", "DE", "DT"].includes(player?.Player?.Position?.PositionCode) ? statistic.Sacks ?? (statistic.Game.NotPlayed ? ' ' : 0) :
                                    " "}
            </TableCell>
            <TableCell>
                {["TMQB", "QB"].includes(player?.Player?.Position?.PositionCode) ? statistic.RushYds ?? (statistic.Game.NotPlayed ? ' ' : 0) :
                    "RB" === player?.Player?.Position?.PositionCode ? statistic.RecTds ?? (statistic.Game.NotPlayed ? ' ' : 0) :
                        ["WR", "TE"].includes(player?.Player?.Position?.PositionCode) ? statistic.RushTds ?? (statistic.Game.NotPlayed ? ' ' : 0) :
                            ["S", "CB", "LB", "DE", "DT"].includes(player?.Player?.Position?.PositionCode) ? statistic.DefInts ?? (statistic.Game.NotPlayed ? ' ' : 0) :
                                ' '}
            </TableCell>
            <TableCell>
                {["TMQB", "QB"].includes(player?.Player?.Position?.PositionCode) ? statistic.RushTds ?? (statistic.Game.NotPlayed ? ' ' : 0) :
                    ["S", "CB", "LB", "DE", "DT"].includes(player?.Player?.Position?.PositionCode) ? statistic.DefTds ?? (statistic.Game.NotPlayed ? ' ' : 0) : ' '}
            </TableCell>
        </TableRow>
    )
}